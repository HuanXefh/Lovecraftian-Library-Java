package lovec.math;

import arc.util.Nullable;
import lovec.utils.SLCScript;
import lovec.utils.extend.SLCNativeArray;
import rhino.NativeArray;

/**
 * Various statistical methods for data processing, using native array.
 */
public class SLCStatistics {


    /**
     * Calculates mean value.
     */
    public static double mean(NativeArray xs) {
        return SLCNativeArray.mean(xs);
    };


    /**
     * Calculates difference between <code>xs</code> and <code>ys</code>.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray difference(@Nullable NativeArray contArr, NativeArray xs, NativeArray ys) throws IllegalArgumentException {
        long n = xs.getLength();
        if(n != ys.getLength()) throw new IllegalArgumentException("Unmatched array length!");

        NativeArray arr = contArr != null ? SLCNativeArray.clear(contArr) : SLCScript.newArray("SLCStatistics.difference.newArr");

        int i = 0;
        while(i < n) {
            arr.put(i, arr, SLCScript.toDouble(xs.get(i)) - SLCScript.toDouble((ys.get(i))));
            i++;
        };

        return arr;
    };


    /**
     * Calculates mean value of differences.
     */
    public static double differenceMean(NativeArray xs, NativeArray ys) throws IllegalArgumentException {
        return mean(difference(SLCScript.ensureArray("SLCStatistics.meanDifference.tmpArr"), xs, ys));
    };


    /**
     * Calculates standard deviation.
     */
    public static double standardDeviation(NativeArray xs, double mean) {
        double sum = 0;
        int i = 0;
        long n = xs.getLength();
        while(i < n) {
            sum += Math.pow(SLCScript.toDouble(xs.get(i)) - mean, 2);
            i++;
        };
        return Math.sqrt(sum / n);
    };
    // Overload
    public static double standardDeviation(NativeArray xs) {
        return standardDeviation(xs, mean(xs));
    };


    /**
     * Calculates variance.
     */
    public static double variance(NativeArray xs, double mean, boolean notSample) {
        double sum = 0;
        int i = 0;
        long n = xs.getLength();
        while(i < n) {
            sum += Math.pow(SLCScript.toDouble(xs.get(i)) - mean, 2);
            i++;
        };

        return sum / (notSample ? n : (n - 1));
    };
    // Overload
    public static double variance(NativeArray xs, double mean) {
        return variance(xs, mean, false);
    };
    public static double variance(NativeArray xs, boolean notSample) {
        return variance(xs, mean(xs), notSample);
    };
    public static double variance(NativeArray xs) {
        return variance(xs, false);
    };


    /**
     * Calculates covariance.
     */
    public static double covariance(NativeArray xs, NativeArray ys, double meanX, double meanY, boolean notSample) throws IllegalArgumentException {
        long n = xs.getLength();
        if(n != ys.getLength()) throw new IllegalArgumentException("Unmatched array length!");

        double sum = 0;
        int i = 0;
        while(i < n) {
            sum += (SLCScript.toDouble(xs.get(i)) - meanX) * (SLCScript.toDouble(ys.get(i)) - meanY);
            i++;
        };

        return sum / (notSample ? n : (n - 1));
    };
    // Overload
    public static double covariance(NativeArray xs, NativeArray ys, double meanX, double meanY) {
        return covariance(xs, ys, meanX, meanY, false);
    };
    public static double covariance(NativeArray xs, NativeArray ys, boolean notSample) {
        return covariance(xs, ys, mean(xs), mean(ys), notSample);
    };
    public static double covariance(NativeArray xs, NativeArray ys) {
        return covariance(xs, ys, false);
    };


    /**
     * Calculates variance of differences.
     */
    public static double differenceVariance(NativeArray xs, NativeArray ys, boolean notSample) throws IllegalArgumentException {
        return variance(difference(SLCScript.ensureArray("SLCStatistics.differenceVariation.tmpArr"), xs, ys), notSample);
    };
    // Overload
    public static double differenceVariance(NativeArray xs, NativeArray ys) {
        return differenceVariance(xs, ys, false);
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
        NativeArray arr = contArr != null ? SLCNativeArray.clear(contArr) : SLCScript.newArray("SLCStatistics.zScore.newArr");

        int i = 0;
        long n = xs.getLength();
        double mean = mean(xs);
        double stdDev = standardDeviation(xs, mean);
        while(i < n) {
            arr.put(i, arr, zScore(SLCScript.toDouble(xs.get(i)), mean, stdDev));
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
            tmp1 += Math.pow(SLCScript.toDouble(xs.get(i)) - meanX, 2);
            tmp2 += (SLCScript.toDouble(xs.get(i)) - meanX) * (SLCScript.toDouble(ys.get(i)) - meanY);
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
