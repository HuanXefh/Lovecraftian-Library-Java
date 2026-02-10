/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Light block that consumes fuels, essentially a furnace.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_light");
  const INTF = require("lovec/temp/intf/INTF_BLK_furnaceBlock");


  const MDL_content = require("lovec/mdl/MDL_content");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.selectionColumns = 10;
    };

    blk.config(JAVA.string, (b, str) => {
      if(str.startsWith("FUEL: ")) {
        b.delegee.fuelSel = MDL_content._ct(str.replace("FUEL: ", ""), "rs");
      };
    });
  };


  function comp_buildConfiguration(b, tb) {
    tb.row();
    b.ex_buildFuelSelector(tb);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_fuelLight").implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac", "blk-li")
    .setParam({
      // @PARAM: The temperature at which light radius is maximized.
      maxLightTemp: 1000.0,

      tempExtMtp: 0.0,                // Have you ever seen an externally heated light???
      shouldDrawFurnLight: false,
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_fuelLight").implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({


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
        return this.fuelSel;
      }
      .setProp({
        noSuper: true,
      }),


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      ex_getHeatTg: function() {
        return this.block.delegee.maxLightTemp;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
