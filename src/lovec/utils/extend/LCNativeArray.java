package lovec.utils.extend;

import arc.func.*;
import arc.math.Mathf;
import arc.util.Nullable;
import arc.util.pooling.Pools;
import lovec.utils.LCScript;
import lovec.utils.TmpStateTag;
import lovec.utils.pooling.PoolableNativeArray;
import mindustry.Vars;
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
     * 1. Gets a copy of an array.
     * <br> 2. Copies elements from another array.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray cpy(NativeArray arr) {
        NativeArray arr0 = LCScript.newArray("LCNativeArray.cpy.newArr");
        int i = 0;
        long iCap = arr.getLength();
        while(i < iCap) {
            arr0.put(i, arr0, arr.get(i));
            i++;
        };
        return arr0;
    };
    // Overload
    public static NativeArray cpy(Object[] objs) {
        return LCScript.toArray(wrapFunc(objs, LCNativeArray::cpy));
    };
    public static NativeArray cpy(NativeArray arr1, NativeArray arr2) {
        return withAll(arr1, arr2);
    };
    public static NativeArray cpy(NativeArray arr, Object[] objs) {
        return LCScript.toArray(wrapFunc(objs, arr0 -> cpy(arr, objs)));
    };


    /**
     * Variant of {@link #cpy} for nested array.
     */
    public static NativeArray deepCpy(NativeArray arr) {
        NativeArray arr0 = LCScript.newArray("LCNativeArray.deepCpy.newArr");
        int i = 0;
        long iCap = arr.getLength();
        Object tmpEle;
        while(i < iCap) {
            tmpEle = arr.get(i);
            if(tmpEle instanceof NativeArray arrIn) {
                push(arr0, deepCpy(arrIn));
            } else if(tmpEle instanceof Object[] objs) {
                push(arr0, deepCpy(objs));
            } else {
                push(arr0, tmpEle);
            };
            i++;
        };
        return arr0;
    };
    // Overload
    public static NativeArray deepCpy(Object[] objs) {
        return LCScript.toArray(wrapFunc(objs, LCNativeArray::deepCpy));
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
     * Whether some element exists in any of given arrays.
     */
    public static boolean someIncludes(Object ele, Object... arrs) {
        int i = 0;
        int iCap = arrs.length;
        Object arr;
        while(i < iCap) {
            arr = arrs[i];
            if(arr instanceof NativeArray arr1 && includes(arr1, ele)) return true;
            if(arr instanceof Object[] objs && includes(objs, ele)) return true;
            i++;
        };
        return false;
    };


    /**
     * Whether some element exists in all given arrays.
     */
    public static boolean everyIncludes(Object ele, Object... arrs) {
        int i = 0;
        int iCap = arrs.length;
        Object arr;
        while(i < iCap) {
            arr = arrs[i];
            if(arr instanceof NativeArray arr1 && !includes(arr1, ele)) return false;
            if(arr instanceof Object[] objs && !includes(objs, ele)) return false;
            i++;
        };
        return true;
    };


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


    /**
     * Whether an array is a subset of another array.
     */
    public static boolean subsetOf(NativeArray arr1, NativeArray arr2) {
        NativeArray countArr = toCountArray(arr1);
        int i = 0;
        long iCap = countArr.getLength();
        while(i < iCap) {
            if(count(arr2, countArr.get(i)) < (int) countArr.get(i + 1)) {
                clear(countArr);
                return false;
            };
            i += 2;
        };
        clear(countArr);
        return true;
    };
    // Overload
    public static boolean subsetOf(Object[] objs, NativeArray arr) {
        return LCScript.toBoolean(wrapFunc(objs, arr0 -> subsetOf(arr0, arr)));
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
            j = Math.round(Mathf.random((float) i / ord)) * ord;
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
     * Copies elements from an array, starting from given index.
     * @return New array.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray slice(NativeArray arr, int ind, int amt) {
        NativeArray arr0 = LCScript.newArray("LCNativeArray.slice.newArr");
        int i = 0;
        long cap = arr.getLength();
        while(i < amt) {
            if(ind + i >= cap) break;
            arr0.put(i, arr0, arr.get(ind + i));
            i++;
        };
        return arr0;
    };
    // Overload
    public static NativeArray slice(NativeArray arr, int ind) {
        return slice(arr, ind, LCScript.toInt(arr.getLength() - ind));
    };
    public static NativeArray slice(NativeArray arr) {
        return slice(arr, 0);
    };
    public static NativeArray slice(Object[] objs, int ind, int amt) {
        return LCScript.toArray(wrapFunc(objs, arr0 -> slice(arr0, ind, amt)));
    };
    public static NativeArray slice(Object[] objs, int ind) {
        return slice(objs, ind, objs.length - ind);
    };
    public static NativeArray slice(Object[] objs) {
        return slice(objs, 0);
    };


    /**
     * Maps every element in an array to a new element.
     * @return New array.
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
     * @return New array.
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


    /**
     * Counts how many times an element occurs in an array.
     * Supports formatted array.
     */
    public static int count(NativeArray fArr, Object ele, @Nullable Func mapF, int ord, int off) {
        int count = 0;
        int i = 0;
        long iCap = fArr.getLength();
        Object wrappedEle = LCScript.wrapEquality(ele);
        if(mapF == null) {
            while(i < iCap) {
                if(Objects.equals(wrappedEle, LCScript.wrapEquality(fArr.get(i + off)))) count++;
                i += ord;
            };
        } else {
            while(i < iCap) {
                if(Objects.equals(wrappedEle, LCScript.wrapEquality(mapF.get(LCScript.wrap(fArr.get(i + off)))))) count++;
                i += ord;
            };
        };
        return count;
    };
    // Overload
    public static int count(NativeArray fArr, Object ele, @Nullable Func mapF, int ord) {
        return count(fArr, ele, mapF, ord, 0);
    };
    public static int count(NativeArray arr, Object ele, @Nullable Func mapF) {
        return count(arr, ele, mapF, 1);
    };
    public static int count(NativeArray arr, Object ele) {
        return count(arr, ele, null);
    };
    public static int count(Object[] objs, Object ele, @Nullable Func mapF, int ord, int off) {
        return LCScript.toInt(wrapFunc(objs, arr0 -> count(arr0, ele, mapF, ord, off)));
    };
    public static int count(Object[] objs, Object ele, @Nullable Func mapF, int ord) {
        return count(objs, ele, mapF, ord, 0);
    };
    public static int count(Object[] objs, Object ele, @Nullable Func mapF) {
        return count(objs, ele, mapF, 1);
    };
    public static int count(Object[] objs, Object ele) {
        return count(objs, ele, null);
    };


    /**
     * Counts how many matching elements exist in an array.
     * Supports formatted array.
     */
    public static int countBy(NativeArray fArr, Boolf boolF, int ord, int off) {
        int count = 0;
        int i = 0;
        long iCap = fArr.getLength();
        while(i < iCap) {
            if(boolF.get(LCScript.wrap(fArr.get(i + off)))) count++;
            i += ord;
        };
        return count;
    };
    // Overload
    public static int countBy(NativeArray fArr, Boolf boolF, int ord) {
        return countBy(fArr, boolF, ord, 0);
    };
    public static int countBy(NativeArray arr, Boolf boolF) {
        return countBy(arr, boolF, 1);
    };
    public static int countBy(Object[] objs, Boolf boolF, int ord, int off) {
        return LCScript.toInt(wrapFunc(objs, arr0 -> countBy(arr0, boolF, ord, off)));
    };
    public static int countBy(Object[] objs, Boolf boolF, int ord) {
        return countBy(objs, boolF, ord, 0);
    };
    public static int countBy(Object[] objs, Boolf boolF) {
        return countBy(objs, boolF, 1);
    };


    /**
     * Removes duplicates in an array.
     * @return New array.
     */
    public static NativeArray uniquify(NativeArray arr, @Nullable Func mapF) {
        NativeArray arr0 = LCScript.newArray("LCNativeArray.uniquify.newArr");
        int i = 0;
        long iCap = arr.getLength();
        Object tmpEle;
        if(mapF == null) {
            while(i < iCap) {
                tmpEle = arr.get(i);
                if(!includes(arr0, tmpEle)) push(arr0, tmpEle);
                i++;
            };
        } else {
            NativeArray tmpArr = LCScript.ensureArray("LCNativeArray.uniquify.tmpArr");
            clear(tmpArr);
            Object mappedEle;
            while(i < iCap) {
                tmpEle = arr.get(i);
                mappedEle = mapF.get(LCScript.wrap(tmpEle));
                if(!includes(tmpArr, mappedEle)) {
                    push(arr0, mappedEle);
                    push(tmpArr, mappedEle);
                };
                i++;
            };
        };
        return arr0;
    };
    // Overload
    public static NativeArray uniquify(NativeArray arr) {
        return uniquify(arr, null);
    };
    public static NativeArray uniquify(Object[] objs, @Nullable Func mapF) {
        return LCScript.toArray(wrapFunc(objs, arr0 -> uniquify(arr0, mapF)));
    };
    public static NativeArray uniquify(Object[] objs) {
        return uniquify(objs, null);
    };


    /**
     * Finds elements exist in both arrays.
     * @return New array.
     */
    public static NativeArray intersect(NativeArray arr1, NativeArray arr2, @Nullable Func mapF) {
        NativeArray arr0 = LCScript.newArray("LCNativeArray.intersect.newArr");
        int i = 0;
        long iCap = arr1.getLength();
        Object tmpEle;
        if(mapF == null) {
            while(i < iCap) {
                tmpEle = arr1.get(i);
                if(includes(arr2, tmpEle)) {
                    push(arr0, tmpEle);
                };
                i++;
            };
        } else {
            NativeArray tmpArr = LCScript.ensureArray("LCNativeArray.intersect.tmpArr");
            forEachFast(arr2, ele -> push(tmpArr, mapF.get(LCScript.wrap(ele))));
            Object wrappedEle;
            while(i < iCap) {
                tmpEle = arr1.get(i);
                wrappedEle = mapF.get(LCScript.wrap(tmpEle));
                if(includes(tmpArr, wrappedEle)) {
                    push(arr0, wrappedEle);
                };
                i++;
            };
        };
        return arr0;
    };
    // Overload
    public static NativeArray intersect(NativeArray arr1, NativeArray arr2) {
        return intersect(arr1, arr2, null);
    };
    public static NativeArray intersect(Object[] objs, NativeArray arr, @Nullable Func mapF) {
        return LCScript.toArray(wrapFunc(objs, arr0 -> intersect(arr0, arr, mapF)));
    };
    public static NativeArray intersect(Object[] objs, NativeArray arr) {
        return intersect(objs, arr, null);
    };


    /**
     * Finds elements only exist in the first array.
     */
    public static NativeArray differ(NativeArray arr1, NativeArray arr2, @Nullable Func mapF) {
        NativeArray arr0 = LCScript.newArray("LCNativeArray.differ.newArr");
        int i = 0;
        long iCap = arr1.getLength();
        Object tmpEle;
        if(mapF == null) {
            while(i < iCap) {
                tmpEle = arr1.get(i);
                if(!includes(arr2, tmpEle)) {
                    push(arr0, tmpEle);
                };
                i++;
            };
        } else {
            NativeArray tmpArr = LCScript.ensureArray("LCNativeArray.differ.tmpArr");
            forEachFast(arr2, ele -> push(tmpArr, mapF.get(LCScript.wrap(ele))));
            Object wrappedEle;
            while(i < iCap) {
                tmpEle = arr1.get(i);
                wrappedEle = mapF.get(LCScript.wrap(tmpEle));
                if(!includes(tmpArr, wrappedEle)) {
                    push(arr0, wrappedEle);
                };
                i++;
            };
        };
        return arr0;
    };
    // Overload
    public static NativeArray differ(NativeArray arr1, NativeArray arr2) {
        return differ(arr1, arr2, null);
    };
    public static NativeArray differ(Object[] objs, NativeArray arr, @Nullable Func mapF) {
        return LCScript.toArray(wrapFunc(objs, arr0 -> differ(arr0, arr, mapF)));
    };
    public static NativeArray differ(Object[] objs, NativeArray arr) {
        return differ(objs, arr, null);
    };


    /**
     * Converts a formatted array into 2D-array.
     * @return New array.
     */
    public static NativeArray chunk(NativeArray fArr, int ord, @Nullable Object def) {
        NativeArray arr0 = LCScript.newArray("LCNativeArray.chunk.newArr");
        int i = 0;
        int j;
        long iCap = fArr.getLength();
        while(i < iCap) {
            NativeArray arrIn = LCScript.newArray("LCNativeArray.chunk.newArr1");
            j = 0;
            while(j < ord) {
                if(i + j >= iCap) {
                    push(arrIn, def);
                } else {
                    push(arrIn, fArr.get(i + j));
                };
                j++;
            };
            push(arr0, arrIn);
            i += ord;
        };
        return arr0;
    };
    // Overload
    public static NativeArray chunk(NativeArray fArr, int ord) {
        return chunk(fArr, ord, null);
    };
    public static NativeArray chunk(Object[] objs, int ord, @Nullable Object def) {
        return LCScript.toArray(wrapFunc(objs, arr0 -> chunk(arr0, ord, def)));
    };
    public static NativeArray chunk(Object[] objs, int ord) {
        return chunk(objs, ord, null);
    };


    /**
     * <code>Array.prototype.flat</code>, which doesn't exist in Rhino.
     */
    public static NativeArray flatten(NativeArray arr) {
        NativeArray arr0 = LCScript.newArray("LCNativeArray.flatten.newArr");
        int i = 0;
        long iCap = arr.getLength();
        Object tmpEle;
        while(i < iCap) {
            tmpEle = arr.get(i);
            if(tmpEle instanceof NativeArray arrIn) {
                for(Object ele : arrIn) {
                    push(arr0, ele);
                };
            } else if(tmpEle instanceof Object[] objs) {
                for(Object ele : objs) {
                    push(arr0, ele);
                };
            } else {
                push(arr0, tmpEle);
            };
            i++;
        };
        return arr0;
    };
    // Overload
    public static NativeArray flatten(Object[] objs) {
        return LCScript.toArray(wrapFunc(objs, LCNativeArray::flatten));
    };


    /* <-------------------- util --------------------> */


    /**
     * Gets a random element in an array, null for empty array.
     * Supports formatted array.
     */
    public static @Nullable Object random(NativeArray fArr, int ord, int off) {
        if(fArr.getLength() == 0) return null;
        return fArr.get(LCNumber.randInt(calcRowAmt(fArr, ord) - 1) * ord + off);
    };
    // Overload
    public static @Nullable Object random(NativeArray fArr, int ord) {
        return random(fArr, ord, 0);
    };
    public static @Nullable Object random(NativeArray arr) {
        return random(arr, 1);
    };
    public static @Nullable Object random(Object[] objs, int ord, int off) {
        return wrapFunc(objs, arr0 -> random(arr0, ord, off));
    };
    public static @Nullable Object random(Object[] objs, int ord) {
        return random(objs, ord, 0);
    };
    public static @Nullable Object random(Object[] objs) {
        return random(objs, 1);
    };


    /**
     * Picks random elements from an array.
     * @return New array.
     */
    public static NativeArray sample(NativeArray arr, int amt) {
        NativeArray arr0 = LCScript.ensureArray("LCNativeArray.sample.tmpArr");
        shuffle(cpy(arr0, arr));

        return amt >= arr0.getLength() ?
            cpy(arr0) :
            slice(arr0, 0, amt);
    };
    // Overload
    public static NativeArray sample(NativeArray arr) {
        return sample(arr, LCScript.toInt(arr.getLength()));
    };
    public static NativeArray sample(Object[] objs, int amt) {
        return LCScript.toArray(wrapFunc(objs, arr0 -> sample(arr0, amt)));
    };
    public static NativeArray sample(Object[] objs) {
        return sample(objs, objs.length);
    };


    /**
     * Counts each element in an array, returns result as a 2-array.
     * Supports formatted array.
     * @return New array.
     */
    public static NativeArray toCountArray(NativeArray fArr, int ord, int off) {
        NativeArray arr0 = LCScript.newArray("LCNativeArray.toCountArray");
        int i = 0;
        long iCap = fArr.getLength();
        Object tmpEle;
        while(i < iCap) {
            tmpEle = fArr.get(i + off);
            if(Objects.equals(read(arr0, tmpEle, 0), 0)) {
                push(arr0, tmpEle);
                push(arr0, count(fArr, tmpEle));
            };
            i += ord;
        };
        return arr0;
    };
    // Overload
    public static NativeArray toCountArray(NativeArray fArr, int ord) {
        return toCountArray(fArr, ord, 0);
    };
    public static NativeArray toCountArray(NativeArray arr) {
        return toCountArray(arr, 1);
    };


    /* <-------------------- formatted array --------------------> */


    /**
     * Calculates row amount of a formatted array.
     * Internal use.
     */
    public static int calcRowAmt(NativeArray fArr, int ord) {
        long cap = fArr.getLength();
        return cap == 0 ?
            0 :
            (int) ((cap - cap % ord) / ord + (cap % ord != 0 ? 1 : 0));
    };
    // Overload
    public static int calcRowAmt(Object[] objs, int ord) {
        return LCScript.toInt(wrapFunc(objs, arr0 -> calcRowAmt(arr0, ord)));
    };


    /**
     * Checks if a row matches given names.
     * Internal use.
     */
    public static boolean formatRowCheck(NativeArray fArr, NativeArray names, int arrInd, boolean isUnordered) {
        int i = 0;
        long iCap = names.getLength();
        if(!isUnordered) {
            while(i < iCap) {
                if(!Objects.equals(LCScript.wrapEquality(names.get(i)), LCScript.wrapEquality(fArr.get(arrInd + i)))) return false;
                i++;
            };
            return true;
        };

        NativeArray tmpArr = LCScript.ensureArray("LCNativeArray.checkFormatArrayRow.tmpArr");
        clear(tmpArr);
        while(i < iCap) {
            push(tmpArr, fArr.get(arrInd + i));
            i++;
        };
        NativeObject scope = LCScript.toObject(LCScript.get("__javaInternal__"));
        scope.put("LCNativeArray.checkFormatArrayRow.names", scope, names);

        return (boolean) Context.getContext().evaluateString(
            Vars.mods.getScripts().scope,
            "__javaInternal__['LCNativeArray.checkFormatArrayRow.names'].looseEquals(__javaInternal__['LCNativeArray.checkFormatArrayRow.tmpArr'])",
            "LCNativeArray_formatRowCheck.js",
            0
        );
    };
    // Overload
    public static boolean formatRowCheck(NativeArray fArr, NativeArray names, int arrInd) {
        return formatRowCheck(fArr, names, arrInd, false);
    };


    /**
     * Reads data from a formatted array.
     */
    public static @Nullable Object read(NativeArray fArr, NativeArray keys, @Nullable Object def, boolean isUnordered) {
        int i = 0;
        long iCap = fArr.getLength();
        int jCap = LCScript.toInt(keys.getLength());
        while(i < iCap) {
            if(formatRowCheck(fArr, keys, i, isUnordered)) return fArr.get(i + jCap);
            i += jCap + 1;
        };
        return def;
    };
    // Overload
    public static @Nullable Object read(NativeArray fArr, NativeArray keys, @Nullable Object def) {
        return read(fArr, keys, def, false);
    };
    public static @Nullable Object read(NativeArray fArr, NativeArray keys) {
        return read(fArr, keys, null);
    };
    public static @Nullable Object read(NativeArray fArr, Object key, @Nullable Object def, boolean isUnordered) {
        return read(fArr, LCNativeArray.with(LCScript.ensureArray("LCNativeArray.read.tmpKeys"), key), def, isUnordered);
    };
    public static @Nullable Object read(NativeArray fArr, Object key, @Nullable Object def) {
        return read(fArr, key, def, false);
    };
    public static @Nullable Object read(NativeArray fArr, Object key) {
        return read(fArr, key, null);
    };


    /**
     * Variant of {@link #read} that returns all matching results.
     * @return New array.
     */
    public static NativeArray readList(NativeArray fArr, NativeArray keys, boolean isUnordered) {
        NativeArray arr0 = LCScript.newArray("LCNativeArray.readList.newArr");
        int i = 0;
        long iCap = fArr.getLength();
        int jCap = LCScript.toInt(keys.getLength());
        while(i < iCap) {
            if(formatRowCheck(fArr, keys, i, isUnordered)) {
                push(arr0, fArr.get(i + jCap));
            };
            i += jCap + 1;
        };
        return arr0;
    };
    // Overload
    public static NativeArray readList(NativeArray fArr, NativeArray keys) {
        return readList(fArr, keys, false);
    };
    public static NativeArray readList(NativeArray fArr, Object key, boolean isUnordered) {
        return readList(fArr, LCNativeArray.with(LCScript.ensureArray("LCNativeArray.readList.tmpKeys"), key), isUnordered);
    };
    public static NativeArray readList(NativeArray fArr, Object key) {
        return readList(fArr, key, false);
    };


    /**
     * Variant of {@link #read} that returns row index, -1 if not found.
     */
    public static int readRowIndex(NativeArray fArr, NativeArray keys, boolean isUnordered) {
        int i = 0;
        long iCap = fArr.getLength();
        int jCap = LCScript.toInt(keys.getLength());
        while(i < iCap) {
            if(formatRowCheck(fArr, keys, i, isUnordered)) return i / (jCap + 1);
            i += jCap + 1;
        };
        return -1;
    };
    // Overload
    public static int readRowIndex(NativeArray fArr, NativeArray keys) {
        return readRowIndex(fArr, keys, false);
    };
    public static int readRowIndex(NativeArray fArr, Object key, boolean isUnordered) {
        return readRowIndex(fArr, LCNativeArray.with(LCScript.ensureArray("LCNativeArray.readRowIndex.tmpKeys"), key), isUnordered);
    };
    public static int readRowIndex(NativeArray fArr, Object key) {
        return readRowIndex(fArr, key, false);
    };


    /**
     * Gets elements in the same column.
     */
    public static NativeArray readCol(NativeArray fArr, int ord, int off) {
        NativeArray arr0 = LCScript.newArray("LCNativeArray.readCol.newArr");
        int i = 0;
        long iCap = fArr.getLength();
        while(i < iCap) {
            push(arr0, fArr.get(i + off));
            i += ord;
        };
        return arr0;
    };
    // Overload
    public static NativeArray readCol(NativeArray fArr, int ord) {
        return readCol(fArr, ord, 0);
    };


    /**
     * Writes data in a formatted array.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray write(NativeArray fArr, NativeArray keys, Object val, boolean isUnordered) {
        int i = 0;
        long iCap = fArr.getLength();
        int jCap = LCScript.toInt(keys.getLength());
        while(i < iCap) {
            if(formatRowCheck(fArr, keys, i, isUnordered)) {
                fArr.put(i + jCap, fArr, val);
                return fArr;
            };
            i += jCap + 1;
        };
        pushAll(fArr, keys);
        push(fArr, val);
        return fArr;
    };
    // Overload
    public static NativeArray write(NativeArray fArr, NativeArray keys, Object val) {
        return write(fArr, keys, val, false);
    };
    public static NativeArray write(NativeArray fArr, Object key, Object val, boolean isUnordered) {
        return write(fArr, LCNativeArray.with(LCScript.ensureArray("LCNativeArray.write.tmpKeys"), key), val, isUnordered);
    };
    public static NativeArray write(NativeArray fArr, Object key, Object val) {
        return write(fArr, key, val, false);
    };


    /* <-------------------- math --------------------> */


    /**
     * Gets an index array.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray getIndexArray(int cap, boolean startsAtOne) {
        NativeArray arr = LCScript.newArray("LCNativeArray.getIndexArray.newArr");
        if(cap <= 0) return arr;

        int i = 0;
        while(i < cap) {
            arr.put(i, arr, startsAtOne ? (i + 1) : i);
            i++;
        };

        return arr;
    };
    // Overload
    public static NativeArray getIndexArray(int cap) {
        return getIndexArray(cap, false);
    };


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
     * @return New array.
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
