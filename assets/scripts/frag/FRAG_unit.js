/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods related to units.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  const STA_DUR = VAR.time_unitStaDef;


  /**
   * Whether `e` is `caller` of part of it.
   * Use to avoid damage to the caller itself on some occasions like impact wave.
   * @param {Building|Unit|Bullet} e
   * @param {Building|Unit|Bullet|unset} [caller]
   */
  const checkCaller = function(e, caller) {
    if(caller == null) return false;
    if(e === caller) return true;

    if(e instanceof Bullet) {
      // Do nothing
    } else if(e instanceof Building) {
      if(MOD_multiBlockLib.ENABLED) {
        if(e.block instanceof MOD_multiBlockLib.CLASSES.PlaceholderBlock && e.linkBuild === caller) return true;
        if(e.block instanceof MOD_multiBlockLib.CLASSES.LinkBlock && e.linkBuild === caller) return true;
      };
    } else if(e instanceof Unit) {
      if(e instanceof Segmentc && e.headSegment === caller) return true;
    };

    return false;
  };
  exports.checkCaller = checkCaller;


  /* <---------- component (unit type) ----------> */


  /**
   * Makes a unit gain status effects based on current health.
   * Called only by Lovec units for obvious reason.
   * @param {UnitType} utp
   * @param {Unit} unit
   * @return {void}
   */
  const comp_update_damaged = function(utp, unit) {
    if(!TIMER.unit || !Mathf.chance(VAR.p_unitUpdateP)) return;

    let healthFrac = Mathf.clamp(unit.health / unit.maxHealth);

    if(MDL_cond._isNonRobot(utp)) {
      if(healthFrac < 0.25) {
        unit.apply(VARGEN.staHeavilyInjured, STA_DUR);
        unit.unapply(VARGEN.staSlightlyInjured);
        unit.unapply(VARGEN.staInjured);
      } else if(healthFrac < 0.5) {
        unit.apply(VARGEN.staInjured, STA_DUR);
        unit.unapply(VARGEN.staSlightlyInjured);
        unit.unapply(VARGEN.staHeavilyInjured);
      } else if(healthFrac < 0.75) {
        unit.apply(VARGEN.staSlightlyInjured, STA_DUR);
        unit.unapply(VARGEN.staInjured);
        unit.unapply(VARGEN.staHeavilyInjured);
      } else {
        unit.unapply(sta1);
        unit.unapply(sta2);
        unit.unapply(sta3);
      };
    } else {
      if(healthFrac < 0.25) {
        unit.apply(VARGEN.staSeverelyDamaged, STA_DUR);
        unit.unapply(VARGEN.staDamaged)
      } else if(healthFrac < 0.5) {
        unit.apply(VARGEN.staDamaged, STA_DUR);
        unit.unapply(VARGEN.staSeverelyDamaged)
      } else {
        unit.unapply(VARGEN.staDamaged);
        unit.unapply(VARGEN.staSeverelyDamaged)
      };
    };
  };
  exports.comp_update_damaged = comp_update_damaged;


  /**
   * Generic update that handles surroundings of a unit.
   * Called for every unit.
   * @param {UnitType} utp
   * @param {Unit} unit
   * @return {void}
   */
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
        ob == null && oblk !== Blocks.air && MDL_cond._isCoverable(unit, true)
          && (
            MDL_cond._isTreeBlock(oblk) ?
              oblk.delegee.hidable && dst < oblk.region.width * VAR.rad_treeScl :
              MDL_cond._isTallGrassBlock(oblk) ?
                oblk.delegee.hidable && dst < oblk.size * Vars.tilesize * VAR.rad_tallGrassScl :
                false
          )
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


  /**
   * Handles heat damage, called for every unit.
   * @param {UnitType} utp
   * @param {Unit} unit
   * @return {void}
   */
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
      unit.apply(VARGEN.staOverheated);
      i++;
    };
    if(Mathf.chance(0.5)) EFF.heatSmog.at(unit);
  };
  exports.comp_update_heat = comp_update_heat;
