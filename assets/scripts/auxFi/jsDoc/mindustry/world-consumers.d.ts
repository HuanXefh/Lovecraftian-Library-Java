/** mindustry.world.consumers.Consume */
declare class Consume {
    optional: boolean;
    booster: boolean;
    update: boolean;
    multiplier: Floatf<Building>;
}


/** mindustry.world.consumers.ConsumeItems */
declare class ConsumeItems extends Consume {
    readonly items: Array<ItemStack>;

    constructor(itemStacks: Array<ItemStack>)
}
/** mindustry.world.consumers.ConsumeItemDynamic */
declare class ConsumeItemDynamic extends Consume {
    readonly items: Func<Building, Array<ItemStack>>;

    constructor(itemStacksF: Func<Building, Array<ItemStack>>)
}
/** mindustry.world.consumers.ConsumeItemFilter */
declare class ConsumeItemFilter extends Consume {
    filter: Boolf<Item>;

    constructor()
    constructor(filter: Boolf<Item>)
}
/** mindustry.world.consumers.ConsumeItemList */
declare class ConsumeItemList extends ConsumeItemFilter {
    itemMultipliers: ObjectFloatMap<Item>;

    constructor()
    constructor(...items: Array<Item>)

    /** `ARGS`: item1, mtp1, item2, mtp2, item3, mtp3, ... */
    setMultipliers(...args: Array<Object>): void
}
/** mindustry.world.consumers.ConsumeItemExplode */
declare class ConsumeItemExplode extends ConsumeItemFilter {
    damage: number;
    threshold: number;
    baseChance: number;
    explodeEffect: Effect;

    constructor()
    constructor(thr: number)
}
/** mindustry.world.consumers.ConsumeItemEfficiency */
declare class ConsumeItemEfficiency extends ConsumeItemFilter {
    itemDurationMultipliers: ObjectFloatMap<Item>;

    constructor()
    constructor(filter: Boolf<Item>)
}
/** mindustry.world.consumers.ConsumeItemExplosive */
declare class ConsumeItemExplosive extends ConsumeItemEfficiency {
    minExplosiveness: number;

    constructor()
    constructor(minExplo: number)
}
/** mindustry.world.consumers.ConsumeItemFlammable */
declare class ConsumeItemFlammable extends ConsumeItemEfficiency {
    minFlammability: number;

    constructor()
    constructor(minFlam: number)
}
/** mindustry.world.consumers.ConsumeItemCharged */
declare class ConsumeItemCharged extends ConsumeItemEfficiency {
    minCharge: number;

    constructor()
    constructor(minCharge: number)
}
/** mindustry.world.consumers.ConsumeItemRadioactive */
declare class ConsumeItemRadioactive extends ConsumeItemEfficiency {
    minRadioactivity: number;

    constructor()
    constructor(minRadio: number)
}


/** mindustry.world.consumers.ConsumeLiquidBase */
declare class ConsumeLiquidBase extends Consume {
    amount: number;

    constructor()
    constructor(amt: number)
}
/** mindustry.world.consumers.ConsumeLiquid */
declare class ConsumeLiquid extends ConsumeLiquidBase {
    readonly liquid: Liquid;

    constructor(liq: Liquid, amt: number)
}
/** mindustry.world.consumers.ConsumeLiquids */
declare class ConsumeLiquids extends Consume {
    readonly liquids: Array<LiquidStack>;

    constructor(liqStacks: Array<LiquidStack>)
}
/** mindustry.world.consumers.ConsumeLiquidsDynamic */
declare class ConsumeLiquidsDynamic extends Consume {
    readonly liquids: Func<Building, Array<LiquidStack>>;

    constructor(liqStacksF: Func<Building, Array<LiquidStack>>)
}
/** mindustry.world.consumers.ConsumeLiquidFilter */
declare class ConsumeLiquidFilter extends ConsumeLiquidBase {
    filter: Boolf<Liquid>;

    constructor()
    constructor(filter: Boolf<Liquid>, amt: number)
}
/** mindustry.world.consumers.ConsumeLiquidFlammable */
declare class ConsumeLiquidFlammable extends ConsumeLiquidFilter {
    minFlammability: number;

    constructor()
    constructor(amt: number)
    constructor(minFlam: number, amt: number)
}
/** mindustry.world.consumers.ConsumeCoolant */
declare class ConsumeCoolant extends ConsumeLiquidFilter {
    maxTemp: number;
    maxFlammability: number;
    allowLiquid: boolean;
    allowGas: boolean;

    constructor()
    constructor(amt: number)
    constructor(amt: number, allowLiq: boolean, allowGas: boolean)
}


/** mindustry.world.consumers.ConsumePower */
declare class ConsumePower extends Consume {
    usage: number;
    capacity: number;
    buffered: boolean;

    constructor(usage: number, cap: number, buffered: boolean)
}
/** mindustry.world.consumers.ConsumePowerCondition */
declare class ConsumePowerCondition extends ConsumePower {
    constructor(usage: number, boolF: Boolf<Building>)
}
/** mindustry.world.consumers.ConsumePowerDynamic */
declare class ConsumePowerDynamic extends ConsumePower {
    constructor(usageF: Floatf<Building>)
    constructor(displayedUsage: number, usageF: Floatf<Building>)
}


/** mindustry.world.consumers.ConsumePayloads */
declare class ConsumePayloads extends Consume {
    payloads: Seq<PayloadStack>;

    constructor(payStackSeq: Seq<PayloadStack>)
}
/** mindustry.world.consumers.ConsumePayloadDynamic */
declare class ConsumePayloadDynamic extends Consume {
    readonly payloads: Func<Building, Seq<PayloadStack>>;

    constructor(payStackSeqF: Func<Building, Seq<PayloadStack>>)
}
/** mindustry.world.consumers.ConsumePayloadFilter */
declare class ConsumePayloadFilter extends Consume {
    filter: Boolf<UnlockableContent>;

    constructor(filter: Boolf<UnlockableContent>)
}
