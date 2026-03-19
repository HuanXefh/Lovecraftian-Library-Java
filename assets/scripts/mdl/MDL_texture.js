/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods related to sprites and pixmaps (or pixmap regions sometimes).
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- region ----------> */


  /**
   * Gets default full region of some block.
   * @param {BlockGn} blk_gn
   * @param {boolean|unset} [shouldReturnName]
   * @return {TextureRegion|string}
   */
  const _regBlk = function(blk_gn, shouldReturnName) {
    if(Vars.headless) return shouldReturnName ? "" : ARC_AIR.reg;

    let blk = findContent(blk_gn);
    if(blk == null) return ARC_AIR.reg;
    if(!shouldReturnName) return blk.fullIcon;

    return Core.atlas.has(blk.name + "-full") ?
      blk.name + "-full" :
      blk.name + "-icon";
  }
  .setCache();
  exports._regBlk = _regBlk;


  /**
   * Gets heat region for a size, usually used as default heat region for blocks.
   * @param {number} size
   * @return {TextureRegion}
   */
  const _regHeat = function(size) {
    return Vars.headless ? ARC_AIR.reg : Core.atlas.find("lovec-ast-block-heat" + Math.round(size));
  }
  .setCache();
  exports._regHeat = _regHeat;


  /**
   * Gets a random region from a block's variant regions based on tile position.
   * @param {BlockGn} blk_gn
   * @param {Tile} t
   * @param {number|unset} [off]
   * @return {TextureRegion}
   */
  const _regVari = function(blk_gn, t, off) {
    let blk = MDL_content._ct(blk_gn, "block");
    if(blk == null) return ARC_AIR.reg;
    if(blk.variants === 0) return blk.region;

    if(off == null) off = 0;
    return blk.variantRegions[Math.floor(Mathf.randomSeed(t.pos() + off, 0.0, Mathf.maxZero(blk.variantRegions.length - 1) + 0.9999))];
  }
  .setAnno("non-headless", null, ARC_AIR.reg);
  exports._regVari = _regVari;


  /**
   * Gets base region of a turret.
   * @param {BlockGn} blk_gn
   * @return {TextureRegion}
   */
  const _regTurBase = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "block");
    if(blk == null) return ARC_AIR.reg;
    if(blk.baseRegion != null) return blk.baseRegion;

    if(blk instanceof Turret) {
      if(blk.drawer instanceof DrawTurret) {
        return blk.drawer.base;
      } else if(blk.drawer instanceof DrawMulti) {
        let drawTurret = blk.drawer.drawers.find(drawer => drawer instanceof DrawTurret);
        if(drawTurret != null) return drawTurret.base;
      };
    };

    return ARC_AIR.reg;
  }
  .setCache()
  .setAnno("non-headless", null, ARC_AIR.reg);
  exports._regTurBase = _regTurBase;


  /* random overlay */


  /**
   * Converts texture name to random overlay region getter.
   * See {@link DB_env}.
   * @param {string} nm
   * @return {function(): TextureRegion[]}
   */
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


  /**
   * <IMPORTANT>: Do not use `each` method on {@link PixmapGn}!
   */


  /**
   * Draws a pixmap over another pixmap, ignores transparent pixels.
   * @param {PixmapGn} pixBot
   * @param {PixmapGn} pixTop
   * @param {number|unset} [aThr] - Alpha thresh below which top pixel is ignored.
   * @return {Pixmap}
   */
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


  /**
   * Draws a smaller icon of some content over a pixmap in the bottom right corner.
   * @param {PixmapGn} pixBase
   * @param {ContentGn} ct_gn
   * @return {Pixmap}
   */
  const _pix_ctStack = function(pixBase, ct_gn) {
    let ct = findContent(ct_gn);
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


  /**
   * Copies colors from a reference pixmap, and returns recolored base pixmap.
   * @param {PixmapGn} pixBase - Expected to be grayscale.
   * @param {PixmapGn} pixRef
   * @return {Pixmap}
   */
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


  /* <---------- icon packing ----------> */


  /**
   * Base for methods that packs new icon.
   * New texture regions will be named as "<nmCt>-<suffix>".
   * @param {UnlockableContent} ct
   * @param {MultiPacker} packer
   * @param {string} suffix
   * @param {function(): Pixmap} pixGetter
   * @param {MultiPacker.PageType|unset} [pageType]
   */
  const _ip_base = function(ct, packer, suffix, pixGetter, pageType) {
    let pix = pixGetter();
    packer.add(tryVal(pageType, MultiPacker.PageType.main), ct.name + suffix, pix);
    pix.dispose();
  };
  exports._ip_base = _ip_base;


  /**
   * Creates a content icon tag sprite for some content.
   * @param {UnlockableContent} ct
   * @param {MultiPacker} packer
   * @param {string} suffix
   * @param {ContentGn} ctUnd_gn
   * @param {ContentGn} ctOv_gn
   */
  const _ip_ctTg = function(ct, packer, suffix, ctUnd_gn, ctOv_gn) {
    let ctUnd = findContent(ctUnd_gn);
    if(ctUnd == null) ERROR_HANDLER.throw("noContentFound", ctUnd_gn);
    let ctOv = findContent(ctOv_gn);
    if(ctOv == null) ERROR_HANDLER.throw("noContentFound", ctOv_gn);

    _ip_base(ct, packer, suffix, () => _pix_ctStack(Core.atlas.getPixmap(ctUnd.name), ctOv));
  };
  exports._ip_ctTg = _ip_ctTg;
