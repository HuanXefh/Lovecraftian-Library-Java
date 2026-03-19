/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseItemDistributor");


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


    /**
     * Vanilla stack conveyor I guess.
     * <br> <SINGLESIZE>
     * @class BLK_stackConveyor
     * @extends BLK_baseItemDistributor
     */
    newClass().extendClass(PARENT[0], "BLK_stackConveyor").initClass()
    .setParent(StackConveyor)
    .setTags("blk-dis", "blk-conv")
    .setParam({


      /**
       * <PARAM>: Whether this conveyor only accepts inputs from other item distributors (intended for main bus).
       * @memberof BLK_stackConveyor
       * @instance
       */
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


      /**
       * @override
       * @memberof BLK_stackConveyor
       * @instance
       * @return {boolean}
       */
      ex_isSingleSized: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    /**
     * @class B_stackConveyor
     * @extends B_baseItemDistributor
     */
    newClass().extendClass(PARENT[1], "B_stackConveyor").initClass()
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
