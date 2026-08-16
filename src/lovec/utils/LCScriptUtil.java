package lovec.utils;

import static lovec.utils.LCScript.*;

/**
 * Utility methods directly related to Lovec modules.
 */
public class LCScriptUtil {


    /**
     * Gets timer state in <code>TIMER</code>.
     */
    @SuppressWarnings("ConstantConditions")
    public static boolean checkTimer(String name) {
        return (boolean) LCScript.get(name, TIMER);
    };


    /**
     * Fires a trigger defined in <code>TRIGGER</code>.
     * The first argument should be trigger name.
     */
    public static void fireTrigger(Object... args) {
        LCScript.invoke("fire", TRIGGER, args);
    };


    /**
     * Applies condition check base off <code>MDL_cond</code>.
     */
    public static boolean checkCond(String nameFun, Object... args) {
        return (boolean) LCScript.invoke(nameFun, MDL_cond, args);
    };


};
