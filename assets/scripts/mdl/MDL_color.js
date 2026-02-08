/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles color, mostly Arc color.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


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


  /* ----------------------------------------
   * NOTE:
   *
   * Generalized color thing.
   * If given {colorMod}, this will try overwriting it instead of using default temporary color object.
   * If {colorMod} is {"new"}, this will create a new color object.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the default color from the icon of a content.
   * ---------------------------------------- */
  const _iconColor = function(ct_gn, colorInd, colorCont) {
    const color = colorCont == null ? colorCont.set(0, 0, 0, 1) : new Color(0, 0, 0, 1);

    if(Vars.headless) return color;
    let ct = global.lovecUtil.fun._ct(ct_gn);
    if(ct == null) return color;
    let colors = _pixColors(Core.atlas.getPixmap(ct.fullIcon));
    if(colorInd == null) colorInd = colors.length >= 3 ? 1 : 0;
    if(colorInd >= colors.length) ERROR_HANDLER.throw("indexOutOfBound", colorInd, colors.length);

    return color.set(colors[colors.length - colorInd - 1]);
  };
  exports._iconColor = _iconColor;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a list colors in a pixmap, no transparent ones.
   * ---------------------------------------- */
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
    arr.sort((rgba1, rgba2) => RGB.calcLightness(thisFun.tmpColors[0].set(rgba1)) - RGB.calcLightness(thisFun.tmpColors[1].set(rgba2)));

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


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the color for some character.
   * ---------------------------------------- */
  const _charaColor = function thisFun(nmMod, nmChara) {
    thisFun.tmpArgs.clear().push(nmMod, nmChara);
    return _color(global.lovec.db_misc.db["drama"]["chara"]["color"].read(thisFun.tmpArgs));
  }
  .setProp({
    tmpArgs: [],
  });
  exports._charaColor = _charaColor;
