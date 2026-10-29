/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_furnaceRecipeFactory>} BLKFurnaceRecipeFactory
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_furnaceRecipeFactory>} BFurnaceRecipeFactory
     * @prop {BLKFurnaceRecipeFactory} block
     */


    const PARENT = require("lovec/temp/blk/BLK_recipeFactory");
    const INTF_BLK_furnaceBlock = require("lovec/temp/intf/INTF_BLK_furnaceBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKFurnaceRecipeFactory} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.self.ex_addConfigM("fuelSel", (b, val) => b.delegee.fuelSel = MDL_content.getCt(val, ContentGetModes.RS));
    };


    /**
     * @private
     * @param {BFurnaceRecipeFactory} b
     * @param {RecipeModule} rcMdl
     * @param {string} rcHeader
     * @return {void}
     */
    function comp_ex_loadRcParam(b, rcMdl, rcHeader) {
        b.delegee.tempReq = b.rc.tempReq;
        b.delegee.tempAllowed = b.rc.tempAllowed;
    };


    /**
     * @private
     * @param {BFurnaceRecipeFactory} b
     * @return {number}
     */
    function comp_ex_calcFailP(b) {
        let frac = Mathf.clamp(Math.min(
            Math.pow(b.delegee.tempCur / b.self.ex_getHeatTarget(), 1.5),
            !isFinite(b.self.ex_getHeatAllowed()) ? Infinity : (b.self.ex_getHeatAllowed() - 2.0 * b.delegee.tempCur) / b.self.ex_getHeatAllowed() + 2.0,
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
         * A type of multi-crafter with temperature mechanics.
         * @class BLK_furnaceRecipeFactory
         * @extends BLK_recipeFactory
         * @extends INTF_BLK_furnaceBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_furnaceRecipeFactory")
        .implement(INTF_BLK_furnaceBlock[0])
        .initTemplate()
        .setParent("GenericCrafter")
        .setTags()
        .setParam({})
        .setMethod({


            init: function() {
                comp_init(this);
            },


            consumesItem: function thisFun(item) {
                return thisFun.funPrev.apply(this, arguments);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            consumesLiquid: function thisFun(liq) {
                return thisFun.funPrev.apply(this, arguments);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


        /**
         * @class B_furnaceRecipeFactory
         * @extends B_recipeFactory
         * @extends INTF_B_furnaceBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_furnaceRecipeFactory")
        .implement(INTF_BLK_furnaceBlock[1])
        .initTemplate()
        .setParent("GenericCrafter.GenericCrafterBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_furnaceRecipeFactory
             * @instance
             * @type {number}
             */
            tempReq: 0.0,
            /**
             * `INTERNAL`
             * @memberof B_furnaceRecipeFactory
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


            acceptItem: function thisFun(b_f, item) {
                return thisFun.funPrev.apply(this, arguments);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            acceptLiquid: function thisFun(b_f, liq) {
                return thisFun.funPrev.apply(this, arguments);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            config: function() {
                return packConfig({
                    rcHeader: this.delegee.rcHeader,
                    fuelSel: this.delegee.fuelSel == null ? "null" : this.delegee.fuelSel.name,
                });
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * @override
             * @memberof B_furnaceRecipeFactory
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
             * @memberof B_furnaceRecipeFactory
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
             * @memberof B_furnaceRecipeFactory
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
             * @memberof B_furnaceRecipeFactory
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


            /**
             * `REALIZED`
             * @override
             * @memberof B_furnaceRecipeFactory
             * @instance
             * @func
             * @param {string} str
             * @return {void}
             */
            ex_handleConfigStrDef: function thisFun(str) {
                if(str.startsWith("FUEL: ")) {
                    this.delegee.fuelSel = MDL_content.getCt(str.replace("FUEL: ", ""), ContentGetModes.RS);
                } else {
                    thisFun.funPrev.apply(this, [str]);
                };
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_furnaceRecipeFactory
             * @instance
             * @func
             * @return {Array<CFunction<Table>>}
             */
            ex_getSelectorExtraBtnSetters: function() {
                return this.block.delegee.noFuelInput ?
                    [] :
                    [
                        tb => tb.button("F", () => {
                            tb.clearChildren();
                            tb.row();
                            this.self.ex_buildFuelSelector(tb);
                        }).tooltip(MDL_bundle.getTerm("lovec", "fuel-filter"), true),
                    ];
            }
            .setProp({
                noSuper: true,
                mergeMode: "array",
            }),


        }),


    ];
