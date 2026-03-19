/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.group = BlockGroup.power;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Any block related to power transmission or generation.
     * @class BLK_basePowerBlock
     * @extends BLK_baseBlock
     */
    newClass().extendClass(PARENT[0], "BLK_basePowerBlock").initClass()
    .setParent(null)
    .setTags("blk-pow")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class B_basePowerBlock
     * @extends B_baseBlock
     */
    newClass().extendClass(PARENT[1], "B_basePowerBlock").initClass()
    .setParent(null)
    .setParam({})
    .setMethod({}),


  ];
