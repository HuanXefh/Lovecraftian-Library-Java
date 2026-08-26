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


    public static NativeObject PARAM;
    public static NativeObject TIMER;
    public static NativeObject TRIGGER;
    public static NativeObject VAR;
    public static NativeObject MDL_cond;
    public static NativeObject MDL_effect;
    public static NativeObject MDL_prop;
    public static NativeObject MDL_reaction;
    public static NativeObject MDL_recipeDict;
    public static NativeObject FRAG_item;
    public static NativeObject DB_block;
    public static NativeObject DB_misc;

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
        PARAM = toObject(get("PARAM"));
        TIMER = toObject(get("TIMER"));
        TRIGGER = toObject(get("TRIGGER"));
        VAR = toObject(get("VAR"));
        MDL_cond = toObject(get("MDL_cond"));
        MDL_effect = toObject(get("MDL_effect"));
        MDL_prop = toObject(get("MDL_prop"));
        MDL_reaction = toObject(get("MDL_reaction"));
        MDL_recipeDict = toObject(get("MDL_recipeDict"));
        FRAG_item = toObject(get("FRAG_item"));
        DB_block = toObject(get("DB_block"));
        DB_misc = toObject(get("DB_misc"));

        Log.info("[LOVEC] Initialized Lovec module references in LCScript.");
    };


    /* <-------------------- base --------------------> */


    /**
     * Whether given value is undefined.
     */
    public static boolean isUndefined(Object val) {
        return val == UniqueTag.NOT_FOUND || val == Undefined.instance;
    };


    /**
     * Whether given value is null or undefined.
     */
    public static boolean isNull(Object val) {
        return val == null || isUndefined(val);
    };


    /**
     * Converts JS value to Java integer.
     */
    public static int toInt(Object val) {
        if(val instanceof Number num) return num.intValue();
        return 0;
    };


    public static long toLong(Object val) {
        if(val instanceof Number num) return num.longValue();
        return 0;
    };


    /**
     * Converts JS value to Java float.
     */
    public static float toFloat(Object val) {
        if(val instanceof Number num) return num.floatValue();
        return 0f;
    };


    /**
     * Converts JS value to Java double.
     */
    public static double toDouble(Object val) {
        if(val instanceof Number num) return num.doubleValue();
        return 0;
    };


    /**
     * Converts JS value to Java boolean.
     */
    public static boolean toBoolean(Object val) {
        return (boolean) val;
    };


    /**
     * Converts JS value to Java string.
     */
    public static String toString(Object val) {
        return (String) val;
    };


    /**
     * Converts JS value to JavaScript object.
     */
    public static NativeObject toObject(Object val) {
        return (NativeObject) val;
    };


    /**
     * Converts JS value to JavaScript array.
     */
    public static NativeArray toArray(Object val) {
        return (NativeArray) val;
    };


    /**
     * Converts a JS value to JavaScript function.
     */
    public static Function toFunction(Object val) {
        return (Function) val;
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
        return (NativeArray) scope.get(name, scope);
    };
    // Overload
    public static NativeArray newArray(String name) {
        return newArray(name, toObject(get("__javaInternal__")));
    };


    /**
     * Ensures a JavaScript array exists.
     */
    public static NativeArray ensureArray(String name, Scriptable scope) {
        Object val = scope.get(name, scope);
        if(val instanceof NativeArray arr) return arr;

        return newArray(name, scope);
    };
    // Overload
    public static NativeArray ensureArray(String name) {
        return ensureArray(name, toObject(get("__javaInternal__")));
    };


    /**
     * Ensures array length is not less than given length.
     */
    @SuppressWarnings("CollectionAddedToSelf")
    public static NativeArray ensureLength(NativeArray arr, int len, @Nullable Object def) {
        int lenPrev = LCScript.toInt(arr.getLength());
        if(lenPrev < len) {
            int i = 0;
            while(lenPrev + i < len) {
                arr.put(lenPrev + i, arr, def);
                i++;
            };
        };
        return arr;
    };
    // Overload
    public static NativeArray ensureLength(NativeArray arr, int len) {
        return ensureLength(arr, len, null);
    };


    /**
     * Creates a new JavaScript object with given key-value pairs.
     */
    public static NativeObject newObject(String name, Scriptable scope, Object... args) throws IllegalArgumentException {
        Scriptable obj = Context.getContext().newObject(scope);
        if(args.length > 0) {
            if(args.length % 2 != 0) throw new IllegalArgumentException("Incomplete key-value pair!");
            Object rawKey;
            for(int i = 0; i < args.length; i += 2) {
                rawKey = args[i];
                if(rawKey instanceof String key) {
                    obj.put(key, obj, args[i + 1]);
                } else {
                    throw new IllegalArgumentException("Object key must be a string! Found: " + rawKey);
                };
            };
        };
        scope.put(name, scope, obj);
        return (NativeObject) scope.get(name, scope);
    };
    // Overload
    public static NativeObject newObject(String name) {
        return newObject(name, toObject(get("__javaInternal__")));
    };


    /**
     * Ensures a JavaScript object exists.
     */
    public static NativeObject ensureObject(String name, Scriptable scope) {
        Object val = scope.get(name, scope);
        if(val instanceof NativeObject obj) return obj;

        return newObject(name, scope);
    };
    // Overload
    public static NativeObject ensureObject(String name) {
        return ensureObject(name, toObject(get("__javaInternal__")));
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
     * Sets a property in a JavaScript object.
     */
    public static Scriptable set(String nameProp, Object val, Scriptable scope) {
        scope.put(nameProp, scope, val);
        return scope;
    };
    // Overload
    public static void set(String nameProp, Object val) {
        set(nameProp, val, Vars.mods.getScripts().scope);
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
    // Overload
    public static Object invoke(Function fun, Scriptable scope, Object... args) {
        return thisInvoke(fun, scope, Vars.mods.getScripts().scope, args);
    };


    /**
     * Variant of {@link #invoke} with <code>this</code> passed.
     */
    @SuppressWarnings("ConstantConditions")
    public static Object thisInvoke(String nameFun, Scriptable scope, Scriptable thisObj, Object... args) throws NullPointerException {
        Function fun = (Function) get(nameFun, scope);
        return thisInvoke(fun, scope, thisObj, args);
    };
    // Overload
    public static Object thisInvoke(Function fun, Scriptable scope, Scriptable thisObj, Object... args) {
        return fun.call(Context.getContext(), scope, thisObj, args);
    };


    /**
     * Variant of {@link #invoke} for JavaScript class instances.
     */
    public static Object protoInvoke(String nameFun, Scriptable ins, Object... args) throws NullPointerException {
        return thisInvoke(nameFun, ins.getPrototype(), ins, args);
    };


    /**
     * Wraps a Java object (often converted from JS value) for proper equality.
     */
    public static Object wrapEquality(Object javaObj) {
        if(javaObj instanceof Number num) return toDouble(javaObj);
        if(isUndefined(javaObj)) return Undefined.instance;

        return javaObj;
    };


    /**
     * Wraps a Java object to avoid type-related crash.
     */
    public static Object wrap(Object javaObj, Scriptable scope) {
        return Context.javaToJS(javaObj, scope);
    };
    // Overload
    public static Object wrap(Object javaObj) {
        return wrap(javaObj, Vars.mods.getScripts().scope);
    };


    /* <-------------------- adapter --------------------> */


    /**
     * Whether an instance is created with Rhino <code>JavaAdapter</code>.
     */
    public static boolean hasDelegee(Object ins) {
        return ins.getClass().getName().startsWith("adapter");
    };


    /**
     * Gets delegee of an instance created with Rhino <code>JavaAdapter</code>.
     */
    public static @Nullable NativeObject getDelegee(Object ins) {
        return Reflect.get(ins, "delegee");
    };


    /**
     * Whether an instance created with Rhino <code>JavaAdapter</code> has some property.
     */
    public static boolean instanceHas(Object ins, String nameProp) {
        return hasDelegee(ins) && instanceGet(ins, nameProp) != null;
    };


    /**
     * Gets a property in an instance created with Rhino <code>JavaAdapter</code>.
     */
    public static @Nullable Object instanceGet(Object ins, String nameProp) {
        NativeObject delegee = getDelegee(ins);
        return delegee == null ? null : delegee.get(nameProp);
    };


    /**
     * Sets a property in an instance created with Rhino <code>JavaAdapter</code>.
     */
    public static void instanceSet(Object ins, String[] nameProps, Object... vals) {
        NativeObject delegee = getDelegee(ins);
        if(delegee == null) return;
        for(int i = 0; i < nameProps.length; i++) {
            delegee.put(nameProps[i], delegee, vals[i]);
        };
    };
    // Overload
    public static void instanceSet(Object ins, String nameProp, Object val) {
        NativeObject delegee = getDelegee(ins);
        if(delegee == null) return;
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
