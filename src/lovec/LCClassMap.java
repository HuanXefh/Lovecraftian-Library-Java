package lovec;

import lovec.graphics.drawer.*;
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
    };


    private static void add(String key, Class<?> cls) {
        ClassMap.classes.put(key, cls);
    };


};
