/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_terrainHandler>} INTFBLKTerrainHandler
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_terrainHandler>} INTFBTerrainHandler
     * @prop {INTFBLKTerrainHandler} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKTerrainHandler} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        if(blk.delegee.ters.length === 0) return;
        stats.add(
            blk.delegee.terMode === "enable" ? fetchStat("lovec", "blk-terreq") : fetchStat("lovec", "blk-terban"),
            MDL_text.getTagText(blk.delegee.ters.map(ter => MDL_terrain.getTerBundle(ter))).color(blk.delegee.terMode === "enable" ? Pal.heal : Pal.remove),
        );
    };


    /**
     * @private
     * @param {INTFBLKTerrainHandler} blk
     * @param {Tile} t
     * @param {Team} team
     * @param {number} rot
     * @return {boolean}
     */
    const comp_canPlaceOn = function thisFun(blk, t, team, rot) {
        if(t == null) return false;
        if(blk.delegee.ters.length === 0) return true;

        if(LCNativeArray.checkTupChange(thisFun.tmpTup, blk, t, team, rot)) {
            thisFun.tmpTer = MDL_terrain.getTer(t, blk.size, blk.self.ex_getTerrainCheckR());
            thisFun.tmpTerB = MDL_terrain.getTerBundle(thisFun.tmpTer);
        };

        let cond = true;
        if(blk.delegee.terMode === "enable") {
            if(thisFun.tmpTer == null || !blk.delegee.ters.includes(thisFun.tmpTer)) {
                LCDrawf.textPlace(blk, t.x, t.y, MDL_bundle.getInfo("lovec", "text-terrain-enabled") + " " + thisFun.tmpTerB, false, blk.delegee.terTextOffTy);
                cond = false;
            };
        } else {
            if(thisFun.tmpTer != null && blk.delegee.ters.includes(thisFun.tmpTer)) {
                LCDrawf.textPlace(blk, t.x, t.y, MDL_bundle.getInfo("lovec", "text-terrain-disabled") + " " + thisFun.tmpTerB, false, blk.delegee.terTextOffTy);
                cond = false;
            };
        };
        return cond;
    }
    .setProp({
        /**
         * @memberof comp_canPlaceOn
         * @type {[Block, Tile, Team, number]}
         */
        tmpTup: [],
        /**
         * @memberof comp_canPlaceOn
         * @type {String|null}
         */
        tmpTer: null,
        /**
         * @memberof comp_canPlaceOn
         * @type {string}
         */
        tmpTerB: "",
    });


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Handles methods that check terrain type for valid placement.
         * @class INTF_BLK_terrainHandler
         */
        new CLS_interface("INTF_BLK_terrainHandler", {


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: Terrain types involved.
                     * @memberof INTF_BLK_terrainHandler
                     * @instance
                     * @type {TDynamic<Array<string>>}
                     */
                    ters: tprov(() => []),
                    /**
                     * `PARAM`: "enable" for requirement, "disable" for restriction.
                     * @memberof INTF_BLK_terrainHandler
                     * @instance
                     * @type {string}
                     */
                    terMode: "enable",
                    /**
                     * `PARAM`: Integer offset of the terrain text in `blk.drawPlace`.
                     * @memberof INTF_BLK_terrainHandler
                     * @instance
                     * @type {number}
                     */
                    terTextOffTy: 0,


                };
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            canPlaceOn: function(t, team, rot) {
                return comp_canPlaceOn(this, t, team, rot);
            }
            .setProp({
                boolMode: "and",
            }),


            /**
             * Range used for terrain check.
             * Do not set this too large!
             * @memberof INTF_BLK_terrainHandler
             * @instance
             * @func
             * @return {number}
             */
            ex_getTerrainCheckR: function() {
                return 5;
            }
            .setProp({
                noSuper: true,
            }),


        }),


        /**
         * @class INTF_B_terrainHandler
         */
        new CLS_interface("INTF_B_terrainHandler", {}),


    ];
