/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Parent for all generalized projector blocks.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseBlock");
  const VAR = require("lovec/glb/GLB_var");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.group = BlockGroup.projectors;
    blk.priority = VAR.prio_proj;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(null)
    .setTags("blk-proj")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(null)
    .setParam({})
    .setMethod({}),


  ];
