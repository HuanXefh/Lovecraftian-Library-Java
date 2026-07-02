/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_attributeGenerator");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.displayEfficiency = false;
    blk.minEfficiency = Math.pow(blk.size, 2) - 0.0001;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Generators built on vents. It checks vent size now since vents are not strictly 3x3 in Lovec.
     * @class BLK_ventGenerator
     * @extends BLK_attributeGenerator
     */
    newClass().extendClass(PARENT[0], "BLK_ventGenerator").initClass()
    .setParent(ThermalGenerator)
    .setTags()
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @override
       * @memberof BLK_ventGenerator
       * @instance
       */
      attrFilterTup: prov(() => [function(blk, oblk) {
        return checkCreatedByTemp(oblk) && oblk.ex_isSubInsOf("INTF_ENV_dynamicSizeVent") && oblk.delegee.ventSize === blk.size;
      }]),


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class B_ventGenerator
     * @extends B_attributeGenerator
     */
    newClass().extendClass(PARENT[1], "B_ventGenerator").initClass()
    .setParent(ThermalGenerator.ThermalGeneratorBuild)
    .setParam({})
    .setMethod({}),


  ];
