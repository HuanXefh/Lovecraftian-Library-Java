/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseItemBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.group = BlockGroup.transportation;
    blk.priority = TargetPriority.transport;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Parent of all item distribution blocks.
     * @class BLK_baseItemDistributor
     * @extends BLK_baseItemBlock
     */
    newClass().extendClass(PARENT[0], "BLK_baseItemDistributor").initClass()
    .setParent(null)
    .setTags("blk-dis")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class B_baseItemDistributor
     * @extends B_baseItemBlock
     */
    newClass().extendClass(PARENT[1], "B_baseItemDistributor").initClass()
    .setParent(null)
    .setParam({})
    .setMethod({}),


  ];
