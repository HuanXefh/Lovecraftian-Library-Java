/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_liquidPump");
  const INTF = require("lovec/temp/intf/INTF_BLK_manualTimerBlock");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * A pump that charges when you click it.
     * @class BLK_manualTimerPump
     * @extends BLK_liquidPump
     * @extends INTF_BLK_manualTimerBlock
     */
    newClass().extendClass(PARENT[0], "BLK_manualTimerPump").implement(INTF[0]).initClass()
    .setParent(Pump)
    .setTags("blk-pump")
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof BLK_manualTimerPump
       * @instance
       */
      manualTimerCfgTp: "string",


    })
    .setMethod({}),


    /**
     * @class B_manualTimerPump
     * @extends B_liquidPump
     * @extends INTF_B_manualTimerBlock
     */
    newClass().extendClass(PARENT[1], "B_manualTimerPump").implement(INTF[1]).initClass()
    .setParent(Pump.PumpBuild)
    .setParam({})
    .setMethod({


      shouldConsume: function thisFun() {
        return thisFun.funPrev.call(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
