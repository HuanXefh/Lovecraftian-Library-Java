package lovec.math;

import arc.math.Interp;
import arc.math.Mathf;

public class LCLerp {


    public static float calcParamFrac(float param, float param_f, float param_t) {
        return Mathf.equal(param_f, param_t) ? 0f : ((param - param_f) / (param_t - param_f));
    };


    /**
     * Generalized lerp method.
     */
    public static float lerp(float val_f, float val_t, float param, float param_f, float param_t) {
        return val_f + (val_t - val_f) * calcParamFrac(param, param_f, param_t);
    };
    // Overloading
    public static float lerp(float val_f, float val_t, float param) {
        return lerp(val_f, val_t, param, 0f, 1f);
    };


    private static float calcSmoothA(float paramFrac) {
        return Mathf.pow(paramFrac, 5f) * 6f - Mathf.pow(paramFrac, 4f) * 15f + Mathf.pow(paramFrac, 3f) * 10f;
    };


    /**
     * Smooth version of {@link #lerp}.
     */
    public static float sLerp(float val_f, float val_t, float param, float param_f, float param_t) {
        return val_f + (val_t - val_f) * calcSmoothA(calcParamFrac(param, param_f, param_t));
    };
    // Overloading
    public static float sLerp(float val_f, float val_t, float param) {
        return sLerp(val_f, val_t, param, 0f, 1f);
    };


    /**
     * Bilinear version of {@link #lerp}.
     */
    public static float biLerp(float val1_f, float val1_t, float val2_f, float val2_t, float param1, float param2, float a, float param1_f, float param1_t, float param2_f, float param2_t) {
        return lerp(
            lerp(val1_f, val1_t, param1, param1_f, param1_t),
            lerp(val2_f, val2_t, param2, param2_f, param2_t),
            a
        );
    };
    // Overloading
    public static float biLerp(float val1_f, float val1_t, float val2_f, float val2_t, float param1, float param2, float a) {
        return biLerp(val1_f, val1_t, val2_f, val2_t, param1, param2, a, 0f, 1f, 0f, 1f);
    };


    /**
     * Smooth version of {@link #biLerp}.
     */
    public static float sBiLerp(float val1_f, float val1_t, float val2_f, float val2_t, float param1, float param2, float a, float param1_f, float param1_t, float param2_f, float param2_t) {
        return sLerp(
            sLerp(val1_f, val1_t, param1, param1_f, param1_t),
            sLerp(val2_f, val2_t, param2, param2_f, param2_t),
            a
        );
    };
    // Overloading
    public static float sBiLerp(float val1_f, float val1_t, float val2_f, float val2_t, float param1, float param2, float a) {
        return sBiLerp(val1_f, val1_t, val2_f, val2_t, param1, param2, a, 0f, 1f, 0f, 1f);
    };


    /**
     * Generalized way to use {@link Interp}.
     */
    public static float applyInterp(float val_f, float val_t, float param, Interp interp, float param_f, float param_t) {
        return val_f + (val_f - val_t) * interp.apply(calcParamFrac(param, param_f, param_t));
    };
    // Overloading
    public static float applyInterp(float val_f, float val_t, float param, Interp interp) {
        return applyInterp(val_f, val_t, param, interp, 0f, 1f);
    };
    public static float applyInterp(float val_f, float val_t, float param, float param_f, float param_t) {
        return applyInterp(val_f, val_t, param, Interp.linear, param_f, param_t);
    };
    public static float applyInterp(float val_f, float val_t, float param) {
        return applyInterp(val_f, val_t, param, Interp.linear);
    };


}