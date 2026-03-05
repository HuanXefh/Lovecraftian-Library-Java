/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods for building, unit and bullet entities.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- generic ----------> */


  /**
   * Gets size of some entity or its type (in block units).
   * @param {any} e
   * @return {number}
   */
  const _size = function(e) {
    return LCGeneralizer.getSize(e);
  };
  exports._size = _size;


  /**
   * Gets hit size of some entity or its type.
   * @param {any} e
   * @return {number}
   */
  const _hitSize = function(e) {
    return LCGeneralizer.getHitSize(e);
  };
  exports._hitSize = _hitSize;


  /**
   * Gets clip size of some entity or its type.
   * @param {any} e
   * @return {number}
   */
  const _clipSize = function(e) {
    return LCGeneralizer.getClipSize(e);
  };
  exports._clipSize = _clipSize;


  /**
   * Gets health fraction of some entity.
   * @param {any} e
   * @return {number}
   */
  const _healthFrac = function(e) {
    return LCGeneralizer.getHealthFrac(e);
  };
  exports._healthFrac = _healthFrac;


  /**
   * Gets armor of some entity.
   * @param {any} e
   * @return {number}
   */
  const _armor = function(e) {
    return LCGeneralizer.getArmor(e);
  };
  exports._armor = _armor;


  /**
   * Gets reload fraction of some entity.
   * @param {any} e
   * @param {Array<number>|unset} [mtIds]
   * @return {number}
   */
  const _reloadFrac = function(e, mtIds) {
    if(e == null) return 0.0;

    let reload = 0.0, maxReload = 0.0;
    if(e instanceof Building) {
      if(e.ex_getReloadFrac != null) return e.ex_getReloadFrac();
      if(e.reloadCounter != null) reload = e.reloadCounter;
      if(e.block.reload != null) maxReload = e.block.reload;

      if(DB_block.db["class"]["group"]["reload"]["frac"].hasIns(e.block)) return reload;
      if(DB_block.db["class"]["group"]["reload"]["revFrac"].hasIns(e.block)) return 1.0 - reload;
      let frac = maxReload < 0.0001 ? 1.0 : Mathf.clamp(reload / maxReload);
      if(DB_block.db["class"]["group"]["reload"]["rev"].hasIns(e.block)) return 1.0 - frac;

      return frac;
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
    } else return 0.0;
  };
  exports._reloadFrac = _reloadFrac;


  /**
   * Gets payload fraction of some unit.
   * @param {Unit} unit
   * @param {boolean|unset} [nearCap]
   * @return {number}
   */
  const _payFrac = function(unit, nearCap) {
    return Mathf.clamp(tryFun(unit.payloadUsed, unit, 0.0) / Math.max(unit.type.payloadCapacity, 1.0), 0.0, nearCap ? 0.999 : 1.0);
  };
  exports._payFrac = _payFrac;


  /**
   * Gets damage that should be dealt to some entity, before it takes.
   * @param {Building|Unit} e - The one that deals damage.
   * @param {Building|Unit} e_t - The one that receives damage.
   * @param {number} dmg
   * @param {number|unset} [bDmgMtp]
   * @return {number}
   */
  const _dmgDeal = function(e, e_t, dmg, bDmgMtp) {
    return dmg * tryProp(e.damageMultiplier, e) * (e_t instanceof Building ? tryVal(bDmgMtp, 1.0) : 1.0);
  };
  exports._dmgDeal = _dmgDeal;


  /**
   * Gets damage that some entity should actually take.
   * @param {Building|Unit} e
   * @param {number} dmg
   * @param {number|unset} [armorMtp]
   * @return {number}
   */
  const _dmgTake = function(e, dmg, armorMtp) {
    return Damage.applyArmor(dmg, _armor(e) * tryVal(armorMtp, 1.0));
  };
  exports._dmgTake = _dmgTake;


  /* <---------- building ----------> */


  /**
   * Gets amount of some block built for a team.
   * @param {Block} blk
   * @param {Team} team
   * @return {number}
   */
  const _bCount = function(blk, team) {
    return team.data().buildingTypes.get(blk, ARC_AIR.seq).size;
  };
  exports._bCount = _bCount;


  /**
   * Iterates through buildings of the same type in a team.
   * @param {Block} blk
   * @param {Team} team
   * @param {function(Building): void} scr
   * @return {void}
   */
  const _it_someBlk = function(blk, team, scr) {
    team.data().buildingTypes.get(blk, ARC_AIR.seq).each(scr);
  };
  exports._it_someBlk = _it_someBlk;


  /**
   * Gets warmup of some building.
   * @param {Building} b
   * @return {number}
   */
  const _warmup = function(b) {
    return tryFun(b.ex_getWarmupFrac, b, Mathf.maxZero(tryProp(b.warmup, b)));
  };
  exports._warmup = _warmup;


  /**
   * Gets warmup fraction of some building.
   * @param {Building} b
   * @param {boolean|unset} [nearCap]
   * @return {number}
   */
  const _warmupFrac = function(b, nearCap) {
    return Math.min(
      tryVal(b.block.linearWarmup, false) ? _warmup(b) : Interp.pow3In.apply(_warmup(b)),
      nearCap ? 0.999 : 1.0,
    );
  };
  exports._warmupFrac = _warmupFrac;


  /**
   * Gets total progress of some building.
   * @param {Building} b
   * @return {number}
   */
  const _tProg = function(b) {
    return tryFun(b.ex_getTProg, b, tryProp(b.totalProgress, b));
  };
  exports._tProg = _tProg;


  /**
   * Gets shield amount of some building.
   * @param {Building} b
   * @param {boolean|unset} [isSelfShield]
   * @return {number}
   */
  const _bShield = function(b, isSelfShield) {
    if(b.power != null && b.power.status < 0.0001) return 0.0;

    return readClassFunMap(DB_block.db["class"]["map"]["shield"], b.block, Function.airZero)(b, isSelfShield);
  };
  exports._bShield = _bShield;


  /**
   * Gets running speed of some building.
   * @param {Building} b
   * @return {number}
   */
  const _bSpd = function(b) {
    return b.efficiency * tryProp(b.timeScale, b);
  };
  exports._bSpd = _bSpd;


  /* <---------- unit ----------> */


  /**
   * Gets amount of some unit in a team.
   * @param {UnitType} utp
   * @param {Team} team
   * @return {number}
   */
  const _unitCount = function(utp, team) {
    return tryVal(team.data().unitsByType[utp.id], Array.air).length;
  };
  exports._unitCount = _unitCount;


  /**
   * Iterates through units of the same type in a team.
   * @param {UnitType} utp
   * @param {Team} team
   * @param {function(Unit): void} scr
   * @return {void}
   */
  const _it_someUtp = function(utp, team, scr) {
    tryVal(team.data().unitsByType[utp.id], Array.air).forEachFast(scr);
  };
  exports._it_someUtp = _it_someUtp;


  /**
   * Gets flash fraction of some unit.
   * @param {Unit} unit
   * @return {number}
   */
  const _flashFrac = function(unit) {
    return Mathf.clamp(unit.hitTime);
  };
  exports._flashFrac = _flashFrac;


  /**
   * Gets elevation of some unit.
   * @param {Unit} unit
   * @return {number}
   */
  const _elev = function(unit) {
    return Mathf.clamp(unit.elevation, unit.type.shadowElevation, 1.0) * unit.type.shadowElevationScl * (1.0 - unit.drownTime);
  };
  exports._elev = _elev;


  /**
   * Gets layer of some unit.
   * @param {Unit} unit
   * @return {number}
   */
  const _lay = function(unit) {
    return unit.elevation > 0.5 || (unit.type.flying && unit.dead) ?
      unit.type.flyingLayer :
      unit.type.groundLayer + Mathf.clamp(unit.hitSize / 4000.0, 0.0, 0.01);
  };
  exports._lay = _lay;


  /**
   * Gets reload multiplier of some unit.
   * @param {Unit} unit
   * @param {boolean} isClamped
   * @return {number}
   */
  const _reloadMtp = function(unit, isClamped) {
    let mtp = unit.reloadMultiplier * (unit.disarmed ? 0.0 : 1.0);
    return !isClamped ? mtp : Mathf.clamp(mtp);
  };
  exports._reloadMtp = _reloadMtp;


  /**
   * Gets controller of some unit.
   * @param {Unit} unit
   * @return {AIController|null}
   */
  const _ctrl = function(unit) {
    return unit.isPlayer() ? null : tryProp(unit.controller, unit);
  };
  exports._ctrl = _ctrl;


  /**
   * Gets stack status that should be shown for some unit.
   * @param {Unit} unit
   * @return {StatusEffect|null}
   */
  const _stackStaFirst = function(unit) {
    let i = 0, iCap = VARGEN.stackStas.iCap();
    while(i < iCap) {
      if(unit.hasEffect(VARGEN.stackStas[i])) return VARGEN.stackStas[i];
      i++;
    };

    return null;
  };
  exports._stackStaFirst = _stackStaFirst;


  /* <---------- bullet ----------> */


  /**
   * Gets bullet damage for damage display.
   * @param {Bullet} bul
   * @param {Building|Unit} e - The entity to hit.
   * @return {number}
   */
  const _bulDmg = function(bul, e) {
    let
      dmg = bul.damage,
      sDmg = bul.type.splashDamage,
      sDmgRad = bul.type.splashDamageRadius,
      dmg_fi = 0.0,
      dst = Mathf.dst(bul.x, bul.y, e.x, e.y),
      isRemote = DB_unit.db["class"]["btp"]["remote"].hasIns(bul.type),
      isRemoteCur = (dst > (bul.hitSize + _hitSize(e)) * 0.7499);
    if(e instanceof Unit && tryJsProp(bul.type, "typeMtpArr") != null) {
      dmg *= FRAG_attack._dmgMtp_typeMtpArr(e, bul.type.delegee.typeMtpArr);
    };
    let
      mtp = e instanceof Unit ?
        (1.0 / e.healthMultiplier * (e.shield > dmg ? 1.0 : bul.type.shieldDamageMultiplier)) :
        (bul.type.buildingDamageMultiplier * (_bShield(e, true) > dmg ? 1.0 : bul.type.shieldDamageMultiplier)),
      armor = _armor(e);

    if(bul.type.pierceArmor) {
      dmg_fi += (!isRemote && isRemoteCur) ? 0.0 : dmg;
    } else {
      dmg_fi += (!isRemote && isRemoteCur) ? 0.0 : Damage.applyArmor(dmg, armor);
    };
    if(sDmgRad > 0.0) dmg_fi += sDmg * (1.0 - Mathf.clamp(dst / sDmgRad));

    return dmg_fi * mtp;
  };
  exports._bulDmg = _bulDmg;


  /* <---------- wave ----------> */


  /**
   * Gets a 4-array of wave information.
   * @param {number|unset} [countWave]
   * @return {Array} <ROW>: utp, amtUnit, shield, sta.
   */
  const _waveArr = function(countWave) {
    if(countWave == null) countWave = Vars.state.wave;

    const arr = [];
    Vars.state.rules.spawns.each(spawnGrp => spawnGrp.team == null || spawnGrp.team === Vars.state.rules.waveTeam, spawnGrp => {
      let amt = spawnGrp.getSpawned(countWave);
      if(amt > 0) arr.push(spawnGrp.type, amt, spawnGrp.getShield(countWave), spawnGrp.effect);
    });

    return arr;
  };
  exports._waveArr = _waveArr;
