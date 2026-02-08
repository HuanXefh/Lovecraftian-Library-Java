/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods related to units.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const TRIGGER = require("lovec/glb/BOX_trigger");
  const EFF = require("lovec/glb/GLB_eff");
  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_flow = require("lovec/mdl/MDL_flow");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- base ----------> */


  const STA_DUR = VAR.time_unitStaDef;


  /* <---------- component (unit type) ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Makes a unit gain status effects based on current health.
   * Called only for Lovec units for obvious reason.
   * ---------------------------------------- */
  const comp_update_damaged = function(utp, unit) {
    if(!TIMER.unit || !Mathf.chance(VAR.p_unitUpdateP)) return;

    let healthFrac = Mathf.clamp(unit.health / unit.maxHealth);

    if(MDL_cond._isNonRobot(utp)) {
      let sta1 = Vars.content.statusEffect("loveclab-sta-slightly-injured");
      let sta2 = Vars.content.statusEffect("loveclab-sta-injured");
      let sta3 = Vars.content.statusEffect("loveclab-sta-heavily-injured");

      if(healthFrac < 0.25) {unit.apply(sta3, STA_DUR); unit.unapply(sta1); unit.unapply(sta2)}
      else if(healthFrac < 0.5) {unit.apply(sta2, STA_DUR); unit.unapply(sta1); unit.unapply(sta3)}
      else if(healthFrac < 0.75) {unit.apply(sta1, STA_DUR); unit.unapply(sta2); unit.unapply(sta3)}
      else {unit.unapply(sta1); unit.unapply(sta2); unit.unapply(sta3)};
    } else {
      let sta1 = Vars.content.statusEffect("loveclab-sta-damaged");
      let sta2 = Vars.content.statusEffect("loveclab-sta-severely-damaged");

      if(healthFrac < 0.25) {unit.apply(sta2, STA_DUR); unit.unapply(sta1)}
      else if(healthFrac < 0.5) {unit.apply(sta1, STA_DUR); unit.unapply(sta2)}
      else {unit.unapply(sta1); unit.unapply(sta2)};
    };
  };
  exports.comp_update_damaged = comp_update_damaged;


  /* ----------------------------------------
   * NOTE:
   *
   * Generic update that handles surroundings of a unit.
   * Called for every unit.
   * ---------------------------------------- */
  const comp_update_surrounding = function thisFun(utp, unit) {
    if(!TIMER.unit || !Mathf.chance(VAR.p_unitUpdateP)) return;

    let t = unit.tileOn();
    if(t == null) return;
    let ts = MDL_pos._tsDstManh(t, VAR.r_unitSurRange, thisFun.tmpTs);

    // Floor
    if(MDL_cond._isOnFloor(unit)) {

    };

    // Range
    let dst, oblk, ob;
    ts.forEachFast(ot => {
      // Param
      dst = Mathf.dst(ot.worldx(), ot.worldy(), unit.x, unit.y);
      oblk = ot.block();
      ob = ot.build;

      // Tree
      if(
        ob == null && oblk !== Blocks.air
          && MDL_cond._isCoverable(unit, true) && MDL_cond._isTreeBlock(oblk)
          && oblk.delegee.hidable
          && dst < oblk.region.width * VAR.rad_treeScl
      ) {
        if(VARGEN.staHiddenWell != null && !unit.hasEffect(VARGEN.staHiddenWell)) TRIGGER.treeHide.fire(unit);
        unit.apply(VARGEN.staHiddenWell, STA_DUR);
      };
    });
  }
  .setProp({
    tmpTs: [],
  });
  exports.comp_update_surrounding = comp_update_surrounding;


  /* ----------------------------------------
   * NOTE:
   *
   * Handles heat damage, called for every unit.
   * ---------------------------------------- */
  const comp_update_heat = function(utp, unit) {
    if(!TIMER.unit || !Mathf.chance(VAR.p_unitUpdateP * 0.3)) return;
    if(!MDL_cond._isHeatDamageable(unit)) return;

    let rHeat = MDL_flow._rHeat(unit.tileOn());
    let rHeatRes = MDL_flow._rHeatRes(utp);
    let dmg = Mathf.maxZero(rHeat - rHeatRes) * 0.65;
    if(dmg < 0.0001) return;
    let dmg_fi = Math.min(dmg, VAR.dmg_heatMaxDmg);
    let staStackAmt = Math.round((dmg - dmg_fi) / VAR.dmg_overheatedConversionDmg);

    FRAG_attack.damage(unit, dmg_fi, 0.0, "heat");
    let i = 0;
    while(i < staStackAmt) {
      unit.apply(Vars.content.statusEffect("loveclab-sta0bur-overheated"));
      i++;
    };
    if(Mathf.chance(0.5)) EFF.heatSmog.at(unit);
  };
  exports.comp_update_heat = comp_update_heat;
