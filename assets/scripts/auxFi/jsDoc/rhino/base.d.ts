declare class JavaAdapter {}


declare namespace rhino {
    /** rhino.Context */
    class Context {}

    /** rhino.Scriptable */
    interface Scriptable {}
    /** rhino.ScriptableObject */
    class ScriptableObject implements Scriptable {}
    interface ScriptableObject extends Scriptable {}
    /** rhino.IdFunctionCall */
    interface IdFunctionCall {}
    /** rhino.IdScriptableObject */
    class IdScriptableObject extends ScriptableObject implements IdFunctionCall {}
    interface IdScriptableObject extends IdFunctionCall {}
    /** rhino.Callable */
    interface Callable {}

    /** rhino.NativeArray */
    class _NativeArray extends IdScriptableObject {}
    type NativeArray = _NativeArray|Array<Object>
    /** rhino.NativeObject */
    class _NativeObject extends IdScriptableObject {}
    type NativeObject = _NativeObject|Object
    /** rhino.Function */
    interface Function extends Scriptable, Callable {}
}
