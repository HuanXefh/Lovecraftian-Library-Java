/** mindustry.graphics.Layer */
declare class Layer {}


/** mindustry.graphics.Pal */
declare class Pal {
    static water: Color;
    static darkOutline: Color;
    static thoriumPink: Color;
    static coalBlack: Color;
    static items: Color;
    static command: Color;
    static sap: Color;
    static sapBullet: Color;
    static sapBulletBack: Color;
    static suppress: Color;
    static regen: Color;
    static reactorPurple: Color;
    static reactorPurple2: Color;
    static spore: Color;
    static shield: Color;
    static bulletYellow: Color;
    static bulletYellowBack: Color;
    static darkMetal: Color;
    static darkerMetal: Color;
    static darkestMetal: Color;
    static missileYellow: Color;
    static missileYellowBack: Color;
    static meltdownHit: Color;
    static plastaniumBack: Color;
    static plastaniumFront: Color;
    static lightFlame: Color;
    static darkFlame: Color;
    static lightPyraFlame: Color;
    static darkPyraFlame: Color;
    static turretHeat: Color;
    static lightOrange: Color;
    static lightishOrange: Color;
    static lighterOrange: Color;
    static lightishGray: Color;
    static darkishGray: Color;
    static darkerGray: Color;
    static darkestGray: Color;
    static darkestestGray: Color;
    static shadow: Color;
    static ammo: Color;
    static rubble: Color;
    static boostTo: Color;
    static boostFrom: Color;
    static lancerLaser: Color;
    static stoneGray: Color;
    static engine: Color;
    static yellowBoltFront: Color;
    static health: Color;
    static heal: Color;
    static bar: Color;
    static accent: Color;
    static stat: Color;
    static negativeStat: Color;
    static gray: Color;
    static metalGrayDark: Color;
    static accentBack: Color;
    static place: Color;
    static remove: Color;
    static noplace: Color;
    static removeBack: Color;
    static placeRotate: Color;
    static breakInvalid: Color;
    static range: Color;
    static power: Color;
    static powerBar: Color;
    static powerLight: Color;
    static placing: Color;
    static unitFront: Color;
    static unitBack: Color;
    static lightTrail: Color;
    static surge: Color;
    static plastanium: Color;
    static redSpark: Color;
    static orangeSpark: Color;
    static redDust: Color;
    static redderDust: Color;
    static plasticSmoke: Color;
    static adminChat: Color;
    static neoplasmOutline: Color;
    static neoplasm1: Color;
    static neoplasmMid: Color;
    static neoplasm2: Color;
    static neoplasmAcid: Color;
    static neoplasmAcidGlow: Color;
    static logicBlocks: Color;
    static logicControl: Color;
    static logicOperations: Color;
    static logicIo: Color;
    static logicUnits: Color;
    static logicWorld: Color;
    static berylShot: Color;
    static tungstenShot: Color;
    static plasticBurn: Color;
    static muddy: Color;
    static redLight: Color;
    static slagOrange: Color;
    static techBlue: Color;
    static vent: Color;
    static vent2: Color;
    static copperAmmoFront: Color;
    static copperAmmoBack: Color;
    static graphiteAmmoFront: Color;
    static graphiteAmmoBack: Color;
    static siliconAmmoFront: Color;
    static siliconAmmoBack: Color;
    static glassAmmoFront: Color;
    static glassAmmoBack: Color;
    static scrapAmmoFront: Color;
    static scrapAmmoBack: Color;
    static surgeAmmoFront: Color;
    static surgeAmmoBack: Color;
    static blastAmmoFront: Color;
    static blastAmmoBack: Color;
    static thoriumAmmoFront: Color;
    static thoriumAmmoBack: Color;
}


/** mindustry.graphics.Drawf */
declare class Drawf {}


/** mindustry.graphics.Shaders */
declare class Shaders {}


/** mindustry.graphics.CacheLayer */
declare class CacheLayer {}
/** mindustry.graphics.BuildingCacheLayer */
declare class BuildingCacheLayer {
    static under: BuildingCacheLayer;
    static normal: BuildingCacheLayer;

    layer: number;
}


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
