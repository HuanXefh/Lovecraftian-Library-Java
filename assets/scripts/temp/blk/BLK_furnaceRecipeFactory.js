/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A type of multi-crafter with temperature mechanics.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_recipeFactory");
  const INTF = require("lovec/temp/intf/INTF_BLK_furnaceBlock");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_recipe = require("lovec/mdl/MDL_recipe");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.ex_addConfigCaller("fuelSel", (b, val) => b.delegee.fuelSel = MDL_content._ct(val, "rs"));
  };


  function comp_ex_loadRcParam(b, rcMdl, rcHeader) {
    b.tempReq = MDL_recipe._tempReq(rcMdl, rcHeader);
    b.tempAllowed = MDL_recipe._tempAllowed(rcMdl, rcHeader);
  };


  function comp_ex_calcFailP(b) {
    let frac = Mathf.clamp(Math.min(
      Math.pow(b.tempCur / b.ex_getHeatTg(), 1.5),
      !isFinite(b.ex_getHeatAllowed()) ? Infinity : (b.ex_getHeatAllowed() - 2.0 * b.tempCur) / b.ex_getHeatAllowed() + 2.0,
    ));

    return frac < 0.1 ?
      0.0 :
      frac;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_furnaceRecipeFactory").implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac", "blk-furn")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


      consumesItem: function thisFun(itm) {
        return thisFun.funPrev.apply(this, arguments);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      consumesLiquid: function thisFun(liq) {
        return thisFun.funPrev.apply(this, arguments);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_furnaceRecipeFactory").implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({
      tempReq: 0.0,
      tempAllowed: Infinity,
    })
    .setMethod({


      updateTile: function() {

      }
      .setProp({
        noSuper: true,
      }),


      acceptItem: function thisFun(b_f, itm) {
        return thisFun.funPrev.apply(this, arguments);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      acceptLiquid: function thisFun(b_f, liq) {
        return thisFun.funPrev.apply(this, arguments);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      config: function() {
        return packConfig({
          rcHeader: this.rcHeader,
          fuelSel: this.fuelSel == null ? "null" : this.fuelSel.name,
        });
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      ex_loadRcParam: function(rcMdl, rcHeader) {
        comp_ex_loadRcParam(this, rcMdl, rcHeader);
      }
      .setProp({
        noSuper: true,
      }),


      ex_getHeatTg: function() {
        return this.tempReq;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      ex_getHeatAllowed: function() {
        return this.tempAllowed;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      ex_calcFailP: function thisFun() {
        return comp_ex_calcFailP(this) * thisFun.funPrev.call(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      ex_handleConfigStrDef: function thisFun(str) {
        if(str.startsWith("FUEL: ")) {
          this.delegee.fuelSel = MDL_content._ct(str.replace("FUEL: ", ""), "rs");
        } else {
          thisFun.funPrev.apply(this, [str]);
        };
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      ex_getSelectorExtraBtnSetters: function() {
        return this.block.delegee.noFuelInput ?
          [] :
          [
            tb => tb.button("F", () => {
              tb.clearChildren();
              tb.row();
              this.ex_buildFuelSelector(tb);
            }).tooltip(MDL_bundle._term("lovec", "fuel-filter"), true),
          ];
      }
      .setProp({
        noSuper: true,
        mergeMode: "array",
      }),


    }),


  ];
