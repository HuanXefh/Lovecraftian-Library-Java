/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods to create effects.
   * Unlike {TP_effect} which provides effects, this module is only meant to spawn pre-defined effects.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const EFF = require("lovec/glb/GLB_eff");
  const PARAM = require("lovec/glb/GLB_param");
  const VAR = require("lovec/glb/GLB_var");


  const MDL_color = require("lovec/mdl/MDL_color");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_entity = require("lovec/mdl/MDL_entity");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_texture = require("lovec/mdl/MDL_texture");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  const TP_effect = require("lovec/tp/TP_effect");


  /* <---------- base ----------> */


  const _p_frac = function(p, frac) {
    return Math.min(p * frac, VAR.p_effPCap);
  };
  exports._p_frac = _p_frac;


  /* <---------- sound ----------> */


  const play = function(se_gn) {
    if(se_gn == null) return;

    fetchSound(se_gn).play();
  }
  .setAnno("non-headless");
  exports.play = play;


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


  const showAt = function(x, y, eff, rot, color, data) {
    if(Vars.state.isPaused() || eff == null) return;
    if(rot == null) rot = Mathf.random(360.0);
    if(color == null) color = Color.white;

    data == null ?
      eff.at(x, y, rot, color) :
      eff.at(x, y, rot, color, data);
  }
  .setAnno("non-headless");
  exports.showAt = showAt;


  const showAt_global = function(x, y, eff, rot, color, data) {
    if(Vars.state.isPaused() || eff == null) return;
    if(rot == null) rot = Mathf.random(360.0);
    if(color == null) color = Color.white;

    data == null ?
      Call.effect(eff, x, y, rot, color) :
      Call.effect(eff, x, y, rot, color, data);

    showAt(x, y, eff, rot, color, data);
  }
  .setAnno("non-headless");
  exports.showAt_global = showAt_global;


  const showAround = function(x, y, eff, rad, rot, color, data) {
    if(Vars.state.isPaused() || eff == null) return;

    showAt(x + Mathf.range(rad), y + Mathf.range(rad), eff, rot, color, data);
  }
  .setAnno("non-headless");
  exports.showAround = showAround;


  const showAround_global = function(x, y, eff, rad, rot, color, data) {
    if(Vars.state.isPaused() || eff == null) return;

    showAt_global(x + Mathf.range(rad), y + Mathf.range(rad), eff, rot, color, data);
  }
  .setAnno("non-headless");
  exports.showAround_global = showAround_global;


  /* <---------- special effects ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a regular shake effect.
   * ---------------------------------------- */
  const showAt_shake = function(x, y, pow, dur) {
    if(Vars.state.isPaused()) return;
    if(pow == null) pow = 4.0;
    if(dur == null) dur = 60.0;
    if(pow < 0.0001 || dur < 0.0001) return;

    Effect.shake(pow, dur, x, y);
  }
  .setAnno("non-headless");
  exports.showAt_shake = showAt_shake;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates floor dust effects in a range.
   * ---------------------------------------- */
  const showAt_dust = function(x, y, rad, repeat) {
    if(Vars.state.isPaused()) return;
    if(rad == null) rad = 8.0;
    if(repeat == null) repeat = 1;

    let x_i, y_i;
    (repeat)._it(1, i => {
      x_i = x + Mathf.range(rad);
      y_i = y + Mathf.range(rad);
      Effect.floorDust(x_i, y_i, 8.0);
    });
  }
  .setAnno("non-headless");
  exports.showAt_dust = showAt_dust;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates an effect that shows click.
   * ---------------------------------------- */
  const showAt_click = function thisFun(x, y, color_gn) {
    if(Vars.state.isPaused()) return;
    if(color_gn == null) color_gn = Pal.accent;

    showAt(x, y, thisFun.eff, 0.0, MDL_color._color(color_gn));
  }
  .setProp({
    eff: TP_effect._circleWave({
      size_f: 2.0,
      rad: 6.0,
      scl: 0.75,
    }),
  })
  .setAnno("non-headless");
  exports.showAt_click = showAt_click;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates several circle spark effects.
   * ---------------------------------------- */
  const showAt_colorDust = function thisFun(x, y, rad, color_gn) {
    if(Vars.state.isPaused()) return;
    if(rad == null) rad = 20.0;

    showAt(x, y, thisFun.eff, rad, MDL_color._color(color_gn));
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
  exports.showAt_colorDust = showAt_colorDust;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a triangular effect that moves towards the nearest core.
   * Mostly used by CEP consumer blocks.
   * ---------------------------------------- */
  const showAt_coreSignal = function thisFun(x, y, team, pad, rad) {
    if(Vars.state.isPaused() || team == null) return;
    if(team == null) return;
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
  exports.showAt_coreSignal = showAt_coreSignal;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a ripple effect.
   * ---------------------------------------- */
  const showAt_ripple = function thisFun(x, y, rad, color_gn) {
    if(Vars.state.isPaused()) return;
    if(rad == null) rad = 18.0;
    if(color_gn == null) color_gn = Vars.world.tileWorld(x, y);

    showAt(x, y, thisFun.eff, rad, MDL_color._color(color_gn));
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
  exports.showAt_ripple = showAt_ripple;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates impact wave effect.
   * ---------------------------------------- */
  const showAt_impactWave = function thisFun(x, y, rad) {
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
  exports.showAt_impactWave = showAt_impactWave;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates rotor wave effect.
   * Used by rotor units.
   * ---------------------------------------- */
  const showAt_rotorWave = function thisFun(x, y, rad) {
    if(Vars.state.isPaused()) return;

    showAt(x, y, thisFun.eff, rad);
  }
  .setProp({
    eff: (function() {
      const tmp = new Effect(20.0, eff => {
        eff.lifetime = 20.0 * Math.pow(eff.rotation * 0.025, 0.5);

        Draw.color(showAt_rotorWave.effColor1, showAt_rotorWave.effColor2, eff.fin());
        Lines.stroke(2.0);
        Lines.circle(eff.x, eff.y, eff.rotation * eff.fin());
        Draw.reset();
      });
      tmp.layer = VAR.lay_effFlr;

      return tmp;
    })(),
    effColor1: Color.valueOf("ffffff30"),
    effColor2: Color.valueOf("ffffff00"),
  })
  .setAnno("non-headless");
  exports.showAt_rotorWave = showAt_rotorWave;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates liquid corrosion effect.
   * ---------------------------------------- */
  const showAt_corrosion = function thisFun(x, y, size, liqColor, isClogging) {
    if(Vars.state.isPaused()) return;
    if(size == null) size = 1;
    if(liqColor == null) liqColor = Color.white;

    showAround(x, y, thisFun.eff, size * Vars.tilesize * 0.5, null, liqColor, tryVal(isClogging, false));
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
  exports.showAt_corrosion = showAt_corrosion;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates remains of a unit or building.
   * ---------------------------------------- */
  const showAt_remains = function thisFun(x, y, e0etp, team, isPermanent, forceHot) {
    if(e0etp == null || team == null) return;
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
      color: Color.valueOf("606060"),
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
        if(this.shouldFloat && Mathf.chanceDelta(0.01)) showAt_ripple(x, y, this.hitSize * 1.2);

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
            Draw.mixcol(Color.valueOf(Tmp.c3, "ff3838"), 1.0);
            Draw.alpha((0.5 + Mathf.absin(10.0, 0.5)) * !this.isHot ? 0.0 : !this.shouldFadeHeat ? (0.5 - Mathf.curve(this.fin(), 0.98) * 0.5) : (0.5 - Interp.pow2Out.apply(this.fin()) * 0.5));
            Draw.rect(this.region, x, y, this.rotation);
            Draw.blend();
          };
        };
        Draw.reset();

        processZ(this.z - 1.0);
      },


    });
    remains.add();
  }
  .setProp({
    shader: fetchShader("shader0reg-debris"),
    tmpTs: [],
  })
  .setAnno("non-headless");
  exports.showAt_remains = showAt_remains;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a flash effect over an entity.
   * Color is only used for buildings, due to hard-coded {applyColor()}.
   * The only exception for unit is {Pal.heal}.
   * ---------------------------------------- */
  const showAt_flash = function thisFun(e, color_gn) {
    if(Vars.state.isPaused() || e == null) return;

    if(e instanceof Building) {
      let reg = !(e.block instanceof BaseTurret) ?
        e.block.fullIcon :
        tryVal(MDL_texture._regTurBase(e.block), e.block.region);
      if(reg != null) {
        showAt(MDL_ui._cameraX(), MDL_ui._cameraY(), thisFun.eff, 0.0, MDL_color._color(color_gn), [reg, e]);
      };
    } else {
      MDL_color._color(color_gn).equals(Pal.heal) ?
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
  exports.showAt_flash = showAt_flash;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a texture region or icon that fades out.
   * ---------------------------------------- */
  const showAt_regFade = function thisFun(x, y, reg0icon, color_gn, scl) {
    if(Vars.state.isPaused() || reg0icon == null) return;
    if(scl == null) scl = 1.0;

    showAt(x, y, thisFun.eff, scl, MDL_color._color(color_gn), reg0icon);
  }
  .setProp({
    eff: new Effect(40.0, eff => {
      eff.lifetime = 40.0 * eff.rotation;

      eff.data instanceof TextureRegion ?
        MDL_draw._reg_normal(eff.x, eff.y, eff.data, 0.0, 1.0, eff.color, eff.fout() * color.a, Layer.effect + VAR.lay_offDrawOver) :
        MDL_draw._reg_icon(eff.x, eff.y, eff.data, 0.0, 1.0, eff.color, eff.fout() * color.a);
    }),
  })
  .setAnno("non-headless");
  exports.showAt_regFade = showAt_regFade;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a damage number effect.
   * Only works when damage display is enabled.
   * ---------------------------------------- */
  const showAt_dmg = function thisFun(x, y, dmg, team, mode) {
    if(!PARAM.displayDamage || dmg == null || dmg < 0.0001 || dmg < PARAM.damageDisplayThreshold) return;
    if(mode == null) mode = "health";
    if(!mode.equalsAny(thisFun.modes)) return;
    if(team == null) team = Team.derelict;

    let color = null;
    let str = dmg > 9.9999 ? Strings.fixed(dmg, 0) : (dmg > 0.9999 ? Strings.fixed(dmg, 1) : Strings.fixed(dmg, 2));
    switch(mode) {
      case "health" :
        color = team === Team.derelict ? Color.white : team.color;
        break;
      case "shield" :
        color = Pal.techBlue;
        str = "<" + str + ">";
        break;
      case "heal" :
        color = Pal.heal;
        str = "+" + str;
        break;
      case "heat" :
        color = Color.orange;
        str = "^" + str;
        break;
    };
    if(color == null) return;
    let sizeScl = Math.max(Math.log((dmg + 10.0) / 10.0), 0.7);

    showAround(x, y, thisFun.eff, 8.0, dmg, color, [str, sizeScl]);
  }
  .setProp({
    modes: ["health", "shield", "heal", "heat"],
    eff: new Effect(40.0, eff => {
      MDL_draw._d_text(
        eff.x, eff.y,
        eff.data[0],
        eff.data[1] - Interp.pow3In.apply(eff.fin()) * eff.data[1],
        eff.color, Align.center, 0.0,
        8.0 * eff.fin(),
        Math.min(eff.rotation / 10000.0, 10.0),
        Fonts.def,
      );
    }),
  })
  .setAnno("non-headless");
  exports.showAt_dmg = showAt_dmg;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a line effect from (x, y) or {e0} to {e}.
   * ---------------------------------------- */
  const showBetween_line = function thisFun(x, y, e0, e, color_gn, strokeScl) {
    if(Vars.state.isPaused() || e == null) return;
    if(strokeScl == null) strokeScl = 1.0;

    showAt(x, y, thisFun.eff, strokeScl, MDL_color._color(color_gn), [e0, e]);
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
  exports.showBetween_line = showBetween_line;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a item transfer effect from (x, y) to {posIns}.
   * ---------------------------------------- */
  const showBetween_itemTransfer = function(x, y, posIns, color_gn, repeat, isGlobal) {
    if(Vars.state.isPaused() || posIns == null) return;
    if(color_gn == null) color_gn = Pal.accent;
    if(repeat == null) repeat = 3;

    for(let i = 0; i < repeat; i++) {
      (isGlobal ? showAt_global : showAt)(x, y, Fx.itemTransfer, 0.0, MDL_color._color(color_gn), posIns);
    };
  }
  .setAnno("non-headless");
  exports.showBetween_itemTransfer = showBetween_itemTransfer;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a chain lightning effect from (x, y) to {e}.
   * ---------------------------------------- */
  const showBetween_lightning = function(x, y, e, color_gn, hasSound) {
    if(Vars.state.isPaused() || posIns == null) return;
    if(color_gn == null) color_gn = Pal.accent;

    showAt(x, y, Fx.chainLightning, 0.0, MDL_color._color(color_gn), e);
    if(hasSound) playAt(x, y, Sounds.shootArc);
  }
  .setAnno("non-headless");
  exports.showBetween_lightning = showBetween_lightning;


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {showBetween_lightning} that is used for a list of entities.
   * ---------------------------------------- */
  const showAmong_lightning = function thisFun(x, y, es, color_gn, hasSound) {
    if(Vars.state.isPaused() || es == null || es.length === 0) return;

    let i = 0, iCap = es.iCap();
    let e1, e2;
    while(i < iCap) {
      e1 = (i === 0) ? thisFun.tmpVec.set(x, y) : es[i - 1];
      e2 = es[i];
      showBetween_lightning(e1.x, e1.y, e2, color_gn);
      i++;
    };

    if(hasSound) playAt(x, y, Sounds.shootArc);
  }
  .setProp({
    tmpVec: new Vec2(),
  })
  .setAnno("non-headless");
  exports.showAmong_lightning = showAmong_lightning;


  /* ----------------------------------------
   * NOTE:
   *
   * Line effect but replaced with laser.
   * ---------------------------------------- */
  const showBetween_laser = function thisFun(x, y, e0, e, color_gn, strokeScl, hasLight) {
    if(Vars.state.isPaused() || e == null) return;
    if(color_gn == null) color_gn = Pal.accent;

    showAt(x, y, thisFun.eff, tryVal(strokeScl, 1.0), MDL_color._color(color_gn), [e0, e, hasLight]);
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
  exports.showBetween_laser = showBetween_laser;


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a point laser effect, e.g. the one used in laser defense ability.
   * ---------------------------------------- */
  const showBetween_pointLaser = function thisFun(x, y, e, color_gn, se_gn) {
    if(Vars.state.isPaused() || e == null) return;
    if(color_gn == null) color_gn = Pal.remove;

    let color = MDL_color._color(color_gn);
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
  exports.showBetween_pointLaser = showBetween_pointLaser;


  /* ----------------------------------------
   * NOTE:
   *
   * Generalized vanilla payload deposit effect.
   * ---------------------------------------- */
  const showBetween_payloadDeposit = function(x1, y1, x2, y2, ct_gn) {
    let ct = MDL_content._ct(ct_gn, null, true);
    if(ct == null) return;

    Fx.payloadDeposit.at(x1, y1, Angles.angle(x1, y1, x2, y2), new UnitAssembler.YeetData(
      Tmp.v4.set(x2, y2).cpy(),
      ct,
    ));
  }
  .setAnno("non-headless");
  exports.showBetween_payloadDeposit = showBetween_payloadDeposit;
