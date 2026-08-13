/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods to create effects.
   * Unlike {@link TP_effect} which provides effects, this module is only meant to spawn pre-defined effects.
   * @module lovec/mdl/MDL_effect
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ base ------------------------------ */


  /**
   * Gets final chance by fraction (capped).
   * @param {number} p
   * @param {number} frac
   * @return {number}
   */
  const calcEffPByFrac = function(p, frac) {
    return Math.min(p * frac, VAR.chance.effPCap);
  };
  exports.calcEffPByFrac = calcEffPByFrac;


  /**
   * Shows an effect at (x, y).
   * @param {number} x
   * @param {number} y
   * @param {Effect} eff
   * @param {number|unset} [rot] - Leave empty for random rotation.
   * @param {Color|unset} [color]
   * @param {Object|unset} [data]
   * @return {void}
   */
  const showAt = function(x, y, eff, rot, color, data) {
    if(rot == null) rot = Mathf.random(360.0);
    if(color == null) color = Color.white;

    data == null ?
      eff.at(x, y, rot, color) :
      eff.at(x, y, rot, color, data);
  }
  .setAnno("effect");
  exports.showAt = showAt;


  /**
   * Variant of {@link showAt} for sync.
   * @param {number} x
   * @param {number} y
   * @param {Effect} eff
   * @param {number|unset} [rot]
   * @param {Color|unset} [color]
   * @param {Object|unset} [data]
   * @return {void}
   */
  const showAt_global = function(x, y, eff, rot, color, data) {
    if(rot == null) rot = Mathf.random(360.0);
    if(color == null) color = Color.white;

    data == null ?
      Call.effect(eff, x, y, rot, color) :
      Call.effect(eff, x, y, rot, color, data);

    showAt(x, y, eff, rot, color, data);
  }
  .setAnno("effect");
  exports.showAt_global = showAt_global;


  /**
   * Shows an effect around (x, y).
   * @param {number} x
   * @param {number} y
   * @param {Effect} eff
   * @param {number|unset} [rad]
   * @param {number|unset} [rot]
   * @param {Color|unset} [color]
   * @param {Object|unset} [data]
   * @return {void}
   */
  const showAround = function(x, y, eff, rad, rot, color, data) {
    showAt(x + Mathf.range(rad), y + Mathf.range(rad), eff, rot, color, data);
  }
  .setAnno("effect");
  exports.showAround = showAround;


  /**
   * Variant of {@link showAround} for sync.
   * @param {number} x
   * @param {number} y
   * @param {Effect} eff
   * @param {number|unset} [rad]
   * @param {number|unset} [rot]
   * @param {Color|unset} [color]
   * @param {Object|unset} [data]
   * @return {void}
   */
  const showAround_global = function(x, y, eff, rad, rot, color, data) {
    showAt_global(x + Mathf.range(rad), y + Mathf.range(rad), eff, rot, color, data);
  }
  .setAnno("effect");
  exports.showAround_global = showAround_global;


  /* <------------------------------ effect ------------------------------ */


  /**
   * Regular shake effect.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [pow]
   * @param {number|unset} [dur]
   * @return {void}
   */
  const shake = function(x, y, pow, dur) {
    if(pow == null) pow = 4.0;
    if(dur == null) dur = 60.0;
    if(pow < 0.0001 || dur < 0.0001) return;

    Effect.shake(pow, dur, x, y);
  }
  .setAnno("effect");
  exports.shake = shake;


  /**
   * Floor dust.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @param {number|unset} [repeat]
   * @return {void}
   */
  const dust = function(x, y, rad, repeat) {
    if(rad == null) rad = 8.0;
    if(repeat == null) repeat = 1;

    let x_i, y_i;
    (repeat)._it(i => {
      x_i = x + Mathf.range(rad);
      y_i = y + Mathf.range(rad);
      Effect.floorDust(x_i, y_i, 8.0);
    });
  }
  .setAnno("effect");
  exports.dust = dust;


  /**
   * Click effect.
   * @param {number} x
   * @param {number} y
   * @param {Color|unset} [color]
   * @return {void}
   */
  const click = function thisFun(x, y, color) {
    if(color == null) color = Pal.accent;

    showAt(x, y, thisFun.eff, 0.0, color);
  }
  .setProp({
    eff: TP_effect.waveCircle({
      size_f: 2.0,
      rad: 6.0,
      scl: 0.75,
    }),
  })
  .setAnno("effect");
  exports.click = click;


  /**
   * Colored circle spark effects.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @param {Color|unset} [color]
   * @return {void}
   */
  const colorDust = function(x, y, rad, color) {
    if(rad == null) rad = 20.0;
    if(color == null) color = Color.white;

    showAt(x, y, LCFx.colorDust, rad, color);
  }
  .setAnno("effect");
  exports.colorDust = colorDust;


  /**
   * Triangles that move towards the nearest core.
   * @param {number} x
   * @param {number} y
   * @param {Team} team
   * @param {number|unset} [pad] - Distance between center and actual starting position.
   * @param {number|unset} [rad] - Length of path.
   * @return {void}
   */
  const coreSignal = function (x, y, team, pad, rad) {
    let b = Vars.state.teams.closestCore(x, y, team);
    if(b == null) return;
    if(pad == null) pad = 0.0;
    if(rad == null) rad = 40.0;

    showAt(x, y, LCFx.coreSignal, rad, team.color, [b, pad, Math.random() > 0.5]);
  }
  .setAnno("effect");
  exports.coreSignal = coreSignal;


  /**
  * Liquid corrosion effect.
  * @param {number} x
  * @param {number} y
  * @param {number|unset} [size]
  * @param {Color|unset} [color]
  * @param {boolean|unset} [isClogging]
  * @return {void}
  */
  const corrosion = function(x, y, size, color, isClogging) {
    if(size == null) size = 1;
    if(color == null) color = Color.white;

    showAround(x, y, LCFx.corrosion, size * Vars.tilesize * 0.5, null, color, tryVal(isClogging, false));
  }
  .setAnno("effect");
  exports.corrosion = corrosion;


  /**
  * Damage display effect.
  * @param {number} x
  * @param {number} y
  * @param {number} dmg
  * @param {Team|unset} [team]
  * @param {string|unset} [mode] - Determines format of damage text, see {@link CLS_damageTextMode}.
  * @return {void}
  */
  const damage = function thisFun(x, y, dmg, team, mode) {
    if(!PARAM.ENABLE_DAMAGE_DISPLAY || dmg < 0.0001 || dmg < PARAM.DAMAGE_DISPLAY_THRESHOLD) return;
    if(mode == null) mode = "health";
    if(team == null) team = Team.derelict;
    let dmgTextMode = CLS_damageTextMode.get(mode);
    if(dmgTextMode == null) return;

    let str = dmg > 9.9999 ? Strings.fixed(dmg, 0) : (dmg > 0.9999 ? Strings.fixed(dmg, 1) : Strings.fixed(dmg, 2));
    str = dmgTextMode.getText(str);
    let sizeScl = Math.max(Math.log((dmg + 10.0) / 10.0), 0.7);

    showAround(x, y, thisFun.eff, 8.0, dmg, dmgTextMode.getColor(team), [str, sizeScl]);
  }
  .setProp({
    eff: new Effect(40.0, eff => {
      LCDraw.text(
        eff.x, eff.y, eff.data[0], Fonts.def,
        eff.data[1] - Interp.pow3In.apply(eff.fin()) * eff.data[1],
        eff.color, Align.center, 0.0, 8.0 * eff.fin(), Math.min(eff.rotation / 10000.0, 10.0),
      );
    }),
  })
  .setAnno("effect");
  exports.damage = damage;


  /**
  * Creates a texture region or icon that fades out.
  * @param {number} x
  * @param {number} y
  * @param {TextureRegion|null} reg
  * @param {Color|unset} [color]
  * @param {number|unset} [scl]
  * @return {void}
  */
  const fadeRegion = function(x, y, reg, color, scl) {
    if(reg == null) return;
    if(color == null) color = Color.white;
    if(scl == null) scl = 1.0;

    showAt(x, y, LCFx.fadeRegion, scl, color, reg);
  }
  .setAnno("effect");
  exports.fadeRegion = fadeRegion;


  /**
   * Text that fades out.
   * @param {number} x
   * @param {number} y
   * @param {string} text
   * @param {Color|unset} [color]
   * @param {number|unset} [offTy]
   * @return {void}
   */
  const fadeText = function(x, y, text, color, offTy) {
    if(color == null) color = Color.white;

    showAt(x, y + (tryVal(offTy, 0) + 0.5) * Vars.tilesize, LCFx.fadeText, 0.0, color, String(text));
  }
  .setAnno("effect");
  exports.fadeText = fadeText;


  /**
  * Creates flash effect over an entity.
  * @param {Building|Unit} e
  * @param {Color|unset} [color]
  * @return {void}
  */
  const flash = function(e, color) {
    if(e == null) return;
    if(color == null) color = Color.white;

    if(e instanceof Building) {
      let reg = !(e.block instanceof BaseTurret) ?
      e.block.fullIcon :
      tryVal(MDL_texture.getRegTurBase(e.block), e.block.region);
      if(reg != null) {
        showAt(MDL_ui.getCameraX(), MDL_ui.getCameraY(), LCFx.flashBuild, 0.0, color, [reg, e]);
      };
    } else {
      color.equals(Pal.heal) ?
      unit.healTime = 1.0 :
      unit.hitTime = 1.0;
    };
  }
  .setAnno("effect");
  exports.flash = flash;


  /**
  * Impact wave effect.
  * @param {number} x
  * @param {number} y
  * @param {number|unset} [rad]
  * @return {void}
  */
  const impactWave = function thisFun(x, y, rad) {
    thisFun.effs.forEachFast(eff => {
      showAt(x, y, eff, rad);
    });
  }
  .setProp({
    effs: [
      TP_effect.waveImpact(),
      TP_effect.waveImpact({scl: 1.2}),
      TP_effect.waveImpact({scl: 1.5}),
      TP_effect.waveImpact({scl: 1.9}),
    ],
  })
  .setAnno("effect");
  exports.impactWave = impactWave;


  /**
   * Item transfer effect.
   * @param {number} x
   * @param {number} y
   * @param {PosGn|null} posIns
   * @param {Color|unset} [color]
   * @param {number|unset} [repeat]
   * @param {boolean|unset} [isGlobal]
   * @return {void}
   */
  const itemTransfer = function(x, y, posIns, color, repeat, isGlobal) {
    if(posIns == null) return;
    if(color == null) color = Pal.accent;
    if(repeat == null) repeat = 3;

    for(let i = 0; i < repeat; i++) {
      (isGlobal ? showAt_global : showAt)(x, y, Fx.itemTransfer, 0.0, color, posIns);
    };
  }
  .setAnno("effect");
  exports.itemTransfer = itemTransfer;


  /**
   * Laser beam effect.
   * @param {number} x
   * @param {number} y
   * @param {PoscGn|null} e_f
   * @param {PoscGn|null} e_t
   * @param {Color|unset} [color]
   * @param {number|unset} [strokeScl]
   * @param {boolean|unset} [hasLight]
   * @return {void}
   */
  const laser = function thisFun(x, y, e_f, e_t, color, strokeScl, hasLight) {
    if(e_t == null) return;
    if(color == null) color = Pal.accent;

    showAt(x, y, LCFx.laser, tryVal(strokeScl, 1.0), color, [e_f, e_t, tryVal(hasLight, false)]);
  }
  .setAnno("effect");
  exports.laser = laser;


  /**
   * Lightning effect.
   * @param {number} x
   * @param {number} y
   * @param {PoscGn|null} e
   * @param {Color|unset} [color]
   * @param {boolean|unset} [hasSound]
   * @return {void}
   */
  const lightning = function(x, y, e, color, hasSound) {
    if(posIns == null) return;
    if(color == null) color = Pal.accent;

    showAt(x, y, Fx.chainLightning, 0.0, color, e);
    if(hasSound) {
      MDL_sound.playAt(x, y, Sounds.shootArc);
    };
  }
  .setAnno("effect");
  exports.lightning = lightning;


  /**
   * Chain lightning effect with multiple targets.
   * @param {number} x
   * @param {number} y
   * @param {Array<PoscGn>} es
   * @param {Color|unset} [color]
   * @param {boolean|unset} [hasSound]
   * @return {void}
   */
  const lightningChain = function thisFun(x, y, es, color, hasSound) {
    if(es.length === 0) return;

    let i = 0, iCap = es.iCap();
    let e1, e2;
    while(i < iCap) {
      e1 = (i === 0) ? thisFun.tmpVec.set(x, y) : es[i - 1];
      e2 = es[i];
      lightning(e1.x, e1.y, e2, color);
      i++;
    };

    if(hasSound) {
      MDL_sound.playAt(x, y, Sounds.shootArc);
    };
  }
  .setProp({
    tmpVec: new Vec2(),
  })
  .setAnno("effect");
  exports.lightningChain = lightningChain;


  /**
   * Line effect from (x, y) or an entity to another entity.
   * @param {number} x
   * @param {number} y
   * @param {PoscGn|null} e_f
   * @param {PoscGn|null} e_t
   * @param {Color|unset} [color]
   * @param {number|unset} [strokeScl]
   * @param {boolean|unset} [shouldDrawSpike]
   * @param {boolean|unset} [shouldInvertSpike]
   * @return {void}
   */
  const line = function (x, y, e_f, e_t, color, strokeScl, shouldDrawSpike, shouldInvertSpike) {
    if(e_t == null) return;
    if(color == null) color = Color.white;
    if(strokeScl == null) strokeScl = 1.0;

    showAt(x, y, LCFx.line, strokeScl, color, [e_f, e_t, Boolean(shouldDrawSpike), Boolean(shouldInvertSpike)]);
  }
  .setAnno("effect");
  exports.line = line;


  /**
   * Payload deposit effect.
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {ContentGn} ct_gn
   * @param {boolean|unset} [isOut]
   * @return {void}
   */
  const payloadDeposit = function(x1, y1, x2, y2, ct_gn, isOut) {
    let ct = MDL_content.getCt(ct_gn, null, true);
    if(ct == null) return;

    showAt(x1, y1, LCFx.payloadDeposit, Angles.angle(x1, y1, x2, y2), null, [x2, y2, ct, Boolean(isOut)]);
  }
  .setAnno("effect");
  exports.payloadDeposit = payloadDeposit;


  /**
   * Point laser effect.
   * @param {number} x
   * @param {number} y
   * @param {PoscGn|null} e
   * @param {Color|unset} [color]
   * @param {SoundGn|unset} [se_gn]
   * @return {void}
   */
  const pointLaser = function(x, y, e, color, se_gn) {
    if(e == null) return;
    if(color == null) color = Pal.remove;

    showAt(x, y, LCFx.pointLaserLine, 0.0, color, e);
    showAt(x, y, LCFx.pointLaserEnd, 0.0, color, e);
    showAt(x, y, LCFx.pointLaserEnd, 0.0, color);
    if(se_gn != null) {
      MDL_sound.playAt(x, y, se_gn, 1.0, 1.0, 0.05);
    };
  }
  .setAnno("effect");
  exports.pointLaser = pointLaser;


  /**
  * Ripple effect on liquid floor.
  * @param {number} x
  * @param {number} y
  * @param {number|unset} [rad]
  * @param {Color|unset} [color]
  * @return {void}
  */
  const ripple = function(x, y, rad, color) {
    if(rad == null) rad = 18.0;
    if(color == null) {
      let t = Vars.world.tileWorld(x, y);
      color = t == null ? Color.white : t.getFloorColor();
    };

    showAt(x, y, LCFx.ripple, rad, color);
  }
  .setAnno("effect");
  exports.ripple = ripple;


  /**
  * Rotor wave effect for some units.
  * @param {number} x
  * @param {number} y
  * @param {number|unset} [rad]
  * @return {void}
  */
  const rotorWave = function thisFun(x, y, rad) {
    showAt(x, y, thisFun.eff, rad);
  }
  .setProp({
    eff: (function() {
      const tmp = new Effect(20.0, eff => {
        eff.lifetime = 20.0 * Math.pow(eff.rotation * 0.025, 0.5);

        Draw.color(rotorWave.effColor1, rotorWave.effColor2, eff.fin());
        Lines.stroke(2.0);
        Lines.circle(eff.x, eff.y, eff.rotation * eff.fin());
        Draw.reset();
      });
      tmp.layer = VAR.layer.effFlr;

      return tmp;
    })(),
    effColor1: VAR.color.rotorWhite,
    effColor2: VAR.color.whiteClear,
  })
  .setAnno("effect");
  exports.rotorWave = rotorWave;


  /**
   * Circle effect usually used as trail.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @param {Color|unset} [color]
   * @return {void}
   */
  const trailCircle = function(x, y, rad, color) {
    if(rad == null) rad = 4.0;
    if(color == null) color = Pal.accent;

    showAt(x, y, LCFx.trailCircle, rad, color);
  }
  .setAnno("effect");
  exports.trailCircle = trailCircle;


  /**
   * Jet trail effect for some units.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @return {void}
   */
  const trailJet = function(x, y, unit) {
    showAt(x, y, LCFx.trailJet, unit.rotation - 90.0, null, unit);
  }
  .setAnno("effect");
  exports.trailJet = trailJet;
