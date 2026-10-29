package lovec.utils.pooling;

import arc.util.pooling.Pool;
import lovec.utils.extend.SLCNativeArray;
import rhino.NativeArray;

public class LCPoolableNativeArray extends NativeArray implements Pool.Poolable {


    public LCPoolableNativeArray(long cap) {
        super(cap);
    };
    // Overload
    public LCPoolableNativeArray(Object... eles) {
        super(eles);
    };


    @Override
    public void reset() {
        SLCNativeArray.clear(this);
    };


};
