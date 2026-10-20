/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<DuctRouter, BLK_directionalRouter>} BLKDirectionalRouter
     */


    /**
     * @typedef {TemplateInstance<DuctRouter.DuctRouterBuild, B_directionalRouter>} BDirectionalRouter
     * @prop {BLKDirectionalRouter} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseItemGate");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Vanilla directional router.
         * <br> `SINGLESIZE`
         * @class BLK_directionalRouter
         * @extends BLK_baseItemGate
         */
        newClass()
        .extendClass(PARENT[0], "BLK_directionalRouter")
        .initTemplate()
        .setParent(DuctRouter)
        .setTags()
        .setParam({})
        .setMethod({}),


        /**
         * @class B_directionalRouter
         * @extends B_baseItemGate
         */
        newClass()
        .extendClass(PARENT[1], "B_directionalRouter")
        .initTemplate()
        .setParent(DuctRouter.DuctRouterBuild)
        .setParam({})
        .setMethod({}),


    ];
