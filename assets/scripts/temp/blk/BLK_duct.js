/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<DirectionalUnloader, BLK_duct>} BLKDuct
     */


    /**
     * @typedef {TemplateInstance<DirectionalUnloader.DirectionalUnloaderBuild, B_duct>} BDuct
     * @prop {BLKDuct} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseItemDistributor");
    const INTF_BLK_transportBlockSideDisplay = require("lovec/temp/intf/INTF_BLK_transportBlockSideDisplay");
    const INTF_BLK_mainBusInputSite = require("lovec/temp/intf/INTF_BLK_mainBusInputSite");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Erekir duct.
         * <br> `SINGLESIZE`
         * @class BLK_duct
         * @extends BLK_baseItemDistributor
         * @extends INTF_BLK_transportBlockSideDisplay
         * @extends INTF_BLK_mainBusInputSite
         */
        newClass()
        .extendClass(PARENT[0], "BLK_duct")
        .implement(INTF_BLK_transportBlockSideDisplay[0])
        .implement(INTF_BLK_mainBusInputSite[0])
        .initTemplate()
        .setParent(Duct)
        .setTags()
        .setParam({})
        .setMethod({


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_duct
             * @instance
             * @func
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
             * `REALIZED`
             * @override
             * @memberof BLK_duct
             * @instance
             * @func
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
             * `REALIZED`
             * @override
             * @memberof BLK_duct
             * @instance
             * @func
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
             * `REALIZED`
             * @override
             * @memberof BLK_duct
             * @instance
             * @func
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
         * @extends INTF_B_transportBlockSideDisplay
         * @extends INTF_B_mainBusInputSite
         */
        newClass()
        .extendClass(PARENT[1], "B_duct")
        .implement(INTF_BLK_transportBlockSideDisplay[1])
        .implement(INTF_BLK_mainBusInputSite[1])
        .initTemplate()
        .setParent(Duct.DuctBuild)
        .setParam({})
        .setMethod({}),


    ];
