/** lovec.graphics.LCDraw */
declare class LCDraw {}
/** lovec.graphics.LCDrawf */
declare class LCDrawf {}
/** lovec.graphics.LCDrawP3D */
declare class LCDrawP3D {}


/** lovec.graphics.LCRgb */
declare class LCRgb {
    static calcLuminance(color: Color): number
    static calcLuminance(r: number, g: number, b: number, a?: number): number
    static calcLightness(color: Color): number
    static calcLightness(r: number, g: number, b: number, a?: number): number
    static grayscale(color: Color): Color
    static grayscale(r: number, g: number, b: number, a?: number): Color
    static negative(color: Color): Color
    static negative(r: number, g: number, b: number, a?: number): Color
}


/** lovec.graphics.LCTexture */
declare class LCTexture {}
