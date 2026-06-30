package lovec.utils.pooling;

import arc.math.geom.Vec2;
import arc.util.pooling.Pool;

public class PoolableVec2 extends Vec2 implements Pool.Poolable {


    public void reset() {
        set(0f, 0f);
    };


};
