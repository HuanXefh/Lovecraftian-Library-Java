/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_torqueBlock>} INTFBLKTorqueBlock
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_torqueBlock>} INTFBTorqueBlock
     * @prop {INTFBLKTorqueBlock} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKTorqueBlock} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.delegee.torqueBlockUpdater = new INTFBLKTorqueBlockUpdater(blk);
    };


    /**
     * @private
     * @param {INTFBLKTorqueBlock} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        blk.addBar("lovec-rpm", b => new Bar(
            prov(() => Core.bundle.format("bar.lovec-bar-rpm-amt", Strings.fixed(b.delegee.rpmCur, 1))),
            prov(() => Pal.powerBar),
            () => Mathf.clamp(b.delegee.rpmCur / 10.0),
        ));
        blk.addBar("lovec-tor", b => new Bar(
            prov(() => Core.bundle.format("bar.lovec-bar-tor-amt", Strings.fixed(b.delegee.torCur, 1))),
            prov(() => Pal.metalGrayDark),
            () => Mathf.clamp(b.delegee.torCur / blk.size / Math.max(b.delegee.rpmCur, 0.1)),
        ));
    };


    /**
     * @private
     * @param {INTFBTorqueBlock} b
     * @return {void}
     */
    function comp_created(b) {
        b.delegee.torqueBlockBuildUpdater = new INTFBTorqueBlockUpdater(b.block.delegee.torqueBlockUpdater, b);

        BOX_trigger.torqueBlockPlace.fire(b);
        MDL_event.onDelayRun(0.0, () => {
            BOX_trigger.torqueBlockPlace.addListener(ob => b.delegee.torProg = 0.0);
            BOX_trigger.torqueBlockConfigure.addListener(ob => b.delegee.torProg = 0.0);
        });

        // Just in case
        MDL_event.onDelayRun(5.0, () => {
            if(isNaN(b.delegee.torCur)) b.delegee.torCur = 0.0;
            if(isNaN(b.delegee.rpmCur)) b.delegee.rpmCur = 0.0;
        });
    };


    /**
     * @private
     * @param {INTFBTorqueBlock} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        MDL_event.onDelayRun(60.0, () => {
            b.self.ex_updateTorFetchTargets();
            b.self.ex_updateTorSupplyTargets();
            b.self.ex_updateTorTransTargets();
        });
    };


    /**
     * @private
     * @param {INTFBTorqueBlock} b
     * @return {void}
     */
    function comp_pickedUp(b) {
        b.delegee.torFetchTargets.clear();
        b.delegee.torSupplyTargets.clear();
        b.delegee.torTransTargets.clear();

        b.delegee.torCur = 0.0;
        b.delegee.rpmCur = 0.0;
    };


    /**
     * @private
     * @param {INTFBTorqueBlock} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(GLB_param.UPDATE_SUPPRESSED || DEBUG.skipTorUpdate) return;

        b.delegee.torProg += b.delegee.rpmCur / 6.0 * Time.delta;
        b.self.ex_updateTor();
        if(!b.block.delegee.skipTorSupply) {
            b.self.ex_supplyTor();
        };

        // RPM spontaneously drops
        b.delegee.rpmCur = Mathf.maxZero(b.delegee.rpmCur - b.delegee.rpmCur * b.block.delegee.rpmDropRate * Time.delta / b.block.size);
        // Infinite RPM kill
        if(b.delegee.rpmCur > Number.n8) {
            b.kill();
        };
    };

    /**
     * @private
     * @param {INTFBTorqueBlock} b
     * @param {Building} ob
     * @param {number} rateAdd
     * @param {number} rateCons
     * @return {void}
     */

    function comp_ex_updateRpmDmg(b, ob, rateAdd, rateCons) {
        if(rateCons < 0.0001 || rateAdd <= rateCons * 3.0) return;

        Core.app.post(() => {
            // I have to delay this or crash happens somehow, idk why
            ob.damagePierce(ob.maxHealth * (GLB_var.param.rpmDmgFrac + (rateAdd - rateCons * 3.0) / rateCons));
        });
        MDL_effect.fadeText(ob.x, ob.y, MDL_bundle.getInfo("lovec", "rpm-overload"), Pal.remove, ob.block.size * 0.5);
    };


    /**
     * @private
     * @param {INTFBTorqueBlock} b
     * @return {void}
     */
    function comp_ex_updateTorFetchTargets(b) {
        if(b.block.delegee.skipTorFetch) return;

        b.delegee.torFetchTargets.clear();
        let rateProd;
        b.proximity.each(ob => {
            if(ob.block instanceof LiquidSource) {
                b.delegee.torFetchTargets.push(ob, 100.0 / 60.0);
            } else {
                if(ob.block instanceof MultiBlockLinkBlock) {
                    ob = ob.linkedBuild;
                };
                rateProd = MDL_recipeDict.getProdAmt(GLB_varGen.auxTor, ob.block);
                if(rateProd < 0.0001) return;
                b.delegee.torFetchTargets.push(ob, rateProd);
            };
        });
    };


    /**
     * @private
     * @param {INTFBTorqueBlock} b
     * @return {void}
     */
    function comp_ex_updateTorSupplyTargets(b) {
        if(b.block.delegee.skipTorSupply) return;

        b.delegee.torSupplyTargets.clear();
        b.proximity.each(ob => {
            if(ob.block instanceof LiquidVoid) {
                b.delegee.torSupplyTargets.push(ob, 100.0 / 60.0);
            } else {
                if(ob.block instanceof MultiBlockLinkBlock) {
                    ob = ob.linkedBuild;
                };
                if(ob.block.consumesLiquid(GLB_varGen.auxTor) || ob.block.consumesLiquid(GLB_varGen.auxRpm)) {
                    b.delegee.torSupplyTargets.push(ob, MDL_recipeDict.getConsAmt(GLB_varGen.auxTor, ob.block));
                };
            };
        });
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Handles methods related to torque and RPM.
         * @class INTF_BLK_torqueBlock
         */
        new CLS_interface("INTF_BLK_torqueBlock", {


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: If true, this block cannot gain torque and RPM from producers.
                     * @memberof INTF_BLK_torqueBlock
                     * @instance
                     * @type {boolean}
                     */
                    skipTorFetch: false,
                    /**
                     * `PARAM`: If true, this block cannot supply torque and RPM for consumers.
                     * @memberof INTF_BLK_torqueBlock
                     * @instance
                     * @type {boolean}
                     */
                    skipTorSupply: false,
                    /**
                     * `PARAM`: How fast RPM drops to zero spontaneously.
                     * @memberof INTF_BLK_torqueBlock
                     * @instance
                     * @type {number}
                     */
                    rpmDropRate: 0.002,


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`
                     * @memberof INTF_BLK_torqueBlock
                     * @instance
                     * @type {ContentUpdater<Block>}
                     */
                    torqueBlockUpdater: null,


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
         * @class INTF_B_torqueBlock
         */
        new CLS_interface("INTF_B_torqueBlock", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_torqueBlock
                     * @instance
                     * @type {BuildUpdater<Building, Block>}
                     */
                    torqueBlockBuildUpdater: null,
                    /**
                     * `INTERNAL`: Visual progress for torque-related animation.
                     * @memberof INTF_B_torqueBlock
                     * @instance
                     * @type {number}
                     */
                    torProg: 0.0,
                    /**
                     * `INTERNAL`: Current torque amount.
                     * @memberof INTF_B_torqueBlock
                     * @instance
                     * @type {number}
                     */
                    torCur: 0.0,
                    /**
                     * `INTERNAL`: Max torque currently allowed to store. Usually determined by RPM.
                     * @memberof INTF_B_torqueBlock
                     * @instance
                     * @type {number}
                     */
                    torCap: -1.0,
                    /**
                     * `INTERNAL`: Current RPM.
                     * @memberof INTF_B_torqueBlock
                     * @instance
                     * @type {number}
                     */
                    rpmCur: 0.0,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_torqueBlock
                     * @instance
                     * @type {TDynamic<Array<Building>>}
                     */
                    torFetchTargets: tprov(() => []),
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_torqueBlock
                     * @instance
                     * @type {TDynamic<Array<Building>>}
                     */
                    torSupplyTargets: tprov(() => []),
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_torqueBlock
                     * @instance
                     * @type {TDynamic<Array<Building>>}
                     */
                    torTransTargets: tprov(() => []),


                };
            },


            created: function() {
                comp_created(this);
            },


            onProximityUpdate: function() {
                comp_onProximityUpdate(this);
            },


            pickedUp: function() {
                comp_pickedUp(this);
            },


            updateTile: function() {
                comp_updateTile(this);
            },


            /**
             * @memberof INTF_B_torqueBlock
             * @instance
             * @func
             * @return {void}
             */
            ex_updateTor: function() {
                this.delegee.torqueBlockBuildUpdater.ex_updateTor();
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_torqueBlock
             * @instance
             * @func
             * @return {void}
             */
            ex_supplyTor: function() {
                this.delegee.torqueBlockBuildUpdater.ex_supplyTor();
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_torqueBlock
             * @instance
             * @func
             * @param {Building} ob
             * @param {number} rateAdd
             * @param {number} rateCons
             * @return {void}
             */
            ex_updateRpmDmg: function(ob, rateAdd, rateCons) {
                comp_ex_updateRpmDmg(this, ob, rateAdd, rateCons);
            }.setProp({
                noSuper: true,
                argLen: 3,
            }),


            /**
             * @memberof INTF_B_torqueBlock
             * @instance
             * @func
             * @return {void}
             */
            ex_updateTorFetchTargets: function() {
                comp_ex_updateTorFetchTargets(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_torqueBlock
             * @instance
             * @func
             * @return {void}
             */
            ex_updateTorSupplyTargets: function() {
                comp_ex_updateTorSupplyTargets(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Transfer targets should be determined by the block type.
             * <br> `LATER`
             * @memberof INTF_B_torqueBlock
             * @instance
             * @func
             * @return {void}
             */
            ex_updateTorTransTargets: function() {

            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_torqueBlock
             * @instance
             * @func
             * @return {number}
             */
            ex_calcRpmTarget: function() {
                return this.delegee.torqueBlockBuildUpdater.ex_calcRpmTarget();
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * RPM transferred to another torque block.
             * <br> A cogwheel's transported RPM should be affected by block size, so this value should be dynamic.
             * <br> `LATER`
             * @memberof INTF_B_torqueBlock
             * @instance
             * @func
             * @param {Building} b_t
             * @return {number}
             */
            ex_calcRpmTrans: function(b_t) {
                return this.delegee.rpmCur;
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * Extra multiplier on RPM transported to this building.
             * @memberof INTF_B_torqueBlock
             * @instance
             * @func
             * @return {Building} b_f
             * @return {number}
             */
            ex_calcRpmAcceptScl: function(b_f) {
                return 1.0;
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * Whether torque transfer is valid.
             * <br> `LATER`
             * @memberof INTF_B_torqueBlock
             * @instance
             * @func
             * @param {Building} ob
             * @return {boolean}
             */
            ex_checkTorTransValid: function(ob) {
                return true;
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * @memberof INTF_B_torqueBlock
             * @instance
             * @func
             * @param {Writes|Reads} wr0rd
             * @return {void}
             */
            ex_processData: function(wr0rd) {
                processData(
                    wr0rd,
                    wr => {
                        wr.f(this.delegee.rpmCur);
                        wr.f(this.delegee.torCur);
                    },
                    rd => {
                        this.delegee.rpmCur = rd.f();
                        this.delegee.torCur = rd.f();
                    },
                );
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


        }),


    ];
