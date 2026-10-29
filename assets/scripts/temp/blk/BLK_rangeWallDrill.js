/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<BeamDrill, BLK_rangeWallDrill>} BLKRangeWallDrill
     */


    /**
     * @typedef {TemplateInstance<BeamDrill.BeamDrillBuild, B_rangeWallDrill>} BRangeWallDrill
     * @prop {BLKRangeWallDrill} block
     */


    const PARENT = require("lovec/temp/blk/BLK_wallDrill");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKRangeWallDrill} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.drawArrow = false;

        if(blk.size % 2 !== blk.range % 2) {
            blk.range = blk.range + 1;
        };

        MOD_tmi.regisRc_rangeWallDrill(blk);
    };


    /**
     * @private
     * @param {BLKRangeWallDrill} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.topGlowReg = fetchRegion(blk, "-top-glow");
    };


    /**
     * @private
     * @param {BLKRangeWallDrill} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        blk.addBar("drillspeed", b => new Bar(
            prov(() => Core.bundle.format("bar.drillspeed", Strings.fixed(b.lastDrillSpeed * 60.0, 2))),
            prov(() => GLB_color.ammo),
            () => Mathf.clamp(b.time / blk.self.ex_calcDrillTime(b.delegee.mineRsTup[0], b.delegee.totalOreAmt)),
        ));
    };


    /**
     * @private
     * @param {BLKRangeWallDrill} blk
     * @param {Tile|null} t
     * @param {Team} team
     * @param {number} rot
     * @return {boolean}
     */
    const comp_canPlaceOn = function thisFun(blk, t, team, rot) {
        if(t == null) return false;
        if(SLCNativeArray.checkTupChange(thisFun.tmpTup, blk, t, team, rot)) {
            blk.self.ex_updateMineMap(blk.delegee.tmpMineMap, blk.delegee.tmpMineRsTup, blk.delegee.tmpOreTs, t.x, t.y, rot);
        };
        return blk.delegee.tmpMineRsTup[0] != null;
    }
    .setProp({
        /**
         * @memberof comp_canPlaceOn
         * @type {Tup4<Block, Tile, Team, number>}
         */
        tmpTup: [],
    });

    /**
     * @private
     * @param {BLKRangeWallDrill} blk
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @param {boolean} valid
     * @return {void}
     */
    function comp_drawPlace(blk, tx, ty, rot, valid) {
        SLCDrawf.rectPlaceRot(blk, tx, ty, blk.range * 0.5, rot, true, valid ? GLB_color.accent : GLB_color.remove);
        if(GLB_var.world.tile(tx, ty) == null || blk.delegee.tmpMineRsTup[0] == null) return;
        blk.self.ex_drawDrillText(tx, ty, valid, 60.0 / blk.self.ex_calcDrillTime(blk.delegee.tmpMineRsTup[0], Math.pow(blk.range, 2)) * blk.delegee.tmpTotalOreAmt, blk.delegee.tmpMineRsTup[1].length > 1 ? null : blk.self.ex_findPlaceRsIcon(tx, ty, blk.delegee.tmpMineRsTup[0]));
    };


    /**
     * @private
     * @param {BLKRangeWallDrill} blk
     * @param {ObjectMap<Item, number>} contMap
     * @param {Tup2<Item|null, Array<Item>>} contTup
     * @param {Array<Tile>|unset} contArr
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @return {void}
     */
    function comp_ex_updateMineMap(blk, contMap, contTup, contArr, tx, ty, rot) {
        contMap.clear();
        contTup[0] = null;
        contTup[1].clear();
        blk.delegee.tmpTotalOreAmt = 0;
        let
            item = null,
            amt = 0,
            tmpAmt = 0;
        blk.self.ex_findOreTs(contArr, tx, ty, rot).forEachFast(ot => {
            item = blk.delegee.mineMode === "wall" ?
                ot.wallDrop() :
                blk.delegee.mineMode === "floor" ?
                    ot.drop() :
                    tryVal(ot.wallDrop(), ot.drop());
            if(item == null) return;
            amt = contMap.get(item, 0) + 1;
            blk.delegee.tmpTotalOreAmt++;
            contMap.put(item, amt);
            if(amt > tmpAmt) {
                tmpAmt = amt;
                contTup[0] = item;
                contTup[1].pushUnique(item);
            };
        }, true);
    };


    /**
     * @private
     * @param {BLKRangeWallDrill} blk
     * @param {Array<Tile>|unset} contArr
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @return {Array<Tile>}
     */
    function comp_ex_findOreTs(blk, contArr, tx, ty, rot) {
        let
            item,
            oblk;
        return SLCPos.getTilesRectRotCenter(tryVal(contArr, null), GLB_var.world.tile(tx, ty), blk.range * 0.5, rot, blk.size).inSituFilter(ot => {
            item = null;
            oblk = Blocks.air;
            if(blk.delegee.mineMode === "wall" || blk.delegee.mineMode === "any") {
                item = ot.wallDrop();
                oblk = ot.overlay().wallOre ? ot.overlay() : ot.block();
            } else if(blk.delegee.mineMode === "floor" || blk.delegee.mineMode === "any") {
                item = ot.drop();
                oblk = ot.overlay().wallOre ? ot.floor() : ot.overlay();
                if(oblk.itemDrop !== item) {
                    oblk = ot.floor();
                };
            };
            return item != null && oblk.itemDrop === item && blk.self.ex_canMine(oblk, item, 1.0);
        });
    };


    /**
     * @private
     * @param {BRangeWallDrill} b
     * @return {void}
     */
    function comp_created(b) {
        b.delegee.beamOffTime = Mathf.random(60000.0);
    };


    /**
     * @private
     * @param {BRangeWallDrill} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        b.block.self.ex_updateMineMap(b.delegee.mineMap, b.delegee.mineRsTup, b.delegee.oreTs, b.tileX(), b.tileY(), b.rotation);
        b.delegee.totalOreAmt = b.block.delegee.tmpTotalOreAmt;
        b.delegee.mineRsTargets.cpy(b.delegee.mineRsTup[1]);

        SLCPos.getCoordsRectRotCenter(Tmp.v1, b.x, b.y, b.block.range * 0.5, b.rotation, b.block.size);
        b.delegee.mineRectCx = Tmp.v1.x;
        b.delegee.mineRectCy = Tmp.v1.y;
    };


    /**
     * @private
     * @param {BRangeWallDrill} b
     * @return {void}
     */
    function comp_updateTile(b) {
        b.warmup = Mathf.approachDelta(b.warmup, Mathf.num(b.efficiency > 0.0), 0.01666667);

        if(b.delegee.mineRsTup[0] != null) {
            let mtp = Mathf.lerp(1.0, b.block.optionalBoostIntensity, b.optionalEfficiency);
            let drillTime = b.block.self.ex_calcDrillTime(b.delegee.mineRsTup[0], b.delegee.totalOreAmt);
            b.boostWarmup = Mathf.lerpDelta(b.boostWarmup, b.optionalEfficiency, 0.1);
            b.lastDrillSpeed = Math.pow(b.block.range, 2) * mtp * b.timeScale / drillTime * b.efficiency;
            b.time += b.edelta() * mtp;

            if(b.time >= drillTime) {
                b.delegee.mineMap.each((item, amt) => {
                    FRAG_item.offload(b, b, item, Math.pow(b.block.range, 2) * amt / b.delegee.totalOreAmt);
                });
                b.time %= drillTime;
                b.self.ex_onCraft();
            };
        };

        b.delegee.dumpTimeCur += b.delta();
        if(b.delegee.dumpTimeCur >= b.block.dumpTime) {
            b.delegee.dumpTimeCur %= b.block.dumpTime;
            b.dump();
        };
    };


    /**
     * @private
     * @param {BRangeWallDrill} b
     * @return {void}
     */
    function comp_draw(b) {
        Draw.rect(b.block.region, b.x, b.y);
        Draw.rect(b.block.topRegion, b.x, b.y, b.rotdeg());

        if(b.isPayload()) return;

        let color = Tmp.c1.set(b.block.heatColor).lerp(b.block.boostHeatColor, b.boostWarmup);
        let glowA = b.warmup * (b.block.heatColor.a * (1.0 - b.block.heatPulse + Mathf.absin(b.block.heatPulseScl, b.block.heatPulse)));

        if(b.block.glowRegion.found()) {
            processZ(Layer.blockAdditive);
            Draw.blend(Blending.additive);
            Draw.color(color, glowA);
            Draw.rect(b.block.glowRegion, b.x, b.y, b.rotdeg());
            Draw.blend();
            processZ();
        };
        if(b.block.delegee.topGlowReg.found()) {
            processZ(GLB_var.layer.mineBeam + 0.2);
            Draw.blend(Blending.additive);
            Draw.color(color, glowA);
            Draw.rect(b.block.delegee.topGlowReg, b.x, b.y);
            Draw.blend();
            processZ();
        };
        if(b.warmup > 0.0) {
            let a = b.warmup * 0.75 * SLCDrawf.getLaserA(1.0, false, true, false);
            SLCDrawf.laserRandMine(b.x, b.y, b.delegee.mineRectCx, b.delegee.mineRectCy, b.block.range * 0.5 * Vars.tilesize, b.delegee.beamOffTime, 0, 1.0, color, a, true);
            SLCDrawf.laserRandMine(b.x, b.y, b.delegee.mineRectCx, b.delegee.mineRectCy, b.block.range * 0.5 * Vars.tilesize, b.delegee.beamOffTime + 1800.0, 1, 1.0, color, a, true);
            SLCDrawf.laserRandMine(b.x, b.y, b.delegee.mineRectCx, b.delegee.mineRectCy, b.block.range * 0.5 * Vars.tilesize, b.delegee.beamOffTime + 4200.0, -1, 1.0, color, a, true);
        };
    };


    /**
     * @private
     * @param {BRangeWallDrill} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        SLCDrawf.rectSelectRot(b, b.block.range * 0.5, b.rotation, true, GLB_color.accent);
        if(b.delegee.mineRsTup[0] == null) return;
        b.drawItemSelection(b.delegee.mineRsTup[0]);
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * A wall drill that mines all blocks in the frontal rectangular range.
         * <br> `IMPORTANT`: `blk.range` is full width of the range, since that it must be an integer.
         * @class BLK_rangeWallDrill
         * @extends BLK_wallDrill
         */
        newClass()
        .extendClass(PARENT[0], "BLK_rangeWallDrill")
        .initTemplate()
        .setParent("BeamDrill")
        .setTags()
        .setParam({


            /**
             * `PARAM`: "wall" for blocks, "floor" for floors and overlay floors, "both" for any.
             * @memberof BLK_rangeWallDrill
             * @instance
             * @type {string}
             */
            mineMode: "wall",


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_rangeWallDrill
             * @instance
             * @type {TDynamic<Array<Tile>>}
             */
            tmpOreTs: tprov(() => []),
            /**
             * `INTERNAL`
             * @memberof BLK_rangeWallDrill
             * @instance
             * @type {TDynamic<ObjectMap<Item, number>>}
             */
            tmpMineMap: tprov(() => new ObjectMap()),
            /**
             * `INTERNAL`
             * @memberof BLK_rangeWallDrill
             * @instance
             * @type {number}
             */
            tmpTotalOreAmt: 0,
            /**
             * `INTERNAL`
             * @memberof BLK_rangeWallDrill
             * @instance
             * @type {TDynamic<Tup2<Item|null, Array<Item>>>}
             */
            tmpMineRsTup: tprov(() => [null, []]),
            /**
             * `INTERNAL`
             * @memberof BLK_rangeWallDrill
             * @instance
             * @type {TextureRegion}
             */
            topGlowReg: null,


        })
        .setParamAlias([
            /**
             * `ALIAS`: `range`.
             * @memberof BLK_rangeWallDrill
             * @instance
             * @name mineR
             * @type {number}
             */
            "mineR", "range", 5,
        ])
        .setMethod({


            init: function() {
                comp_init(this);
            },


            load: function() {
                comp_load(this);
            },


            setBars: function() {
                comp_setBars(this);
            },


            canPlaceOn: function thisFun(t, team, rot) {
                return comp_canPlaceOn(this, t, team, rot) && thisFun.funPrev.funPrev.apply(this, arguments);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            drawPlace: function thisFun(tx, ty, rot, valid) {
                comp_drawPlace(this, tx, ty, rot, valid);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * Updates information about mineable ores in range.
             * @memberof BLK_rangeWallDrill
             * @instance
             * @func
             * @param {ObjectMap<Item, number>} contMap - Stores mineable ores and their amounts.
             * @param {Tup2<Item|null, Array<Item>>} contTup - Stores found ores. <br> `TUPLE`: mainItem, foundItems.
             * @param {Array<Tile>|unset} contArr - Stores tiles in range temporarily.
             * @param {number} tx
             * @param {number} ty
             * @param {number} rot
             * @return {void}
             */
            ex_updateMineMap: function(contMap, contTup, contArr, tx, ty, rot) {
                comp_ex_updateMineMap(this, contMap, contTup, contArr, tx, ty, rot);
            }
            .setProp({
                noSuper: true,
                argLen: 6,
            }),


            /**
             * @memberof BLK_rangeWallDrill
             * @instance
             * @func
             * @param {Array<Tile>|unset} contArr
             * @param {number} tx
             * @param {number} ty
             * @param {number} rot
             * @return {Array<Tile>}
             */
            ex_findOreTs: function(contArr, tx, ty, rot) {
                return comp_ex_findOreTs(this, contArr, tx, ty, rot);
            }
            .setProp({
                noSuper: true,
                argLen: 4,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_rangeWallDrill
             * @instance
             * @func
             * @return {number}
             * @lovecAttached
             */
            ex_getRcDictOutputScl: function() {
                return Math.pow(this.range, 2) / this.size;
            }
            .setProp({
                noSuper: true,
                mergeMode: function(valPrev, val) {
                    return valPrev * val;
                },
            }),


            /**
             * @memberof BLK_rangeWallDrill
             * @instance
             * @func
             * @param {Item} item
             * @param {number} totalAmt
             * @return {number}
             */
            ex_calcDrillTime: function(item, totalAmt) {
                return this.getDrillTime(item) / Math.max(totalAmt, 0.000001) * Math.pow(this.range, 2);
            }
            .setProp({
                noSuper: true,
                argLen: 2,
            }),


        }),


        /**
         * @class B_rangeWallDrill
         * @extends B_wallDrill
         */
        newClass()
        .extendClass(PARENT[1], "B_rangeWallDrill")
        .initTemplate()
        .setParent("BeamDrill.BeamDrillBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_rangeWallDrill
             * @instance
             * @type {TDynamic<Array<Tile>>}
             */
            oreTs: tprov(() => []),
            /**
             * `INTERNAL`
             * @memberof B_rangeWallDrill
             * @instance
             * @type {TDynamic<ObjectMap<Item, number>>}
             */
            mineMap: tprov(() => new ObjectMap()),
            /**
             * `INTERNAL`
             * @memberof B_rangeWallDrill
             * @instance
             * @type {number}
             */
            totalOreAmt: 0,
            /**
             * `INTERNAL`
             * @memberof B_rangeWallDrill
             * @instance
             * @type {TDynamic<Tup2<Item|null, Array<Item>>>}
             */
            mineRsTup: tprov(() => [null, []]),
            /**
             * `INTERNAL`
             * @memberof B_rangeWallDrill
             * @instance
             * @type {number}
             */
            mineRectCx: 0.0,
            /**
             * `INTERNAL`
             * @memberof B_rangeWallDrill
             * @instance
             * @type {number}
             */
            mineRectCy: 0.0,
            /**
             * `INTERNAL`
             * @memberof B_rangeWallDrill
             * @instance
             * @type {number}
             */
            beamOffTime: 0.0,


        })
        .setMethod({


            created: function() {
                comp_created(this);
            },


            onProximityUpdate: function() {
                comp_onProximityUpdate(this);
            },


            updateTile: function thisFun() {
                thisFun.funPrev.funPrev.call(this);
                comp_updateTile(this);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            draw: function() {
                comp_draw(this);
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


        }),


    ];
