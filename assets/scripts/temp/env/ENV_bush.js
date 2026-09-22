/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<TreeBlock, ENV_bush>} ENVBush
     */


    const PARENT = require("lovec/temp/env/ENV_baseTree");


    /* <------------------------------ component ------------------------------ */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Any tree that don't yield log.
     * @class ENV_bush
     * @extends ENV_baseTree
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_bush")
    .initTemplate()
    .setParent(TreeBlock)
    .setTags("env-tree")
    .setParam({


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof ENV_bush
         * @instance
         * @type {string}
         */
        treeGrp: "bush",


    })
    .setMethod({});
