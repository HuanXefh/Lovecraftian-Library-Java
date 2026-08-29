package lovec.content;

import arc.Events;
import lovec.utils.LCScript;
import mindustry.game.EventType;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.InvocationTargetException;

public abstract class ContentUpdater<T> {


    protected T target;


    public ContentUpdater(T target) throws NoSuchFieldException, IllegalAccessException {
        this.target = target;
        init();
        Events.on(EventType.ClientLoadEvent.class, ev -> {
            try {
                clientLoadInit();
            } catch (Exception e) {
                throw new RuntimeException(e);
            };
        });
    };


    /**
     * Called right after <code>target</code> is set.
     * <br> <code>LATER</code>.
     */
    protected void init() throws NoSuchFieldException, IllegalAccessException {

    };


    /**
     * Called on client load.
     * <br> <code>LATER</code>.
     */
    protected void clientLoadInit() throws NoSuchFieldException, IllegalAccessException {

    };


    /**
     * Called to update some parameters.
     * <br> <code>LATER</code>.
     */
    protected void resolve() throws NoSuchFieldException, IllegalAccessException {

    };


    /**
     * Whether a property exists in the delegee.
     */
    protected boolean has(Object ins, String name) throws NoSuchFieldException, IllegalAccessException {
        return LCScript.instanceHas(ins, name);
    };
    // Overload
    protected boolean has(String name) throws NoSuchFieldException, IllegalAccessException {
        return has(target, name);
    };


    /**
     * Gets a property in the delegee.
     */
    protected Object get(Object ins, String name) throws NoSuchFieldException, IllegalAccessException {
        return LCScript.instanceGet(ins, name);
    };
    // Overload
    protected Object get(String name) throws NoSuchFieldException, IllegalAccessException {
        return get(target, name);
    };


    /**
     * Sets a property in the delegee.
     */
    protected void set(Object ins, String name, Object val) throws NoSuchFieldException, IllegalAccessException {
        LCScript.instanceSet(ins, name, val);
    };
    // Overload
    protected void set(String name, Object val) throws NoSuchFieldException, IllegalAccessException {
        set(target, name, val);
    };


    /**
     * Calls a method.
     */
    protected Object invoke(Object ins, String name, Object... args) throws InvocationTargetException, NoSuchMethodException, IllegalAccessException {
        return LCScript.instanceInvoke(ins, name, args);
    };
    // Overload
    protected Object invoke(String name, Object... args) throws InvocationTargetException, NoSuchMethodException, IllegalAccessException {
        return invoke(target, name, args);
    };


    /**
     * This method has a content template version.
     */
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.METHOD)
    public @interface FragMethod {

        String superMode() default "none";
        String boolMode() default "none";

    };


};
