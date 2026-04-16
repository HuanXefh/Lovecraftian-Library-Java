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

    if(checkTupChange(thisFun.tmpTup, true, blk, t, team, rot)) {
      thisFun.tmpTup[4] = blk.ex_anyDporeRevealed(t.x, t.y, "liquid");
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


    /**
     * A pump used specifically for depth liquid deposits.
     * @class BLK_depthPump
     * @extends BLK_liquidPump
     * @extends INTF_BLK_dynamicAttributeBlock
     * @extends INTF_BLK_depthOreHandler
     * @extends INTF_BLK_oreScannerHandler
     */
    newClass().extendClass(PARENT[0], "BLK_depthPump").implement(INTF[0]).implement(INTF_A[0]).implement(INTF_B[0]).initClass()
    .setParent(AttributeCrafter)
    .setTags("blk-pump")
    .setParam({


      /**
       * <PARAM>: Pump rate.
       * @memberof BLK_depthPump
       * @instance
       */
      liqProdRate: 0.0,


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof BLK_depthPump
       * @instance
       */
      liqReg: null,
      /**
       * <INTERNAL>
       * @memberof  BLK_depthPump
       * @instance
       */
      attrMode: MDL_attr.AttrModes.OVERLAY,
      /**
       * <INTERNAL>
       * @memberof  BLK_depthPump
       * @instance
       */
      attrRsArr: DB_item.db["map"]["attr"]["dpliq"],
      /**
       * <INTERNAL>
       * @memberof  BLK_depthPump
       * @instance
       */
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


      ex_getCraftTime: function() {
        return 300.0;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      ex_getDynaAttrBaseAmt_liq: function() {
        return this.liqProdRate;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


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
    newClass().extendClass(PARENT[1], "B_depthPump").implement(INTF[1]).implement(INTF_A[1]).implement(INTF_B[1]).initClass()
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


      read: function thisFun(rd, revi) {
        if(this.LCRevi === 5) rd.s();

        thisFun.funPrev.apply(this, [rd, revi]);
      }
      .setProp({
        override: true,
      }),


    }),


  ];
