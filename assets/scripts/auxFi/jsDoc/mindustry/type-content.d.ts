/** mindustry.type.Category */
declare class Category {
    static turret: Category;
    static production: Category;
    static distribution: Category;
    static liquid: Category;
    static power: Category;
    static defense: Category;
    static crafting: Category;
    static units: Category;
    static effect: Category;
    static logic: Category;
}


/** mindustry.world.Block */
declare class Block extends UnlockableContent implements Senseable {}


/** mindustry.type.Item */
declare class Item extends UnlockableContent implements Senseable {
    hidden: boolean;
    color: Color;
    explosiveness: number;
    flammability: number;
    radioactivity: number;
    charge: number;
    hardness: number;
    buildable: boolean;
    cost: number;
    healthScaling: number;
    lowPriority: boolean;
    frames: number;
    transitionFrames: number;
    frameTime: number;

    static getAllOres(): Seq<Item>

    isOnPlanet(pla: Planet): boolean
    isHidden(): boolean
}
/** mindustry.type.Liquid */
declare class Liquid extends UnlockableContent implements Senseable {
    static readonly animationFrames: number;
    static animationScaleGas: number;
    static animationScaleLiquid: number;

    hidden: boolean;
    gas: boolean;
    color: Color;
    gasColor: Color;
    barColor: Color|null;
    lightColor: Color;
    flammability: number;
    temperature: number;
    heatCapacity: number;
    viscosity: number;
    explosiveness: number;
    boilPoint: number;
    blockReactive: boolean;
    coolant: boolean;
    moveThroughBlocks: boolean;
    incinerable: boolean;
    capPuddles: boolean;
    effect: StatusEffect;
    vaporEffect: Effect;
    particleEffect: Effect;
    particleSpacing: number;
    canStayOn: ObjectSet<Liquid>;
}
/** mindustry.type.CellLiquid */
declare class CellLiquid extends Liquid {}


/** mindustry.type.UnitType */
declare class UnitType extends UnlockableContent implements Senseable {}
/** mindustry.type.ErekirUnitType */
declare class ErekirUnitType extends UnitType {}
/** mindustry.type.MissileUnitType */
declare class MissileUnitType extends UnitType {}
/** mindustry.type.NeoplasmUnitType */
declare class NeoplasmUnitType extends UnitType {}
/** mindustry.type.TankUnitType */
declare class TankUnitType extends UnitType {}


/** mindustry.type.StatusEffect */
declare class StatusEffect extends UnlockableContent {
    show: boolean;
    outline: boolean;
    damageMultiplier: number;
    healthMultiplier: number;
    speedMultiplier: number;
    reloadMultiplier: number;
    buildSpeedMultiplier: number;
    dragMultiplier: number;
    transitionDamage: number;
    disarm: boolean;
    damage: number;
    intervalDamageTime: number;
    intervalDamage: number;
    intervalDamagePierce: boolean;
    permanent: boolean;
    reactive: boolean;
    dynamic: boolean;
    color: Color;
    effect: Effect;
    effectChance: number;
    parentizeEffect: boolean;
    applyColor: Color;
    applyEffect: Effect;
    applyExtend: boolean;
    parentizeApplyEffect: boolean;
    affinities: ObjectSet<StatusEffect>;
    opposites: ObjectSet<StatusEffect>;
}


/** mindustry.type.Planet */
declare class Planet extends UnlockableContent {
    meshLoader: Prov<GenericMesh>;
    cloudMeshLoader: Prov<GenericMesh>;
    gridMeshLoader: Prov<Mesh>;
    mesh: GenericMesh|null;
    cloudMesh: GenericMesh|null;
    gridMesh: Mesh|null;
    position: Vec3;
    grid: PlanetGrid|null;
    generator: PlanetGenerator|null;
    sectors: Seq<Sector>;
    sectorApproxRadius: number;
    startSector: number;
    sectorSeed: number;
    accessible: boolean;
    visible: boolean;
    icon: string;
    iconColor: Color;
    radius: number;
    tidalLock: boolean;
    bloom: boolean;
    drawOrbit: boolean;
    orbitSpacing: number;
    orbitTime: number;
    rotateTime: number;
    orbitOffset: number;
    hasAtmosphere: boolean;
    atmosphereRadIn: number;
    atmosphereRadOut: number;
    atmosphereColor: Color;
    camRadius: number;
    minZoom: number;
    maxZoom: number;
    clipRadius: number;
    defaultEnv: number;
    defaultAttributes: Attributes;
    updateLighting: boolean;
    lightColor: Color;
    lightSrcFrom: number;
    lightSrcTo: number;
    lightDstFrom: number;
    lightDstTo: number;
    autoAssignPlanet: boolean;
    parent: Planet|null;
    solarSystem: Planet;
    children: Seq<Planet>;
    techTree: TechTree.TechNode|null;
    unlockedOnLand: Seq<UnlockableContent>;
    statPlanet: Planet|null;
    updateGroup: ObjectSet<Planet>;

    allowLaunchSchematics: boolean;
    allowLaunchLoadout: boolean;
    allowLaunchToNumbered: boolean;
    launchCapacityMultiplier: number;
    allowLegacyLaunchPads: boolean;
    launchCandidates: Seq<Planet>;
    allowSelfSectorLaunch: boolean;
    landCloudColor: Color;
    launchMusic: Music;
    ambientMusic: Seq<Music>|null;
    darkMusic: Seq<Music>|null;
    alwaysPlayMusic: boolean;
    allowSectorInvasion: boolean;
    clearSectorOnLose: boolean;
    enemyBuildSpeedMultiplier: number;
    enemyFactoryActivationDelay: number;
    enemyInfiniteItems: boolean;
    enemyCoreSpawnReplace: boolean;
    prebuildBase: boolean;
    allowCampaignRules: boolean;
    campaignRules: CampaignRules;
    campaignRuleDefaults: CampaignRules;
    ruleSetter: Cons<Rules>;
    showRtsAIRule: boolean;
    loadPlanetData: boolean;
    data: Planet.PlanetData|null;
    allowWaves: boolean;
    defaultCore: Block;
    sectorCaptureReplacements: ObjectMap<Block, Block>;
}
declare namespace Planet {
    class PlanetData {
        presets: ObjectIntMap<string>;
        attackSectors: Array<number>;
    }
}


/** mindustry.type.SectorPreset */
declare class SectorPreset extends UnlockableContent {}


/** mindustry.type.Weather */
declare class Weather extends UnlockableContent {}
declare namespace Weather {
    class WeatherEntry {
        weather: Weather;
        minFrequency: number;
        maxFrequency: number;
        minDuration: number;
        maxDuration: number;
        cooldown: number;
        intensity: number;
        always: boolean;
    }
}
/** mindustry.type.weather.MagneticStorm */
declare class MagneticStorm extends Weather {}
/** mindustry.type.weather.ParticleWeather */
declare class ParticleWeather extends Weather {}
/** mindustry.type.weather.RainWeather */
declare class RainWeather extends Weather {}
/** mindustry.type.weather.SolarFlare */
declare class SolarFlare extends Weather {}


/** mindustry.type.TeamEntry */
declare class TeamEntry extends UnlockableContent {
    readonly team: Team;
}


/** mindustry.type.Weapon */
declare class Weapon implements java.lang.Cloneable {}
/** mindustry.type.weapons.BuildWeapon */
declare class BuildWeapon extends Weapon {}
/** mindustry.type.weapons.MineWeapon */
declare class MineWeapon extends Weapon {}
/** mindustry.type.weapons.PointDefenseBulletWeapon */
declare class PointDefenseBulletWeapon extends Weapon {}
/** mindustry.type.weapons.PointDefenseWeapon */
declare class PointDefenseWeapon extends Weapon {}
/** mindustry.type.weapons.RepairBeamWeapon */
declare class RepairBeamWeapon extends Weapon {}
