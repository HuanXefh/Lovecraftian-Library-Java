/** lovec.utils.pooling.PoolableNativeArray */
declare class PoolableNativeArray extends rhino._NativeArray implements Pool.Poolable {
    constructor(cap: number)
    constructor(...eles: Array<Object>)
}
interface PoolableNativeArray extends Pool.Poolable {}


/** lovec.utils.pooling.PoolableVec2 */
declare class PoolableVec2 extends Vec2 {}
/** lovec.utils.pooling.PoolableVec3 */
declare class PoolableVec3 extends Vec3 {}
