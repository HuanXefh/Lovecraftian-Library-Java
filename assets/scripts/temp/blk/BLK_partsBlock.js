/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Blocks that are mostly treated as payloads.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_materialBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.rebuildable = false;
    blk.placeablePlayer = false;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(Wall)
    .setTags()
    .setParam({
      databaseCategory: "lovec-material",
      databaseTag: "default",
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      canPlaceOn: function(t, team, rot) {
        // Should never be placed by player, without this someone may build it using schematics
        return false;
      }
      .setProp({
        noSuper: true,
        override: true,
        final: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(Wall.WallBuild)
    .setParam({})
    .setMethod({}),


  ];
