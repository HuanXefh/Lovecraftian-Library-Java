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
    add(name: string, pixReg: PixmapRegion): void
    add(name: string, pixReg: PixmapRegion, splits: Array<number>, pads: Array<number>): void
    add(name: string, pix: Pixmap): void
    flush(texFilter: TextureFilter, atlas: TextureAtlas): TextureAtlas
    registerOutlined(name: string): boolean
    isOutlined(name: string): boolean
}


/** mindustry.graphics.CubemapMesh */
declare class CubemapMesh implements Disposable {
    constructor(cubemap: Cubemap)

    setCubemap(cubemap: Cubemap): void
    render(proj: Mat3D): void
}
