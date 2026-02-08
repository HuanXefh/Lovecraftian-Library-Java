/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * The easiest lifeform to make in Mindustry.
   * ---------------------------------------- */


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


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(TreeBlock)
  .setTags("blk-env", "blk-tree")
  .setParam({
    treeGrp: "tree",
  })
  .setMethod({});
