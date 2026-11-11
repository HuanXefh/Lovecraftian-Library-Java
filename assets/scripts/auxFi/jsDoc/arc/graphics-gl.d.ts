/** arc.graphics.gl.Gl */
declare class Gl {}


/** arc.graphics.GLTexture */
declare class GLTexture implements Disposable {
    readonly glTarget: java.lang.Integer;
    width: java.lang.Integer;
    height: java.lang.Integer;

    constructor(glTarget: java.lang.Integer, glHandle?: java.lang.Integer)

    getDepth(): java.lang.Integer
    getHandle(): java.lang.Integer
    overwriteHandle(glHandle: java.lang.Integer): void
    getMinFilter(): TextureFilter
    getMagFilter(): TextureFilter
    setFilter(texFilter: TextureFilter): void
    setFilter(minFilter: TextureFilter, magFilter: TextureFilter): void
    getUWrap(): TextureWrap
    getVWrap(): TextureWrap
    setWrap(texWrap: TextureWrap): void
    setWrap(uWrap: TextureWrap, vWrap: TextureWrap): void

    bind(texUnit?: java.lang.Integer): void
}
interface GLTexture extends Disposable {}
