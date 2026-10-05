/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_durabilityBlock>} INTFBLKDurabilityBlock
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_durabilityBlock>} INTFBDurabilityBlock
     * @prop {INTFBLKDurabilityBlock} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKDurabilityBlock} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.self.ex_addLogicF(LogicProp.ammo, b => b.delegee.durabFrac * blk.delegee.durabCap / 60.0);
        blk.self.ex_addLogicF(LogicProp.ammoCapacity, b => blk.delegee.durabCap / 60.0 * (blk.delegee.durabRegenFracMin + blk.delegee.durabRegenFracMax) * 0.5);
    };


    /**
     * @private
     * @param {INTFBLKDurabilityBlock} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        if(isFinite(blk.delegee.durabCap) && blk.delegee.durabCap > 0.0) {
            stats.add(fetchStat("lovec", "blk0fac-durabtime"), (blk.delegee.durabCap / 3600.0 * (blk.delegee.durabRegenFracMin + blk.delegee.durabRegenFracMax) * 0.5).roundFixed(2), StatUnit.minutes);
        };
    };


    /**
     * @private
     * @param {INTFBLKDurabilityBlock} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        if(!isFinite(blk.delegee.durabCap)) return;
        blk.addBar("lovec-durability", b => new Bar(
            prov(() => Core.bundle.format("bar.lovec-bar-durability-amt", b.delegee.durabFrac.perc(0))),
            prov(() => Pal.sap),
            () => Mathf.clamp(b.delegee.durabFrac),
        ));
    };


    /**
     * @private
     * @param {INTFBDurabilityBlock} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(!isFinite(b.block.delegee.durabCap)) return;

        if(b.delegee.durabMode === "dec") {
            b.delegee.durabFrac -= 1.0 / b.block.delegee.durabCap * b.edelta();
            // Enter increase mode (need repairing) when run out of durability
            if(b.delegee.durabFrac < 0.0) {
                b.delegee.durabFrac = 0.0;
                b.delegee.durabMode = "inc";
                FRAG_attack.damage(b, Math.min(b.maxHealth * b.block.delegee.durabDmgFrac, !b.block.delegee.noDurabDmgKill ? Infinity : b.health - 1.0), 0.0);
            };
        } else {
            // Exit increase mode when fully repaired
            if(b.health / b.maxHealth > 0.9999) {
                b.delegee.durabFrac = Mathf.lerp(b.block.delegee.durabRegenFracMin, b.block.delegee.durabRegenFracMax, Math.random());
                b.delegee.durabMode = "dec";
            };
        };
    };


    /**
     * @private
     * @param {INTFBDurabilityBlock} b
     * @return {void}
     */
    function comp_updateEfficiencyMultiplier(b) {
        if(b.delegee.durabMode !== "dec") {
            b.efficiency *= 0.0;
        };
    };


    /**
     * @private
     * @param {INTFBDurabilityBlock} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        if(b.delegee.durabMode !== "dec") {
            LCDrawf.textSelect(b, MDL_bundle.getInfo("lovec", "text-require-repair"), false, b.block.delegee.durabTextOffTy);
        };
    };


    /**
     * @private
     * @param {INTFBDurabilityBlock} b
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
       * This block will gain damage and halt if run out of durability.
       * Durability will be restored when fully repaired.
       * @class INTF_BLK_durabilityBlock
       */
      new CLS_interface("INTF_BLK_durabilityBlock", {


          __paramObjM__: function() {
              return {


                  /**
                   * `PARAM`: Default maximum durability in frames. If infinity, durability mechanics is disabled.
                   * @memberof INTF_BLK_durabilityBlock
                   * @instance
                   * @type {number}
                   */
                  durabCap: Infinity,
                  /**
                   * `PARAM`: Multiplier on durability decrease rate.
                   * @memberof INTF_BLK_durabilityBlock
                   * @instance
                   * @type {number}
                   */
                  durabDecMtp: 1.0,
                  /**
                   * `PARAM`: Damage dealt as fraction of maximum health when run out of durability.
                   * @memberof INTF_BLK_durabilityBlock
                   * @instance
                   * @type {number}
                   */
                  durabDmgFrac: 0.75,
                  /**
                   * `PARAM`: If true, damage dealt by durability outage won't kill the building.
                   * @memberof INTF_BLK_durabilityBlock
                   * @instance
                   * @type {boolean}
                   */
                  noDurabDmgKill: true,
                  /**
                   * `PARAM`: Minimum fraction of durability cap restored upon being repaired.
                   * @memberof INTF_BLK_durabilityBlock
                   * @instance
                   * @type {number}
                   */
                  durabRegenFracMin: 0.5,
                  /**
                   * `PARAM`: Maximum fraction of durability cap restored upon being repaired.
                   * @memberof INTF_BLK_durabilityBlock
                   * @instance
                   * @type {number}
                   */
                  durabRegenFracMax: 1.0,
                  /**
                   * `PARAM`: Integer offset of the need-repairing text in `b.drawSelect`.
                   * @memberof INTF_BLK_durabilityBlock
                   * @instance
                   * @number {number}
                   */
                  durabTextOffTy: 0,


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
         * @class INTF_B_durabilityBlock
         */
        new CLS_interface("INTF_B_durabilityBlock", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`: Current durability as fraction.
                     * @memberof INTF_B_durabilityBlock
                     * @instance
                     * @type {number}
                     */
                    durabFrac: 1.0,
                    /**
                     * `INTERNAL`: Current durability mode. "dec" for normal, "inc" for needing repair.
                     * @memberof INTF_B_durabilityBlock
                     * @instance
                     * @type {string}
                     */
                    durabMode: "dec",
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_durabilityBlock
                     * @instance
                     * @type {number|TmpStateTag}
                     */
                    blk$durabDecMtp: TmpStateTag.needReplace,


                };
            },


            updateTile: function() {
                comp_updateTile(this);
            },


            updateEfficiencyMultiplier: function() {
                comp_updateEfficiencyMultiplier(this);
            },


            drawSelect: function() {
                comp_drawSelect(this);
            },


            /**
             * @memberof INTF_B_durabilityBlock
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


            /**
             * @memberof INTF_B_durabilityBlock
             * @instance
             * @funcs
             * @param {Writes|Reads} wr0rd
             * @return {void}
             */
            ex_processData: function(wr0rd) {
                processData(
                    wr0rd,
                    wr => {
                        wr.f(this.delegee.durabFrac);
                        wr.str(this.delegee.durabMode);
                    },
                    rd => {
                        if(this.delegee.LCRevi === 5 && this.block.ex_isSubInsOf("BLK_baseMiner")) return;
                        this.delegee.durabFrac = rd.f();
                        this.delegee.durabMode = rd.str();
                    },
                );
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


        }),


    ];
