/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<MultiBlockCrafter, BLK_holeAttributeFactory>} BLKHoleAttributeFactory
     */


    /**
     * @typedef {TemplateInstance<MultiBlockCrafter.MultiBlockCrafterBuild, B_holeAttributeFactory>} BHoleAttributeFactory
     * @prop {BLKHoleAttributeFactory} block
     */


    const PARENT = require("lovec/temp/blk/BLK_multiBlockFactory");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKHoleAttributeFactory} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.rotate = false;
    };


    /**
     * @private
     * @param {BLKHoleAttributeFactory} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(fetchStat("lovec", "blk-attrreq"), newStatValue(tb => {
            tb.row();
            MDL_table.setAttr(tb, blk.delegee.attribute);
        }));
    };


    /**
     * @private
     * @param {BLKHoleAttributeFactory} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        blk.addBar("efficiency", b => new Bar(
            prov(() => Core.bundle.format("bar.efficiency", Math.round(b.delegee.attrEffc * 100.0))),
            prov(() => GLB_color.lightOrange),
            () => Mathf.clamp(b.delegee.attrEffc),
        ));
        if(!GLB_var.mindustryX) {
            blk.addBar("lovec-prog", b => new Bar(
                prov(() => Core.bundle.format("bar.lovec-bar-prog-amt", b.progress.perc(0))),
                prov(() => GLB_color.ammo),
                () => Mathf.clamp(b.progress, 0.0, 1.0),
            ));
        };
    };


    /**
     * @private
     * @param {BLKHoleAttributeFactory} blk
     * @param {Block} blk
     * @param {Tile|null} t
     * @param {Team} team
     * @param {number} rot
     * @return {boolean}
     */
    function comp_canPlaceOn(blk, t, team, rot) {
        return t != null && blk.self.ex_getAttrSum(t.x, t.y) > 0.0;
    };


    /**
     * @private
     * @param {BLKHoleAttributeFactory} blk
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @param {boolean} valid
     * @return {void}
     */
    const comp_drawPlace = function thisFun(blk, tx, ty, rot, valid) {
        let t = GLB_var.world.tile(tx + blk.delegee.holeOffPon.x, ty + blk.delegee.holeOffPon.y);
        if(t != null) {
            if(SLCNativeArray.checkTupChange(thisFun.tmpTup, blk, t)) {
                SLCPos.getTilesRect(thisFun.tmpTs, t, 5, blk.size);
            };

            thisFun.tmpTs.forEachFast(ot => {
                if(ot.block().attributes.get(blk.delegee.attribute) > 0.0) {
                    SLCDrawf.areaShrink(ot, 1, valid ? GLB_color.accent : GLB_color.remove);
                };
            }, true);
        };

        if(blk.delegee.shouldDrawAttrText) {
            SLCDrawf.textPlace(
                blk, tx + blk.delegee.holeOffPon.x, ty + blk.delegee.holeOffPon.y + blk.size,
                Core.bundle.format("bar.efficiency", Math.round(blk.self.ex_getAttrEffc(tx, ty) * 100.0)),
                valid, blk.delegee.attrTextOffTy,
            );
        };
    }
    .setProp({
        /**
         * @memberof comp_drawPlace
         * @type {Tup2<Block, Tile>}
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
     * @param {BLKHoleAttributeFactory} blk
     * @param {number} tx
     * @param {number} ty
     * @return {number}
     */
    function comp_ex_getAttrSum(blk, tx, ty) {
        let ot = GLB_var.world.tile(tx + blk.delegee.holeOffPon.x, ty + blk.delegee.holeOffPon.y);
        if(ot == null) return 0.0;
        return MDL_attr.calcSumRect(ot, 0, blk.delegee.holeSize, blk.delegee.attribute, blk.delegee.attrMode);
    };


    /**
     * @private
     * @param {BLKHoleAttributeFactory} blk
     * @param {number} tx
     * @param {number} ty
     * @return {number}
     */
    function comp_ex_getAttrEffc(blk, tx, ty) {
        return MDL_attr.calcAttrEffc(
            blk.self.ex_getAttrSum(tx, ty) + blk.delegee.attribute.env(),
            blk.delegee.attrMin,
            blk.delegee.attrMax,
            blk.delegee.attrBoostScl,
            blk.delegee.attrBoostCap,
        );
    };


    /**
     * @private
     * @param {BHoleAttributeFactory} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        b.delegee.attrSum = b.block.self.ex_getAttrSum(b.tileX(), b.tileY());
        let off = b.block.delegee.holeSize % 2 === 0 ? 4.0 : 0.0;
        b.delegee.holeVec.set(b).add(
            off + b.block.delegee.holeOffPon.x * Vars.tilesize,
            off + b.block.delegee.holeOffPon.y * Vars.tilesize,
        );
    };


    /**
     * @private
     * @param {BHoleAttributeFactory} b
     * @return {void}
     */
    function comp_pickedUp(b) {
        b.delegee.attrSum = 0.0;
        b.delegee.attrEffc = 0.0;
    };


    /**
     * @private
     * @param {BHoleAttributeFactory} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(GLB_timer.effc) {
            b.delegee.attrEffc = b.block.self.ex_getAttrEffc(b.tileX(), b.tileY());
        };

        if(Mathf.chanceDelta(b.block.delegee.holeUpdateEffP * b.efficiency)) {
            let ot = GLB_var.world.tileWorld(b.delegee.holeVec.x, b.delegee.holeVec.y);
            let color = ot == null ?
                Color.white :
                (b.block.delegee.attrMode & AttrModes.BLOCK) !== 0 ?
                    ot.block().mapColor :
                    ot.getFloorColor();
            MDL_effect.showAt(b.delegee.holeVec.x, b.delegee.holeVec.y, b.block.delegee.holeUpdateEff, 0.0, color);
        };
    };


    /**
     * @private
     * @param {BHoleAttributeFactory} b
     * @return {void}
     */
    function comp_updateEfficiencyMultiplier(b) {
        b.efficiency *= b.delegee.attrEffc;
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * A special attribute crafter that has a square hole as detection range.
         * Rotation not supported!
         * @class BLK_holeAttributeFactory
         * @extends BLK_multiBlockFactory
         */
        newClass()
        .extendClass(PARENT[0], "BLK_holeAttributeFactory")
        .initTemplate()
        .setParent("MultiBlockCrafter")
        .setTags()
        .setParam({


            /**
             * `PARAM`: Offset for hole center.
             * @memberof BLK_holeAttributeFactory
             * @instance
             * @type {TDynamic<Point2>}
             */
            holeOffPon: tprov(() => new Point2(1, 1)),
            /**
             * `PARAM`: Block size of the hole.
             * @memberof BLK_holeAttributeFactory
             * @instance
             * @type {number}
             */
            holeSize: 1,
            /**
             * `PARAM`: Target attribute.
             * @memberof BLK_holeAttributeFactory
             * @instance
             * @type {Attribute}
             */
            attribute: null,
            /**
             * `PARAM`: See {@link INTF_BLK_dynamicAttributeBlock#attrMode}.
             * @memberof BLK_holeAttributeFactory
             * @instance
             * @type {ENumber}
             */
            attrMode: AttrModes.BLOCK,
            /**
             * `PARAM`: See {@link INTF_BLK_dynamicAttributeBlock#attrRcType}.
             * @memberof BLK_holeAttributeFactory
             * @instance
             * @type {ENumber}
             */
            attrRcType: AttrRecipeTypes.WALL,
            /**
             * `PARAM`
             * @memberof BLK_holeAttributeFactory
             * @instance
             * @type {number}
             */
            attrMin: 0.0,
            /**
             * `PARAM`
             * @memberof BLK_holeAttributeFactory
             * @instance
             * @type {number}
             */
            attrMax: 1.0,
            /**
             * `PARAM`
             * @memberof BLK_holeAttributeFactory
             * @instance
             * @type {number}
             */
            attrBoostScl: 1.0,
            /**
             * `PARAM`
             * @memberof BLK_holeAttributeFactory
             * @instance
             * @type {number}
             */
            attrBoostCap: Number.n8,
            /**
             * `PARAM`: Whether efficiency text should be shown in `drawPlace`.
             * @memberof BLK_holeAttributeFactory
             * @instance
             * @type {boolean}
             */
            shouldDrawAttrText: true,
            /**
             * `PARAM`: Integer offset of the efficiency text in `blk.drawPlace`.
             * @memberof BLK_holeAttributeFactory
             * @instance
             * @type {number}
             */
            attrTextOffTy: 0,
            /**
             * `PARAM`: Effect shown at hole center.
             * @memberof BLK_holeAttributeFactory
             * @instance
             * @type {Effect}
             */
            holeUpdateEff: Fx.none,
            /**
             * `PARAM`: Chance of hole update effect.
             * @memberof BLK_holeAttributeFactory
             * @instance
             * @type {number}
             */
            holeUpdateEffP: 0.02,


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


            canPlaceOn: function(t, team, rot) {
                return comp_canPlaceOn(this, t, team, rot);
            }
            .setProp({
                boolMode: "and",
            }),


            drawPlace: function(tx, ty, rot, valid) {
                comp_drawPlace(this, tx, ty, rot, valid);
            },


            /**
             * @memberof BLK_holeAttributeFactory
             * @instance
             * @func
             * @param {number} tx
             * @param {number} ty
             * @return {number}
             */
            ex_getAttrSum: function(tx, ty) {
                return comp_ex_getAttrSum(this, tx, ty);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof BLK_holeAttributeFactory
             * @instance
             * @func
             * @param {number} tx
             * @param {number} ty
             * @return {number}
             */
            ex_getAttrEffc: function(tx, ty) {
                return comp_ex_getAttrEffc(this, tx, ty);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Expected production type used in TMI.
             * <br> `LATER`
             * @memberof BLK_holeAttributeFactory
             * @instance
             * @func
             * @return {String|null}
             */
            ex_getHoleAttrProdTypeStr: function() {
                return null;
            }
            .setProp({
                noSuper: true,
            }),


        }),


        /**
         * @class B_holeAttributeFactory
         * @extends B_multiBlockFactory
         */
        newClass()
        .extendClass(PARENT[1], "B_holeAttributeFactory")
        .initTemplate()
        .setParent("MultiBlockCrafterBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_holeAttributeFactory
             * @instance
             * @type {TDynamic<Vec2>}
             */
            holeVec: tprov(() => new Vec2()),
            /**
             * `INTERNAL`
             * @memberof B_holeAttributeFactory
             * @instance
             * @type {number}
             */
            attrSum: 0.0,
            /**
             * `INTERNAL`
             * @memberof B_holeAttributeFactory
             * @instance
             * @type {number}
             */
            attrEffc: 0.0,


        })
        .setMethod({


            onProximityUpdate: function() {
                comp_onProximityUpdate(this);
            },


            pickedUp: function() {
                comp_pickedUp(this);
            },


            updateTile: function() {
                comp_updateTile(this);
            },


            updateEfficiencyMultiplier: function() {
                comp_updateEfficiencyMultiplier(this);
            },


        }),


    ];
