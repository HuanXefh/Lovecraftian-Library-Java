/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Not a wall for defense but technically a wall.
   * Used as building material.
   * ---------------------------------------- */


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


    // Block
    newClass().extendClass(PARENT[0], "BLK_materialBlock").initClass()
    .setParent(Wall)
    .setTags()
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_materialBlock").initClass()
    .setParent(Wall.WallBuild)
    .setParam({})
    .setMethod({}),


  ];
