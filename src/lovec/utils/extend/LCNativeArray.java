package lovec.utils.extend;

import arc.func.*;
import arc.math.Mathf;
import arc.util.Nullable;
import arc.util.pooling.Pools;
import lovec.utils.LCScript;
import lovec.utils.TmpStateTag;
import lovec.utils.pooling.PoolableNativeArray;
import rhino.*;

import java.util.Objects;

/**
 * Various methods for Rhino native array.
 */
public class LCNativeArray {


    /* <-------------------- base --------------------> */


    /**
     * Empties an array.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray clear(NativeArray arr) {
        arr.put("length", arr, 0);
        return arr;
    };


    /**
     * Gets index of an element in an array, -1 if not found.
     */
    public static int indexOf(NativeArray arr, Object ele, @Nullable Func mapF) {
        int i = 0;
        long iCap = arr.getLength();
        Object wrappedEle = LCScript.wrapEquality(ele);
        if(mapF == null) {
            while(i < iCap) {
                if(Objects.equals(wrappedEle, LCScript.wrapEquality(arr.get(i)))) return i;
                i++;
            };
        } else {
            while(i < iCap) {
                if(Objects.equals(wrappedEle, LCScript.wrapEquality(mapF.get(LCScript.wrap(arr.get(i)))))) return i;
                i++;
            };
        };
        return -1;
    };
    // Overload
    public static int indexOf(NativeArray arr, Object ele) {
        return indexOf(arr, ele, null);
    };
    public static int indexOf(Object[] objs, Object ele, @Nullable Func mapF) {
        return LCScript.toInt(wrapFunc(objs, arr0 -> indexOf(arr0, ele, mapF)));
    };
    public static int indexOf(Object[] objs, Object ele) {
        return indexOf(objs, ele, null);
    };


    /**
     * Gets first element, null if not found.
     */
    public static @Nullable Object first(NativeArray arr) {
        long cap = arr.getLength();
        return cap == 0 ? null : arr.get(0);
    };
    // Overload
    public static @Nullable Object first(Object[] objs) {
        return wrapFunc(objs, LCNativeArray::first);
    };


    /**
     * Gets last element, null if not found.
     */
    public static @Nullable Object last(NativeArray arr) {
        long cap = arr.getLength();
        return cap == 0 ? null : arr.get(cap - 1);
    };
    // Overload
    public static @Nullable Object last(Object[] objs) {
        return wrapFunc(objs, LCNativeArray::last);
    };


    /**
     * Gets index of the last element, 0 if empty array.
     */
    public static int lastIndex(NativeArray arr) {
        long cap = arr.getLength();
        return LCScript.toInt(cap == 0 ? 0 : (cap - 1));
    };
    // Overload
    public static int lastIndex(Object[] objs) {
        return LCScript.toInt(wrapFunc(objs, LCNativeArray::lastIndex));
    };


    /**
     * Gets fraction of index of some element by array length.
     * Returns -1 if not found.
     */
    public static float calcIndexFrac(NativeArray arr, Object ele, boolean useInd) {
        int ind = -1;
        if(useInd) {
            if(ele instanceof Number num) {
                int ind0 = num.intValue();
                if(ind0 >= 0 && ind0 < arr.getLength()) {
                    ind = ind0;
                };
            };
        } else {
            ind = indexOf(arr, ele);
        };
        return ind < 0 ? -1f : ((ind + 1f) / arr.getLength());
    };
    // Overload
    public static float calcIndexFrac(NativeArray arr, Object ele) {
        return calcIndexFrac(arr, ele, false);
    };
    public static float calcIndexFrac(Object[] objs, Object ele, boolean useInd) {
        return LCScript.toFloat(wrapFunc(objs, arr0 -> calcIndexFrac(arr0, ele, useInd)));
    };
    public static float calcIndexFrac(Object[] objs, Object ele) {
        return calcIndexFrac(objs, ele, false);
    };


    /**
     * Wraps Java object array to native array.
     * Used when an array prototype method is called on a Java array.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray wrapObjectArray(@Nullable NativeArray contArr, Object[] objs) {
        NativeArray arr = contArr != null ? clear(contArr) : LCScript.newArray("LCNativeArray.wrapObjectArray.newArr");
        int i = 0;
        int iCap = objs.length;
        while(i < iCap) {
            arr.put(i, arr, objs[i]);
            i++;
        };
        return arr;
    };


    /**
     * Used to wrap <code>Object[]</code> in native array methods.
     */
    public static void wrapCons(Object[] objs, Cons<NativeArray> cons) {
        NativeArray arr0 = Pools.obtain(PoolableNativeArray.class, () -> new PoolableNativeArray(0));
        cons.get(wrapObjectArray(arr0, objs));
        Pools.free(arr0);
    };


    /**
     * Used to wrap <code>Object[]</code> in native array methods that have returned value.
     */
    public static Object wrapFunc(Object[] objs, Func<NativeArray, Object> func) {
        NativeArray arr0 = Pools.obtain(PoolableNativeArray.class, () -> new PoolableNativeArray(0));
        Object val = func.get(wrapObjectArray(arr0, objs));
        Pools.free(arr0);
        return val;
    };


    /* <-------------------- iteration --------------------> */


    /**
     * Not really faster.
     */
    public static void forEachFast(NativeArray arr, Cons cons) {
        long iCap = arr.getLength();
        if(iCap == 0) return;
        for(int i = 0; i < iCap; i++) {
            cons.get(LCScript.wrap(arr.get(i)));
        };
    };
    // Overload
    public static void forEachFast(Object[] objs, Cons cons) {
        wrapCons(objs, arr0 -> forEachFast(arr0, cons));
    };


    /**
     * Variant of {@link #forEachFast} with a condition check.
     */
    public static void forEachCond(NativeArray arr, @Nullable Boolf boolF, Cons cons) {
        long iCap = arr.getLength();
        if(iCap == 0) return;
        Object wrapped;
        for(int i = 0; i < iCap; i++) {
            wrapped = LCScript.wrap(arr.get(i));
            if(boolF == null || boolF.get(wrapped)) {
                cons.get(wrapped);
            };
        };
    };
    // Overload
    public static void forEachCond(Object[] objs, @Nullable Boolf boolF, Cons cons) {
        wrapCons(objs, arr0 -> forEachCond(arr0, boolF, cons));
    };


    /**
     * Variant of {@link #forEachFast} used for formatted array.
     * Unlike the JavaScript version, this method passes the whole row array to <code>cons</code>.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static void forEachRow(NativeArray fArr, int ord, Cons<NativeArray> cons) {
        long iCap = fArr.getLength();
        if(iCap == 0) return;
        // Don't use the same array, to avoid reference corruption
        NativeArray tmpArr = Pools.obtain(PoolableNativeArray.class, () -> new PoolableNativeArray(0));
        int i = 0;
        int j;
        while(i < iCap) {
            clear(tmpArr);
            j = 0;
            while(j < ord) {
                tmpArr.put(j, tmpArr, LCScript.wrap(fArr.get(i + j)));
                j++;
            };
            cons.get(tmpArr);
            i += ord;
        };
        Pools.free(tmpArr);
    };
    // Overload
    public static void forEachRow(Object[] objs, int ord, Cons<NativeArray> cons) {
        wrapCons(objs, arr0 -> forEachRow(arr0, ord, cons));
    };


    private static void applyForEachAll(NativeArray arr, Cons3 cons3) {
        int i = 0;
        long iCap = arr.getLength();
        Object wrapped;
        while(i < iCap) {
            wrapped = LCScript.wrap(arr.get(i));
            if(wrapped instanceof NativeArray arr1) {
                applyForEachAll(arr1, cons3);
            } else {
                cons3.get(wrapped, i, arr);
            };
            i++;
        };
    };


    /**
     * Variant of {@link #forEachFast} used for layered array.
     * Does not support object array, which is probably unnecessary.
     */
    public static void forEachAll(NativeArray arr, Cons3 cons3) {
        applyForEachAll(arr, cons3);
    };


    /**
     * Iterates through each element pair in two arrays.
     */
    public static void forEachPair(NativeArray arr1, NativeArray arr2, Cons2 cons2) {
        int i = 0;
        long iCap = arr1.getLength();
        int j;
        long jCap = arr2.getLength();
        while(i < iCap) {
            j = 0;
            while(j < jCap) {
                cons2.get(LCScript.wrap(arr1.get(i)), LCScript.wrap(arr2.get(j)));
                j++;
            };
            i++;
        };
    };


    /* <-------------------- condition --------------------> */


    /**
     * Whether an element exists in an array.
     */
    public static boolean includes(NativeArray arr, Object ele) {
        int i = 0;
        long iCap = arr.getLength();
        Object wrappedEle = LCScript.wrapEquality(ele);
        while(i < iCap) {
            if(Objects.equals(wrappedEle, LCScript.wrapEquality(arr.get(i)))) return true;
            i++;
        };
        return false;
    };
    // Overload
    public static boolean includes(Object[] objs, Object ele) {
        return LCScript.toBoolean(wrapFunc(objs, arr0 -> includes(arr0, ele)));
    };


    /**
     * Whether any of given elements exists in an array.
     */
    public static boolean includesAny(NativeArray arr, Object... eles) {
        int i;
        long iCap = arr.getLength();
        int j = 0;
        int jCap = eles.length;
        Object wrappedEle;
        while(j < jCap) {
            wrappedEle = LCScript.wrapEquality(eles[j]);
            i = 0;
            while(i < iCap) {
                if(Objects.equals(wrappedEle, LCScript.wrapEquality(arr.get(i)))) return true;
                i++;
            };
            j++;
        };
        return false;
    };
    // Overload
    public static boolean includesAny(Object[] objs, Object... eles) {
        return LCScript.toBoolean(wrapFunc(objs, arr0 -> includesAny(arr0, eles)));
    };


    /**
     * Variant of {@link #includesAny} for function arguments object.
     */
    public static boolean includesAnyArguments(NativeArray arr, Scriptable arguments) {
        int i;
        long iCap = arr.getLength();
        int j = 0;
        int jCap = LCScript.toInt(ScriptableObject.getProperty(arguments, "length"));
        Object wrappedEle;
        while(j < jCap) {
            wrappedEle = LCScript.wrapEquality(ScriptableObject.getProperty(arguments, j));
            i = 0;
            while(i < iCap) {
                if(Objects.equals(wrappedEle, LCScript.wrapEquality(arr.get(i)))) return true;
                i++;
            };
            j++;
        };
        return false;
    };
    // Overload
    public static boolean includesAnyArguments(Object[] objs, Scriptable arguments) {
        return LCScript.toBoolean(wrapFunc(objs, arr0 -> includesAnyArguments(arr0, arguments)));
    };


    /**
     * Whether all given elements exist in an array.
     */
    public static boolean includesAll(NativeArray arr, Object... eles) {
        int i;
        long iCap = arr.getLength();
        int j = 0;
        int jCap = eles.length;
        Object wrappedEle;
        while(j < jCap) {
            wrappedEle = LCScript.wrapEquality(eles[j]);
            i = 0;
            while(i < iCap) {
                if(!Objects.equals(wrappedEle, LCScript.wrapEquality(arr.get(i)))) return false;
                i++;
            };
            j++;
        };
        return true;
    };
    // Overload
    public static boolean includesAll(Object[] objs, Object... eles) {
        return LCScript.toBoolean(wrapFunc(objs, arr0 -> includesAll(arr0, eles)));
    };


    /**
     * Variant of {@link #includesAll} for function arguments object.
     */
    public static boolean includesAllArguments(NativeArray arr, Scriptable arguments) {
        int i;
        long iCap = arr.getLength();
        int j = 0;
        int jCap = LCScript.toInt(ScriptableObject.getProperty(arguments, "length"));
        Object wrappedEle;
        while(j < jCap) {
            wrappedEle = LCScript.wrapEquality(ScriptableObject.getProperty(arguments, j));
            i = 0;
            while(i < iCap) {
                if(!Objects.equals(wrappedEle, LCScript.wrapEquality(arr.get(i)))) return false;
                i++;
            };
            j++;
        };
        return true;
    };
    // Overload
    public static boolean includesAllArguments(Object[] objs, Scriptable arguments) {
        return LCScript.toBoolean(wrapFunc(objs, arr0 -> includesAllArguments(arr0, arguments)));
    };


    /**
     * Variant of {@link #includes} for formatted array.
     */
    public static boolean colIncludes(NativeArray fArr, Object ele, int ord, int off) {
        int i = off;
        long iCap = fArr.getLength();
        Object wrappedEle = LCScript.wrapEquality(ele);
        while(i < iCap) {
            if(Objects.equals(wrappedEle, LCScript.wrapEquality(fArr.get(i)))) return true;
            i += ord;
        };
        return false;
    };
    // Overload
    public static boolean colIncludes(NativeArray fArr, Object ele, int ord) {
        return colIncludes(fArr, ele, ord, 0);
    };
    public static boolean colIncludes(Object[] objs, Object ele, int ord, int off) {
        return LCScript.toBoolean(wrapFunc(objs, arr0 -> colIncludes(arr0, ele, ord, off)));
    };
    public static boolean colIncludes(Object[] objs, Object ele, int ord) {
        return colIncludes(objs, ele, ord, 0);
    };


    /* <-------------------- modification --------------------> */


    /**
     * Pushes element into an array.
     * Only necessary on Java side.
     * @return Array length.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static int push(NativeArray arr, Object ele) {
        int cap = LCScript.toInt(arr.getLength());
        arr.put(cap, arr, ele);
        return cap + 1;
    };


    /**
     * Variant of {@link #push} that only pushes unique element.
     */
    public static NativeArray pushUnique(NativeArray arr, Object ele) {
        if(!includes(arr, ele)) push(arr, ele);
        return arr;
    };


    /**
     * Variant of {@link #push} that only pushes non-null element.
     */
    public static NativeArray pushNonNull(NativeArray arr, Object ele) {
        if(LCScript.isNull(ele)) return arr;
        push(arr, ele);
        return arr;
    };


    /**
     * Variant of {@link #push} that pushes all elements from another array.
     */
    public static NativeArray pushAll(NativeArray arr1, NativeArray arr2) {
        int i = 0;
        long iCap = arr2.getLength();
        while(i < iCap) {
            push(arr1, arr2.get(i));
            i++;
        };
        return arr1;
    };
    // Overload
    public static NativeArray pushAll(NativeArray arr, Object ele) {
        push(arr, ele);
        return arr;
    };
    public static NativeArray pushAll(NativeArray arr, Object[] eles) {
        return LCScript.toArray(wrapFunc(eles, arr0 -> pushAll(arr, arr0)));
    };


    /**
     * Inserts an element at given index.
     * @return Array length.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static int insert(NativeArray arr, int ind, Object ele) {
        int i = LCScript.toInt(arr.getLength());
        arr.put("length", arr, i + 1);
        while(i > ind) {
            arr.put(i, arr, arr.get(i - 1));
            i--;
        };
        arr.put(ind, arr, ele);
        return LCScript.toInt(arr.getLength());
    };


    /**
     * Variant of {@link #insert} for batch insertion.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray insertAll(NativeArray arr1, int ind, NativeArray arr2) {
        int i = LCScript.toInt(arr1.getLength());
        int j = 0;
        int jCap = LCScript.toInt(arr2.getLength());
        while(i > ind) {
            arr1.put(i + jCap - 1, arr1, arr1.get(i - 1));
            i--;
        };
        while(j < jCap) {
            arr1.put(ind + j, arr1, arr2.get(j));
            j++;
        };
        return arr1;
    };
    // Overload
    public static NativeArray insertAll(NativeArray arr, int ind, Object ele) {
        insert(arr, ind, ele);
        return arr;
    };
    public static NativeArray insertAll(NativeArray arr, int ind, Object[] eles) {
        return LCScript.toArray(wrapFunc(eles, arr0 -> insertAll(arr, ind, arr0)));
    };


    /**
     * Adds element to the start of an array.
     * @return Array length.
     */
    public static int unshift(NativeArray arr, Object ele) {
        return insert(arr, 0, ele);
    };


    /**
     * Clears an array and fill it with given elements.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray with(NativeArray arr, Object... eles) {
        clear(arr);
        int i = 0;
        int iCap = eles.length;
        while(i < iCap) {
            arr.put(i, arr, LCScript.wrap(eles[i]));
            i++;
        };
        return arr;
    };


    /**
     * Variant of {@link #with} for function arguments object.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray withArguments(NativeArray arr, Scriptable arguments) {
        clear(arr);
        int i = 0;
        int iCap = LCScript.toInt(ScriptableObject.getProperty(arguments, "length"));
        while(i < iCap) {
            arr.put(i, arr, ScriptableObject.getProperty(arguments, i));
            i++;
        };
        return arr;
    };


    /**
     * Variant of {@link #with} for array.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray withAll(NativeArray arr, NativeArray eles) {
        clear(arr);
        int i = 0;
        long iCap = eles.getLength();
        while(i < iCap) {
            arr.put(i, arr, LCScript.wrap(eles.get(i)));
            i++;
        };
        return arr;
    };


    /**
     * Removes the first matching element in an array.
     * @return Removed element.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static @Nullable Object remove(NativeArray arr, Object ele, @Nullable Func mapF) {
        int ind = indexOf(arr, ele, mapF);
        if(ind < 0) return null;

        int i = ind;
        long iCap = arr.getLength() - 1;
        Object removedEle = arr.get(ind);
        while(i < iCap) {
            arr.put(i, arr, arr.get(i + 1));
            i++;
        };
        arr.put("length", arr, iCap);

        return removedEle;
    };
    // Overload
    public static @Nullable Object remove(NativeArray arr, Object ele) {
        return remove(arr, ele, null);
    };


    /**
     * Variant of {@link #remove} for batch remove.
     */
    public static NativeArray removeAll(NativeArray arr1, NativeArray arr2) {
        int i = 0;
        long iCap = arr2.getLength();
        while(i < iCap) {
            remove(arr1, arr2.get(i));
            i++;
        };
        return arr1;
    };
    // Overload
    public static NativeArray removeAll(NativeArray arr, Object ele) {
        remove(arr, ele);
        return arr;
    };
    public static NativeArray removeAll(NativeArray arr, Object[] eles) {
        return LCScript.toArray(wrapFunc(eles, arr0 -> removeAll(arr, arr0)));
    };


    /**
     * Removes element at given index in an array.
     * @return Removed element.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static @Nullable Object removeAt(NativeArray arr, int ind) {
        int iCap = LCScript.toInt(arr.getLength()) - 1;
        if(ind < 0 || ind > iCap) return null;

        int i = ind;
        Object removedEle = arr.get(ind);
        while(i < iCap) {
            arr.put(i, arr, arr.get(i + 1));
            i++;
        };
        arr.put("length", arr, iCap);

        return removedEle;
    };


    /**
     * Removes the first element in an array.
     * @return Removed element.
     */
    public static @Nullable Object shift(NativeArray arr) {
        return removeAt(arr, 0);
    };


    /**
     * Variant of {@link #shift} for batch remove.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray shiftAll(NativeArray arr, int amt, @Nullable NativeArray resultOut) {
        int i = 0;
        if(resultOut == null) {
            while(i < amt) {
                shift(arr);
                i++;
            };
        } else {
            clear(resultOut);
            while(i < amt) {
                resultOut.put(i, resultOut, shift(arr));
                i++;
            };
        };

        return arr;
    };
    // Overload
    public static NativeArray shiftAll(NativeArray arr, int amt) {
        return shiftAll(arr, amt, null);
    };


    /**
     * Removes all matching elements in an array.
     * @return Array length.
     */
    public static int pull(NativeArray arr, Object ele) {
        while(includes(arr, ele)) {
            remove(arr, ele);
        };
        return LCScript.toInt(arr.getLength());
    };


    /**
     * Variant of {@link #pull} for batch pull.
     */
    public static NativeArray pullAll(NativeArray arr1, NativeArray arr2) {
        int i = 0;
        long iCap = arr2.getLength();
        while(i < iCap) {
            pull(arr1, arr2.get(i));
            i++;
        };
        return arr1;
    };
    // Overload
    public static NativeArray pullAll(NativeArray arr, Object ele) {
        pull(arr, ele);
        return arr;
    };
    public static NativeArray pullAll(NativeArray arr, Object[] eles) {
        return LCScript.toArray(wrapFunc(eles, arr0 -> pullAll(arr, arr0)));
    };


    /**
     * Pulls out null values.
     */
    public static NativeArray compact(NativeArray arr) {
        pull(arr, null);
        return arr;
    };


    /**
     * Swaps position of two elements.
     */
    public static NativeArray swap(NativeArray arr, Object ele1, Object ele2) {
        return swapByIndex(arr, indexOf(arr, ele1), indexOf(arr, ele2));
    };


    /**
     * Variant of {@link #swap} using index.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray swapByIndex(NativeArray arr, int ind1, int ind2) {
        long cap = arr.getLength();
        if(ind1 < 0 || ind1 >= cap || ind2 < 0 || ind2 >= cap) return arr;

        Object tmpEle = arr.get(ind2);
        arr.put(ind2, arr, arr.get(ind1));
        arr.put(ind1, arr, tmpEle);

        return arr;
    };


    /**
     * Variant of {@link #map} that modifies original array.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray inSituMap(NativeArray arr, Func mapF) {
        int i = 0;
        long iCap = arr.getLength();
        while(i < iCap) {
            arr.put(i, arr, mapF.get(LCScript.wrap(arr.get(i))));
            i++;
        };
        return arr;
    };


    /**
     * Variant of {@link #filter} that modifies original array.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray inSituFilter(NativeArray arr, Boolf boolF) {
        int i = 0;
        long iCap = arr.getLength();
        while(i < iCap) {
            if(!boolF.get(LCScript.wrap(arr.get(i)))) arr.put(i, arr, TmpStateTag.pending);
            i++;
        };
        pull(arr, TmpStateTag.pending);

        return arr;
    };


    /**
     * Randomizes order of elements in an array.
     * Supports formatted array.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray shuffle(NativeArray fArr, int ord) {
        int iCap = LCScript.toInt(fArr.getLength());
        if(iCap == 0) return fArr;

        int j;
        Object tmpEle;
        for(int i = iCap - ord; i > -1; i -= ord) {
            j = Math.round(Mathf.random((float)(i) / ord)) * ord;
            for(int k = 0; k < ord; k++) {
                tmpEle = fArr.get(i + k);
                fArr.put(i + k, fArr, fArr.get(j + k));
                fArr.put(j + k, fArr, tmpEle);
            };
        };

        return fArr;
    };
    // Overload
    public static NativeArray shuffle(NativeArray arr) {
        return shuffle(arr, 1);
    };


    /* <-------------------- operation --------------------> */


    /**
     * Maps every element in an array to a new element.
     * Result is returned as a new array.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray map(NativeArray arr, Func mapF) {
        NativeArray arr0 = LCScript.newArray("LCNativeArray.map.newArr");
        int i = 0;
        long iCap = arr.getLength();
        while(i < iCap) {
            arr0.put(i, arr0, mapF.get(LCScript.wrap(arr.get(i))));
            i++;
        };
        return arr0;
    };
    // Overload
    public static NativeArray map(Object[] objs, Func mapF) {
        return LCScript.toArray(wrapFunc(objs, arr0 -> map(arr0, mapF)));
    };


    /**
     * Filters out matching elements in an array.
     * Result is returned as a new array.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray filter(NativeArray arr, Boolf boolF) {
        NativeArray arr0 = LCScript.newArray("LCNativeArray.filter.newArr");
        int i = 0;
        long iCap = arr.getLength();
        while(i < iCap) {
            if(boolF.get(LCScript.wrap(arr.get(i)))) arr0.put(i, arr0, arr.get(i));
            i++;
        };
        return arr0;
    };
    // Overload
    public static NativeArray filter(Object[] objs, Boolf boolF) {
        return LCScript.toArray(wrapFunc(objs, arr0 -> filter(arr0, boolF)));
    };


    /* <-------------------- math --------------------> */


    /**
     * Gets sum of numbers in an array.
     */
    public static double sum(NativeArray arr, @Nullable Func mapF) {
        double val = 0;
        int i = 0;
        long iCap = arr.getLength();
        if(mapF == null) {
            while(i < iCap) {
                val += LCScript.toDouble(arr.get(i));
                i++;
            };
        } else {
            while(i < iCap) {
                val += LCScript.toDouble(mapF.get(arr.get(i)));
                i++;
            };
        };
        return val;
    };
    // Overload
    public static double sum(NativeArray arr) {
        return sum(arr, null);
    };
    public static double sum(Object[] objs, @Nullable Func mapF) {
        return LCScript.toDouble(wrapFunc(objs, arr0 -> sum(arr0, mapF)));
    };
    public static double sum(Object[] objs) {
        return sum(objs, null);
    };


    /**
     * Gets product of numbers in an array.
     */
    public static double prod(NativeArray arr, @Nullable Func mapF) {
        double val = 0;
        int i = 0;
        long iCap = arr.getLength();
        if(mapF == null) {
            while(i < iCap) {
                val *= LCScript.toDouble(arr.get(i));
                i++;
            };
        } else {
            while(i < iCap) {
                val *= LCScript.toDouble(mapF.get(arr.get(i)));
                i++;
            };
        };
        return val;
    };
    // Overload
    public static double prod(NativeArray arr) {
        return prod(arr, null);
    };
    public static double prod(Object[] objs, @Nullable Func mapF) {
        return LCScript.toDouble(wrapFunc(objs, arr0 -> prod(arr0, mapF)));
    };
    public static double prod(Object[] objs) {
        return prod(objs, null);
    };


    /**
     * Gets mean value of numbers in an array.
     */
    public static double mean(NativeArray arr, @Nullable Func mapF) {
        return sum(arr, mapF) / arr.getLength();
    };
    // Overload
    public static double mean(NativeArray arr) {
        return mean(arr, null);
    };
    public static double mean(Object[] objs, @Nullable Func mapF) {
        return LCScript.toDouble(wrapFunc(objs, arr0 -> mean(arr0, mapF)));
    };
    public static double mean(Object[] objs) {
        return mean(objs, null);
    };


    /**
     * Gets powered mean value of numbers in an array.
     */
    public static double meanPow(NativeArray arr, double pow) {
        return Math.pow(
            mean(arr, num -> Math.pow(LCScript.toDouble(num), pow)),
            1 / pow
        );
    };
    // Overload
    public static double meanPow(Object[] objs, double pow) {
        return LCScript.toDouble(wrapFunc(objs, arr0 -> meanPow(arr0, pow)));
    };


    /**
     * Performs some operation on two arrays.
     * Modifies the first array.
     */
    public static NativeArray operWith(NativeArray arr1, NativeArray arr2, Func2 func2) throws IllegalArgumentException {
        int i = 0;
        long iCap = arr1.getLength();
        if(iCap != arr2.getLength()) throw new IllegalArgumentException("Expected two arrays with same length!");
        while(i < iCap) {
            arr1.set(i, func2.get(arr1.get(i), arr2.get(i)));
            i++;
        };
        return arr1;
    };
    // Overload
    public static NativeArray operWith(Object[] objs, NativeArray arr, Func2 func2) throws IllegalArgumentException {
        return LCScript.toArray(wrapFunc(objs, arr0 -> operWith(arr0, arr, func2)));
    };


    /**
     * Lets each number in an array adds each number in another array.
     */
    public static NativeArray addWith(NativeArray arr1, NativeArray arr2) throws IllegalArgumentException {
        return operWith(
            arr1, arr2,
            (num1, num2) -> LCScript.toDouble(num1) + LCScript.toDouble(num2)
        );
    };
    // Overload
    public static NativeArray addWith(Object[] objs, NativeArray arr) throws IllegalArgumentException {
        return LCScript.toArray(wrapFunc(objs, arr0 -> addWith(arr0, arr)));
    };


    /**
     * Lets each number in an array subtracts each number in another array.
     */
    public static NativeArray subWith(NativeArray arr1, NativeArray arr2) throws IllegalArgumentException {
        return operWith(
            arr1, arr2,
            (num1, num2) -> LCScript.toDouble(num1) - LCScript.toDouble(num2)
        );
    };
    // Overload
    public static NativeArray subWith(Object[] objs, NativeArray arr) throws IllegalArgumentException {
        return LCScript.toArray(wrapFunc(objs, arr0 -> subWith(arr0, arr)));
    };


    /**
     * Lets each number in an array multiplies each number in another array.
     */
    public static NativeArray mulWith(NativeArray arr1, NativeArray arr2) throws IllegalArgumentException {
        return operWith(
            arr1, arr2,
            (num1, num2) -> LCScript.toDouble(num1) * LCScript.toDouble(num2)
        );
    };
    // Overload
    public static NativeArray mulWith(Object[] objs, NativeArray arr) throws IllegalArgumentException {
        return LCScript.toArray(wrapFunc(objs, arr0 -> mulWith(arr0, arr)));
    };


    /**
     * Lets each number in an array get divided by each number in another array.
     */
    public static NativeArray divWith(NativeArray arr1, NativeArray arr2) throws IllegalArgumentException {
        return operWith(
            arr1, arr2,
            (num1, num2) -> LCScript.toDouble(num1) / LCScript.toDouble(num2)
        );
    };
    // Overload
    public static NativeArray divWith(Object[] objs, NativeArray arr) throws IllegalArgumentException {
        return LCScript.toArray(wrapFunc(objs, arr0 -> divWith(arr0, arr)));
    };


    /**
     * Lets each number in an array mods each number in another array.
     */
    public static NativeArray modWith(NativeArray arr1, NativeArray arr2) throws IllegalArgumentException {
        return operWith(
            arr1, arr2,
            (num1, num2) -> LCScript.toDouble(num1) % LCScript.toDouble(num2)
        );
    };
    // Overload
    public static NativeArray modWith(Object[] objs, NativeArray arr) throws IllegalArgumentException {
        return LCScript.toArray(wrapFunc(objs, arr0 -> modWith(arr0, arr)));
    };


    /**
     * Performs power operation on each number in an array using each number in another array as power.
     */
    public static NativeArray powWith(NativeArray arr1, NativeArray arr2) throws IllegalArgumentException {
        return operWith(
            arr1, arr2,
            (num1, num2) -> Math.pow(LCScript.toDouble(num1), LCScript.toDouble(num2))
        );
    };
    // Overload
    public static NativeArray powWith(Object[] objs, NativeArray arr) throws IllegalArgumentException {
        return LCScript.toArray(wrapFunc(objs, arr0 -> powWith(arr0, arr)));
    };


    /**
     * Performs cumulative operation on an array.
     * Result is returned as a new array.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray cumOper(NativeArray arr, Func2 func2) {
        NativeArray arr0 = LCScript.newArray("LCNativeArray.cumOper.newArr");
        int i = 0;
        long iCap = arr.getLength();
        double val;
        double tmpVal = 0;
        while(i < iCap) {
            val = LCScript.toDouble(func2.get(tmpVal, arr.get(i)));
            arr0.put(i, arr0, val);
            tmpVal = val;
            i++;
        };
        return arr0;
    };
    // Overload
    public static NativeArray cumOper(Object[] objs, Func2 func2) {
        return LCScript.toArray(wrapFunc(objs, arr0 -> cumOper(arr0, func2)));
    };


    /**
     * Performs cumulative sum on an array.
     */
    public static NativeArray cumSum(NativeArray arr) {
        return cumOper(
            arr,
            (num1, num2) -> LCScript.toDouble(num1) + LCScript.toDouble(num2)
        );
    };
    // Overload
    public static NativeArray cumSum(Object[] objs) {
        return LCScript.toArray(wrapFunc(objs, LCNativeArray::cumSum));
    };


    /**
     * Performs cumulative sum on an array.
     */
    public static NativeArray cumProd(NativeArray arr) {
        return cumOper(
            arr,
            (num1, num2) -> LCScript.toDouble(num1) * LCScript.toDouble(num2)
        );
    };
    // Overload
    public static NativeArray cumProd(Object[] objs) {
        return LCScript.toArray(wrapFunc(objs, LCNativeArray::cumProd));
    };


    @SuppressWarnings("CollectionAddedToSelf")
    private static NativeArray applyDiff(NativeArray arr) {
        NativeArray arr0 = LCScript.newArray("LCNativeArray.applyDiff.newArr");
        int i = 0;
        long iCap = arr.getLength() - 1;
        while(i < iCap) {
            arr0.put(i, arr0, LCScript.toDouble(arr.get(i + 1)) - LCScript.toDouble(arr.get(i)));
            i++;
        };
        return arr0;
    };


    /**
     * Gets difference array of an array.
     */
    public static NativeArray diff(NativeArray arr, int repeat) {
        NativeArray arr0 = arr;
        int i = 0;
        while(i < repeat) {
            arr0 = applyDiff(arr0);
            i++;
        };
        return arr0;
    };
    // Overload
    public static NativeArray diff(NativeArray arr) {
        return applyDiff(arr);
    };
    public static NativeArray diff(Object[] objs, int repeat) {
        return LCScript.toArray(wrapFunc(objs, arr0 -> diff(arr0, repeat)));
    };
    public static NativeArray diff(Object[] objs) {
        return LCScript.toArray(wrapFunc(objs, LCNativeArray::diff));
    };


};
