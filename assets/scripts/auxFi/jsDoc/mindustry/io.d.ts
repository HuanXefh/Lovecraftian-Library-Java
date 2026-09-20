/** mindustry.io.SaveFileReader */
declare class SaveFileReader {}
declare namespace SaveFileReader {
    interface CustomChunk {}
}


/** mindustry.io.TypeIO */
declare class TypeIO {
    static readonly nullType: java.lang.Byte;
    static readonly integerType: java.lang.Byte;
    static readonly longType: java.lang.Byte;
    static readonly floatType: java.lang.Byte;
    static readonly stringType: java.lang.Byte;
    static readonly contentType: java.lang.Byte;
    static readonly intSeqType: java.lang.Byte;
    static readonly point2Type: java.lang.Byte;
    static readonly point2ArrayType: java.lang.Byte;
    static readonly techNodeType: java.lang.Byte;
    static readonly booleanType: java.lang.Byte;
    static readonly doubleType: java.lang.Byte;
    static readonly buildingType: java.lang.Byte;
    static readonly lAccessType: java.lang.Byte;
    static readonly byteArrayType: java.lang.Byte;
    static readonly legacyType: java.lang.Byte;
    static readonly booleanArrayType: java.lang.Byte;
    static readonly unitType: java.lang.Byte;
    static readonly vec2ArrayType: java.lang.Byte;
    static readonly vec2Type: java.lang.Byte;
    static readonly teamType: java.lang.Byte;
    static readonly intArrayType: java.lang.Byte;
    static readonly objectArrayType: java.lang.Byte;
    static readonly unitCommandType: java.lang.Byte;

    static writeObject(wr: Writes, obj: Object): void
    static readObject(rd: Reads): Object|null
    static readObject(rd: Reads, boxed: boolean, ctMapper: TypeIO.ContentMapper|null, safe?: boolean, allowArrays?: boolean, type?: java.lang.Byte): Object|null
    static readObjectBoxed(rd: Reads, boxed: boolean): Object|null
    static readObjectSafe(rd: Reads): Object|null

    static writeUiBuilder(wr: Writes, node: NodeBuilder<Object>): void
    static readUiBuilder(rd: Reads): NodeBuilder<Object>
    static writeMenuResult(wr: Writes, menuResult: MenuResult): void
    static readMenuResult(rd: Reads): MenuResult

    static writePayload(wr: Writes, pay: Payload): void
    static readPayload(wr: Writes): Payload
    static writeMounts(wr: Writes, mts: Array<WeaponMount>): void
    static readMounts(rd: Reads, mts: Array<WeaponMount>): Array<WeaponMount>
    static writeAbilities(wr: Writes, mts: Array<Ability>): void
    static readAbilities(rd: Reads, mts: Array<Ability>): Array<Ability>
    static writeUnitContainer(wr: Writes, unitCont: Units.UnitSyncContainer): void
    static readUnitContainer(rd: Reads): Units.UnitSyncContainer
    static writeUnit(wr: Writes, unit: Unit): void
    static readUnit(rd: Reads): Unit
    static writeCommand(wr: Writes, command: UnitCommand|null): void
    static readCommand(rd: Reads): UnitCommand|null
    static writeStance(wr: Writes, command: UnitStance|null): void
    static readStance(rd: Reads): UnitStance|null
    static writePosEntity(wr: Writes, e: Posc): void
    static readPosEntity(rd: Reads): Posc
    static writeEntity(wr: Writes, e: Entityc): void
    static readEntity(rd: Reads): Entityc
    static writeBuilding(wr: Writes, b: Building): void
    static readBuilding(rd: Reads): Building
    static writeTile(wr: Writes, t: Tile): void
    static readTile(rd: Reads): Tile
    static writeBlock(wr: Writes, blk: Block): void
    static readBlock(rd: Reads): Block
    static getMaxPlans(bPlanQ: Queue<BuildPlan>): number
    static writePlansQueueNet(wr: Writes, bPlanQ: Queue<BuildPlan>): void
    static readPlansQueueNet(rd: Reads): Queue<BuildPlan>
    static readPlansQueue(rd: Reads): Queue<BuildPlan>
    static writePlan(wr: Writes, bPlan: BuildPlan): void
    static readPlan(rd: Reads): BuildPlan
    static writePlans(wr: Writes, bPlans: Array<BuildPlan>): void
    static readPlan(rd: Reads): Array<BuildPlan>
    static writeClientPlans(wr: Writes, plans: TypeIO.ClientBuildPlans): void
    static readClientPlans(rd: Reads): TypeIO.ClientBuildPlans
    static writeController(wr: Writes, ctrl: UnitController): void
    static readController(rd: Reads, prev: UnitController): UnitController
    static writeKick(wr: Writes, reason: Packets.KickReason): void
    static readKick(rd: Reads): Packets.KickReason
    static writeMarkerControl(wr: Writes, marker: LMarkerControl): void
    static readMarkerControl(rd: Reads): LMarkerControl
    static writeRules(wr: Writes, rule: Rules): void
    static readRules(rd: Reads): Rules
    static writeObjectives(wr: Writes, mapObjectives: MapObjectives): void
    static readObjectives(rd: Reads): MapObjectives
    static writeObjectiveMarker(wr: Writes, marker: MapObjectives.ObjectiveMarker): void
    static readObjectiveMarker(rd: Reads): MapObjectives.ObjectiveMarker
    static writeVecNullable(wr: Writes, vec: Vec2|null): void
    static readVecNullable(rd: Reads): Vec2|null
    static writeVec2(wr: Writes, vec: Vec2): void
    static readVec2(rd: Reads, vec?: Vec2): Vec2
    static writeStatus(wr: Writes, staEn: StatusEntry): void
    static readStatus(rd: Reads): StatusEntry
    static writeItems(wr: Writes, itemStack: ItemStack): void
    static readItems(rd: Reads, itemStack?: ItemStack): ItemStack
    static writeItemStacks(wr: Writes, itemStacks: Array<ItemStack>): void
    static readItemStacks(rd: Reads): Array<ItemStack>
    static writeLiquidStacks(wr: Writes, liqStacks: Array<LiquidStack>): void
    static readLiquidStacks(rd: Reads): Array<LiquidStack>
    static writeTeam(wr: Writes, team: Team): void
    static readTeam(rd: Reads): Team
    static writeAction(wr: Writes, act: Packets.AdminAction): void
    static readAction(rd: Reads): Packets.AdminAction
    static writeUnitType(wr: Writes, utp: UnitType): void
    static readUnitType(rd: Reads): UnitType
    static writeEffect(wr: Writes, eff: Effect): void
    static readEffect(rd: Reads): Effect
    static writeColor(wr: Writes, color: Color): void
    static readColor(rd: Reads, color?: Color): Color
    static writeIntSeq(wr: Writes, intSeq: IntSeq): void
    static readIntSeq(rd: Reads): IntSeq
    static writeContent(wr: Writes, ct: Content): void
    static readContent(rd: Reads): Content
    static writeLiquid(wr: Writes, liq: Liquid): void
    static readLiquid(rd: Reads): Liquid
    static writeBulletType(wr: Writes, btp: BulletType): void
    static readBulletType(rd: Reads): BulletType
    static writeItem(wr: Writes, item: Item): void
    static readItem(rd: Reads): Item
    static writeSound(wr: Writes, sound: Sound): void
    static readSound(rd: Reads): Sound
    static writeWeather(wr: Writes, wea: Weather): void
    static readWeather(rd: Reads): Weather
    static writeString(wr: Writes, str: string): void
    static readString(rd: Reads): java.lang.String
    static writeBytes(wr: Writes, bytes: Array<java.lang.Byte>): void
    static readBytes(rd: Reads): JavaArray<java.lang.Byte>
    static writeInts(wr: Writes, ints: Array<java.lang.Integer>): void
    static readInts(rd: Reads): JavaArray<java.lang.Integer>
    static writeShorts(wr: Writes, shorts: Array<java.lang.Short>): void
    static readShorts(rd: Reads): JavaArray<java.lang.Short>
    static writeTraceInfo(wr: Writes, traceInfo: Administration.TraceInfo): void
    static readTraceInfo(rd: Reads): Administration.TraceInfo
    static writeStrings(wr: Writes, strs: Array<string>, maxlen?: number): void
    static readString(rd: Reads): JavaArray<java.lang.String>
    static writeStringArray(wr: Writes, strMatArr: D2Array<string>): void
    static readStringArray(rd: Reads): JavaArray<JavaArray<java.lang.String>>
}
declare namespace TypeIO {
    class ClientBuildPlans extends Seq<BuildPlan> {}
    interface ContentMapper {
        get(type: ContentType, id: number): Content
    }
    interface Boxed<T> {
        unbox(): T
    }
    class BuildingBox implements Boxed<Building> {
        pos: number;
    }
    interface BuildingBox extends Boxed<Building> {}
    class UnitBox implements Boxed<Unit> {
        id: number;
    }
    interface UnitBox extends Boxed<Unit> {}
}
