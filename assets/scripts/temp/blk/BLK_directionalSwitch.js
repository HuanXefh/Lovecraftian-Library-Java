/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<SwitchBlock, BLK_directionalSwitch>} BLKDirectionalSwitch
     */


    /**
     * @typedef {TemplateInstance<SwitchBlock.SwitchBuild, B_directionalSwitch>} BDirectionalSwitch
     * @prop {BLKDirectionalSwitch} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseLogicBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKDirectionalSwitch} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.rotate = true;
        blk.quickRotate = false;

        blk.config(JAVA.boolean, (b, bool) => {
            b.enabled = bool;
            b.block.clickSound.at(b);
            b.self.ex_toggle(b.nearby(b.rotation));
        });
    };


    /**
     * @private
     * @param {BLKDirectionalSwitch} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.dirReg = fetchRegion(blk, "-dir");
    };


    /**
     * @private
     * @param {BLKDirectionalSwitch} blk
     * @param {Block} oblk
     * @return {boolean}
     */
    function comp_ex_isValidTarget(blk, oblk) {
        return tryFun(oblk.ex_canSwitchDisable, oblk, true) && (
            tryFun(oblk.ex_isSwitchDisableTarget, oblk, false)
                || MDL_cond.isMinerBlock(oblk)
                || MDL_cond.isMassDriver(oblk)
                || MDL_cond.isPump(oblk)
                || MDL_cond.isNonReactorPowerGenerator(oblk)
                || MDL_cond.isFactory(oblk)
                || MDL_cond.isAssistanceBlock(oblk)
                || MDL_cond.isTurret(oblk)
        );
    };


    /**
     * @private
     * @param {BDirectionalSwitch} b
     * @return {void}
     */
    function comp_created(b) {
        MDL_event.onDelayRun(0.0, () => {
            let ob = b.nearby(b.rotation);
            b.self.ex_toggle(ob);
        });
    };


    /**
     * @private
     * @param {BDirectionalSwitch} b
     * @return {void}
     */
    function comp_onRemoved(b) {
        if(!b.enabled) return;
        let ob = b.nearby(b.rotation);
        if(ob == null || ob.team !== b.team || ob.enabled || !b.block.self.ex_isValidTarget(ob.block)) return;

        ob.enabled = true;
        GLB_eff.fadePlacePack[ob.block.size].at(ob);
    };


    /**
     * @private
     * @param {BDirectionalSwitch} b
     * @return {void}
     */
    function comp_pickedUp(b) {
        comp_onRemoved(b);
    };


    /**
     * @private
     * @param {BDirectionalSwitch} b
     * @return {void}
     */
    function comp_dropped(b) {
        comp_created(b);
    };


    /**
     * @private
     * @param {BDirectionalSwitch} b
     * @return {boolean}
     */
    function comp_configTapped(b) {
        b.configure(!b.enabled);
        return false;
    };


    /**
     * @private
     * @param {BDirectionalSwitch} b
     * @return {void}
     */
    function comp_draw(b) {
        Draw.rect(b.block.region, b.x, b.y);
        // Drawn only when disabled... since it's meant to disable some buildings
        if(b.enabled) {
            Draw.rect(b.block.onRegion, b.x, b.y);
        };
        Draw.rect(b.block.delegee.dirReg, b.x, b.y, b.drawrot());
    };


    /**
     * @private
     * @param {BDirectionalSwitch} b
     * @param {Building} ob
     * @return {void}
     */
    function comp_ex_toggle(b, ob) {
        if(ob == null || ob.team !== b.team || !b.block.self.ex_isValidTarget(ob.block)) return;
        ob.enabled = !b.enabled;
        ob.enabled ?
            GLB_eff.fadePlacePack[ob.block.size].at(ob) :
            GLB_eff.fadeDisablePack[ob.block.size].at(ob);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Enables or disables the valid building in front of this.
         * <br> `SINGLESIZE`
         * @class BLK_directionalSwitch
         * @extends BLK_baseLogicBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_directionalSwitch")
        .initTemplate()
        .setParent(SwitchBlock)
        .setTags()
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_directionalSwitch
             * @instance
             * @type {TextureRegion}
             */
            dirReg: null,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            load: function() {
                comp_load(this);
            },


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_directionalSwitch
             * @instance
             * @func
             * @return {boolean}
             */
            ex_isSingleSized: function() {
                return true;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * Whether the switch can interact with a specific block.
             * @memberof BLK_directionalSwitch
             * @instance
             * @func
             * @param {Block} oblk
             * @return {boolean}
             */
            ex_isValidTarget: function(oblk) {
                return comp_ex_isValidTarget(this, oblk);
            }
            .setProp({
                noSuper: true,
            }),


        }),


        /**
         * @class B_directionalSwitch
         * @extends B_baseLogicBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_directionalSwitch")
        .initTemplate()
        .setParent(SwitchBlock.SwitchBuild)
        .setParam({})
        .setMethod({


            created: function() {
                comp_created(this);
            },


            onRemoved: function() {
                comp_onRemoved(this);
            },


            pickedUp: function() {
                comp_pickedUp(this);
            },


            dropped: function() {
                comp_dropped(this);
            },


            configTapped: function() {
                return comp_configTapped(this);
            }
            .setProp({
                noSuper: true,
            }),


            draw: function() {
                comp_draw(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof B_directionalSwitch
             * @instance
             * @func
             * @param {Building|null} ob
             * @return {void}
             */
            ex_toggle: function(ob) {
                comp_ex_toggle(this, ob);
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
