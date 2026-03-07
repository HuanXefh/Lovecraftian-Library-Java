package lovec.math;

import arc.util.Nullable;

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
        if(x <= 0 && Math.floor(x) == x) {
            throw new IllegalArgumentException("Undefined result at non-positive integers!");
        };
        if(x < 0) {
            return Math.PI / Math.sin(Math.PI * x) * gamma(1 - x);
        };
        return Math.exp(logGamma(x));
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
    public static double derivative(double x, MathFunc mathFunc, double delta) {
        return (mathFunc.get(x + delta) - mathFunc.get(x)) / delta;
    };
    // Overloading
    public static double derivative(double x, MathFunc mathFunc) {
        return derivative(x, mathFunc, 0.00001);
    };


    /**
     * Riemann sum of some function over (base, cap).
     * This method uses midpoints for less error.
     */
    public static double riemannSum(double base, double cap, MathFunc mathFunc, int segAmt) {
        double val = 0;
        double dx = (cap - base) / segAmt;
        for (int i = 0; i < segAmt; i++) {
            val += mathFunc.get(base + dx * (0.5 + i));
        };
        return val * dx;
    };
    // Overloading
    public static double riemannSum(double base, double cap, MathFunc mathFunc) {
        return riemannSum(base, cap, mathFunc, 1000);
    };


};
