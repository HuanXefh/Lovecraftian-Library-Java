package lovec.utils;

import arc.math.Rand;
import arc.util.Time;

public class LCRand {


    /**
     * Gets a random integer between two integers (inclusive),
     */
    public static int randomInt(Rand rand, int from, int to) {
        return from + rand.nextInt(to - from + 1);
    };
    // Overload
    public static int randomInt(Rand rand, int to) {
        return rand.nextInt(to + 1);
    };
    public static int randomInt(Rand rand) {
        return rand.nextInt();
    };


    /**
     * Variant of {@link LCRand#randomInt} with double tails.
     */
    public static int rangeInt(Rand rand, int from, int to) {
        return chance(rand, 0.5) ?
            randomInt(rand, from, to) :
            -randomInt(rand, from ,to);
    };
    // Overload
    public static int rangeInt(Rand rand, int to) {
        return randomInt(rand, -to, to);
    };


    /**
     * Gets a random float between two floats.
     */
    public static float randomFloat(Rand rand, float from, float to) {
        return from + rand.nextFloat() * (to - from);
    };
    // Overload
    public static float randomFloat(Rand rand, float to) {
        return rand.nextFloat() * to;
    };
    public static float randomFloat(Rand rand) {
        return rand.nextFloat();
    };


    /**
     * Variant of {@link LCRand#randomFloat} with double tails.
     */
    public static float rangeFloat(Rand rand, float from, float to) {
        return chance(rand, 0.5) ?
            randomFloat(rand, from, to) :
            -randomFloat(rand, from, to);
    };
    // Overload
    public static float rangeFloat(Rand rand, float to) {
        return randomFloat(rand, -to, to);
    };


    /**
     * Gets a random boolean.
     */
    public static boolean randomBoolean(Rand rand, float trueChance) {
        return rand.nextFloat() < trueChance;
    };
    // Overload
    public static boolean randomBoolean(Rand rand) {
        return rand.nextBoolean();
    };


    /**
     * Gets -1 or 1.
     */
    public static int randomSign(Rand rand) {
        return 1 | (rand.nextInt() >> 31);
    };


    /**
     * Randomly returns true.
     */
    public static boolean chance(Rand rand, double trueChance) {
        return trueChance >= 1 || rand.nextFloat() < trueChance;
    };


    /**
     * Variant of {@link LCRand#chance} that uses delta.
     */
    public static boolean chanceDelta(Rand rand, double trueChance) {
        return trueChance * Time.delta > rand.nextFloat();
    };


};
