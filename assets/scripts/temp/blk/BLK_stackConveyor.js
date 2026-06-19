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
    .setTags()
    .setParam({


      /**
       * <PARAM>: Whether this conveyor only accepts inputs from conveyors and ducts (intended for main bus).
       * @memberof BLK_stackConveyor
       * @instance
       */
      convInputOnly: true,


      /* <------------------------------ vanilla ------------------------------ */


      unloadable: true,
      enableDrawStatus: false,


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
        return !this.block.delegee.convInputOnly ?
          true :
          MDL_cond._isConveyor(b_f.block) || MDL_cond._isDuct(b_f.block);
      }
      .setProp({
        boolMode: "and",
      }),


    }),


  ];
