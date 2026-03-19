/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.ex_addLogicGetter(LAccess.ammo, b => b.delegee.durabFrac * blk.durabCap / 60.0);
    blk.ex_addLogicGetter(LAccess.ammoCapacity, b => blk.durabCap / 60.0 * (blk.durabRegenFracMin + blk.durabRegenFracMax) * 0.5);
  };


  function comp_setStats(blk) {
    if(isFinite(blk.durabCap) && blk.durabCap > 0.0) {
      blk.stats.add(fetchStat("lovec", "blk0fac-durabtime"), (blk.durabCap / 3600.0 * (blk.durabRegenFracMin + blk.durabRegenFracMax) * 0.5).roundFixed(2), StatUnit.minutes);
    };
  };


  function comp_setBars(blk) {
    if(!isFinite(blk.durabCap)) return;
    
    blk.addBar("lovec-durability", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-durability-amt", b.delegee.durabFrac.perc(0))),
      prov(() => Pal.sap),
      () => Mathf.clamp(b.delegee.durabFrac),
    ));
  };


  function comp_created(b) {
    b.durabDecMtp = b.block.delegee.durabDecMtp;
  };


  function comp_updateTile(b) {
    if(!isFinite(b.block.delegee.durabCap)) return;

    if(b.durabMode === "dec") {
      b.durabFrac -= 1.0 / b.block.delegee.durabCap * b.edelta();
      // Enter increase mode (need repairing) when run out of durability
      if(b.durabFrac < 0.0) {
        b.durabFrac = 0.0;
        b.durabMode = "inc";
        FRAG_attack.damage(b, Math.min(b.maxHealth * b.block.delegee.durabDmgFrac, !b.block.delegee.noDurabDmgKill ? Infinity : b.health - 1.0), 0.0);
      };
    } else {
      // Exit increase mode when fully repaired
      if(b.health / b.maxHealth > 0.9999) {
        b.durabFrac = Mathf.lerp(b.block.delegee.durabRegenFracMin, b.block.delegee.durabRegenFracMax, Math.random());
        b.durabMode = "dec";
      };
    };
  };


  function comp_updateEfficiencyMultiplier(b) {
    if(b.durabMode !== "dec") b.efficiency *= 0.0;
  };


  function comp_drawSelect(b) {
    if(b.durabMode !== "dec") {
      MDL_draw._d_textSelect(b, MDL_bundle._info("lovec", "text-require-repair"), false, b.block.delegee.durabTextOffTy);
    };
  };


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
     * @class INTF_BLK_durabilityBlock
     */
    new CLS_interface("INTF_BLK_durabilityBlock", {


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: Default maximum durability in frames. If infinity, durability mechanics is disabled.
         * @memberof INTF_BLK_durabilityBlock
         * @instance
         */
        durabCap: Infinity,
        /**
         * <PARAM>: Multiplier on durability decrease rate.
         * @memberof INTF_BLK_durabilityBlock
         * @instance
         */
        durabDecMtp: 1.0,
        /**
         * <PARAM>: Damage dealt as fraction of maximum health when run out of durability.
         * @memberof INTF_BLK_durabilityBlock
         * @instance
         */
        durabDmgFrac: 0.75,
        /**
         * <PARAM>: If true, damage dealt by durability outage won't kill the building.
         * @memberof INTF_BLK_durabilityBlock
         * @instance
         */
        noDurabDmgKill: true,
        /**
         * <PARAM>: Minimum fraction of durability cap restored upon being repaired.
         * @memberof INTF_BLK_durabilityBlock
         * @instance
         */
        durabRegenFracMin: 0.5,
        /**
         * <PARAM>: Maximum fraction of durability cap restored upon being repaired.
         * @memberof INTF_BLK_durabilityBlock
         * @instance
         */
        durabRegenFracMax: 1.0,
        /**
         * <PARAM>: Integer offset of the need-repairing text in `b.drawSelect`.
         * @memberof INTF_BLK_durabilityBlock
         * @instance
         */
        durabTextOffTy: 0,


      }),


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


    }),


    /**
     * @class INTF_B_durabilityBlock
     */
    new CLS_interface("INTF_B_durabilityBlock", {


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_B_durabilityBlock
         * @instance
         */
        durabFrac: 1.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_durabilityBlock
         * @instance
         */
        durabMode: "dec",
        /**
         * <INTERNAL>
         * @memberof INTF_B_durabilityBlock
         * @instance
         */
        durabDecMtp: 1.0,


      }),


      created: function() {
        comp_created(this);
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
       * @param {Writes|Reads} wr0rd
       * @return {void}
       */
      ex_processData: function(wr0rd) {
        processData(
          wr0rd, this.LCRevi,
          (wr, revi) => {
            wr.f(this.durabFrac);
            wr.str(this.durabMode);
          },

          (rd, revi) => {
            if(revi === 5 && this.block.ex_isSubInsOf("BLK_baseMiner")) {
              return;
            };

            this.durabFrac = rd.f();
            this.durabMode = rd.str();
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


  ];
