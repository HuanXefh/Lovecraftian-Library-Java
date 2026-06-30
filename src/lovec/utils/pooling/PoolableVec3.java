package lovec.utils.pooling;

import arc.math.geom.Vec3;
import arc.util.pooling.Pool;

public class PoolableVec3 extends Vec3 implements Pool.Poolable {


    public void reset() {
        set(0f, 0f, 0f);
    };


};
