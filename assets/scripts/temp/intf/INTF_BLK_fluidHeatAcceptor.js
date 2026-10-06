/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_fluidHeatAcceptor>} INTFBLKFluidHeatAcceptor
     */


     /**
      * @typedef {TemplateInstance<Building, INTF_B_fluidHeatAcceptor>} INTFBFluidHeatAcceptor
      * @prop {INTFBLKFluidHeatAcceptor} block
      */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKFluidHeatAcceptor} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.delegee.fHeatRes = MDL_flow.getHeatRes(blk);
    };


    /**
     * @private
     * @param {INTFBLKFluidHeatAcceptor} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.fHeatReg = fetchRegionOrNull(blk, "-fluid-heat", "-heat");
    };


    /**
     * @private
     * @param {INTFBLKFluidHeatAcceptor} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        if(isFinite(blk.delegee.fHeatRes)) {
            stats.add(fetchStat("lovec", "blk0heat-heatres"), blk.delegee.fHeatRes, fetchStatUnit("lovec", "heatunits"));
        };
    };


    /**
     * @private
     * @param {INTFBLKFluidHeatAcceptor} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        if(!isFinite(MDL_flow.getHeatRes(blk))) return;
        blk.addBar("lovec-fheat", b => new Bar(
            prov(() => Core.bundle.format("bar.lovec-bar-fluid-heat-amt", Strings.fixed(b.delegee.fHeatCur, 2) + " " + fetchStatUnit("lovec", "heatunits").localized())),
            prov(() => Pal.lightOrange),
            () => Mathf.clamp(b.delegee.fHeatCur / blk.delegee.fHeatRes),
        ));
    };


    /**
     * @private
     * @param {INTFBLKFluidHeatAcceptor} blk
     * @param {Building} b
     * @param {number} a
     * @return {void}
     */
    function comp_ex_drawFHeat(blk, b, a) {
        LCDrawf.heat(
            b.x, b.y,
            blk.delegee.fHeatReg,
            a,
            b.block.size,
            blk.delegee.shouldRotFHeatReg ? b.drawrot() : 0.0,
        );
    };


    /**
     * @private
     * @param {INTFBFluidHeatAcceptor} b
     * @return {void}
     */
    function comp_created(b) {
        b.delegee.fHeatCur = GLB_param.GLOBAL_HEAT;
        b.delegee.fHeatTarget = MDL_flow.getFHeatInBuild(b, true);
    };


    /**
     * @private
     * @param {INTFBFluidHeatAcceptor} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(GLB_timer.heat && syncChance("fluidHeat", 0.25)) {
            b.delegee.fHeatTarget = MDL_flow.getFHeatInBuild(b, true);
        };
        if(GLB_timer.heat) {
            b.delegee.fHeatCur = Mathf.lerpDelta(b.delegee.fHeatCur, b.delegee.fHeatTarget, b.block.delegee.fHeatWarmupRate * GLB_var.timeParam.heatIntv);
        };

        if(
            !GLB_param.UPDATE_SUPPRESSED && GLB_timer.secQuarter
                && syncChance("fluidHeat", 0.25)
                && isFinite(b.block.delegee.fHeatRes) && b.delegee.fHeatCur > b.block.delegee.fHeatRes
        ) {
            b.damagePierce(2.0 * b.delegee.fHeatCur / b.block.delegee.fHeatRes);
            MDL_effect.showAt(b.x, b.y, GLB_eff.smogHeat, 0.0);
        };
    };


    /**
     * @private
     * @param {INTFBFluidHeatAcceptor} b
     * @return {void}
     */
    function comp_draw(b) {
        if(!GLB_param.SHOULD_DRAW_FLUID_HEAT || !GLB_varGen.hotFlds.includes(b.liquids.current())) return;
        let a = Math.pow(Mathf.clamp(b.delegee.fHeatCur / b.block.delegee.visualFullFHeatThr), 3) * 0.5;
        b.block.self.ex_drawFHeat(b, a);
        if(b.linkedBuilds != null) {
            b.linkedBuilds.each(ob => b.block.self.ex_drawFHeat(ob, a));
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Handles methods for fluid heat.
         * @class INTF_BLK_fluidHeatAcceptor
         */
        new CLS_interface("INTF_BLK_fluidHeatAcceptor", {


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: Rate at which fluid heat approaches target temperature.
                     * @memberof INTF_BLK_fluidHeatAcceptor
                     * @instance
                     * @type {number}
                     */
                    fHeatWarmupRate: 0.004,
                    /**
                     * `PARAM`: See {@link BLK_heatConductor#visualFullHeatThr}.
                     * @memberof INTF_BLK_fluidHeatAcceptor
                     * @instance
                     * @type {number}
                     */
                    visualFullFHeatThr: 160.0,
                    /**
                     * `PARAM`: Whether fluid heat region is rotatable.
                     * @memberof INTF_BLK_fluidHeatAcceptor
                     * @instance
                     * @type {boolean}
                     */
                    shouldRotFHeatReg: false,


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`: Fluid heat resistance.
                     * @memberof INTF_BLK_fluidHeatAcceptor
                     * @instance
                     * @type {number}
                     */
                    fHeatRes: 0.0,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_BLK_fluidHeatAcceptor
                     * @instance
                     * @type {TextureRegion|null}
                     */
                    fHeatReg: null,


                };
            },


            init: function() {
                comp_init(this);
            },


            load: function() {
                comp_load(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            setBars: function() {
                comp_setBars(this);
            },


            /**
             * @memberof INTF_BLK_fluidHeatAcceptor
             * @instance
             * @func
             * @param {Building} b
             * @param {number} a
             * @return {void}
             */
            ex_drawFHeat: function(b, a) {
                comp_ex_drawFHeat(this, b, a);
            }
            .setProp({
                noSuper: true,
                argLen: 2,
            }),


        }),


        /**
         * @class INTF_B_fluidHeatAcceptor
         */
        new CLS_interface("INTF_B_fluidHeatAcceptor", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`: Current fluid heat.
                     * @memberof INTF_B_fluidHeatAcceptor
                     * @instance
                     * @type {number}
                     */
                    fHeatCur: 0.0,
                    /**
                     * `INTERNAL`: Target fluid heat.
                     * @memberof INTF_B_fluidHeatAcceptor
                     * @instance
                     * @type {number}
                     */
                    fHeatTarget: 0.0,


                };
            },


            created: function() {
                comp_created(this);
            },


            updateTile: function() {
                comp_updateTile(this);
            },


            draw: function() {
                comp_draw(this);
            },


            /**
             * @memberof INTF_B_fluidHeatAcceptor
             * @instance
             * @func
             * @param {Writes|Reads} wr0rd
             * @return {void}
             */
            ex_processData: function(wr0rd) {
                processData(
                    wr0rd,
                    wr => {
                        wr.f(this.delegee.fHeatCur);
                    },
                    rd => {
                        if(this.delegee.LCReviSub >= 0 || !this.block.ex_isSubInsOf("BLK_rainCollector")) {
                            this.delegee.fHeatCur = rd.f();
                        };
                    },
                );
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


        }),


    ];
