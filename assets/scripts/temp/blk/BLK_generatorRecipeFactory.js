/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_generatorRecipeFactory>} BLKGeneratorRecipeFactory
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_generatorRecipeFactory>} BGeneratorRecipeFactory
     * @prop {BLKGeneratorRecipeFactory} block
     */


    const PARENT = require("lovec/temp/blk/BLK_recipeFactory");
    const INTF_BLK_powerProducer = require("lovec/temp/intf/INTF_BLK_powerProducer");
    const INTF_BLK_explosionInducer = require("lovec/temp/intf/INTF_BLK_explosionInducer");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKGeneratorRecipeFactory} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.priority = GLB_var.priority.powGen;
    };


    /**
     * @private
     * @param {BGeneratorRecipeFactory} b
     * @return {void}
     */
    function comp_updateTile(b) {
        b.delegee.powProdEffc = Mathf.approachDelta(b.delegee.powProdEffc, b.efficiency, 0.02);
    };


    /**
     * @private
     * @param {BGeneratorRecipeFactory} b
     * @param {RecipeModule} rcMdl
     * @param {string} rcHeader
     * @return {void}
     */
    function comp_ex_loadRcParam(b, rcMdl, rcHeader) {
        b.delegee.rcPowProdMtp = b.delegee.rc.powProdMtp;
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Recipe factories that generates power.
         * I won't merge power generation into {@link BLK_recipeFactory}, since generators have their template tags.
         * @todo Untested.
         * @class BLK_generatorRecipeFactory
         * @extends BLK_recipeFactory
         * @extends INTF_BLK_powerProducer
         * @extends INTF_BLK_explosionInducer
         */
        newClass()
        .extendClass(PARENT[0], "BLK_generatorRecipeFactory")
        .implement(INTF_BLK_powerProducer[0])
        .implement(INTF_BLK_explosionInducer[0])
        .initTemplate()
        .setParent("GenericCrafter")
        .setTags("blk-non-fac")
        .setParam({


            /**
             * `PARAM`: Minimum warmup required to create explosion when destroyed.
             * @memberof BLK_generatorRecipeFactory
             * @instance
             * @type {number}
             */
            exploMinWarmup: Infinity,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_generatorRecipeFactory
             * @instance
             * @func
             * @param {BGeneratorRecipeFactory} b
             * @return {number}
             */
            ex_calcPowProd: function(b) {
                return this.delegee.powProd * b.delegee.rcPowProdMtp;
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 1,
            }),


        }),


        /**
         * @class B_generatorRecipeFactory
         * @extends B_recipeFactory
         * @extends INTF_B_powerProducer
         * @extends INTF_B_explosionInducer
         */
        newClass()
        .extendClass(PARENT[1], "B_generatorRecipeFactory")
        .implement(INTF_BLK_powerProducer[1])
        .implement(INTF_BLK_explosionInducer[1])
        .initTemplate()
        .setParent("GenericCrafter.GenericCrafterBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_generatorRecipeFactory
             * @instance
             * @type {number}
             */
            rcPowProdMtp: 1.0,


        })
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @override
             * @memberof B_generatorRecipeFactory
             * @instance
             * @func
             * @param {RecipeModule} rcMdl
             * @param {string} rcHeader
             * @return {void}
             */
            ex_loadRcParam: function(rcMdl, rcHeader) {
                comp_ex_loadRcParam(this, rcMdl, rcHeader);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_generatorRecipeFactory
             * @instance
             * @func
             * @return {boolean}
             */
            ex_shouldExplodeOnDestroyed: function() {
                return tryProp(this.warmup, this, 0.0) > this.block.delegee.exploMinWarmup;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


    ];
