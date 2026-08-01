/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods to deal damage, heal, and create events that deal damage.
   * @module lovec/frag/FRAG_attack
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ base ------------------------------ */


  /**
   * Gets default pressure explosion radius.
   * @param {number|unset} [size]
   * @return {number}
   */
  const getPresExploRad = function(size) {
    if(size == null) size = 1;

    return VAR.range.presExploRad + size * 0.8 * Vars.tilesize;
  };
  exports.getPresExploRad = getPresExploRad;


  /**
   * Gets default pressure explosion damage.
   * @param {number|unset} [size]
   * @return {number}
   */
  const getPresExploDmg = function(size) {
    if(size == null) size = 1;

    return VAR.param.presExploDmg * size * 0.3;
  };
  exports.getPresExploDmg = getPresExploDmg;


  /**
   * Gets default impact damage.
   * @param {number|unset} [size]
   * @param {number|unset} [intv]
   * @return {number}
   */
  const getImpactDmg = function(size, intv) {
    if(size == null) size = 1;
    if(intv == null) intv = 0.0;

    return Math.log(size + 1) * Math.log(Math.min(intv / 60.0, 10.0) + 1) * 400.0;
  };
  exports.getImpactDmg = getImpactDmg;


  /**
   * Gets default impact status duration.
   * @param {number|unset} [intv]
   * @return {number}
   */
  const getImpactDur = function(intv) {
    if(intv == null) intv = 0.0;

    return Math.min(intv * 0.5, 240.0);
  };
  exports.getImpactDur = getImpactDur;


  /**
   * Gets default impact minimum radius above which impact wave can be absorbed by liquid floor.
   * @param {number|unset} [size]
   * @return {number}
   */
  const getImpactMinRad = function(size) {
    if(size == null) size = 1;

    return size * 1.2 * Vars.tilesize;
  };
  exports.getImpactMinRad = getImpactMinRad;


  /**
   * Gets default impact radius for dust effect.
   * @param {number|unset} [size]
   * @return {number}
   */
  const getImpactDustRad = function(size) {
    if(size == null) size = 1;

    return (size * 0.5 + 1.0) * Vars.tilesize;
  };
  exports.getImpactDustRad = getImpactDustRad;


  /* <------------------------------ damage ------------------------------ */


  /**
   * Applies damage (triggers damage display).
   * @param {Building|Unit} e
   * @param {number} dmg
   * @param {number|unset} [armorMtp]
   * @param {string|unset} [mode_ow] - See {@link CLS_damageTextMode}.
   * @param {boolean|unset} [ignoreShield] - Has no effect on buildings.
   * @return {boolean}
   */
  const damage = function(e, dmg, armorMtp, mode_ow, ignoreShield) {
    if(dmg < 0.0001) return false;

    dmg = MDL_prop.getDmgTake(e, dmg, armorMtp, false);
    let dmgShow = MDL_prop.getDmgTake(e, dmg, armorMtp, true);
    let shield = 0.0;
    if(e instanceof Building) {
      MDL_effect._e_dmg(e.x, e.y, dmgShow, null, tryVal(mode_ow, MDL_prop.getBuildShield(e, true) > dmgShow ? "shield" : "health"));
      MDL_effect._e_flash(e);
      e.damagePierce(dmg, true);
    } else {
      shield = e.shield;
      MDL_effect._e_dmg(e.x, e.y, dmgShow, null, tryVal(mode_ow, !ignoreShield && e.shield > dmgShow ? "shield" : "health"));
      if(!ignoreShield) {
        e.damagePierce(dmg, true);
      } else {
        dmg += shield;
        e.damagePierce(dmg, true);
        e.shield = shield;
      };
    };

    return true;
  };
  exports.damage = damage;


  /**
   * Applies heal (triggers damage display).
   * @param {Building|Unit} e
   * @param {number} healAmt
   * @return {boolean}
   */
  const heal = function(e, healAmt) {
    if(healAmt < 0.0001) return false;

    if(e instanceof Building) {
      MDL_effect._e_dmg(e.x, e.y, healAmt, null, "heal");
      MDL_effect._e_flash(e, Pal.heal);
      e.recentlyHealed();
    } else {
      MDL_effect._e_dmg(e.x, e.y, healAmt, null, "heal");
      e.healTime = 1.0;
    };
    e.heal(healAmt);

    return true;
  };
  exports.heal = heal;


  /**
   * Gets multiplier on final damage based on type affinity.
   * @param {Unit} unit
   * @param {string} nameType
   * @param {number} mtp - The multiplier returned if type matches.
   * @return {number}
   */
  const getDmgMtpByType = function(unit, nameType, mtp) {
    return !checkTempTag(unit.type, CLS_unitDamageType.getTag(nameType)) ?
      1.0 :
      mtp;
  };
  exports.getDmgMtpByType = getDmgMtpByType;


  /**
   * Calculates final damage multiplier with given type multipliers.
   * @param {Unit} unit
   * @param {Array|null} typeMtpArr - `ROW`: nameType, mtp.
   * @return {number}
   */
  const getDmgMtpByTypeMtpArr = function(unit, typeMtpArr) {
    if(typeMtpArr == null || typeMtpArr.length === 0) return 1.0;

    let i = 0, iCap = typeMtpArr.iCap(), mtp = 1.0;
    while(i < iCap) {
      mtp *= getDmgMtpByType(unit, typeMtpArr[i], typeMtpArr[i + 1]);
      i += 2;
    };

    return mtp;
  };
  exports.getDmgMtpByTypeMtpArr = getDmgMtpByTypeMtpArr;


  /* <------------------------------ event ------------------------------ */


  /**
   * Creates a shockwave, visual only.
   * @param {number} x
   * @param {number} y
   * @param {number} rad
   * @param {number|unset} [scl]
   */
  const shockwave = function thisFun(x, y, rad, scl) {
    if(thisFun.shader == null) return;

    thisFun.shader.add(x, y, rad, thisFun.calcLifetime(rad) * tryVal(scl, 1.0));
  }
  .setProp({
    shader: fetchShader("shockwave"),
    calcLifetime: function(rad) {
      return 0.2708 * rad + 14.9;
    },
  });
  exports.shockwave = shockwave;


  /**
   * Creates a basic explosion.
   * @param {number} x
   * @param {number} y
   * @param {number} dmg
   * @param {number|unset} rad
   * @param {number|unset} [shake]
   * @param {string|unset} [se_gn]
   * @return {void}
   */
  const explosion = function(
    x, y, dmg,
    rad, shake, se_gn
  ) {
    if(!Vars.state.rules.reactorExplosions) return;
    if(dmg < 0.0001) return;
    if(rad < 0.0001) return;
    if(shake == null) shake = 0.0;

    Damage.damage(x, y, rad, dmg);
    MDL_effect.showAt(x, y, rad < 16.0 ? EFF.explosionSmall : EFF.explosion, 0.0);
    MDL_effect._e_shake(x, y, shake);
    shockwave(x, y, rad * 1.7, 3.0);
    MDL_effect.playAt(x, y, tryVal(se_gn, "se-shot-explosion"), 1.0, 1.0, 0.1);
  };
  exports.explosion = explosion;


  /**
   * Variant of {@link explosion} for sync.
   * @param {number} x
   * @param {number} y
   * @param {number} dmg
   * @param {number|unset} rad
   * @param {number|unset} [shake]
   * @param {string|unset} [se_gn]
   * @return {void}
   */
  const explosion_global = function(
    x, y, dmg,
    rad, shake, se_gn
  ) {
    if(!Vars.state.rules.reactorExplosions) return;

    MDL_net.sendPacket(
      PacketModes.BOTH, "lovec-both-attack-explosion",
      packPayload([x, y, dmg, rad, shake, se_gn]),
      true, true,
    );

    explosion(x, y, dmg, rad, shake, se_gn);
  }
  .setAnno("init", function() {
    MDL_net.addPacketHandler(PacketModes.BOTH, "lovec-both-attack-explosion", payload => {
      explosion.apply(this, unpackPayload(payload));
    });
  });
  exports.explosion_global = explosion_global;


  /**
   * Creates an impact wave.
   * @param {number} x
   * @param {number} y
   * @param {number} dmg
   * @param {number|unset} staDur
   * @param {number|unset} rad
   * @param {number|unset} [minRad]
   * @param {number|unset} [shake]
   * @param {Unit|unset} [caller] - This single unit won't be affected by impact wave.
   * @return {void}
   */
  const impact = function thisFun(
    x, y, dmg,
    staDur, rad, minRad, shake, caller
  ) {
    if(staDur == null) staDur = 120.0;
    if(rad < 0.0001) return;
    if(minRad == null) minRad = 0.0;
    if(shake == null) shake = 0.0;

    let dst, frac, dmg_fi;
    MDL_pos._units(thisFun.tmpUnits, x, y, rad).forEachFast(unit => {
      if(FRAG_unit.checkCaller(unit, caller) || !MDL_cond._isOnFloor(unit) || MDL_pos._rayCheck_mobileFlr(x, y, unit.x, unit.y, minRad)) return;
      dst = Mathf.dst(x, y, unit.x, unit.y);
      frac = 1.0 - dst / rad;
      dmg_fi = dmg * (Mathf.random(0.6) + 0.7) * Math.max(frac, 0.1) + VAR.param.impactDmgMin;

      if(unit === Vars.player.unit()) {
        Time.run(2.0, () => {
          if(unit.dead) {
            TRIGGER.impactWavePlayerDeath.fire();
            TRIGGER.impactWaveDeath.fire(x, y, unit);
          };
        });
      } else {
        Time.run(2.0, () => {
          if(unit.dead) TRIGGER.impactWaveDeath.fire(x, y, unit);
        });
      };

      MDL_call.knockback(x, y, unit, dmg / 100.0, rad);
      damage(unit, dmg_fi, 0.0);
      if(LCRand.chance(UTIL_rand.get("unit"), Math.max(frac, 0.2))) unit.apply(VARGEN.staStunned, staDur);
    });

    MDL_effect._e_shake(x, y, shake);
  }
  .setProp({
    tmpUnits: [],
  });
  exports.impact = impact;


  /**
   * Creates lightning arcs.
   * @param {number} x
   * @param {number} y
   * @param {Team|unset} [team]
   * @param {number|unset} [dmg]
   * @param {number|unset} [amt]
   * @param {number|unset} [r]
   * @param {number|unset} [offR]
   * @param {ColorGn|unset} [color_gn]
   * @param {string|unset} [hitMode] - `VALS`: "none", "ground", "air".
   * @param {SoundGn|unset} [se_gn]
   * @return {void}
   */
  const lightning = function(
    x, y, team, dmg, amt,
    r, offR, color_gn, hitMode, se_gn
  ) {
    if(team == null) team = Team.derelict;
    if(dmg == null) dmg = VAR.param.lightningDmg;
    if(amt == null) amt = 1;
    if(amt < 1) return;
    if(r == null) r = 5;
    if(offR == null) offR = 2;

    let btp;
    switch(hitMode) {
      case "ground" :
        btp = Bullets.damageLightningGround;
        break;
      case "air" :
        btp = Bullets.damageLightningAir;
        break;
      default :
        btp = Bullets.damageLightning;
    };

    let i = 0;
    let r_fi, color = MDL_color.getColor(tryVal(color_gn, Pal.accent));
    while(i < amt) {
      r_fi = Math.round(r + Mathf.random() * offR);
      Lightning.create(
        btp, team, color, dmg,
        x, y, Mathf.random(360.0), r_fi,
      );
      i++;
    };

    MDL_effect.playAt(x, y, tryVal(se_gn, Sounds.shootArc));
  };
  exports.lightning = lightning;
