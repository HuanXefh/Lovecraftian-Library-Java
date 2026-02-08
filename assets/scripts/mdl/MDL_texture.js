/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods related to sprites and pixmaps (or pixmap regions sometimes).
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MDL_color = require("lovec/mdl/MDL_color");


  /* <---------- region ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the default complete region for a block.
   * ---------------------------------------- */
  const _regBlk = function(blk_gn, shouldReturnName) {
    if(Vars.headless) return shouldReturnName ? "" : null;

    let blk = global.lovecUtil.fun._ct(blk_gn, "block");
    if(blk == null) return null;

    if(!shouldReturnName) {
      return blk.fullIcon;
    } else {
      return Core.atlas.has(blk.name + "-full") ?
        blk.name + "-full" :
        blk.name + "-icon";
    };
  };
  exports._regBlk = _regBlk;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the block heat region for the inputted size.
   * ---------------------------------------- */
  const _regHeat = function(size) {
    return Core.atlas.find("lovec-ast-block-heat" + Math.round(size));
  }
  .setAnno("non-headless");
  exports._regHeat = _regHeat;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a random region from variant regions, based on tile position.
   * ---------------------------------------- */
  const _regVari = function(blk_gn, t, off) {
    let blk = global.lovec.mdl_content._ct(blk_gn, "block");
    if(blk == null) return null;

    if(blk.variants === 0) return blk.region;

    if(off == null) off = 0;
    return blk.variantRegions[Math.floor(Mathf.randomSeed(t.pos() + off, 0.0, Mathf.maxZero(blk.variantRegions.length - 1) + 0.9999))];
  }
  .setAnno("non-headless");
  exports._regVari = _regVari;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a the base region of a turret.
   * ---------------------------------------- */
  const _regTurBase = function(blk_gn) {
    let blk = global.lovec.mdl_content._ct(blk_gn, "block");
    if(blk == null) return null;
    if(blk.baseRegion != null) return blk.baseRegion;

    if(blk instanceof Turret) {
      if(blk.drawer instanceof DrawTurret) {
        return blk.drawer.base;
      } else if(blk.drawer instanceof DrawMulti) {
        let drawTurret = blk.drawer.drawers.find(drawer => drawer instanceof DrawTurret);
        if(drawTurret != null) return drawTurret.base;
      };
    };

    return null;
  }
  .setAnno("non-headless");
  exports._regTurBase = _regTurBase;


  /* random overlay */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns a function that gets an array of random overlay regions.
   * See {DB_env.db["map"]["randRegTag"]}.
   * ---------------------------------------- */
  const _randRegsGetter = function(nm) {
    return function() {
      const arr = [];
      if(Vars.headless) return arr;

      let i = 0;
      while(Core.atlas.has(nm + (i + 1))) {
        arr.push(Core.atlas.find(nm + (i + 1)));
        i++;
      };

      return arr;
    };
  };
  exports._randRegsGetter = _randRegsGetter;


  /* <---------- pixmap ----------> */


  /* ----------------------------------------
   * IMPORTANT:
   *
   * In Lovec {pix} refers to both {Pixmap} and {PixmapRegion}.
   * The only thing you and I need to remember is, don't use {pix.each} which can lead to crash.
   * ---------------------------------------- */


  /* ----------------------------------------
   * NOTE:
   *
   * Draws pixels from {pixTop} on top of {pixBot}, ignores transparent pixels.
   * ---------------------------------------- */
  const _pix_stack = function(pixBot, pixTop, aThr) {
    let
      pix = new Pixmap(pixBot.width, pixBot.height),
      thr = Math.round(tryVal(aThr, 0.14) * 255),
      w = pix.width, h = pix.height;

    let x = 0, y;
    while(x < w) {
      y = 0;
      while(y < h) {
        pix.set(
          x, y,
          pixTop == null || pixTop.getA(x, y) < thr ?
            pixBot.get(x, y) :
            pixTop.get(x, y),
        );
        y++;
      };
      x++;
    };

    return pix;
  };
  exports._pix_stack = _pix_stack;


  /* ----------------------------------------
   * NOTE:
   *
   * Draws a smaller icon of {ct_gn} on top of {pixBase}.
   * ---------------------------------------- */
  const _pix_ctStack = function(pixBase, ct_gn) {
    let ct = global.lovecUtil.fun._ct(ct_gn);
    if(ct == null) ERROR_HANDLER.throw("noContentFound", ct_gn);
    let
      pixCt = Core.atlas.getPixmap(ct instanceof Block ? _regBlk(ct) : ct.fullIcon),
      pixCtStack = new Pixmap(pixBase.width, pixBase.height);

    pixCtStack.draw(pixCt, pixCtStack.width * 0.5, pixCtStack.height * 0.5, pixCtStack.width * 0.5, pixCtStack.height * 0.5);
    let pix = _pix_stack(pixBase, pixCtStack);
    pixCtStack.dispose();

    return pix;
  };
  exports._pix_ctStack = _pix_ctStack;


  /* ----------------------------------------
   * NOTE:
   *
   * Copies colors from {pixRef}, and recolor {pixBase} which is from a grayscale sprite.
   * ---------------------------------------- */
  const _pix_gsColor = function(pixBase, pixRef) {
    let pix = new Pixmap(pixBase.width, pixBase.height);
    let
      rawBaseColors = MDL_color._pixColors(pixBase),
      rawRefColors = MDL_color._pixColors(pixRef);
    // Make sure the two arrays match in length
    if(rawRefColors.length > rawBaseColors) {
      rawRefColors.length = rawBaseColors.length;
    } else if(rawRefColors.length < rawBaseColors) {
      if(rawRefColors.length === 0) throw new Error("Is the reference sprite empty???");
      while(rawRefColors.length < rawBaseColors.length) {
        rawRefColors.push(rawRefColors.last());
      };
    };
    let w = pix.width, h = pix.height;

    let x = 0, y, ind, rawColor;
    while(x < w) {
      y = 0;
      while(y < h) {
        rawColor = pixBase.get(x, y);
        ind = rawBaseColors.indexOf(rawColor);
        if(ind >= 0) {
          rawColor = rawRefColors[ind];
          pix.set(x, y, rawColor);
        };
        y++;
      };
      x++;
    };
    rawBaseColors.clear();
    rawRefColors.clear();

    return pix;
  };
  exports._pix_gsColor = _pix_gsColor;


  const comp_createIcons_ctTag = function(ct, packer, ctUnd_gn, ctOv_gn, suffix) {
    let ctUnd = global.lovecUtil.fun._ct(ctUnd_gn);
    if(ctUnd == null) ERROR_HANDLER.throw("noContentFound", ctUnd_gn);
    let ctOv = global.lovecUtil.fun._ct(ctOv_gn);
    if(ctOv == null) ERROR_HANDLER.throw("noContentFound", ctOv_gn);

    let pix = _pix_ctStack(Core.atlas.getPixmap(ctUnd.name), ctOv);
    packer.add(MultiPacker.PageType.main, ct.name + suffix, pix);
    pix.dispose();
  };
  exports.comp_createIcons_ctTag = comp_createIcons_ctTag;
