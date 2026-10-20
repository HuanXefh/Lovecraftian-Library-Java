package lovec.content;

import mindustry.gen.Building;
import mindustry.world.Block;

public abstract class LCBuildUpdater<T extends Building, K extends Block> extends LCContentUpdater<T> {


    protected T b;
    protected K blk;


    public LCBuildUpdater(T b) throws NoSuchFieldException, IllegalAccessException {
        super(b);
        this.b = b;
        this.blk = (K) b.block;
    };


};
