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
     * Erekir duct.
     * <br> <SINGLESIZE>
     * @class BLK_duct
     * @extends BLK_baseItemDistributor
     * @extends INTF_BLK_transportBlockSideDisplay
     */
    newClass().extendClass(PARENT[0], "BLK_duct").implement(INTF[0]).initClass()
    .setParent(Duct)
    .setTags()
    .setParam({})
    .setMethod({


      /**
       * @override
       * @memberof BLK_duct
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
       * @memberof BLK_duct
       * @instance
       * @param {Building} ob
       * @return {boolean}
       */
      ex_shouldBlendBackSide: function(ob) {
        return ob.block.outputsItems();
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


      /**
       * @override
       * @memberof BLK_duct
       * @instance
       * @param {Building} ob
       * @return {boolean}
       */
      ex_shouldBlendFlankSide: function(ob) {
        return ob.block.outputsItems();
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


      /**
       * @override
       * @memberof BLK_duct
       * @instance
       * @param {Building} ob
       * @return {boolean}
       */
      ex_shouldBlendFrontSide: function(ob) {
        return ob.items != null;
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


    }),


    /**
     * @class B_duct
     * @extends B_baseItemDistributor
     * @extends INTF_BLK_transportBlockSideDisplay
     */
    newClass().extendClass(PARENT[1], "B_duct").implement(INTF[1]).initClass()
    .setParent(Duct.DuctBuild)
    .setParam({})
    .setMethod({}),


  ];
