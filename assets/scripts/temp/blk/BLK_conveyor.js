/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Conveyor, BLK_conveyor>} BLKConveyor
     */


    /**
     * @typedef {TemplateInstance<Conveyor.ConveyorBuild, B_conveyor>} BConveyor
     * @prop {BLKConveyor} block
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
         * Conveyor, the most basic way of item transportation.
         * Has side regions to mark the start and end.
         * <br> I have tried to change that item capacity of 3, but it's too hard-coded.
         * <br> `SINGLESIZE`
         * @class BLK_conveyor
         * @extends BLK_baseItemDistributor
         * @extends INTF_BLK_transportBlockSideDisplay
         * @extends INTF_BLK_mainBusInputSite
         */
        newClass()
        .extendClass(PARENT[0], "BLK_conveyor")
        .implement(INTF_BLK_transportBlockSideDisplay[0])
        .implement(INTF_BLK_mainBusInputSite[0])
        .initTemplate()
        .setParent("Conveyor")
        .setTags()
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_conveyor
             * @instance
             * @type {number}
             */
            transSideRegZ: Layer.block - 0.19,


        })
        .setMethod({


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_conveyor
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
             * @memberof BLK_conveyor
             * @instance
             * @func
             * @param {Building} ob
             * @return {boolean}
             */
            ex_shouldBlendBackSide: function(ob) {
                return ob.block.outputsItems() && !MDL_cond.isCable(ob.block);
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 1,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_conveyor
             * @instance
             * @func
             * @param {Building} ob
             * @return {boolean}
             */
            ex_shouldBlendFlankSide: function(ob) {
                return ob.block.outputsItems() && !MDL_cond.isCable(ob.block);
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 1,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_conveyor
             * @instance
             * @func
             * @param {Building} ob
             * @return {boolean}
             */
            ex_shouldBlendFrontSide: function(ob) {
                return ob.items != null && !MDL_cond.isCable(ob.block);
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
         * @extends INTF_B_transportBlockSideDisplay
         * @extends INTF_B_mainBusInputSite
         */
        newClass()
        .extendClass(PARENT[1], "B_conveyor")
        .implement(INTF_BLK_transportBlockSideDisplay[1])
        .implement(INTF_BLK_mainBusInputSite[1])
        .initTemplate()
        .setParent("Conveyor.ConveyorBuild")
        .setParam({})
        .setMethod({}),


    ];
