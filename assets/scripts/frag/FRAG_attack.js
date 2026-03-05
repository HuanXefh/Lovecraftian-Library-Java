/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods to deal damage, heal, and create events that deal damage.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  /**
   * Gets default pressure explosion radius.
   * @param {number|unset} [size]
   * @return {number}
   */
  const _presExploRad = function(size) {
    if(size == null) size = 1;

    return VAR.rad_presExploRad + size * 0.8 * Vars.tilesize;
  };
  exports._presExploRad = _presExploRad;


  /**
   * Gets default pressure explosion damage.
   * @param {number|unset} [size]
   * @return {number}
   */
  const _presExploDmg = function(size) {
    if(size == null) size = 1;

    return VAR.dmg_presExploDmg * size * 0.3;
  };
  exports._presExploDmg = _presExploDmg;


  /**
   * Gets default impact damage.
   * @param {number|unset} [size]
   * @param {number|unset} [intv]
   * @return {number}
   */
  const _impactDmg = function(size, intv) {
    if(size == null) size = 1;
    if(intv == null) intv = 0.0;

    return Math.log(size + 1) * Math.log(Math.min(intv / 60.0, 10.0) + 1) * 400.0;
  };
  exports._impactDmg = _impactDmg;


  /**
   * Gets default impact status duration.
   * @param {number|unset} [intv]
   * @return {number}
   */
  const _impactDur = function(intv) {
    if(intv == null) intv = 0.0;

    return Math.min(intv * 0.5, 240.0);
  };
  exports._impactDur = _impactDur;


  /**
   * Gets default impact minimum radius above which impact wave can be absorbed by liquid floor.
   * @param {number|unset} [size]
   * @return {number}
   */
  const _impactMinRad = function(size) {
    if(size == null) size = 1;

    return size * 1.2 * Vars.tilesize;
  };
  exports._impactMinRad = _impactMinRad;


  /**
   * Gets default impact radius for dust effect.
   * @param {number|unset} [size]
   * @return {number}
   */
  const _impactDustRad = function(size) {
    if(size == null) size = 1;

    return (size * 0.5 + 1.0) * Vars.tilesize;
  };
  exports._impactDustRad = _impactDustRad;


  /* <---------- damage ----------> */


  /**
   * Applies damage (triggers damage display).
   * @param {Building|Unit} e
   * @param {number} dmg
   * @param {number|unset} [armorMtp]
   * @param {string|unset} [mode_ow]
   * @return {boolean}
   */
  const damage = function(e, dmg, armorMtp, mode_ow) {
    if(dmg < 0.0001) return false;

    let dmg_fi = MDL_entity._dmgTake(e, dmg, armorMtp);
    if(e instanceof Building) {
      MDL_effect._e_dmg(e.x, e.y, dmg_fi, null, tryVal(mode_ow, MDL_entity._bShield(e, true) > dmg_fi ? "shield" : "health"));
      MDL_effect._e_flash(e);
    } else {
      MDL_effect._e_dmg(e.x, e.y, dmg_fi, null, tryVal(mode_ow, e.shield > dmg_fi ? "shield" : "health"));
    };
    e.damagePierce(dmg_fi, true);

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
   * @param {string} type
   * @param {number} mtp - The multiplier returned if type matches.
   * @return {number}
   */
  const _dmgMtp_type = function(unit, type, mtp) {
    let tag = DB_unit.db["grpParam"]["typeTagMap"].read(type);
    return tag == null || !MDL_content._hasTag(unit.type, tag) ?
      1.0 :
      mtp;
  };
  exports._dmgMtp_type = _dmgMtp_type;


  /**
   * Calculates final damage multiplier with given type multipliers.
   * @param {Unit} unit
   * @param {Array|null} typeMtpArr - <ROW>: type, mtp.
   * @return {number}
   */
  const _dmgMtp_typeMtpArr = function(unit, typeMtpArr) {
    if(typeMtpArr == null || typeMtpArr.length === 0) return 1.0;

    let i = 0, iCap = typeMtpArr.iCap(), mtp = 1.0;
    while(i < iCap) {
      mtp *= _dmgMtp_type(unit, typeMtpArr[i], typeMtpArr[i + 1]);
      i += 2;
    };

    return mtp;
  };
  exports._dmgMtp_typeMtpArr = _dmgMtp_typeMtpArr;


  /* <---------- event ----------> */


  /**
   * Creates a basic explosion.
   * @param {number} x
   * @param {number} y
   * @param {number} dmg
   * @param {number|unset} [rad]
   * @param {number|unset} [shake]
   * @param {string|unset} [se_gn]
   * @return {void}
   */
  const _a_explosion = function(
    x, y, dmg,
    rad, shake, se_gn
  ) {
    if(!Vars.state.rules.reactorExplosions) return;
    if(dmg < 0.0001) return;
    if(rad == null) rad = 40.0;
    if(rad < 0.0001) return;
    if(shake == null) shake = 0.0;

    Damage.damage(x, y, rad, dmg);
    MDL_effect.showAt(x, y, rad < 16.0 ? EFF.explosionSmall : EFF.explosion, 0.0);
    MDL_effect._e_shake(x, y, shake);
    MDL_effect.playAt(x, y, tryVal(se_gn, "se-shot-explosion"), 1.0, 1.0, 0.1);
  };
  exports._a_explosion = _a_explosion;


  /**
   * Variant of {@link _a_explosion} for sync.
   * @param {number} x
   * @param {number} y
   * @param {number} dmg
   * @param {number|unset} [rad]
   * @param {number|unset} [shake]
   * @param {string|unset} [se_gn]
   * @return {void}
   */
  const _a_explosion_global = function(
    x, y, dmg,
    rad, shake, se_gn
  ) {
    if(!Vars.state.rules.reactorExplosions) return;

    MDL_net.sendPacket(
      "both", "lovec-both-attack-explosion",
      packPayload([x, y, dmg, rad, shake, se_gn]),
      true, true,
    );

    _a_explosion(x, y, dmg, rad, shake, se_gn);
  }
  .setAnno("init", function() {
    MDL_net.__packetHandler("both", "lovec-both-attack-explosion", payload => {
      _a_explosion.apply(this, unpackPayload(payload));
    });
  });
  exports._a_explosion_global = _a_explosion_global;


  /**
   * Creates an impact wave.
   * @param {number} x
   * @param {number} y
   * @param {number} dmg
   * @param {number|unset} [staDur]
   * @param {number|unset} [rad]
   * @param {number|unset} [minRad]
   * @param {number|unset} [shake]
   * @param {Unit|unset} [caller] - This single unit won't be affected by impact wave.
   * @return {void}
   */
  const _a_impact = function thisFun(
    x, y, dmg,
    staDur, rad, minRad, shake, caller
  ) {
    if(staDur == null) staDur = 120.0;
    if(rad == null) rad = 40.0;
    if(rad < 0.0001) return;
    if(minRad == null) minRad = 0.0;
    if(shake == null) shake = 0.0;

    let dst, frac, dmg_fi;
    MDL_pos._units(x, y, rad, thisFun.tmpUnits).forEachFast(unit => {
      if(FRAG_unit.checkCaller(unit, caller) || !MDL_cond._isOnFloor(unit) || MDL_pos._rayCheck_mobileFlr(x, y, unit.x, unit.y, minRad)) return;
      dst = Mathf.dst(x, y, unit.x, unit.y);
      frac = 1.0 - dst / rad;
      dmg_fi = dmg * (Mathf.random(0.6) + 0.7) * Math.max(frac, 0.1) + VAR.dmg_impactMinDmg;

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
      if(Mathf.chance(Math.max(frac, 0.2))) unit.apply(VARGEN.staStunned, staDur);
    });

    MDL_effect._e_shake(x, y, shake);
  }
  .setProp({
    tmpUnits: [],
  });
  exports._a_impact = _a_impact;


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
   * @param {string|unset} [hitMode] - <VALS>: "none", "ground", "air".
   * @param {SoundGn|unset} [se_gn]
   * @return {void}
   */
  const _a_lightning = function(
    x, y, team, dmg, amt,
    r, offR, color_gn, hitMode, se_gn
  ) {
    if(team == null) team = Team.derelict;
    if(dmg == null) dmg = VAR.blk_lightningDmg;
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
    let r_fi, color = MDL_color._color(tryVal(color_gn, Pal.accent));
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
  exports._a_lightning = _a_lightning;
