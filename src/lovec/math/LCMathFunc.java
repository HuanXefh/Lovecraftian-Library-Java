package lovec.math;

import arc.func.Func;

public class LCMathFunc {


    /* <-------------------- basic --------------------> */


    /**
     * Factorial of an integer.
     */
    public static int factorial(int x) throws IllegalArgumentException {
        if(x < 0) throw new IllegalArgumentException("Factorial of a negative number is undefined!");
        if(x == 0) {
            return 1;
        };
        int val = 1;
        for(int i = 1; i < x + 1; i++) {
            val *= i;
        };
        return val;
    };


    static final double[] lanczosCoeffs = {
        0.99999999999980993,
        676.5203681218851,
        -1259.1392167224028,
        771.32342877765313,
        -176.61502916214059,
        12.507343278686905,
        -0.13857109526572012,
        9.9843695780195716e-6,
        1.5056327351493116e-7
    };


    /**
     * Calculates log of gamma function to prevent overflow.
     */
    private static double logGamma(double x) {
        if(x < 0.5) {
            return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * x)) - logGamma(1 - x);
        };
        x -= 1;
        double val = lanczosCoeffs[0];
        for(int i = 1; i < lanczosCoeffs.length; i++) {
            val += lanczosCoeffs[i] / (x + i);
        };
        return 0.5 * Math.log(Math.PI * 2) + (x + 0.5) * Math.log(x + 7.5) - x - 7.5 + Math.log(val);
    };


    /**
     * Gamma function.
     * This method is an approximation, for integers use {@link #factorial} instead for accurate results.
     */
    public static double gamma(double x) throws IllegalArgumentException {
        if(x <= 0 && Math.floor(x) == x) throw new IllegalArgumentException("Undefined result at non-positive integers!");
        if(x < 0) {
            return Math.PI / Math.sin(Math.PI * x) * gamma(1 - x);
        };
        return Math.exp(logGamma(x));
    };


    /**
     * Beta function.
     */
    public static double beta(double a, double b) throws IllegalArgumentException {
        if(a <= 0 || b <= 0) throw new IllegalArgumentException("Undefined result at non-positive numbers!");
        return gamma(a) * gamma(b) / gamma(a + b);
    };


    /* <-------------------- vibration --------------------> */


    /**
     * Damped cosinusoid function.
     */
    public static double dampCos(double x, double mag, double decay, double omega, double phi) {
        return mag * Math.exp(-decay * x) * Math.cos(omega * x - phi);
    };
    // Overloading
    public static double dampCos(double x, double mag, double decay, double omega) {
        return dampCos(x, mag, decay, omega, 0);
    };


    /* <-------------------- distribution --------------------> */


    /**
     * Gaussian function (in the form of Gaussian distribution).
     */
    public static double gaussian(double x, double mu, double sigma) {
        return 1 / Math.sqrt(2 * Math.PI * Math.pow(sigma, 2)) * Math.exp(-1 * Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2)));
    };


    /**
     * Chi-square distribution.
     */
    public static double chiSquare(double x, double f) {
        return x <= 0 ? 0 : (1 / (Math.pow(2, f * 0.5) * gamma(f * 0.5)) * Math.pow(x, f * 0.5 - 1) * Math.exp(-x * 0.5));
    };


    /* <-------------------- calculus --------------------> */


    /**
     * Derivative of some function at `x`.
     */
    public static double derivative(double x, Func<Double, Double> func, double delta) {
        return (func.get(x + delta) - func.get(x)) / delta;
    };
    // Overloading
    public static double derivative(double x, Func<Double, Double> func) {
        return derivative(x, func, 1e-5);
    };


    /**
     * Variant of {@link LCMathFunc#derivative} using central difference method for better precision.
     */
    public static double derivativePrecise(double x, Func<Double, Double> func, double delta) {
        return (func.get(x + delta) - func.get(x - delta)) / (delta * 2);
    };
    // Overloading
    public static double derivativePrecise(double x, Func<Double, Double> func) {
        return derivativePrecise(x, func, 1e-10);
    };


    /**
     * Integral of some function over (base, cap), using trapezoidal rule.
     */
    public static double integral(double base, double cap, Func<Double, Double> func, int segAmt) {
        double val = (func.get(cap) + func.get(base)) * 0.5;
        double dx = (cap - base) / segAmt;
        for(int i = 1; i < segAmt; i++) {
            val += func.get(base + dx * i);
        };
        return val;
    };
    // Overloading
    public static double integral(double base, double cap, Func<Double, Double> func) {
        return integral(base, cap, func, 1000);
    };


    /**
     * Variant of {@link LCMathFunc#integral} using Simpson's rule for better precision.
     */
    public static double integralPrecise(double base, double cap, Func<Double, Double> func, int segAmt) {
        if(segAmt % 2 != 0) segAmt++;
        double val = func.get(base) + func.get(cap);
        double dx = (func.get(cap) - func.get(base)) / segAmt;
        for(int i = 1; i < segAmt; i++) {
            val += (i % 2 == 0 ? 2 : 4) * func.get(base + i * dx);
        };
        return val * dx / 3;
    };
    // Overloading
    public static double integralPrecise(double base, double cap, Func<Double, Double> func) {
        return integralPrecise(base, cap, func, 1000);
    };


};
