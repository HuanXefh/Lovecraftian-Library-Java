package lovec.math;

import arc.util.Nullable;
import lovec.utils.LCScript;
import lovec.utils.extend.LCNativeArray;
import rhino.NativeArray;

/**
 * Various statistical methods for data processing, using native array.
 */
public class LCStatistics {


    /**
     * Calculates mean value.
     */
    public static double mean(NativeArray xs) {
        return LCNativeArray.mean(xs);
    };


    /**
     * Calculates difference between <code>xs</code> and <code>ys</code>.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray difference(@Nullable NativeArray contArr, NativeArray xs, NativeArray ys) throws IllegalArgumentException {
        long n = xs.getLength();
        if(n != ys.getLength()) throw new IllegalArgumentException("Unmatched array length!");

        NativeArray arr = contArr != null ? LCNativeArray.clear(contArr) : LCScript.newArray("LCStatistics.difference.newArr");

        int i = 0;
        while(i < n) {
            arr.put(i, arr, LCScript.toDouble(xs.get(i)) - LCScript.toDouble((ys.get(i))));
            i++;
        };

        return arr;
    };


    /**
     * Calculates mean value of differences.
     */
    public static double differenceMean(NativeArray xs, NativeArray ys) throws IllegalArgumentException {
        return mean(difference(LCScript.ensureArray("LCStatistics.meanDifference.tmpArr"), xs, ys));
    };


    /**
     * Calculates standard deviation.
     */
    public static double standardDeviation(NativeArray xs, double mean) {
        double sum = 0;
        int i = 0;
        long n = xs.getLength();
        while(i < n) {
            sum += Math.pow(LCScript.toDouble(xs.get(i)) - mean, 2);
            i++;
        };
        return Math.sqrt(sum / n);
    };
    // Overload
    public static double standardDeviation(NativeArray xs) {
        return standardDeviation(xs, mean(xs));
    };


    /**
     * Calculates variation.
     */
    public static double variation(NativeArray xs, double mean, boolean notSample) {
        double sum = 0;
        int i = 0;
        long n = xs.getLength();
        while(i < n) {
            sum += Math.pow(LCScript.toDouble(xs.get(i)) - mean, 2);
            i++;
        };

        return sum / (notSample ? n : (n - 1));
    };
    // Overload
    public static double variation(NativeArray xs, double mean) {
        return variation(xs, mean, false);
    };
    public static double variation(NativeArray xs, boolean notSample) {
        return variation(xs, mean(xs), notSample);
    };
    public static double variation(NativeArray xs) {
        return variation(xs, false);
    };


    /**
     * Calculates covariation.
     */
    public static double covariation(NativeArray xs, NativeArray ys, double meanX, double meanY, boolean notSample) throws IllegalArgumentException {
        long n = xs.getLength();
        if(n != ys.getLength()) throw new IllegalArgumentException("Unmatched array length!");

        double sum = 0;
        int i = 0;
        while(i < n) {
            sum += (LCScript.toDouble(xs.get(i)) - meanX) * (LCScript.toDouble(ys.get(i)) - meanY);
            i++;
        };

        return sum / (notSample ? n : (n - 1));
    };
    // Overload
    public static double covariation(NativeArray xs, NativeArray ys, double meanX, double meanY) {
        return covariation(xs, ys, meanX, meanY, false);
    };
    public static double covariation(NativeArray xs, NativeArray ys, boolean notSample) {
        return covariation(xs, ys, mean(xs), mean(ys), notSample);
    };
    public static double covariation(NativeArray xs, NativeArray ys) {
        return covariation(xs, ys, false);
    };


    /**
     * Calculates variation of differences.
     */
    public static double differenceVariation(NativeArray xs, NativeArray ys, boolean notSample) throws IllegalArgumentException {
        return variation(difference(LCScript.ensureArray("LCStatistics.differenceVariation.tmpArr"), xs, ys), notSample);
    };
    // Overload
    public static double differenceVariation(NativeArray xs, NativeArray ys) {
        return differenceVariation(xs, ys, false);
    };


    /**
     * Calculates Z-score.
     */
    public static double zScore(double x, double mean, double stdDev) {
        return (x - mean) / stdDev;
    };
    // Overload
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray zScore(@Nullable NativeArray contArr, NativeArray xs) {
        NativeArray arr = contArr != null ? LCNativeArray.clear(contArr) : LCScript.newArray("LCStatistics.zScore.newArr");

        int i = 0;
        long n = xs.getLength();
        double mean = mean(xs);
        double stdDev = standardDeviation(xs, mean);
        while(i < n) {
            arr.put(i, arr, zScore(LCScript.toDouble(xs.get(i)), mean, stdDev));
            i++;
        };

        return arr;
    };


    /* <-------------------- regression --------------------> */


    private static double lrSlope = -1;
    private static double lrIntercept = -1;


    /**
     * Performs linear regression on <code>xs</code> and <code>ys</code>.
     */
    public static void performLinearRegression(NativeArray xs, NativeArray ys) throws IllegalArgumentException {
        long n = xs.getLength();
        if(n != ys.getLength()) throw new IllegalArgumentException("Unmatched array length!");
        if(n < 2) {
            lrSlope = 0;
            lrIntercept = 0;
            return;
        };

        double meanX = mean(xs);
        double meanY = mean(ys);
        double tmp1 = 0;
        double tmp2 = 0;
        int i = 0;
        while(i < n) {
            tmp1 += Math.pow(LCScript.toDouble(xs.get(i)) - meanX, 2);
            tmp2 += (LCScript.toDouble(xs.get(i)) - meanX) * (LCScript.toDouble(ys.get(i)) - meanY);
            i++;
        };
        lrSlope = tmp2 / tmp1;
        lrIntercept = meanY - meanX * lrSlope;
    };


    /**
     * Gets linear regression slope (a).
     * {@link #performLinearRegression} must be called first.
     */
    public double linearRegressionSlope() {
        return lrSlope;
    };


    /**
     * Gets linear regression intercept (b).
     * {@link #performLinearRegression} must be called first.
     */
    public double linearRegressionIntercept() {
        return lrIntercept;
    };


};
