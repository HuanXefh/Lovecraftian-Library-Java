/** mindustry.input.Binding */
declare class Binding {
    static readonly moveX: KeyBind;
    static readonly moveY: KeyBind;
    static readonly mouseMove: KeyBind;
    static readonly pan: KeyBind;
    static readonly boost: KeyBind;
    static readonly respawn: KeyBind;
    static readonly control: KeyBind;
    static readonly select: KeyBind;
    static readonly deselect: KeyBind;
    static readonly breakBlock: KeyBind;
    static readonly pickupCargo: KeyBind;
    static readonly dropCargo: KeyBind;
    static readonly clearBuilding: KeyBind;
    static readonly pauseBuilding: KeyBind;
    static readonly rotate: KeyBind;
    static readonly rotatePlaced: KeyBind;
    static readonly diagonalPlacement: KeyBind;
    static readonly pick: KeyBind;
    static readonly ping: KeyBind;
    static readonly rebuildSelect: KeyBind;
    static readonly schematicSelect: KeyBind;
    static readonly schematicFlipX: KeyBind;
    static readonly schematicFlipY: KeyBind;
    static readonly schematicMenu: KeyBind;
    static readonly commandMode: KeyBind;
    static readonly commandQueue: KeyBind;
    static readonly createControlGroup: KeyBind;
    static readonly selectAllUnits: KeyBind;
    static readonly selectAllUnitFactories: KeyBind;
    static readonly selectAllUnitTransport: KeyBind;
    static readonly selectAcrossScreen: KeyBind;
    static readonly cancelOrders: KeyBind;
    static readonly unitStanceHoldFire: KeyBind;
    static readonly unitStancePursueTarget: KeyBind;
    static readonly unitStancePatrol: KeyBind;
    static readonly unitStanceRam: KeyBind;
    static readonly unitStanceBoost: KeyBind;
    static readonly unitStanceHoldPosition: KeyBind;
    static readonly unitCommandMove: KeyBind;
    static readonly unitCommandRepair: KeyBind;
    static readonly unitCommandRebuild: KeyBind;
    static readonly unitCommandAssist: KeyBind;
    static readonly unitCommandMine: KeyBind;
    static readonly unitCommandEnterPayload: KeyBind;
    static readonly unitCommandLoadUnits: KeyBind;
    static readonly unitCommandLoadBlocks: KeyBind;
    static readonly unitCommandUnloadPayload: KeyBind;
    static readonly unitCommandLoopPayload: KeyBind;
    static readonly categoryPrev: KeyBind;
    static readonly categoryNext: KeyBind;
    static readonly blockSelectLeft: KeyBind;
    static readonly blockSelectRight: KeyBind;
    static readonly blockSelectUp: KeyBind;
    static readonly blockSelectDown: KeyBind;
    static readonly blockSelect01: KeyBind;
    static readonly blockSelect02: KeyBind;
    static readonly blockSelect03: KeyBind;
    static readonly blockSelect04: KeyBind;
    static readonly blockSelect05: KeyBind;
    static readonly blockSelect06: KeyBind;
    static readonly blockSelect07: KeyBind;
    static readonly blockSelect08: KeyBind;
    static readonly blockSelect09: KeyBind;
    static readonly blockSelect10: KeyBind;
    static readonly zoom: KeyBind;
    static readonly detachCamera: KeyBind;
    static readonly teleportCursor: KeyBind;
    static readonly menu: KeyBind;
    static readonly fullscreen: KeyBind;
    static readonly pause: KeyBind;
    static readonly skipWave: KeyBind;
    static readonly minimap: KeyBind;
    static readonly research: KeyBind;
    static readonly planetMap: KeyBind;
    static readonly blockInfo: KeyBind;
    static readonly toggleMenus: KeyBind;
    static readonly screenshot: KeyBind;
    static readonly togglePowerLines: KeyBind;
    static readonly toggleBlockStatus: KeyBind;
    static readonly playerList: KeyBind;
    static readonly chat: KeyBind;
    static readonly chatHistoryPrev: KeyBind;
    static readonly chatHistoryNext: KeyBind;
    static readonly chatScroll: KeyBind;
    static readonly chatMode: KeyBind;
    static readonly console: KeyBind;
    static readonly debugHitboxes: KeyBind;
    static readonly performanceMetrics: KeyBind;
}


/** mindustry.input.PlaceMode */
declare class PlaceMode {
    static none: PlaceMode;
    static breaking: PlaceMode;
    static placing: PlaceMode;
    static schematicSelect: PlaceMode;
    static rebuildSelect: PlaceMode;
}


/** mindustry.input.Placement */
declare class Placement {
    static pathfindLine(isConveyor: boolean, tx_f: number, ty_f: number, tx_t: number, ty_t: number): Seq<Point2>
    static normalizeLine(tx_f: number, ty_f: number, tx_t: number, ty_t: number): Seq<Point2>
    static normalizeRectangle(tx_f: number, ty_f: number, tx_t: number, ty_t: number, size: number): Seq<Point2>
    static upgradeLine(tx_f: number, ty_f: number, tx_t: number, ty_t: number): Seq<Point2>
    static calculateNodes(ponSeq: Seq<Point2>, blk: Block, rot: number, overlapper: Boolf2<Point2, Point2>): void
    static isSidePlace(bPlanSeq: Seq<BuildPlan>): boolean
    static calculateBridges(bPlanSeq: Seq<BuildPlan>, brdBlk: ItemBridge): void
    static calculateBridges(bPlanSeq: Seq<BuildPlan>, brdBlk: ItemBridge, hasJunction: boolean, avoid: Boolf<Block>): void
    static calculateBridges(bPlanSeq: Seq<BuildPlan>, brdBlk: DirectionBridge, hasJunction: boolean, avoid: Boolf<Block>): void
    static normalizeDrawArea(blk: Block, tx_f: number, ty_f: number, tx_t: number, ty_t: number, snap: boolean, maxLen: number, scl: number): Placement.NormalizeDrawResult
    static normalizeArea(tx_f: number, ty_f: number, tx_t: number, ty_t: number, rot: number, snap: boolean, maxLen: number): Placement.NormalizeResult
}
declare namespace Placement {
    class NormalizeDrawResult {
        x: number;
        y: number;
        x2: number;
        y2: number;
    }
    class NormalizeResult {
        x: number;
        y: number;
        x2: number;
        y2: number;
        rotation: number;
    }
}
