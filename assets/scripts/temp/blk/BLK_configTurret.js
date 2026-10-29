/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, BLK_configTurret>} BLKConfigTurret
     */


    /**
     * @typedef {TemplateInstance<Building, B_configTurret>} BConfigTurret
     * @prop {BLKConfigTurret} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseTurret");


    /* <------------------------------ component ------------------------------> */


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Turrets that target based on their config.
         * @class BLK_configTurret
         * @extends BLK_baseTurret
         */
        newClass()
        .extendClass(PARENT[0], "BLK_configTurret")
        .initTemplate()
        .setParent(null)
        .setTags()
        .setParam({})
        .setMethod({}),


        /**
         * @class B_configTurret
         * @extends B_baseTurret
         */
        newClass()
        .extendClass(PARENT[1], "B_configTurret")
        .initTemplate()
        .setParent(null)
        .setParam({})
        .setMethod({}),


    ];
