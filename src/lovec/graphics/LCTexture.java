package lovec.graphics;

import arc.Core;
import arc.graphics.g2d.TextureRegion;
import arc.struct.ObjectMap;
import mindustry.Vars;
import mindustry.world.Block;

/**
 * Handles texture and pixmap.
 */
public class LCTexture {


    public static TextureRegion empty = new TextureRegion();

    static ObjectMap<String, TextureRegion> blockRegionCache = new ObjectMap<>();
    static ObjectMap<String, String> blockRegionNameCache = new ObjectMap<>();


    /* <-------------------- texture region --------------------> */


    /**
     * Gets the region used for some block.
     */
    public static TextureRegion getBlockRegion(String nameBlk) {
        if(Vars.headless) return empty;
        if(blockRegionCache.containsKey(nameBlk)) return blockRegionCache.get(nameBlk);

        TextureRegion reg = Core.atlas.find(getBlockRegionString(nameBlk));
        blockRegionCache.put(nameBlk, reg);

        return reg;
    };
    // Overload
    public static TextureRegion getBlockRegion(Block blk) {
        return blk.uiIcon;
    };


    public static String getBlockRegionString(String nameBlk) {
        if(Vars.headless) return "";
        if(blockRegionNameCache.containsKey(nameBlk)) return blockRegionNameCache.get(nameBlk);

        String regStr = Core.atlas.has(nameBlk + "-full") ?
            (nameBlk + "-full") :
            Core.atlas.has(nameBlk + "-icon") ?
                (nameBlk + "-icon") :
                nameBlk;
        blockRegionNameCache.put(nameBlk, regStr);

        return regStr;
    };
    // Overload
    public static String getBlockRegionString(Block blk) {
        return getBlockRegionString(blk.name);
    };


    /* <-------------------- pixmap --------------------> */


};
