/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_recipeSelector>} INTFBLKRecipeSelector
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_recipeSelector>} INTFBRecipeSelector
     * @prop {INTFBLKRecipeSelector} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKRecipeSelector} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.configurable = true;
        blk.saveConfig = true;
        blk.clearOnDoubleTap = false;

        blk.self.ex_addConfigM("rcHeader", (b, val) => {
            b.delegee.rcHeader = val;
            b.self.ex_showRcChangeEff()
        });

        blk.self.ex_addLogicF(LogicProp.config, b => b.delegee.rcHeader);
        blk.self.ex_addLogicControl(LogicProp.config, (b, param1) => {
            if(typeof param1 === "string" && param1 !== b.delegee.rcHeader && MDL_recipe.checkHeaderValid(blk.rcMdl, param1)) {
                b.configure(param1);
            };
        });
    };


    /**
     * @private
     * @param {INTFBRecipeSelector} b
     * @param {Table} tb
     * @return {void}
     */
    function comp_buildConfiguration(b, tb) {
        tb.row();
        MDL_table.setRcSelect(
            tb, b,
            () => b.delegee.rcHeader, val => b.configure(val),
            b.self.ex_getSelectorExtraBtnSetters(),
            null,
            {colAmt: b.block.selectionColumns, closeSelect: false, useAutoSelection: b.delegee.blk$useAutoSelection},
        );
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Handles recipe selection, must be implemented before {@link INTF_BLK_recipeHandler}.
         * @class INTF_BLK_recipeSelector
         */
        new CLS_interface("INTF_BLK_recipeSelector", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`
                     * <br> `REALIZED`
                     * @override
                     * @memberof INTF_BLK_recipeSelector
                     * @instance
                     * @type {boolean}
                     */
                    useConfigStr: true,


                };
            },


            init: function() {
                comp_init(this);
            },


        }),


        /**
         * @class INTF_B_recipeSelector
         */
        new CLS_interface("INTF_B_recipeSelector", {


            buildConfiguration: function(tb) {
                comp_buildConfiguration(this, tb)
            }
            .setProp({
                noSuper: true,
            }),


            config: function() {
                return this.delegee.rcHeader;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * @override
             * @memberof INTF_B_recipeSelector
             * @instance
             * @func
             * @param {string} str
             * @return {void}
             */
            ex_handleConfigStrDef: function(str) {
                this.self.ex_updateRcParam(this.block.delegee.rcMdl, str, true);
                this.self.ex_resetRcParam();
                this.delegee.rcHeader = str;
                if(!this.delegee.blk$useAutoSelection) {
                    this.self.ex_showRcChangeEff();
                };
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 1,
            }),


            /**
             * Used to add extra buttons to recipe selector table (tiny buttons over selection menu).
             * @memberof INTF_B_recipeSelector
             * @instance
             * @func
             * @return {Array<CFunction<Table>>}
             * @example
             * // Adds two buttons ("A" and "B") to print something to console
             * return [
             *     tb => tb.button("A", () => print("ohno")),
             *     tb => tb.button("B", () => print("ohyes")),
             * ];
             */
            ex_getSelectorExtraBtnSetters: function() {
                return [];
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
