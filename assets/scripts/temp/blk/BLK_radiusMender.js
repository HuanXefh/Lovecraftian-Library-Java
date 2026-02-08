/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Vanilla mender, but heal numbers are shown.
   * Also capable of healing units.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseMender");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_text = require("lovec/mdl/MDL_text");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.healsBuilding = blk.bHealAmt > 0.0 || blk.bHealPerc > 0.0;
    blk.healsUnit = blk.unitHealAmt > 0.0 || blk.unitHealPerc > 0.0;
  };


  function comp_setStats(blk) {
    blk.stats.remove(Stat.repairTime);
    blk.stats.remove(Stat.range);

    if(blk.healsBuilding) blk.stats.add(fetchStat("lovec", "blk0misc-repairamt"), MDL_text._healText(
      blk.bHealAmt,
      blk.bHealPerc,
    ));
    if(blk.healsUnit) blk.stats.add(fetchStat("lovec", "blk0misc-unitrepairamt"), MDL_text._healText(
      blk.unitHealAmt,
      blk.unitHealPerc,
    ));
    blk.stats.add(fetchStat("lovec", "blk0misc-repairr"), blk.range / Vars.tilesize, StatUnit.blocks);
    blk.stats.add(fetchStat("lovec", "blk0misc-repairintv"), blk.reload / 60.0, StatUnit.seconds);
  };


  function comp_updateTile(b) {
    let cond = !b.checkSuppression();

    b.smoothEfficiency = Mathf.lerpDelta(b.smoothEfficiency, b.efficiency, 0.08);
    b.heat = Mathf.lerpDelta(b.heat, cond && b.efficiency > 0.0 ? 1.0 : 0.0, 0.08);
    b.charge += b.heat * b.delta();
    b.phaseHeat = Mathf.lerpDelta(b.phaseHeat, b.optionalEfficiency, 0.1);

    if(b.optionalEfficiency > 0.0 && b.timer.get(b.block.timerUse, b.block.useTime / b.timeScale) && cond) b.consume();

    if(b.charge > b.block.reload && cond) {
      b.charge = 0.0;
      let rad = b.block.range + b.phaseHeat * b.block.phaseRangeBoost;

      if(b.block.delegee.healsBuilding) {
        MDL_pos._it_bs(b.x, b.y, rad, b.team, ob => MDL_cond._canHeal(ob), ob => {
          FRAG_attack.heal(ob, (ob.maxHealth * b.block.delegee.bHealPerc + b.block.delegee.bHealAmt) * (1.0 + b.phaseHeat * b.block.phaseBoost) * b.efficiency, true);
        });
      };

      if(b.block.delegee.healsUnit) {
        MDL_pos._it_units(b.x, b.y, rad, b.team, ounit => MDL_cond._canHeal(ounit), ounit => {
          if(FRAG_attack.heal(ounit, (ounit.maxHealth * b.block.delegee.unitHealPerc + b.block.delegee.unitHealAmt) * (1.0 + b.phaseHeat * b.block.phaseBoost) * b.efficiency)) {
            MDL_effect.showBetween_line(b.x, b.y, null, ounit, Pal.heal);
          };
        });
      };
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(MendProjector)
    .setTags("blk-proj", "blk-mend")
    .setParam({
      // @PARAM: Heal amount for buildings.
      bHealAmt: 0.0,
      // @PARAM: Heal percentage for buildings.
      bHealPerc: 0.0,
      // @PARAM: Heal amount for units.
      unitHealAmt: 0.0,
      // @PARAM: Heal percentage for units.
      unitHealPerc: 0.0,

      healsBuilding: false,
      healsUnit: false,
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


    }),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(MendProjector.MendBuild)
    .setParam({})
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
