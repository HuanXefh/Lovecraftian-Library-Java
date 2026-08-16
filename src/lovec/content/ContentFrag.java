package lovec.content;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Utility class to contain methods used in content templates (defined in JavaScript).
 * @param <T> Type of <code>this</code>.
 */
public abstract class ContentFrag<T> {


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
    public ContentFrag setThis(T thisVal) {
        lastThis = thisVal;
        return this;
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


    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.METHOD)
    public @interface FragMethod {};


};
