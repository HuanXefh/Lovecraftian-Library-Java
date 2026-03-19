/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseItemGate");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.selectionColumns = 10;
      blk.group = BlockGroup.transportation;
    };
  };


  function comp_buildConfiguration(b, tb) {
    MDL_table._s_ct(
      tb, b.block, Vars.content.items().toArray(),
      () => b.sortItem, val => b.configure(val), false,
      b.block.selectionRows, b.block.selectionColumns,
    );
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Serpulo unloader.
     * <br> <SINGLESIZE>
     * @class BLK_unloader
     * @extends BLK_baseItemGate
     */
    newClass().extendClass(PARENT[0], "BLK_unloader").initClass()
    .setParent(Unloader)
    .setTags("blk-dis", "blk-gate")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class B_unloader
     * @extends B_baseItemGate
     */
    newClass().extendClass(PARENT[1], "B_unloader").initClass()
    .setParent(Unloader.UnloaderBuild)
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
