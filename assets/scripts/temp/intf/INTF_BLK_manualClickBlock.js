/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_manualClickBlock>} INTFBLKManualClickBlock
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_manualClickBlock>} INTFBManualClickBlock
     * @prop {INTFBLKManualClickBlock} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKManualClickBlock} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.configurable = true;

        let scr = b => {
            b.delegee.manualClickFrac = Mathf.lerp(b.delegee.manualClickFrac, 1.25, 0.125);
            MDL_effect.click(b.x, b.y, b.team.color);
            MDL_sound.playAt(b.x, b.y, "SOUNDS: click");
        };
        switch(blk.manualClickCfgType) {
            case "boolean" :
                blk.config(JAVA.boolean, (b, bool) => {
                    if(bool) scr(b);
                    b.ex_onManualClickConfigured(bool);
                });
                break;
            case "string" :
                blk.config(JAVA.string, (b, str) => {
                    if(str === "SPEC: click") scr(b);
                    b.ex_onManualClickConfigured(str);
                });
                break;
            case "float" :
                blk.config(JAVA.float, (b, f) => {
                    scr(b);
                    b.ex_onManualClickConfigured(f);
                });
                break;
            default :
                throw new Error("Unsupported config type: " + blk.manualClickCfgType);
        };
    };


    /**
     * @private
     * @param {INTFBManualClickBlock} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(GLB_timer.secQuarter) {
            b.manualClickFrac = Mathf.maxZero(b.manualClickFrac - 0.03);
        };
    };


    /**
     * @private
     * @param {INTFBManualClickBlock} b
     * @return {void}
     */
    function comp_updateEfficiencyMultiplier(b) {
        b.efficiency *= Math.min(b.manualClickFrac, 1.0);
    };


    /**
     * @private
     * @param {INTFBManualClickBlock} b
     * @return {boolean}
     */
    function comp_configTapped(b) {
        if(b.block.delegee.skipTapConfig) return true;
        Vars.state.paused ?
            MDL_ui.showFadeInfo("lovec", "paused-manual-click") :
            b.ex_configureClick();
        return false;
    };


    /**
     * @private
     * @param {INTFBManualClickBlock} b
     * @return {void}
     */
    function comp_ex_postUpdateEfficiencyMultiplier(b) {
        comp_updateEfficiencyMultiplier(b);
    };


    /**
     * @private
     * @param {INTFBManualClickBlock} b
     * @return {void}
     */
    function comp_ex_configureClick(b) {
        let cfgVal = null;
        switch(b.block.delegee.manualClickCfgType) {
            case "boolean" :
                cfgVal = true;
                break;
            case "string" :
                cfgVal = "SPEC: click";
                break;
            case "float" :
                cfgVal = -Number.n8;
                break;
        };
        if(cfgVal != null) {
            b.configure(cfgVal);
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * This block only operates when a player keeps clicking it.
         * @class INTF_BLK_manualClickBlock
         */
        new CLS_interface("INTF_BLK_manualClickBlock", {


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: Type of parameter used for config.
                     * @memberof INTF_BLK_manualClickBlock
                     * @instance
                     * @type {string}
                     */
                    manualClickCfgType: "boolean",
                    /**
                     * `PARAM`: Enable this if there's a button to click.
                     * @memberof INTF_BLK_manualClickBlock
                     * @instance
                     * @type {boolean}
                     */
                    skipTapConfig: false,


                };
            },


            init: function() {
                comp_init(this);
            },


        }),


        /**
         * @class INTF_B_manualClickBlock
         */
        new CLS_interface("INTF_B_manualClickBlock", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_manualClickBlock
                     * @instance
                     * @type {number}
                     */
                    manualClickFrac: 0.0,


                };
            },


            updateTile: function() {
                comp_updateTile(this);
            },


            updateEfficiencyMultiplier: function() {
                comp_updateEfficiencyMultiplier(this);
            },


            configTapped: function() {
                return comp_configTapped(this);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * Called whenever this building is configured.
             * <br> `LATER`
             * @memberof INTF_B_manualClickBlock
             * @instance
             * @func
             * @param {Object} val
             * @return {void}
             */
            ex_onManualClickConfigured: function(val) {

            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * @memberof INTF_B_manualClickBlock
             * @instance
             * @func
             * @return {void}
             */
            ex_postUpdateEfficiencyMultiplier: function() {
                comp_ex_postUpdateEfficiencyMultiplier(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Call this to apply one single click.
             * @memberof INTF_B_manualClickBlock
             * @instance
             * @func
             * @return {void}
             */
            ex_configureClick: function() {
                comp_ex_configureClick(this);
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
