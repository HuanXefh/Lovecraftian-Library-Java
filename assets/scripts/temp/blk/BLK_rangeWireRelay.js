/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<PowerNode, BLK_rangeWireRelay>} BLKRangeWireRelay
     */


    /**
     * @typedef {TemplateInstance<PowerNode.PowerNodeBuild, B_rangeWireRelay>} BRangeWireRelay
     * @prop {BLKRangeWireRelay} block
     */


    const PARENT = require("lovec/temp/blk/BLK_basePowerTransmitter");
    const INTF_BLK_rangeDisplay = require("lovec/temp/intf/INTF_BLK_rangeDisplay");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKRangeWireRelay} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.consumesPower = true;
        blk.conductivePower = true;
        blk.connectedPower = false;
        blk.update = true;
        blk.configurable = false;
        blk.swapDiagonalPlacement = false;
        blk.maxNodes = Number.intMax;

        blk.clipSize = Math.max(blk.clipSize, (blk.size * 0.5 + blk.delegee.blkR) * Vars.tilesize);

        if(blk.delegee.rangeFadeEff == null) {
            let len = blk.size * Vars.tilesize * 0.15;
            let rad = blk.size * Vars.tilesize * 0.6;
            blk.delegee.rangeFadeEff = new MultiEffect(
                TP_effect.fadeSquare({
                    r: blk.size * 0.5 + blk.delegee.blkR,
                    color: GLB_color.accent,
                    a: 0.125,
                    scl: 2.5,
                    z: GLB_var.layer.p3dRange,
                }),
                new SeqEffect(
                    TP_effect.sparkLine({
                        amt: 4,
                        len: len,
                        rad: rad,
                        color: GLB_color.accent,
                        scl: 1.8,
                    }),
                    TP_effect.sparkLine({
                        amt: 4,
                        len: len,
                        rad: rad,
                        color: GLB_color.accent,
                        scl: 1.8,
                    }),
                    TP_effect.sparkLine({
                        amt: 4,
                        len: len,
                        rad: rad,
                        color: GLB_color.accent,
                        scl: 1.8,
                    }),
                ),
            );
        };
    };


    /**
     * @private
     * @param {BLKRangeWireRelay} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.remove(Stat.powerRange);
        stats.remove(Stat.powerConnections);
        stats.add(Stat.powerRange, blk.delegee.blkR, StatUnit.blocks);
    };


    /**
     * @private
     * @param {BLKRangeWireRelay} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        blk.removeBar("connections");
    };


    /**
     * @private
     * @param {BLKRangeWireRelay} blk
     * @param {BRangeWireRelay} b
     * @param {Building} b_t
     * @return {boolean}
     */
    function comp_linkValid(blk, b, b_t) {
        return b_t.team === b.team && b_t.block.consumesPower
            && !checkSubInsOfTemp(b_t, "B_basePowerTransmitter") && !checkSubInsOfTemp(b_t, "B_fluidPipe")
            && Math.max(Math.abs(b_t.x - b.x), Math.abs(b_t.y - b.y)) <= (blk.size * 0.5 + blk.delegee.blkR) * Vars.tilesize + 0.01;
    };


    /**
     * @private
     * @param {BLKRangeWireRelay} blk
     * @param {Tile} t
     * @param {Team} team
     * @param {Cons<Building>} callback
     * @return {void}
     */
    function comp_getPotentialLinks(blk, t, team, callback) {
        blk.delegee.tmpLinkSeq.clear();
        blk.delegee.tmpGraphSet.clear();

        let
            hw = (blk.size * 0.5 + blk.delegee.blkR) * Vars.tilesize,
            tree = team.data().buildingTree,
            ot;

        Edges.getEdges(blk.size).forEachFast(pon => {
            ot = t.nearby(pon);
            if(ot != null && ot.build != null && ot.build.team === team && ot.build.power != null) {
                blk.delegee.tmpGraphSet.add(ot.build.power.graph);
            };
        }, true);
        if(t.build != null && t.build.power != null) {
            blk.delegee.tmpGraphSet.add(t.build.power.graph);
        };

        if(tree != null) {
            tree.intersect(t.x.toFCoord(blk.size) - hw, t.y.toFCoord(blk.size) - hw, hw * 2.0, hw * 2.0, cons(ob => {
                blk.delegee.tmpLinkSeq.add(ob);
            }));
        };

        blk.delegee.tmpLinkSeq.each(
            ob => ob != null && ob.tile !== t
                && ob.power != null && ob.block.consumesPower
                && !checkSubInsOfTemp(ob, "B_basePowerTransmitter") && !checkSubInsOfTemp(ob, "B_fluidPipe")
                && Math.max(Math.abs(ob.x - t.x.toFCoord(blk.size)), Math.abs(ob.y - t.y.toFCoord(blk.size))) <= (blk.size * 0.5 + blk.delegee.blkR) * Vars.tilesize + 0.01
                && !blk.delegee.tmpGraphSet.contains(ob.power.graph)
                && !PowerNode.insulated(t, ob.tile)
                && !Edges.getEdges(blk.size).some(pon => {
                    ot = t.nearby(pon);
                    return ot != null && ot.build === ob;
                }),
            ob => {
                blk.delegee.tmpGraphSet.add(ob.power.graph);
                callback.get(ob);
            },
        );
    };


    /**
     * @private
     * @param {BRangeWireRelay} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(GLB_timer.secThree) {
            b.self.ex_refreshLinks();
            if(b.power.status > 0.1) {
                b.block.delegee.rangeFadeEff.at(b);
            };
        };
    };


    /**
     * @private
     * @param {BRangeWireRelay} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        let ob;
        b.power.links.each(posInt => {
            ob = GLB_var.world.build(posInt);
            if(ob != null) {
                Tmp.c1.set(GLB_color.accent);
                Tmp.c1.a = Mathf.absin(4.0, 1.0);
                Drawf.selected(ob, Tmp.c1);
            };
        });
    };


    /**
     * @private
     * @param {BRangeWireRelay} b
     * @return {void}
     */
    function comp_ex_refreshLinks(b) {
        b.delegee.tmpLinkPosSeq.clear();
        b.delegee.lastLinkIntSeq.clear();
        b.delegee.lastLinkIntSeq.addAll(b.power.links);
        b.delegee.lastLinkIntSeq.each(posIns => {
            b.configureAny(posIns.toInt());
        });
        b.block.getPotentialLinks(b.tile, b.team, ob => {
            if(!PowerNode.insulated(b, ob)) {
                b.delegee.tmpLinkPosSeq.add(new Point2(ob.tileX() - b.tileX(), ob.tileY() - b.tileY()));
            };
        });
        b.configureAny(b.delegee.tmpLinkPosSeq.toArray(Point2));
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Supplies power for power consumers in a rectangular range.
         * <br> `laserRange` is not used!
         * @class BLK_rangeWireRelay
         * @extends BLK_basePowerTransmitter
         * @extends INTF_BLK_rangeDisplay
         */
        newClass()
        .extendClass(PARENT[0], "BLK_rangeWireRelay")
        .implement(INTF_BLK_rangeDisplay[0])
        .initTemplate()
        .setParent(PowerNode)
        .setTags()
        .setParam({


            /**
             * `PARAM`: Effect used to display range. Use null for default effect.
             * @memberof BLK_rangeWireRelay
             * @instance
             * @type {Effect}
             * @default null
             */
            rangeFadeEff: null,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_rangeWireRelay
             * @instance
             * @type {TDynamic<Seq<Building>>}
             */
            tmpLinkSeq: tprov(() => new Seq()),
            /**
             * `INTERNAL`
             * @memberof BLK_rangeWireRelay
             * @instance
             * @type {TDynamic<ObjectSet<PowerGraph>>}
             */
            tmpGraphSet: tprov(() => new ObjectSet()),


            /* <------------------------------ vanilla ------------------------------> */


            laserRange: 0.0,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            setBars: function() {
                comp_setBars(this);
            },


            changePlacementPath: function(ponSeq, rot) {
                Placement.calculateNodes(ponSeq, this, rot, (pon, opon) => Mathf.mod(rot, 2) === 0 ?
                    Math.abs(pon.x - opon.x) <= (this.size + this.delegee.blkR * 2) :
                    Math.abs(pon.y - opon.y) <= (this.size + this.delegee.blkR * 2)
                );
            }
            .setProp({
                noSuper: true,
            }),


            linkValid: function(b, b_t) {
                return comp_linkValid(this, b, b_t);
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
            }),


            getPotentialLinks: function(t, team, callback) {
                comp_getPotentialLinks(this, t, team, callback);
            }
            .setProp({
                noSuper: true,
            }),


            drawPlace: function(tx, ty, rot, valid) {
                // Do nothing
            }
            .setProp({
                noSuper: true,
            }),


        }),


        /**
         * @class B_rangeWireRelay
         * @extends B_basePowerTransmitter
         * @extends INTF_B_rangeDisplay
         */
        newClass()
        .extendClass(PARENT[1], "B_rangeWireRelay")
        .implement(INTF_BLK_rangeDisplay[1])
        .initTemplate()
        .setParent(PowerNode.PowerNodeBuild)
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_rangeWireRelay
             * @instance
             * @type {TDynamic<Seq<Point2>>}
             */
            tmpLinkPosSeq: tprov(() => new Seq()),
            /**
             * `INTERNAL`
             * @memberof B_rangeWireRelay
             * @instance
             * @type {TDynamic<IntSeq>}
             */
            lastLinkIntSeq: tprov(() => new IntSeq()),


        })
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            },


            onConfigureBuildTapped: function(ob) {
                return true;
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
            }),


            draw: function() {
                // No super
            }
            .setProp({
                noSuper: true,
            }),


            drawSelect: function() {
                comp_drawSelect(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof B_rangeWireRelay
             * @instance
             * @func
             * @return {void}
             */
            ex_refreshLinks: function() {
                comp_ex_refreshLinks(this);
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
