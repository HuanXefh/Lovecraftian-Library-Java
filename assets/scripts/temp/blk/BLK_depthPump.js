/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<AttributeCrafter, BLK_depthPump>} BLKDepthPump
     */


    /**
     * @typedef {TemplateInstance<AttributeCrafter.AttributeCrafterBuild, B_depthPump>} BDepthPump
     * @prop {BLKDepthPump} block
     */


    const PARENT = require("lovec/temp/blk/BLK_liquidPump");
    const INTF_BLK_dynamicAttributeBlock = require("lovec/temp/intf/INTF_BLK_dynamicAttributeBlock");
    const INTF_BLK_depthOreHandler = require("lovec/temp/intf/INTF_BLK_depthOreHandler");
    const INTF_BLK_oreScannerHandler = require("lovec/temp/intf/INTF_BLK_oreScannerHandler");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKDepthPump} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.liqReg = fetchRegionOrNull(blk, "-liquid");
    };


    /**
     * @private
     * @param {BLKDepthPump} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(fetchStat("lovec", "blk0min-maxdepthlvl"), FRAG_faci.getDepthLvlBundle(blk.delegee.maxDepthLvl));
    };


    /**
     * @private
     * @param {BLKDepthPump} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        blk.removeBar("liquid");
        blk.addBar("liquid", b => new Bar(
            b.delegee.dynaAttrRs != null ? b.delegee.dynaAttrRs.localizedName : Core.bundle.get("bar.liquid"),
            b.delegee.dynaAttrRs != null ? tryVal(b.delegee.dynaAttrRs.barColor, b.delegee.dynaAttrRs.color) : Color.clear,
            () => b.delegee.dynaAttrRs == null ? 0.0 : Mathf.clamp(b.liquids.get(b.delegee.dynaAttrRs) / blk.liquidCapacity),
        ));
    };


    /**
     * @private
     * @param {BLKDepthPump} blk
     * @param {Tile|null} t
     * @param {Team} team
     * @param {number} rot
     * @return {boolean}
     */
    const comp_canPlaceOn = function thisFun(blk, t, team, rot) {
        if(t == null) return false;
        if(LCNativeArray.checkTupChange(thisFun.tmpTup, blk, t, team, rot)) {
            thisFun.tmpCond = blk.self.ex_anyDporeRevealed(t.x, t.y, "liquid");
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
    });


    /**
     * @private
     * @param {BDepthPump} b
     * @return {void}
     */
    function comp_created(b) {
        b.delegee.requiresScanner = true;
    };


    /**
     * @private
     * @param {BDepthPump} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        if(b.delegee.dynaAttrRs != null) {
            b.delegee.depthLvlReqCur = b.block.self.ex_calcDpLvlReq(b.tileX(), b.tileY(), b.delegee.dynaAttrRs);
        };
    };


    /**
     * @private
     * @param {BDepthPump} b
     * @return {void}
     */
    function comp_updateEfficiencyMultiplier(b) {
        if(b.delegee.maxDepthLvl < b.delegee.depthLvlReqCur) {
            b.efficiency = 0.0
        };
    };


    /**
     * @private
     * @param {BDepthPump} b
     * @return {void}
     */
    function comp_draw(b) {
        if(b.delegee.dynaAttrRs == null) return;
        LCDraw.region(b.x, b.y, b.block.delegee.liqReg, 0.0, 1.0, MDL_color.getColor(b.delegee.dynaAttrRs), b.liquids.get(b.delegee.dynaAttrRs) / b.block.liquidCapacity);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * A pump used specifically for depth liquid deposits.
         * @class BLK_depthPump
         * @extends BLK_liquidPump
         * @extends INTF_BLK_dynamicAttributeBlock
         * @extends INTF_BLK_depthOreHandler
         * @extends INTF_BLK_oreScannerHandler
         */
        newClass()
        .extendClass(PARENT[0], "BLK_depthPump")
        .implement(INTF_BLK_dynamicAttributeBlock[0])
        .implement(INTF_BLK_depthOreHandler[0])
        .implement(INTF_BLK_oreScannerHandler[0])
        .initTemplate()
        .setParent(LCVersionResolver.isV8 ? AttributeCrafter : GenericCrafter)
        .setTags("blk-non-fac")
        .setParam({


            /**
             * `PARAM`: Pump rate.
             * @memberof BLK_depthPump
             * @instance
             * @type {number}
             */
            liqProdRate: 0.0,
            /**
             * `PARAM`: See {@link BLK_baseGroundDrill#maxDepthLvl}.
             * @memberof BLK_depthPump
             * @instance
             * @type {number}
             */
            maxDepthLvl: 0,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_depthPump
             * @instance
             * @type {TextureRegion|null}
             */
            liqReg: null,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_depthPump
             * @instance
             * @type {ENumber}
             */
            attrMode: AttrModes.OVERLAY,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_depthPump
             * @instance
             * @type {F2Array<string, ResourceGn>}
             */
            attrRsArr: DB_item.db["map"]["attr"]["dpliq"],
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_depthPump
             * @instance
             * @type {boolean}
             */
            shouldDrawDynaAttrText: false,


        })
        .setMethod({


            load: function() {
                comp_load(this);
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
                noSuper: true,
                boolMode: "and",
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_depthPump
             * @instance
             * @func
             * @param {Array|unset} contArr
             * @param {number} tx
             * @param {number} ty
             * @param {number} rot
             * @return {Array<Tile>}
             */
            ex_findDynaAttrTs: function(contArr, tx, ty, rot) {
                return LCPos.getTilesBlock(contArr, this, tx, ty);
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 4,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_depthPump
             * @instance
             * @func
             * @return {number}
             */
            ex_getCraftTime: function() {
                return 300.0;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_depthPump
             * @instance
             * @func
             * @return {number}
             */
            ex_getDynaAttrBaseAmt_liq: function() {
                return this.delegee.liqProdRate;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_depthPump
             * @instance
             * @func
             * @return {string}
             */
            ex_getDynaAttrProdTypeStr: function() {
                return "collecting";
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


        /**
         * @class B_depthPump
         * @extends B_liquidPump
         * @extends INTF_B_dynamicAttributeBlock
         * @extends INTF_B_depthOreHandler
         * @extends INTF_B_oreScannerHandler
         */
        newClass()
        .extendClass(PARENT[1], "B_depthPump")
        .implement(INTF_BLK_dynamicAttributeBlock[1])
        .implement(INTF_BLK_depthOreHandler[1])
        .implement(INTF_BLK_oreScannerHandler[1])
        .initTemplate()
        .setParent(LCVersionResolver.isV8 ? AttributeCrafter.AttributeCrafterBuild : GenericCrafter.GenericCrafterBuild)
        .setParam({})
        .setMethod({


            created: function() {
                comp_created(this);
            },


            onProximityUpdate: function() {
                comp_onProximityUpdate(this);
            },


            updateEfficiencyMultiplier: function() {
                comp_updateEfficiencyMultiplier(this);
            },


            shouldConsume: function thisFun() {
                return thisFun.funPrev.funPrev.call(this) || thisFun.funPrev.call(this);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            draw: function() {
                comp_draw(this);
            },


            read: function thisFun(rd, revi) {
                if(this.delegee.LCRevi === 5) {
                    rd.s();
                };
                thisFun.funPrev.apply(this, [rd, revi]);
            }
            .setProp({
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
                return this.delegee.dynaAttrRs == null ?
                    null :
                    this.delegee.dynaAttrRs.uiIcon;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


    ];
