/** mindustry.Vars */
declare class Vars {
    static readonly bufferSize: number;
    static readonly charset: java.nio.charset.Charset;
    static readonly appName: string;
    static javaPath: string;
    static locales: Array<java.util.Locale>;
    static mainExecutor: java.util.concurrent.ExecutorService;
    static clientLoaded: boolean;
    static mobile: boolean;
    static ios: boolean;
    static android: boolean;
    static headless: boolean;
    static steam: boolean;
    static macNotchHeight: number;

    static tree: FileTree;
    static net: Net;
    static content: ContentLoader;
    static state: GameState;
    static collisions: EntityCollisions;
    static waves: Waves;
    static platform: Platform;
    static mods: Mods;
    static schematics: Schematics;
    static becontrol: BeControl;
    static asyncCore: AsyncCore;
    static bases: BaseRegistry;
    static logicVars: GlobalVars;
    static editor: MapEditor;
    static avoidance: AvoidanceProcess;
    static unitPhysics: PhysicsProcess;
    static assetCache: DataAssetCache;
    static service: GameService;

    static universe: Universe;
    static world: World;
    static maps: Maps;
    static spawner: WaveSpawner;
    static indexer: BlockIndexer;
    static pathfinder: Pathfinder;
    static controlPath: ControlPathFinder;
    static fogControl: FogControl;

    static control: Control;
    static logic: Logic;
    static renderer: Renderer;
    static ui: UI;
    static netServer: NetServer;
    static netClient: NetClient;

    static player: Player|null;

    static readonly maxGlErrors: number;
    static maxTextureSize: number;

    static readonly ghApi: string;
    static readonly discordURL: string;
    static readonly modGuideURL: string;
    static readonly patchesGuideURL: string;
    static readonly serverJsonBeURLs: Array<string>;
    static readonly serverJsonURLs: Array<string>;
    static readonly modJsonURLs: Array<string>;
    static readonly steamBansURLs: Array<string>;
    static readonly reportIssueURL: string;
    static readonly defaultServers: Seq<ServerGroup>;
    static readonly cachedServers: Seq<ServerGroup>;
    static readonly maxPlayerPreviewPlans: number;
    static readonly maxTextLength: number;
    static readonly maxPingTextLength: number;
    static readonly maxNameLength: number;
    static readonly maxTcpSize: number;
    static readonly port: number;
    static readonly multicastPort: number;
    static readonly multicastGroup: string;
    static loadedServerCache: boolean;
    static fetchedServers: boolean;

    static steamPlayerName: string;
    static readonly playerColors: Array<Color>;
    static readonly accessibleIcons: Array<string>;
    static maxDeltaClient: number;
    static maxDeltaServer: number;
    static readonly defaultContentIcons: Array<ContentType>;
    static readonly defaultEnv: number;
    static readonly darkRadius: number;
    static readonly maxBlockSize: number;
    static readonly mineTransferRange: number;
    static readonly itemTransferRange: number;
    static readonly logicItemTransferRange: number;
    static readonly itemSize: number;
    static readonly finalWorldBounds: number;
    static readonly buildingRange: number;
    static readonly unitCollisionRadiusScale: number;
    static readonly turnDuration: number;
    static readonly baseInvasionChance: number;
    static readonly invasionGracePeriod: number;
    static readonly minArmorDamage: number;
    static readonly tilesize: number;
    static readonly tilepayload: number;
    static readonly iconXLarge: number;
    static readonly iconLarge: number;
    static readonly iconMed: number;
    static readonly iconSmall: number;

    static emptyMap: Map;
    static readonly mapExtension: string;
    static readonly saveExtension: string;
    static emptyTile: Tile;

    static readonly maxLoadoutSchematicPad: number;
    static readonly schematicBaseStart: string;
    static maxSchematicSize: number;
    static readonly schematicExtension: string;

    static readonly maxModSubtitleLength: number;

    static dataDirectory: Fi;
    static screenshotDirectory: Fi;
    static customMapDirectory: Fi;
    static mapPreviewDirectory: Fi;
    static assetCacheDirectory: Fi;
    static tmpDirectory: Fi;
    static saveDirectory: Fi;
    static modDirectory: Fi;
    static schematicDirectory: Fi;
    static bebuildDirectory: Fi;
    static launchIDFile: Fi;
    static serverCacheFile: Fi;

    static failedToLaunch: boolean;
    static loadLocales: boolean;
    static loadedLogger: boolean;
    static loadedFileLogger: boolean;
    static readonly minModGameVersion: number;
    static readonly minJavaModGameVersion: number;
    static showSectorSubmissions: boolean;
    static forceBeServers: boolean;
    static skipModCode: boolean;
    static updateEditorOnChange: boolean;
    static hasSerpuloRemaps: boolean;
    static showSectorLandInfo: boolean;
    static checkScreenshotMemory: boolean;
    static confirmExit: boolean;
    static disableUI: boolean;
    static disableSave: boolean;
    static testMobile: boolean;
    static clearSectors: boolean;
    static enableLight: boolean;
    static enableDarkness: boolean;
    static debugDrawAvoidance: boolean;
}
