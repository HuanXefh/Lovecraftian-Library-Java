/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_manualStartBlock>} INTFBLKManualStartBlock
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_manualStartBlock>} INTFBManualStartBlock
     * @prop {INTFBLKManualStartBlock} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKManualStartBlock} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.configurable = true;

        let scr = b => {
            b.delegee.manualStartWarmup = Mathf.lerp(b.delegee.manualStartWarmup, 1.2, blk.delegee.manualStartIncRate * 1.65);
            MDL_effect.click(b.x, b.y, b.team.color);
            MDL_sound.playAt(b.x, b.y, "SOUNDS: click");
        };
        switch(blk.delegee.manualStartCfgType) {
            case "boolean" :
                blk.config(JAVA.boolean, (b, bool) => {
                    if(bool) scr(b);
                    b.self.ex_onManualStartConfigured(bool);
                });
                break;
            case "string" :
                blk.config(JAVA.string, (b, str) => {
                    if(str === "SPEC: click") scr(b);
                    b.self.ex_onManualStartConfigured(str);
                });
                break;
            case "float" :
                blk.config(JAVA.float, (b, f) => {
                    scr(b);
                    b.self.ex_onManualStartConfigured(f);
                });
                break;
            default :
                throw new Error("Unsupported config type: " + blk.delegee.manualStartCfgType);
        };
    };


    /**
     * @private
     * @param {INTFBLKManualStartBlock} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        blk.addBar("lovec-warmup", b => new Bar(
            prov(() => Core.bundle.format("bar.lovec-bar-warmup-amt", b.self.ex_getManualStartFrac().perc())),
            prov(() => Pal.ammo),
            () => b.self.ex_getManualStartFrac(),
        ));
    };


    /**
     * @private
     * @param {INTFBManualStartBlock} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(b.efficiency < 0.0001 || !b.shouldConsume()) {
            b.delegee.manualStartWarmup = Mathf.lerpDelta(b.delegee.manualStartWarmup, 0.0, b.block.delegee.manualStartDecRate);
        } else {
            b.delegee.manualStartWarmup = Mathf.lerpDelta(b.delegee.manualStartWarmup, 1.4, b.block.delegee.manualStartIncRate);
        };
        if(b.delegee.manualStartWarmup < 0.001) {
            b.delegee.manualStartWarmup = 0.0;
        };
    };


    /**
     * @private
     * @param {INTFBManualStartBlock} b
     * @return {void}
     */
    function comp_updateEfficiencyMultiplier(b) {
        b.efficiency *= b.self.ex_getManualStartFrac();
    };


    /**
     * @private
     * @param {INTFBManualStartBlock} b
     * @return {boolean}
     */
    function comp_configTapped(b) {
        if(b.block.delegee.skipTapConfig) return true;
        Vars.state.paused ?
            MDL_ui.showFadeInfo("lovec", "paused-manual-click") :
            b.self.ex_configureClick();
        return false;
    };


    /**
     * @private
     * @param {INTFBManualStartBlock} b
     * @return {void}
     */
    function comp_ex_postUpdateEfficiencyMultiplier(b) {
        comp_updateEfficiencyMultiplier(b);
    };


    /**
     * @private
     * @param {INTFBManualStartBlock} b
     * @return {void}
     */
    function comp_ex_configureClick(b) {
        let cfgVal = null;
        switch(b.block.delegee.manualStartCfgType) {
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
         * Click this block fast enough to activate it!
         * @class INTF_BLK_manualStartBlock
         */
        new CLS_interface("INTF_BLK_manualStartBlock", {


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: See {@link INTF_BLK_manualClickBlock#manualStartCfgType}.
                     * @memberof INTF_BLK_manualStartBlock
                     * @instance
                     * @type {string}
                     */
                    manualStartCfgType: "boolean",
                    /**
                     * `PARAM`: Warmup increase rate.
                     * @memberof INTF_BLK_manualStartBlock
                     * @instance
                     * @type {number}
                     */
                    manualStartIncRate: 0.001,
                    /**
                     * `PARAM`: Warmup decrease rate.
                     * @memberof INTF_BLK_manualStartBlock
                     * @instance
                     * @type {number}
                     */
                    manualStartDecRate: 0.008,
                    /**
                     * `PARAM`: See {@link INTF_BLK_manualClickBlock#skipTapConfig}.
                     * @memberof INTF_BLK_manualStartBlock
                     * @instance
                     * @number {boolean}
                     */
                    skipTapConfig: false,


                };
            },


            init: function() {
                comp_init(this);
            },


            setBars: function() {
                comp_setBars(this);
            },


        }),


        /**
         * @class INTF_B_manualStartBlock
         */
        new CLS_interface("INTF_B_manualStartBlock", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_manualStartBlock
                     * @instance
                     * @type {number}
                     */
                    manualStartWarmup: 0.0,


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
             * See {@link INTF_B_manualClickBlock#ex_onManualClickConfigured}.
             * <br> `LATER`
             * @memberof INTF_B_manualStartBlock
             * @instance
             * @func
             * @param {Object} val
             * @return {void}
             */
            ex_onManualStartConfigured: function(val) {

            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * @memberof INTF_B_manualStartBlock
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
             * @memberof INTF_B_manualStartBlock
             * @instance
             * @func
             * @return {number}
             */
            ex_getManualStartFrac: function() {
                return Mathf.clamp(this.manualStartWarmup - 0.2);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * See {@link INTF_B_manualClickBlock#ex_configureClick}.
             * @memberof INTF_B_manualStartBlock
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


            /**
             * @memberof INTF_B_manualStartBlock
             * @instance
             * @func
             * @param {Writes|Reads} wr0rd
             * @return {void}
             */
            ex_processData: function(wr0rd) {
                processData(
                    wr0rd,
                    wr => {
                        wr.f(this.delegee.manualStartWarmup);
                    },
                    rd => {
                        this.delegee.manualStartWarmup = rd.f();
                    },
                );
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


        }),


    ];
