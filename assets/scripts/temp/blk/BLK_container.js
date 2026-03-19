/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseStorageBlock");


  /* <---------- component ----------> */


  function comp_warmup(b) {
    let amt = 0, typeAmt = 0;
    b.items.each(itm => {
      typeAmt++;
      amt += b.items.get(itm);
    });

    return typeAmt === 0 ?
      0.0 :
      amt / typeAmt / b.block.itemCapacity;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Vanilla container.
     * @class BLK_container
     * @extends BLK_baseStorageBlock
     */
    newClass().extendClass(PARENT[0], "BLK_container").initClass()
    .setParent(StorageBlock)
    .setTags("blk-cont")
    .setParam({})
    .setMethod({


      minimapColor: function(t) {
        // Derelict containers should not appear on minimap
        let b = t.build;
        return b == null || b.team !== Team.derelict ?
          this.super$minimapColor(t) :
          t.getFloorColor().rgba();
      }
      .setProp({
        noSuper: true,
      }),


    }),


    /**
     * @class B_container
     * @extends B_baseStorageBlock
     */
    newClass().extendClass(PARENT[1], "B_container").initClass()
    .setParent(StorageBlock.StorageBuild)
    .setParam({})
    .setMethod({


      warmup: function() {
        return comp_warmup(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
