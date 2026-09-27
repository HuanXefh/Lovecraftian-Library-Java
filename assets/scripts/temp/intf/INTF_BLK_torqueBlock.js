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
        blk.torqueBlockUpdater = new INTFBLKTorqueBlockUpdater(blk);
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
        b.torqueBlockBuildUpdater = new INTFBTorqueBlockUpdater(b.block.delegee.torqueBlockUpdater, b);

        TRIGGER.torqueBlockPlace.fire(b);
        Time.run(0.0, () => {
            TRIGGER.torqueBlockPlace.addListener(ob => b.torProg = 0.0);
            TRIGGER.torqueBlockConfigure.addListener(ob => b.torProg = 0.0);
        });

        // Just in case
        Time.run(5.0, () => {
            if(isNaN(b.torCur)) b.torCur = 0.0;
            if(isNaN(b.rpmCur)) b.rpmCur = 0.0;
        });
    };


    /**
     * @private
     * @param {INTFBTorqueBlock} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        Time.run(60.0, () => {
            b.ex_updateTorFetchTargets();
            b.ex_updateTorSupplyTargets();
            b.ex_updateTorTransTargets();
        });
    };


    /**
     * @private
     * @param {INTFBTorqueBlock} b
     * @return {void}
     */
    function comp_pickedUp(b) {
        b.torFetchTargets.clear();
        b.torSupplyTargets.clear();
        b.torTransTargets.clear();

        b.torCur = 0.0;
        b.rpmCur = 0.0;
    };


    /**
     * @private
     * @param {INTFBTorqueBlock} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(PARAM.UPDATE_SUPPRESSED || DEBUG.skipTorUpdate) return;

        b.torProg += b.rpmCur / 6.0 * Time.delta;
        b.ex_updateTor();
        if(!b.block.delegee.skipTorSupply) {
            b.ex_supplyTor();
        };

        // RPM spontaneously drops
        b.rpmCur = Mathf.maxZero(b.rpmCur - b.rpmCur * b.block.delegee.rpmDropRate * Time.delta / b.block.size);
        // Infinite RPM kill
        if(b.rpmCur > Number.n8) {
            b.kill();
        };
    };

    /**
     * @private
     * @param {INTFBTorqueBlock} b
     * @return {void}
     */

    function comp_ex_updateRpmDmg(b, ob, rateAdd, rateCons) {
        if(rateCons < 0.0001 || rateAdd <= rateCons * 3.0) return;

        Core.app.post(() => {
            // I have to delay this or crash happens somehow, idk why
            ob.damagePierce(ob.maxHealth * (VAR.param.rpmDmgFrac + (rateAdd - rateCons * 3.0) / rateCons));
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

        b.torFetchTargets.clear();
        let rateProd;
        b.proximity.each(ob => {
            if(ob.block instanceof LiquidSource) {
                b.torFetchTargets.push(ob, 100.0 / 60.0);
            } else {
                if(ob.block instanceof MultiBlockLinkBlock) {
                    ob = ob.linkedBuild;
                };
                rateProd = MDL_recipeDict.getProdAmt(VARGEN.auxTor, ob.block);
                if(rateProd < 0.0001) return;
                b.torFetchTargets.push(ob, rateProd);
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

        b.torSupplyTargets.clear();
        b.proximity.each(ob => {
            if(ob.block instanceof LiquidVoid) {
                b.torSupplyTargets.push(ob, 100.0 / 60.0);
            } else {
                if(ob.block instanceof MultiBlockLinkBlock) {
                    ob = ob.linkedBuild;
                };
                if(ob.block.consumesLiquid(VARGEN.auxTor) || ob.block.consumesLiquid(VARGEN.auxRpm)) {
                    b.torSupplyTargets.push(ob, MDL_recipeDict.getConsAmt(VARGEN.auxTor, ob.block));
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
                     * @type {boolean}
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
                this.torqueBlockBuildUpdater.ex_updateTor();
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
                this.torqueBlockBuildUpdater.ex_supplyTor();
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
                return this.torqueBlockBuildUpdater.ex_calcRpmTarget();
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * RPM transfered to another torque block.
             * <br> A cogwheel's transported RPM should be affected by block size, so this value should be dynamic.
             * <br> `LATER`
             * @memberof INTF_B_torqueBlock
             * @instance
             * @func
             * @param {Building} b_t
             * @return {number}
             */
            ex_calcRpmTrans: function(b_t) {
                return this.rpmCur;
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
                        wr.f(this.rpmCur);
                        wr.f(this.torCur);
                    },
                    rd => {
                        this.rpmCur = rd.f();
                        this.torCur = rd.f();
                    },
                );
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


        }),


    ];
