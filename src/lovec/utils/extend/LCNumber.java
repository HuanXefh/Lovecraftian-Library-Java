package lovec.utils.extend;

import arc.func.Cons;
import arc.math.Mathf;
import arc.math.Rand;
import arc.util.Nullable;
import lovec.utils.LCRand;

/**
 * Handles numerical calculation.
 */
public class LCNumber {


    /**
     * Iteration using a number as cap.
     */
    public static void each(Number num, Cons<Integer> cons, int gap, int base) {
        if(gap < 1) return;
        int iCap = Math.round(num.floatValue());
        if(iCap < 1) return;
        int i = 0;
        while(i < iCap) {
            cons.get(i);
            i += gap;
        };
    };
    // Overload
    public static void each(Number num, Cons<Integer> cons, int gap) {
        each(num, cons, gap, 0);
    };
    public static void each(Number num, Cons<Integer> cons) {
        each(num, cons, 1);
    };


    /**
     * Rounds a number for some digits.
     */
    public static float roundFixed(float num, int deciAmt) {
        int mtp = Mathf.pow(10, deciAmt);
        return (float) Mathf.round(num * mtp) / mtp;
    };
    // Overload
    public static float roundFixed(float num) {
        return roundFixed(num, 2);
    };


    /**
     * Gets a random integer in range.
     */
    public static int randInt(int base, int cap) {
        return (int) (Mathf.random() * (cap + 1 - base) + base);
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
