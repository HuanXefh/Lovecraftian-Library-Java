/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A pump used specifically for depth liquid deposits.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_liquidPump");
  const INTF = require("lovec/temp/intf/INTF_BLK_dynamicAttributeBlock");
  const INTF_A = require("lovec/temp/intf/INTF_BLK_depthOreHandler");
  const INTF_B = require("lovec/temp/intf/INTF_BLK_oreScannerHandler");


  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  const DB_item = require("lovec/db/DB_item");


  /* <---------- component ----------> */


  function comp_load(blk) {
    blk.liqReg = fetchRegionOrNull(blk, "-liquid");
  };


  function comp_setBars(blk) {
    blk.removeBar("liquid");
    blk.addBar("liquid", b => new Bar(
      b.delegee.dynaAttrRs != null ? b.delegee.dynaAttrRs.localizedName : Core.bundle.get("bar.liquid"),
      b.delegee.dynaAttrRs != null ? tryVal(b.delegee.dynaAttrRs.barColor, b.delegee.dynaAttrRs.color) : Color.clear,
      () => b.delegee.dynaAttrRs == null ? 0.0 : Mathf.clamp(b.liquids.get(b.delegee.dynaAttrRs) / blk.liquidCapacity),
    ));
  };


  const comp_canPlaceOn = function thisFun(blk, t, team, rot) {
    if(t == null) return false;

    if(Array.someMismatch(thisFun.tmpTup, true, blk, t, team, rot)) {
      thisFun.tmpTup[4] = blk.ex_anyDeporeRevealed(t.x, t.y, "liquid");
    };

    return thisFun.tmpTup[4];
  }
  .setProp({
    tmpTup: [],
  });


  function comp_created(b) {
    b.requiresScanner = true;
  };


  function comp_draw(b) {
    if(b.dynaAttrRs == null) return;

    MDL_draw._reg_normal(b.x, b.y, b.block.delegee.liqReg, 0.0, 1.0, b.dynaAttrRs, b.liquids.get(b.dynaAttrRs));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_depthPump").implement(INTF[0]).implement(INTF_A[0]).implement(INTF_B[0]).initClass()
    .setParent(AttributeCrafter)
    .setTags("blk-pump")
    .setParam({
      // @PARAM: Pump rate (per frame).
      liqProdRate: 0.0,

      liqReg: null,
      attrMode: "overlay",
      attrRsMap: DB_item.db["map"]["attr"]["dpliq"],
      shouldDrawDynaAttrText: false,
    })
    .setMethod({


      load: function() {
        comp_load(this);
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


      ex_findDynaAttrTs: function(contArr, tx, ty, rot) {
        return MDL_pos._tsBlock(this, tx, ty, contArr);
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 4,
      }),


      ex_getDynaAttrBaseAmt_liq: function() {
        return this.liqProdRate;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_depthPump").implement(INTF[1]).implement(INTF_A[1]).implement(INTF_B[1]).initClass()
    .setParent(AttributeCrafter.AttributeCrafterBuild)
    .setParam({})
    .setMethod({


      created: function() {
        comp_created(this);
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


      write: function thisFun(wr) {
        // I have to write revision twice
        let LCRevi = processRevision(wr);
        thisFun.funPrev.apply(this, [wr]);
      }
      .setProp({
        override: true,
      }),


      read: function thisFun(rd, revi) {
        // This hell is for backwards compatibility, I can't understand it either
        let LCRevi = processRevision(rd);
        if(LCRevi < 1) {
          rd.f();
          thisFun.funPrev.apply(this, [rd, revi]);
          rd.s();
          return;
        };

        thisFun.funPrev.apply(this, [rd, revi]);
      }
      .setProp({
        override: true,
      }),


    }),


  ];
