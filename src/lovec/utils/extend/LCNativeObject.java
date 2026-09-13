package lovec.utils.extend;

import arc.util.Nullable;
import lovec.utils.LCScript;
import lovec.utils.func.Floatf2;
import rhino.NativeObject;

/**
 * Various methods for Rhino native object.
 */
public class LCNativeObject {


    /* <-------------------- base --------------------> */


    /**
     * Increases a number in an object.
     */
    public static float numIncre(NativeObject obj, String key, float num) {
        Object val = obj.get(key);
        if(!(val instanceof Number)) {
            val = 0f;
        };
        float val_fi = LCScript.toFloat(val) + num;
        obj.put(key, obj, val_fi);
        return val_fi;
    };
    // Overload
    public static float numIncre(NativeObject obj, String key) {
        return numIncre(obj, key, 1f);
    };


    /**
     * Sums all numbers in an object.
     */
    public static float numSum(NativeObject obj, @Nullable Floatf2<String, Float> mapF) {
        float sum = 0f;
        Object[] ids = obj.getIds();
        Object val;
        for(Object id : ids) {
            val = obj.get(id);
            if(val instanceof Number num) {
                sum += mapF == null ? LCScript.toFloat(num) : mapF.get(LCScript.toString(id), LCScript.toFloat(num));
            };
        };
        return sum;
    };
    // Overload
    public static float numSum(NativeObject obj) {
        return numSum(obj, null);
    };


    /**
     * Finds largest number in an object.
     */
    public static float numMax(NativeObject obj, @Nullable Floatf2<String, Float> mapF) {
        float max = Float.MIN_VALUE;
        Object[] ids = obj.getIds();
        Object val;
        float tmp;
        for(Object id : ids) {
            val = obj.get(id);
            if(val instanceof Number) {
                tmp = mapF == null ? LCScript.toFloat(val) : mapF.get(LCScript.toString(id), LCScript.toFloat(val));
                if(tmp > max) {
                    max = tmp;
                };
            };
        };
        return max;
    };
    // Overload
    public static float numMax(NativeObject obj) {
        return numMax(obj, null);
    };


    /**
     * Finds smallest number in an object.
     */
    public static float numMin(NativeObject obj, @Nullable Floatf2<String, Float> mapF) {
        float min = Float.MAX_VALUE;
        Object[] ids = obj.getIds();
        Object val;
        float tmp;
        for(Object id : ids) {
            val = obj.get(id);
            if(val instanceof Number) {
                tmp = mapF == null ? LCScript.toFloat(val) : mapF.get(LCScript.toString(id), LCScript.toFloat(val));
                if(tmp < min) {
                    min = tmp;
                };
            };
        };
        return min;
    };
    // Overload
    public static float numMin(NativeObject obj) {
        return numMin(obj, null);
    };


    private static float getNumWithDef(NativeObject obj, Object id, float def) {
        Object val = obj.get(id);
        return val instanceof Number ? LCScript.toFloat(val) : def;
    };
    // Overload
    private static float getNumWithDef(NativeObject obj, Object id) {
        return getNumWithDef(obj, id, 0f);
    };


    /**
     * Whether any of the numbers in an object is larger than provided numbers.
     */
    public static boolean numSomeLargerThan(NativeObject obj1, NativeObject obj2, boolean equal) {
        Object[] ids= obj1.getIds();
        float val1, val2;
        for(Object id : ids) {
            val1 = getNumWithDef(obj1, id);
            val2 = getNumWithDef(obj2, id);
            if(equal ? val1 >= val2 : val1 > val2) return true;
        };
        return false;
    };
    // Overload
    public static boolean numSomeLargerThan(NativeObject obj, float num, boolean equal) {
        Object[] ids = obj.getIds();
        float val;
        for(Object id: ids) {
            val = getNumWithDef(obj, id);
            if(equal ? val >= num : val > num) return true;
        };
        return false;
    };
    public static boolean numSomeLargerThan(NativeObject obj, Floatf2<String, Float> valF, boolean equal) {
        Object[] ids = obj.getIds();
        float val1, val2;
        for(Object id: ids) {
            val1 = getNumWithDef(obj, id);
            val2 = valF.get(LCScript.toString(id), val1);
            if(equal ? val1 >= val2 : val1 > val2) return true;
        };
        return false;
    };


    /**
     * Whether any of the numbers in an object is smaller than provided numbers.
     */
    public static boolean numSomeSmallerThan(NativeObject obj1, NativeObject obj2, boolean equal) {
        Object[] ids= obj1.getIds();
        float val1, val2;
        for(Object id : ids) {
            val1 = getNumWithDef(obj1, id);
            val2 = getNumWithDef(obj2, id);
            if(equal ? val1 <= val2 : val1 < val2) return true;
        };
        return false;
    };
    // Overload
    public static boolean numSomeSmallerThan(NativeObject obj, float num, boolean equal) {
        Object[] ids = obj.getIds();
        float val;
        for(Object id: ids) {
            val = getNumWithDef(obj, id);
            if(equal ? val <= num : val < num) return true;
        };
        return false;
    };
    public static boolean numSomeSmallerThan(NativeObject obj, Floatf2<String, Float> valF, boolean equal) {
        Object[] ids = obj.getIds();
        float val1, val2;
        for(Object id: ids) {
            val1 = getNumWithDef(obj, id);
            val2 = valF.get(LCScript.toString(id), val1);
            if(equal ? val1 <= val2 : val1 < val2) return true;
        };
        return false;
    };


    /**
     * Whether all numbers in an object is larger than provided numbers.
     */
    public static boolean numAllLargerThan(NativeObject obj1, NativeObject obj2, boolean equal) {
        return !numSomeSmallerThan(obj1, obj2, !equal);
    };
    // Overload
    public static boolean numAllLargerThan(NativeObject obj, float num, boolean equal) {
        return !numSomeSmallerThan(obj, num, !equal);
    };
    public static boolean numAllLargerThan(NativeObject obj, Floatf2<String, Float> valF, boolean equal) {
        return !numSomeSmallerThan(obj, valF, !equal);
    };


    /**
     * Whether all numbers in an object is smaller than provided numbers.
     */
    public static boolean numAllSmallerThan(NativeObject obj1, NativeObject obj2, boolean equal) {
        return !numSomeLargerThan(obj1, obj2, !equal);
    };
    // Overload
    public static boolean numAllSmallerThan(NativeObject obj, float num, boolean equal) {
        return !numSomeLargerThan(obj, num, !equal);
    };
    public static boolean numAllSmallerThan(NativeObject obj, Floatf2<String, Float> valF, boolean equal) {
        return !numSomeLargerThan(obj, valF, !equal);
    };


};
