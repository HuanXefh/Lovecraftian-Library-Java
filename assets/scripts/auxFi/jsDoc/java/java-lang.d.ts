declare namespace java {
    namespace lang {
        /** java.lang.Integer */
        class _Integer {}
        type Integer = _Integer|number
        /** java.lang.Byte */
        class _Byte {}
        type Byte = _Byte|number
        /** java.lang.Short */
        class _Short {}
        type Short = _Short|number
        /** java.lang.Long */
        class _Long {}
        type Long = _Long|number


        /** java.lang.Float */
        class _Float {}
        type Float = _Float|number
        /** java.lang.Double */
        class _Double {}
        type Double = _Double|number


        /** java.lang.Boolean */
        class _Boolean {}
        type Boolean = _Boolean|number


        /** java.lang.Character */
        class _Character {}
        type Character = _Character|string
        /** java.lang.CharSequence */
        interface CharSequence {}


        /** java.lang.String */
        class _String implements java.io.Serializable, CharSequence, Comparable<_String> {}
        interface _String extends java.io.Serializable, CharSequence, Comparable<_String> {}
        type String = _String|string
        /** java.lang.StringBuilder */
        class StringBuilder implements java.io.Serializable, CharSequence, java.io.Appendable {}
        interface StringBuilder extends java.io.Serializable, CharSequence, java.io.Appendable {}


        /** java.lang.Object */
        class Object {}


        /** java.lang.Class */
        class Class<T> implements java.io.Serializable, java.lang.reflect.GenericDeclaration, java.lang.reflect.Type, java.lang.reflect.AnnotatedElement {}
        interface Class<T> extends java.io.Serializable, java.lang.reflect.GenericDeclaration, java.lang.reflect.Type, java.lang.reflect.AnnotatedElement {}


        /** java.lang.Package */
        class Package implements java.lang.reflect.AnnotatedElement {}
        interface Package extends java.lang.reflect.AnnotatedElement {}


        /** java.lang.Throwable */
        class _Throwable implements java.io.Serializable {}
        interface _Throwable extends java.io.Serializable {}
        type Throwable = _Throwable|Error
        /** java.lang.Error */
        class _Error extends _Throwable {}
        /** java.lang.Exception */
        class Exception extends _Throwable {}


        /** java.lang.ClassLoader */
        class ClassLoader {}


        /** java.lang.Runnable */
        interface _Runnable {
            run(): void
        }
        type Runnable = _Runnable|C0Function


        /** java.lang.Thread */
        interface _Thread extends java.lang._Runnable {}
        type Thread = _Thread|C0Function


        /** java.lang.Comparable */
        interface Comparable<T> {
            compareTo(obj: T): Integer
        }
        /** java.lang.Cloneable */
        interface Cloneable {}
        /** java.lang.Readable */
        interface Readable {
            read(cb: java.nio.CharBuffer): Integer
        }




        namespace reflect {
            /** java.lang.reflect.Array */
            class Array {
                static newInstance<T>(type: Class<T>, len: number): JavaArray<T>
            }


            /** java.lang.reflect.AnnotatedElement */
            interface AnnotatedElement {}
            /** java.lang.reflect.GenericDeclaration */
            interface GenericDeclaration extends AnnotatedElement {}
            /** java.lang.reflect.Member */
            interface Member {}
            /** java.lang.reflect.Type */
            interface Type {}
            /** java.lang.reflect.WildcardType */
            interface WildcardType extends Type {}
            /** java.lang.reflect.ParameterizedType */
            interface ParameterizedType extends Type {}
            /** java.lang.reflect.GenericArrayType */
            interface GenericArrayType extends Type {}
            /** java.lang.reflect.TypeVariable */
            interface TypeVariable<D extends GenericDeclaration> extends Type, AnnotatedElement {}


            /** java.lang.reflect.AccessibleObject */
            class AccessibleObject implements AnnotatedElement {}
            interface AccessibleObject extends AnnotatedElement {}
            /** java.lang.reflect.Field */
            class Field extends AccessibleObject implements Member {}
            interface Field extends Member {}
            /** java.lang.reflect.Executable */
            class Executable extends AccessibleObject implements Member, GenericDeclaration {}
            interface Executable extends Member, GenericDeclaration {}
            /** java.lang.reflect.Constructor */
            class Constructor<T> extends Executable {}
            /** java.lang.reflect.Method */
            class Method extends Executable {}
            /** java.lang.reflect.Parameter */
            class Parameter implements AnnotatedElement {}
            interface Parameter extends AnnotatedElement {}
        }
    }
}


declare class _JavaArray<T> {}
type JavaArray<T> = _JavaArray<T>|Array<T>


type JavaClass<T> = java.lang.Class<T>|Class<T>
