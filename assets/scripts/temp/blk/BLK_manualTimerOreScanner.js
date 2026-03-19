/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_oreScanner");
  const INTF = require("lovec/temp/intf/INTF_BLK_manualTimerBlock");


  /* <---------- component ----------> */


  function comp_buildConfiguration(b, tb) {
    MDL_table.__btnCfg(tb, b, () => b.ex_configureClick(), VARGEN.icons.boost);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * {@link BLK_oreScanner} but has to be manually charged.
     * @class BLK_manualTimerOreScanner
     * @extends BLK_oreScanner
     * @extends INTF_BLK_manualTimerBlock
     */
    newClass().extendClass(PARENT[0], "BLK_manualTimerOreScanner").implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-min", "blk-scan")
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof BLK_manualTimerOreScanner
       * @instance
       */
      manualTimerCfgTp: "string",
      /**
       * <INTERNAL>
       * @memberof BLK_manualTimerOreScanner
       * @instance
       */
      skipTapConfig: true,


    })
    .setMethod({}),


    /**
     * @class B_manualTimerOreScanner
     * @extends B_oreScanner
     * @extends INTF_B_manualTimerBlock
     */
    newClass().extendClass(PARENT[1], "B_manualTimerOreScanner").implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
