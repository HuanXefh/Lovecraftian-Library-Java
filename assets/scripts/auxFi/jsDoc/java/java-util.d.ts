declare namespace java {
    namespace util {
        /** java.util.Comparator */
        interface Comparator<T> {
            compare(obj1: T, obj2: T): java.lang.Integer
        }

        /** java.util.RandomAccess */
        interface RandomAccess {}
        /** java.util.Enumeration<T> */
        interface Enumeration<T> {
            hasMoreElements(): boolean
            nextElement(): T
        }
        /** java.util.StringTokenizer */
        class StringTokenizer implements Enumeration<Object> {
            constructor(str: string, delim?: string, returnDelims?: boolean)

            countTokens(): number
            hasMoreTokens(): boolean
            nextToken(delim?: string): string
        }
        interface StringTokenizer extends Enumeration<Object> {}


        /** java.util.Collection */
        interface Collection<T> extends Iterable<T> {}
        /** java.util.AbstractCollection */
        class AbstractCollection<T> implements Collection<T> {}
        interface AbstractCollection<T> extends Collection<T> {}


        /** java.util.Set */
        interface Set<T> extends Collection<T> {}
        /** java.util.AbstractSet */
        class AbstractSet<T> extends AbstractCollection<T> implements Set<T> {}
        interface AbstractSet<T> extends Set<T> {}
        /** java.util.HashSet */
        class HashSet<T> extends AbstractSet<T> implements Set<T>, java.lang.Cloneable, java.io.Serializable {}
        interface HashSet<T> extends Set<T>, java.lang.Cloneable, java.io.Serializable {}
        /** java.util.LinkedHashSet */
        class LinkedHashSet<T> extends HashSet<T> implements Set<T>, java.lang.Cloneable, java.io.Serializable {}
        interface LinkedHashSet<T> extends Set<T>, java.lang.Cloneable, java.io.Serializable {}
        /** java.util.EnumSet */
        class EnumSet<T extends java.lang.Enum<T>> extends AbstractSet<T> implements java.lang.Cloneable, java.io.Serializable {}
        interface EnumSet<T extends java.lang.Enum<T>> extends java.lang.Cloneable, java.io.Serializable {}
        /** java.util.SortedSet */
        interface SortedSet<T> extends Set<T> {}
        /** java.util.NavigableSet */
        interface NavigableSet<T> extends SortedSet<T> {}
        /** java.util.TreeSet */
        class TreeSet<T> extends AbstractSet<T> implements NavigableSet<T>, java.lang.Cloneable, java.io.Serializable {}
        interface TreeSet<T> extends NavigableSet<T>, java.lang.Cloneable, java.io.Serializable {}


        /** java.util.Queue */
        interface Queue<T> extends Collection<T> {}
        /** java.util.Deque */
        interface Deque<T> extends Queue<T> {}
        /** java.util.AbstractQueue */
        class AbstractQueue<T> extends AbstractCollection<T> implements Queue<T> {}
        interface AbstractQueue<T> extends Queue<T> {}
        /** java.util.PriorityQueue */
        class PriorityQueue<T> extends AbstractQueue<T> implements java.io.Serializable {}
        interface PriorityQueue<T> extends java.io.Serializable {}
        /** java.util.ArrayDeque */
        class ArrayDeque<T> extends AbstractQueue<T> implements Deque<T>, java.lang.Cloneable, java.io.Serializable {}
        interface ArrayDeque<T> extends Deque<T>, java.lang.Cloneable, java.io.Serializable {}


        /** java.util.List */
        interface List<T> extends Collection<T> {}
        /** java.util.AbstractList */
        class AbstractList<T> extends AbstractCollection<T> implements List<T> {}
        interface AbstractList<T> extends List<T> {}
        /** java.util.ArrayList */
        class ArrayList<T> extends AbstractList<T> implements List<T>, RandomAccess, java.lang.Cloneable, java.io.Serializable {}
        interface ArrayList<T> extends List<T>, RandomAccess, java.lang.Cloneable, java.io.Serializable {}


        /** java.util.AbstractSequentialList */
        class AbstractSequentialList<T> extends AbstractList<T> {}
        /** java.util.LinkedList */
        class LinkedList<T> extends AbstractSequentialList<T> implements List<T>, Deque<T>, java.lang.Cloneable, java.io.Serializable {}
        interface LinkedList<T> extends List<T>, Deque<T>, java.lang.Cloneable, java.io.Serializable {}


        /** java.util.Vector */
        class Vector<T> extends AbstractList<T> implements List<T>, RandomAccess, java.lang.Cloneable, java.io.Serializable {}
        interface Vector<T> extends List<T>, RandomAccess, java.lang.Cloneable, java.io.Serializable {}
        /** java.util.Stack */
        class Stack<T> extends Vector<T> {}


        /** java.util.Map */
        interface Map<K, V> {}
        namespace Map {
            class Entry<K, V> {}
        }
        /** java.util.AbstractMap */
        class AbstractMap<K, V> implements Map<K, V> {}
        interface AbstractMap<K, V> extends Map<K, V> {}
        namespace AbstractMap {
            class SimpleEntry<K, V> implements Map.Entry<K, V>, java.io.Serializable {}
            interface SimpleEntry<K, V> extends Map.Entry<K, V>, java.io.Serializable {}
            class SimpleImmutableEntry<K, V> implements Map.Entry<K, V>, java.io.Serializable {}
            interface SimpleImmutableEntry<K, V> extends Map.Entry<K, V>, java.io.Serializable {}
        }
        /** java.util.WeakHashMap */
        class WeakHashMap<K, V> extends AbstractMap<K, V> implements Map<K, V> {}
        interface WeakHashMap<K, V> extends Map<K, V> {}
        /** java.util.EnumMap */
        class EnumMap<K extends java.lang.Enum<K>, V> extends AbstractMap<K, V> implements java.io.Serializable, java.lang.Cloneable {}
        interface EnumMap<K extends java.lang.Enum<K>, V> extends java.io.Serializable, java.lang.Cloneable {}
        /** java.util.SortedMap */
        interface SortedMap<K, V> extends Map<K, V> {}
        /** java.util.NavigableMap */
        interface NavigableMap<K, V> extends SortedMap<K, V> {}
        /** java.util.TreeMap */
        class TreeMap<K, V> extends AbstractMap<K, V> implements NavigableMap<K, V>, java.lang.Cloneable, java.io.Serializable {}
        interface TreeMap<K, V> extends NavigableMap<K, V>, java.lang.Cloneable, java.io.Serializable {}


        /** java.util.Dictionary */
        class Dictionary<K, V> {}
        /** java.util.Hashtable */
        class Hashtable<K, V> extends Dictionary<K, V> implements Map<K, V>, java.lang.Cloneable, java.io.Serializable {}
        interface HashTable<K, V> extends Map<K, V>, java.lang.Cloneable, java.io.Serializable {}
        /** java.util.Properties */
        class Properties extends Hashtable<Object, Object> {
            propertyNames(): Enumeration<any>
            stringPropertyNames(): Set<string>
            
            load(input: java.io.InputStream): void
            load(input: java.io.Reader): void
            loadFromXML(input: java.io.InputStream): void
            list(output: java.io.PrintStream): void
            list(output: java.io.PrintWriter): void
            store(output: java.io.OutputStream, comment: string): void
            storeToXML(output: java.io.OutputStream, comment: string, encoding?: string): void

            getProperty(key: string, def?: string): string
            setProperty(key: string, val: string): Object
        }


        /** java.util.Locale */
        class Locale implements java.lang.Cloneable, java.io.Serializable {}
        interface Locale extends java.lang.Cloneable, java.io.Serializable {}

        /** java.util.UUID */
        class UUID implements java.io.Serializable, java.lang.Comparable<UUID> {
            constructor(mostSigBits: java.lang.Long, leastSigBits: java.lang.Long)

            static fromString(name: string): UUID
            static nameUUIDFromBytes(name: Array<java.lang.Byte>): UUID
            static randomUUID(): UUID

            node(): java.lang.Long
            variant(): java.lang.Integer
            version(): java.lang.Integer
            timestamp(): java.lang.Long
            clockSequence(): java.lang.Integer
            getLeastSignificantBits(): java.lang.Long
            getMostSignificantBits(): java.lang.Long
        }
        interface UUID extends java.io.Serializable, java.lang.Comparable<UUID> {}
    }
}
