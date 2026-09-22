/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<TreeBlock, ENV_fungi>} ENVFungi
     */


    const PARENT = require("lovec/temp/env/ENV_baseTree");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Tree-sized mushroom. Yep they are trees.
     * @class ENV_fungi
     * @extends ENV_baseTree
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_fungi")
    .initTemplate()
    .setParent(TreeBlock)
    .setTags("env-tree")
    .setParam({


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof ENV_fungi
         * @instance
         * @type {string}
         */
        treeGrp: "fungi",


    })
    .setMethod({});
