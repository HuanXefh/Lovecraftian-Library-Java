/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, BLK_posConfigTurret>} BLKPosConfigTurret
     */


    /**
     * @typedef {TemplateInstance<Building, B_posConfigTurret>} BPosConfigTurret
     * @prop {BLKPosConfigTurret} block
     */


    const PARENT = require("lovec/temp/blk/BLK_configTurret");
    const INTF_BLK_posConfigBlock = require("lovec/temp/intf/INTF_BLK_posConfigBlock");


    /* <------------------------------ component ------------------------------> */


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Turrets that has their target position as config.
         * @class BLK_posConfigTurret
         * @extends BLK_configTurret
         * @extends INTF_BLK_posConfigBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_posConfigTurret")
        .implement(INTF_BLK_posConfigBlock[0])
        .initTemplate()
        .setParent(null)
        .setTags()
        .setParam({})
        .setMethod({}),


        /**
         * @class B_posConfigTurret
         * @extends B_configTurret
         * @extends INTF_B_posConfigBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_posConfigTurret")
        .implement(INTF_BLK_posConfigBlock[1])
        .initTemplate()
        .setParent(null)
        .setParam({})
        .setMethod({}),


    ];
