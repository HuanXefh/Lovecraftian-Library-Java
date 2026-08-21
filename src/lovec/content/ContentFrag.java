package lovec.content;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Utility class to contain methods used in content templates (defined in JavaScript).
 * @param <T> Type of <code>this</code>.
 * @param <C> Type of the content frag class.
 */
public abstract class ContentFrag<T, C extends ContentFrag<T, C>> {


    protected T lastThis;
    protected T lastResolvedThis;


    /**
     * Call this method in frag methods to access <code>this</code>.
     */
    public T getThis() {
        return lastThis;
    };


    /**
     * Sets <code>this</code> value used in frag methods.
     */
    public C setThis(T thisVal) {
        lastThis = thisVal;
        return (C) this;
    };


    /**
     * Resolves temporary values.
     */
    public void resolve() {
        if(!canResolve()) return;
        lastResolvedThis = lastThis;
        onResolved();
    };


    /**
     * Whether temporary values should be resolved.
     */
    public boolean canResolve() {
        return lastResolvedThis != lastThis;
    };


    /**
     * Override this method to resolve temporary values.
     * <br> <code>LATER</code>
     */
    public void onResolved() {

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
