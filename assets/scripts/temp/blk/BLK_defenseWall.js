/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_materialBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.flashHit = true;
      blk.flashColor = Color.white;
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Wall blocks that are used for defense.
     * @class BLK_defenseWall
     * @extends BLK_materialBlock
     */
    newClass().extendClass(PARENT[0], "BLK_defenseWall").initClass()
    .setParent(Wall)
    .setTags("blk-wall")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class B_defenseWall
     * @extends B_materialBlock
     */
    newClass().extendClass(PARENT[1], "B_defenseWall").initClass()
    .setParent(Wall.WallBuild)
    .setParam({})
    .setMethod({}),


  ];
