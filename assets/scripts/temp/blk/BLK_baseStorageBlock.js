/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseItemBlock");


  /* <---------- component ----------> */


  function comp_acceptItem(b, b_f, itm) {
    if(!b.block.separateItemCapacity) return b.items.total() < b.getMaximumAccepted(itm);
    if(b.block.delegee.singleTypeOnly) return !b.items.any() || b.items.total() === b.items.get(itm);

    return true;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Base template for blocks that store items.
     * @class BLK_baseStorageBlock
     * @extends BLK_baseItemBlock
     */
    newClass().extendClass(PARENT[0], "BLK_baseStorageBlock").initClass()
    .setParent(null)
    .setTags()
    .setParam({


      /**
       * `PARAM`: If true, this storage block can only store one type of item.
       * @memberof BLK_baseStorageBlock
       * @instance
       */
      singleTypeOnly: false,


    })
    .setMethod({}),


    /**
     * @class B_baseStorageBlock
     * @extends B_baseItemBlock
     */
    newClass().extendClass(PARENT[1], "B_baseStorageBlock").initClass()
    .setParent(null)
    .setParam({})
    .setMethod({


      acceptItem: function(b_f, itm) {
        return comp_acceptItem(this, b_f, itm);
      }
      .setProp({
        boolMode: "and",
      }),


    }),


  ];
