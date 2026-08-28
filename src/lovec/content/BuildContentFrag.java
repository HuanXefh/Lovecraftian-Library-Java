package lovec.content;

import mindustry.gen.Building;
import mindustry.world.Block;

/**
 * Variant of {@link ContentFrag} specifically designed for buildings.
 * @param <T> Type of <code>this</code>.
 * @param <K> Type of the block.
 * @param <C> Type of the content frag class.
 */
public abstract class BuildContentFrag<T extends Building, K extends Block, C extends ContentFrag<T, C>> extends ContentFrag<T, C> {


    protected K blk;


    @Override
    public boolean canResolve() {
        return lastResolvedThis == null || lastResolvedThis.id != lastThis.id;
    };


    @Override
    public void onResolved() {
        blk = (K) lastThis.block;
    };


    public K getBlock() {
        return blk;
    };


};
