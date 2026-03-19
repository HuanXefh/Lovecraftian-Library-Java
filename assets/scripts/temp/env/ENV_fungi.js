/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_baseTree");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Tree-sized mushroom.
   * @class ENV_fungi
   * @extends ENV_baseTree
   */
  module.exports = newClass().extendClass(PARENT, "ENV_fungi").initClass()
  .setParent(TreeBlock)
  .setTags("blk-env", "blk-tree")
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @memberof ENV_fungi
     * @instance
     */
    treeGrp: "fungi",


  })
  .setMethod({});
