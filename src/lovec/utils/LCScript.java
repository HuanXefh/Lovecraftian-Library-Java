package lovec.utils;

import arc.util.Log;
import arc.util.Reflect;
import mindustry.Vars;
import rhino.*;

public class LCScript {


    public static NativeObject MDL_cond;


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
        MDL_cond = (NativeObject)(get("MDL_cond"));
        Log.info("[LOVEC] Initialized Lovec module references in LCScript.");
    };


    /**
     * Whether given value is null or undefined.
     */
    public static boolean isNull(Object val) {
        return val == null || val == Undefined.instance;
    };


    /**
     * Gets a property in a JavaScript object.
     */
    public static Object get(String nameProp, Scriptable scope) {
        return scope.get(nameProp, scope);
    };
    // Overload
    public static Object get(String nameProp) {
        return get(nameProp, Vars.mods.getScripts().scope);
    };


    /**
     * Invokes a function in a JavaScript object.
     */
    public static Object invoke(String nameFun, Scriptable scope, Object... args) {
        return thisInvoke(nameFun, scope, Vars.mods.getScripts().scope, args);
    };


    /**
     * Variant of {@link LCScript#invoke} with <code>this</code> passed.
     */
    public static Object thisInvoke(String nameFun, Scriptable scope, Scriptable thisObj, Object... args) {
        Function fun = (Function)(get(nameFun, scope));
        return fun.call(Context.getContext(), scope, thisObj, args);
    };


    /**
     * Invokes a Java method created with Rhino <code>JavaAdapter</code>.
     */
    public static Object instanceInvoke(Object ins, String nameFun, Object... args) throws IllegalArgumentException {
        if(args.length > objClss.length) throw new IllegalArgumentException("Argument length out of bound: " + args.length + ">" + objClss.length);
        return Reflect.invoke(ins, nameFun, args, objClss[args.length]);
    };


    /**
     * Gets delegee of an instance created with Rhino <code>JavaAdapter</code>.
     */
    public static NativeObject getDelegee(Object ins) {
        return Reflect.get(ins, "delegee");
    };


    /**
     * Gets a property in an instance created with Rhino <code>JavaAdapter</code>.
     */
    public static Object instanceGet(Object ins, String nameProp) {
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


};
