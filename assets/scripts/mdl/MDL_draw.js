/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods related to draw.
   * @module lovec/mdl/MDL_draw
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ line ------------------------------ */


  /**
   * Draws an outlined line.
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {ColorGn|unset} [color_gn]
   * @param {number|unset} [a]
   * @param {boolean|unset} [isDashed]
   * @param {number|unset} [z]
   * @return {void}
   */
  const _d_line = function(
    x1, y1, x2, y2,
    color_gn, a, isDashed, z
  ) {
    if(a == null) a = 1.0;
    if(isDashed == null) isDashed = false;
    if(z == null) z = Layer.effect + VAR.layer.offDraw;

    processZ(z);

    Lines.stroke(3.0, Pal.gray);
    Draw.alpha(a);
    LCDraw.line(x1, y1, x2, y2, isDashed);
    Lines.stroke(1.0, MDL_color._color(tryVal(color_gn, Pal.accent)));
    Draw.alpha(a);
    LCDraw.line(x1, y1, x2, y2, isDashed);
    Draw.reset();

    processZ();
  };
  exports._d_line = _d_line;


  /**
   * Draws a fading line.
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {number|unset} [stroke]
   * @param {number|unset} [scl]
   * @param {ColorGn|unset} [color_gn]
   * @param {boolean|unset} [isDashed]
   * @param {number|unset} [z]
   * @return {void}
   */
  const _d_lineFlick = function(
    x1, y1, x2, y2,
    stroke, scl, color_gn, isDashed, z
  ) {
    if(stroke == null) stroke = 1.5;
    if(scl == null) scl = 1.0;
    if(isDashed == null) isDashed = false;
    if(z == null) z = Layer.effect + VAR.layer.offDraw;

    processZ(z);

    Lines.stroke(stroke, MDL_color._color(tryVal(color_gn, Pal.accent)));
    Draw.alpha(0.35 + Math.sin(Time.globalTime / scl / 15.0) * 0.25);
    LCDraw.line(x1, y1, x2, y2, isDashed);
    Draw.reset();

    processZ();
  };
  exports._d_lineFlick = _d_lineFlick;


  /**
   * Draws a laser line.
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {number|unset} [strokeScl]
   * @param {ColorGn|unset} [color1_gn] - Outer part.
   * @param {ColorGn|unset} [color2_gn] - Inner part.
   * @param {number|unset} [a]
   * @param {boolean|unset} [hasLight]
   * @param {number|unset} [z]
   * @return {void}
   */
  const _d_laser = function(
    x1, y1, x2, y2,
    strokeScl, color1_gn, color2_gn, a, hasLight, z
  ) {
    if(strokeScl == null) strokeScl = 1.0;
    if(z == null) z = Layer.effect + VAR.layer.offDraw;

    let strokeScl_fi = (1.0 + Math.sin(Time.time * 0.065) * 0.2) * strokeScl;

    processZ(z);

    // Back
    Lines.stroke(3.0 * strokeScl_fi, MDL_color._color(tryVal(color1_gn, Pal.accent)));
    Draw.alpha(a == null ? Vars.renderer.laserOpacity : a);
    Lines.line(x1, y1, x2, y2);
    Fill.circle(x1, y1, 2.4 * strokeScl_fi);
    Fill.circle(x2, y2, 2.4 * strokeScl_fi);
    // Front
    Lines.stroke(strokeScl_fi, MDL_color._color(tryVal(color2_gn, Color.white)));
    Draw.alpha(a == null ? Vars.renderer.laserOpacity : a);
    Lines.line(x1, y1, x2, y2);
    Fill.circle(x1, y1, 1.2 * strokeScl_fi);
    Fill.circle(x2, y2, 1.2 * strokeScl_fi);
    Draw.reset();

    processZ();

    if(hasLight) Drawf.light(x1, y1, x2, y2);
  };
  exports._d_laser = _d_laser;


  /**
   * Draws laser that randomly walks in a rectangular range.
   * @param {number} x
   * @param {number} y
   * @param {number} cx
   * @param {number} cy
   * @param {number} rad
   * @param {number|unset} [offTime]
   * @param {number|unset} [rotDir]
   * @param {number|unset} [strokeScl]
   * @param {ColorGn|unset} [color1_gn]
   * @param {ColorGn|unset} [color2_gn]
   * @param {number|unset} [a]
   * @param {boolean|unset} [hasLight]
   * @param {number|unset} [z]
   * @return {Vec2}
   */
  const _d_laserRandWalk = function(
    x, y, cx, cy, rad, offTime, rotDir,
    strokeScl, color1_gn, color2_gn, a, hasLight, z
  ) {
    let vec2 = LCDrawf.getRandWalkVec(Tmp.v1, Time.time + tryVal(offTime, 0.0)).rotate90(tryVal(rotDir, 0));
    _d_laser(x, y, cx + vec2.x * rad, cy + vec2.y * rad, strokeScl, color1_gn, color2_gn, a, hasLight, z);

    return vec2;
  };
  exports._d_laserRandWalk = _d_laserRandWalk;


  /**
   * Variant of {@link _d_laserRandWalk} for mining beam.
   * @param {number} x
   * @param {number} y
   * @param {number} cx
   * @param {number} cy
   * @param {number} rad
   * @param {number|unset} [offTime]
   * @param {number|unset} [rotDir]
   * @param {number|unset} [strokeScl]
   * @param {ColorGn|unset} [color1_gn]
   * @param {ColorGn|unset} [color2_gn]
   * @param {number|unset} [a]
   * @param {boolean|unset} [hasLight]
   * @param {number|unset} [z]
   * @return {Vec2}
   */
  const _d_laserRandMine = function thisFun(
    x, y, cx, cy, rad, offTime, rotDir,
    strokeScl, color1_gn, color2_gn, a, hasLight, z
  ) {
    if(z == null) z = VAR.layer.mineBeam;

    thisFun.tmpVec.set(_d_laserRandWalk(x, y, cx + Math.cos(Time.time * 0.025) * 4.0, cy + Math.sin(Time.time * 0.025) * 4.0, rad, offTime, rotDir, strokeScl, color1_gn, color2_gn, a, hasLight, z));
    if(!Vars.state.isPaused() && TIMER.trailCircle) {
      MDL_effect._e_trailCircle(cx + thisFun.tmpVec.x * rad, cy + thisFun.tmpVec.y * rad, strokeScl * 1.0, MDL_color._color(color1_gn));
      if(Mathf.chanceDelta(0.05)) {
        Fx.mineSmall.at(cx + thisFun.tmpVec.x * rad, cy + thisFun.tmpVec.y * rad);
      };
    };
  }
  .setProp({
    tmpVec: new Vec2(),
  });
  exports._d_laserRandMine = _d_laserRandMine;


  /**
   * Draws vanilla laser.
   * No color allowed, so it's always yellow.
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {number|unset} [strokeScl]
   * @return {void}
   */
  const _d_laserV = function(
    x1, y1, x2, y2,
    strokeScl
  ) {
    Drawf.laser(VARGEN.miscRegs.laserLine, VARGEN.miscRegs.laserEnd, x1, y1, x2, y2, tryVal(strokeScl, 1.0));
  };
  exports._d_laserV = _d_laserV;


  /**
   * Draws a line with moving arrow.
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {number|unset} [strokeScl]
   * @param {number|unset} [scl]
   * @param {ColorGn|unset} [color_gn]
   * @param {number|unset} [a]
   * @param {number|unset} [z]
   * @return {void}
   */
  const _d_arrowLine = function(
    x1, y1, x2, y2,
    strokeScl, scl, color_gn, a, z
  ) {
    if(strokeScl == null) strokeScl = 1.0;
    if(a == null) a = 1.0;
    if(z == null) z = Layer.effect + VAR.layer.offDraw;

    let
      frac1 = Time.globalTime / tryVal(scl, 1.0) % 100.0 / 100.0,
      frac2 = (frac1 + 0.5) % 1.0,
      ang = Mathf.angle(x2 - x1, y2 - y1);

    processZ(z);

    Lines.stroke(strokeScl, MDL_color._color(tryVal(color_gn, Pal.accent)));
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

    processZ();
  };
  exports._d_arrowLine = _d_arrowLine;


  /**
   * Draws a wire that connects two positions.
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {string|unset} [wireMat]
   * @param {number|unset} [strokeScl]
   * @param {number|unset} [glowA]
   * @param {number|unset} [z]
   * @return {void}
   */
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
    processZ(Layer.block + 0.1, 1);
    Lines.stroke(20.0 * strokeScl);
    Draw.alpha(0.3);
    Lines.line(VARGEN.wireRegs.shaReg, x1 + dx, y1 + dy, x2 - dx, y2 - dy, false);
    processZ(null, 1);
    // Glow
    processZ(Layer.block + 0.11, 1);
    Lines.stroke(8.0 * strokeScl);
    Draw.alpha(glowA * (0.4 + Mathf.absin(15.0, 0.6)) * 0.25);
    Draw.blend(Blending.additive);
    Lines.line(VARGEN.wireRegs.glowReg, x1 + dx, y1 + dy, x2 - dx, y2 - dy, false);
    Draw.blend();
    Draw.reset();
    processZ(null, 1);

    processZ();
  };
  exports._d_wire = _d_wire;


  /* <------------------------------ rect ------------------------------ */


  /**
   * Draws an outlined rectangle.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [r]
   * @param {number|unset} [size]
   * @param {ColorGn|unset} [color_gn]
   * @param {number|unset} [a]
   * @param {boolean|unset} [isDashed]
   * @param {number|unset} [z]
   * @return {void}
   */
  const _d_rect = function(
    x, y,
    r, size, color_gn, a, isDashed, z
  ) {
    if(r == null) r = 0;
    if(size == null) size = 1;
    if(a == null) a = 1.0;
    if(isDashed == null) isDashed = false;
    if(z == null) z = Layer.effect + VAR.layer.offDraw;

    processZ(z);

    Lines.stroke(3.0, Pal.gray);
    Draw.alpha(a);
    LCDraw.rect(x, y, r, size, isDashed);
    Lines.stroke(1.0, MDL_color._color(tryVal(color_gn, Pal.accent)));
    Draw.alpha(a);
    LCDraw.rect(x, y, r, size, isDashed);
    Draw.reset();

    processZ();
  };
  exports._d_rect = _d_rect;


  /**
   * Variant of {@link _d_rect} for block placement.
   * @param {Block} blk
   * @param {number} tx
   * @param {number} ty
   * @param {number|unset} [r]
   * @param {ColorGn|unset} [color_gn]
   * @param {boolean|unset} [isDashed]
   * @return {void}
   */
  const _d_rectPlace = function(blk, tx, ty, r, color_gn, isDashed) {
    _d_rect(tx.toFCoord(blk.size), ty.toFCoord(blk.size), r, blk.size, color_gn, 1.0, isDashed);
  };
  exports._d_rectPlace = _d_rectPlace;


  /**
   * Variant of {@link _d_rectPlace} for rotated range.
   * @param {Block} blk
   * @param {number} tx
   * @param {number} ty
   * @param {number|unset} [r]
   * @param {number|unset} [rot]
   * @param {ColorGn|unset} [color_gn]
   * @param {boolean|unset} [isDashed]
   * @return {void}
   */
  const _d_rectPlaceRot = function(blk, tx, ty, r, rot, color_gn, isDashed) {
    let vec2 = MDL_pos._coordsRectRotCenter(tx.toFCoord(blk.size), ty.toFCoord(blk.size), r, rot, blk.size);
    _d_rect(vec2.x, vec2.y, r, 0, color_gn, 1.0, isDashed);
  };
  exports._d_rectPlaceRot = _d_rectPlaceRot;


  /**
   * Variant of {@link _d_rect} for building selection.
   * @param {Building} b
   * @param {number|unset} [r]
   * @param {ColorGn|unset} [color_gn]
   * @param {boolean|unset} [isDashed]
   * @return {void}
   */
  const _d_rectSelect = function(b, r, color_gn, isDashed) {
    _d_rect(b.x, b.y, r, b.block.size, color_gn, 1.0, isDashed);
  };
  exports._d_rectSelect = _d_rectSelect;


  /**
   * Variant of {@link _d_rectSelect} for rotated range.
   * @param {Building} b
   * @param {number|unset} [r]
   * @param {number|unset} [rot]
   * @param {ColorGn|unset} [color_gn]
   * @param {boolean|unset} [isDashed]
   * @return {void}
   */
  const _d_rectSelectRot = function(b, r, rot, color_gn, isDashed) {
    _d_rectPlaceRot(b.block, b.tileX(), b.tileY(), r, rot, color_gn, isDashed);
  };
  exports._d_rectSelectRot = _d_rectSelectRot;


  /* <------------------------------ circle ------------------------------ */


  /**
   * Draws an outlined circle.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @param {ColorGn|unset} [color_gn]
   * @param {number|unset} [a]
   * @param {boolean|unset} [isDashed]
   * @param {number|unset} [z]
   * @return {void}
   */
  const _d_circle = function(
    x, y,
    rad, color_gn, a, isDashed, z
  ) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(a == null) a = 1.0;
    if(isDashed == null) isDashed = false;
    if(z == null) z = Layer.effect + VAR.layer.offDraw;

    processZ(z);

    Lines.stroke(3.0, Pal.gray);
    Draw.alpha(a);
    LCDraw.circle(x, y, rad, isDashed);
    Lines.stroke(1.0, MDL_color._color(tryVal(color_gn, Pal.accent)));
    Draw.alpha(a);
    LCDraw.circle(x, y, rad, isDashed);
    Draw.reset();

    processZ();
  };
  exports._d_circle = _d_circle;


  /**
   * Variant of {@link _d_circle} for block placement.
   * @param {Block} blk
   * @param {number} tx
   * @param {number} ty
   * @param {number|unset} [rad]
   * @param {ColorGn|unset} [color_gn]
   * @param {boolean|unset} [isDashed]
   * @return {void}
   */
  const _d_circlePlace = function(blk, tx, ty, rad, color_gn, isDashed) {
    _d_circle(tx.toFCoord(blk.size), ty.toFCoord(blk.size), rad, color_gn, 1.0, isDashed);
  };
  exports._d_circlePlace = _d_circlePlace;


  /**
   * Variant of {@link _d_circle} for building selection.
   * @param {Building} b
   * @param {number|unset} [rad]
   * @param {ColorGn|unset} [color_gn]
   * @param {boolean|unset} [isDashed]
   * @return {void}
   */
  const _d_circleSelect = function(b, rad, color_gn, isDashed) {
    _d_circle(b.x, b.y, rad, color_gn, 1.0, isDashed);
  };
  exports._d_circleSelect = _d_circleSelect;


  /* <------------------------------ area ------------------------------ */


  /**
   * Draws a filled square.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [size]
   * @param {ColorGn|unset} [color_gn]
   * @param {number|unset} [a]
   * @param {number|unset} [z]
   * @return {void}
   */
  const _d_area = function(
    x, y,
    size, color_gn, a, z
  ) {
    if(size == null) size = 1;
    if(a == null) a = 1.0;
    if(z == null) z = Layer.effect + VAR.layer.offDraw;

    processZ(z);

    Draw.color(MDL_color._color(tryVal(color_gn, Pal.accent)), a * 0.7);
    LCDraw.area(x, y, size);
    Draw.color();

    processZ();
  };
  exports._d_area = _d_area;


  /**
   * Variant of {@link _d_area} for tile indication.
   * @param {Tile|null} t
   * @param {number|unset} [size]
   * @param {ColorGn|unset} [color_gn]
   * @param {number|unset} [a]
   * @param {number|unset} [z]
   * @return {void}
   */
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


  /**
   * Variant of {@link _d_area} for building indication.
   * @param {Building} b
   * @param {number|unset} [pad]
   * @param {ColorGn|unset} [color_gn]
   * @param {number|unset} [a]
   * @param {number|unset} [z]
   * @return {void}
   */
  const _d_areaBuild = function(
    b,
    pad, color_gn, a, z
  ) {
    if(pad == null) pad = 0.0;
    if(a == null) a = 1.0;
    if(z == null) z = Layer.effect + VAR.layer.offDraw;

    processZ(z);

    Draw.color(MDL_color._color(tryVal(color_gn, Pal.accent)), a * 0.5);
    LCDraw.area(b.x, b.y, b.block.size - pad * 2.0 / Vars.tilesize);
    Draw.color();

    processZ();
  };
  exports._d_areaBuild = _d_areaBuild;


  /* <------------------------------ disk ------------------------------ */


  /**
   * Draws a disk that expands from the center and fades out.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @param {number|unset} [scl]
   * @param {ColorGn|unset} [color_gn]
   * @param {number|unset} [a]
   * @param {number|unset} [z]
   * @return {void}
   */
  const _d_diskExpand = function(
    x, y,
    rad, scl, color_gn, a, z
  ) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(scl == null) scl = 1.0;
    if(a == null) a = 1.0;
    if(z == null) z = Layer.effect + VAR.layer.offDraw;

    let frac = Time.globalTime % (90.0 * scl) / (90.0 * scl);

    processZ(z);

    Draw.color(MDL_color._color(tryVal(color_gn, Pal.accent)), Mathf.lerp(a, 0.0, frac));
    LCDraw.disk(x, y, Mathf.lerp(0.0, rad, frac));
    Draw.color();

    processZ();
  };
  exports._d_diskExpand = _d_diskExpand;


  /**
   * Draws a disk that fades in and out.
   * Usually used to indicate explosion range.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @param {number|unset} [scl]
   * @param {ColorGn|unset} [color_gn]
   * @param {number|unset} [a]
   * @param {number|unset} [z]
   * @return {void}
   */
  const _d_diskWarning = function(
    x, y,
    rad, scl, color_gn, a, z
  ) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(scl == null) scl = 1.0;
    if(a == null) a = 1.0;
    if(z == null) z = Layer.effect + VAR.layer.offDraw;

    processZ(z);

    Draw.color(
      MDL_color._color(tryVal(color_gn, Pal.remove)),
      a * (0.15 + Math.sin(Time.globalTime / scl / 15.0) * 0.15),
    );
    LCDraw.disk(x, y, rad);
    Draw.color();

    processZ();
  };
  exports._d_diskWarning = _d_diskWarning;


  /* <------------------------------ pulse ------------------------------ */


  /**
   * Draws hollow squares that expand and disappear.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @param {number|unset} [scl]
   * @param {ColorGn|unset} [color_gn]
   * @param {number|unset} [a]
   * @param {number|unset} [z]
   * @return {void}
   */
  const _d_pulseRect = function(
    x, y,
    rad, scl, color_gn, a, z
  ) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(scl == null) scl = 1.0;
    if(a == null) a = 1.0;
    if(z == null) z = Layer.effect + VAR.layer.offDraw;

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

    processZ();
  };
  exports._d_pulseRect = _d_pulseRect;


  /**
   * Draws circles that expand and disappear.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @param {number|unset} [scl]
   * @param {ColorGn|unset} [color_gn]
   * @param {number|unset} [a]
   * @param {number|unset} [z]
   * @return {void}
   */
  const _d_pulseCircle = function(
    x, y,
    rad, scl, color_gn, a, z
  ) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(scl == null) scl = 1.0;
    if(color_gn == null) color_gn = Pal.accent;
    if(a == null) a = 1.0;
    if(z == null) z = Layer.effect + VAR.layer.offDraw;

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

    processZ();
  };
  exports._d_pulseCircle = _d_pulseCircle;


  /* <------------------------------ connector ------------------------------ */


  /**
   * Draws a connector with dashed rectangles and a dashed line.
   * @param {Building|null} b
   * @param {Building|null} ob
   * @return {void}
   */
  const _d_conRect = function(b, ob) {
    if(b == null || ob == null) return;

    _d_rectSelect(b);
    _d_rectSelect(ob);
    _d_line(b.x, b.y, ob.x, ob.y);
  };
  exports._d_conRect = _d_conRect;


  /**
   * Draws a connector with filled squares and a flickering line.
   * @param {Building|null} b
   * @param {Building|null} ob
   * @return {void}
   */
  const _d_conArea = function(b, ob) {
    if(b == null || ob == null) return;

    _d_areaBuild(b);
    _d_areaBuild(ob);
    _d_lineFlick(b.x, b.y, ob.x, ob.y);
  };
  exports._d_conArea = _d_conArea;


  /**
   * Vanilla mass driver connector.
   * @param {Building|null} b
   * @param {Building|unset} [b_f]
   * @param {Building|unset} [b_t]
   * @param {Array<Building>|unset} [bs_f]
   * @param {Array<Building>|unset} [bs_t]
   * @return {void}
   */
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


  /* <------------------------------ progress ------------------------------ */


  /**
   * Draws a regular progress bar.
   * @param {number} x
   * @param {number} y
   * @param {number} frac
   * @param {number|unset} [size]
   * @param {ColorGn|unset} [color_gn]
   * @param {number|unset} [a]
   * @param {number|unset} [offW]
   * @param {number|unset} [offTy]
   * @param {number|unset} [z]
   * @return {void}
   */
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
    if(z == null) z = Layer.effect + VAR.layer.offDraw;

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

    processZ();
  };
  exports._d_progBar = _d_progBar;


  /**
   * Draws a progress ring.
   * @param {number} x
   * @param {number} y
   * @param {number} frac
   * @param {number|unset} [stroke]
   * @param {number|unset} [rad]
   * @param {number|unset} [ang]
   * @param {ColorGn|unset} [color_gn]
   * @param {number|unset} [a]
   * @param {boolean|unset} [rev]
   * @param {number|unset} [z]
   * @return {void}
   */
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
    if(z == null) z = Layer.effect + VAR.layer.offDraw;

    let color = MDL_color._color(tryVal(color_gn, Pal.accent));

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

    processZ();
  };
  exports._d_progRing = _d_progRing;


  /* <------------------------------ text ------------------------------ */


  /**
   * Draws text for block placement.
   * @param {Block} blk
   * @param {number} tx
   * @param {number} ty
   * @param {string|null} str
   * @param {boolean|unset} [valid]
   * @param {number|unset} [offTy]
   * @return {void}
   */
  const _d_textPlace = function(blk, tx, ty, str, valid, offTy) {
    if(str == null) return;
    if(valid == null) valid = true;
    if(offTy == null) offTy = 0;

    blk.drawPlaceText(str, tx + blk.offset / Vars.tilesize, ty + blk.offset / Vars.tilesize + offTy, valid);
  };
  exports._d_textPlace = _d_textPlace;


  /**
   * Draws text for building selection.
   * @param {Building} b
   * @param {string|null} str
   * @param {boolean|unset} [valid]
   * @param {number|unset} [offTy]
   * @return {void}
   */
  const _d_textSelect = function(b, str, valid, offTy) {
    if(str == null) return;
    if(valid == null) valid = true;
    if(offTy == null) offTy = 0;

    b.block.drawPlaceText(str, b.x / Vars.tilesize, b.y / Vars.tilesize + offTy, valid);
  };
  exports._d_textSelect = _d_textSelect;


  /* <------------------------------ unit ------------------------------ */


  /**
   * Used to draw unit health bar and more.
   * Also used for buildings.
   * @param {Building|Unit} e
   * @param {number} healthFrac
   * @param {number|unset} [size]
   * @param {ColorGn|unset} [color_gn]
   * @param {number|unset} [a]
   * @param {number|unset} [offW]
   * @param {number|unset} [offTy]
   * @param {number|unset} [segScl]
   * @param {number|unset} [armor]
   * @param {number|unset} [shield]
   * @param {number|unset} [speedMtp]
   * @param {number|unset} [dpsMtp]
   * @param {number|unset} [z]
   * @return {void}
   */
  const _d_unitStat = function(
    e, healthFrac,
    size, color_gn, a, offW, offTy, segScl,
    armor, shield, speedMtp, dpsMtp,
    z
  ) {
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
      color = Tmp.c1.set(MDL_color._color(tryVal(color_gn, Pal.accent))).lerp(Color.white, MDL_entity._flashFrac(e)),
      x = e.x,
      y = e.y,
      w = (size + 1) * Vars.tilesize + offW,
      offY = (offTy + size * 0.5 + 1.5) * Vars.tilesize,
      amtSeg = Math.ceil(w / 4.0 / segScl);

    CLS_unitStatDisplayMode.getById(PARAM.UNIT_STAT_STYLE).draw(
      e, x, y, frac,
      color, a, w, offY, amtSeg,
      armor, shield, speedMtp, dpsMtp,
      z,
    );
  };
  exports._d_unitStat = _d_unitStat;


  /**
   * Shows ring UI about {@link INTF_STA_burstStatus}.
   * @param {Unit} unit
   * @return {void}
   */
  const _d_stackSta = function(unit) {
    let stackSta = MDL_entity._stackStaFirst(unit);
    if(stackSta == null) return;

    let x = unit.x, y = unit.y - unit.hitSize * 0.5 - 8.0;
    _d_progRing(
      x, y,
      Mathf.clamp(1.0 - unit.getDuration(stackSta) / stackSta.delegee.burstTime),
      2.25, 2.75, 90.0, Color.white, 1.0, true,
    );
    Draw.rect(stackSta.fullIcon, x, y, 4.0, 4.0);
  };
  exports._d_stackSta = _d_stackSta;


  /**
   * Used to draw unit reload bar.
   * @param {Building|Unit} e
   * @param {Array<number>|null} mtIds
   * @param {ColorGn|unset} [color_gn]
   * @param {number|unset} [a]
   * @param {number|unset} [offW]
   * @param {number|unset} [offTy]
   * @param {number|unset} [frac_ow]
   * @param {number|unset} [z]
   * @return {void}
   */
  const _d_reload = function(
    e, mtIds,
    color_gn, a, offW, offTy,
    frac_ow,
    z
  ) {
    if(e.dead || (e instanceof Unit && MDL_cond._isCovered(e))) return;
    if(a == null) a = 1.0;
    if(a < 0.0001) return;
    if(offW == null) offW = 0.0;
    if(offTy == null) offTy = 0.0;
    if(z == null) z = Layer.effect + VAR.layer.offDraw + 1.0;

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

    processZ();
  };
  exports._d_reload = _d_reload;


  /* <------------------------------ component ------------------------------ */


  /**
   * `drawPlace` that every block should have.
   * Used if `blk.super$drawPlace` is not called.
   * @param {Block} blk
   * @param {number} tx
   * @param {number} ty
   * @param {number} rot
   * @param {boolean} valid
   * @return {void}
   */
  const comp_drawPlace_baseBlock = function(blk, tx, ty, rot, valid) {
    blk.drawPotentialLinks(tx, ty);
    blk.drawOverlay(tx.toFCoord(blk.size), ty.toFCoord(blk.size), rot);
  };
  exports.comp_drawPlace_baseBlock = comp_drawPlace_baseBlock;


  /**
   * `draw` that every building should have.
   * Used if `b.super$draw` is not called.
   * @param {Building} b
   * @return {void}
   */
  const comp_draw_baseBuilding = function(b) {
    b.block.variant === 0 || b.block.variantRegions == null ?
      Draw.rect(b.block.region, b.x, b.y, b.drawrot()) :
      Draw.rect(b.block.variantRegions[Mathf.randomSeed(b.tile.pos(), 0, Mathf.maxZero(b.block.variantRegions.length - 1))], b.x, b.y, b.drawrot());
  };
  exports.comp_draw_baseBuilding = comp_draw_baseBuilding;


  /**
   * Shows extra information for a tile/building, see {@link DB_misc}.
   * @param {Tile|null} t
   * @return {void}
   */
  const drawExtraInfo = function thisFun(t) {
    if(t == null) return;
    if(t === thisFun.tmpT) {
      thisFun.tmpCd--;
    } else {
      thisFun.tmpT = t;
      thisFun.tmpCd = VAR.time.extraInfoCooldown;
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

    LCDraw.text(
      (t.build == null ? t.worldx() : t.build.x) + (!PARAM.SHOULD_DRAW_UNIT_STAT || !PARAM.SHOULD_DRAW_BUILD_STAT || t.build == null ? 0.0 : ((VAR.range.offBuildStatR + t.build.block.size * 0.5) * Vars.tilesize - 8.0)),
      (t.build == null ? t.worldy() : t.build.y) - (!PARAM.SHOULD_DRAW_UNIT_STAT || !PARAM.SHOULD_DRAW_BUILD_STAT || t.build == null ? 10.0 : ((VAR.range.offBuildStatR + t.build.block.size * 0.5) * Vars.tilesize + 2.0)),
      thisFun.tmpStr, Fonts.outline,
      0.8, Color.white, Align.left, 0.0, 0.0, 10.0,
    );
  }.setProp({
    tmpT: null,
    tmpCd: 0.0,
    tmpStr: null,
  });
  exports.drawExtraInfo = drawExtraInfo;


  /**
   * Shows how bridges are connected and the transport destination.
   * @param {Building} b
   * @return {void}
   */
  const drawBridgeLine = function thisFun(b) {
    if(!PARAM.SHOULD_DRAW_BRIDGE_LINE) return;

    let tmpB = b, tmpOb, isFirst = true;
    if(b.block instanceof DirectionBridge) {
      tmpOb = b.findLink();
      thisFun.tmpBs.with(tmpB);
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
      thisFun.tmpBs.with(tmpB);
      while(ot != null) {
        tmpOb = ot.build;
        if(tmpOb != null && tmpOb.block === b.block && !thisFun.tmpBs.includes(tmpOb)) {
          if(!isFirst) _d_conCircleArrow(tmpOb, tmpB);
          thisFun.tmpBs.push(tmpOb);
          tmpB = ot.build;
          // On rare occasions this throws `NullPointerException`, WTF
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
  exports.drawBridgeLine = drawBridgeLine;
