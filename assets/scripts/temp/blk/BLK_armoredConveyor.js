/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<ArmoredConveyor, BLK_armoredConveyor>} BLKArmoredConveyor
     */


    /**
     * @typedef {TemplateInstance<ArmoredConveyor.ArmoredConveyorBuild, B_armoredConveyor>} BArmoredConveyor
     * @prop {BLKArmoredConveyor} block
     */


    const PARENT = require("lovec/temp/blk/BLK_conveyor");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Similar to vanilla armored conveyor.
         * <br> `SINGLESIZE`
         * @class BLK_armoredConveyor
         * @extends BLK_conveyor
         */
        newClass()
        .extendClass(PARENT[0], "BLK_armoredConveyor")
        .initTemplate()
        .setParent(ArmoredConveyor)
        .setTags()
        .setParam({})
        .setMethod({}),


        /**
         * @class B_armoredConveyor
         * @extends B_conveyor
         */
        newClass()
        .extendClass(PARENT[1], "B_armoredConveyor")
        .initTemplate()
        .setParent(ArmoredConveyor.ArmoredConveyorBuild)
        .setParam({})
        .setMethod({}),


    ];
