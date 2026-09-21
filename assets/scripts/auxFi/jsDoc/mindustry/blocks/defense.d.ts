/** mindustry.world.blocks.defense.Wall */
declare class Wall extends Block {
    lightningChance: number;
    lightningDamage: number;
    lightningLength: number;
    lightningColor: Color;
    lightningSound: Sound;
    chanceDeflect: number;
    flashHit: boolean;
    flashColor: Color;
    deflectSound: Sound;
    autoTile: boolean;
}
declare namespace Wall {
    class WallBuild extends Building {}
}
/** mindustry.world.blocks.defense.ShieldWall */
declare class ShieldWall extends Wall {
    shieldHealth: number;
    breakCooldown: number;
    regenSpeed: number;
    glowColor: Color;
    glowMag: number;
    glowScl: number;
    glowRegion: TextureRegion;
}
declare namespace ShieldWall {
    class ShieldWallBuild extends Wall.WallBuild {
        shield: number;
        shieldRadius: number;
        breakTimer: number;
    }
}
/** mindustry.world.blocks.defense.Thruster */
declare class Thruster extends Wall {
    topRegion: TextureRegion;
}
declare namespace Thruster {
    class ThrusterBuild extends Wall.WallBuild {}
}
/** mindustry.world.blocks.defense.Door */
declare class Door extends Wall {
    readonly timerToggle: number;
    openFx: Effect;
    closeFx: Effect;
    doorSound: Sound;
    chainEffect: boolean;
    openRegion: TextureRegion;
}
declare namespace {
    class DoorBuild extends Building {
        open: boolean;
        chained: Seq<DoorBuild>;
    }
}
/** mindustry.world.blocks.defense.AutoDoor */
declare class AutoDoor extends Wall {
    readonly timerToggle: number;
    checkInterval: number;
    openFx: Effect;
    closeFx: Effect;
    doorSound: Sound;
    openRegion: TextureRegion;
    triggerMargin: number;
}
declare namespace AutoDoor {
    class AutoDoorBuild extends Building {
        open: boolean;
    }
}


/** mindustry.world.blocks.defense.MendProjector */
declare class MendProjector extends Block {
    readonly timerUse: number;
    baseColor: Color;
    phaseColor: Color;
    topRegion: TextureRegion;
    reload: number;
    range: number;
    healPercent: number;
    phaseBoost: number;
    phaseRangeBoost: number;
    useTime: number;
    mendSound: Sound;
    mendSoundVolume: number;
}
declare namespace MendProjector {
    class MendBuild extends Building implements Ranged {
        heat: number;
        charge: number;
        phaseHeat: number;
        smoothEfficiency: number;
    }
    interface MendBuild extends Ranged {}
}
/** mindustry.world.blocks.defense.RegenProjector */
declare class RegenProjector extends Block {
    range: number;
    healPercent: number;
    optionalMultiplier: number;
    optionalUseTime: number;
    drawer: DrawBlock;
    effectChance: number;
    baseColor: Color;
    effect: Effect;
}
declare namespace RegenProjector {
    class RegenProjectorBuild extends Building {
        targets: Seq<Building>;
        lastChange: number;
        warmup: number;
        totalTime: number;
        optionalTimer: number;
        anyTargets: boolean;
        didRegen: boolean;
    }
}


/** mindustry.world.blocks.defense.OverdriveProjector */
declare class OverdriveProjector extends Block {
    topRegion: TextureRegion;
    reload: number;
    range: number;
    speedBoost: number;
    speedBoostPhase: number;
    useTime: number;
    phaseRangeBoost: number;
    hasBoost: boolean;
    baseColor: Color;
    phaseColor: Color;
}
declare namespace OverdriveProjector {
    class OverdriveBuild extends Building implements Ranged {
        heat: number;
        charge: number;
        phaseHeat: number;
        smoothEfficiency: number;
        useProgress: number;
    }
    interface OverdriveBuild extends Ranged {}
}


/** mindustry.world.blocks.defense.BaseShield */
declare class BaseShield extends Block {
    radius: number;
    sides: number;
    shieldColor: Color|null;
}
declare namespace BaseShield {
    class BaseShieldBuild extends Building implements ShieldProvider {
        broken: boolean;
        hit: number;
        smoothRadius: number;
    }
    interface BaseShieldBuild extends ShieldProvider {}
}
/** mindustry.world.blocks.defense.ForceProjector */
declare class ForceProjector extends Block {
    readonly timerUse: number;
    phaseUseTime: number;
    phaseRadiusBoost: number;
    phaseShieldBoost: number;
    radius: number;
    sides: number;
    shieldRotation: number;
    shieldHealth: number;
    cooldownNormal: number;
    cooldownLiquid: number;
    cooldownBrokenBase: number;
    coolantConsumption: number;
    consumeCoolant: boolean;
    crashDamageMultiplier: number;
    breakSound: Sound;
    hitSound: Sound;
    hitSoundVolume: number;
    absorbEffect: Effect;
    shieldBreakEffect: Effect;
    forceShrinkEffect: Effect;
    topRegion: TextureRegion;
    itemConsumer: Consume|null;
    coolantConsumer: Consume|null;
}
declare namespace ForceProjector {
    class ForceBuild extends Building implements Ranged, ShieldProvider {
        broken: boolean;
        buildup: number;
        radscl: number;
        hit: number;
        warmup: number;
        phaseHeat: number;
    }
    interface ForceBuild extends Ranged, ShieldProvider {}
}


/** mindustry.world.blocks.defense.Radar */
declare class Radar extends Block {
    discoveryTime: number;
    rotateSpeed: number;
    baseRegion: TextureRegion;
    glowRegion: TextureRegion;
    glowColor: Color;
    glowScl: number;
    glowMag: number;
}
declare namespace Radar {
    class RadarBuild extends Building {
        progress: number;
        lastRadius: number;
        smoothEfficiency: number;
        totalProgress: number;
    }
}


/** mindustry.world.blocks.defense.ShockMine */
declare class ShockMine extends Block {
    readonly timerDamage: number;
    cooldown: number;
    tileDamage: number;
    damage: number;
    length: number;
    tendrils: number;
    lightningColor: Color;
    shots: number;
    inaccuracy: number;
    teamAlpha: number;
    teamRegion: TextureRegion;
}
declare namespace ShockMine {
    class ShockMineBuild extends Building {}
}


/** mindustry.world.blocks.defense.ShockwaveTower */
declare class ShockwaveTower extends Block {
    readonly timerCheck: number;
    range: number;
    reload: number;
    bulletDamage: number;
    falloffCount: number;
    shake: number;
    checkInterval: number;
    shootSound: Sound;
    waveColor: Color;
    heatColor: Color;
    shapeColor: Color;
    cooldownMultiplier: number;
    hitEffect: Effect;
    waveEffect: Effect;
    shapeRotateSpeed: number;
    shapeRadius: number;
    shapeSides: number;
    heatRegion: TextureRegion;
}
declare namespace ShockwaveTower {
    class ShockwaveTowerBuild extends Building {
        reloadCounter: number;
        heat: number;
        targets: Seq<Bullet>;
    }
}


/** mindustry.world.blocks.defense.TargetDummy */
declare class TargetDummy extends Block {
    readonly dpsUpdateTime: number;
    unitType: UnitType;
    pullScale: number;
    emptyStr: string;
    tetherEnd: TextureRegion;
    tether: TextureRegion;
    previewRegion: TextureRegion;
}
declare namespace TargetDummy {
    class TargetDummyBuild extends Building implements UnitTetherBlock {
        readUnitId: number;
        unit: Unit;
        resetTime: number;
        total: number;
        reset: number;
        time: number;
        dummySize: number;
        dps: number;
        totalDisplay: number;
        timeDisplay: number;
        hits: number;
        hitsDisplay: number;
        boosting: boolean;
        unitArmor: number;
        unitTeam: Team;
    }
}
