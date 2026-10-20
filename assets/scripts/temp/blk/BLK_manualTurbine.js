/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_manualTurbine>} BLKManualTurbine
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_manualTurbine>} BManualTurbine
     * @prop {BLKManualTurbine} block
     */


    const PARENT = require("lovec/temp/blk/BLK_turbineFactory");
    const INTF_BLK_manualTimerBlock = require("lovec/temp/intf/INTF_BLK_manualTimerBlock");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Turbine that can be charged by clicks.
         * @class BLK_manualTurbine
         * @extends BLK_turbineFactory
         * @extends INTF_BLK_manualTimerBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_manualTurbine")
        .implement(INTF_BLK_manualTimerBlock[0])
        .initTemplate()
        .setParent(GenericCrafter)
        .setTags("blk-non-fac")
        .setParam({})
        .setMethod({}),


        /**
         * @class B_manualTurbine
         * @extends B_turbineFactory
         * @extends INTF_B_manualTimerBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_manualTurbine")
        .implement(INTF_BLK_manualTimerBlock[1])
        .initTemplate()
        .setParent(GenericCrafter.GenericCrafterBuild)
        .setParam({})
        .setMethod({}),


    ];
