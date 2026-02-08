/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods related to draw.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARAM = require("lovec/glb/GLB_param");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_color = require("lovec/mdl/MDL_color");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_entity = require("lovec/mdl/MDL_entity");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_texture = require("lovec/mdl/MDL_texture");


  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- component ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * {drawPlace} that every block should have.
   * Used if {blk.super$drawPlace} is not called.
   * ---------------------------------------- */
  const comp_drawPlace_baseBlock = function(blk, tx, ty, rot, valid) {
    blk.drawPotentialLinks(tx, ty);
    blk.drawOverlay(tx.toFCoord(blk.size), ty.toFCoord(blk.size), rot);
  };
  exports.comp_drawPlace_baseBlock = comp_drawPlace_baseBlock;


  /* ----------------------------------------
   * NOTE:
   *
   * {draw} that every building should have.
   * Used if {b.super$draw} is not called.
   * ---------------------------------------- */
  const comp_draw_baseBuilding = function(b) {
    b.block.variant === 0 || b.block.variantRegions == null ?
      Draw.rect(b.block.region, b.x, b.y, b.drawrot()) :
      Draw.rect(b.block.variantRegions[Mathf.randomSeed(b.tile.pos(), 0, Mathf.maxZero(b.block.variantRegions.length - 1))], b.x, b.y, b.drawrot());

    b.drawTeamTop();
  };
  exports.comp_draw_baseBuilding = comp_draw_baseBuilding;


  /* ----------------------------------------
   * NOTE:
   *
   * Shows extra information for a tile/building.
   * See {DB_misc.db["block"]["extraInfo"]}.
   * ---------------------------------------- */
  const comp_drawSelect_extraInfo = function thisFun(t) {
    if(t == null) return;
    if(t === thisFun.tmpT) {
      thisFun.tmpCd--;
    } else {
      thisFun.tmpT = t;
      thisFun.tmpCd = VAR.time_extraInfoCooldown;
      thisFun.tmpStr = null;
    };
    if(thisFun.tmpCd > 0.0) return;

    if(thisFun.tmpStr == null) {
      thisFun.tmpStr = "";
      let str1;
      DB_misc.db["block"]["extraInfo"].forEachFast(strGetter => {
        str1 = strGetter(t, t.build);
        if(str1 != null) {
          thisFun.tmpStr += str1 + "\n";
        };
      });
    };

    _d_text(
      (t.build == null ? t.worldx() : t.build.x) + (!PARAM.drawBuildStat || t.build == null ? 0.0 : ((VAR.r_offBuildStat + t.build.block.size * 0.5) * Vars.tilesize - 8.0)),
      (t.build == null ? t.worldy() : t.build.y) + (-(!PARAM.drawBuildStat || t.build == null ? 10.0 : ((VAR.r_offBuildStat + t.build.block.size * 0.5) * Vars.tilesize + 2.0))),
      thisFun.tmpStr, 0.8, Color.white, Align.left, 0.0, 0.0, 10.0, Fonts.def,
    );
  }.setProp({
    tmpT: null,
    tmpCd: 0.0,
    tmpStr: null,
  });
  exports.comp_drawSelect_extraInfo = comp_drawSelect_extraInfo;


  /* ----------------------------------------
   * NOTE:
   *
   * Shows how bridges are connected and the transport destination.
   * ---------------------------------------- */
  const comp_drawSelect_bridgeLine = function thisFun(b) {
    if(!PARAM.drawBridgeTransportLine) return;

    let tmpB = b, tmpOb, isFirst = true;
    if(b.block instanceof DirectionBridge) {
      tmpOb = b.findLink();
      thisFun.tmpBs.clear().push(tmpB);
      while(tmpOb != null) {
        if(!thisFun.tmpBs.includes(tmpOb)) {
          if(!isFirst) _d_conCircleArrow(tmpOb, tmpB);
          thisFun.tmpBs.push(tmpOb);
          tmpB = tmpOb;
          tmpOb = tmpB.findLink();
          isFirst = false;
        } else break;
      };
    } else if(b.block instanceof ItemBridge) {
      let ot = Vars.world.tile(b.link);
      tmpOb = null;
      thisFun.tmpBs.clear().push(tmpB);
      while(ot != null) {
        tmpOb = ot.build;
        if(tmpOb != null && tmpOb.block === b.block && !thisFun.tmpBs.includes(tmpOb)) {
          if(!isFirst) _d_conCircleArrow(tmpOb, tmpB);
          thisFun.tmpBs.push(tmpOb);
          tmpB = ot.build;
          // Idk why but on rare occasions this throws NullPointerException
          if(tmpB == null || tmpB.block !== b.block) break;
          ot = Vars.world.tile(tmpB.link);
          isFirst = false;
        } else break;
      };
    };
  }
  .setProp({
    tmpBs: [],
  });
  exports.comp_drawSelect_bridgeLine = comp_drawSelect_bridgeLine;


  /* <---------- region ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * {DrawRegion}.
   * ---------------------------------------- */
  const _reg_normal = function(
    x, y, reg,
    ang, regScl, color_gn, a, z,
    mixcolA
  ) {
    if(reg == null) return;
    if(ang == null) ang = 0.0;
    if(regScl == null) regScl = 1.0;
    if(a == null) a = 1.0;

    processZ(z);

    mixcolA != null ?
      Draw.mixcol(MDL_color._color(color_gn), mixcolA) :
      Draw.color(MDL_color._color(color_gn));
    Draw.alpha(a);
    Draw.rect(
      reg, x, y,
      reg.width * reg.scl() * regScl,
      reg.height * reg.scl() * regScl,
      ang,
    );
    Draw.reset();

    processZ(z);
  };
  exports._reg_normal = _reg_normal;


  /* ----------------------------------------
   * NOTE:
   *
   * {DrawSideRegion}.
   * ---------------------------------------- */
  const _reg_side = function(
    x, y, reg1, reg2,
    rot, color_gn, a, z
  ) {
    if(reg1 == null) return;
    if(reg2 == null) reg2 = reg1;
    if(rot == null) rot = 0;
    if(a == null) a = 1.0;

    processZ(z);

    Draw.color(MDL_color._color(color_gn), a);
    Draw.rect(rot < 2 ? reg1 : reg2, x, y, rot * 90.0);
    Draw.color();

    processZ(z);
  };
  exports._reg_side = _reg_side;


  /* ----------------------------------------
   * NOTE:
   *
   * Simply draws the edge sprite four times.
   * ---------------------------------------- */
  const _reg_edge = function(
    x, y, reg1, reg2,
    color_gn, a, z
  ) {
    if(reg1 == null) return;
    if(reg2 == null) reg2 = reg1;
    if(a == null) a = 1.0;

    processZ(z);

    Draw.color(MDL_color._color(color_gn), a);
    for(let i = 0; i < 4; i++) {
      Draw.rect(i < 2 ? reg1 : reg2, x, y, i * 90.0);
    };
    Draw.color();

    processZ(z);
  };
  exports._reg_edge = _reg_edge;


  /* ----------------------------------------
   * NOTE:
   *
   * A planar region that flips, that's it.
   * ---------------------------------------- */
  const _reg_flip = function(
    x, y, reg, flipAng,
    ang, regScl, color_gn, a, z
  ) {
    if(reg == null) return;
    if(regScl == null) regScl = 1.0;

    processZ(z);

    Draw.color(MDL_color._color(color_gn), tryVal(a, 1.0));
    Draw.rect(
      reg, x, y,
      reg.width * reg.scl() * regScl * Mathf.cos(Mathf.wrapAngleAroundZero(tryVal(flipAng, 0.0) * Mathf.degressToRadians)),
      reg.height * reg.scl() * regScl,
      tryVal(ang, 0.0),
    );
    Draw.color();

    processZ(z);
  };
  exports._reg_flip = _reg_flip;


  /* ----------------------------------------
   * NOTE:
   *
   * See {BLK_materialFloor}.
   * Randomly chooses one in {regs} to draw over the floor.
   * Higher {denom} means sparser distribution.
   * ---------------------------------------- */
  const _reg_randOv = function(
    t, regs,
    denom, off1, off2
  ) {
    if(t == null || regs == null || regs.length === 0) return;
    if(denom == null) denom = 80;
    if(off1 == null) off1 = 0;
    if(off2 == null) off2 = 0;
    if(Math.floor(Mathf.randomSeed(t.pos() + off1, 0, denom)) !== 0) return;

    _reg_normal(
      t.worldx(), t.worldy(),
      regs[Math.floor(Mathf.randomSeed(t.pos() + 114514 + off2, 0, regs.length))],
      0.0, 1.0, Color.white, 1.0, VAR.lay_randOv,
    );
  };
  exports._reg_randOv = _reg_randOv;


  /* ----------------------------------------
   * NOTE:
   *
   * {DrawFrame}.
   * ---------------------------------------- */
  const _reg_frame = function(
    x, y, regs, tProg, intv,
    ang, offInd
  ) {
    if(regs == null || regs.length === 0) return;

    Draw.rect(x, y, regs[Mathf.mod(Math.floor(tProg / intv) + tryVal(offInd, 0), regs.length)], tryVal(ang, 0.0));
  };
  exports._reg_frame = _reg_frame;


  /* ----------------------------------------
   * NOTE:
   *
   * {DrawFrame} but the previous frame gradually fades into the next frame.
   * ---------------------------------------- */
  const _reg_frameFade = function(
    x, y, regs, tProg, intv,
    ang, offInd
  ) {
    if(regs == null || regs.length === 0) return;
    let a = Mathf.mod(tProg, intv) / intv;

    Draw.alpha(1.0 - a);
    _reg_frame(x, y, regs, tProg, intv, ang, offInd);
    Draw.alpha(a);
    _reg_frame(x, y, regs, tProg, intv, ang, offInd + 1);
    Draw.color();
  };
  exports._reg_frameFade = _reg_frameFade;


  /* ----------------------------------------
   * NOTE:
   *
   * Draws something like {Icon.power}, not in a table.
   * ---------------------------------------- */
  const _reg_icon = function(
    x, y, icon,
    ang, regScl, color_gn, a
  ) {
    if(icon == null) return;
    if(ang == null) ang = 0.0;
    if(regScl == null) regScl = 1.0;
    if(a == null) a = 1.0;

    Draw.color(MDL_color._color(color_gn), a * 0.8);
    Draw.rect(icon.getRegion(), x, y, 6.0 * regScl, 6.0 * regScl);
    Draw.color();
  };
  exports._reg_icon = _reg_icon;


  /* ----------------------------------------
   * NOTE:
   *
   * Just a big red cross.
   * ---------------------------------------- */
  const _reg_redCross = function(x, y) {
    _reg_icon(x, y, Icon.cancel, 0.0, 1.0, Color.scarlet, 1.0);
  };
  exports._reg_redCross = _reg_redCross;


  /* ----------------------------------------
   * NOTE:
   *
   * Draws block status.
   * Rarely used unless something about consumer is screwed.
   * ---------------------------------------- */
  const _reg_blkStatus = function(
    x, y,
    size, color_gn, z
  ) {
    if(size == null) size = 1;
    if(z == null) z = Layer.power + 1.0;

    let
      mtp = size > 1 ? 1.0 : 0.64,
      x_fi = x + size * Vars.tilesize * 0.5 - Vars.tilesize * 0.5 * mtp,
      y_fi = y - size * Vars.tilesize * 0.5 + Vars.tilesize * 0.5 * mtp;

    processZ(z);

    Draw.color(Pal.gray);
    Fill.square(x_fi, y_fi, mtp * 2.5, 45.0);
    Draw.color(MDL_color._color(tryVal(color_gn, Color.green)));
    Fill.square(x_fi, y_fi, mtp * 1.5, 45.0);
    Draw.color();

    processZ(z);
  };
  exports._reg_blkStatus = _reg_blkStatus;


  /* ----------------------------------------
   * NOTE:
   *
   * {DrawFade}.
   * ---------------------------------------- */
  const _reg_fade = function(
    x, y, reg,
    ang, regScl, fadeScl, color_gn, a, z
  ) {
    if(reg == null) return;

    _reg_normal(
      x, y, reg,
      ang, regScl, color_gn,
      tryVal(a, 1.0) * Math.abs(Math.sin(Time.globalTime * 0.065 / tryVal(fadeScl, 1.0))),
      z,
    );
  };
  exports._reg_fade = _reg_fade;


  /* ----------------------------------------
   * NOTE:
   *
   * This fading region will become opaque when {frac} approaches 1.0 (not linearly).
   * Used for some very dangerous blocks like reactors.
   * ---------------------------------------- */
  const _reg_fadeAlert = function(
    x, y, frac, reg,
    ang, regScl, color_gn, a, z
  ) {
    if(reg == null) return;

    _reg_fade(
      x, y, reg,
      ang, regScl, 0.2, color_gn,
      1.0 - Math.pow(Mathf.clamp(tryVal(frac, 0.0)) - 1.0, 2),
      z,
    );
  };
  exports._reg_fadeAlert = _reg_fadeAlert;


  /* ----------------------------------------
   * NOTE:
   *
   * {DrawFade} controlled by total progress instead of {Time.globalTime}.
   * Can be used for accelerating flashers.
   * ---------------------------------------- */
  const _reg_fadeProg = function(
    x, y, fadeProg, reg,
    ang, regScl, fadeScl, color_gn, a, z
  ) {
    if(reg == null) return;

    _reg_normal(
      x, y, reg, ang, regScl, color_gn,
      tryVal(a, 1.0) * Math.abs(Math.sin(fadeProg * 0.15 / tryVal(fadeScl, 1.0))),
      z,
    );
  };
  exports._reg_fadeProg = _reg_fadeProg;


  /* ----------------------------------------
   * NOTE:
   *
   * Spin sprite I think.
   * {sideAmt} should match your sprite's symmetry.
   * ---------------------------------------- */
  const _reg_rot = function(
    x, y, rotProg, reg,
    ang, regScl, spd, sideAmt, color_gn, a, z
  ) {
    if(reg == null) return;
    if(ang == null) ang = 0.0;
    if(regScl == null) regScl = 1.0;
    if(rate == null) spd = 6.0;
    if(sideAmt == null) side = 4;
    if(a == null) a = 1.0;

    let
      w = reg.width * reg.scl() * regScl,
      h = reg.width * reg.scl() * regScl,
      ang_fd = 360.0 / sideAmt,
      ang_fi = Mathf.mod(rotProg * spd + ang, ang_fd);

    processZ(z);

    Draw.color(MDL_color._color(color_gn), a);
    if(spd < 0.0) {
      Draw.rect(reg, x, y, w, h, -ang_fi + ang_fd);
      Draw.alpha((1.0 - ang_fi / ang_fd) * a);
      Draw.rect(reg, x, y, w, h, -ang_fi);
    } else {
      Draw.rect(reg, x, y, w, h, ang_fi);
      Draw.alpha(ang_fi / ang_fd * a);
      Draw.rect(reg, x, y, w, h, ang_fi - ang_fd);
    };
    Draw.color();

    processZ(z);
  };
  exports._reg_rot = _reg_rot;


  /* ----------------------------------------
   * NOTE:
   *
   * Alternative for {DrawFlame}, where you don't have a fixed "-top" region.
   * Light is not included.
   * ---------------------------------------- */
  const _reg_flame = function(
    x, y, warmup, reg,
    rad, radIn, radScl, radMag, radInMag, color_gn, a, z
  ) {
    if(reg == null) return;
    if(rad == null) rad = 2.5;
    if(radIn == null) radIn = 1.5;
    if(radScl == null) radScl = 5.0;
    if(radMag == null) radMag = 2.0;
    if(radInMag == null) radInMag = 1.0;
    if(a == null) a = 1.0;
    if(z == null) z = Layer.block + 0.01;

    let
      param1 = 0.3,
      param2 = 0.06,
      param3 = Mathf.random(0.1),
      a_fi = a * ((1.0 - param1) + Mathf.absin(Time.globalTime, 8.0, param1) + Mathf.random(param2) - param2) * warmup,
      rad_fi = rad + Mathf.absin(Time.globalTime, radScl, radMag) + param3,
      radIn_fi = radIn + Mathf.absin(Time.globalTime, radScl, radInMag) + param3;

    processZ(z);

    Draw.alpha(a * warmup);
    Draw.rect(reg, x, y);
    Draw.alpha(a_fi);
    Draw.tint(MDL_color._color(tryVal(color_gn, "ffc999")));
    Fill.circle(x, y, rad_fi);
    Draw.color(1.0, 1.0, 1.0, a * warmup);
    Fill.circle(x, y, radIn_fi);
    Draw.reset();

    processZ(z);
  };
  exports._reg_flame = _reg_flame;


  /* ----------------------------------------
   * NOTE:
   *
   * {DrawWeave} but that texture region is gone.
   * ---------------------------------------- */
  const drawRegion_scan = function(
    x, y, scanProg, warmup,
    size, color_gn, a, z
  ) {
    if(size == null) size = 1;
    if(a == null) a = 1.0;

    processZ(z);

    Draw.color(MDL_color._color(tryVal(color_gn, Pal.accent)), warmup * a);
    Lines.lineAngleCenter(
      x + Mathf.sin(tProg, 6.0, size * Vars.tilesize / 3.0), y,
      90.0, size * Vars.tilesize / 2.0,
    );
    Draw.color();

    processZ(z);
  };
  exports.drawRegion_scan = drawRegion_scan;


  /* ----------------------------------------
   * NOTE:
   *
   * Draws sublimate torch, no flare.
   * ---------------------------------------- */
  const _reg_torch = function(
    x, y, warmup,
    len, w, size, ang, color1_gn, color2_gn, a, z
  ) {
    if(len == null) len = 0.0;
    if(len < 0.0001) return;
    if(w == null) w = 6.0;
    if(size == null) size = 0;
    if(ang == null) ang = 0.0;
    if(a == null) a = 1.0;
    if(z == null) z = VAR.lay_bulFlame;

    let
      color1 = MDL_color._color(tryVal(color1_gn, Pal.accent), Tmp.c2),
      color2 = MDL_color._color(tryVal(color2_gn, Color.white), Tmp.c3),
      offRad = size * Vars.tilesize * 0.5,
      x_fi = x + Mathf.cosDeg(ang) * offRad,
      y_fi = y + Mathf.sinDeg(ang) * offRad,
      len_f = len * 0.4 * warmup,
      len_t = len * warmup,
      w_f = w * 0.3 * warmup,
      w_t = w * 1.2 * warmup,
      lenScl = 1.0 + Mathf.sin(Time.globalTime, 1.0, 0.07);

    Drawf.light(x_fi, y_fi, x + Mathf.cosDeg(ang) * len * 1.2, y + Mathf.sinDeg(ang) * len * 1.2, w_t * 6.0, color1, a * 0.65);

    processZ(z);

    let frac_i, a_i, len_i, w_i;
    for(let i = 0; i < 4; i++) {
      frac_i = 1.0 - i / 3.0;
      a_i = Mathf.lerp(a, a * 0.4, frac_i);
      len_i = Mathf.lerp(len_f, len_t, frac_i);
      w_i = Mathf.lerp(w_f, w_t, frac_i)
      Draw.color(Tmp.c2.set(color2).lerp(color1, frac_i));
      Draw.alpha(a_i);
      Drawf.flame(x_fi, y_fi, 12, ang, len_i * lenScl, w_i, 0.2);
    };
    Draw.reset();

    processZ(z);
  };
  exports._reg_torch = _reg_torch;


  /* ----------------------------------------
   * NOTE:
   *
   * {DrawGlow}.
   * ---------------------------------------- */
  const _reg_glow = function(
    x, y, reg,
    ang, color_gn, a, pulse, pulseScl
  ) {
    if(reg == null) return;
    if(ang == null) ang = 0.0;
    if(a == null) a = 1.0;
    if(pulse == null) pulse = 0.3;
    if(pulseScl == null) pulseScl = 10.0;

    processZ(Layer.blockAdditive);

    Draw.color(MDL_color._color(tryVal(color_gn, "ff3838")));
    Draw.alpha(a * (1.0 - pulse + Mathf.absin(pulseScl, pulse)));
    Draw.blend(Blending.additive);
    Draw.rect(reg, x, y, ang);
    Draw.blend();
    Draw.color();

    processZ(Layer.blockAdditive);
  };
  exports._reg_glow = _reg_glow;


  /* ----------------------------------------
   * NOTE:
   *
   * {DrawHeat}.
   * ---------------------------------------- */
  const _reg_heat = function(
    x, y, heatFrac, reg,
    ang, size
  ) {
    _reg_glow(
      x, y,
      tryVal(reg, VARGEN.blockHeatRegs[tryVal(size, 1)]),
      ang, null,
      Mathf.clamp(tryVal(heatFrac, 1.0)),
    );
  };
  exports._reg_heat = _reg_heat;


  /* ----------------------------------------
   * NOTE:
   *
   * A transparent region that shrinks and expands with time.
   * Used to indicate placement.
   * ---------------------------------------- */
  const _reg_plan = function(
    x, y, reg,
    ang, regScl, color_gn, a
  ) {
    if(reg == null) return;
    if(ang == null) ang = 0.0;
    if(regScl == null) regScl = 1.0;
    if(a == null) a = 1.0;

    let
      regScl_fi = regScl * (0.825 + Math.sin(Time.globalTime * 0.65) * 0.075),
      w = reg.width * reg.scl() * regScl_fi,
      h = reg.height * reg.scl() * regScl_fi;

    processZ(Layer.power - 0.01);

    Draw.color(MDL_color._color(tryVal(color_gn, Color.white)));
    Draw.alpha(0.75 * a);
    Draw.rect(reg, x, y, ang, w, h);
    Draw.reset();

    processZ(Layer.power - 0.01);
  };
  exports._reg_plan = _reg_plan;


  const _reg_planPlace = function(blk, t, color_gn) {
    if(blk == null || t == null) return;

    _reg_plan(t.x.toFCoord(blk.size), t.y.toFCoord(blk.size), MDL_texture._regBlk(blk), color_gn);
  };
  exports._reg_planPlace = _reg_planPlace;


  /* ----------------------------------------
   * NOTE:
   *
   * Draws a resource icon like that shown for drills.
   * ---------------------------------------- */
  const _reg_rsIcon = function(
    x, y, rs_gn,
    size, z
  ) {
    let rs = MDL_content._ct(rs_gn, null, true);
    if(rs == null) return;
    if(size == null) size = 1;
    if(z == null) z = Layer.effect + VAR.lay_offDraw;

    let
      x_fi = x - Vars.tilesize * 0.5 * size,
      y_fi = y + Vars.tilesize * 0.5 * size,
      w = rs.uiIcon.width >= rs.uiIcon.height ? 8.0 : (rs.uiIcon.width / rs.uiIcon.height * 8.0),
      h = rs.uiIcon.height >= rs.uiIcon.width ? 8.0 : (rs.uiIcon.height / rs.uiIcon.width * 8.0);

    processZ(z);

    Draw.mixcol(Color.darkGray, 1.0);
    Draw.rect(rs.uiIcon, x_fi, y_fi - 1.0, w, h);
    Draw.mixcol();
    Draw.rect(rs.uiIcon, x_fi, y_fi, w, h);

    processZ(z);
  };
  exports._reg_rsIcon = _reg_rsIcon;


  /* ----------------------------------------
   * NOTE:
   *
   * Draws a resource icon.
   * ---------------------------------------- */
  const _reg_rs = function(
    x, y, rs_gn,
    size, z
  ) {
    let rs = MDL_content._ct(rs_gn, null, true);
    if(rs == null) return;
    if(size == null) size = 1;

    let
      w = size * Vars.tilesize * (rs.uiIcon.width > rs.uiIcon.height ? 1.0 : (rs.uiIcon.width / rs.uiIcon.height)),
      h = size * Vars.tilesize * (rs.uiIcon.height > rs.uiIcon.width ? 1.0 : (rs.uiIcon.height / rs.uiIcon.width));

    processZ(z);

    Draw.rect(rs.uiIcon, x, y, w, h);

    processZ(z);
  };
  exports._reg_rs = _reg_rs;


  /* ----------------------------------------
   * NOTE:
   *
   * Draws cicular light.
   * ---------------------------------------- */
  const _l_disk = function(
    x, y, warmup,
    rad, size, color_gn, a,
    sinScl, sinMag
  ) {
    Drawf.light(x, y, (tryVal(rad, 40.0) + Mathf.absin(tryVal(sinScl, 16.0), tryVal(sinMag, 6.0))) * tryVal(warmup, 0.0) * tryVal(size, 1), MDL_color._color(tryVal(color_gn, "ffc999")), tryVal(a, 0.65));
  };
  exports._l_disk = _l_disk;


  /* ----------------------------------------
   * NOTE:
   *
   * Draws conical light.
   * ---------------------------------------- */
  const _l_arc = function thisFun(
    x, y, warmup,
    rad, coneScl, ang, color_gn, a
  ) {
    if(Vars.renderer == null || thisFun.lightReg == null) return;
    if(rad == null) rad = 40.0;
    if(coneScl == null) coneScl = 1.0;
    if(ang == null) ang = 0.0;
    if(a == null) a = 0.65;

    let
      fBits = MDL_color._color(color_gn).toFloatBits(),
      w = rad * thisFun.lightReg.scl() * Vars.tilesize * coneScl,
      h = rad * thisFun.lightReg.scl() * Vars.tilesize;
    Vars.renderer.lights.add(() => {
      Draw.color(fBits);
      Draw.alpha(a);
      Draw.rect(thisFun.lightReg, x, y, w, h, ang);
      Draw.color();
    });
  }
  .setProp({
    lightReg: null,
  })
  .setAnno("init", function() {
    MDL_event._c_onLoad(() => {
      if(Vars.headless) return;
      this.lightReg = Core.atlas.find("lovec-efr-shadow-cone");
      if(!this.lightReg.found()) this.lightReg = null;
    });
  });
  exports._l_arc = _l_arc;


  /* <---------- line ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Vanilla way to draw lines..
   * ---------------------------------------- */
  const _d_line = function(
    x1, y1, x2, y2,
    color_gn, a, isDashed, z
  ) {
    if(a == null) a = 1.0;
    if(z == null) z = Layer.effect + VAR.lay_offDraw;

    processZ(z);

    Lines.stroke(3.0, Pal.gray);
    Draw.alpha(a);
    LCDraw.line(x1, y1, x2, y2, isDashed);
    Lines.stroke(1.0, MDL_color._color(tryVal(color_gn, Pal.accent)));
    Draw.alpha(a);
    LCDraw.line(x1, y1, x2, y2, isDashed);
    Draw.reset();

    processZ(z);
  };
  exports._d_line = _d_line;


  /* ----------------------------------------
   * NOTE:
   *
   * The line has no outline, and it fades in and out.
   * ---------------------------------------- */
  const _d_lineFlick = function(
    x1, y1, x2, y2,
    stroke, scl, color_gn, isDashed, z
  ) {
    if(stroke == null) stroke = 1.5;
    if(scl == null) scl = 1.0;
    if(z == null) z = Layer.effect + VAR.lay_offDraw;

    processZ(z);

    Lines.stroke(stroke, MDL_color._color(tryVal(color_gn, Pal.accent)));
    Draw.alpha(0.35 + Math.sin(Time.globalTime / scl / 15.0) * 0.25);
    LCDraw.line(x1, y1, x2, y2, isDashed);
    Draw.reset();

    processZ(z);
  };
  exports._d_lineFlick = _d_lineFlick;


  /* ----------------------------------------
   * NOTE:
   *
   * It's laser but not vanilla mining beam.
   * ---------------------------------------- */
  const _d_laser = function(
    x1, y1, x2, y2,
    strokeScl, color1_gn, color2_gn, a, hasLight, z
  ) {
    if(strokeScl == null) strokeScl = 1.0;
    if(z == null) z = Layer.effect + VAR.lay_offDraw;

    let strokeScl_fi = (1.0 + Math.sin(Time.globalTime * 0.065) * 0.2) * strokeScl;

    processZ(z);

    // Back
    Lines.stroke(3.0 * strokeScl_fi, MDL_color._color(tryVal(color1_gn, Pal.accent)));
    Draw.alpha(a == null ? Vars.renderer.laserOpacity : a);
    Lines.line(x1, y1, x2, y2);
    Fill.circle(x1, y1, 2.4 * strokeScl_fi);
    Fill.circle(x2, y2, 2.4 * strokeScl_fi);
    // Front
    Lines.stroke(1.0 * strokeScl_fi, MDL_color._color(tryVal(color2_gn, Color.white)));
    Draw.alpha(a == null ? Vars.renderer.laserOpacity : a);
    Lines.line(x1, y1, x2, y2);
    Fill.circle(x1, y1, 1.2 * strokeScl_fi);
    Fill.circle(x2, y2, 1.2 * strokeScl_fi);
    Draw.reset();

    processZ(z);

    if(hasLight) Drawf.light(x1, y1, x2, y2);
  };
  exports._d_laser = _d_laser;


  /* ----------------------------------------
   * NOTE:
   *
   * Vanilla laser, no color change so it's always yellow.
   * ---------------------------------------- */
  const _d_laserV = function(
    x1, y1, x2, y2,
    strokeScl
  ) {
    Drawf.laser(VARGEN.miscRegs.laserLine, VARGEN.miscRegs.laserEnd, x1, y1, x2, y2, tryVal(strokeScl, 1.0));
  };
  exports._d_laserV = _d_laserV;


  /* ----------------------------------------
   * NOTE:
   *
   * A line with a moving arrow.
   * ---------------------------------------- */
  const _d_arrowLine = function(
    x1, y1, x2, y2,
    strokeScl, scl, color_gn, a, z
  ) {
    if(strokeScl == null) strokeScl = 1.0;
    if(a == null) a = 1.0;
    if(z == null) z = Layer.effect + VAR.lay_offDraw;

    let
      frac1 = Time.globalTime / tryVal(scl, 1.0) % 100.0 / 100.0,
      frac2 = (frac1 + 0.5) % 1.0,
      ang = Mathf.angle(x2 - x1, y2 - y1);

    processZ(z);

    Lines.stroke(1.0 * strokeScl, MDL_color._color(tryVal(color_gn, Pal.accent)));
    Draw.alpha(a);
    LCDraw.line(x1, y1, x2, y2, false);
    Tmp.v1.set(x1, y1).lerp(x2, y2, frac1);
    processScl(strokeScl * Interp.pow2Out.apply(1.0 - frac1));
    Draw.rect(VARGEN.miscRegs.arrow, Tmp.v1.x, Tmp.v1.y, ang);
    Tmp.v1.set(x1, y1).lerp(x2, y2, frac2);
    processScl(strokeScl * Interp.pow2Out.apply(1.0 - frac2));
    Draw.rect(VARGEN.miscRegs.arrow, Tmp.v1.x, Tmp.v1.y, ang);
    processScl();
    Draw.reset();

    processZ(z);
  };
  exports._d_arrowLine = _d_arrowLine;


  /* ----------------------------------------
   * NOTE:
   *
   * Draws a wire that connects two positions.
   * ---------------------------------------- */
  const _d_wire = function(
    x1, y1, x2, y2,
    wireMat, strokeScl, glowA, z
  ) {
    if(wireMat == null) wireMat = "copper";
    if(strokeScl == null) strokeScl = 1.0;
    if(glowA == null) glowA = 1.0;
    if(z == null) z = Layer.power;

    let
      wireReg = VARGEN.wireRegs.regMap.get(wireMat),
      wireEndReg = VARGEN.wireRegs.endRegMap.get(wireMat);
    if(wireReg == null || wireEndReg == null) return;
    let
      ang = Mathf.angle(x2 - x1, y2 - y1),
      dx = Mathf.cosDeg(ang) * Draw.scl * 4.0 * strokeScl,
      dy = Mathf.sinDeg(ang) * Draw.scl * 4.0 * strokeScl;

    processZ(z);

    // Wire
    Draw.color(Color.white, 1.0);
    Draw.rect(wireEndReg, x1, y1, wireEndReg.width * wireEndReg.scl() * 0.5 * strokeScl, wireEndReg.height * wireEndReg.scl() * 0.5 * strokeScl, ang + 180.0);
    Draw.rect(wireEndReg, x2, y2, wireEndReg.width * wireEndReg.scl() * 0.5 * strokeScl, wireEndReg.height * wireEndReg.scl() * 0.5 * strokeScl, ang);
    Lines.stroke(6.0 * strokeScl);
    Lines.line(wireReg, x1 + dx, y1 + dy, x2 - dx, y2 - dy, false);
    // Shadow
    TMP_Z_A = Draw.z();
    Draw.z(Layer.block + 0.1);
    Lines.stroke(20.0 * strokeScl);
    Draw.alpha(0.3);
    Lines.line(VARGEN.wireRegs.shaReg, x1 + dx, y1 + dy, x2 - dx, y2 - dy, false);
    // Glow
    Draw.z(TMP_Z_A + 0.01);
    Lines.stroke(8.0 * strokeScl);
    Draw.alpha(glowA * (0.4 + Mathf.absin(15.0, 0.6)) * 0.25);
    Draw.blend(Blending.additive);
    Lines.line(VARGEN.wireRegs.glowReg, x1 + dx, y1 + dy, x2 - dx, y2 - dy, false);
    Draw.blend();
    Draw.reset();

    processZ(z);
  };
  exports._d_wire = _d_wire;


  /* <---------- rect ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Ordinary rectangular range indicator.
   * {2 * r + size} is the total width in blocks.
   * ---------------------------------------- */
  const _d_rect = function(
    x, y,
    r, size, color_gn, a, isDashed, z
  ) {
    if(r == null) r = 0;
    if(size == null) size = 1;
    if(a == null) a = 1.0;
    if(z == null) z = Layer.effect + VAR.lay_offDraw;

    processZ(z);

    Lines.stroke(3.0, Pal.gray);
    Draw.alpha(a);
    LCDraw.rect(x, y, r, size, isDashed);
    Lines.stroke(1.0, MDL_color._color(tryVal(color_gn, Pal.accent)));
    Draw.alpha(a);
    LCDraw.rect(x, y, r, size, isDashed);
    Draw.reset();

    processZ(z);
  };
  exports._d_rect = _d_rect;


  const _d_rectPlace = function(blk, tx, ty, r, color_gn, isDashed) {
    _d_rect(tx.toFCoord(blk.size), ty.toFCoord(blk.size), r, blk.size, color_gn, 1.0, isDashed);
  };
  exports._d_rectPlace = _d_rectPlace;


  const _d_rectSelect = function(b, r, color_gn, isDashed) {
    _d_rect(b.x, b.y, r, b.block.size, color_gn, 1.0, isDashed);
  };
  exports._d_rectSelect = _d_rectSelect;


  const _d_rectBuild = function(b, color_gn, isDashed) {
    _d_rect(b.x, b.y, 0, b.block.size, color_gn, 1.0, isDashed);
  };
  exports._d_rectBuild = _d_rectBuild;


  /* <---------- circle ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Classic circular range indicator.
   * {rad} and {r} are different by the way.
   * ---------------------------------------- */
  const _d_circle = function(
    x, y,
    rad, color_gn, a, isDashed, z
  ) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(a == null) a = 1.0;
    if(z == null) z = Layer.effect + VAR.lay_offDraw;

    processZ(z);

    Lines.stroke(3.0, Pal.gray);
    Draw.alpha(a);
    LCDraw.circle(x, y, rad, isDashed);
    Lines.stroke(1.0, MDL_color._color(tryVal(color_gn, Pal.accent)));
    Draw.alpha(a);
    LCDraw.circle(x, y, rad, isDashed);
    Draw.reset();

    processZ(z);
  };
  exports._d_circle = _d_circle;


  const _d_circlePlace = function(blk, tx, ty, rad, color_gn, isDashed) {
    _d_circle(tx.toFCoord(blk.size), ty.toFCoord(blk.size), rad, color_gn, 1.0, isDashed);
  };
  exports._d_circlePlace = _d_circlePlace;


  const _d_circleSelect = function(b, rad, color_gn, isDashed) {
    _d_circle(b.x, b.y, rad, color_gn, 1.0, isDashed);
  };
  exports._d_circleSelect = _d_circleSelect;


  /* <---------- area ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * A filled square, what else can it be?
   * ---------------------------------------- */
  const _d_area = function(
    x, y,
    size, color_gn, a, z
  ) {
    if(size == null) size = 1;
    if(a == null) a = 1.0;
    if(z == null) z = Layer.effect + VAR.lay_offDraw;

    processZ(z);

    Draw.color(MDL_color._color(tryVal(color_gn, Pal.accent)), a * 0.7);
    LCDraw.area(x, y, size);
    Draw.color();

    processZ(z);
  };
  exports._d_area = _d_area;


  /* ----------------------------------------
   * NOTE:
   *
   * The square slightly shrinks in and out with time.
   * Used as tile indicator.
   * ---------------------------------------- */
  const _d_areaShrink = function(
    t,
    size, color_gn, a, z
  ) {
    if(t == null) return;
    if(size == null) size = 1;

    let off = size % 2 === 0 ? 4.0 : 0.0;

    _d_area(
      t.worldx() + off, t.worldy() + off,
      (0.75 + Math.sin(Time.globalTime * 0.065) * 0.15) * size,
      color_gn, a, z,
    );
  };
  exports._d_areaShrink = _d_areaShrink;


  /* ----------------------------------------
   * NOTE:
   *
   * A filled area that covers a building.
   * ---------------------------------------- */
  const _d_areaBuild = function(
    b,
    pad, color_gn, a, z
  ) {
    if(b == null) return;
    if(pad == null) pad = 0.0;
    if(a == null) a = 1.0;
    if(z == null) z = Layer.effect + VAR.lay_offDraw;

    processZ(z);

    Draw.color(MDL_color._color(tryVal(color_gn, Pal.accent)), a * 0.5);
    LCDraw.area(b.x, b.y, b.block.size - pad * 2.0 / Vars.tilesize);
    Draw.color();

    processZ(z);
  };
  exports._d_areaBuild = _d_areaBuild;


  /* <---------- disk ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * A disk that expands from the center and fades out.
   * ---------------------------------------- */
  const _d_diskExpand = function(
    x, y,
    rad, scl, color_gn, a, z
  ) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(scl == null) scl = 1.0;
    if(a == null) a = 1.0;
    if(z == null) z = Layer.effect + VAR.lay_offDraw;

    let frac = Time.globalTime % (90.0 * scl) / (90.0 * scl);

    processZ(z);

    Draw.color(MDL_color._color(tryVal(color_gn, Pal.accent)), Mathf.lerp(a, 0.0, frac));
    LCDraw.disk(x, y, Mathf.lerp(0.0, rad, frac));
    Draw.color();

    processZ(z);
  };
  exports._d_diskExpand = _d_diskExpand;


  /* ----------------------------------------
   * NOTE:
   *
   * A disk that fades in and out.
   * Usually in red to visualize explosion range.
   * ---------------------------------------- */
  const _d_diskWarning = function(
    x, y,
    rad, scl, color_gn, a, z
  ) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(scl == null) scl = 1.0;
    if(a == null) a = 1.0;
    if(z == null) z = Layer.effect + VAR.lay_offDraw;

    processZ(z);

    Draw.color(
      MDL_color._color(tryVal(color_gn, Pal.remove)),
      a * (0.15 + Math.sin(Time.globalTime / scl / 15.0) * 0.15),
    );
    LCDraw.disk(x, y, rad);
    Draw.color();

    processZ(z);
  };
  exports._d_diskWarning = _d_diskWarning;


  /* <---------- pulse ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * The hollow squares expand and disappear.
   * ---------------------------------------- */
  const _d_pulseRect = function(
    x, y,
    rad, scl, color_gn, a, z
  ) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(scl == null) scl = 1.0;
    if(a == null) a = 1.0;
    if(z == null) z = Layer.effect + VAR.lay_offDraw;

    let
      stroke_f = rad * 0.25,
      stroke_t = 0.2,
      frac1 = 1.0 - (Time.globalTime / scl / 150.0) % 1.0,
      frac2 = (frac1 + 0.5) % 1.0,
      rads = [
        Math.min(1.0 + Math.pow(1.0 - frac1, 0.5) * rad, rad),
        Math.min(1.0 + Math.pow(1.0 - frac2, 0.5) * rad, rad),
      ];

    processZ(z);

    Draw.color(MDL_color._color(tryVal(color_gn, Pal.accent)), a * 0.7);
    let rad_i;
    for(let i = 0; i < 2; i++) {
      rad_i = rads[i];
      Lines.stroke(Mathf.lerp(stroke_f, stroke_t, rad_i / rad));
      Lines.line(x - rad_i, y - rad_i, x + rad_i, y - rad_i);
      Lines.line(x + rad_i, y - rad_i, x + rad_i, y + rad_i);
      Lines.line(x + rad_i, y + rad_i, x - rad_i, y + rad_i);
      Lines.line(x - rad_i, y + rad_i, x - rad_i, y - rad_i);
    };
    Draw.reset();

    processZ(z);
  };
  exports._d_pulseRect = _d_pulseRect;


  /* ----------------------------------------
   * NOTE:
   *
   * Now they are rings.
   * Used for impact range indication.
   * ---------------------------------------- */
  const _d_pulseCircle = function(
    x, y,
    rad, scl, color_gn, a, z
  ) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(scl == null) scl = 1.0;
    if(color_gn == null) color_gn = Pal.accent;
    if(a == null) a = 1.0;
    if(z == null) z = Layer.effect + VAR.lay_offDraw;

    let
      scl_fi = scl * 150.0,
      stroke_f = rad * 0.1,
      stroke_t = 0.2,
      frac1 = 1.0 - (Time.globalTime / scl_fi) % 1.0,
      frac2 = (frac1 + 0.25) % 1.0,
      frac3 = (frac2 + 0.25) % 1.0,
      frac4 = (frac3 + 0.25) % 1.0,
      rads = [
        Math.min(1.0 + (1.0 - frac1) * rad, rad),
        Math.min(1.0 + (1.0 - frac2) * rad, rad),
        Math.min(1.0 + (1.0 - frac3) * rad, rad),
        Math.min(1.0 + (1.0 - frac4) * rad, rad),
      ];

    processZ(z);

    Draw.color(MDL_color._color(tryVal(color_gn, Pal.accent)), a * 0.3);
    let rad_i;
    for(let i = 0; i < 4; i++) {
      rad_i = rads[i];
      Lines.stroke(Mathf.lerp(stroke_f, stroke_t, rad_i / rad));
      Lines.circle(x, y, rad_i);
    };
    Draw.reset();

    processZ(z);
  };
  exports._d_pulseCircle = _d_pulseCircle;


  /* <---------- connector ----------> */


  const _d_conRect = function(b, ob) {
    if(b == null || ob == null) return;

    _d_rectBuild(b);
    _d_rectBuild(ob);
    _d_line(b.x, b.y, ob.x, ob.y);
  };
  exports._d_conRect = _d_conRect;


  const _d_conArea = function(b, ob) {
    if(b == null || ob == null) return;

    _d_areaBuild(b);
    _d_areaBuild(ob);
    _d_lineFlick(b.x, b.y, ob.x, ob.y);
  };
  exports._d_conArea = _d_conArea;


  /* ----------------------------------------
   * NOTE:
   *
   * Mass driver indicators.
   * ---------------------------------------- */
  const _d_conCircleArrow = function(b, b_f, b_t, bs_f, bs_t) {
    if(b == null) return;

    let
      param = Mathf.absin(Time.globalTime, 6.0, 1.0),
      param1 = b.block.size === 1 ? 1.0 : b.block.size * 0.5 + 1.0,
      param2;

    Drawf.circles(b.x, b.y, param1 * Vars.tilesize + param - 2.0, Pal.accent);
    if(b_f != null) {
      Drawf.circles(b_f.x, b_f.y, param1 * Vars.tilesize + param - 2.0, Pal.place);
      Drawf.arrow(b_f.x, b_f.y, b.x, b.y, b.block.size * Vars.tilesize + param, param + 4.0, Pal.place);
    };
    if(bs_f != null) {
      bs_f.forEachFast(ob => {
        Drawf.circles(ob.x, ob.y, param1 * Vars.tilesize + param - 2.0, Pal.place);
        Drawf.arrow(ob.x, ob.y, b.x, b.y, b.block.size * Vars.tilesize + param, param + 4.0, Pal.place);
      });
    };
    if(b_t != null) {
      param2 = b_t.block.size === 1 ? 1.0 : b_t.block.size * 0.5 + 1.0;
      Drawf.circles(b_t.x, b_t.y, param2 * Vars.tilesize + param - 2.0, Pal.place);
      Drawf.arrow(b.x, b.y, b_t.x, b_t.y, b.block.size * Vars.tilesize + param, param + 4.0, Pal.accent);
    };
    if(bs_t != null) {
      bs_t.forEachFast(ob => {
        param2 = ob.block.size === 1 ? 1.0 : ob.block.size * 0.5 + 1.0;
        Drawf.circles(ob.x, ob.y, param2 * Vars.tilesize + param - 2.0, Pal.place);
        Drawf.arrow(b.x, b.y, ob.x, ob.y, b.block.size * Vars.tilesize + param, param + 4.0, Pal.accent);
      });
    };
  };
  exports._d_conCircleArrow = _d_conCircleArrow;


  /* <---------- progress ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * A regular progress bar.
   * ---------------------------------------- */
  const _d_progBar = function(
    x, y, frac,
    size, color_gn, a, offW, offTy, z
  ) {
    if(frac == null) return;
    if(size == null) size = 1;
    if(a == null) a = 1.0;
    if(a < 0.0001) return;
    if(offW == null) offW = 0.0;
    if(offTy == null) offTy = 0;
    if(z == null) z = Layer.effect + VAR.lay_offDraw;

    let
      w = (size + 1) * Vars.tilesize + offW,
      offY = (offTy + size * 0.5 + 0.5) * Vars.tilesize;

    processZ(z);

    Lines.stroke(5.0, Pal.gray);
    Draw.alpha(a * 0.7);
    Lines.line(x - w * 0.5, y + offY, x + w * 0.5, y + offY);
    Lines.stroke(3.0, MDL_color._color(tryVal(color_gn, Pal.accent)));
    Draw.alpha(a * 0.2);
    Lines.line(x - w * 0.5, y + offY, x + w * 0.5, y + offY);
    Draw.alpha(a * 0.7);
    Lines.line(x - w * 0.5, y + offY, Mathf.lerp(x - w * 0.5, x + w * 0.5, Mathf.clamp(frac)), y + offY);
    Draw.reset();

    processZ(z);
  };
  exports._d_progBar = _d_progBar;


  /* ----------------------------------------
   * NOTE:
   *
   * Progress ring.
   * ----------------------------------------
   * DEDICATION:
   *
   * Inspired by New Horizon.
   * ---------------------------------------- */
  const _d_progRing = function(
    x, y, frac,
    stroke, rad, ang, color_gn, a, rev, z
  ) {
    if(frac == null) return;
    if(stroke == null) stroke = 5.0;
    if(rad == null) rad = 24.0;
    if(ang == null) ang = 0.0;
    if(a == null) a = 1.0;
    if(a < 0.0001) return;
    if(z == null) z = Layer.effect + VAR.lay_offDraw;

    let
      color = MDL_color._color(tryVal(color_gn, Pal.accent)),
      radIn = rad - stroke * 0.3,
      radOut = rad + stroke * 0.3;

    processZ(z);

    Lines.stroke(stroke, Pal.gray);
    Draw.alpha(a * 0.7);
    Lines.circle(x, y, rad);
    Lines.stroke(stroke * 0.6, color);
    Draw.alpha(a * 0.2);
    Lines.circle(x, y, rad);
    Draw.color(color);
    Draw.alpha(a * 0.7);
    LCDraw.ring(
      x, y,
      rad - stroke * 0.3,
      rad + stroke * 0.3,
      ang, frac, rev,
    );
    Draw.reset();

    processZ(z);
  };
  exports._d_progRing = _d_progRing;


  /* <---------- text ----------> */


  const _d_text = function(
    x, y, str,
    sizeScl, color_gn, align, offX, offY, offZ,
    font_ow
  ) {
    if(str == null || str === "") return;
    if(sizeScl == null) sizeScl = 1.0;
    if(align == null) align = Align.center;
    if(offX == null) offX = 0.0;
    if(offY == null) offY = 0.0;
    if(offZ == null) offZ = 0.0;

    processZ(Drawf.text());

    let
      font = tryVal(font_ow, Fonts.outline),
      layout = Pools.obtain(GlyphLayout, () => new GlyphLayout()),
      useInt = font.usesIntegerPositions();

    Draw.z(Layer.playerName + 0.5 + offZ);
    font.setUseIntegerPositions(false);
    font.getData().setScale(0.25 / Scl.scl(1.0) * sizeScl);
    layout.setText(font, str);
    font.setColor(MDL_color._color(tryVal(color_gn, Color.white)));
    font.draw(str, x + offX, y + offY, 0, align, false);
    Draw.reset();

    processZ(TMP_Z);

    Pools.free(layout);
    font.getData().setScale(1.0);
    font.setColor(Color.white);
    font.setUseIntegerPositions(useInt);
  };
  exports._d_text = _d_text;


  const _d_textPlace = function(blk, tx, ty, str, valid, offTy) {
    if(blk == null || str == null) return;
    if(valid == null) valid = true;
    if(offTy == null) offTy = 0;

    blk.drawPlaceText(str, tx + blk.offset / Vars.tilesize, ty + blk.offset / Vars.tilesize + offTy, valid);
  };
  exports._d_textPlace = _d_textPlace;


  const _d_textSelect = function(b, str, valid, offTy) {
    if(b == null || str == null) return;
    if(valid == null) valid = true;
    if(offTy == null) offTy = 0;

    b.block.drawPlaceText(str, b.x / Vars.tilesize, b.y / Vars.tilesize + offTy, valid);
  };
  exports._d_textSelect = _d_textSelect;


  /* <---------- unit ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Used to draw unit health bar and more.
   * Will draw nothing if the unit is hidden by trees.
   * Also used for buildings.
   * ---------------------------------------- */
  const _d_unitStat = function(
    e, healthFrac,
    size, color_gn, a, offW, offTy, segScl,
    armor, shield, speedMtp, dpsMtp,
    z
  ) {
    if(e == null || healthFrac == null) return;
    if(e.dead || (e instanceof Unit && MDL_cond._isCovered(e))) return;
    if(size == null) size = 1;
    if(a == null) a = 1.0;
    if(a < 0.0001) return;
    if(offW == null) offW = 0.0;
    if(offTy == null) offTy = 0;
    if(segScl == null) segScl = 1.0;
    if(z == null) z = Layer.playerName - 0.44;

    let
      frac = Mathf.clamp(healthFrac),
      color_fi = Tmp.c1.set(MDL_color._color(tryVal(color_gn, Pal.accent))).lerp(Color.white, MDL_entity._flashFrac(e)),
      x = e.x,
      y = e.y,
      a_fi = a * 0.7,
      w = (size + 1) * Vars.tilesize + offW,
      offY = (offTy + size * 0.5 + 1.5) * Vars.tilesize,
      amtSeg = Math.ceil(w / 4.0 / segScl),
      segW = (w + 5.0) / (amtSeg + 1);

    processZ(z);

    if(PARAM.unitStatStyle === 3) {
      offY -= 4.0;
    };

    // Health bar
    if(PARAM.unitStatStyle === 2 || PARAM.unitStatStyle === 3) {
      Lines.stroke(PARAM.unitStatStyle === 3 ? 3.5 : 5.0, Pal.gray);
      Draw.alpha(a_fi);
      Lines.line(x - w * 0.5, y + offY, x + w * 0.5, y + offY);
    } else if(PARAM.unitStatStyle === 1) {
      Lines.stroke(10.0, Pal.gray);
      Draw.alpha(a_fi);
      Lines.line(x - w * 0.5 + 2.5, y + offY + 2.5, x + w * 0.5 - 2.5, y + offY + 2.5);
    };
    Lines.stroke(PARAM.unitStatStyle === 3 ? 2.5 : 3.0, color_fi);
    Draw.alpha(a_fi * 0.3);
    Lines.line(x - w * 0.5, y + offY, x + w * 0.5, y + offY);
    Draw.alpha(a_fi);
    Lines.line(x - w * 0.5, y + offY, Mathf.lerp(x - w * 0.5, x + w * 0.5, frac), y + offY);
    // Health bar segments
    if(PARAM.unitStatStyle === 1 || PARAM.unitStatStyle === 2) {
      Lines.stroke(1.0, Pal.gray);
      Draw.alpha(a_fi);
      let x_i, y1_i, y2_i;
      for(let i = 0; i < amtSeg; i++) {
        x_i = x - w * 0.5 - 2.5 + segW * (i + 1);
        y1_i = y + offY + 2.0;
        y2_i = y + offY - 2.0;

        Lines.line(x_i, y1_i, x_i, y2_i);
      };
    };
    Draw.reset();
    // Stats
    if(PARAM.unitStatStyle === 1 || PARAM.unitStatStyle === 2) {
      if(armor != null) {
        _d_text(
          e.x, e.y, Strings.autoFixed(armor, 0),
          1.2, Color.gray, Align.right,
          -w * 0.5 - 4.0,
          offY + (PARAM.unitStatStyle === 2 ? 2.5 : 4.5),
          null, Fonts.def,
        );
      };
      if(shield != null && shield > 0.0) {
        _d_text(
          e.x, e.y, Strings.autoFixed(shield, 0),
          1.2, Pal.techBlue, Align.left,
          w * 0.5 + 4.0,
          offY + (PARAM.unitStatStyle === 2 ? 2.75 : 4.5),
          null, Fonts.def,
        );
      };
    };
    if(PARAM.unitStatStyle === 1) {
      _d_text(
        e.x, e.y, Strings.autoFixed(e.maxHealth, 0),
        0.8, color_fi, Align.center,
        0.0,
        offY + 6.0,
        null, Fonts.def,
      );
      if(speedMtp != null && size >= 3.0) {
        _d_text(
          e.x, e.y, "S: " + Strings.fixed(speedMtp, 2),
          0.6, Color.gray, Align.left,
          -w * 0.5 - 2.5,
          offY + 5.0,
          null, Fonts.def,
        );
      };
      if(dpsMtp != null && dpsMtp >= 3.0) {
        _d_text(
          e.x, e.y, "D: " + Strings.fixed(dpsMtp, 2),
          0.6, Color.gray, Align.right,
          w * 0.5 + 2.5,
          offY + 5.0,
          null, Fonts.def,
        );
      };
    };
    // Stack status
    if(e instanceof Unit) {
      let stackSta = MDL_entity._stackStaFirst(e);
      if(stackSta != null) {
        let y_sta = y - e.hitSize * 0.5 - 8.0;
        _d_progRing(
          x, y_sta,
          Mathf.clamp(1.0 - (e == null ? 0.0 : e.getDuration(stackSta)) / stackSta.delegee.burstTime),
          2.25, 2.75, 90.0, Color.white, 1.0, true,
        );
        Draw.rect(stackSta.uiIcon, x, y_sta, 4.0, 4.0);
      };
    };

    processZ(z);
  };
  exports._d_unitStat = _d_unitStat;


  /* ----------------------------------------
   * NOTE:
   *
   * Used to draw unit reload bar.
   * ---------------------------------------- */
  const _d_reload = function(
    e, mtIds,
    color_gn, a, offW, offTy,
    frac_ow,
    z
  ) {
    if(e == null) return;
    if(e.dead || (e instanceof Unit && MDL_cond._isCovered(e))) return;
    if(a == null) a = 1.0;
    if(a < 0.0001) return;
    if(offW == null) offW = 0.0;
    if(offTy == null) offTy = 0.0;
    if(z == null) z = Layer.effect + VAR.lay_offDraw + 1.0;

    let frac;
    if(frac_ow != null) {
      frac = frac_ow;
    } else if(mtIds == null) {
      frac = 0.0;
    } else {
      frac = MDL_entity._reloadFrac(e, mtIds);
    };
    if(frac > 0.9999 || frac < 0.0001) return;

    let
      x = e.x,
      y = e.y,
      hitSize = MDL_entity._hitSize(e),
      w = (hitSize + 8.0 + offW) * 1.7,
      offY = hitSize * 0.5 + 4.0 + (offTy + 1.25) * Vars.tilesize;

    processZ(z);

    Lines.stroke(5.0, Pal.gray);
    Draw.alpha(a * 0.5);
    Lines.line(x - w * 0.5, y - offY, x + w * 0.5, y - offY);
    Lines.stroke(3.0, MDL_color._color(tryVal(color_gn, Pal.techBlue)));
    Draw.alpha(a * 0.25);
    Lines.line(x - w * 0.5, y - offY, x + w * 0.5, y - offY);
    Draw.alpha(a * 0.5);
    Lines.line(x - w * 0.5, y - offY, Mathf.lerp(x - w * 0.5, x + w * 0.5, frac), y - offY);
    Draw.reset();

    processZ(z);
  };
  exports._d_reload = _d_reload;
