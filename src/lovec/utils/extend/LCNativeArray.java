package lovec.utils.extend;

import arc.func.*;
import arc.util.Nullable;
import arc.util.pooling.Pools;
import lovec.utils.LCScript;
import lovec.utils.pooling.PoolableNativeArray;
import rhino.NativeArray;
import rhino.Scriptable;
import rhino.ScriptableObject;

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
     * Wraps array-like lists to native array.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray wrapArrayLike(Object[] objs) {
        // Can't use the same array, will cause change of array length while iteration
        NativeArray tmpArr = LCScript.newArray("LCNativeArray.WrapArrayLike.tmpArr");
        clear(tmpArr);
        int i = 0;
        int iCap = objs.length;
        while(i < iCap) {
            tmpArr.put(i, tmpArr, objs[i]);
            i++;
        };
        return tmpArr;
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
        forEachFast(wrapArrayLike(objs), cons);
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
        forEachCond(wrapArrayLike(objs), boolF, cons);
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
        forEachRow(wrapArrayLike(objs), ord, cons);
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


    /* <-------------------- modification --------------------> */


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
    // Overload
    public static NativeArray with(Object[] objs, Object... eles) {
        return with(wrapArrayLike(objs), eles);
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
    // Overload
    public static NativeArray withAll(Object[] objs, NativeArray eles) {
        return withAll(wrapArrayLike(objs), eles);
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
        return sum(wrapArrayLike(objs), mapF);
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
        return prod(wrapArrayLike(objs), mapF);
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
        return mean(wrapArrayLike(objs), mapF);
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
        return meanPow(wrapArrayLike(objs), pow);
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
        return operWith(wrapArrayLike(objs), arr, func2);
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
        return addWith(wrapArrayLike(objs), arr);
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
        return subWith(wrapArrayLike(objs), arr);
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
        return mulWith(wrapArrayLike(objs), arr);
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
        return divWith(wrapArrayLike(objs), arr);
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
        return modWith(wrapArrayLike(objs), arr);
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
        return powWith(wrapArrayLike(objs), arr);
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
        return cumOper(wrapArrayLike(objs), func2);
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
        return cumSum(wrapArrayLike(objs));
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
        return cumProd(wrapArrayLike(objs));
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
        return diff(wrapArrayLike(objs), repeat);
    };
    public static NativeArray diff(Object[] objs) {
        return diff(wrapArrayLike(objs));
    };


};
