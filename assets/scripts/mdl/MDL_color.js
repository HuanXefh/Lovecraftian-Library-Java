/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Handles color, mostly Arc color.
   * @module lovec/mdl/MDL_color
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  const tmpColors = [
    new Color(),
    new Color(),
    new Color(),
    new Color(),
    new Color(),
    new Color(),
    new Color(),
    new Color(),
    new Color(),
    new Color(),
  ];


  /**
   * Converts generalized color to Arc color.
   * Use "null" to return null.
   * @param {ColorGn} color_gn
   * @param {string|Color|unset} [colorMod] - If given color, it will be the output. If given "new", the method will return a new instance of {@link Color}.
   * @return {Color|null}
   */
  const _color = function(color_gn, colorMod) {
    if(color_gn === "null") return null;
    if(colorMod == null) colorMod = tmpColors[9];
    if(color_gn == null) return colorMod === "new" ? Color.white.cpy() : Color.white;

    return _color.tmpGetter(color_gn, colorMod);
  }
  .setProp({
    tmpGetter: newMultiFunction(
      [Tile, null], (t, colorMod) => colorMod === "new" ? new Color(t.getFloorColor()) : t.getFloorColor(),
      [Item, null], (itm, colorMod) => colorMod === "new" ? itm.color.cpy() : itm.color,
      [Liquid, null], (liq, colorMod) => colorMod === "new" ? liq.color.cpy() : liq.color,
      [Team, null], (team, colorMod) => colorMod === "new" ? team.color.cpy() : team.color,
      ["number", null], (num, colorMod) => colorMod === "new" ? new Color(Math.round(num)) : colorMod.set(Math.round(num)),
      ["boolean", null], (bool, colorMod) => colorMod === "new" ? (bool ? Pal.accent : Pal.remove).cpy() : (bool ? Pal.accent : Pal.remove),
      ["string", null], (str, colorMod) => colorMod === "new" ? Color.valueOf(str) : Color.valueOf(colorMod, str),
      [Color, null], (color, colorMod) => colorMod === "new" ? color.cpy() : color,
    ),
  });
  exports._color = _color;


  /* <---------- sprite ----------> */


  /**
   * Gets the default color of some content, from its icon.
   * Should only be called in `createIcons`.
   * @param {ContentGn} ct_gn
   * @param {number|unset} [colorInd] - Index of the final color, leave empty for automatic selection.
   * @param {Color|unset} [colorCont]
   * @return {Color}
   */
  const _iconColor = function(ct_gn, colorInd, colorCont) {
    const color = colorCont != null ? colorCont.set(0, 0, 0, 1) : new Color(0, 0, 0, 1);
    if(Vars.headless) return color;
    let ct = findContent(ct_gn);
    if(ct == null) return color;
    let colors = _pixColors(Core.atlas.getPixmap(ct.fullIcon));
    if(colorInd == null) colorInd = colors.length >= 3 ? 1 : 0;
    if(colorInd >= colors.length) ERROR_HANDLER.throw("indexOutOfBound", colorInd, colors.length);

    return color.set(colors[colors.length - colorInd - 1]);
  };
  exports._iconColor = _iconColor;


  /**
   * Gets a list of colors present in a pixmap excluding transparent ones.
   * @param {PixmapGn} pix
   * @param {boolean|unset} [useArcColor] - If true, this method will return Arc colors instead of numbers.
   * @return {Array<number>|Array<Color>}
   */
  const _pixColors = function thisFun(pix, useArcColor) {
    // No need for temporary array, there are always new color objects anyway
    const arr = [];

    let
      w = pix.width, h = pix.height,
      x = 0, y, rawColor;
    while(x < w) {
      y = 0;
      while(y < h) {
        rawColor = pix.get(x, y);
        if(pix.getA(x, y) > 192 && !arr.includes(rawColor)) {
          arr.push(Number(rawColor));
        };
        y++;
      };
      x++;
    };
    // Cursed color comparison
    arr.sort((rgba1, rgba2) => LCRgb.calcLightness(thisFun.tmpColors[0].set(rgba1)) - LCRgb.calcLightness(thisFun.tmpColors[1].set(rgba2)));

    return !useArcColor ?
      arr :
      arr.inSituMap(rawColor => new Color(rawColor));
  }
  .setProp({
    tmpColors: [
      new Color(),
      new Color(),
    ],
  });
  exports._pixColors = _pixColors;


  /* <---------- misc ----------> */


  /**
   * Gets the color of some character.
   * Used mostly for dialog flow texts.
   * @param {string} nmMod
   * @param {string} nmChara
   * @return {Color}
   */
  const _charaColor = function thisFun(nmMod, nmChara) {
    thisFun.tmpArgs.clear().push(nmMod, nmChara);
    return _color(DB_misc.db["drama"]["chara"]["color"].read(thisFun.tmpArgs));
  }
  .setProp({
    tmpArgs: [],
  });
  exports._charaColor = _charaColor;
