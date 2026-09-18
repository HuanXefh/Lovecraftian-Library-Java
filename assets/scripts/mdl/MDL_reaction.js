/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Methods to process reactions (mostly chemical) between resource.
     * @module lovec/mdl/MDL_reaction
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ auxiliary ------------------------------ */


    /**
     * @param {Reactant} reac
     * @return {boolean}
     */
    function checkStrReac(reac) {
        return typeof reac === "string" && reac.startsWithAny(
            "GROUP: ",
            "ITEMGROUP: ",
            "MATERIAL: ",
            "CONST: ",
        );
    };


    /** @type {ObjectMap<string, ReactionResult>} */
    const reactionCache = new ObjectMap();
    exports.reactionCache = reactionCache;


    /** @type {[ObjectMap<string, Bits>, ObjectMap<string, Bits>]} */
    const grpBitsetMapTup = (function() {
        let itemMap = new ObjectMap();
        let liqMap = new ObjectMap();
        MDL_event.onLoadDelayTask(VAR.delay.load.loadReacGrp, () => {
            let itemBitset, liqBitset;
            DB_reaction.db["groupCond"].forEachRow(2, (grp, boolF) => {
                itemBitset = new Bits();
                liqBitset = new Bits();
                Vars.content.items().each(boolF, rs => itemBitset.set(rs.id));
                Vars.content.liquids().each(boolF, rs => liqBitset.set(rs.id));
                itemMap.put(grp, itemBitset);
                liqMap.put(grp, liqBitset);
            }, true);
        });
        return [itemMap, liqMap];
    })();


    /* <------------------------------ parameter ------------------------------ */


    /**
     * Gets a list of reaction groups for some reactant.
     * @param {Array|unset} contArr
     * @param {Reactant} reac
     * @return {Array<string>}
     * @lovecTypeSensitive
     */
    const getReacGrps = function(contArr, reac) {
      let arr = contArr != null ? contArr.clear() : [];

      !(reac instanceof UnlockableContent) ?
          arr.push(reac) :
          grpBitsetMapTup[(reac instanceof Item ? 0 : 1)].each((grp, bitset) => {
              if(bitset.get(reac.id)) arr.push(grp);
          });

      return arr;
    };
    exports.getReacGrps = getReacGrps;


    /**
     * Reads possible reactions between `reac1` and `reac2`.
     * @param {Reactant} reac1
     * @param {Reactant} reac2
     * @return {ReactionResult}
     * @lovecTypeSensitive
     */
    const getReactions = function thisFun(reac1, reac2) {
        let arr = [];

        if(typeof reac1 === "string" && reac1.startsWith("MATERIAL: ")) {
            // Material-type reaction
            reac1 = reac1.replace("MATERIAL: ", "");
            let grps = getReacGrps(thisFun.grpsCaches[1], reac2);
            grps.forEachFast(grp => {
                thisFun.tmpTup.with(reac1, grp);
                arr.pushNonNull(DB_reaction.db["material"].read(thisFun.tmpTup, null, false));
            }, true);
        } else {
            // Regular reaction
            let grps1 = getReacGrps(thisFun.grpsCaches[0], reac1);
            let grps2 = getReacGrps(thisFun.grpsCaches[1], reac2);

            Array.forEachPair(grps1, grps2, (grp1, grp2) => {
                thisFun.tmpTup.with(grp1, grp2);
                arr.pushNonNull(DB_reaction.db["fluid"].read(thisFun.tmpTup, null, true));
                arr.pushNonNull(DB_reaction.db["item"].read(thisFun.tmpTup, null, true));
            }, true);
        };

        return arr;
    }
    .setProp({
        /**
         * @memberof getReactions
         * @type {[string, string]}
         */
        tmpTup: [],
        /**
         * @memberof getReactions
         * @type {[Array<string>, Array<string>]}
         */
        grpsCaches: [[], []],
    })
    .setCache(reactionCache);
    exports.getReactions = getReactions;


    /* <------------------------------ application ------------------------------ */


    /**
     * Actually calls given reactions.
     * Called on sever side only for sync.
     * @param {ReactionResult} reactions
     * @param {number} pMtp
     * @param {number} x
     * @param {number} y
     * @param {ReactionEntity|unset} [e]
     * @param {ResourceGn|unset} [rs_gn]
     * @return {void}
     */
    const applyReaction = function(reactions, pMtp, x, y, e, rs_gn) {
        let rs = MDL_content.getCt(rs_gn, ContentGetModes.RS);
        let reacTup;
        reactions.forEachFast(resultTup => {
            reacTup = DB_reaction.db["reaction"].read(resultTup[0]);
            if(reacTup == null || !Mathf.chance(reacTup[0] * pMtp)) return;
            reacTup[1](resultTup[1], x, y, e, rs);
        }, true);
    }
    .setAnno("server");
    exports.applyReaction = applyReaction;


    /**
     * Request the host to apply some reactions.
     * @param {Array} reactions
     * @param {number} pMtp
     * @param {number} x
     * @param {number} y
     * @param {ReactionEntity|unset} [e]
     * @param {ResourceGn|unset} [rs_gn]
     * @return {void}
     */
    const requestReaction = function(reactions, pMtp, x, y, e, rs_gn) {
        let rs = MDL_content.getCt(rs_gn, ContentGetModes.RS);
        MDL_net.sendPacket(
            PacketModes.SERVER, "lovec-client-reaction",
            packPayload([
                reactions, pMtp, x, y,
                e == null ? -1 : e.pos(),
                rs == null ? "null" : rs.name,
            ]),
            true,
        );
    }
    .setAnno("init", function() {
        MDL_net.addPacketHandler(PacketModes.SERVER, "lovec-client-reaction", payload => {
            let args = unpackPayload(payload);
            applyReaction(args[0], args[1], args[2], args[3], Vars.world.build(args[4]), args[5]);
        });
    })
    .setAnno("client");
    exports.requestReaction = requestReaction;


    /**
     * Calls possible reactions between `reac1` and `reac2` at `t0e`.
     * @param {Reactant} reac1
     * @param {Reactant} reac2
     * @param {number} pMtp
     * @param {Tile|ReactionEntity|unset} [bearer]
     * @return {void}
     * @lovecTypeSensitive
     */
    const handleReaction = function(reac1, reac2, pMtp, bearer) {
        applyReaction(
            getReactions(reac1, reac2),
            pMtp,
            bearer instanceof Tile ? bearer.worldx() : bearer.x,
            bearer instanceof Tile ? bearer.worldy() : bearer.y,
            bearer instanceof Tile ? null : bearer,
            checkStrReac(reac1) ? null : reac1,
        );
    };
    exports.handleReaction = handleReaction;


    /**
     * Variant of {@link handleReaction} for sync.
     * @param {Reactant} reac1
     * @param {Reactant} reac2
     * @param {number} pMtp
     * @param {Tile|ReactionEntity|unset} [bearer]
     * @return {void}
     * @lovecTypeSensitive
     */
    const handleReaction_global = function(reac1, reac2, pMtp, bearer) {
        if(!Vars.net.client()) {
            handleReaction(reac1, reac2, pMtp, t0e);
        } else {
            requestReaction(
                getReactions(reac1, reac2),
                pMtp,
                bearer instanceof Tile ? bearer.worldx() : bearer.x,
                bearer instanceof Tile ? bearer.worldy() : bearer.y,
                bearer instanceof Tile ? null : bearer,
                checkStrReac(reac1) ? null : reac1,
            );
        };
    };
    exports.handleReaction_global = handleReaction_global;
