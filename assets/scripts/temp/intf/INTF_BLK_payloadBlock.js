/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.payAmtCap < 0.0) blk.payAmtCap = blk.size;

    blk.ex_addLogicGetter(LAccess.payloadCount, b => b.delegee.lastDumpPay == null ? 0 : tryVal(b.delegee.payStockObj[b.delegee.lastDumpPay], 0));
    blk.ex_addLogicGetter(LAccess.payloadType, b => b.delegee.lastDumpPay == null ? null : b.delegee.lastDumpPay.content());
    blk.ex_addLogicGetter(LAccess.totalPayload, b => Object.mapSum(b.delegee.payStockObj, (nmCt, amt) => FRAG_payload._paySize(nmCt) * amt));
    blk.ex_addLogicGetter(LAccess.payloadCapacity, b => blk.payAmtCap);
  };


  function comp_setStats(blk) {
    blk.stats.add(fetchStat("lovec", "blk0fac-payroom"), blk.payAmtCap);
  };


  function comp_onProximityUpdate(b) {
    b.ex_updatePaySite();
  };


  function comp_pickedUp(b) {
    b.payInputBs.clear();
    b.payOutputBs.clear();
  };


  function comp_updateTile(b) {
    if(PARAM.UPDATE_SUPPRESSED) return;

    if(b.hasPayOutput && TIMER.effc) {
      b.payAmtTotal = Object.mapSum(b.payStockObj, (nmCt, amt) => FRAG_payload._paySize(nmCt) * amt);
      b.payAmtTotalAfterProd = Object.mapSum(b.payStockObj, (nmCt, amt) => FRAG_payload._paySize(nmCt) * (amt + b.ex_getPayProdAmt(nmCt)));
    };

    if(b.hasPayInput && TIMER.secHalf) {
      b.payInputBs.forEachCond(
        ob => b.ex_acceptPay(ob, ob.getPayload()),
        ob => {
          let pay = FRAG_payload.takeAt(ob);
          MDL_effect._e_payloadDeposit(ob.x, ob.y, b.x, b.y, pay.content());
          Object.mapIncre(b.payReqObj, pay.content().name);
        },
      );
    };

    // Payload dumping is not affected by {blk.disableDump}, because you cannot manually take payload out of the building
    if(b.hasPayOutput && TIMER.secHalf && b.payOutputBs.length > 0) {
      if(b.lastDumpPay == null) {
        let nmCt = Object.randKey(b.payStockObj);
        if(nmCt != null && b.payStockObj[nmCt] > 0) {
          b.lastDumpPay = FRAG_payload._pay(nmCt, b.team);
        };
      } else {
        let b_t = b.payOutputBs[b.payDumpIncre % b.payOutputBs.length];
        b.payDumpIncre++;
        if(b_t.added && !b_t.isPayload() && FRAG_payload.produceAt(b_t, b.lastDumpPay)) {
          MDL_effect._e_payloadDeposit(b.x, b.y, b_t.x, b_t.y, b.lastDumpPay.content());
          Object.mapIncre(b.payStockObj, b.lastDumpPay.content().name, -1);
          b.lastDumpPay = null;
        };
      };
    };
  };


  function comp_updateEfficiencyMultiplier(b) {
    if(b.hasPayInput && Object.mapSomeSmallerThan(b.payReqObj, (nmCt, amt) => b.ex_getPayConsAmt(nmCt), false)) b.efficiency = 0.0;
  };


  function comp_displayBars(b, tb) {
    if(b.hasPayOutput) {
      tb.add(new Bar(
        prov(() => Core.bundle.format("bar.lovec-bar-pay-cap-amt", (b.payAmtTotal / b.block.delegee.payAmtCap).perc(0))),
        prov(() => Pal.items),
        () => Mathf.clamp(b.payAmtTotal / b.block.delegee.payAmtCap),
      )).growX();
      tb.row();
    };
  };


  function comp_ex_postUpdateEfficiencyMultiplier(b) {
    comp_updateEfficiencyMultiplier(b);
  };


  function comp_ex_updatePaySite(b) {
    FRAG_payload._bsPayInput(b, b.block.delegee.payInputSideFracMode, b.payInputBs);
    FRAG_payload._bsPayOutput(b, b.block.delegee.payOutputSideFracMode, b.payOutputBs);
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


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: Payload capacity. A 2-block large payload takes 2 units, NOT SQUARED.
         * @memberof INTF_BLK_payloadBlock
         * @instance
         */
        payAmtCap: -1.0,
        /**
         * <PARAM>: Determines which sides can be used for input.
         * @memberof INTF_BLK_payloadBlock
         * @instance
         */
        payInputSideFracMode: "non-front",
        /**
         * <PARAM>: Determines which sides can be used for output.
         * @memberof INTF_BLK_payloadBlock
         * @instance
         */
        payOutputSideFracMode: "front",


      }),


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


    }),


    /**
     * @class INTF_B_payloadBlock
     */
    new CLS_interface("INTF_B_payloadBlock", {


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_B_payloadBlock
         * @instance
         */
        hasPayInput: false,
        /**
         * <INTERNAL>
         * @memberof INTF_B_payloadBlock
         * @instance
         */
        hasPayOutput: false,
        /**
         * <INTERNAL>
         * @memberof INTF_B_payloadBlock
         * @instance
         */
        payAmtTotal: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_payloadBlock
         * @instance
         */
        payAmtTotalAfterProd: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_payloadBlock
         * @instance
         */
        payReqObj: prov(() => ({})),
        /**
         * <INTERNAL>
         * @memberof INTF_B_payloadBlock
         * @instance
         */
        payStockObj: prov(() => ({})),
        /**
         * <INTERNAL>
         * @memberof INTF_B_payloadBlock
         * @instance
         */
        payInputBs: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_B_payloadBlock
         * @instance
         */
        payOutputBs: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_B_payloadBlock
         * @instance
         */
        lastDumpPay: null,
        /**
         * <INTERNAL>
         * @memberof INTF_B_payloadBlock
         * @instance
         */
        payDumpIncre: 0,


      }),


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
        return !this.hasPayOutput ? true : this.payAmtTotalAfterProd <= this.block.delegee.payAmtCap;
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
       * @return {void}
       */
      ex_updatePaySite: function() {
        comp_ex_updatePaySite(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Expected consumption amount of some content, for crafters only.
       * <br> <LATER>
       * @memberof INTF_B_payloadBlock
       * @instance
       * @param {string} nmCt
       * @return {number}
       */
      ex_getPayConsAmt: function(nmCt) {
        return 0;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * Expected production amount of some content, for crafters only.
       * <br> <LATER>
       * @memberof INTF_B_payloadBlock
       * @instance
       * @param {string} nmCt
       * @return {number}
       */
      ex_getPayProdAmt: function(nmCt) {
        return 1;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * @memberof INTF_B_payloadBlock
       * @instance
       * @param {Building} b_f
       * @param {Payload} pay
       * @return {boolean}
       */
      ex_acceptPay: function(b_f, pay) {
        return pay != null && this.ex_getPayConsAmt(pay.content().name) / tryVal(this.payReqObj[pay.content().name], 0.0001) > 0.5;
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


      /**
       * @memberof INTF_B_payloadBlock
       * @instance
       * @param {Writes|Reads} wr0rd
       * @return {void}
       */
      ex_processData: function(wr0rd) {
        processData(
          wr0rd, this.LCRevi,
          (wr, revi) => {
            MDL_io._wr_objStrNum(wr, this.payReqObj);
            MDL_io._wr_objStrNum(wr, this.payStockObj);
          },

          (rd, revi) => {
            if(this.LCReviSub === 0 && this.block.ex_isSubInsOf("BLK_baseDrill")) return;

            MDL_io._rd_objStrNum(rd, this.payReqObj);
            MDL_io._rd_objStrNum(rd, this.payStockObj);
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


  ];
