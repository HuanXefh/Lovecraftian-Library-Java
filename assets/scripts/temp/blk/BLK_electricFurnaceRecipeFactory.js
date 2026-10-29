/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_electricFurnaceRecipeFactory>} BLKElectricFurnaceRecipeFactory
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_electricFurnaceRecipeFactory>} BElectricFurnaceRecipeFactory
     * @prop {BLKElectricFurnaceRecipeFactory} block
     */


    const PARENT = require("lovec/temp/blk/BLK_recipeFactory");
    const INTF_BLK_electricFurnaceBlock = require("lovec/temp/intf/INTF_BLK_electricFurnaceBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKElectricFurnaceRecipeFactory} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.self.ex_addConfigM("tempSet", (b, val) => b.delegee.tempSet = val);
    };


    /**
     * @private
     * @param {BElectricFurnaceRecipeFactory} b
     * @param {RecipeModule} rcMdl
     * @param {string} rcHeader
     * @return {void}
     */
    function comp_ex_loadRcParam(b, rcMdl, rcHeader) {
        b.delegee.tempReq = MDL_recipe.getTempReq(rcMdl, rcHeader);
        b.delegee.tempAllowed = MDL_recipe.getTempAllowed(rcMdl, rcHeader);
    };


    /**
     * @private
     * @param {BElectricFurnaceRecipeFactory} b
     * @return {number}
     */
    function comp_ex_calcFailP(b) {
        let frac = Mathf.clamp(Math.min(
            Math.pow(b.delegee.tempCur / b.self.ex_getHeatTarget(), 1.5),
            !isFinite(b.self.ex_getHeatAllowed()) ?
                Infinity :
                (b.self.ex_getHeatAllowed() - 2.0 * b.delegee.tempCur) / b.self.ex_getHeatAllowed() + 2.0,
        ));
        return frac < 0.1 ?
            0.0 :
            frac;
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * {@link BLK_furnaceRecipeFactory} that consumes power instead of fuel.
         * @class BLK_electricFurnaceRecipeFactory
         * @extends BLK_recipeFactory
         * @extends INTF_BLK_electricFurnaceBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_electricFurnaceRecipeFactory")
        .implement(INTF_BLK_electricFurnaceBlock[0])
        .initTemplate()
        .setParent("GenericCrafter")
        .setTags()
        .setParam({})
        .setMethod({


            init: function() {
                comp_init(this);
            },


        }),


        /**
         * @class B_electricFurnaceRecipeFactory
         * @extends B_recipeFactory
         * @extends INTF_B_electricFurnaceBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_electricFurnaceRecipeFactory")
        .implement(INTF_BLK_electricFurnaceBlock[1])
        .initTemplate()
        .setParent("GenericCrafter.GenericCrafterBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_electricFurnaceRecipeFactory
             * @instance
             * @type {number}
             */
            tempReq: 0.0,
            /**
             * `INTERNAL`
             * @memberof B_electricFurnaceRecipeFactory
             * @instance
             * @type {number}
             */
            tempAllowed: Infinity,


        })
        .setMethod({


            updateTile: function() {
                // No super
            }
            .setProp({
                noSuper: true,
            }),


            config: function() {
                return packConfig({
                    rcHeader: this.delegee.rcHeader,
                    tempSet: this.delegee.tempSet,
                });
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            buildConfiguration: function(tb) {
                // No super
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof B_electricFurnaceRecipeFactory
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
             * @memberof B_electricFurnaceRecipeFactory
             * @instance
             * @func
             * @return {number}
             */
            ex_getHeatTarget: function() {
                return this.delegee.tempReq;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_electricFurnaceRecipeFactory
             * @instance
             * @func
             * @return {number}
             */
            ex_getHeatAllowed: function() {
                return this.delegee.tempAllowed;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_electricFurnaceRecipeFactory
             * @instance
             * @func
             * @return {number}
             */
            ex_calcFailP: function thisFun() {
                return comp_ex_calcFailP(this) * thisFun.funPrev.call(this);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


    ];
