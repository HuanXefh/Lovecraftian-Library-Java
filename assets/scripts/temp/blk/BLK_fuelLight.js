/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_light");
  const INTF = require("lovec/temp/intf/INTF_BLK_furnaceBlock");


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


    /**
     * Light blocks that consume fuels, essentially a furnace.
     * @class BLK_fuelLight
     * @extends BLK_light
     * @extends INTF_BLK_furnaceBlock
     */
    newClass().extendClass(PARENT[0], "BLK_fuelLight").implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac", "blk-li")
    .setParam({


      /**
       * <PARAM>: Temperature at which light radius is maximized.
       * @memberof BLK_fuelLight
       * @instance
       */
      maxLightTemp: 1000.0,
      /**
       * <PARAM>
       * @override
       * @memberof BLK_fuelLight
       * @instance
       */
      shouldDrawFurnLight: false,


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>: Have you ever seen an externally heated light?
       * @override
       * @memberof BLK_fuelLight
       * @instance
       */
      tempExtMtp: 0.0,


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class B_fuelLight
     * @extends B_light
     * @extends INTF_B_furnaceBlock
     */
    newClass().extendClass(PARENT[1], "B_fuelLight").implement(INTF[1]).initClass()
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


      /**
       * @override
       * @memberof B_fuelLight
       * @instance
       * @return {number}
       */
      ex_getHeatTg: function() {
        return this.block.delegee.maxLightTemp;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
