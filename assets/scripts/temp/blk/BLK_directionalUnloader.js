/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseItemGate");


  /* <---------- component ----------> */


  function comp_buildConfiguration(b, tb) {
    MDL_table._s_ct(
      tb, b.block, Vars.content.items().toArray(),
      () => b.unloadItem, val => b.configure(val), false,
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
     * Erekir unloader.
     * <br> <SINGLESIZE>
     * @class BLK_directionalUnloader
     * @extends BLK_baseItemGate
     */
    newClass().extendClass(PARENT[0], "BLK_directionalUnloader").initClass()
    .setParent(DirectionalUnloader)
    .setTags()
    .setParam({


      /* <------------------------------ vanilla ------------------------------ */


      isDuct: false,
      regionRotated1: 1,


    })
    .setMethod({}),


    /**
     * @class B_directionalUnloader
     * @extends B_baseItemGate
     */
    newClass().extendClass(PARENT[1], "B_directionalUnloader").initClass()
    .setParent(DirectionalUnloader.DirectionalUnloaderBuild)
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
