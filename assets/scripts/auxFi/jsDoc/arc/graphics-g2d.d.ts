/** arc.graphics.g2d.TextureAtlas */
declare class TextureAtlas implements Disposable {
    addRegion(name: string, reg: TextureRegion): TextureAtlas.AtlasRegion
    addRegion(name: string, tex: Texture, x: number, y: number, w: number, h: number): TextureAtlas.AtlasRegion
    disposePixmap(tex: Texture): void

    has(name: string): boolean
    find(name: string): TextureAtlas.AtlasRegion
    find(name: string, def: string): TextureRegion
    find(name: string, def: TextureRegion): TextureRegion

    drawable(name: string): Drawable
    getDrawable(name: string): Drawable
}
declare namespace TextureAtlas {
    class AtlasRegion extends TextureRegion {
        pixmapRegion: PixmapRegion;
        name: string;
        offsetX: number;
        offsetY: number;
        packedWith: number;
        packedHeight: number;
        originalWidth: number;
        originalHeight: number;
        rotate: boolean;
        splits: Array<java.lang.Integer>;
        pads: Array<java.lang.Integer>;
    }
}


/** arc.graphics.g2d.Batch */
declare class Batch implements Disposable {}


/** arc.graphics.g2d.Draw */
declare class Draw {}


/** arc.graphics.g2d.Fill */
declare class Fill {}


/** arc.graphics.g2d.Lines */
declare class Lines {}


/** arc.graphics.g2d.Bloom */
declare class Bloom {}


/** arc.graphics.g2d.Animation */
declare class Animation {}
