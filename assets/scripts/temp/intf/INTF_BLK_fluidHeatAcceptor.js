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
        blk.fHeatRes = MDL_flow.getHeatRes(blk);
    };


    /**
     * @private
     * @param {INTFBLKFluidHeatAcceptor} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.fHeatReg = fetchRegionOrNull(blk, "-fluid-heat", "-heat");
    };


    /**
     * @private
     * @param {INTFBLKFluidHeatAcceptor} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        if(isFinite(blk.fHeatRes)) {
            stats.add(fetchStat("lovec", "blk0heat-heatres"), blk.fHeatRes, fetchStatUnit("lovec", "heatunits"));
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
            () => Mathf.clamp(b.delegee.fHeatCur / blk.fHeatRes),
        ));
    };


    /**
     * @private
     * @param {INTFBFluidHeatAcceptor} b
     * @return {void}
     */
    function comp_created(b) {
        b.fHeatCur = PARAM.GLOBAL_HEAT;
        b.fHeatTarget = MDL_flow.getFHeatInBuild(b, true);
    };


    /**
     * @private
     * @param {INTFBFluidHeatAcceptor} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(TIMER.heat && syncChance("fluidHeat", 0.25)) {
            b.fHeatTarget = MDL_flow.getFHeatInBuild(b, true);
        };
        if(TIMER.heat) {
            b.fHeatCur = Mathf.lerpDelta(b.fHeatCur, b.fHeatTarget, b.block.delegee.fHeatWarmupRate * VAR.time.heatIntv);
        };

        if(
            !PARAM.UPDATE_SUPPRESSED && TIMER.secQuarter
                && syncChance("fluidHeat", 0.25)
                && isFinite(b.block.delegee.fHeatRes) && b.fHeatCur - b.block.delegee.fHeatRes < 0.0001
        ) {
            b.damagePierce(2.0 * b.fHeatCur / b.block.delegee.fHeatRes);
            MDL_effect.showAt(b.x, b.y, EFF.smogHeat, 0.0);
        };
    };


    /**
     * @private
     * @param {INTFBFluidHeatAcceptor} b
     * @return {void}
     */
    function comp_draw(b) {
        if(!PARAM.SHOULD_DRAW_FLUID_HEAT || !VARGEN.hotFlds.includes(b.liquids.current())) return;
        let fHeatRes = b.block.delegee.fHeatRes;
        if(!isFinite(fHeatRes)) return;
        LCDrawf.heat(
            b.x, b.y,
            b.block.delegee.fHeatReg,
            Math.pow(Mathf.clamp(b.fHeatCur * 0.75 / fHeatRes), 3),
            b.block.size,
            b.block.delegee.shouldRotFHeatReg ? b.drawrot() : 0.0,
        );
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
                     * @type {number}
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
                        wr.f(this.fHeatCur);
                    },
                    rd => {
                        if(this.LCReviSub >= 0 || !this.block.ex_isSubInsOf("BLK_rainCollector")) {
                            this.fHeatCur = rd.f();
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
