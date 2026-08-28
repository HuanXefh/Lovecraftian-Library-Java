package lovec.math.struct;

import arc.func.Prov;
import arc.math.Rand;

public class LCProbability {


    private static final Rand rand = new Rand();
    private static final Rand seedRand = new Rand();


    /**
     * Generates distribution using given random number generator.
     */
    public static double[] generateDistribution(int size, Prov<Double> numF) {
        double[] result = new double[size];
        int i = 0;
        while(i < size) {
            result[i] = numF.get();
            i++;
        };
        return result;
    };


    /**
     * Generates random distribution.
     */
    public static double[] randomDistribution(int size, double base, double cap) {
        return generateDistribution(size, () -> base + rand.nextDouble() * (cap - base));
    };
    // Overload
    public static double[] randomDistribution(int size, double base, double cap, long seed) {
        seedRand.setSeed(seed);
        return generateDistribution(size, () -> base + seedRand.nextDouble() * (cap - base));
    };


    private static Double normalDistributionTmpVal;


    /**
     * Generates normal distribution.
     * <br> <code>REFERENCE</code>: Marsaglia polar method.
     */
    public static double[] normalDistribution(int size, double mu, double sigma) {
        double[] result = new double[size];
        int i = 0;
        double x = 0;
        double y = 0;
        double s;
        double tmp;
        while(i < size) {
            if(normalDistributionTmpVal != null) {
                result[i] = normalDistributionTmpVal * sigma + mu;
                normalDistributionTmpVal = null;
            } else {
                s = 0;
                while(s >= 1 || s == 0) {
                    x = Math.random() * 2 - 1;
                    y = Math.random() * 2 - 1;
                    s = Math.pow(x, 2) + Math.pow(y, 2);
                };
                tmp = Math.sqrt(-2 * Math.log(s) / s);
                normalDistributionTmpVal = y * tmp;
                result[i] = tmp * x * sigma + mu;
            };
            i++;
        };
        normalDistributionTmpVal = null;
        return result;
    };


};
