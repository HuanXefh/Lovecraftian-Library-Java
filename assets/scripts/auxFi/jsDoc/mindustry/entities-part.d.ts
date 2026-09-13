/** mindustry.entities.part.DrawPart */
declare class DrawPart {
    under: boolean;
    weaponIndex: number;
    recoilIndex: number;
}
declare namespace DrawPart {
    class PartParams {
        warmup: number;
        reload: number;
        smoothReload: number;
        heat: number;
        recoil: number;
        life: number;
        charge: number;
        x: number;
        y: number;
        rotation: number;
        sideOverride: number;
        sideMultiplier: number;

        set(warmup: number, reload: number, smoothReload: number, heat: number, recoil: number, charge: number, x: number, y: number, rotation: number): this
        setRecoil(recoils: number): this
    }
    class PartMove {
        progress: PartProgress;
        x: number;
        y: number;
        gx: number;
        gy: number;
        rot: number;
    }
    interface PartProgress {
        reload: PartProgress;
        smoothReload: PartProgress;
        warmup: PartProgress;
        charge: PartProgress;
        recoil: PartProgress;
        heat: PartProgress;
        life: PartProgress;
        time: PartProgress;
    }
    interface PartFunc {
        get(a: number, b: number): number
    }
}


/** mindustry.entities.part.EffectSpawnerPart */
declare class EffectSpawnerPart extends DrawPart {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    mirror: boolean;
    effectRot: number;
    effectRandRot: number;
    effectInterval: number;
    effectIntervalFrom: number;
    effectChance: number;
    effect: Effect;
    effectColor: Color;
    useProgress: boolean;
    progress: DrawPart.PartProgress;
    debugDraw: boolean;
}
/** mindustry.entities.part.FlarePart */
declare class FlarePart extends DrawPart {
    sides: number;
    radius: number;
    radiusTo: number;
    stroke: number;
    innerScl: number;
    innerRadScl: number;
    x: number;
    y: number;
    rotation: number;
    rotMove: number;
    spinSpeed: number;
    followRotation: boolean;
    color1: Color;
    color2: Color;
    clampProgress: boolean;
    progress: DrawPart.PartProgress;
    layer: number;
}
/** mindustry.entities.part.HaloPart */
declare class HaloPart extends DrawPart {
    hollow: boolean;
    tri: boolean;
    shapes: number;
    sides: number;
    radius: number;
    radiusTo: number;
    stroke: number;
    strokeTo: number;
    triLength: number;
    triLengthTo: number;
    haloRadius: number;
    haloRadiusTo: number;
    x: number;
    y: number;
    shapeRotation: number;
    moveX: number;
    moveY: number;
    shapeMoveRot: number;
    haloRotateSpeed: number;
    haloRotation: number;
    rotateSpeed: number;
    color: Color;
    colorTo: Color;
    mirror: boolean;
    clampProgress: boolean;
    progress: DrawPart.PartProgress;
    layer: number;
    layerOffset: number;
}
/** mindustry.entities.part.HoverPart */
declare class HoverPart extends DrawPart {
    radius: number;
    x: number;
    y: number;
    rotation: number;
    phase: number;
    stroke: number;
    minStroke: number;
    circles: number;
    sides: number;
    color: Color;
    mirror: boolean;
    layer: number;
    layerOffset: number;
}
/** mindustry.entities.part.RegionPart */
declare class RegionPart extends DrawPart {
    suffix: string;
    name: string|null;
    mirror: boolean;
    outline: boolean;
    replaceOutline: boolean;
    drawRegion: boolean;
    heatLight: boolean;
    clampProgress: boolean;
    progress: DrawPart.PartProgress;
    growProgress: DrawPart.PartProgress;
    heatProgress: DrawPart.PartProgress;
    blending: Blending;
    layer: number;
    layerOffset: number;
    heatLayerOffset: number;
    turretHeatLayer: number;
    outlineLayerOffset: number;
    x: number;
    y: number;
    xScl: number;
    yScl: number;
    rotation: number;
    originX: number;
    originY: number;
    moveX: number;
    moveY: number;
    growX: number;
    growY: number;
    moveRot: number;
    heatLightOpacity: number;
    color: Color|null;
    colorTo: Color|null;
    mixColor: Color|null;
    mixColorTo: Color|null;
    heatColor: Color;
    children: Seq<DrawPart>;
    moves: Seq<DrawPart.PartMove>;

    heat: TextureRegion;
    light: TextureRegion;
    regions: Array<TextureRegion>;
    outlines: Array<TextureRegion>;
}
/** mindustry.entities.part.ShapePart */
declare class ShapePart extends DrawPart {
    circle: boolean;
    hollow: boolean;
    sides: number;
    radius: number;
    radiusTo: number;
    stroke: number;
    strokeTo: number;
    x: number;
    y: number;
    rotation: number;
    moveX: number;
    moveY: number;
    moveRot: number;
    rotateSpeed: number;
    color: Color;
    colorTo: Color|null;
    mirror: boolean;
    clampProgress: boolean;
    progress: DrawPart.PartProgress;
    layer: number;
    layerOffset: number;
}
