package lovec.utils;

import arc.util.Reflect;

public class LCJavaScript {


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


    /**
     * Invokes a Java method created with Rhino JavaAdapter.
     */
    public static Object invoke(Object ins, String nameFun, Object... args) throws IllegalArgumentException {
        if(args.length > objClss.length) throw new IllegalArgumentException("Argument length out of bound: " + args.length + ">" + objClss.length);
        return Reflect.invoke(ins, nameFun, args, objClss[args.length]);
    };


};
