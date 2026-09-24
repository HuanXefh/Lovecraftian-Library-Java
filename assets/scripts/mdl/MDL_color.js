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


    /* <------------------------------ base ------------------------------> */


    /** @type {Array<Color>} */
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
     * Result color object is reused by default.
     * <br> Use "null" to return null.
     * @param {ColorGn} color_gn
     * @param {string|Color|unset} [contColor] - If given color, it will be the output. If given "new", this method will return a new {@link Color} object.
     * @return {Color|null}
     */
    const getColor = function(color_gn, contColor) {
        if(color_gn == "null") return null;
        if(contColor == null) contColor = tmpColors[9];
        if(color_gn == null) return contColor == "new" ? Color.white.cpy() : Color.white;
        return getColor.convertColor(color_gn, contColor);
    }
    .setProp({
        /**
         * @memberof getColor
         * @return {Color}
         */
        convertColor: newMultiFunction(
            [Tile, null], (t, contColor) => contColor == "new" ? new Color(t.getFloorColor()) : t.getFloorColor(),
            [Item, null], (item, contColor) => contColor == "new" ? item.color.cpy() : item.color,
            [Liquid, null], (liq, contColor) => contColor == "new" ? liq.color.cpy() : liq.color,
            [Team, null], (team, contColor) => contColor == "new" ? team.color.cpy() : team.color,
            ["number", null], (num, contColor) => contColor == "new" ? new Color(Math.round(num)) : contColor.set(Math.round(num)),
            ["boolean", null], (bool, contColor) => contColor == "new" ? (bool ? Pal.accent : Pal.remove).cpy() : (bool ? Pal.accent : Pal.remove),
            ["string", null], (str, contColor) => contColor == "new" ? Color.valueOf(str) : Color.valueOf(contColor, str),
            [Color, null], (color, contColor) => contColor == "new" ? color.cpy() : color,
        ),
    });
    exports.getColor = getColor;


    /* <------------------------------ sprite ------------------------------> */


    /**
     * Gets the default color of some content.
     * Should only be called in `createIcons`.
     * @param {Color|unset} contColor
     * @param {PackContext} packer
     * @param {ContentGn} ct_gn
     * @param {number|unset} [colorInd] - Index of the result color in colors found (light to dark), leave empty for automatic selection.
     * @return {Color}
     */
    const getIconColor = function(contColor, packer, ct_gn, colorInd) {
        let color = contColor != null ? contColor.set(0, 0, 0, 1) : new Color(0, 0, 0, 1);
        if(Vars.headless) return color;
        let ct = findContent(ct_gn);
        if(ct == null) return color;
        let colors = getPixColors(packer.get(ct.name));
        if(colorInd == null) colorInd = colors.length >= 3 ? 1 : 0;
        if(colorInd >= colors.length) {
            colorInd = colors.length - 1;
        };
        return color.set(colors[colors.length - colorInd - 1]);
    };
    exports.getIconColor = getIconColor;


    /**
     * Gets a list of colors present in a pixmap excluding transparent ones.
     * <br> DO NOT try moving this to Java, which is not really faster and spawns a lot of bugs!
     * @param {PixmapGn} pix_gn
     * @param {boolean|unset} [useArcColor] - If true, this method will return Arc colors instead of numbers.
     * @return {Array<number>|Array<Color>}
     */
    const getPixColors = function thisFun(pix_gn, useArcColor) {
        // No need for temporary array, there are always new color objects anyway
        let arr = [];

        let
            w = pix_gn.width, h = pix_gn.height,
            x = 0, y, rawColor;
        while(x < w) {
            y = 0;
            while(y < h) {
                rawColor = pix_gn.get(x, y);
                if(pix_gn.getA(x, y) > 192 && !arr.includes(rawColor)) {
                    arr.push(Number(rawColor));
                };
                y++;
            };
            x++;
        };
        if(arr.length === 0) return arr;

        // Cursed color comparison
        arr.sort((rgba1, rgba2) => LCRgb.calcLightness(thisFun.tmpColors[0].set(rgba1)) - LCRgb.calcLightness(thisFun.tmpColors[1].set(rgba2)));

        return !useArcColor ?
            arr :
            arr.inSituMap(rawColor => new Color(rawColor));
    }
    .setProp({
        /**
         * @memberof getPixColors
         * @type {Array<Color>}
         */
        tmpColors: [
            new Color(),
            new Color(),
        ],
    });
    exports.getPixColors = getPixColors;


    /* <------------------------------ misc ------------------------------> */


    /**
     * Gets the color of some character.
     * Used mostly for dialog flow texts.
     * @param {string} nameMod
     * @param {string} nameChara
     * @return {Color}
     */
    const getCharaColor = function thisFun(nameMod, nameChara) {
        thisFun.tmpArgs.with(nameMod, nameChara);
        return getColor(DB_misc.db["drama"]["chara"]["color"].read(thisFun.tmpArgs));
    }
    .setProp({
        /**
         * @memberof getCharaColor
         * @type {[string, string]}
         */
        tmpArgs: [],
    });
    exports.getCharaColor = getCharaColor;
