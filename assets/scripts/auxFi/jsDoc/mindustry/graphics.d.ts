/** mindustry.graphics.Layer */
declare class Layer {}


/** mindustry.graphics.Pal */
declare class Pal {}


/** mindustry.graphics.Drawf */
declare class Drawf {}


/** mindustry.graphics.Shaders */
declare class Shaders {}


/** mindustry.graphics.CacheLayer */
declare class CacheLayer {}


/** mindustry.graphics.MultiPacker */
declare class MultiPacker {
    printStats(): void
    get(reg: TextureRegion): PixmapRegion
    get(regStr: string): PixmapRegion
    getPacked(name: string): PixmapRegion|null
    has(name: string): boolean
    has(page: MultiPacker.PageType, name: string): boolean
    add(page: MultiPacker.PageType, name: string, pixReg: PixmapRegion): void
    add(page: MultiPacker.PageType, name: string, pixReg: PixmapRegion, splits: Array<number>, pads: Array<number>): void
    add(page: MultiPacker.PageType, name: string, pix: Pixmap): void
    flush(texFilter: Texture.TextureFilter, atlas: TextureAtlas): TextureAtlas
    registerOutlined(name: string): boolean
    isOutlined(name: string): boolean
}
declare namespace MultiPacker {
    class PageType {
        static main: PageType;
        static environment: PageType;
        static ui: PageType;
        static rubble: PageType;

        width: number;
        height: number;
    }
}
