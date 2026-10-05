/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_pollutionHandler>} INTFBLKPollutionHandler
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_pollutionHandler>} INTFBPollutionHandler
     * @prop {INTFBLKPollutionHandler} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKPollutionHandler} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.delegee.polTol = MDL_pollution.getPolTol(blk);
    };


    /**
     * @private
     * @param {INTFBLKPollutionHandler} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        if(blk.delegee.polTol > 0.0) {
            stats.add(fetchStat("lovec", "blk-poltol"), blk.delegee.polTol, fetchStatUnit("lovec", "polunits"));
        };
    };


    /**
     * @private
     * @param {INTFBPollutionHandler} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(b.delegee.blk$polTol > 0.0) {
            b.delegee.polExcess = Mathf.maxZero(MDL_pollution.getGlbPol() - b.delegee.blk$polTol);
            b.delegee.polEffc = b.self.ex_calcPolEffc();

            if(b.delegee.polEffc < 1.0 && Mathf.chanceDelta(0.03)) {
                MDL_effect.corrosion(b.x, b.y, b.block.size, Color.valueOf(Tmp.c1, "2f4108"));
            };
        };
    };


    /**
     * @private
     * @param {INTFBPollutionHandler} b
     * @return {void}
     */
    function comp_updateEfficiencyMultiplier(b) {
        b.efficiency *= b.delegee.polEffc;
    };


    /**
     * @private
     * @param {INTFBPollutionHandler} b
     * @return {void}
     */
    function comp_ex_postUpdateEfficiencyMultiplier(b) {
        comp_updateEfficiencyMultiplier(b);
    };


    /**
     * @private
     * @param {INTFBPollutionHandler} b
     * @return {number}
     */
    function comp_ex_calcPolEffc(b) {
        return b.delegee.polExcess < 0.0001 ?
            (
                b.block.delegee.revertedPolEffc ?
                    0.0 :
                    1.0
            ) :
            Mathf.clamp(
                b.block.delegee.revertedPolEffc ?
                    (b.delegee.polExcess / b.delegee.blk$polTol) :
                    (1.0 - b.delegee.polExcess / b.delegee.blk$polTol)
            );
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * @class INTF_BLK_pollutionHandler
         */
        new CLS_interface("INTF_BLK_pollutionHandler", {


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: If true, this block requires pollution to reach 100% efficiency. But why?
                     * @memberof INTF_BLK_pollutionHandler
                     * @instance
                     * @type {boolean}
                     */
                    revertedPolEffc: false,


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`: Pollution tolerance. If {@link INTF_BLK_pollutionHandler#revertedPolEffc} is true, this is pollution points required for 100% efficiency.
                     * @memberof INTF_BLK_pollutionHandler
                     * @instance
                     * @type {number}
                     */
                    polTol: -1.0,


                };
            },


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


        }),


        /**
         * @class INTF_B_pollutionHandler
         */
        new CLS_interface("INTF_B_pollutionHandler", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`: Efficiency related to pollution.
                     * @memberof INTF_B_pollutionHandler
                     * @instance
                     * @type {number}
                     */
                    polEffc: 1.0,
                    /**
                     * `INTERNAL`: Pollution points above tolerance.
                     * @memberof INTF_B_pollutionHandler
                     * @instance
                     * @type {number}
                     */
                    polExcess: 0.0,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_pollutionHandler
                     * @instance
                     * @type {number|TmpStateTag}
                     */
                    blk$polTol: TmpStateTag.needReplace,


                };
            },


            updateTile: function() {
                comp_updateTile(this);
            },


            updateEfficiencyMultiplier: function() {
                comp_updateEfficiencyMultiplier(this);
            },


            ex_postUpdateEfficiencyMultiplier: function() {
                comp_ex_postUpdateEfficiencyMultiplier(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Calculates efficiency related to pollution.
             * @memberof INTF_B_pollutionHandler
             * @instance
             * @func
             * @return {number}
             */
            ex_calcPolEffc: function() {
                return comp_ex_calcPolEffc(this);
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
