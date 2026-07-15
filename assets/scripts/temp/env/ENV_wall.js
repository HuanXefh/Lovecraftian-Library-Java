/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseProp");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.flrParent = MDL_content._ct(blk.flrParent, "blk");
    if(blk.flrParent != null) {
      if(blk.flrParent.wall === Blocks.air) {
        blk.flrParent.wall = blk
      };

      MDL_content.rename(
        blk,
        blk.flrParent.localizedName + MDL_text._space() + "(" + MDL_bundle._term("lovec", "wall") + ")",
      );

      // Set wall color to darkened version of floor color
      blk.mapColor = blk.flrParent.mapColor.cpy().lerp(Color.black, VAR.param.wallColorDarkLerpA);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Most common terrain walls.
   * <br> `NAMEGEN`
   * @class ENV_wall
   * @extends ENV_baseProp
   */
  module.exports = newClass().extendClass(PARENT, "ENV_wall").initClass()
  .setParent(StaticWall)
  .setTags()
  .setParam({


    /**
     * `PARAM`: Parent floor of this wall.
     * @memberof ENV_wall
     * @instance
     */
    flrParent: null,


  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


  });
