package lovec.utils;

import arc.graphics.Color;
import arc.math.Mathf;
import arc.util.Strings;
import lovec.utils.extend.LCNumber;
import mindustry.graphics.Pal;

public class LCFormat {


    protected static final StringBuilder strBuilder = new StringBuilder();


    /**
     * Converts a number to string with capped amount of digits.
     */
    public static String numToStr(float num, int deciAmt) {
        return Strings.autoFixed(LCNumber.roundFixed(num, deciAmt), deciAmt);
    };
    // Overload
    public static String numToStr(float num) {
        return numToStr(num, 2);
    };


    /**
     * Converts a number to percentage string.
     */
    public static String perc(float num, int deciAmt) {
        return Strings.fixed(LCNumber.roundFixed(num * 100, deciAmt), deciAmt) + "%";
    };
    // Overload
    public static String perc(float num) {
        return perc(num, 2);
    };


    /**
     * Converts a number to scientific notation string.
     */
    public static String sci(float num, int pow, int deciAmt) {
        strBuilder.setLength(0);
        strBuilder.append(Strings.fixed(num * Mathf.pow(10f, -pow), deciAmt));
        strBuilder.append(" x 10^");
        strBuilder.append(pow);
        return strBuilder.toString();
    };
    // Overload
    public static String sci(float num, int pow) {
        return sci(num, pow, 2);
    };


    /**
     * Converts a number to time string.
     */
    public static String time(float num, int deciAmt) {
        if(num < 3600f) {
            return LCNumber.roundFixed(num / 60f, deciAmt) + "s";
        } else if(num < 216000f) {
            return LCNumber.roundFixed(num / 3600f, deciAmt) + " min";
        } else if(num < 5184000f) {
            return LCNumber.roundFixed(num / 216000f, deciAmt) + "h";
        };

        return LCNumber.roundFixed(num / 5184000f, deciAmt) + "d";
    };
    // Overload
    public static String time(float num) {
        return time(num, 2);
    };


    /**
     * Adds color markup to a string.
     */
    public static String color(String str, Color color) {
        strBuilder.setLength(0);
        strBuilder.append("[#");
        strBuilder.append(color.toString());
        strBuilder.append("]");
        strBuilder.append(str);
        strBuilder.append("[]");
        return strBuilder.toString();
    };


    /**
     * Adds color markup to a number.
     */
    public static String colorNum(float num, Color color, int deciAmt) {
        return color(numToStr(num, deciAmt), color);
    };
    // Overload
    public static String colorNum(float num, Color color) {
        return color(numToStr(num), color);
    };


    /**
     * Variant of {@link #color} for percentage string.
     */
    public static String percColor(float num, int deciAmt, Color overColor, Color lessColor, Color midColor, float midTol) {
        return color(
            perc(num, deciAmt),
            Mathf.equal(num, 1f, midTol) ?
                midColor :
                num > 1f ? overColor : lessColor
        );
    };
    // Overload
    public static String percColor(float num, int deciAmt, Color overColor, Color lessColor, Color midColor) {
        return percColor(num, deciAmt, overColor, lessColor, midColor, 0.025f);
    };
    public static String percColor(float num, int deciAmt, Color overColor, Color lessColor) {
        return percColor(num, deciAmt, overColor, lessColor, Pal.accent);
    };
    public static String percColor(float num, int deciAmt) {
        return percColor(num, deciAmt, Pal.heal, Pal.remove);
    };
    public static String percColor(float num) {
        return percColor(num, 2);
    };


    /**
     * Removes color markup.
     */
    public static String plain(String str) {
        return Strings.stripColors(str);
    };


};
