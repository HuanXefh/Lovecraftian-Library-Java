/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<BeamDrill, BLK_wallDrill>} BLKWallDrill
     */


    /**
     * @typedef {TemplateInstance<BeamDrill.BeamDrillBuild, B_wallDrill>} BWallDrill
     * @prop {BLKWallDrill} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseDrill");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKWallDrill} blk
     * @return {void}
     */
    function comp_init(blk) {
        if(blk.range === 1) {
            blk.drawArrow = true;
            blk.laserWidth = 0.0;
        };
        if(blk.delegee.setupVanillaProp) {
            blk.sparkRange = blk.size * Vars.tilesize * 0.5;
            blk.sparkSize = 0.5 + blk.size * 0.5;
        };
    };


    /**
     * @private
     * @param {BLKWallDrill} blk
     * @param {Tile|null} t
     * @param {Team} team
     * @param {number} rot
     * @return {boolean}
     */
    const comp_canPlaceOn = function thisFun(blk, t, team, rot) {
        if(t == null) return;
        if(SLCNativeArray.checkTupChange(thisFun.tmpTup, blk, t, team, rot)) {
            thisFun.tmpCond = thisFun.checkOreValid(blk, t, team, rot);
        };
        return thisFun.tmpCond;
    }
    .setProp({
        /**
         * @memberof comp_canPlaceOn
         * @type {Tup4<Block, Tile, Team, number>}
         */
        tmpTup: [],
        /**
         * @memberof comp_canPlaceOn
         * @type {boolean}
         */
        tmpCond: false,
        /**
         * @memberof comp_canPlaceOn
         * @param {BLKWallDrill} blk
         * @param {Tile} t
         * @param {Team} team
         * @param {number} rot
         * @return {boolean}
         */
        checkOreValid: function(blk, t, team, rot) {
            let
                ot = null,
                item = null,
                isBlockDrop = false;
            for(let i = 0; i < blk.size; i++) {
                blk.nearbySide(t.x, t.y, rot, i, Tmp.p1);
                for(let j = 0; j < blk.range; j++) {
                    ot = GLB_var.world.tile(Tmp.p1.x + Geometry.d4x[rot] * j, Tmp.p1.y + Geometry.d4y[rot] * j);
                    if(ot != null && ot.solid()) {
                        if(ot.overlay().itemDrop != null) {
                            item = ot.overlay().itemDrop;
                        } else if(ot.block().itemDrop != null) {
                            item = ot.block().itemDrop;
                            isBlockDrop = true;
                        };
                        if(item != null && blk.self.ex_canMine(isBlockDrop ? ot.block() : ot.overlay(), item, 1.0)) return true;
                        isBlockDrop = false;
                        break;
                    };
                };
            };

            return false;
        },
    });


    /**
     * @private
     * @param {BWallDrill} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        b.delegee.mineRsTargets.clear();
        Core.app.post(() => {
            let item;
            b.facing.forEachFast(ot => {
                item = ot == null ? null : ot.wallDrop();
                if(item != null) {
                    b.delegee.mineRsTargets.pushUnique(item);
                };
            }, true);
        });
    };


    /**
     * @private
     * @param {BWallDrill} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(b.lasers[0] == null) {
            Reflect.invoke(BeamDrill.BeamDrillBuild, b, "updateLasers", Array.air);
        };
        b.warmup = Mathf.approachDelta(b.warmup, Mathf.num(b.efficiency > 0.0), 0.01666667);
        Reflect.invoke(BeamDrill.BeamDrillBuild, b, "updateFacing", Array.air);

        let mtp = Mathf.lerp(1.0, b.block.optionalBoostIntensity, b.optionalEfficiency);
        let drillTime = b.block.getDrillTime(b.lastItem);
        b.boostWarmup = Mathf.lerpDelta(b.boostWarmup, b.optionalEfficiency, 0.1);
        b.lastDrillSpeed = b.facingAmount * mtp * b.timeScale / drillTime * b.efficiency;
        b.time += b.edelta() * mtp;

        if(b.time >= drillTime) {
            let item;
            b.facing.forEachFast(ot => {
                item = ot == null ? null : ot.wallDrop();
                if(item != null && b.items.get(item) < b.getMaximumAccepted(item)) {
                    b.offload(item);
                };
            }, true);
            b.time %= drillTime;
            b.self.ex_onCraft();
        };

        b.delegee.dumpTimeCur += b.delta();
        if(b.delegee.dumpTimeCur >= b.block.dumpTime) {
            b.delegee.dumpTimeCur %= b.block.dumpTime;
            b.dump();
        };
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Beam drill but usually with range of 1.
         * @class BLK_wallDrill
         * @extends BLK_baseDrill
         */
        newClass()
        .extendClass(PARENT[0], "BLK_wallDrill")
        .initTemplate()
        .setParent("BeamDrill")
        .setTags()
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`: Wall drills should not output payloads to the front side.
             * <br> `REALIZED`
             * @override
             * @memberof BLK_wallDrill
             * @instance
             * @type {ENumber}
             */
            payOutputSideFracMode: SideFracModes.NON_FRONT,


            /* <------------------------------ vanilla ------------------------------> */


            sparks: 10,
            sparkLife: 20.0,
            sparkRecurrence: 2.0,
            sparkSpread: 50.0,


        })
        .setParamAlias([
            /**
             * `ALIAS`: `range`.
             * @memberof BLK_wallDrill
             * @instance
             * @name mineR
             * @type {number}
             */
            "mineR", "range", 1,
        ])
        .setMethod({


            init: function() {
                comp_init(this);
            },


            canPlaceOn: function(t, team, rot) {
                return comp_canPlaceOn(this, t, team, rot);
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
            }),


        }),


        /**
         * @class B_wallDrill
         * @extends B_baseDrill
         */
        newClass()
        .extendClass(PARENT[1], "B_wallDrill")
        .initTemplate()
        .setParent("BeamDrill.BeamDrillBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_wallDrill
             * @instance
             * @type {TDynamic<Array<Item>>}
             */
            mineRsTargets: tprov(() => []),


        })
        .setMethod({


            onProximityUpdate: function() {
                comp_onProximityUpdate(this);
            },


            updateTile: function() {
                comp_updateTile(this);
            }
            .setProp({
                noSuper: true,
            }),


            shouldConsume: function() {
                return this.enabled && this.delegee.mineRsTargets.length > 0 && this.delegee.mineRsTargets.every(item => this.items.get(item) < this.getMaximumAccepted(item));
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
            }),


            canDump: function(b_t, item) {
                return !this.block.consumesItem(item) || (this.delegee.mineRsTargets.includes(item) && this.items.has(item, 2));
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
            }),


        }),


    ];
