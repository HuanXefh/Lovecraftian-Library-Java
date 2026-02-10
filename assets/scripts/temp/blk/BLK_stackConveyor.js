/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Vanilla stack conveyor I guess.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseItemDistributor");


  const MDL_cond = require("lovec/mdl/MDL_cond");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      if(blk.hasPower) {
        blk.conductivePower = true;
        blk.connectedPower = false;
      };
      blk.unloadable = true;
      // Because it looks like a mess
      blk.enableDrawStatus = false;
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_stackConveyor").initClass()
    .setParent(StackConveyor)
    .setTags("blk-dis", "blk-conv")
    .setParam({
      // @PARAM: Whether this conveyor only accepts inputs from other item distributors (intended for main line).
      disInputOnly: true,
    })
    .setParamAlias([
      "loadEff", "loadEffect", Fx.conveyorPoof,
      "unloadEff", "unloadEffect", Fx.conveyorPoof,
    ])
    .setMethod({


      init: function() {
        comp_init(this);
      },


      ex_isSingleSized: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_stackConveyor").initClass()
    .setParent(StackConveyor.StackConveyorBuild)
    .setParam({})
    .setMethod({


      acceptItem: function(b_f, itm) {
        return !this.block.delegee.disInputOnly ?
          true :
          MDL_cond._isItemDistributor(b_f.block);
      }
      .setProp({
        boolMode: "and",
      }),


    }),


  ];
