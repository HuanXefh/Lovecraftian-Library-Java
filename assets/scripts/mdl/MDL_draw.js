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


  /* <------------------------------ progress ------------------------------ */


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
          if(!isFirst) LCDrawf.connectorCircleArrow(tmpOb, tmpB, null);
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
          if(!isFirst) LCDrawf.connectorCircleArrow(tmpOb, tmpB, null);
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
