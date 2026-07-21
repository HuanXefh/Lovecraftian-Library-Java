package lovec.utils.extend;

import arc.func.Func;
import arc.func.Func2;
import arc.util.Nullable;
import lovec.utils.LCScript;
import rhino.NativeArray;

public class LCNativeArray {


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


    /**
     * Gets powered mean value of numbers in an array.
     */
    public static double meanPow(NativeArray arr, double pow) {
        return Math.pow(
            mean(arr, num -> Math.pow(LCScript.toDouble(num), pow)),
            1 / pow
        );
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


    /**
     * Lets each number in an array adds each number in another array.
     */
    public static NativeArray addWith(NativeArray arr1, NativeArray arr2) throws IllegalArgumentException {
        return operWith(
            arr1, arr2,
            (num1, num2) -> LCScript.toDouble(num1) + LCScript.toDouble(num2)
        );
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


    /**
     * Lets each number in an array multiplies each number in another array.
     */
    public static NativeArray mulWith(NativeArray arr1, NativeArray arr2) throws IllegalArgumentException {
        return operWith(
            arr1, arr2,
            (num1, num2) -> LCScript.toDouble(num1) * LCScript.toDouble(num2)
        );
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


    /**
     * Lets each number in an array mods each number in another array.
     */
    public static NativeArray modWith(NativeArray arr1, NativeArray arr2) throws IllegalArgumentException {
        return operWith(
            arr1, arr2,
            (num1, num2) -> LCScript.toDouble(num1) % LCScript.toDouble(num2)
        );
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


    /**
     * Performs cumulative operation on an array.
     * Result is returned as a new array.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray cumOper(NativeArray arr, Func2 func2) {
        NativeArray arr0 = LCScript.newArray("LCNativeArray.cumOper");
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


    /**
     * Performs cumulative sum on an array.
     */
    public static NativeArray cumSum(NativeArray arr) {
        return cumOper(
            arr,
            (num1, num2) -> LCScript.toDouble(num1) + LCScript.toDouble(num2)
        );
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


    @SuppressWarnings("CollectionAddedToSelf")
    private static NativeArray applyDiff(NativeArray arr) {
        NativeArray arr0 = LCScript.newArray("LCNativeArray.applyDiff");
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


};
