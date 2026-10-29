package lovec;

import lovec.graphics.drawer.*;
import lovec.graphics.drawer.multiblock.*;
import lovec.type.block.factory.MultiBlockCrafter;
import lovec.type.block.factory.MultiBlockLiquidRouter;
import mindustry.mod.ClassMap;

public class SLCClassMap {


    public static void load() {
        // Drawer
        add("LCDrawColorRegion", LCDrawColorRegion.class);
        add("LCDrawContent", LCDrawContent.class);
        add("LCDrawEffect", LCDrawEffect.class);
        add("LCDrawFade", LCDrawFade.class);
        add("LCDrawFire", LCDrawFire.class);
        add("LCDrawFourSideRegions", LCDrawFourSideRegions.class);
        add("LCDrawItemPile", LCDrawItemPile.class);
        add("LCDrawMixedLiquid", LCDrawMixedLiquid.class);
        add("LCDrawProgressRegion", LCDrawProgressRegion.class);
        add("LCDrawRipple", LCDrawRipple.class);
        add("LCDrawRotator", LCDrawRotator.class);
        add("LCDrawMultiBlockSymmetricRegion", LCDrawMultiBlockSymmetricRegion.class);
        add("LCDrawMultiBlockFade", LCDrawMultiBlockFade.class);
        add("LCDrawMultiBlockLiquidTile", LCDrawMultiBlockLiquidTile.class);
        add("LCDrawMultiBlockRotator", LCDrawMultiBlockRotator.class);
        add("LCDrawMultiBlockPistons", LCDrawMultiBlockPistons.class);

        // Block
        add("MultiBlockLiquidRouter", MultiBlockLiquidRouter.class);
        add("MultiBlockCrafter", MultiBlockCrafter.class);
    };


    private static void add(String key, Class<?> cls) {
        ClassMap.classes.put(key, cls);
    };


};
