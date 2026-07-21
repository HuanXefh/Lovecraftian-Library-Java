package lovec.utils.pooling;

import arc.util.pooling.Pool;
import lovec.utils.extend.LCNativeArray;
import rhino.NativeArray;

public class PoolableNativeArray extends NativeArray implements Pool.Poolable {


    public PoolableNativeArray(long cap) {
        super(cap);
    };
    // Overload
    public PoolableNativeArray(Object... eles) {
        super(eles);
    };


    public void reset() {
        LCNativeArray.clear(this);
    };


};
