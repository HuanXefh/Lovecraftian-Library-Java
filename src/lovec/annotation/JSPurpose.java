package lovec.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * This field or method is deliberately designed for JavaScript purposes, and is not wrapped in any JS methods.
 * <br> Not used when the whole class is for JavaScript.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.METHOD})
public @interface JSPurpose {

}
