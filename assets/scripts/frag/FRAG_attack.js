/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods to deal damage, heal, and create events that deal damage.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const TRIGGER = require("lovec/glb/BOX_trigger");
  const EFF = require("lovec/glb/GLB_eff");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_call = require("lovec/mdl/MDL_call");
  const MDL_color = require("lovec/mdl/MDL_color");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_entity = require("lovec/mdl/MDL_entity");
  const MDL_net = require("lovec/mdl/MDL_net");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets default pressure explosion radius.
   * ---------------------------------------- */
  const _presExploRad = function(size) {
    if(size == null) size = 1;

    return VAR.rad_presExploRad + size * 0.8 * Vars.tilesize;
  };
  exports._presExploRad = _presExploRad;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets default pressure explosion damage.
   * ---------------------------------------- */
  const _presExploDmg = function(size) {
    if(size == null) size = 1;

    return VAR.dmg_presExploDmg * size * 0.3;
  };
  exports._presExploDmg = _presExploDmg;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets default impact damage.
   * ---------------------------------------- */
  const _impactDmg = function(size, intv) {
    if(size == null) size = 1;
    if(intv == null) intv = 0.0;

    return Math.log(size + 1) * Math.log(Math.min(intv / 60.0, 10.0) + 1) * 400.0;
  };
  exports._impactDmg = _impactDmg;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets default impact status duration.
   * ---------------------------------------- */
  const _impactDur = function(intv) {
    if(intv == null) intv = 0.0;

    return Math.min(intv * 0.5, 240.0);
  };
  exports._impactDur = _impactDur;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets default impact minimum radius that impact can be absorbed by liquid floor.
   * ---------------------------------------- */
  const _impactMinRad = function(size) {
    if(size == null) size = 1;

    return size * 1.2 * Vars.tilesize;
  };
  exports._impactMinRad = _impactMinRad;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets default impact radius for dust effect.
   * ---------------------------------------- */
  const _impactDustRad = function(size) {
    if(size == null) size = 1;

    return (size * 0.5 + 1.0) * Vars.tilesize;
  };
  exports._impactDustRad = _impactDustRad;


  /* <---------- damage ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Applies damage (triggers damage display).
   * ---------------------------------------- */
  const damage = function(e, dmg, armorMtp, mode_ow) {
    if(e == null) return false;
    if(dmg < 0.0001) return false;

    let dmg_fi = MDL_entity._dmgTake(e, dmg, armorMtp);
    if(e instanceof Building) {
      MDL_effect.showAt_dmg(e.x, e.y, dmg_fi, null, tryVal(mode_ow, MDL_entity._bShield(e, true) > dmg_fi ? "shield" : "health"));
      MDL_effect.showAt_flash(e);
    } else {
      MDL_effect.showAt_dmg(e.x, e.y, dmg_fi, null, tryVal(mode_ow, e.shield > dmg_fi ? "shield" : "health"));
    };
    e.damagePierce(dmg_fi, true);

    return true;
  };
  exports.damage = damage;


  /* ----------------------------------------
   * NOTE:
   *
   * Applies heal (triggers damage display).
   * ---------------------------------------- */
  const heal = function(e, healAmt) {
    if(e == null) return false;
    if(healAmt < 0.0001) return false;

    if(e instanceof Building) {
      MDL_effect.showAt_dmg(e.x, e.y, healAmt, null, "heal");
      MDL_effect.showAt_flash(e, Pal.heal);
      e.recentlyHealed();
    } else {
      MDL_effect.showAt_dmg(e.x, e.y, healAmt, null, "heal");
      e.healTime = 1.0;
    };
    e.heal(healAmt);

    return true;
  };
  exports.heal = heal;


  /* ----------------------------------------
   * NOTE:
   *
   * Finds the multiplier on final damage based on type affinity.
   * ---------------------------------------- */
  const _dmgMtp_type = function(e, type, mtp) {
    let tag = DB_unit.db["grpParam"]["typeTagMap"].read(type);
    return tag == null || !MDL_content._hasTag(e.type, tag) ?
      1.0 :
      mtp;
  };
  exports._dmgMtp_type = _dmgMtp_type;


  /* ----------------------------------------
   * NOTE:
   *
   * Calculates the final damage multiplier with given type multipliers.
   * ---------------------------------------- */
  const _dmgMtp_typeMtpArr = function(e, typeMtpArr) {
    if(typeMtpArr == null || typeMtpArr.length === 0) return 1.0;

    let i = 0, iCap = typeMtpArr.iCap(), mtp = 1.0;
    while(i < iCap) {
      mtp *= _dmgMtp_type(e, typeMtpArr[i], typeMtpArr[i + 1]);
      i += 2;
    };

    return mtp;
  };
  exports._dmgMtp_typeMtpArr = _dmgMtp_typeMtpArr;


  /* <---------- event ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a basic explosion.
   * ---------------------------------------- */
  const _a_explosion = function(
    x, y, dmg,
    rad, shake, noSound
  ) {
    if(!Vars.state.rules.reactorExplosions) return;
    if(dmg == null) dmg = 0.0;
    if(dmg < 0.0001) return;
    if(rad == null) rad = 40.0;
    if(rad < 0.0001) return;
    if(shake == null) shake = 0.0;

    Damage.damage(x, y, rad, dmg);
    MDL_effect.showAt(x, y, rad < 16.0 ? EFF.explosionSmall : EFF.explosion, 0.0);
    MDL_effect.showAt_shake(x, y, shake);
    if(!noSound) MDL_effect.playAt(x, y, "se-shot-explosion", 1.0, 1.0, 0.1);
  };
  exports._a_explosion = _a_explosion;


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {_a_explosion} for sync.
   * ---------------------------------------- */
  const _a_explosion_global = function(
    x, y, dmg,
    rad, shake, noSound
  ) {
    if(!Vars.state.rules.reactorExplosions) return;

    MDL_net.sendPacket(
      "both", "lovec-both-attack-explosion",
      packPayload([x, y, dmg, rad, shake, noSound]),
      true, true,
    );

    _a_explosion(x, y, dmg, rad, shake, noSound);
  }
  .setAnno("init", function() {
    MDL_net.__packetHandler("both", "lovec-both-attack-explosion", payload => {
      _a_explosion.apply(this, unpackPayload(payload));
    });
  });
  exports._a_explosion_global = _a_explosion_global;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates an impact wave.
   * ---------------------------------------- */
  const _a_impact = function(
    x, y, dmg, staDur,
    rad, minRad, shake, caller
  ) {
    if(dmg == null) dmg = 0.0;
    if(dmg < 0.0001) return;
    if(staDur == null) staDur = 120.0;
    if(rad == null) rad = 40.0;
    if(rad < 0.0001) return;
    if(minRad == null) minRad = 0.0;
    if(shake == null) shake = 0.0;

    let dst, frac, dmg_fi;
    MDL_pos._units(x, y, rad, caller).forEachFast(unit => {
      if(!MDL_cond._isOnFloor(unit) || MDL_pos._rayCheck_mobileFlr(x, y, unit.x, unit.y, minRad)) return;
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

    MDL_effect.showAt_shake(x, y, shake);
  };
  exports._a_impact = _a_impact;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates lightning arcs.
   * ---------------------------------------- */
  const _a_lightning = function(
    x, y, team, dmg, amt,
    r, offR, color_gn, hitMode, noSound
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

    if(!noSound) MDL_effect.playAt(x, y, Sounds.shootArc);
  };
  exports._a_lightning = _a_lightning;
