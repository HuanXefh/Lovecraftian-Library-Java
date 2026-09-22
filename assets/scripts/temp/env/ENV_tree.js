/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<TreeBlock, ENV_tree>} ENVTree
     */


    const PARENT = require("lovec/temp/env/ENV_baseTree");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * The easiest lifeform to make in Mindustry.
     * @class ENV_tree
     * @extends ENV_baseTree
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_tree")
    .initTemplate()
    .setParent(TreeBlock)
    .setTags("env-tree")
    .setParam({


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof ENV_tree
         * @instance
         * @type {string}
         */
        treeGrp: "tree",


    })
    .setMethod({});
