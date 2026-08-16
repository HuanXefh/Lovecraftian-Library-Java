package lovec.content;

import mindustry.gen.Building;
import mindustry.world.Block;

/**
 * Variant of {@link ContentFrag} specifically designed for buildings.
 */
public abstract class BuildContentFrag<T extends Building, K extends Block> extends ContentFrag<T> {


    protected K blk;


    @Override
    public void onResolved() {
        blk = (K) lastThis.block;
    };


    public K getBlock() {
        return blk;
    };


};
