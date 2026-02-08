/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods for building, unit and bullet entities.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const DB_block = require("lovec/db/DB_block");
  const DB_unit = require("lovec/db/DB_unit");


  /* <---------- generic ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the size of some entity (or its type) in blocks.
   * ---------------------------------------- */
  const _size = newMultiFunction(
    [Building], b => b.hitSize() / Vars.tilesize,
    [Block], blk => blk.size,
    [Unit], unit => unit.hitSize / Vars.tilesize,
    [UnitType], utp => utp.hitSize / Vars.tilesize,
    [Bullet], bul => bul.hitSize / Vars.tilesize,
    [BulletType], btp => btp.hitSize / Vars.tilesize,
  );
  exports._size = _size;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the size of some entity (or its type) in world units.
   * ---------------------------------------- */
  const _hitSize = newMultiFunction(
    [Building], b => b.hitSize(),
    [Block], blk => blk.size * Vars.tilesize,
    [Unit], unit => unit.hitSize,
    [UnitType], utp => utp.hitSize,
    [Bullet], bul => bul.hitSize,
    [BulletType], btp => btp.hitSize,
  );
  exports._hitSize = _hitSize;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the clipping size of some entity (or its type).
   * ---------------------------------------- */
  const _clipSize = newMultiFunction(
    [Building], b => b.block.clipSize,
    [Block], blk => blk.clipSize,
    [Unit], unit => unit.clipSize(),
    [UnitType], utp => utp.clipSize,
    [Bullet], bul => bul.type.drawSize,
    [BulletType], btp => btp.drawSize,
  );
  exports._clipSize = _clipSize;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the health fraction of some entity.
   * ---------------------------------------- */
  const _healthFrac = newMultiFunction(
    [Healthc], e => e.healthf(),
    [Bullet], bul => bul.damage / bul.type.damage,
  );
  exports._healthFrac = _healthFrac;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the armor of some entity.
   * ---------------------------------------- */
  const _armor = newMultiFunction(
    [Building], b => b.block.armor,
    [Unit], unit => unit.armorOverride < 0.0 ? unit.armor : unit.armorOverride,
  );
  exports._armor = _armor;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the reload fraction of some entity.
   * ---------------------------------------- */
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
      if(mtIds == null || e == null) return 0.0;

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


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the payload fraction of some unit.
   * ---------------------------------------- */
  const _payFrac = function(unit, nearCap) {
    return Mathf.clamp(tryFun(unit.payloadUsed, unit, 0.0) / Math.max(unit.type.payloadCapacity, 1.0), 0.0, nearCap ? 0.999 : 1.0);
  };
  exports._payFrac = _payFrac;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the damage that {e} should be dealt to {e_t} (before it takes).
   * ---------------------------------------- */
  const _dmgDeal = function(e, e_t, dmg, bDmgMtp) {
    return dmg * e.damageMultiplier * (e_t instanceof Building ? tryVal(bDmgMtp, 1.0) : 1.0);
  };
  exports._dmgDeal = _dmgDeal;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the damage that {e} should take.
   * ---------------------------------------- */
  const _dmgTake = function(e, dmg, armorMtp) {
    return Damage.applyArmor(dmg, _armor(e) * tryVal(armorMtp, 1.0));
  };
  exports._dmgTake = _dmgTake;


  /* <---------- building ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the amount of some block built for a team.
   * ---------------------------------------- */
  const _bCount = function(blk, team) {
    return team.data().buildingTypes.get(blk, ARC_AIR.seq).size;
  };
  exports._bCount = _bCount;


  /* ----------------------------------------
   * NOTE:
   *
   * Iterates through buildings of the same block in a team.
   * ---------------------------------------- */
  const _it_someBlk = function(blk, team, scr) {
    team.data().buildingTypes.get(blk, ARC_AIR.seq).each(scr);
  };
  exports._it_someBlk = _it_someBlk;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the warmup of {e}.
   * ---------------------------------------- */
  const _warmup = function(b) {
    return tryFun(b.ex_getWarmupFrac, b, Mathf.maxZero(tryProp(b.warmup, b)));
  };
  exports._warmup = _warmup;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the warmup fraction of some building.
   * ---------------------------------------- */
  const _warmupFrac = function(b, nearCap) {
    return Math.min(
      tryVal(b.block.linearWarmup, false) ? _warmup(b) : Interp.pow3In.apply(_warmup(b)),
      nearCap ? 0.999 : 1.0,
    );
  };
  exports._warmupFrac = _warmupFrac;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the total progress of some building.
   * ---------------------------------------- */
  const _tProg = function(b) {
    return tryFun(b.ex_getTProg, b, tryProp(b.totalProgress, b));
  };
  exports._tProg = _tProg;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the shield amount of some building.
   * ---------------------------------------- */
  const _bShield = function(b, isSelfShield) {
    if(b.power != null && b.power.status < 0.0001) return 0.0;

    return readClassFunMap(DB_block.db["class"]["map"]["shield"], b.block, Function.airZero)(b, isSelfShield);
  };
  exports._bShield = _bShield;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the running speed of some building.
   * ---------------------------------------- */
  const _bSpd = function(b) {
    return b.efficiency * tryProp(b.timeScale, b);
  };
  exports._bSpd = _bSpd;


  /* <---------- unit ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the amount of some unit in a team.
   * ---------------------------------------- */
  const _unitCount = function(utp, team) {
    return tryVal(team.data().unitsByType[utp.id], Array.air).length;
  };
  exports._unitCount = _unitCount;


  /* ----------------------------------------
   * NOTE:
   *
   * Iterates through units of the same type in a team.
   * ---------------------------------------- */
  const _it_someUtp = function(utp, team, scr) {
    return tryVal(team.data().unitsByType[utp.id], Array.air).forEachFast(scr);
  };
  exports._it_someUtp = _it_someUtp;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the flash fraction of some unit.
   * ---------------------------------------- */
  const _flashFrac = function(unit) {
    return Mathf.clamp(unit.hitTime);
  };
  exports._flashFrac = _flashFrac;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the elevation of some unit.
   * ---------------------------------------- */
  const _elev = function(unit) {
    return Mathf.clamp(unit.elevation, unit.type.shadowElevation, 1.0) * unit.type.shadowElevationScl * (1.0 - unit.drownTime);
  };
  exports._elev = _elev;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the layer of some unit.
   * ---------------------------------------- */
  const _lay = function(unit) {
    return unit.elevation > 0.5 || (unit.type.flying && unit.dead) ?
      unit.type.flyingLayer :
      unit.type.groundLayer + Mathf.clamp(unit.hitSize / 4000.0, 0.0, 0.01);
  };
  exports._lay = _lay;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the layer of some unit.
   * ---------------------------------------- */
  const _reloadMtp = function(unit, isClamped) {
    let mtp = unit.reloadMultiplier * (unit.disarmed ? 0.0 : 1.0);

    return !isClamped ? mtp : Mathf.clamp(mtp);
  };
  exports._reloadMtp = _reloadMtp;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the controller of some unit.
   * ---------------------------------------- */
  const _ctrl = function(unit) {
    return tryProp(unit.controller, unit);
  };
  exports._ctrl = _ctrl;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the stack status that should be shown for some unit.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the bullet damage for damage display.
   * ---------------------------------------- */
  const _bulDmg = function(bul, e) {
    let
      dmg = bul.damage,
      sDmg = bul.type.splashDamage,
      sDmgRad = bul.type.splashDamageRadius,
      dmg_fi = 0.0,
      isRemote = DB_unit.db["class"]["btp"]["remote"].hasIns(bul.type),
      isRemoteCur = (dst > (bul.hitSize + hitSize) * 0.7499);
    if(e instanceof Unit && tryJsProp(bul.type, "typeMtpArr") != null) {
      dmg *= global.lovec.frag_attack._dmgMtp_typeMtpArr(e, bul.type.delegee.typeMtpArr);
    };
    let
      mtp = e instanceof Unit ?
        (1.0 / e.healthMultiplier * (e.shield > dmg ? 1.0 : bul.type.shieldDamageMultiplier)) :
        (bul.type.buildingDamageMultiplier * (_bShield(e, true) > dmg ? 1.0 : bul.type.shieldDamageMultiplier)),
      dst = Mathf.dst(bul.x, bul.y, e.x, e.y),
      armor = _armor(e),
      hitSize = _hitSize(e);

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


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a 4-array of wave information.
   * Format: {utp, amtUnit, shield, sta}.
   * ---------------------------------------- */
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
