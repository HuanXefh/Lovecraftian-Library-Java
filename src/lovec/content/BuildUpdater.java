package lovec.content;

import mindustry.gen.Building;
import mindustry.world.Block;

public abstract class BuildUpdater<T extends Building, K extends Block> extends ContentUpdater<T> {


    protected T b;
    protected K blk;


    public BuildUpdater(T b) throws NoSuchFieldException, IllegalAccessException {
        super(b);
        this.b = b;
        this.blk = (K) b.block;
    };


};
