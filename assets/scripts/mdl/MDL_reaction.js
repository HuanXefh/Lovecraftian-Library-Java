/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods to process reactions (mostly chemical) between resource.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- auxiliary ----------> */


  function _isReac(reac) {
    return typeof reac === "string" && (reac.startsWith("GROUP: ") || reac.startsWith("ITEMGROUP: ") || reac.startsWith("CONST: "));
  };


  const reactionCache = new ObjectMap();
  exports.reactionCache = reactionCache;


  const grpBitsetMapTup = (function() {
    const itmMap = new ObjectMap();
    const liqMap = new ObjectMap();

    MDL_event._c_onLoad(() => {
      Time.run(5.0, () => {
        DB_reaction.db["groupCond"].forEachRow(2, (grp, boolF) => {
          let itmBitset = new Bits(), liqBitset = new Bits();
          Vars.content.items().each(boolF, rs => itmBitset.set(rs.id));
          Vars.content.liquids().each(boolF, rs => liqBitset.set(rs.id));
          itmMap.put(grp, itmBitset);
          liqMap.put(grp, liqBitset);
        });
      });
    });

    return [itmMap, liqMap];
  })();


  /* <---------- parameter ----------> */


  /**
   * Gets a list of reaction groups for some reactant.
   * @param {string|UnlockableContent} reac
   * @param {Array|unset} [contArr]
   * @return {Array<string>}
   */
  const _reacGrps = function(reac, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    !(reac instanceof UnlockableContent) ?
      arr.push(reac) :
      grpBitsetMapTup[(reac instanceof Item ? 0 : 1)].each((grp, bitset) => {
        if(bitset.get(reac.id)) arr.push(grp);
      });

    return arr;
  };
  exports._reacGrps = _reacGrps;


  /**
   * Reads possible reactions between `reac1` and `reac2`.
   * @param {string|UnlockableContent} reac1
   * @param {string|UnlockableContent} reac2
   * @return {Array} <ROW>: reacType, paramObj.
   */
  const _reactions = function thisFun(reac1, reac2) {
    const arr = [];

    let grps1 = _reacGrps(reac1, thisFun.grpsCaches[0]);
    let grps2 = _reacGrps(reac2, thisFun.grpsCaches[1]);

    Array.forEachPair(grps1, grps2, (grp1, grp2) => {
      thisFun.tmpTup.clear().push(grp1, grp2);
      arr.pushNonNull(DB_reaction.db["fluid"].read(thisFun.tmpTup, null, true));
      arr.pushNonNull(DB_reaction.db["item"].read(thisFun.tmpTup, null, true));
    });

    return arr;
  }
  .setProp({
    tmpTup: [],
    grpsCaches: [[], []],
  })
  .setCache(reactionCache);
  exports._reactions = _reactions;


  /* <---------- application ----------> */


  /**
   * Actually calls given reactions.
   * Called on sever side only for sync.
   * @param {Array} reactions
   * @param {number} pMtp
   * @param {number} x
   * @param {number} y
   * @param {Building|Unit|unset} [e] - Entity involved, like a building where reaction happens.
   * @param {ResourceGn|unset} [rs_gn] - Resource involved.
   * @return {void}
   */
  const applyReaction = function(reactions, pMtp, x, y, e, rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");

    let tup;
    reactions.forEachFast(tup0 => {
      tup = DB_reaction.db["reaction"].read(tup0[0]);
      if(tup == null) return;
      if(!Mathf.chance(tup[0] * pMtp)) return;

      tup[1](tup0[1], x, y, e, rs);
    });
  }
  .setAnno("server");
  exports.applyReaction = applyReaction;


  /**
   * Request the host to apply some reactions.
   * @param {Array} reactions
   * @param {number} pMtp
   * @param {number} x
   * @param {number} y
   * @param {Building|Unit|unset} [e]
   * @param {ResourceGn|unset} [rs_gn]
   * @return {void}
   */
  const requestReaction = function(reactions, pMtp, x, y, e, rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");

    MDL_net.sendPacket(
      "client", "lovec-client-reaction",
      packPayload([
        reactions, pMtp, x, y,
        e == null ? -1 : e.pos(),
        rs == null ? "null" : rs.name,
      ]),
      true, true,
    );
  }
  .setAnno("init", function() {
    MDL_net.__packetHandler("server", "lovec-client-reaction", payload => {
      let args = unpackPayload(payload);
      applyReaction(args[0], args[1], args[2], args[3], Vars.world.build(args[4]), args[5]);
    });
  })
  .setAnno("client")
  .setAnno("non-console");
  exports.requestReaction = requestReaction;


  /**
   * Calls possible reactions between `reac1` and `reac2` at `t0e`.
   * @param {string|UnlockableContent} reac1
   * @param {string|UnlockableContent} reac2
   * @param {number} pMtp
   * @param {Tile|Building|Unit|unset} [t0e]
   * @return {void}
   */
  const handleReaction = function(reac1, reac2, pMtp, t0e) {
    applyReaction(
      _reactions(reac1, reac2),
      pMtp,
      t0e instanceof Tile ? t0e.worldx() : t0e.x,
      t0e instanceof Tile ? t0e.worldy() : t0e.y,
      t0e instanceof Tile ? null : t0e,
      _isReac(reac1) ? null : reac1,
    );
  };
  exports.handleReaction = handleReaction;


  /**
   * Variant of {@link handleReaction} for sync.
   * @param {string|UnlockableContent} reac1
   * @param {string|UnlockableContent} reac2
   * @param {number} pMtp
   * @param {Tile|Building|Unit|unset} [t0e]
   * @return {void}
   */
  const handleReaction_global = function(reac1, reac2, pMtp, t0e) {
    if(!Vars.net.client()) {
      handleReaction(reac1, reac2, pMtp, t0e);
    } else {
      requestReaction(
        _reactions(reac1, reac2),
        pMtp,
        t0e instanceof Tile ? t0e.worldx() : t0e.x,
        t0e instanceof Tile ? t0e.worldy() : t0e.y,
        t0e instanceof Tile ? null : t0e,
        _isReac(reac1) ? null : reac1,
      );
    };
  }
  .setAnno("non-console");
  exports.handleReaction_global = handleReaction_global;
