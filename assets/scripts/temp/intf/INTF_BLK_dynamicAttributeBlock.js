/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_dynamicAttributeBlock>} INTFBLKDynamicAttributeBlock
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_dynamicAttributeBlock>} INTFBDynamicAttributeBlock
     * @prop {INTFBLKDynamicAttributeBlock} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKDynamicAttributeBlock} blk
     * @return {void}
     */
    function comp_init(blk) {
        if(blk.delegee.attrRsArr == null) throw new LCError.NullArgumentError(blk.name + ".attrRsArr");

        if(blk instanceof AttributeCrafter) {
            blk.displayEfficiency = false;
        };

        let hasDynaAttrItem = false, hasDynaAttrLiq = false;
        blk.delegee.attrRsArr.forEachRow(2, (nameAttr, nameRs) => {
            if(hasDynaAttrItem && cond2) return;
            let rs = MDL_content.getCt(nameRs, ContentGetModes.RS);
            if(rs == null) return;
            if(!hasDynaAttrItem) hasDynaAttrItem = rs instanceof Item;
            if(!hasDynaAttrLiq) hasDynaAttrLiq = rs instanceof Liquid;
        }, true);
        if(hasDynaAttrItem) {
            blk.delegee.hasDynaAttrItem = true;
        };
        if(hasDynaAttrLiq) {
            blk.delegee.hasDynaAttrLiq = true;
            blk.outputsLiquid = true;
        };

        MDL_event.onLoadPost(() => {
            let rs;
            blk.delegee.attrRsArr.forEachRow(2, (nameAttr, nameRs) => {
                rs = MDL_content.getCt(nameRs, ContentGetModes.RS);
                if(rs == null) return;
                rs instanceof Item ?
                    MDL_recipeDict.addItemProdTerm(blk, rs, blk.self.ex_getDynaAttrProdAmt(rs), 1.0, {time: blk.self.ex_getCraftTime() / blk.delegee.dynaAttrRsEffcMap.get(rs.name, 1.0)}) :
                    MDL_recipeDict.addFldProdTerm(blk, rs, blk.self.ex_getDynaAttrProdAmt(rs) * blk.delegee.dynaAttrRsEffcMap.get(rs.name, 1.0));
            }, true);
        });

        MOD_tmi.regisRc_dynamicAttributeBlock(blk, blk.delegee.attrRsArr, blk.self.ex_getDynaAttrProdTypeStr());
    };


    /**
     * @private
     * @param {INTFBLKDynamicAttributeBlock} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.remove(Stat.tiles);
        stats.remove(Stat.affinities);

        if(blk.delegee.hasDynaAttrItem && !blk.self.ex_getDynaAttrBaseAmt_item().fEqual(0.0)) {
            stats.add(fetchStat("lovec", "blk0fac-prodspd"), blk.self.ex_getDynaAttrBaseAmt_item() / blk.self.ex_getCraftTime(), StatUnit.itemsSecond);
        };
        if(blk.delegee.hasDynaAttrLiq && !blk.self.ex_getDynaAttrBaseAmt_liq().fEqual(0.0)) {
            stats.add(fetchStat("lovec", "blk0fac-prodspd"), blk.self.ex_getDynaAttrBaseAmt_liq() * 60.0, StatUnit.liquidSecond);
        };

        stats.add(fetchStat("lovec", "blk-attrreq"), newStatValue(tb => {
            tb.row();
            MDL_table.setAttr(tb, MDL_attr.getAttrsInAttrRsArr(blk.delegee.attrRsArr));
        }));
        stats.add(fetchStat("lovec", "blk-attroutput"), newStatValue(tb => {
            tb.row();
            MDL_table.setTable(tb, (function() {
                let matArr = [[
                    "",
                    MDL_bundle.getTerm("lovec", "resource"),
                    fetchStat("lovec", "blk-attrreq").localized(),
                    MDL_bundle.getTerm("lovec", "efficiency-multiplier"),
                ]];
                let rs;
                blk.delegee.attrRsArr.forEachRow(2, (nameAttr, nameRs) => {
                    rs = MDL_content.getCt(nameRs, ContentGetModes.RS);
                    if(rs == null) return;
                    matArr.push([rs, rs.localizedName, MDL_attr.getAttrBundle(nameAttr), blk.delegee.dynaAttrRsEffcMap.get(rs.name, 1.0).percColor(0)]);
                }, true);
                return matArr;
            })());
        }));
    };


    /**
     * @private
     * @param {INTFBLKDynamicAttributeBlock} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        blk.removeBar("efficiency");
        blk.addBar("efficiency", b => new Bar(
            prov(() => Core.bundle.format("bar.efficiency", Math.round(b.delegee.dynaAttrEffc * 100.0))),
            prov(() => Pal.lightOrange),
            () => Mathf.clamp(b.delegee.dynaAttrEffc),
        ));
    };


    /**
     * @private
     * @param {INTFBLKDynamicAttributeBlock} blk
     * @param {Tile} t
     * @param {Team} team
     * @param {number} rot
     * @return {boolean}
     */
    function comp_canPlaceOn(blk, t, team, rot) {
        return t != null && blk.self.ex_getAttrSum(t.x, t.y, rot) > 0.0;
    };


    /**
     * @private
     * @param {INTFBLKDynamicAttributeBlock} blk
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @param {boolean} valid
     * @return {void}
     */
    function comp_drawPlace(blk, tx, ty, rot, valid) {
        if(!blk.delegee.shouldDrawDynaAttrText) return;
        LCDrawf.textPlace(
            blk, tx, ty,
            Core.bundle.format("bar.efficiency", Math.round(blk.self.ex_getAttrSum(tx, ty, rot) / blk.self.ex_getAttrReq() * 100.0)),
            valid, blk.delegee.dynaAttrTextOffTy,
        );
    };


    /**
     * @private
     * @param {INTFBLKDynamicAttributeBlock} blk
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @return {number}
     */
    const comp_ex_getAttrSum = function thisFun(blk, tx, ty, rot) {
        let t = GLB_var.world.tile(tx, ty);
        if(t == null) return 0.0;
        if(LCNativeArray.checkTupChange(thisFun.tmpTup, blk, t, rot)) {
            let tup = MDL_attr.getDynaAttrTup(thisFun.tmpDynaAttrTup, blk.delegee.attrRsArr, blk.self.ex_findDynaAttrTs(blk.delegee.dynaAttrTmpTs, tx, ty, rot), blk.delegee.attrMode);
            thisFun.tmpSum = tryVal(tup[1], 0.0);
        };
        return thisFun.tmpSum;
    }
    .setProp({
        /**
         * @memberof comp_ex_getAttrSum
         * @type {[Block, Tile, number]}
         */
        tmpTup: [],
        /**
         * @memberof comp_ex_getAttrSum
         * @type {[Attribute, number, Resource]}
         */
        tmpDynaAttrTup: [],
        /**
         * @memberof comp_ex_getAttrSum
         * @type {number}
         */
        tmpSum: 0.0,
    });


    /**
     * @private
     * @param {INTFBDynamicAttributeBlock} b
     * @return {void}
     */
    const comp_onProximityUpdate = function thisFun(b) {
        b.delegee.dynaAttrTs = b.block.self.ex_findDynaAttrTs(b.delegee.dynaAttrTs, b.tileX(), b.tileY(), b.rotation);
        let tup = MDL_attr.getDynaAttrTup(thisFun.tmpDynaAttrTup, b.block.delegee.attrRsArr, b.delegee.dynaAttrTs, b.block.delegee.attrMode);
        if(tup == null) {
            b.delegee.dynaAttrSum = 0.0;
            b.delegee.dynaAttrRs = null;
        } else {
            b.delegee.dynaAttrSum = tup[1];
            b.delegee.dynaAttrRs = tup[2];
        };
        b.delegee.dynaAttrEffc = b.delegee.dynaAttrSum / b.block.self.ex_getAttrReq();
    }
    .setProp({
        /**
         * @memberof comp_onProximityUpdate
         * @type {[Attribute, number, Resource]}
         */
        tmpDynaAttrTup: [],
    });


    /**
     * @private
     * @param {INTFBDynamicAttributeBlock} b
     * @return {void}
     */
    function comp_pickedUp(b) {
        b.delegee.dynaAttrSum = 0.0;
        b.delegee.dynaAttrRs = null;
        b.delegee.dynaAttrEffc = 0.0;
    };


    /**
     * @private
     * @param {INTFBDynamicAttributeBlock} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(b.delegee.dynaAttrRs == null) return;
        if(b.delegee.dynaAttrRs instanceof Liquid && b.liquids != null) {
            if(b.liquids.get(b.delegee.dynaAttrRs) < b.block.liquidCapacity) {
                b.handleLiquid(b, b.delegee.dynaAttrRs, b.block.self.ex_getDynaAttrProdAmt(b.delegee.dynaAttrRs) * b.getProgressIncrease(1.0));
            };
            b.dumpLiquid(b.delegee.dynaAttrRs, 2.0);
        };
        if(b.delegee.dynaAttrRs instanceof Item && b.items != null) {
            b.delegee.dumpTimeCur += b.delta();
            if(b.delegee.dumpTimeCur >= b.block.dumpTime) {
                b.delegee.dumpTimeCur %= b.block.dumpTime;
                b.dump(b.delegee.dynaAttrRs);
            };
        };
    };


    /**
     * @private
     * @param {INTFBDynamicAttributeBlock} b
     * @return {void}
     */
    function comp_updateEfficiencyMultiplier(b) {
        b.efficiency *= b.delegee.dynaAttrEffc;
        if(b.delegee.dynaAttrRs != null) {
            // noinspection JSValidateTypes
            b.efficiency *= b.block.delegee.dynaAttrRsEffcMap.get(b.delegee.dynaAttrRs.name, 1.0);
        };
    };


    /**
     * @private
     * @param {INTFBDynamicAttributeBlock} b
     * @return {boolean}
     */
    function comp_shouldConsume(b) {
        return b.delegee.dynaAttrRs instanceof Liquid ?
            (b.liquids != null && b.liquids.get(b.delegee.dynaAttrRs) < b.block.liquidCapacity) :
            b.delegee.dynaAttrRs instanceof Item ?
                (b.items != null && b.items.get(b.delegee.dynaAttrRs) <= b.getMaximumAccepted(b.delegee.dynaAttrRs) - b.block.self.ex_getDynaAttrProdAmt(b.delegee.dynaAttrRs)) :
                true;
    };


    /**
     * @private
     * @param {INTFBDynamicAttributeBlock} b
     * @param {number} time
     * @return {number}
     */
    function comp_getProgressIncrease(b, time) {
        return 1.0 / time * b.edelta();
    };


    /**
     * @private
     * @param {INTFBDynamicAttributeBlock} b
     * @return {void}
     */
    function comp_ex_postUpdateEfficiencyMultiplier(b) {
        comp_updateEfficiencyMultiplier(b);
    };


    /**
     * @private
     * @param {INTFBDynamicAttributeBlock} b
     * @return {void}
     */
    function comp_ex_dynaAttrCraft(b) {
        if(!(b.delegee.dynaAttrRs instanceof Item) || b.items == null) return;
        FRAG_item.produceItem(b, b.delegee.dynaAttrRs, b.block.self.ex_getDynaAttrProdAmt(b.delegee.dynaAttrRs));
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Used for blocks that outputs resource dynamically based on attribute.
         * @class INTF_BLK_dynamicAttributeBlock
         */
        new CLS_interface("INTF_BLK_dynamicAttributeBlock", {


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: Determines type of blocks to check attribute. See {@link AttrModes}.
                     * @memberof INTF_BLK_dynamicAttributeBlock
                     * @instance
                     * @type {ENumber}
                     */
                    attrMode: AttrModes.FLOOR,
                    /**
                     * `PARAM`: Determines how efficiency is calculated. See {@link AttrRecipeTypes}.
                     * @memberof INTF_BLK_dynamicAttributeBlock
                     * @instance
                     * @type {ENumber}
                     */
                    attrRcType: AttrRecipeTypes.FLOOR,
                    /**
                     * `PARAM`: Attribute-resource map used to determine output. See {@link DB_item.db.map.attr}.
                     * @memberof INTF_BLK_dynamicAttributeBlock
                     * @instance
                     * @type {F2Array<string, ResourceGn>}
                     */
                    attrRsArr: null,
                    /**
                     * `PARAM`: Used to add efficiency multipliers for specific outputs.
                     * @memberof INTF_BLK_dynamicAttributeBlock
                     * @instance
                     * @type {TDynamic<ObjectMap<string, number>>}
                     */
                    dynaAttrRsEffcMap: tprov(() => new ObjectMap()),
                    /**
                     * `PARAM`: Whether efficiency text should be shown in `drawPlace`.
                     * @memberof INTF_BLK_dynamicAttributeBlock
                     * @instance
                     * @type {boolean}
                     */
                    shouldDrawDynaAttrText: true,
                    /**
                     * `PARAM`: Integer offset of the efficiency text in `blk.drawPlace`.
                     * @memberof INTF_BLK_dynamicAttributeBlock
                     * @instance
                     * @type {number}
                     */
                    dynaAttrTextOffTy: 0,


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`
                     * @memberof INTF_BLK_dynamicAttributeBlock
                     * @instance
                     * @type {boolean}
                     */
                    hasDynaAttrItem: false,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_BLK_dynamicAttributeBlock
                     * @instance
                     * @type {boolean}
                     */
                    hasDynaAttrLiq: false,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_BLK_dynamicAttributeBlock
                     * @instance
                     * @type {TDynamic<Array<Tile>>}
                     */
                    dynaAttrTmpTs: tprov(() => []),


                };
            },


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
                noSuper: true,
                boolMode: "and",
            }),


            drawPlace: function(tx, ty, rot, valid) {
                comp_drawPlace(this, tx, ty, rot, valid);
            },


            /**
             * Expected list of tiles for attribute calculation.
             * <br> `LATER`
             * @memberof INTF_BLK_dynamicAttributeBlock
             * @instance
             * @func
             * @param {Array|unset} contArr
             * @param {number} tx
             * @param {number} ty
             * @param {number} rot
             * @return {Array<Tile>}
             */
            ex_findDynaAttrTs: function(contArr, tx, ty, rot) {
                return contArr.clear();
            }
            .setProp({
                noSuper: true,
                argLen: 4,
            }),


            /**
             * Expected craft time of this block.
             * <br> `LATER`
             * @memberof INTF_BLK_dynamicAttributeBlock
             * @instance
             * @func
             * @return {number}
             */
            ex_getCraftTime: function() {
                return Number.n8;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Calculates attribute sum.
             * @memberof INTF_BLK_dynamicAttributeBlock
             * @instance
             * @func
             * @param {number} tx
             * @param {number} ty
             * @param {number} rot
             * @return {number}
             */
            ex_getAttrSum: function(tx, ty, rot) {
                return comp_ex_getAttrSum(this, tx, ty, rot);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * Expected attribute sum at which efficiency reaches 1.0.
             * <br> `LATER`
             * @memberof INTF_BLK_dynamicAttributeBlock
             * @instance
             * @func
             * @return {number}
             */
            ex_getAttrReq: function() {
                return this.delegee.attrRcType === AttrRecipeTypes.PROP ? 1.0 : MDL_attr.getAttrReq(this.size, 1.0, this.delegee.attrRcType === AttrRecipeTypes.WALL);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * Gets output amount of dynamic attribute resource.
             * @memberof INTF_BLK_dynamicAttributeBlock
             * @instance
             * @func
             * @param {Resource|null} rs
             * @return {number}
             */
            ex_getDynaAttrProdAmt: function(rs) {
                return rs == null ?
                    0.0 :
                    rs instanceof Item ?
                        this.self.ex_getDynaAttrBaseAmt_item() :
                        this.self.ex_getDynaAttrBaseAmt_liq();
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * Gets output rate of dynamic attribute resource.
             * @memberof INTF_BLK_dynamicAttributeBlock
             * @instance
             * @func
             * @param {Resource|null} rs
             * @return {number}
             */
            ex_getDynaAttrProdSpd: function(rs) {
                return rs == null ?
                    0.0 :
                    (
                        rs instanceof Item ?
                            this.self.ex_getDynaAttrBaseAmt_item() / this.self.ex_getCraftTime() :
                            this.self.ex_getDynaAttrBaseAmt_liq() * 60.0
                    ) * this.delegee.dynaAttrRsEffcMap.get(rs.name, 1.0);
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * Expected base production amount for dynamic attribute items.
             * <br> `LATER`
             * @memberof INTF_BLK_dynamicAttributeBlock
             * @instance
             * @func
             * @return {number}
             */
            ex_getDynaAttrBaseAmt_item: function() {
                return 0;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Expected base production rate for dynamic attribute liquids.
             * <br> `LATER`
             * @memberof INTF_BLK_dynamicAttributeBlock
             * @instance
             * @func
             * @return {number}
             */
            ex_getDynaAttrBaseAmt_liq: function() {
                return 0.0;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Expected production type used in TMI.
             * <br> `LATER`
             * @memberof INTF_BLK_dynamicAttributeBlock
             * @instance
             * @func
             * @return {String|null}
             */
            ex_getDynaAttrProdTypeStr: function() {
                return null;
            }
            .setProp({
                noSuper: true,
            }),


        }),


        /**
         * @class INTF_B_dynamicAttributeBlock
         */
        new CLS_interface("INTF_B_dynamicAttributeBlock", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`: Current dynamic attribute resource to output.
                     * @memberof INTF_B_dynamicAttributeBlock
                     * @instance
                     * @type {Resource|null}
                     */
                    dynaAttrRs: null,
                    /**
                     * `INTERNAL`: Attribute sum of current dynamic attribute.
                     * @memberof INTF_B_dynamicAttributeBlock
                     * @instance
                     * @type {number}
                     */
                    dynaAttrSum: 0.0,
                    /**
                     * `INTERNAL`: Dynamic attribute efficiency.
                     * @memberof INTF_B_dynamicAttributeBlock
                     * @instance
                     * @type {number}
                     */
                    dynaAttrEffc: 0.0,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_dynamicAttributeBlock
                     * @instance
                     * @type {TDynamic<Array<Tile>>}
                     */
                    dynaAttrTs: tprov(() => []),


                };
            },


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


            shouldConsume: function() {
                return comp_shouldConsume(this);
            }
            .setProp({
                boolMode: "and",
            }),


            getProgressIncrease: function(time) {
                return comp_getProgressIncrease(this, time);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            efficiencyScale: function() {
                return 1.0;
            }
            .setProp({
                noSuper: true,
            }),


            ex_postUpdateEfficiencyMultiplier: function() {
                comp_ex_postUpdateEfficiencyMultiplier(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Call this method if the building crafts!
             * @memberof INTF_B_dynamicAttributeBlock
             * @instance
             * @func
             * @return {void}
             */
            ex_dynaAttrCraft: function() {
                comp_ex_dynaAttrCraft(this);
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
