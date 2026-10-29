/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<StorageBlock, BLK_lootPullerHopper>} BLKLootPullerHopper
     */


    /**
     * @typedef {TemplateInstance<StorageBlock.StorageBuild, B_lootPullerHopper>} BLootPullerHopper
     * @prop {BLKLootPullerHopper} block
     */


    const PARENT = require("lovec/temp/blk/BLK_lootHopper");
    const INTF_BLK_radiusDisplay = require("lovec/temp/intf/INTF_BLK_radiusDisplay");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKLootPullerHopper} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.drawCached = false;
        blk.drawDynamic = true;

        blk.self.ex_addLogicF(LogicProp.range, b => blk.delegee.blkRad / Vars.tilesize);
    };


    /**
     * @private
     * @param {BLKLootPullerHopper} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.glowReg = fetchRegionOrNull(blk, "-glow");
        blk.delegee.pullSe = fetchSound(blk.delegee.pullSe);
    };


    /**
     * @private
     * @param {BLKLootPullerHopper} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(Stat.range, blk.delegee.blkRad / Vars.tilesize, StatUnit.blocks);
    };


    /**
     * @private
     * @param {BLootPullerHopper} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(!b.delegee.isPulling) {
            b.delegee.progWait += b.edelta();
            if(b.delegee.progWait > b.block.delegee.intvPull) {
                b.delegee.progWait %= b.block.delegee.intvPull;
                SLCEntity.getLoots(b.delegee.pullTargets, b.x, b.y, b.block.delegee.blkRad).inSituFilter(loot => Mathf.dst(loot.x, loot.y, b.x, b.y) > b.block.size * 0.5 * Vars.tilesize);
                b.delegee.isPulling = b.delegee.pullTargets.length > 0;
            };
        } else {
            b.delegee.progPull += Time.delta;
            if(b.delegee.progPull > b.block.delegee.durPull) {
                b.delegee.progPull %= b.block.delegee.durPull;
                b.delegee.isPulling = false;
            } else {
                b.delegee.pullTargets.forEachFast(loot => {
                    loot.impulse(Tmp.v2.set(loot).sub(b.x, b.y).nor().scl(-b.block.delegee.powPull * b.delegee.glowHeat));
                }, true);
            };

            if(!Vars.headless) {
                Vars.control.sound.loop(b.block.delegee.pullSe, b, 0.7);
            };
        };

        b.delegee.glowHeat = Mathf.approachDelta(b.delegee.glowHeat, b.delegee.isPulling ? 1.0 : 0.0, b.delegee.isPulling ? 0.006 : 0.02);
    };


    /**
     * @private
     * @param {BLootPullerHopper} b
     * @return {void}
     */
    function comp_draw(b) {
        SLCDrawf.fade(b.x, b.y, b.block.delegee.glowReg, 1.0, 0.0, 1.0, Color.white, b.delegee.glowHeat * 0.7);
        if(b.delegee.glowHeat > 0.01) {
            b.delegee.pullTargets.forEachFast(loot => {
                if(loot.isAdded()) {
                    SLCDrawf.arrowLine(loot.x, loot.y, b.x, b.y, 2.0, 1.0, Color.white, 0.35 * b.delegee.glowHeat, GLB_var.layer.effFlr);
                };
            }, true);
        };
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Loot hopper that actively pulls nearby loots towards it.
         * <br> Nah I won't do regular radius loot collector.
         * @class BLK_lootPullerHopper
         * @extends BLK_lootHopper
         * @extends INTF_BLK_radiusDisplay
         */
        newClass()
        .extendClass(PARENT[0], "BLK_lootPullerHopper")
        .implement(INTF_BLK_radiusDisplay[0])
        .initTemplate()
        .setParent("StorageBlock")
        .setTags("blk-non-cont")
        .setParam({


            /**
             * `PARAM`: Pull power.
             * @memberof BLK_lootPullerHopper
             * @instance
             * @type {number}
             */
            powPull: 8.0,
            /**
             * `PARAM`: Duration of each pull.
             * @memberof BLK_lootPullerHopper
             * @instance
             * @type {number}
             */
            durPull: 240.0,
            /**
             * `PARAM`: Duration between each pull.
             * @memberof BLK_lootPullerHopper
             * @instance
             * @type {number}
             */
            intvPull: 240.0,
            /**
             * `PARAM`: Loop sound played when pulling loots.
             * @memberof BLK_lootPullerHopper
             * @instance
             * @type {SoundGn}
             */
            pullSe: "SOUNDS: beamParallax",


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_lootPullerHopper
             * @instance
             * @type {TextureRegion|null}
             */
            glowReg: null,


        })
        .setParamAlias([
            /**
             * `ALIAS`: `blkRad`.
             * @memberof BLK_lootPullerHopper
             * @instance
             * @name pullRad
             * @type {number}
             */
            "pullRad", "blkRad", 5 * 8.0,
        ])
        .setMethod({


            init: function() {
                comp_init(this);
            },


            load: function() {
                comp_load(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


        }),


        /**
         * @class B_lootPullerHopper
         * @extends B_lootHopper
         * @extends INTF_B_radiusDisplay
         */
        newClass()
        .extendClass(PARENT[1], "B_lootPullerHopper")
        .implement(INTF_BLK_radiusDisplay[1])
        .initTemplate()
        .setParent("StorageBlock.StorageBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_lootPullerHopper
             * @instance
             * @type {boolean}
             */
            isPulling: false,
            /**
             * `INTERNAL`
             * @memberof B_lootPullerHopper
             * @instance
             * @type {TDynamic<Array<LootUnit>>}
             */
            pullTargets: tprov(() => []),
            /**
             * `INTERNAL`
             * @memberof B_lootPullerHopper
             * @instance
             * @type {number}
             */
            progPull: 0.0,
            /**
             * `INTERNAL`
             * @memberof B_lootPullerHopper
             * @instance
             * @type {number}
             */
            progWait: 0.0,
            /**
             * `INTERNAL`
             * @memberof B_lootPullerHopper
             * @instance
             * @type {number}
             */
            glowHeat: 0.0,


        })
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            },


            draw: function() {
                comp_draw(this);
            },


        }),


    ];
