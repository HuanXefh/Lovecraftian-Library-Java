package lovec.utils.extend;

import arc.math.Mathf;
import arc.math.Rand;
import arc.util.Nullable;
import lovec.utils.LCRand;

/**
 * Handles numerical calculation.
 */
public class LCNumber {


    /**
     * Rounds a number for some digits.
     */
    public static float roundFixed(float num, int deciAmt) {
        float mtp = Mathf.pow(10f, deciAmt);
        return Math.round(num * mtp) / mtp;
    };
    // Overload
    public static float roundFixed(float num) {
        return roundFixed(num, 2);
    };


    /**
     * Gets a random integer in range.
     */
    public static int randInt(int base, int cap) {
        return (int)(Mathf.random() * (cap + 1 - base) + base);
    };
    // Overload
    public static int randInt(int cap) {
        return randInt(0, cap);
    };


    /**
     * Gets a random frequency with <code>p</code> as the chance to occur.
     */
    public static int randFreq(@Nullable Rand rand, int n, float p) {
        if(n == 0) return 0;
        int freq = 0;
        for(int i = 0; i < n; i++) {
            if(rand == null ? Mathf.chance(p) : LCRand.chance(rand, p)) freq++;
        };
        return freq;
    };
    // Overload
    public static int randFreq(int n, float p) {
        return randFreq(null, n, p);
    };


};
