/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseItemDistributor");
  const INTF = require("lovec/temp/intf/INTF_BLK_transportBlockSideDisplay");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Conveyor, the most basic way of item transportation.
     * Has side regions to mark the start and end.
     * <br> I have tried to change that item capacity of 3, but it's too hard-coded.
     * <br> `SINGLESIZE`
     * @class BLK_conveyor
     * @extends BLK_baseItemDistributor
     * @extends INTF_BLK_transportBlockSideDisplay
     */
    newClass().extendClass(PARENT[0], "BLK_conveyor").implement(INTF[0]).initClass()
    .setParent(Conveyor)
    .setTags()
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @override
       * @memberof BLK_conveyor
       * @instance
       */
      sideRegZ: Layer.block - 0.19,


    })
    .setMethod({


      /**
       * @override
       * @memberof BLK_conveyor
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


      /**
       * @override
       * @memberof BLK_conveyor
       * @instance
       * @param {Building} ob
       * @return {boolean}
       */
      ex_shouldBlendBackSide: function(ob) {
        return ob.block.outputsItems() && !MDL_cond._isCable(ob.block);
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


      /**
       * @override
       * @memberof BLK_conveyor
       * @instance
       * @param {Building} ob
       * @return {boolean}
       */
      ex_shouldBlendFlankSide: function(ob) {
        return ob.block.outputsItems() && !MDL_cond._isCable(ob.block);
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


      /**
       * @override
       * @memberof BLK_conveyor
       * @instance
       * @param {Building} ob
       * @return {boolean}
       */
      ex_shouldBlendFrontSide: function(ob) {
        return ob.items != null && !MDL_cond._isCable(ob.block);
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


    }),


    /**
     * @class B_conveyor
     * @extends B_baseItemDistributor
     * @extends INTF_BLK_transportBlockSideDisplay
     */
    newClass().extendClass(PARENT[1], "B_conveyor").implement(INTF[1]).initClass()
    .setParent(Conveyor.ConveyorBuild)
    .setParam({})
    .setMethod({}),


  ];
