/** mindustry.type.Publishable */
interface Publishable {}


/** mindustry.type.Sector */
declare class Sector {}


/** mindustry.type.MapLocales */
declare class MapLocales {}


/** mindustry.type.ItemStack */
declare class ItemStack {
    item: Item;
    amount: number;

    static with(...items: Array<Object>): Array<ItemStack>
}
/** mindustry.type.LiquidStack */
declare class LiquidStack {
    liquid: Liquid;
    amount: number;

    static with(...items: Array<Object>): Array<LiquidStack>
}
/** mindustry.type.PayloadStack */
declare class PayloadStack {
    item: UnlockableContent;
    amount: number;

    static with(...items: Array<Object>): Array<PayloadStack>
}


/** mindustry.type.ItemSeq */
declare class ItemSeq {}
/** mindustry.type.PayloadSeq */
declare class PayloadSeq {}
