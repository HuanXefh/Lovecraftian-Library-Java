package lovec.graphics;

import arc.graphics.Color;
import arc.math.Mathf;

public class LCRgb {


    static final Color[] tmpColors = {
        new Color(), new Color(), new Color(), new Color(), new Color(),
        new Color(), new Color(), new Color(), new Color(), new Color()
    };


    private static float calcLinearParam(float param) {
        return param < 0.04045f ? (param / 12.92f) : Mathf.pow((param + 0.055f) / 1.055f, 2.4f);
    };


    /**
     * Gets luminance of a color.
     */
    public static float calcLuminance(float r, float g, float b, float a) {
        return (calcLinearParam(r) * 0.2126f + calcLinearParam(g) * 0.7152f + calcLinearParam(b) * 0.0722f) * a;
    };
    // Overloading
    public static float calcLuminance(float r, float g, float b) {
        return calcLuminance(r, g, b, 1f);
    };
    public static float calcLuminance(Color color) {
        return calcLuminance(color.r, color.g, color.b, color.a);
    };


    /**
     * Gets perceived lightness of a color.
     */
    public static float calcLightness(float r, float g, float b, float a) {
        var lumin = calcLuminance(r, g, b, a);
        return lumin < 0.008856f ? (lumin * 9.033f) : ((Mathf.pow(lumin, 0.33333333f) * 116f - 16f) * 0.01f);
    };
    // Overloading
    public static float calcLightness(float r, float g, float b) {
        return calcLightness(r, g, b, 1f);
    };
    public static float calcLightness(Color color) {
        return calcLightness(color.r, color.g, color.b, color.a);
    };


    /**
     * Gets grayscale color.
     */
    public static Color grayscale(float r, float g, float b, float a) {
        var val = r * 0.2126f + g * 0.7152f + b * 0.0722f;
        return tmpColors[0].set(val, val, val, a);
    };
    // Overloading
    public static Color grayscale(float r, float g, float b) {
        return grayscale(r, g, b, 1f);
    };
    public static Color grayscale(Color color) {
        return grayscale(color.r, color.g, color.b, color.a);
    };


    /**
     * Gets negative color.
     */
    public static Color negative(float r, float g, float b, float a) {
        return tmpColors[1].set(1f - r, 1f - g, 1f - b, a);
    };
    // Overloading
    public static Color negative(float r, float g, float b) {
        return negative(r, g, b, 1f);
    };
    public static Color negative(Color color) {
        return negative(color.r, color.g, color.b, color.a);
    };


};