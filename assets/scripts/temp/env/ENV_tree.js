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
   * The easiest lifeform to make in Mindustry.
   * @class ENV_tree
   * @extends ENV_baseTree
   */
  module.exports = newClass().extendClass(PARENT, "ENV_tree").initClass()
  .setParent(TreeBlock)
  .setTags("blk-env", "blk-tree")
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @memberof ENV_tree
     * @instance
     */
    treeGrp: "tree",


  })
  .setMethod({});
