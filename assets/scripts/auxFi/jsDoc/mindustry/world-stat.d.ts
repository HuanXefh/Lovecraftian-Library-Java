/** mindustry.world.meta.Stat */
declare class Stat {
    static health: Stat;
    static armor: Stat;
    static size: Stat;
    static displaySize: Stat;
    static builtTime: Stat;
    static builtCost: Stat;
    static memoryCapacity: Stat;
    static explosiveness: Stat;
    static flammability: Stat;
    static radioactivity: Stat;
    static charge: Stat;
    static heatCapacity: Stat;
    static viscosity: Stat;
    static temperature: Stat;
    static flying: Stat;
    static speed: Stat;
    static buildSpeed: Stat;
    static mineSpeed: Stat;
    static mineTier: Stat;
    static payloadCapacity: Stat;
    static baseDeflectChance: Stat;
    static lightningChance: Stat;
    static lightningDamage: Stat;
    static abilities: Stat;
    static canBoost: Stat;
    static boostingSpeed: Stat;
    static maxUnits: Stat;

    static damageMultiplier: Stat;
    static healthMultiplier: Stat;
    static speedMultiplier: Stat;
    static reloadMultiplier: Stat;
    static buildSpeedMultiplier: Stat;
    static reactive: Stat;
    static healing: Stat;
    static immunities: Stat;

    static itemCapacity: Stat;
    static itemsMoved: Stat;
    static launchTime: Stat;
    static maxConsecutive: Stat;

    static liquidCapacity: Stat;

    static powerCapacity: Stat;
    static powerUse: Stat;
    static powerDamage: Stat;
    static powerRange: Stat;
    static powerConnections: Stat;
    static basePowerGeneration: Stat;
    static meltdownTime: Stat;
    static warmupTime: Stat;

    static tiles: Stat;
    static input: Stat;
    static output: Stat;
    static productionTime: Stat;
    static maxEfficiency: Stat;
    static drillTier: Stat;
    static drillSpeed: Stat;
    static linkRange: Stat;
    static instructions: Stat;

    static weapons: Stat;
    static bullet: Stat;

    static speedIncrease: Stat;
    static repairTime: Stat;
    static repairSpeed: Stat;
    static range: Stat;
    static shootRange: Stat;
    static inaccuracy: Stat;
    static shots: Stat;
    static reload: Stat;
    static crushDamage: Stat;
    static legSplashDamage: Stat;
    static targetsAir: Stat;
    static targetsGround: Stat;
    static damage: Stat;
    static status: Stat;
    static frequency: Stat;
    static ammo: Stat;
    static ammoCapacity: Stat;
    static ammoUse: Stat;
    static shieldHealth: Stat;
    static cooldownTime: Stat;
    static regenerationRate: Stat;
    static activationTime: Stat;
    static moduleTier: Stat;
    static unitType: Stat;
    static receiveRate: Stat;

    static booster: Stat;
    static boostEffect: Stat;
    static affinities: Stat;
    static opposites: Stat;
}
/** mindustry.world.meta.Stats */
declare class Stats {}
/** mindustry.world.meta.StatCat */
declare class StatCat {
    static general: StatCat;
    static power: StatCat;
    static liquids: StatCat;
    static items: StatCat;
    static crafting: StatCat;
    static function: StatCat;
    static optional: StatCat;
}
/** mindustry.world.meta.StatUnit */
declare class StatUnit {
    static blocks: StatUnit;
    static blocksSquared: StatUnit;
    static worldUnits: StatUnit;
    static tilesSecond: StatUnit;
    static powerSecond: StatUnit;
    static liquidSecond: StatUnit;
    static itemsSecond: StatUnit;
    static liquidUnits: StatUnit;
    static powerUnits: StatUnit;
    static powerEquilibrium: StatUnit;
    static heatUnits: StatUnit;
    static degrees: StatUnit;
    static seconds: StatUnit;
    static minutes: StatUnit;
    static shots: StatUnit;
    static perSecond: StatUnit;
    static perMinute: StatUnit;
    static perShot: StatUnit;
    static perLeg: StatUnit;
    static perSide: StatUnit;
    static timesSpeed: StatUnit;
    static multiplier: StatUnit;
    static percent: StatUnit;
    static shieldHealth: StatUnit;
    static none: StatUnit;
    static items: StatUnit;
    static instant: StatUnit;
}
/** mindustry.world.meta.StatValue */
interface StatValue {
    display(tb: Table): void
}
/** mindustry.world.meta.StatValues */
declare class StatValues {}
