/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.group = BlockGroup.walls;
    blk.priority = TargetPriority.wall;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Not a wall for defense but technically a wall.
     * Used as building material.
     * @class BLK_materialBlock
     * @extends BLK_baseBlock
     */
    newClass().extendClass(PARENT[0], "BLK_materialBlock").initClass()
    .setParent(Wall)
    .setTags()
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class B_materialBlock
     * @extends B_baseBlock
     */
    newClass().extendClass(PARENT[1], "B_materialBlock").initClass()
    .setParent(Wall.WallBuild)
    .setParam({})
    .setMethod({}),


  ];
