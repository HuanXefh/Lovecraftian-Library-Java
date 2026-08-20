package lovec;

import lovec.graphics.drawer.*;
import lovec.graphics.drawer.multiblock.LCDrawMultiBlockFade;
import lovec.graphics.drawer.multiblock.LCDrawMultiBlockRotator;
import lovec.graphics.drawer.multiblock.LCDrawMultiBlockSymmetricPistons;
import lovec.graphics.drawer.multiblock.LCDrawMultiBlockSymmetricRegion;
import lovec.type.block.factory.MultiBlockCrafter;
import mindustry.mod.ClassMap;

public class LCClassMap {


    public static void load() {
        // Drawer
        add("LCDrawColorRegion", LCDrawColorRegion.class);
        add("LCDrawContent", LCDrawContent.class);
        add("LCDrawEffect", LCDrawEffect.class);
        add("LCDrawFire", LCDrawFire.class);
        add("LCDrawItemPile", LCDrawItemPile.class);
        add("LCDrawMixedLiquid", LCDrawMixedLiquid.class);
        add("LCDrawRipple", LCDrawRipple.class);
        add("LCDrawRotator", LCDrawRotator.class);
        add("LCDrawMultiBlockSymmetricRegion", LCDrawMultiBlockSymmetricRegion.class);
        add("LCDrawMultiBlockFade", LCDrawMultiBlockFade.class);
        add("LCDrawMultiBlockRotator", LCDrawMultiBlockRotator.class);
        add("LCDrawMultiBlockSymmetricPistons", LCDrawMultiBlockSymmetricPistons.class);

        // Block
        add("MultiBlockCrafter", MultiBlockCrafter.class);
    };


    private static void add(String key, Class<?> cls) {
        ClassMap.classes.put(key, cls);
    };


};
