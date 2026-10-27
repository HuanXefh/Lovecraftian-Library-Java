/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<WallCrafter, BLK_dynamicWallHarvester>} BLKDynamicWallHarvester
     */


    /**
     * @typedef {TemplateInstance<WallCrafter.WallCrafterBuild, B_dynamicWallHarvester>} BDynamicWallHarvester
     * @prop {BLKDynamicWallHarvester} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseHarvester");
    const INTF_BLK_dynamicAttributeBlock = require("lovec/temp/intf/INTF_BLK_dynamicAttributeBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKDynamicWallHarvester} blk
     * @return {void}
     */
    function comp_init(blk) {
        if(blk.delegee.attrRsArr == null) throw new LCError.NullArgumentError(blk.name + ".attrRsArr");

        blk.attribute = TP_attr.attr_placeholder;
    };


    /**
     * @private
     * @param {BLKDynamicWallHarvester} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.remove(Stat.output);
        stats.remove(Stat.tiles);
        stats.remove(Stat.drillSpeed);
    };


    /**
     * @private
     * @param {BLKDynamicWallHarvester} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        blk.removeBar("drillspeed");
        blk.addBar("drillspeed", b => new Bar(
            prov(() => Core.bundle.format("bar.drillspeed", Strings.fixed(b.efficiency * b.timeScale * b.block.self.ex_getDynaAttrProdSpd(b.delegee.dynaAttrRs), 2))),
            prov(() => GLB_color.ammo),
            () => b.warmup,
        ));
    };


    /**
     * @private
     * @param {BDynamicWallHarvester} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(b.delegee.dynaAttrRs == null) return;

        b.warmup = Mathf.approachDelta(b.warmup, Number(b.efficiency > 0), 0.025);
        b.totalTime += b.edelta() * b.warmup;

        if(Mathf.chanceDelta(b.block.updateEffectChance * b.warmup * 2.0)) {
            b.delegee.dynaAttrTs.forEachFast(ot => {
                if(Mathf.chance(0.5)) {
                    b.block.updateEffect.at(
                        ot.worldx() + Mathf.range(3.0),
                        ot.worldy() + Mathf.range(3.0),
                        ot.block().getColor(ot),
                    );
                };
            }, true);
        };

        if(b.time += b.edelta() >= b.block.drillTime) {
            b.time %= b.block.drillTime;
            b.self.ex_dynaAttrCraft();
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * A wall crafter that outputs something based on highest attribute.
         * Can output fluids.
         * @class BLK_dynamicWallHarvester
         * @extends BLK_baseHarvester
         * @extends INTF_BLK_dynamicAttributeBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_dynamicWallHarvester")
        .implement(INTF_BLK_dynamicAttributeBlock[0])
        .initTemplate()
        .setParent("WallCrafter")
        .setTags()
        .setParam({


            /**
             * `PARAM`: Liquid production rate, used only if this block produces liquid.
             * @memberof BLK_dynamicWallHarvester
             * @instance
             * @type {number}
             */
            liqProdRate: 0.1,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`: This is a wall crafter, it should only check wall attributes.
             * <br> `REALIZED`
             * @override
             * @memberof BLK_dynamicWallHarvester
             * @instance
             * @type {ENumber}
             */
            attrMode: AttrModes.BLOCK,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_dynamicWallHarvester
             * @instance
             * @type {string}
             */
            attrRcType: "wall",


        })
        .setParamAlias([
            /**
             * `ALIAS`: `updateEffect`.
             * @memberof BLK_dynamicWallHarvester
             * @instance
             * @name updateEff
             * @type {Effect}
             */
            "updateEff", "updateEffect", Fx.none,
            /**
             * `ALIAS`: `updateEffectChance`.
             * @memberof BLK_dynamicWallHarvester
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


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            setBars: function() {
                comp_setBars(this);
            },


            drawPlace: function(tx, ty, rot, valid) {
                // Do nothing
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_dynamicWallHarvester
             * @instance
             * @func
             * @param {Array|unset} contArr
             * @param {number} tx
             * @param {number} ty
             * @param {number} rot
             * @return {Array<Tile>}
             */
            ex_findDynaAttrTs: function(contArr, tx, ty, rot) {
                return SLCPos.getTilesRot(contArr, GLB_var.world.tile(tx, ty), rot, this.size);
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 4,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_dynamicWallHarvester
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


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_dynamicWallHarvester
             * @instance
             * @func
             * @return {number}
             */
            ex_getAttrReq: function() {
                return this.size;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_dynamicWallHarvester
             * @instance
             * @func
             * @return {number}
             */
            ex_getDynaAttrBaseAmt_item: function() {
                return this.size;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_dynamicWallHarvester
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
             * @memberof BLK_dynamicWallHarvester
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
         * @class B_dynamicWallHarvester
         * @extends B_baseHarvester
         * @extends INTF_B_dynamicAttributeBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_dynamicWallHarvester")
        .implement(INTF_BLK_dynamicAttributeBlock[1])
        .initTemplate()
        .setParent("WallCrafter.WallCrafterBuild")
        .setParam({})
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            }
            .setProp({
                noSuper: true,
            }),


            shouldConsume: function() {
                return true;
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
            }),


            draw: function() {
                this.self.ex_drawRcIcon();
            },


            write: function(wr) {
                this.self.ex_processData(wr);
            },


            read: function(rd, revi) {
                if(this.delegee.LCRevi === 5) {
                    rd.s();
                };
                this.self.ex_processData(rd);
            },


            /**
             * `REALIZED`
             * @memberof B_dynamicWallHarvester
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
