/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseStorageBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_powerProducer");


  /* <---------- component ----------> */


  function comp_updateTile(b) {
    if(TIMER.secHalf) {
      b.powProdEff = Mathf.clamp(1.0 - FRAG_faci._cepFracCur(b.team))
    };
    if(b.powProdEff < 0.0001 && Mathf.chanceDelta(b.block.delegee.cepOutageEffP)) {
      b.block.delegee.cepOutageEff.at(b);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Vanilla core block with core energy mechanics.
     * @class BLK_core
     * @extends BLK_baseStorageBlock
     * @extends INTF_BLK_powerProducer
     */
    newClass().extendClass(PARENT[0], "BLK_core").implement(INTF[0]).initClass()
    .setParent(CoreBlock)
    .setTags("blk-core")
    .setParam({


      /**
       * <PARAM>: Effect created when out of CEP.
       * @memberof BLK_core
       * @instance
       */
      cepOutageEff: EFF.powerSpark,
      /**
       * <PARAM>: Effect chance.
       * @memberof BLK_core
       * @instance
       */
      cepOutageEffP: 0.04,


    })
    .setMethod({}),


    /**
     * @class B_core
     * @extends B_baseStorageBlock
     * @extends INTF_B_powerProducer
     */
    newClass().extendClass(PARENT[1], "B_core").implement(INTF[1]).initClass()
    .setParent(CoreBlock.CoreBuild)
    .setParam({})
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


    }),


  ];
