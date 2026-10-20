/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_wallHarvester>} BLKWallHarvester
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_wallHarvester>} BWallHarvester
     * @prop {BLKWallHarvester} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseHarvester");
    const INTF_BLK_lootProducer = require("lovec/temp/intf/INTF_BLK_lootProducer");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKWallHarvester} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.remove(Stat.tiles);
        stats.remove(Stat.affinities);

        stats.add(fetchStat("lovec", "blk-attrreq"), newStatValue(tb => {
            tb.row();
            MDL_table.setAttr(tb, blk.attribute);
        }));
    };


    /**
     * @private
     * @param {BLKWallHarvester} blk
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @param {boolean} valid
     * @return {void}
     */
    const comp_drawPlace = function thisFun(blk, tx, ty, rot, valid) {
        let t = GLB_var.world.tile(tx, ty);
        if(t == null) return;

        if(LCNativeArray.checkTupChange(thisFun.tmpTup, blk, t, rot)) {
            LCPos.getTilesRect(thisFun.tmpTs, t, 5, blk.size);
        };

        thisFun.tmpTs.forEachFast(ot => {
            if(ot.block().attributes.get(blk.attribute) > 0.0) {
                LCDrawf.areaShrink(ot, 1, valid ? Pal.accent : Pal.remove);
            };
        }, true);
    }
    .setProp({
        /**
         * @memberof comp_drawPlace
         * @type {Tup3<Block, Tile, number>}
         */
        tmpTup: [],
        /**
         * @memberof comp_drawPlace
         * @type {Array<Tile>}
         */
        tmpTs: [],
    });


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Vanilla wall crafter, but enhanced.
         * @class BLK_wallHarvester
         * @extends BLK_baseHarvester
         * @extends INTF_BLK_lootProducer
         */
        newClass()
        .extendClass(PARENT[0], "BLK_wallHarvester")
        .implement(INTF_BLK_lootProducer[0])
        .initTemplate()
        .setParent(WallCrafter)
        .setTags()
        .setParam({


            /**
             * `PARAM`: Whether this harvester outputs loot instead of items.
             * @memberof BLK_wallHarvester
             * @instance
             * @type {boolean}
             */
            shouldDropLoot: true,


        })
        .setParamAlias([
            /**
             * `ALIAS`: `updateEffect`.
             * @memberof BLK_wallHarvester
             * @instance
             * @name updateEff
             * @type {Effect}
             */
            "updateEff", "updateEffect", Fx.none,
            /**
             * `ALIAS`: `updateEffectChance`.
             * @memberof BLK_wallHarvester
             * @instance
             * @name updateEffP
             * @type {number}
             */
            "updateEffP", "updateEffectChance", 0.02,
        ])
        .setMethod({


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            drawPlace: function(tx, ty, rot, valid) {
                comp_drawPlace(this, tx, ty, rot, valid);
            },


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_wallHarvester
             * @instance
             * @func
             * @return {number}
             */
            ex_getCraftTime: function() {
                return this.drillTime;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


        /**
         * @class B_wallHarvester
         * @extends B_baseHarvester
         * @extends INTF_B_lootProducer
         */
        newClass()
        .extendClass(PARENT[1], "B_wallHarvester")
        .implement(INTF_BLK_lootProducer[1])
        .initTemplate()
        .setParent(WallCrafter.WallCrafterBuild)
        .setParam({})
        .setMethod({


            draw: function() {
                this.self.ex_drawRcIcon();
            },


            read: function(rd, revi) {
                if(this.delegee.LCRevi === 5) {
                    rd.s();
                    this.delegee.lootCharge = rd.i();
                };
            },


            /**
             * `REALIZED`
             * @override
             * @memberof B_wallHarvester
             * @instance
             * @func
             * @return {boolean}
             */
            ex_shouldDropLoot: function() {
                return this.block.delegee.shouldDropLoot;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_wallHarvester
             * @instance
             * @func
             * @return {number}
             */
            ex_getCraftTimeCur: function() {
                return this.time;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_wallHarvester
             * @instance
             * @func
             * @return {TextureRegion|null}
             */
            ex_getRcIcon: function() {
                return this.block.output.uiIcon;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


    ];
