/** mindustry.core.FileTree */
declare class FileTree implements FileHandleResolver {}


/** mindustry.core.ContentLoader */
declare class ContentLoader {
    byName(name: string): MappableContent|null
    getByName(type: ContentType, name: string): MappableContent|null
    getByID(type: ContentType, id: number): Content|null
    getBy(type: ContentType): Seq<Content>
    getNamesBy(type: ContentType): ObjectMap<string, Content>

    block(id: number): Block|null
    block(name: string): Block|null
    item(id: number): Item|null
    item(name: string): Item|null
    liquid(id: number): Liquid|null
    liquid(name: string): Liquid|null
    bullet(id: number): BulletType|null
    statusEffect(name: string): StatusEffect|null
    sector(name: string): SectorPreset|null
    unit(id: number): UnitType|null
    unit(name: string): UnitType|null
    planet(name: string): Planet|null
    weather(name: string): Weather|null
    unitStance(id: number): UnitStance|null
    unitStance(name: string): UnitStance|null
    unitCommand(id: number): UnitCommand|null
    unitCommand(name: string): UnitCommand|null

    blocks(): Seq<Block>
    items(): Seq<Item>
    liquids(): Seq<Liquid>
    bullets(): Seq<BulletType>
    statusEffects(): Seq<StatusEffect>
    sectors(): Seq<SectorPreset>
    units(): Seq<UnitType>
    planets(): Seq<Planet>
    weathers(): Seq<Weather>
    unitStances(): Seq<UnitStance>
    unitCommands(): Seq<UnitCommand>
}


/** mindustry.cpre.GameState */
declare class GameState {
    wave: number;
    waveTime: number;
    enemies: number;
    tick: number;
    updateId: number;
    serverTps: number;

    map: Map;
    playtestingMap: Map|null;
    rules: Rules;
    stats: GameStats;
    markers: MapMarkers;
    mapLocales: MapLocales;
    envAttrs: Attributes;
    teams: Teams;
    data: DataManager;
    gameOver: boolean;
    afterGameOver: boolean;
    won: boolean;

    boss(): Unit|null;
    hasSpawns(): boolean;

    isCampaign(): boolean;
    hasSector(): boolean;
    getSector(): Sector|null;
    getPlanet(): Planet|null;
    isEditor(): boolean;
    isPaused(): boolean;
    isPlaying(): boolean;
    isGame(): boolean;
    isMenu(): boolean;
}
declare namespace GameState {
    class State {
        static paused: State;
        static playing: State;
        static menu: State;
    }
}


/** mindustry.core.Platform */
interface Platform {}


/** mindustry.core.World */
declare class World {}


/** mindustry.core.Control */
declare class Control implements ApplicationListener, Loadable {}


/** mindustry.core.Logic */
declare class Logic implements ApplicationListener {}


/** mindustry.core.Renderer */
declare class Renderer implements ApplicationListener {}


/** mindustry.core.UI */
declare class UI implements ApplicationListener, Loadable {}


/** mindustry.core.NetServer */
declare class NetServer implements ApplicationListener {}
/** mindustry.core.NetClient */
declare class NetClient implements ApplicationListener {}


/** mindustry.core.ClientLoader */
declare class ClientLoader {}
