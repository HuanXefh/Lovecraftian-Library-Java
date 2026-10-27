/** lovec.graphics.SLCDraw */
declare class SLCDraw {}
/** lovec.graphics.SLCDrawf */
declare class SLCDrawf {}
/** lovec.graphics.SLCDrawP3d */
declare class SLCDrawP3d {}


/** lovec.graphics.SLCPal */
declare class SLCPal {}
/** lovec.graphics.SLCRgb */
declare class SLCRgb {
    static calcLuminance(color: Color): number
    static calcLuminance(r: number, g: number, b: number, a?: number): number
    static calcLightness(color: Color): number
    static calcLightness(r: number, g: number, b: number, a?: number): number
    static grayscale(color: Color): Color
    static grayscale(r: number, g: number, b: number, a?: number): Color
    static negative(color: Color): Color
    static negative(r: number, g: number, b: number, a?: number): Color
}


/** lovec.graphics.SLCTexture */
declare class SLCTexture {}
