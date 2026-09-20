/** arc.struct.Bits */
declare class Bits {}
/** arc.struct.GridBits */
declare class GridBits {}


/** arc.struct.ObjectSet */
declare class ObjectSet<T> implements Iterable<T>, Eachable<T> {}
interface ObjectSet<T> extends Iterable<T>, Eachable<T> {}
/** arc.struct.IntSet */
declare class IntSet {}
/** arc.struct.OrderedSet */
declare class OrderedSet<T> extends ObjectSet<T> {}


/** arc.struct.Queue */
declare class Queue<T> implements Iterable<T>, Eachable<T> {}
interface Queue<T> extends Iterable<T>, Eachable<T> {}
/** arc.struct.IntQueue */
declare class IntQueue {}
/** arc.struct.LongQueue */
declare class LongQueue {}
/** arc.struct.PQueue */
declare class PQueue<T> {}


/** arc.struct.Seq */
declare class Seq<T> implements Iterable<T>, Eachable<T> {
    each(cons: Cons<T>): void
    each(boolF: Boolf<T>, cons: Cons<T>): void

    get(ind: number): T
}
interface Seq<T> extends Iterable<T>, Eachable<T> {}
/** arc.struct.IntSeq */
declare class IntSeq {}
/** arc.struct.ByteSeq */
declare class ByteSeq {}
/** arc.struct.FloatSeq */
declare class FloatSeq {}
/** arc.struct.ShortSeq */
declare class ShortSeq {}
/** arc.struct.LongSeq */
declare class LongSeq {}
/** arc.struct.BoolSeq */
declare class BoolSeq {}


/** arc.struct.ObjectMap */
declare class ObjectMap<K, V> implements Iterable<ObjectMap.Entry<K, V>> {
    static of<K, V>(...objs: Array<Object>): ObjectMap<K, V>

    each(cons: Cons2<K, V>): void

    get(key: K): V|null
    get(key: K, def: V): V
}
interface ObjectMap<K, V> extends Iterable<ObjectMap.Entry<K, V>> {}
declare namespace ObjectMap {
    class Entry<K, V> {
        key: K;
        value: V;
    }
}
/** arc.struct.ObjectIntMap */
declare class ObjectIntMap<K> implements Iterable<ObjectIntMap.Entry<K>> {
    get(key: K): number
    get(key: K, def: number): number
}
interface ObjectIntMap<K> extends Iterable<ObjectIntMap.Entry<K>> {}
declare namespace ObjectIntMap {
    class Entry<K> {
        key: K;
        value: java.lang.Integer;
    }
}
/** arc.struct.ObjectFloatMap */
declare class ObjectFloatMap<K> implements Iterable<ObjectFloatMap.Entry<K>> {
    get(key: K): number
    get(key: K, def: number): number
}
interface ObjectFloatMap<K> extends Iterable<ObjectFloatMap.Entry<K>> {}
declare namespace ObjectFloatMap {
    class Entry<K> {
        key: K;
        value: java.lang.Float;
    }
}
/** arc.struct.IntMap */
declare class IntMap<V> implements Iterable<IntMap.Entry<V>> {
    get(key: number): V|null
    get(key: number, def: V): V
}
interface IntMap<V> extends Iterable<IntMap.Entry<V>> {}
declare namespace IntMap {
    class Entry<V> {
        key: java.lang.Integer;
        value: V;
    }
}
/** arc.struct.IntIntMap */
declare class IntIntMap implements Iterable<IntIntMap.Entry> {
    get(key: number): number
    get(key: number, def: number): number
}
interface IntIntMap extends Iterable<IntIntMap.Entry> {}
declare namespace IntIntMap {
    class Entry {
        key: java.lang.Integer;
        value: java.lang.Integer;
    }
}
/** arc.struct.IntFloatMap */
declare class IntFloatMap implements Iterable<IntFloatMap.Entry> {
    get(key: number): number
    get(key: number, def: number): number
}
interface IntFloatMap extends Iterable<IntFloatMap.Entry> {}
declare namespace IntFloatMap {
    class Entry {
        key: java.lang.Integer;
        value: java.lang.Float;
    }
}
/** arc.struct.LongMap */
declare class LongMap<V> implements Iterable<LongMap.Entry<V>> {
    get(key: number): V|null
    get(key: number, def: V): V
}
interface LongMap<V> extends Iterable<LongMap.Entry<V>> {}
declare namespace LongMap {
    class Entry<V> {
        key: java.lang.Long;
        value: V;
    }
}
/** arc.struct.StringMap */
declare class StringMap extends ObjectMap<string, string> {}
/** arc.struct.ArrayMap */
declare class ArrayMap<K, V> implements Iterable<ObjectMap.Entry<K, V>> {
    get(key: K): V|null
}
interface ArrayMap<K, V> extends Iterable<ObjectMap.Entry<K, V>> {}
/** arc.struct.GridMap */
declare class GridMap<V> {
    get(x: number, y: number): V|null
    get(x: number, y: number, def: V): V
}
/** arc.struct.OrderedMap */
declare class OrderedMap<K, V> extends ObjectMap<K, V> {}


/** arc.struct.EnumSet */
declare class EnumSet<T> {}
