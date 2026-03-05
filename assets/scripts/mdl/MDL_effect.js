/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods to create effects.
   * Unlike {@link TP_effect} which provides effects, this module is only meant to spawn pre-defined effects.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  /**
   * Gets final chance by fraction (capped).
   * @param {number} p
   * @param {number} frac
   * @return {number}
   */
  const _p_frac = function(p, frac) {
    return Math.min(p * frac, VAR.p_effPCap);
  };
  exports._p_frac = _p_frac;


  /* <---------- sound ----------> */


  /**
   * Plays a sound.
   * @param {SoundGn} se_gn
   * @return {void}
   */
  const play = function(se_gn) {
    if(se_gn == null) return;

    fetchSound(se_gn).play();
  }
  .setAnno("non-headless");
  exports.play = play;


  /**
   * Variant of {@link play} for server side.
   * @param {SoundGn} se_gn
   * @param {number|unset} [vol]
   * @param {number|unset} [pitch]
   * @param {number|unset} [offPitch]
   * @return {void}
   */
  const play_server = function(se_gn, vol, pitch, offPitch) {
    if(se_gn == null) return;
    if(vol == null) vol = 1.0;
    if(pitch == null) pitch = 1.0;
    let pitch_fi = (offPitch == null) ? pitch : (pitch + Mathf.range(offPitch));

    Call.sound(fetchSound(se_gn), vol, pitch_fi, 1.0);
  }
  .setAnno("non-headless")
  .setAnno("server");
  exports.play_server = play_server;


  /**
   * Plays a sound at (x, y).
   * @param {number} x
   * @param {number} y
   * @param {SoundGn} se_gn
   * @param {number|unset} [vol]
   * @param {number|unset} [pitch]
   * @param {number|unset} [offPitch]
   * @return {void}
   */
  const playAt = function(x, y, se_gn, vol, pitch, offPitch) {
    if(se_gn == null) return;
    if(vol == null) vol = 1.0;
    if(pitch == null) pitch = 1.0;
    let pitch_fi = (offPitch == null) ? pitch : (pitch + Mathf.range(offPitch));

    fetchSound(se_gn).at(x, y, pitch_fi, vol);
  }
  .setAnno("non-headless");
  exports.playAt = playAt;


  /* <---------- effect ----------> */


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
    if(Vars.state.isPaused()) return;
    if(rot == null) rot = Mathf.random(360.0);
    if(color == null) color = Color.white;

    data == null ?
      eff.at(x, y, rot, color) :
      eff.at(x, y, rot, color, data);
  }
  .setAnno("non-headless");
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
    if(Vars.state.isPaused()) return;
    if(rot == null) rot = Mathf.random(360.0);
    if(color == null) color = Color.white;

    data == null ?
      Call.effect(eff, x, y, rot, color) :
      Call.effect(eff, x, y, rot, color, data);

    showAt(x, y, eff, rot, color, data);
  }
  .setAnno("non-headless");
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
    if(Vars.state.isPaused()) return;

    showAt(x + Mathf.range(rad), y + Mathf.range(rad), eff, rot, color, data);
  }
  .setAnno("non-headless");
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
    if(Vars.state.isPaused()) return;

    showAt_global(x + Mathf.range(rad), y + Mathf.range(rad), eff, rot, color, data);
  }
  .setAnno("non-headless");
  exports.showAround_global = showAround_global;


  /* <---------- special sounds ----------> */


  /**
   * Payload drop sound.
   * @param {number} x
   * @param {number} y
   * @param {string|Block|UnitType|null} ct_gn
   * @return {void}
   */
  const _s_payloadDrop = function(x, y, ct_gn) {
    let ct = MDL_content._ct(ct_gn, null, true);
    if(ct == null) return;

    playAt(
      x, y,
      ct instanceof Block ?
        ct.placeSound :
        ct.hitSize <= 12.0 ?
          Sounds.payloadDrop1 :
          ct.hitSize <= 20.0 ?
            Sounds.payloadDrop2 :
            Sounds.payloadDrop3,
      1.0, 1.0, 0.1,
    );
  }
  .setAnno("non-headless");
  exports._s_payloadDrop = _s_payloadDrop;


  /* <---------- special effects ----------> */


  /**
   * Regular shake effect.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [pow]
   * @param {number|unset} [dur]
   * @return {void}
   */
  const _e_shake = function(x, y, pow, dur) {
    if(Vars.state.isPaused()) return;
    if(pow == null) pow = 4.0;
    if(dur == null) dur = 60.0;
    if(pow < 0.0001 || dur < 0.0001) return;

    Effect.shake(pow, dur, x, y);
  }
  .setAnno("non-headless");
  exports._e_shake = _e_shake;


  /**
   * Floor dust.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @param {number|unset} [repeat]
   * @return {void}
   */
  const _e_dust = function(x, y, rad, repeat) {
    if(Vars.state.isPaused()) return;
    if(rad == null) rad = 8.0;
    if(repeat == null) repeat = 1;

    let x_i, y_i;
    (repeat)._it(i => {
      x_i = x + Mathf.range(rad);
      y_i = y + Mathf.range(rad);
      Effect.floorDust(x_i, y_i, 8.0);
    });
  }
  .setAnno("non-headless");
  exports._e_dust = _e_dust;


  /**
   * Click effect.
   * @param {number} x
   * @param {number} y
   * @param {Color|unset} [color]
   * @return {void}
   */
  const _e_click = function thisFun(x, y, color) {
    if(Vars.state.isPaused()) return;
    if(color == null) color = Pal.accent;

    showAt(x, y, thisFun.eff, 0.0, color);
  }
  .setProp({
    eff: TP_effect._circleWave({
      size_f: 2.0,
      rad: 6.0,
      scl: 0.75,
    }),
  })
  .setAnno("non-headless");
  exports._e_click = _e_click;


  /**
   * Colored circle spark effects.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @param {Color|unset} [color]
   * @return {void}
   */
  const _e_colorDust = function thisFun(x, y, rad, color) {
    if(Vars.state.isPaused()) return;
    if(rad == null) rad = 20.0;
    if(color == null) color = Color.white;

    showAt(x, y, thisFun.eff, rad, color);
  }
  .setProp({
    eff: (function() {
      const tmp = new Effect(80.0, eff => {
        let
          frac1 = Interp.pow10Out.apply(Interp.pow10Out.apply(eff.fin())),
          frac2 = 1.0 - Interp.pow2In.apply(eff.fin());

        Draw.color(eff.color);
        Angles.randLenVectors(eff.id, 18, eff.finpow() * eff.rotation, (x, y) => {
          Fill.circle(eff.x + x * frac1, eff.y + y * frac1, frac2 * 3.5);
        });
        Draw.color(Tmp.c1.set(eff.color).mul(1.2));
        Angles.randLenVectors(eff.id + 11, 14, eff.finpow() * eff.rotation * 0.9, (x, y) => {
          Fill.circle(eff.x + x * frac1, eff.y + y * frac1, frac2 * 3.0);
        });
        Draw.color(Tmp.c1.set(eff.color).mul(1.35));
        Angles.randLenVectors(eff.id + 22, 10, eff.finpow() * eff.rotation * 0.85, (x, y) => {
          Fill.circle(eff.x + x * frac1, eff.y + y * frac1, frac2 * 2.5);
        });
      });
      tmp.layer = VAR.lay_effFlr - 0.1;

      return tmp;
    })(),
  })
  .setAnno("non-headless");
  exports._e_colorDust = _e_colorDust;


  /**
   * Triangles that move towards the nearest core.
   * @param {number} x
   * @param {number} y
   * @param {Team|unset} [team]
   * @param {number|unset} [pad] - Distance between center and actual starting position.
   * @param {number|unset} [rad] - Length of path.
   * @return {void}
   */
  const _e_coreSignal = function thisFun(x, y, team, pad, rad) {
    if(Vars.state.isPaused() || team == null) return;
    let b = Vars.state.teams.closestCore(x, y, team);
    if(b == null) return;
    if(pad == null) pad = 0.0;
    if(rad == null) rad = 120.0;

    showAt(x, y, thisFun.eff, rad, team.color, [b, pad, Math.random() > 0.5]);
  }
  .setProp({
    eff: new Effect(280.0, eff => {
      let
        ang = Mathf.angle(eff.data[0].x - eff.x, eff.data[0].y - eff.y),
        size = 24.0 - 18.0 * Interp.pow2Out.apply(1.0 - eff.fout());

      Draw.color(eff.color, Interp.pow2In.apply(1.0 - eff.fin()));
      Draw.rect(
        "lovec-efr-triangle-hollow",
        eff.x + eff.rotation * Mathf.cosDeg(ang) * eff.fin() + eff.data[1] * Mathf.cosDeg(ang),
        eff.y + eff.rotation * Mathf.sinDeg(ang) * eff.fin() + eff.data[1] * Mathf.sinDeg(ang),
        size,
        size,
        ang + 90.0 + 640.0 * eff.fin() * (eff.data[2] ? -1.0 : 1.0));
      Draw.reset();
    }),
  })
  .setAnno("non-headless");
  exports._e_coreSignal = _e_coreSignal;


  /**
   * Ripple effect on liquid floor.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @param {Color|unset} [color]
   * @return {void}
   */
  const _e_ripple = function thisFun(x, y, rad, color) {
    if(Vars.state.isPaused()) return;
    if(rad == null) rad = 18.0;
    if(color == null) {
      let t = Vars.world.tileWorld(x, y);
      color = t == null ? Color.white : t.getFloorColor();
    };

    showAt(x, y, thisFun.eff, rad, color);
  }
  .setProp({
    eff: (function() {
      const tmp = new Effect(30.0, eff => {
        eff.lifetime = 30.0 * eff.rotation * 0.25;

        Draw.color(Tmp.c1.set(eff.color).mul(1.5));
        Lines.stroke(eff.fout() * 1.4);
        Lines.circle(eff.x, eff.y, eff.fin() * eff.rotation);
        Draw.reset();
      });
      tmp.layer = Layer.debris - 0.0001;

      return tmp;
    })(),
  })
  .setAnno("non-headless");
  exports._e_ripple = _e_ripple;


  /**
   * Impact wave effect.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @return {void}
   */
  const _e_impactWave = function thisFun(x, y, rad) {
    if(Vars.state.isPaused()) return;

    thisFun.effs.forEachFast(eff => {
      showAt(x, y, eff, rad);
    });
  }
  .setProp({
    effs: [
      TP_effect._impactWave(),
      TP_effect._impactWave({scl: 1.2}),
      TP_effect._impactWave({scl: 1.5}),
      TP_effect._impactWave({scl: 1.9}),
    ],
  })
  .setAnno("non-headless");
  exports._e_impactWave = _e_impactWave;


  /**
   * Rotor wave effect for some units.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @return {void}
   */
  const _e_rotorWave = function thisFun(x, y, rad) {
    if(Vars.state.isPaused()) return;

    showAt(x, y, thisFun.eff, rad);
  }
  .setProp({
    eff: (function() {
      const tmp = new Effect(20.0, eff => {
        eff.lifetime = 20.0 * Math.pow(eff.rotation * 0.025, 0.5);

        Draw.color(_e_rotorWave.effColor1, _e_rotorWave.effColor2, eff.fin());
        Lines.stroke(2.0);
        Lines.circle(eff.x, eff.y, eff.rotation * eff.fin());
        Draw.reset();
      });
      tmp.layer = VAR.lay_effFlr;

      return tmp;
    })(),
    effColor1: VAR.color_rotorWhite,
    effColor2: VAR.color_whiteClear,
  })
  .setAnno("non-headless");
  exports._e_rotorWave = _e_rotorWave;


  /**
   * Liquid corrosion effect.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [size]
   * @param {Color|unset} [color]
   * @param {boolean|unset} [isClogging]
   * @return {void}
   */
  const _e_corrosion = function thisFun(x, y, size, color, isClogging) {
    if(Vars.state.isPaused()) return;
    if(size == null) size = 1;
    if(color == null) color = Color.white;

    showAround(x, y, thisFun.eff, size * Vars.tilesize * 0.5, null, color, tryVal(isClogging, false));
  }
  .setProp({
    eff: new Effect(120.0, eff => {
      Draw.z(VAR.lay_effBase);
      Draw.color(eff.color);
      !eff.data ?
        Fill.circle(eff.x, eff.y, 0.8 * Interp.pow5Out.apply(1.0 - eff.fin())) :
        Draw.rect(
          "lovec-efr-glob", eff.x, eff.y,
          5.0 * Interp.pow5Out.apply(1.0 - eff.fin()),
          5.0 * Interp.pow5Out.apply(1.0 - eff.fin()),
          eff.rotation,
        );
    }),
  })
  .setAnno("non-headless");
  exports._e_corrosion = _e_corrosion;


  /**
   * Creates remains of a unit or building.
   * @param {number} x
   * @param {number} y
   * @param {Building|Unit|Block|UnitType|null} e0etp
   * @param {Team|unset} [team]
   * @param {boolean|unset} [isPermanent] - If true, the remains won't despawn regardless of settings.
   * @param {boolean|unset} [forceHot] - If true, the remains will be heated regardless of tile and status effect.
   * @return {void}
   */
  const _e_remains = function thisFun(x, y, e0etp, team, isPermanent, forceHot) {
    if(e0etp == null) return;
    if(team == null) team = Team.sharded;
    let e = (e0etp instanceof Unit) ? e0etp : (e0etp instanceof Building ? e0etp : null);
    let etp = (e0etp instanceof Unit) ? e0etp.type : (e0etp instanceof Building ? e0etp.block : e0etp);
    if(etp instanceof Block && thisFun.shader == null) return;
    let t = Vars.world.tileWorld(x, y);
    if(t == null || !t.floor().canShadow) return;

    let
      tint = null,
      a = 1.0,
      z = etp instanceof Block ?
        VAR.lay_buildingRemains :
        VAR.lay_unitRemains,
      inLiq = false,
      shouldFloat = false;
    if((function () {
      if(MDL_pos._tsRect(t, 1, 1, thisFun.tmpTs).some(ot => !ot.floor().isLiquid)) return false;
      if(etp instanceof Block) {
        return true;
      } else {
        if(t.build != null || (t.solid() && !(t.block() instanceof TreeBlock))) return false;
      };
      return true;
    })()) {
      inLiq = true;
      if(!(etp instanceof Block) && MDL_entity._hitSize(etp) < 17.5001) {
        shouldFloat = true
      } else {
        let liq = t.floor().liquidDrop;
        if(liq != null) {
          tint = liq.color;
        } else {
          tint = t.getFloorColor();
        };
        a = 0.5;
        z = etp instanceof Block ? VAR.lay_buildingRemainsDrown : VAR.lay_unitRemainsDrown;
      };
    };

    const remains = extend(Decal, {


      lifetime: isPermanent ? Number.n8 : PARAM.unitRemainsLifetime,
      offTime: Mathf.random(1200.0),
      x: x, y: y,
      hitSize: MDL_entity._hitSize(etp),
      rotation: etp instanceof Block ? (Mathf.random(90.0) - 45.0) : Mathf.random(360.0),
      team: team,
      color: VAR.color_darkMix,
      tint: tint,
      a: a,
      aSha: etp instanceof Block ? 0.3 : 0.5,
      z: z,
      off: Mathf.random(VAR.blk_remainsOffCap),
      region: etp instanceof Block ? MDL_texture._regBlk(etp) : Core.atlas.find(etp.name + "-full", Core.atlas.find(etp.name + "-icon", etp.region)),
      cellRegion: etp instanceof Block ? null : Core.atlas.find(etp.name + "-cell-full", etp.cellRegion),
      softShadowRegion: etp instanceof Block ? null : etp.softShadowRegion,
      shouldFloat: shouldFloat,
      isHot: forceHot ? true : MDL_cond._isHot(e, t),
      shouldFadeHeat: forceHot ? false : (!MDL_cond._isHotStatus(t.floor().status) || !inLiq),


      draw() {
        let
          x = this.x + (!this.shouldFloat ? 0.0 : Math.sin((Time.time + this.offTime) * 0.01) * 0.35 * Vars.tilesize),
          y = this.y + (!this.shouldFloat ? 0.0 : Math.cos((Time.time + this.offTime) * 0.05 + 32.0) * 0.15 * Vars.tilesize);

        if(this.shouldFloat && Mathf.chanceDelta(0.01)) _e_ripple(x, y, this.hitSize * 1.2);

        processZ(this.z - 1.0);

        Draw.color(Color.black, this.aSha);
        this.softShadowRegion == null ?
          Draw.rect("square-shadow", x, y, this.hitSize * 2.1, this.hitSize * 2.1, this.rotation) :
          Draw.rect(this.softShadowRegion, x, y, this.region.width * 0.4, this.region.width * 0.4, this.rotation);
        if(etp instanceof Block) {
          Draw.draw(this.z, () => {
            // Use a shader to create incomplete debris
            thisFun.shader.delegee.region = this.region;
            thisFun.shader.delegee.mulColor.set(this.color);
            thisFun.shader.delegee.a = this.a - Mathf.curve(this.fin(), 0.98) * this.a;
            thisFun.shader.delegee.off = this.off;
            thisFun.shader.delegee.offCap = VAR.blk_remainsOffCap;
            Draw.shader(thisFun.shader);
            Draw.rect(this.region, x, y, this.rotation);
            Draw.shader();
            Draw.flush();
          });
        } else {
          Draw.z(this.z);
          this.tint != null ?
            Draw.tint(this.color, this.tint, 0.5) :
            !this.isHot ?
              Draw.color(this.color) :
              Draw.color(Color.valueOf(Tmp.c1, "ea8878").lerp(this.color, Interp.pow2Out.apply(this.fin())), this.a - Mathf.curve(this.fin(), 0.98) * this.a);
          Draw.rect(this.region, x, y, this.rotation);
          if(this.cellRegion != null) {
            Draw.color(Tmp.c2.set(this.color).mul(this.team.color), this.a - Mathf.curve(this.fin(), 0.98) * this.a);
            Draw.rect(this.cellRegion, x, y, this.rotation);
          };
          Draw.color();
          if(this.isHot) {
            Draw.blend(Blending.additive);
            Draw.mixcol(VAR.color_heatMix, 1.0);
            Draw.alpha((0.5 + Mathf.absin(10.0, 0.5)) * !this.isHot ? 0.0 : !this.shouldFadeHeat ? (0.5 - Mathf.curve(this.fin(), 0.98) * 0.5) : (0.5 - Interp.pow2Out.apply(this.fin()) * 0.5));
            Draw.rect(this.region, x, y, this.rotation);
            Draw.blend();
          };
        };
        Draw.reset();

        processZ();
      },


    });
    remains.add();
  }
  .setProp({
    shader: fetchShader("shader0reg-debris"),
    tmpTs: [],
  })
  .setAnno("non-headless");
  exports._e_remains = _e_remains;


  /**
   * Creates flash effect over an entity.
   * @param {Building|Unit} e
   * @param {Color|unset} [color]
   * @return {void}
   */
  const _e_flash = function thisFun(e, color) {
    if(Vars.state.isPaused() || e == null) return;
    if(color == null) color = Color.white;

    if(e instanceof Building) {
      let reg = !(e.block instanceof BaseTurret) ?
        e.block.fullIcon :
        tryVal(MDL_texture._regTurBase(e.block), e.block.region);
      if(reg != null) {
        showAt(MDL_ui._cameraX(), MDL_ui._cameraY(), thisFun.eff, 0.0, color, [reg, e]);
      };
    } else {
      color.equals(Pal.heal) ?
        unit.healTime = 1.0 :
        unit.hitTime = 1.0;
    };
  }
  .setProp({
    eff: new Effect(20.0, eff => {
      MDL_draw._reg_normal(
        eff.data[1].x, eff.data[1].y,
        eff.data[0], eff.data[1].drawrot(), 1.0, eff.color,
        eff.color.a * eff.fout(),
        Layer.effect + VAR.lay_offDrawOver,
        1.0,
      );
    }),
  })
  .setAnno("non-headless");
  exports._e_flash = _e_flash;


  /**
   * Creates a texture region or icon that fades out.
   * @param {number} x
   * @param {number} y
   * @param {TextureRegion|Icon|null} reg0icon
   * @param {Color|unset} [color]
   * @param {number|unset} [scl]
   * @return {void}
   */
  const _e_regFade = function thisFun(x, y, reg0icon, color, scl) {
    if(Vars.state.isPaused() || reg0icon == null) return;
    if(color == null) color = Color.white;
    if(scl == null) scl = 1.0;

    showAt(x, y, thisFun.eff, scl, color, reg0icon);
  }
  .setProp({
    eff: new Effect(40.0, eff => {
      eff.lifetime = 40.0 * eff.rotation;

      eff.data instanceof TextureRegion ?
        MDL_draw._reg_normal(eff.x, eff.y, eff.data, 0.0, 1.0, eff.color, eff.fout() * eff.color.a, Layer.effect + VAR.lay_offDrawOver) :
        MDL_draw._reg_icon(eff.x, eff.y, eff.data, 0.0, 1.0, eff.color, eff.fout() * eff.color.a);
    }),
  })
  .setAnno("non-headless");
  exports._e_regFade = _e_regFade;


  /**
   * Damage display effect.
   * @param {number} x
   * @param {number} y
   * @param {number} dmg
   * @param {Team|unset} [team]
   * @param {string|unset} [mode] - Determines format of damage text, see {@link CLS_damageTextMode}.
   * @return {void}
   */
  const _e_dmg = function thisFun(x, y, dmg, team, mode) {
    if(!PARAM.displayDamage || dmg < 0.0001 || dmg < PARAM.damageDisplayThreshold) return;
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
  .setAnno("non-headless");
  exports._e_dmg = _e_dmg;


  /**
   * Line effect from (x, y) or an entity to another entity.
   * @param {number} x
   * @param {number} y
   * @param {PoscGn|null} e_f
   * @param {PoscGn|null} e_t
   * @param {Color|unset} [color]
   * @param {number|unset} [strokeScl]
   * @return {void}
   */
  const _e_line = function thisFun(x, y, e_f, e_t, color, strokeScl) {
    if(Vars.state.isPaused() || e_t == null) return;
    if(color == null) color = Color.white;
    if(strokeScl == null) strokeScl = 1.0;

    showAt(x, y, thisFun.eff, strokeScl, color, [e_f, e_t]);
  }
  .setProp({
    eff: new Effect(40.0, eff => {
      Lines.stroke(2.0 * eff.rotation, eff.color);
      Draw.alpha(Interp.pow2In.apply(eff.fout()) * eff.color.a);
      Lines.line(
        eff.data[0] == null ? eff.x : eff.data[0].x,
        eff.data[0] == null ? eff.y : eff.data[0].y,
        eff.data[1].x, eff.data[1].y,
      );
      Draw.reset();
    }),
  })
  .setAnno("non-headless");
  exports._e_line = _e_line;


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
  const _e_itemTransfer = function(x, y, posIns, color, repeat, isGlobal) {
    if(Vars.state.isPaused() || posIns == null) return;
    if(color == null) color = Pal.accent;
    if(repeat == null) repeat = 3;

    for(let i = 0; i < repeat; i++) {
      (isGlobal ? showAt_global : showAt)(x, y, Fx.itemTransfer, 0.0, color, posIns);
    };
  }
  .setAnno("non-headless");
  exports._e_itemTransfer = _e_itemTransfer;


  /**
   * Lightning effect.
   * @param {number} x
   * @param {number} y
   * @param {PoscGn|null} e
   * @param {Color|unset} [color]
   * @param {boolean|unset} [hasSound]
   * @return {void}
   */
  const _e_lightning = function(x, y, e, color, hasSound) {
    if(Vars.state.isPaused() || posIns == null) return;
    if(color == null) color = Pal.accent;

    showAt(x, y, Fx.chainLightning, 0.0, color, e);
    if(hasSound) playAt(x, y, Sounds.shootArc);
  }
  .setAnno("non-headless");
  exports._e_lightning = _e_lightning;


  /**
   * Chain lightning effect with multiple targets.
   * @param {number} x
   * @param {number} y
   * @param {Array<PoscGn>} es
   * @param {Color|unset} [color]
   * @param {boolean|unset} [hasSound]
   * @return {void}
   */
  const _e_chainLightning = function thisFun(x, y, es, color, hasSound) {
    if(Vars.state.isPaused() || es.length === 0) return;

    let i = 0, iCap = es.iCap();
    let e1, e2;
    while(i < iCap) {
      e1 = (i === 0) ? thisFun.tmpVec.set(x, y) : es[i - 1];
      e2 = es[i];
      _e_lightning(e1.x, e1.y, e2, color);
      i++;
    };

    if(hasSound) playAt(x, y, Sounds.shootArc);
  }
  .setProp({
    tmpVec: new Vec2(),
  })
  .setAnno("non-headless");
  exports._e_chainLightning = _e_chainLightning;


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
  const _e_laser = function thisFun(x, y, e_f, e_t, color, strokeScl, hasLight) {
    if(Vars.state.isPaused() || e == null) return;
    if(color == null) color = Pal.accent;

    showAt(x, y, thisFun.eff, tryVal(strokeScl, 1.0), color, [e_f, e_t, tryVal(hasLight, false)]);
  }
  .setProp({
    eff: new Effect(30.0, eff => {
      MDL_draw._d_laser(
        eff.data[0] == null ? eff.x : eff.data[0].x,
        eff.data[0] == null ? eff.y : eff.data[0].y,
        eff.data[1].x,
        eff.data[1].y,
        eff.rotation * Interp.pow2Out.apply(1.0 - eff.fin()),
        eff.color,
        Color.white,
        1.0,
        eff.data[2],
      );
    }),
  })
  .setAnno("non-headless");
  exports._e_laser = _e_laser;


  /**
   * Point laser effect.
   * @param {number} x
   * @param {number} y
   * @param {PoscGn|null} e
   * @param {Color|unset} [color]
   * @param {SoundGn|unset} [se_gn]
   * @return {void}
   */
  const _e_pointLaser = function thisFun(x, y, e, color, se_gn) {
    if(Vars.state.isPaused() || e == null) return;
    if(color == null) color = Pal.remove;
    let tup = [e.x, e.y];

    showAt(x, y, thisFun.eff1, 0.0, color, tup);
    showAt(x, y, thisFun.eff2, 0.0, color, tup);
    showAt(x, y, thisFun.eff2, 0.0, color);
    if(se_gn != null) playAt(x, y, se_gn, 1.0, 1.0, 0.05);
  }
  .setProp({
    eff1: new Effect(30.0, 300.0, eff => {
      Draw.color(eff.color, eff.fout());
      Lines.stroke(2.0);
      Lines.line(eff.x, eff.y, eff.data[0], eff.data[1]);
      Drawf.light(eff.x, eff.y, eff.data[0], eff.data[1], 20.0, eff.color, 0.65 * eff.fout());
      Draw.reset();
    }),
    eff2: new Effect(30.0, eff => {
      Draw.color(eff.color, eff.fout());
      eff.data == null ?
        Fill.circle(eff.x, eff.y, 2.0 + eff.fout()) :
        Fill.circle(eff.data[0], eff.data[1], 2.0 + eff.fout());
    }),
  })
  .setAnno("non-headless");
  exports._e_pointLaser = _e_pointLaser;


  /**
   * Payload deposit effect.
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {ContentGn} ct_gn
   * @return {void}
   */
  const _e_payloadDeposit = function(x1, y1, x2, y2, ct_gn) {
    let ct = MDL_content._ct(ct_gn, null, true);
    if(ct == null) return;

    Fx.payloadDeposit.at(x1, y1, Angles.angle(x1, y1, x2, y2), new UnitAssembler.YeetData(new Vec2(x2, y2), ct));
  }
  .setAnno("non-headless");
  exports._e_payloadDeposit = _e_payloadDeposit;
