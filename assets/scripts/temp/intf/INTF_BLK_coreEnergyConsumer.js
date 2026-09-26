/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_coreEnergyConsumer>} INTFBLKCoreEnergyConsumer
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_coreEnergyConsumer>} INTFBCoreEnergyConsumer
     * @prop {INTFBLKCoreEnergyConsumer} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKCoreEnergyConsumer} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.useCep = DB_block.db["param"]["cep"]["use"].read(blk.name) != null;
    };


    /**
     * @private
     * @param {INTFBLKCoreEnergyConsumer} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        let cepProv = FRAG_faci.getCepProv(blk);
        if(cepProv > 0.0) {
            stats.add(fetchStat("lovec", "blk0misc-cepprov"), cepProv);
        };
        let cepUse = FRAG_faci.getCepUse(blk);
        if(cepUse > 0.0) {
            stats.add(fetchStat("lovec", "blk0misc-cepuse"), cepUse);
        };
    };


    /**
     * @private
     * @param {INTFBLKCoreEnergyConsumer} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        if(
            !(blk instanceof CoreBlock)
                && DB_block.db["param"]["cep"]["use"].read(blk.name) == null
                && DB_block.db["param"]["cep"]["prov"].read(blk.name) == null
        ) return;

        blk.addBar("lovec-cep", b => new Bar(
            prov(() => Core.bundle.format("bar.lovec-bar-cep-amt", (FRAG_faci.getCepCapCur(b.team) - FRAG_faci.getCepUseCur(b.team)) + "/" + FRAG_faci.getCepCapCur(b.team))),
            prov(() => FRAG_faci.getCepFracCur(b.team) < 1.0 ? Pal.accent : Tmp.c1.set(Color.scarlet).lerp(Color.clear, Math.abs(Math.sin(Time.globalTime * 0.03)))),
            () => FRAG_faci.getCepFracCur(b.team) > 1.0 ? 1.0 : Mathf.clamp(1.0 - FRAG_faci.getCepFracCur(b.team)),
        ));
    };


    /**
     * @private
     * @param {INTFBCoreEnergyConsumer} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(!b.block.delegee.useCep) return;

        if(TIMER.effc) {
            b.cepEffc = FRAG_faci.getCepEffcCur(b.team);
        };
        if(TIMER.coreSignal && b.efficiency > 0.0 && b.shouldConsume()) {
            MDL_effect.coreSignal(b.x, b.y, b.team, b.block.size * 0.6 * Vars.tilesize);
        };
    };


    /**
     * @private
     * @param {INTFBCoreEnergyConsumer} b
     * @return {void}
     */
    function comp_updateEfficiencyMultiplier(b) {
        if(b.block.delegee.useCep) {
            b.efficiency *= b.cepEffc;
        };
    };


    /**
     * @private
     * @param {INTFBCoreEnergyConsumer} b
     * @return {void}
     */
    function comp_ex_postUpdateEfficiencyMultiplier(b) {
        comp_updateEfficiencyMultiplier(b);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Handles core energy consumption and efficiency.
         * CEP parameters are set in {@link DB_block.db.param.cep}.
         * @class INTF_BLK_coreEnergyConsumer
         */
        new CLS_interface("INTF_BLK_coreEnergyConsumer", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`: Whether this block consumes or produces CEP. Should be set up in {@link DB_block.db.param.cep.use}.
                     * @memberof INTF_BLK_coreEnergyConsumer
                     * @instance
                     * @type {boolean}
                     */
                    useCep: false,


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
         * @class INTF_B_coreEnergyConsumer
         */
        new CLS_interface("INTF_B_coreEnergyConsumer", {


            __paramObjM__: function() {
                return {


                    /**
                     * `INTERNAL`: CEP efficiency.
                     * @memberof INTF_B_coreEnergyConsumer
                     * @instance
                     * @type {number}
                     */
                    cepEffc: 1.0,


                };
            },


            updateTile: function() {
                comp_updateTile(this);
            },


            updateEfficiencyMultiplier: function() {
                comp_updateEfficiencyMultiplier(this);
            },


            /**
             * @memberof INTF_B_coreEnergyConsumer
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


        }),


    ];
