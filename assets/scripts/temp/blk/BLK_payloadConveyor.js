/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<PayloadConveyor, BLK_payloadConveyor>} BLKPayloadConveyor
     */


    /**
     * @typedef {TemplateInstance<PayloadConveyor.PayloadConveyorBuild, B_payloadConveyor>} BPayloadConveyor
     * @prop {BLKPayloadConveyor} block
     */


    const PARENT = require("lovec/temp/blk/BLK_basePayloadBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKPayloadConveyor} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.canOverdrive = false;
        if(blk.delegee.setupVanillaProp) {
            if(blk.hasPower) {
                blk.conductivePower = true;
                blk.connectedPower = false;
            };
        };
    };


    /**
     * @private
     * @param {BLKPayloadConveyor} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.routerFadeReg = fetchRegionOrNull(blk, "-fade");
    };


    /**
     * @private
     * @param {BPayloadConveyor} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        // noinspection JSValidateTypes
        b.delegee.backPayRouter = b.back();
        if(
            b.delegee.backPayRouter != null && (
                !checkSubInsOfTemp(b.delegee.backPayRouter.block, "BLK_payloadConveyor")
                    || !b.delegee.backPayRouter.block.delegee.isRouter
                    || b.delegee.backPayRouter.front() === b
            )
        ) {
            b.delegee.backPayRouter = null;
        };
    };


    /**
     * @private
     * @param {BPayloadConveyor} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(b.self.ex_shouldOperate()) {
            if(GLB_timer.secQuarter && b.delegee.backPayRouter != null) {
                b.self.ex_takePay(b.delegee.backPayRouter);
            };
            if(!b.delegee.payJustTaken) {
                b.super$updateTile();
            };
        } else {
            b.progress = Mathf.approachDelta(b.progress, b.block.moveTime, b.block.moveTime * 0.02);
            b.updatePayload();
        };
        if(b.block.delegee.isRouter) {
            b.delegee.routerFadeA = b.delegee.payJustTaken ?
                1.0 :
                Mathf.maxZero(b.delegee.routerFadeA - 0.03 * Time.delta);
        };
        b.delegee.payJustTaken = false;
    };


    /**
     * @private
     * @param {BPayloadConveyor} b
     * @param {Unit} unit
     * @return {void}
     */
    function comp_unitOn(b, unit) {
        if(b.self.ex_shouldOperate()) {
            b.super$unitOn(unit);
        };
    };


    /**
     * @private
     * @param {BPayloadConveyor} b
     * @return {void}
     */
    function comp_draw(b) {
        if(b.block.delegee.isRouter && b.block.delegee.routerFadeReg != null) {
            Draw.mixcol(b.team.color, b.delegee.routerFadeA);
            Draw.rect(b.block.delegee.routerFadeReg, b.x, b.y);
            Draw.reset();
        };
    };


    /**
     * @private
     * @param {BPayloadConveyor} b
     * @param {Building} b_f
     * @return {void}
     */
    function comp_ex_takePay(b, b_f) {
        if(b.item != null || b_f.getPayload() == null || !b_f.getPayload().fits(b.block.payloadLimit)) return;
        let pay = FRAG_payload.takeAt(b_f);
        b_f.delegee.payJustTaken = true;
        if(FRAG_payload.produceAt(b, pay)) {
            MDL_effect.payloadDeposit(b_f.x, b_f.y, b.x, b.y, pay.content(), false);
        };
    };


    /**
     * @private
     * @param {BPayloadConveyor} b
     * @return {boolean}
     */
    function comp_ex_shouldOperate(b) {
        return b.efficiency >= GLB_var.param.buildActiveEffcThr;
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Modified payload conveyors that are affected by efficiency.
         * Conducts power, why not?
         * <br> It's not possible to slow down the conveyor as it will break sync.
         * @class BLK_payloadConveyor
         * @extends BLK_basePayloadBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_payloadConveyor")
        .initTemplate()
        .setParent(PayloadConveyor)
        .setTags()
        .setParam({


            /**
             * `PARAM`: Whether this payload conveyor can actively dump payload to the sides.
             * @memberof BLK_payloadConveyor
             * @instance
             * @type {boolean}
             */
            isRouter: false,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_payloadConveyor
             * @instance
             * @type {TextureRegion|null}
             */
            routerFadeReg: null,


            /* <------------------------------ vanilla ------------------------------> */


            enableDrawStatus: false,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            load: function() {
                comp_load(this);
            },


        }),


        /**
         * @class B_payloadConveyor
         * @extends B_basePayloadBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_payloadConveyor")
        .initTemplate()
        .setParent(PayloadConveyor.PayloadConveyorBuild)
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_payloadConveyor
             * @instance
             * @type {BPayloadConveyor|null}
             */
            backPayRouter: null,
            /**
             * `INTERNAL`
             * @memberof B_payloadConveyor
             * @instance
             * @type {boolean}
             */
            payJustTaken: false,
            /**
             * `INTERNAL`
             * @memberof B_payloadConveyor
             * @instance
             * @type {number}
             */
            routerFadeA: 0.0,


        })
        .setMethod({


            onProximityUpdate: function() {
                comp_onProximityUpdate(this);
            },


            updateTile: function() {
                comp_updateTile(this);
            }
            .setProp({
                noSuper: true,
            }),


            unitOn: function(unit) {
                comp_unitOn(this, unit);
            }
            .setProp({
                noSuper: true,
            }),


            time: function() {
                return this.self.ex_shouldOperate() ? GLB_var.time : 0.0;
            }
            .setProp({
                noSuper: true,
            }),


            draw: function() {
                comp_draw(this);
            },


            /**
             * @memberof B_payloadConveyor
             * @instance
             * @func
             * @param {Building} b_f
             * @return {void}
             */
            ex_takePay: function(b_f) {
                comp_ex_takePay(this, b_f);
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * Whether this payload conveyor should be active currently.
             * @memberof B_payloadConveyor
             * @instance
             * @func
             * @return {boolean}
             */
            ex_shouldOperate: function() {
                return comp_ex_shouldOperate(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @memberof B_payloadConveyor
             * @instance
             * @func
             * @return {ENumber}
             */
            ex_getPayDumpMode: function() {
                return this.block.delegee.isRouter ? SideFracModes.NON_BACK : SideFracModes.FRONT;
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
