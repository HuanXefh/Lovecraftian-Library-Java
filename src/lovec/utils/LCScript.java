package lovec.utils;

import arc.util.Log;
import arc.util.Nullable;
import arc.util.Reflect;
import mindustry.Vars;
import rhino.*;

/**
 * Used for interaction with JavaScript.
 */
public class LCScript {


    public static NativeObject VAR;
    public static NativeObject TIMER;
    public static NativeObject MDL_cond;
    public static NativeObject MDL_effect;


    private static final Class[][] objClss = {
        new Class[]{},
        new Class[]{Object.class},
        new Class[]{Object.class, Object.class},
        new Class[]{Object.class, Object.class, Object.class},
        new Class[]{Object.class, Object.class, Object.class, Object.class},
        new Class[]{Object.class, Object.class, Object.class, Object.class, Object.class},
        new Class[]{Object.class, Object.class, Object.class, Object.class, Object.class, Object.class},
        new Class[]{Object.class, Object.class, Object.class, Object.class, Object.class, Object.class, Object.class},
        new Class[]{Object.class, Object.class, Object.class, Object.class, Object.class, Object.class, Object.class, Object.class},
        new Class[]{Object.class, Object.class, Object.class, Object.class, Object.class, Object.class, Object.class, Object.class, Object.class},
        new Class[]{Object.class, Object.class, Object.class, Object.class, Object.class, Object.class, Object.class, Object.class, Object.class, Object.class},
    };


    public static void init() {
        VAR = (NativeObject)(get("VAR"));
        TIMER = (NativeObject)(get("TIMER"));
        MDL_cond = (NativeObject)(get("MDL_cond"));
        MDL_effect = (NativeObject)(get("MDL_effect"));

        Log.info("[LOVEC] Initialized Lovec module references in LCScript.");
    };


    /* <-------------------- base --------------------> */


    /**
     * Whether given value is null or undefined.
     */
    public static boolean isNull(Object val) {
        return val == null || val == UniqueTag.NOT_FOUND || val == Undefined.instance;
    };


    /**
     * Converts JS value to Java integer.
     */
    public static int toInt(Object val) {
        if(val instanceof Integer num) return num;
        return (int)(Math.floor(toDouble(val)));
    };


    /**
     * Converts JS value to Java float.
     */
    public static float toFloat(Object val) {
        return ((Double)(toDouble(val))).floatValue();
    };


    /**
     * Converts JS value to Java double.
     */
    public static double toDouble(Object val) {
        if(val instanceof Double num) return num;
        if(val instanceof Integer num) return num.doubleValue();
        if(val instanceof Float num) return num.doubleValue();
        if(val instanceof Long num) return num.doubleValue();
        if(val instanceof Byte num) return num.doubleValue();
        return 0;
    };


    /**
     * Converts JS value to Java boolean.
     */
    public static boolean toBoolean(Object val) {
        return (boolean)(val);
    };


    /**
     * Creates a new JavaScript array with given elements.
     */
    public static NativeArray newArray(String name, Scriptable scope, Object... eles) {
        scope.put(
            name, scope,
            eles.length == 0 ?
                Context.getContext().newArray(scope, 0) :
                Context.getContext().newArray(scope, eles)
        );
        return (NativeArray)(scope.get(name, scope));
    };
    // Overload
    public static NativeArray newArray(String name) {
        return newArray(name, (NativeObject)(get("__javaInternal__")));
    };


    /**
     * Gets a property in a JavaScript object.
     */
    public static @Nullable Object get(String nameProp, Scriptable scope) {
        Object val = scope.get(nameProp, scope);
        return isNull(val) ? null : val;
    };
    // Overload
    public static @Nullable Object get(String nameProp) {
        return get(nameProp, Vars.mods.getScripts().scope);
    };


    /**
     * Gets a property in nested JavaScript objects by a series of names.
     */
    public static @Nullable Object search(Scriptable scope, String... nameProps) {
        Object lastVal = null;
        Scriptable lastScope = scope;
        int i = 0;
        int cap = nameProps.length;
        while(i < cap) {
            lastVal = get(nameProps[i], lastScope);
            if(isNull(lastVal)) {
                break;
            } else if(lastVal instanceof Scriptable obj) {
                lastScope = obj;
            } else {
                break;
            };
            i++;
        };
        return lastVal;
    };


    /**
     * Invokes a function in a JavaScript object.
     */
    public static Object invoke(String nameFun, Scriptable scope, Object... args) throws NullPointerException {
        return thisInvoke(nameFun, scope, Vars.mods.getScripts().scope, args);
    };


    /**
     * Variant of {@link #invoke} with <code>this</code> passed.
     */
    @SuppressWarnings("ConstantConditions")
    public static Object thisInvoke(String nameFun, Scriptable scope, Scriptable thisObj, Object... args) throws NullPointerException {
        Function fun = (Function)(get(nameFun, scope));
        return fun.call(Context.getContext(), scope, thisObj, args);
    };


    /* <-------------------- adapter --------------------> */


    /**
     * Gets delegee of an instance created with Rhino <code>JavaAdapter</code>.
     */
    public static NativeObject getDelegee(Object ins) {
        return Reflect.get(ins, "delegee");
    };


    /**
     * Gets a property in an instance created with Rhino <code>JavaAdapter</code>.
     */
    public static @Nullable Object instanceGet(Object ins, String nameProp) {
        return getDelegee(ins).get(nameProp);
    };


    /**
     * Sets a property in an instance created with Rhino <code>JavaAdapter</code>.
     */
    public static void instanceSet(Object ins, String[] nameProps, Object... vals) {
        NativeObject delegee = getDelegee(ins);
        for(int i = 0; i < nameProps.length; i++) {
            delegee.put(nameProps[i], delegee, vals[i]);
        };
    };
    // Overload
    public static void instanceSet(Object ins, String nameProp, Object val) {
        NativeObject delegee = getDelegee(ins);
        delegee.put(nameProp, delegee, val);
    };


    /**
     * Invokes a Java method created with Rhino <code>JavaAdapter</code>.
     */
    public static Object instanceInvoke(Object ins, String nameFun, Object... args) throws IllegalArgumentException {
        if(args.length > objClss.length) throw new IllegalArgumentException("Argument length out of bound: " + args.length + ">" + objClss.length);
        return Reflect.invoke(ins, nameFun, args, objClss[args.length]);
    };


};
