/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Methods related to sprites and pixmaps (or pixmap regions sometimes).
     * @module lovec/mdl/MDL_texture
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ region ------------------------------> */


    /**
     * Gets default full region of some block.
     * @param {BlockGn} blk_gn
     * @param {boolean|unset} [shouldReturnName]
     * @return {TextureRegion|string}
     */
    const getRegBlk = function(blk_gn, shouldReturnName) {
        if(Vars.headless) return shouldReturnName ? "" : LCAirObjects.textureRegion;

        let blk = findContent(blk_gn);
        if(blk == null) return LCAirObjects.textureRegion;

        return shouldReturnName ?
            LCTexture.getBlockRegionString(blk) :
            LCTexture.getBlockRegion(blk);
    }
    .setCache();
    exports.getRegBlk = getRegBlk;


    /**
     * Gets part of a block region in a tile.
     * Offsets increase when from top left to bottom right.
     * @param {BlockGn} blk_gn
     * @param {number} offTx
     * @param {number} offTy
     * @param {number|unset} [tileWidth]
     * @return {TextureRegion}
     */
    const getRegBlkTileCut = function(blk_gn, offTx, offTy, tileWidth) {
        if(tileWidth == null) tileWidth = 32.0;
        let reg = getRegBlk(blk_gn);
        if(reg === LCAirObjects.textureRegion) return reg;
        return new TextureRegion(reg, offTx * tileWidth, offTy * tileWidth, tileWidth, tileWidth);
    }
    .setCache();
    exports.getRegBlkTileCut = getRegBlkTileCut;


    /**
     * Gets a random region from a block's variant regions based on tile position.
     * @param {BlockGn} blk_gn
     * @param {Tile} t
     * @param {number|unset} [off]
     * @return {TextureRegion}
     */
    const getRegVari = function(blk_gn, t, off) {
        if(Vars.headless) return LCAirObjects.textureRegion;
        let blk = MDL_content.getCt(blk_gn, ContentGetModes.BLK);
        if(blk == null) return LCAirObjects.textureRegion;
        if(blk.variants === 0) return blk.region;
        if(off == null) off = 0;
        return blk.variantRegions[Math.floor(Mathf.randomSeed(t.pos() + off, 0.0, Mathf.maxZero(blk.variantRegions.length - 1) + 0.9999))];
    };
    exports.getRegVari = getRegVari;


    /**
     * Gets base region of a turret.
     * @param {BlockGn} blk_gn
     * @return {TextureRegion}
     */
    const getRegTurBase = function(blk_gn) {
        if(Vars.headless) return LCAirObjects.textureRegion;
        let blk = MDL_content.getCt(blk_gn, ContentGetModes.BLK);
        if(blk == null) return LCAirObjects.textureRegion;
        if(blk.baseRegion != null) return blk.baseRegion;

        if(blk instanceof Turret) {
            if(blk.drawer instanceof DrawTurret) {
                return blk.drawer.base;
            } else if(blk.drawer instanceof DrawMulti) {
                let drawTurret = blk.drawer.drawers.find(drawer => drawer instanceof DrawTurret);
                if(drawTurret != null) return drawTurret.base;
            };
        };

        return LCAirObjects.textureRegion;
    }
    .setCache();
    exports.getRegTurBase = getRegTurBase;


    /* random overlay */


    /**
     * Converts texture name to random overlay region getter.
     * See {@link DB_env.db.map.randRegTag}.
     * @param {string} name
     * @return {F0Function<Array<TextureRegion>>}
     */
    const getRandRegsF = function(name) {
        return function() {
          let arr = [];
          if(Vars.headless) return arr;

          let i = 0;
          while(Core.atlas.has(name + (i + 1))) {
              arr.push(Core.atlas.find(name + (i + 1)));
              i++;
          };

          return arr;
        };
    };
    exports.getRandRegsF = getRandRegsF;


    /* <------------------------------ pixmap ------------------------------> */


    /**
     * `IMPORTANT`: Do not use `each` method on {@link PixmapGn}!
     */


    /**
     * Draws a pixmap over another pixmap, ignores transparent pixels.
     * @param {PixmapGn} pixBot
     * @param {PixmapGn} pixTop
     * @param {number|unset} [aThr] - Alpha thresh below which top pixel is ignored.
     * @return {Pixmap}
     */
    const stackPix = function(pixBot, pixTop, aThr) {
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
    exports.stackPix = stackPix;


    /**
     * Draws a smaller icon of some content over a pixmap in the bottom right corner.
     * @param {PackContext} packer
     * @param {PixmapGn} pixBase
     * @param {ContentGn} ct_gn
     * @return {Pixmap}
     */
    const stackPixWithCt = function(packer, pixBase, ct_gn) {
        let ct = findContent(ct_gn);
        if(ct == null) throw new LCError.ContentNotFoundError(ct_gn);
        let
            pixCt,
            pixCtStack = new Pixmap(pixBase.width, pixBase.height);

        if(ct instanceof Block) {
            pixCt = packer.has(ct.name + "-icon") ?
                packer.get(ct.name + "-icon") :
                packer.has(ct.name + "-full") ?
                    packer.get(ct.name + "-full") :
                    packer.get(ct.name);
        } else {
            pixCt = packer.get(ct.name);
        };

        pixCtStack.draw(pixCt, pixCtStack.width * 0.5, pixCtStack.height * 0.5, pixCtStack.width * 0.5, pixCtStack.height * 0.5);
        let pix = stackPix(pixBase, pixCtStack);
        pixCtStack.dispose();

        return pix;
    };
    exports.stackPixWithCt = stackPixWithCt;


    /**
     * Copies colors from a reference pixmap, and returns recolored base pixmap.
     * @param {PixmapGn} pixBase - Expected to be grayscale.
     * @param {PixmapGn} pixRef
     * @return {Pixmap}
     */
    const recolorPix = function(pixBase, pixRef) {
        let pix = new Pixmap(pixBase.width, pixBase.height);
        let
            rawBaseColors = MDL_color.getPixColors(pixBase),
            rawRefColors = MDL_color.getPixColors(pixRef);

        // Make sure the two arrays match in length
        if(rawRefColors.length > rawBaseColors) {
            rawRefColors.length = rawBaseColors.length;
        } else if(rawRefColors.length < rawBaseColors) {
            if(rawRefColors.length === 0) throw new Error("Is the reference sprite empty???");
            while(rawRefColors.length < rawBaseColors.length) {
                rawRefColors.push(rawRefColors.last());
            };
        };

        let
            w = pix.width,
            h = pix.height,
            x = 0,
            y,
            ind,
            rawColor;

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
    exports.recolorPix = recolorPix;


    /* <------------------------------ icon packing ------------------------------> */


    /**
     * Base for methods that packs new icon.
     * New texture regions will be named as `<nameCt>-<suffix>`.
     * @param {UnlockableContent} ct
     * @param {PackContext} packer
     * @param {string|unset} suffix
     * @param {F0Function<Pixmap>} pixF
     * @return {void}
     */
    const packIcon = function(ct, packer, suffix, pixF) {
        if(suffix == null) suffix = "";
        let pix = pixF();
        LCCompatibilityHandler.isV8 ?
            packer.add(eval("MultiPacker.PageType.main"), ct.name + suffix, pix) :
            packer.add(ct.name + suffix, pix);
        pix.dispose();
    };
    exports.packIcon = packIcon;


    /**
     * Creates a content icon tag sprite for some content.
     * @param {UnlockableContent} ct
     * @param {PackContext} packer
     * @param {string|unset} suffix
     * @param {ContentGn} ctUnd_gn
     * @param {ContentGn} ctOv_gn
     * @return {void}
     */
    const packIconWithCt = function(ct, packer, suffix, ctUnd_gn, ctOv_gn) {
        let ctUnd = findContent(ctUnd_gn);
        if(ctUnd == null) throw new LCError.ContentNotFoundError(ctUnd_gn);
        let ctOv = findContent(ctOv_gn);
        if(ctOv == null) throw new LCError.ContentNotFoundError(ctOv_gn);
        packIcon(ct, packer, suffix, () => stackPixWithCt(packer, packer.get(ctUnd.name), ctOv));
    };
    exports.packIconWithCt = packIconWithCt;
