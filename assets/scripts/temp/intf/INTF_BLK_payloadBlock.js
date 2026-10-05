/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_payloadBlock>} INTFBLKPayloadBlock
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_payloadBlock>} INTFBPayloadBlock
     * @prop {INTFBLKPayloadBlock} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKPayloadBlock} blk
     * @return {void}
     */
    function comp_init(blk) {
        if(blk.delegee.payAmtCap < 0.0) {
            blk.delegee.payAmtCap = blk.self.ex_calcPayRoomDef();
        };

        blk.self.ex_addLogicF(LogicProp.payloadCount, b => b.delegee.lastDumpPay == null ? 0 : tryVal(b.delegee.payStockObj[b.delegee.lastDumpPay], 0));
        blk.self.ex_addLogicF(LogicProp.payloadType, b => b.delegee.lastDumpPay == null ? null : b.delegee.lastDumpPay.content());
        blk.self.ex_addLogicF(LogicProp.totalPayload, b => LCNativeObject.numSum(b.delegee.payStockObj, floatf2((nameCt, amt) => FRAG_payload.getPaySize(nameCt) * amt)));
        blk.self.ex_addLogicF(LogicProp.payloadCapacity, b => blk.delegee.payAmtCap);
    };


    /**
     * @private
     * @param {INTFBLKPayloadBlock} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(fetchStat("lovec", "blk0fac-payroom"), blk.delegee.payAmtCap);
    };


    /**
     * @private
     * @param {INTFBPayloadBlock} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        b.self.ex_updatePaySite();

        Object.eachPair(b.delegee.payReqObj, (nameCt, amt) => {
            if(amt < 0) {
                b.delegee.payReqObj[nameCt] = 0;
            };
        });
        Object.eachPair(b.delegee.payStockObj, (nameCt, amt) => {
            if(amt < 0) {
                b.delegee.payStockObj[nameCt] = 0;
            };
        });
    };


    /**
     * @private
     * @param {INTFBPayloadBlock} b
     * @return {void}
     */
    function comp_pickedUp(b) {
        b.delegee.payInputBs.clear();
        b.delegee.payOutputBs.clear();
    };


    /**
     * @private
     * @param {INTFBPayloadBlock} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(GLB_param.UPDATE_SUPPRESSED) return;

        if(b.delegee.hasPayOutput && GLB_timer.effcPay) {
            b.delegee.payAmtTotal = LCNativeObject.numSum(b.delegee.payStockObj, floatf2((nameCt, amt) => FRAG_payload.getPaySize(nameCt) * amt));
            b.delegee.payAmtTotalAfterProd = LCNativeObject.numSum(b.delegee.payStockObj, floatf2((nameCt, amt) => FRAG_payload.getPaySize(nameCt) * (amt + b.self.ex_getPayProdAmt(nameCt))));
        };

        if(GLB_timer.secHalf && b.delegee.hasPayInput) {
            b.delegee.payInputBs.forEachFast(ob => {
                b.self.ex_takePay(ob);
            }, true);
        };

        // Payload dumping is not affected by `blk.disableDump`, because you cannot manually take payload out of the building
        if(b.delegee.hasPayOutput && GLB_timer.secHalf && b.delegee.payOutputBs.length > 0) {
            if(b.delegee.lastDumpPay == null) {
                let nameCt = Object.randKey(b.delegee.payStockObj);
                if(nameCt != null && b.delegee.payStockObj[nameCt] > 0) {
                    b.delegee.lastDumpPay = FRAG_payload.makePay(nameCt, b.team);
                };
            } else {
                let b_t = b.delegee.payOutputBs[b.delegee.payDumpIncre % b.delegee.payOutputBs.length];
                b.delegee.payDumpIncre++;
                if(b_t.isAdded() && !b_t.isPayload() && FRAG_payload.produceAt(b_t, b.delegee.lastDumpPay)) {
                    MDL_effect.payloadDeposit(b.x, b.y, b_t.x, b_t.y, b.delegee.lastDumpPay.content(), true);
                    LCNativeObject.numIncre(b.delegee.payStockObj, b.delegee.lastDumpPay.content().name, -1);
                    b.delegee.lastDumpPay = null;
                };
            };
        };
    };


    /**
     * @private
     * @param {INTFBPayloadBlock} b
     * @return {void}
     */
    function comp_updateEfficiencyMultiplier(b) {
        if(b.delegee.hasPayInput && !b.self.ex_checkPayCons()) {
            b.efficiency = 0.0;
        };
    };


    /**
     * @private
     * @param {INTFBPayloadBlock} b
     * @param {Table} tb
     * @return {void}
     */
    function comp_displayBars(b, tb) {
        if(b.delegee.hasPayOutput) {
            tb.add(new Bar(
                prov(() => Core.bundle.format("bar.lovec-bar-pay-cap-amt", (b.delegee.payAmtTotal / b.block.delegee.payAmtCap).perc(0))),
                prov(() => Pal.items),
                () => Mathf.clamp(b.delegee.payAmtTotal / b.block.delegee.payAmtCap),
            )).growX();
            tb.row();
        };
    };


    /**
     * @private
     * @param {INTFBPayloadBlock} b
     * @return {void}
     */
    function comp_ex_postUpdateEfficiencyMultiplier(b) {
        comp_updateEfficiencyMultiplier(b);
    };


    /**
     * @private
     * @param {INTFBPayloadBlock} b
     * @return {void}
     */
    function comp_ex_updatePaySite(b) {
        FRAG_payload.findPayInputBs(b.delegee.payInputBs, b, b.block.delegee.payInputSideFracMode);
        FRAG_payload.findPayOutputBs(b.delegee.payOutputBs, b, b.block.delegee.payOutputSideFracMode);
    };


    /**
     * @private
     * @param {INTFBPayloadBlock} b
     * @param {Building} b_f
     * @return {void}
     */
    function comp_ex_takePay(b, b_f) {
        if(!b.self.ex_acceptPay(b_f, b_f.getPayload())) return;
        let pay = FRAG_payload.takeAt(b_f);
        MDL_effect.payloadDeposit(b_f.x, b_f.y, b.x, b.y, pay.content(), false);
        LCNativeObject.numIncre(b.delegee.payReqObj, pay.content().name);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Lovec payload block that stores payload as abstract data.
         * @class INTF_BLK_payloadBlock
         */
        new CLS_interface("INTF_BLK_payloadBlock", {


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: Payload capacity. A 2-block large payload takes 2 units, NON-SQUARED.
                     * @memberof INTF_BLK_payloadBlock
                     * @instance
                     * @type {number}
                     */
                    payAmtCap: -1.0,
                    /**
                     * `PARAM`: Determines which sides can be used for input.
                     * @memberof INTF_BLK_payloadBlock
                     * @instance
                     * @type {ENumber}
                     */
                    payInputSideFracMode: SideFracModes.FRONT,
                    /**
                     * `PARAM`: Determines which sides can be used for output.
                     * @memberof INTF_BLK_payloadBlock
                     * @instance
                     * @type {ENumber}
                     */
                    payOutputSideFracMode: SideFracModes.FRONT,


                };
            },


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            /**
             * Calculates default payload room for this block.
             * @memberof INTF_BLK_payloadBlock
             * @instance
             * @func
             * @return {number}
             */
            ex_calcPayRoomDef: function() {
                return this.size;
            }
            .setProp({
                noSuper: true,
            }),


        }),


        /**
         * @class INTF_B_payloadBlock
         */
        new CLS_interface("INTF_B_payloadBlock", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_payloadBlock
                     * @instance
                     * @type {boolean}
                     */
                    hasPayInput: false,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_payloadBlock
                     * @instance
                     * @type {boolean}
                     */
                    hasPayOutput: false,
                    /**
                     * `INTERNAL`: Total payload room used.
                     * @memberof INTF_B_payloadBlock
                     * @instance
                     * @type {number}
                     */
                    payAmtTotal: 0.0,
                    /**
                     * `INTERNAL`: Total payload room used after production.
                     * @memberof INTF_B_payloadBlock
                     * @instance
                     * @type {number}
                     */
                    payAmtTotalAfterProd: 0.0,
                    /**
                     * `INTERNAL`: Whether it's expected to consume payload currently.
                     * @memberof INTF_B_payloadBlock
                     * @instance
                     * @type {boolean}
                     */
                    payConsValid: false,
                    /**
                     * `INTERNAL`: Stores payloads to be consumed.
                     * @memberof INTF_B_payloadBlock
                     * @instance
                     * @type {TDynamic<Object<string, number>>}
                     */
                    payReqObj: tprov(() => ({})),
                    /**
                     * `INTERNAL`: Stores payloads produced.
                     * @memberof INTF_B_payloadBlock
                     * @instance
                     * @type {TDynamic<Object<string, number>>}
                     */
                    payStockObj: tprov(() => ({})),
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_payloadBlock
                     * @instance
                     * @type {TDynamic<Array<Building>>}
                     */
                    payInputBs: tprov(() => []),
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_payloadBlock
                     * @instance
                     * @type {TDynamic<Array<Building>>}
                     */
                    payOutputBs: tprov(() => []),
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_payloadBlock
                     * @instance
                     * @type {Payload|null}
                     */
                    lastDumpPay: null,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_payloadBlock
                     * @instance
                     * @type {number}
                     */
                    payDumpIncre: 0,


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
                return !this.delegee.hasPayOutput || this.delegee.payAmtTotalAfterProd <= this.block.delegee.payAmtCap;
            }
            .setProp({
                boolMode: "and",
            }),


            displayBars: function(tb) {
                comp_displayBars(this, tb);
            },


            /**
             * @memberof INTF_B_payloadBlock
             * @instance
             * @func
             * @return {void}
             */
            ex_postUpdateEfficiencyMultiplier: function() {
                comp_ex_postUpdateEfficiencyMultiplier(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_payloadBlock
             * @instance
             * @func
             * @return {void}
             */
            ex_updatePaySite: function() {
                comp_ex_updatePaySite(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Tries taking payload from a building.
             * @memberof INTF_B_payloadBlock
             * @instance
             * @func
             * @param {Building} b_f
             * @return {void}
             */
            ex_takePay: function(b_f) {
                comp_ex_takePay(this, b_f);
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * Checks if payload requirement is met.
             * @memberof INTF_B_payloadBlock
             * @instance
             * @func
             * @return {boolean}
             */
            ex_checkPayCons: function() {
                if(GLB_timer.effcPay) {
                    this.delegee.payConsValid = LCNativeObject.numAllLargerThan(this.delegee.payReqObj, floatf2((nameCt, amt) => this.self.ex_getPayConsAmt(nameCt)), true);
                };
                return this.delegee.payConsValid;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Expected consumption amount of some content, for crafters only.
             * <br> `LATER`
             * @memberof INTF_B_payloadBlock
             * @instance
             * @func
             * @param {string} nameCt
             * @return {number}
             */
            ex_getPayConsAmt: function(nameCt) {
                return 0;
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * Expected production amount of some content, for crafters only.
             * <br> `LATER`
             * @memberof INTF_B_payloadBlock
             * @instance
             * @func
             * @param {string} nameCt
             * @return {number}
             */
            ex_getPayProdAmt: function(nameCt) {
                return 1;
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * Whether this block accepts given payload.
             * @memberof INTF_B_payloadBlock
             * @instance
             * @func
             * @param {Building} b_f
             * @param {Payload} pay
             * @return {boolean}
             */
            ex_acceptPay: function(b_f, pay) {
                return pay != null && this.self.ex_getPayConsAmt(pay.content().name) / tryVal(this.delegee.payReqObj[pay.content().name], 0.0001) > 0.5;
            }
            .setProp({
                noSuper: true,
                argLen: 2,
            }),


            /**
             * @memberof INTF_B_payloadBlock
             * @instance
             * @func
             * @param {Writes|Reads} wr0rd
             * @return {void}
             */
            ex_processData: function(wr0rd) {
                processData(
                    wr0rd,
                    wr => {
                        MDL_io.objStrNum(wr, this.delegee.payReqObj);
                        MDL_io.objStrNum(wr, this.delegee.payStockObj);
                    },
                    rd => {
                        if(this.delegee.LCReviSub >= 0 || !this.block.self.ex_isSubInsOf("BLK_baseDrill")) {
                            MDL_io.objStrNum(rd, this.delegee.payReqObj);
                            MDL_io.objStrNum(rd, this.delegee.payStockObj);
                        };
                    },
                );
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


        }),


    ];
