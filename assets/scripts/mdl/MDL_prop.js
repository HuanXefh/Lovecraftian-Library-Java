/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods to calculate some entity properties.
   * Most basic ones are defined in {@link LCProp}.
   * @module lovec/mdl/MDL_prop
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ base ------------------------------ */


  /**
   * Gets reload fraction of some entity.
   * @param {any} e
   * @param {Array<number>|unset} [mtIds]
   * @return {number}
   */
  const getReloadFrac = function(e, mtIds) {
    let
      reload = 0.0,
      maxReload = 0.0;

    if(e instanceof Building) {
      if(e.ex_getReloadFrac != null) return e.ex_getReloadFrac();
      if(e.reloadCounter != null) reload = e.reloadCounter;
      if(e.block.reload != null) maxReload = e.block.reload;

      if(DB_block.db["class"]["group"]["reload"]["frac"].hasIns(e.block)) return reload;
      if(DB_block.db["class"]["group"]["reload"]["revFrac"].hasIns(e.block)) return 1.0 - reload;

      let frac = maxReload < 0.0001 ? 1.0 : Mathf.clamp(reload / maxReload);
      return !DB_block.db["class"]["group"]["reload"]["rev"].hasIns(e.block) ?
        frac :
        (1.0 - frac);
    } else if(e instanceof Unit) {
      if(mtIds == null) return 0.0;

      let mt, isAltWp = false;
      mtIds.forEachFast(id => {
        mt = e.mounts[id];
        if(mt == null) return;
        reload += mt.reload;
        maxReload += mt.weapon.reload;
        if(mt.weapon.flipSprite) isAltWp = true;
      });

      return maxReload < 0.0001 ?
        1.0 :
        Mathf.clamp(
          isAltWp ?
            1.0 - (reload / maxReload / 0.666667 - 0.5) :
            1.0 - reload / maxReload
        );
    };

    return 0.0;
  };
  exports.getReloadFrac = getReloadFrac;


  /**
   * Gets damage that should be dealt to some entity, before it takes.
   * @param {Building|Unit} e - Entity that deals damage.
   * @param {Building|Unit} e_t - Entity that receives damage.
   * @param {number} dmg
   * @param {number|unset} [bDmgMtp]
   * @return {number}
   */
  const getDmgDeal = function(e, e_t, dmg, bDmgMtp) {
    return dmg
      * tryProp(e.damageMultiplier, e)
      * (e instanceof Building ? Vars.state.rules.blockDamage(e.team) : Vars.state.rules.unitDamage(e.team))
      * (e_t instanceof Building ? tryVal(bDmgMtp, 1.0) : 1.0);
  };
  exports.getDmgDeal = getDmgDeal;


  /**
   * Gets damage that some entity should actually take.
   * <br> Somewhat inaccurate, I don't know why actual damage is random with even same multipliers.
   * @param {Building|Unit} e
   * @param {number} dmg
   * @param {number|unset} [armorMtp]
   * @param {boolean|unset} [useHealthMtp]
   * @return {number}
   */
  const getDmgTake = function(e, dmg, armorMtp, useHealthMtp) {
    return Damage.applyArmor(dmg, LCProp.getArmor(e) * tryVal(armorMtp, 1.0) / (
      !useHealthMtp ?
        1.0 :
        (
          e instanceof Building ?
            Vars.state.rules.blockHealth(e.team) :
            (Vars.state.rules.unitHealth(e.team) * e.healthMultiplier)
        )
    ))
  };
  exports.getDmgTake = getDmgTake;


  /* <------------------------------ building ------------------------------ */


  /**
   * Gets warmup of some building.
   * @param {Building} b
   * @return {number}
   */
  const getWarmup = function(b) {
    return tryFun(b.ex_getWarmupFrac, b, Mathf.maxZero(tryProp(b.warmup, b)));
  };
  exports.getWarmup = getWarmup;


  /**
   * Gets warmup fraction of some building.
   * @param {Building} b
   * @param {boolean|unset} [nearCap]
   * @return {number}
   */
  const getWarmupFrac = function(b, nearCap) {
    return Math.min(
      tryVal(b.block.linearWarmup, false) ? getWarmup(b) : Interp.pow3In.apply(getWarmup(b)),
      nearCap ? 0.999 : 1.0,
    );
  };
  exports.getWarmupFrac = getWarmupFrac;


  /**
   * Gets total progress of some building.
   * @param {Building} b
   * @return {number}
   */
  const getTotalProg = function(b) {
    return tryFun(b.ex_getTotalProg, b, tryProp(b.totalProgress, b));
  };
  exports.getTotalProg = getTotalProg;


  /**
   * Gets shield amount of some building.
   * @param {Building} b
   * @param {boolean|unset} [isSelfShield]
   * @return {number}
   */
  const getBuildShield = function(b, isSelfShield) {
    if(b.power != null && b.power.status < 0.0001) return 0.0;

    return readClassFunMap(DB_block.db["class"]["map"]["shield"], b.block, Function.airZero)(b, isSelfShield);
  };
  exports.getBuildShield = getBuildShield;


  /**
   * Gets running speed of some building.
   * @param {Building} b
   * @return {number}
   */
  const getBuildSpd = function(b) {
    return b.efficiency * tryProp(b.timeScale, b);
  };
  exports.getBuildSpd = getBuildSpd;


  /* <------------------------------ unit ------------------------------ */


  /**
   * Gets all stackable status effects on a unit.
   * @param {Array|unset} contArr
   * @param {Unit} unit
   * @return {Array<StatusEffect>}
   */
  const getStackStas = function(contArr, unit) {
    let arr = contArr != null ? contArr.clear() : [];

    let i = 0, iCap = VARGEN.stackStas.iCap();
    while(i < iCap) {
      if(unit.hasEffect(VARGEN.stackStas[i])) arr.push(VARGEN.stackStas[i]);
      i++;
    };

    return arr;
  };
  exports.getStackStas = getStackStas;


  /* <------------------------------ bullet ------------------------------ */


  /**
   * Calculates bullet damage for damage display.
   * @param {Bullet} bul
   * @param {Building|Unit} e - The entity to hit.
   * @return {number}
   */
  const calcBulDmg = function(bul, e) {
    let
      dmg = bul.damage,
      sDmg = bul.type.splashDamage,
      sDmgRad = bul.type.splashDamageRadius,
      dmg_fi = 0.0,
      dst = Mathf.dst(bul.x, bul.y, e.x, e.y),
      isRemote = DB_unit.db["class"]["btp"]["remote"].hasIns(bul.type),
      isRemoteCur = (dst > (bul.hitSize + LCProp.getHitSize(e)) * 0.7499);
    if(e instanceof Unit && tryJsProp(bul.type, "typeMtpArr") != null) {
      dmg *= FRAG_attack.getDmgMtpByTypeMtpArr(e, bul.type.delegee.typeMtpArr);
    };
    let
      mtp = e instanceof Unit ?
        (1.0 / e.healthMultiplier * (e.shield > dmg ? 1.0 : bul.type.shieldDamageMultiplier)) :
        (bul.type.buildingDamageMultiplier * (getBuildShield(e, true) > dmg ? 1.0 : bul.type.shieldDamageMultiplier)),
      armor = LCProp.getArmor(e);

    if(bul.type.pierceArmor) {
      dmg_fi += (!isRemote && isRemoteCur) ? 0.0 : dmg;
    } else {
      dmg_fi += (!isRemote && isRemoteCur) ? 0.0 : Damage.applyArmor(dmg, armor);
    };
    if(sDmgRad > 0.0) dmg_fi += sDmg * (1.0 - Mathf.clamp(dst / sDmgRad));

    return dmg_fi * mtp;
  };
  exports.calcBulDmg = calcBulDmg;


  /* <------------------------------ wave ------------------------------ */


  /**
   * Gets a 4-array of wave information.
   * @param {number|unset} [countWave]
   * @return {Array} `ROW`: utp, amtUnit, shield, sta.
   */
  const getWaveArr = function(countWave) {
    if(countWave == null) countWave = Vars.state.wave;

    let arr = [];
    Vars.state.rules.spawns.each(spawnGrp => spawnGrp.team == null || spawnGrp.team === Vars.state.rules.waveTeam, spawnGrp => {
      let amt = spawnGrp.getSpawned(countWave);
      if(amt > 0) arr.push(spawnGrp.type, amt, spawnGrp.getShield(countWave), spawnGrp.effect);
    });

    return arr;
  };
  exports.getWaveArr = getWaveArr;
