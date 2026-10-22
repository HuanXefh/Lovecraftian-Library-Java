/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<AttributeCrafter, BLK_rangeHarvester>} BLKRangeHarvester
     */


    /**
     * @typedef {TemplateInstance<AttributeCrafter.AttributeCrafterBuild, B_rangeHarvester>} BRangeHarvester
     * @prop {BLKRangeHarvester} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseHarvester");
    const INTF_BLK_rangeAttributeBlock = require("lovec/temp/intf/INTF_BLK_rangeAttributeBlock");
    const INTF_BLK_rangeDisplay = require("lovec/temp/intf/INTF_BLK_rangeDisplay");
    const INTF_BLK_lootProducer = require("lovec/temp/intf/INTF_BLK_lootProducer");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKRangeHarvester} blk
     * @return {void}
     */
    function comp_init(blk) {
        resetBlockFlag(blk, []);

        blk.baseEfficiency = 0.0;
        blk.delegee.blkR = blk.delegee.attrR;

        if(blk.delegee.rcMajorIo == null) {
            blk.delegee.rcMajorIo = MDL_content.getMajorIo(blk);
        };

        blk.self.ex_addLogicF(LogicProp.range, b => blk.delegee.blkR);
    };


    /**
     * @private
     * @param {BLKRangeHarvester} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.craftSe = fetchSound(blk.delegee.craftSe);
    };


    /**
     * @private
     * @param {BLKRangeHarvester} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(Stat.range, blk.attrR, StatUnit.blocks);

        stats.remove(Stat.tiles);
        stats.remove(Stat.affinities);
        stats.add(fetchStat("lovec", "blk-attrreq"), newStatValue(tb => {
            tb.row();
            MDL_table.setAttr(tb, blk.attribute);
        }));
    };


    /**
     * @private
     * @param {BLKRangeHarvester} blk
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
            LCPos.getTilesRect(thisFun.tmpTs, t, blk.delegee.attrR, blk.size).inSituFilter(ot => MDL_attr.calcSumByTs([ot], blk.attribute, blk.delegee.attrMode) > 0.0);
        };

        thisFun.tmpTs.forEachFast(ot => {
            LCDrawf.areaShrink(ot, (blk.delegee.attrMode & AttrModes.BLOCK) !== 0 ? ot.block().size : 1, valid ? GLB_color.accent : GLB_color.remove);
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


    /**
     * @private
     * @param {BRangeHarvester} b
     * @return {void}
     */
    function comp_craft(b) {
        MDL_sound.playAt(b.x, b.y, b.block.delegee.craftSe, Math.min(b.block.ambientSoundVolume * 2.0, 1.0), 1.0, 0.1);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Attribute crafter with a rectangular range.
         * @class BLK_rangeHarvester
         * @extends BLK_baseHarvester
         * @extends INTF_BLK_rangeAttributeBlock
         * @extends INTF_BLK_rangeDisplay
         * @extends INTF_BLK_lootProducer
         */
        newClass()
        .extendClass(PARENT[0], "BLK_rangeHarvester")
        .implement(INTF_BLK_rangeAttributeBlock[0])
        .implement(INTF_BLK_rangeDisplay[0])
        .implement(INTF_BLK_lootProducer[0])
        .initTemplate()
        .setParent("AttributeCrafter")
        .setTags("blk-non-fac")
        .setParam({


            /**
             * `PARAM`: See {@link BLK_wallHarvester#shouldDropLoot}.
             * @memberof BLK_rangeHarvester
             * @instance
             * @type {boolean}
             */
            shouldDropLoot: true,
            /**
             * `PARAM`: See {@link BLK_baseFactory#rcMajorIo}.
             * @memberof BLK_rangeHarvester
             * @instance
             * @type {UnlockableContent|null}
             */
            rcMajorIo: null,
            /**
             * `PARAM`: See {@link BLK_baseFactory#craftSe}.
             * @memberof BLK_rangeHarvester
             * @instance
             * @type {SoundGn}
             */
            craftSe: Sounds.unset,


            /* <------------------------------ vanilla ------------------------------> */


            maxBoost: Number.n8,


        })
        .setParamAlias([
            /**
             * `ALIAS`: `craftEffect`.
             * @memberof BLK_rangeHarvester
             * @instance
             * @name craftEff
             * @type {Effect}
             */
            "craftEff", "craftEffect", Fx.none,
            /**
             * `ALIAS`: `updateEffect`.
             * @memberof BLK_rangeHarvester
             * @instance
             * @name updateEff
             * @type {Effect}
             */
            "updateEff", "updateEffect", Fx.none,
            /**
             * `ALIAS`: `updateEffectChance`.
             * @memberof BLK_rangeHarvester
             * @instance
             * @name updateEffP
             * @type {number}
             */
            "updateEffP", "updateEffectChance", 0.02,
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


            drawPlace: function(tx, ty, rot, valid) {
                comp_drawPlace(this, tx, ty, rot, valid);
            },


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_rangeHarvester
             * @instance
             * @func
             * @return {number}
             */
            ex_getCraftTime: function() {
                return this.craftTime;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


        /**
         * @class B_rangeHarvester
         * @extends B_baseHarvester
         * @extends INTF_B_rangeAttributeBlock
         * @extends INTF_B_rangeDisplay
         * @extends INTF_B_lootProducer
         */
        newClass()
        .extendClass(PARENT[1], "B_rangeHarvester")
        .implement(INTF_BLK_rangeAttributeBlock[1])
        .implement(INTF_BLK_rangeDisplay[1])
        .implement(INTF_BLK_lootProducer[1])
        .initTemplate()
        .setParent("AttributeCrafter.AttributeCrafterBuild")
        .setParam({})
        .setMethod({


            craft: function() {
                comp_craft(this);
            },


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
             * @memberof B_rangeHarvester
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
             * @memberof B_rangeHarvester
             * @instance
             * @func
             * @return {number}
             */
            ex_getCraftTimeCur: function() {
                return this.progress * this.block.craftTime;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_rangeHarvester
             * @instance
             * @func
             * @return {TextureRegion|null}
             */
            ex_getRcIcon: function() {
                return this.block.delegee.rcMajorIo == null ?
                    null :
                    this.block.delegee.rcMajorIo.uiIcon;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


    ];
