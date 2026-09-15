/** arc.graphics.Camera */
declare class Camera {}


/** arc.graphics.blending */
declare class Blending {
    static normal: Blending;
    static additive: Blending;
    static disabled: Blending;
}


/** arc.graphics.Color */
declare class Color {
    static readonly white: Color;
    static readonly lightGray: Color;
    static readonly gray: Color;
    static readonly darkGray: Color;
    static readonly black: Color;
    static readonly clear: Color;
    static readonly blue: Color;
    static readonly navy: Color;
    static readonly royal: Color;
    static readonly slate: Color;
    static readonly sky: Color;
    static readonly cyan: Color;
    static readonly teal: Color;
    static readonly green: Color;
    static readonly acid: Color;
    static readonly lime: Color;
    static readonly forest: Color;
    static readonly olive: Color;
    static readonly yellow: Color;
    static readonly gold: Color;
    static readonly goldenrod: Color;
    static readonly orange: Color;
    static readonly brown: Color;
    static readonly tan: Color;
    static readonly brick: Color;
    static readonly red: Color;
    static readonly scarlet: Color;
    static readonly crimson: Color;
    static readonly coral: Color;
    static readonly salmon: Color;
    static readonly pink: Color;
    static readonly magenta: Color;
    static readonly purple: Color;
    static readonly violet: Color;
    static readonly maroon: Color;

    static readonly whiteFloatBits: number;
    static readonly clearFloatBits: number;
    static readonly blackFloatBits: number;
    static readonly whiteRgba: number;
    static readonly clearRgba: number;
    static readonly blackRgba: number;

    r: number;
    g: number;
    b: number;
    a: number;

    constructor()
    constructor(rgba: number)
    constructor(color: Color)
    constructor(r: number, g: number, b: number, a?: number)

    static valueOf(colorStr: string): Color
    static valueOf(color: Color, colorStr: string): Color
    static toFloatBits(r: number, g: number, b: number, a: number): java.lang.Float
    static toDoubleBits(r: number, g: number, b: number, a: number): java.lang.Double
    static floatToIntColor(val: java.lang.Float): java.lang.Integer
    static intToFloatColor(val: java.lang.Integer): java.lang.Float
    static rgb(r: number, g: number, b: number): Color
    static rgb565(r: number, g: number, b: number): number
    static rgba4444(r: number, g: number, b: number, a: number): number
    static rgb888(r: number, g: number, b: number): number
    static rgba8888(r: number, g: number, b: number, a: number): number
    static abgr(r: number, g: number, b: number, a: number): number
    static argb8888(a: number, r: number, g: number, b: number): number
    static packRgba(r: number, g: number, b: number, a: number): number
    static alpha(a: number): number
    static luminanceAlpha(lumin: number, a: number): number
    static grays(val: number): Color
    static HSVtoRGB(h: number, s: number, v: number, a?: number): Color
    static HSVtoRGB(h: number, s: number, v: number, contColor: Color): Color
    static RGBtoHSV(color: Color): Array<number>
    static RGBtoHSV(r: number, g: number, b: number): Array<number>
    static ri(rgba: number): number
    static gi(rgba: number): number
    static bi(rgba: number): number
    static ai(rgba: number): number
    static muli(ca: number, cb: number): number
    static muli(rgba: number, val: number): number

    set(ocolor: Color): this
    set(vec3: Vec3): this
    set(val: number): this
    set(r: number, g: number, b: number, a?: number): this
    write(ocolor: Color): Color
    sum(): number
    diff(ocolor: Color): number
    clamp(): this
    add(ocolor: Color): this
    add(r: number, g: number, b: number, a?: number): this
    sub(ocolor: Color): this
    sub(r: number, g: number, b: number, a?: number): this
    mul(ocolor: Color): this
    mul(val: number): this
    mul(r: number, g: number, b: number, a: number): this
    mula(val: number): this
    mulA(a: number): this
    inv(): this
    premultiplyAlpha(): this
    toFloatBits(): java.lang.Float
    toDoubleBits(): java.lang.Double
    fromDouble(doubleBits: number): this
    hashCode(): java.lang.Integer
    rgb565(): number
    rgb565(val: number): this
    rgba4444(): number
    rgba4444(val: number): this
    rgb888(): number
    rgb888(val: number): this
    rgba(): number
    rgba8888(): number
    argb8888(val: number): this
    argb8888(): number
    abgr(): number
    abgr8888(val: number): this
    rand(): Color
    randHue(): Color
    fromHsv(hsv: Array<number>): this
    fromHsv(h: number, s: number, v: number): this
    toHsv(hsv: Array<number>): Array<number>
    hue(): number
    hue(val: number): this
    shiftHue(val: number): this
    saturation(): number
    saturation(val: number): this
    shiftSaturation(val: number): this
    value(): number
    value(val: number): this
    shiftValue(val: number): this
    lerp(ocolor: Color, lerpA: number): this
    lerp(ocolors: Array<Color>, lerpA: number): this
    lerp(r: number, g: number, b: number, a: number, lerpA: number): this
    dst(ocolor: Color): number
    equals(obj: Object): boolean
    cpy(): Color
}


/** arc.graphics.Mesh */
declare class Mesh {}


/** arc.graphics.Texture */
declare class Texture {}
declare namespace Texture {
    class TextureFilter {
        static nearest: Texture.TextureFilter;
        static linear: Texture.TextureFilter;
        static mipMap: Texture.TextureFilter;
        static mipMapNearestNearest: Texture.TextureFilter;
        static mipMapLinearNearest: Texture.TextureFilter;
        static mipMapNearestLinear: Texture.TextureFilter;
        static mipMapLinearLinear: Texture.TextureFilter;
    }
    class TextureWrap {
        static mirroredRepeat: Texture.TextureFilter;
        static clampToEdge: Texture.TextureFilter;
        static repeat: Texture.TextureFilter;
    }
}
/** arc.graphics.TextureRegion */
declare class TextureRegion {}


/** arc.graphics.Pixmap */
declare class Pixmap {}
/** arc.graphics.g2d.PixmapRegion */
declare class PixmapRegion {}
/** arc.graphics.Pixmaps */
declare class Pixmaps {
    static blankPixmap(): Pixmap
    static blankTexture(): Texture
    static huePixmap(w: number, h: number): Pixmap
    static hueTexture(w: number, h: number): Texture
    static drawPixel(tex: Texture, x: number, y: number, rawColor: number): void

    static noise(w: number, h: number): Pixmap
    static noiseTex(w: number, h: number): Texture
    static flip(pix: Pixmap): void
    static blend(pix: PixmapRegion, pixOv: PixmapRegion, a: number): Pixmap
    static median(pix: Pixmap, rad: number, percentile: number, tmp?: IntSeq): Pixmap
    static scale(pix: Pixmap, scl: number): Pixmap
    static scale(pix: Pixmap, sclX: number, sclY: number): Pixmap
    static scale(pix: Pixmap, w: number, h: number, useFilter: boolean): Pixmap
    static outline(pix: PixmapRegion, color: Color, rad?: number, pad?: number): Pixmap
    static zoom(pix: Pixmap, scl: number): Pixmap
    static resize(pix: Pixmap, w: number, h: number, bgRawColor?: number): Pixmap
    static crop(pix: Pixmap, x: number, y: number, w: number, h: number): Pixmap
    static rotate(pix: Pixmap, ang: number): Pixmap
    static bleed(pix: Pixmap, iCap?: number): Pixmap
    static antialias(pix: Pixmap): void
}
/** arc.graphics.PixmapIO */
declare class PixmapIO {
    static writePng(fi: Fi, pix: Pixmap): void
    static writePngBytes(pix: Pixmap): Array<java.lang.Byte>
    static readPNG(fi: Fi): Pixmap
    static readPNG(bytes: Array<java.lang.Byte>): Pixmap
}
/** arc.graphics.PixmapPacker */
declare class PixmapPacker {}


/** arc.graphics.g2d.Font */
declare class Font {}
/** arc.graphics.g2d.GlyphLayout */
declare class GlyphLayout {}


/** arc.graphics.GL20 */
interface GL20 {}
/** arc.graphics.GL30 */
interface GL30 extends GL20 {}


/** arc.graphics.GLTexture */
declare class GLTexture implements Disposable {}
/** arc.graphics.Cubemap */
declare class Cubemap extends GLTexture {}
