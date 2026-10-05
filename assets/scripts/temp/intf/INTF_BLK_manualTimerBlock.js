/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_manualTimerBlock>} INTFBLKManualTimerBlock
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_manualTimerBlock>} INTFBManualTimerBlock
     * @prop {INTFBLKManualTimerBlock} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKManualTimerBlock} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.configurable = true;

        let scr = b => {
            b.delegee.timeClickCur = Math.min(b.delegee.timeClickCur + blk.delegee.manualTimerClickInc, blk.delegee.manualTimerCap);
            MDL_effect.click(b.x, b.y, b.team.color);
            MDL_sound.playAt(b.x, b.y, "SOUNDS: click");
        };
        switch(blk.delegee.manualTimerCfgType) {
            case "boolean" :
                blk.config(JAVA.boolean, (b, bool) => {
                    if(bool) scr(b);
                    b.self.ex_onManualTimerConfigured(bool);
                });
                break;
            case "string" :
                blk.config(JAVA.string, (b, str) => {
                    if(str === "SPEC: click") scr(b);
                    b.self.ex_onManualTimerConfigured(str);
                });
                break;
            case "float" :
                blk.config(JAVA.float, (b, f) => {
                    scr(b);
                    b.self.ex_onManualTimerConfigured(f);
                });
                break;
            default :
                throw new Error("Unsupported config type: " + blk.delegee.manualTimerCfgType);
        };

        blk.self.ex_addLogicF(LogicProp.ammo, b => b.delegee.timeClickCur / 60.0);
        blk.self.ex_addLogicF(LogicProp.ammoCapacity, b => blk.delegee.manualTimerCap / 60.0);
    };


    /**
     * @private
     * @param {INTFBLKManualTimerBlock} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(fetchStat("lovec", "blk0misc-maxdur"), blk.delegee.manualTimerCap / 3600.0, StatUnit.minutes);
    };


    /**
     * @private
     * @param {INTFBLKManualTimerBlock} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        blk.addBar("lovec-timer", b => new Bar(
            prov(() => MDL_bundle.getInfo("lovec", "text-remaining-time") + " " + Strings.fixed(b.delegee.timeClickCur / 60.0, 0) + " " + StatUnit.seconds.localized()),
            prov(() => Tmp.c1.set(Pal.remove).lerp(Pal.heal, Mathf.clamp(b.delegee.timeClickCur / blk.delegee.manualTimerCap))),
            () => 1.0,
        ));
    };


    /**
     * @private
     * @param {INTFBManualTimerBlock} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(b.efficiency > 0.0) {
            b.delegee.timeClickCur = Mathf.maxZero(b.delegee.timeClickCur - b.edelta() / b.timeScale);
        };
    };


    /**
     * @private
     * @param {INTFBManualTimerBlock} b
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
     * @param {INTFBManualTimerBlock} b
     * @return {void}
     */
    function comp_ex_configureClick(b) {
        let cfgVal = null;
        switch(b.block.delegee.manualTimerCfgType) {
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
         * This block will be charged when player clicks it.
         * @class INTF_BLK_manualTimerBlock
         */
        new CLS_interface("INTF_BLK_manualTimerBlock", {


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: See {@link INTF_BLK_manualClickBlock#manualClickCfgType}.
                     * @memberof INTF_BLK_manualTimerBlock
                     * @instance
                     * @type {string}
                     */
                    manualTimerCfgType: "boolean",
                    /**
                     * `PARAM`: Maximum time charged in frames.
                     * @memberof INTF_BLK_manualTimerBlock
                     * @instance
                     * @type {number}
                     */
                    manualTimerCap: Number.n8,
                    /**
                     * `PARAM`: Time charged by on single click.
                     * @memberof INTF_BLK_manualTimerBlock
                     * @instance
                     * @type {number}
                     */
                    manualTimerClickInc: 60.0,
                    /**
                     * `PARAM`: See {@link INTF_BLK_manualClickBlock#skipTapConfig}.
                     * @memberof INTF_BLK_manualTimerBlock
                     * @instance
                     * @type {boolean}
                     */
                    skipTapConfig: false,


                };
            },


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            setBars: function() {
                comp_setBars(this);
            },


        }),


        /**
         * @class INTF_B_manualTimerBlock
         */
        new CLS_interface("INTF_B_manualTimerBlock", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_manualTimerBlock
                     * @instance
                     * @type {number}
                     */
                    timeClickCur: 0.0,


                };
            },


            updateTile: function() {
                comp_updateTile(this);
            },


            shouldConsume: function() {
                return this.delegee.timeClickCur > 0.0;
            }
            .setProp({
                boolMode: "and",
            }),


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
             * @memberof INTF_B_manualTimerBlock
             * @instance
             * @func
             * @param {Object} val
             * @return {void}
             */
            ex_onManualTimerConfigured: function(val) {

            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * See {@link INTF_B_manualClickBlock#ex_configureClick}.
             * @memberof INTF_B_manualTimerBlock
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
             * @memberof INTF_B_manualTimerBlock
             * @instance
             * @func
             * @param {Writes|Reads} wr0rd
             * @return {void}
             */
            ex_processData: function(wr0rd) {
                processData(
                    wr0rd,
                    wr => {
                        wr.f(this.delegee.timeClickCur);
                    },
                    rd => {
                        this.delegee.timeClickCur = rd.f();
                    },
                );
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


        }),


    ];
