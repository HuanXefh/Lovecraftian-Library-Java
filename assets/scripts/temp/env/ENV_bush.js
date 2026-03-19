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
   * Any tree that don't yield log.
   * @class ENV_bush
   * @extends ENV_baseTree
   */
  module.exports = newClass().extendClass(PARENT, "ENV_bush").initClass()
  .setParent(TreeBlock)
  .setTags("blk-env", "blk-tree")
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @memberof ENV_bush
     * @instance
     */
    treeGrp: "bush",


  })
  .setMethod({});
