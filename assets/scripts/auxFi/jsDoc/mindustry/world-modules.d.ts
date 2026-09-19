/** mindustry.world.modules.BlockModule */
declare class BlockModule {}


/** mindustry.world.modules.ItemModule */
declare class ItemModule extends BlockModule {
    static readonly empty: ItemModule;

    length(): number
    has(id: number): boolean
    has(item: Item, amt?: number): boolean
    has(itemStacks: Array<ItemStack>, mtp?: number): boolean
    has(itemSeq: ItemSeq): boolean
    has(iterable: Iterable<ItemStack>): boolean
    hasOne(itemStacks: Array<ItemStack>): boolean
    empty(): boolean
    any(): boolean
    total(): number
    first(): Item|null
    take(): Item|null
    get(id: number): number
    get(item: Item): number
    set(item: Item, amt: number): void
    add(item: Item, amt: number): void
    add(itemSeq: ItemSeq): void
    add(iterable: Iterable<ItemStack>): void
    add(itemMdl: ItemModule): void
    remove(item: Item, amt: number): void
    remove(itemStack: ItemStack): void
    remove(itemStacks: Array<ItemStack>): void
    remove(itemSeq: ItemSeq): void
    remove(iterable: Iterable<ItemStack>): void
    clear(): void
    each(cons: ItemModule.ItemConsumer): void
    sum(calc: ItemModule.ItemCalculator): number

    copy(): ItemModule
    set(itemMdl: ItemModule): void
}
declare namespace ItemModule {
    interface ItemConsumer {
        accept(item: Item, amt: number): void
    }
    interface ItemCalculator {
        get(item: Item, amt: number): number
    }
}


/** mindustry.world.modules.LiquidModule */
declare class LiquidModule extends BlockModule {
    current(): Liquid
    currentAmount(): number
    set(liq: Liquid, amt: number): void
    reset(liq: Liquid, amt: number): void
    get(liq: Liquid): number
    add(liq: Liquid, amt: number): void
    remove(liq: Liquid, amt: number): void
    clear(): void
    each(cons: LiquidModule.LiquidConsumer): void
    sum(calc: LiquidModule.LiquidCalculator): number
}
declare namespace LiquidModule {
    interface LiquidConsumer {
        accept(liq: Liquid, amt: number): void
    }
    interface LiquidCalculator {
        get(liq: Liquid, amt: number): number
    }
}


/** mindustry.world.modules.PowerModule */
declare class PowerModule extends BlockModule {
    status: number;
    init: boolean;
    graph: PowerGraph;
    links: IntSeq;
}
