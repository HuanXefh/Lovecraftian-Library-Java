/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * This block will gain damage if run out of durability.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_draw = require("lovec/mdl/MDL_draw");


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
    if(b.durabMode === "dec") {
      b.durabFrac -= (!isFinite(b.block.delegee.durabCap) || b.block.delegee.durabCap < 0.0001) ?
        0.0 :
        (1.0 / b.block.delegee.durabCap * b.edelta());
      // Enter increase mode (need repairing) when run out of durability
      if(b.durabFrac < 0.0) {
        b.durabFrac = 0.0;
        b.durabMode = "inc";
        FRAG_attack.damage(b, b.maxHealth * b.block.delegee.durabDmgFrac, 0.0);
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


    // Block
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        // @PARAM: The default maximum durability in frames.
        durabCap: Infinity,
        // @PARAM: Multiplier on durability decrease rate. Note that this is an internal property in {BLK_durabilityRecipeFactory}.
        durabDecMtp: 1.0,
        // @PARAM: Damage as fraction of maximum health, applied when run out of durability.
        durabDmgFrac: 0.75,
        // @PARAM: Minimum fraction of durability cap, that is regenerated upon being repaired.
        durabRegenFracMin: 0.5,
        // @PARAM: Maximum fraction of durability cap, that is regenerated upon being repaired.
        durabRegenFracMax: 1.0,
        // @PARAM: Integer offset of the need-repairing text in {b.drawSelect}.
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


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        durabFrac: 1.0,
        durabMode: "dec",
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


      ex_postUpdateEfficiencyMultiplier: function() {
        comp_ex_postUpdateEfficiencyMultiplier(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_processData: function(wr0rd, LCRevi) {
        processData(
          wr0rd, LCRevi,
          (wr, revi) => {
            wr.f(this.durabFrac);
            wr.str(this.durabMode);
          },

          (rd, revi) => {
            if(revi < 1) {
              rd.s();
            };

            this.durabFrac = rd.f();
            this.durabMode = rd.str();
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
