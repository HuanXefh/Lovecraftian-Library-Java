/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Lovec payload block that stores payload as abstract data.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");


  const FRAG_payload = require("lovec/frag/FRAG_payload");


  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_io = require("lovec/mdl/MDL_io");


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
    if(PARAM.updateSuppressed) return;

    if(b.hasPayOutput && TIMER.effc) {
      b.payAmtTotal = Object.mapSum(b.payStockObj, (nmCt, amt) => FRAG_payload._paySize(nmCt) * amt);
      b.payAmtTotalAfterProd = Object.mapSum(b.payStockObj, (nmCt, amt) => FRAG_payload._paySize(nmCt) * (amt + b.ex_getPayProdAmt(nmCt)));
    };

    if(b.hasPayInput && TIMER.secHalf) {
      b.payInputBs.forEachCond(
        ob => b.ex_acceptPay(ob, ob.getPayload()),
        ob => {
          let pay = FRAG_payload.takeAt(ob);
          b.payReqObj[pay.content().name] = tryVal(b.payReqObj[pay.content().name], 0) + 1;
          MDL_effect.showBetween_payloadDeposit(ob.x, ob.y, b.x, b.y, pay.content());
        },
      );
    };

    // Payload dumping is not affected by {blk.disableDump}, because you cannot manually take payload out of the building
    if(b.hasPayOutput && TIMER.secHalf && b.payOutputBs.length > 0) {
      if(b.lastDumpPay == null) {
        let nmCt = Object.randKey(b.payStockObj);
        if(nmCt != null) {
          b.lastDumpPay = FRAG_payload._pay(nmCt, b.team);
        };
      } else {
        let b_t = b.payOutputBs[b.payDumpIncre % b.payOutputBs.length];
        b.payDumpIncre++;
        if(b_t.added && !b_t.isPayload() && FRAG_payload.produceAt(b_t, b.lastDumpPay)) {
          MDL_effect.showBetween_payloadDeposit(b.x, b.y, b_t.x, b_t.y, b.lastDumpPay.content());
          b.payStockObj[b.lastDumpPay.content().name] = tryVal(b.payStockObj[b.lastDumpPay.content().name], 0) - 1;
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
    FRAG_payload._bsPayInput(b, b.payInputBs);
    FRAG_payload._bsPayOutput(b, b.payOutputBs);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        // @PARAM: How many payloads of each type this block can hold. A 2-sized block takes 2 payload amount units.
        payAmtCap: -1.0,
      }),


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        hasPayInput: false,
        hasPayOutput: false,
        payAmtTotal: 0.0,
        payAmtTotalAfterProd: 0.0,
        payReqObj: prov(() => ({})),
        payStockObj: prov(() => ({})),
        payInputBs: prov(() => []),
        payOutputBs: prov(() => []),
        lastDumpPay: null,
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
        return this.enabled && (!this.hasPayOutput ? true : this.payAmtTotalAfterProd <= this.block.delegee.payAmtCap);
      }
      .setProp({
        noSuper: true,
        boolMode: "and",
      }),


      displayBars: function(tb) {
        comp_displayBars(this, tb);
      },


      ex_postUpdateEfficiencyMultiplier: function() {
        comp_ex_postUpdateEfficiencyMultiplier(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_updatePaySite: function() {
        comp_ex_updatePaySite(this);
      }
      .setProp({
        noSuper: true,
      }),


      // @LATER
      ex_getPayConsAmt: function(nmCt) {
        return 0;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      // @LATER
      ex_getPayProdAmt: function(nmCt) {
        return 1;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      ex_acceptPay: function(b_f, pay) {
        return pay != null && this.ex_getPayConsAmt(pay.content().name) / tryVal(this.payReqObj[pay.content().name], 0.0001) > 0.5;
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


      ex_processData: function(wr0rd, LCRevi) {
        processData(
          wr0rd, LCRevi,
          (wr, revi) => {
            MDL_io._wr_objStrNum(wr, this.payReqObj);
            MDL_io._wr_objStrNum(wr, this.payStockObj);
          },

          (rd, revi) => {
            if(revi >= 5) {
              MDL_io._rd_objStrNum(rd, this.payReqObj);
              MDL_io._rd_objStrNum(rd, this.payStockObj);
            };
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
