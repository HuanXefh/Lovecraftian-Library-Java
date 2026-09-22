/** `ROW`: namePropNew, namePropOld, def. */
type TemplateAliasArray = F3Array<string, string, Object>
type TemplateParser = (valOld: Object) => Object
/** `ROW`: nameProp, tempParser. */
type TemplateParserArray = F2Array<string, TemplateParser>


type TemplateFunctionResultMerger = (valPrev: Object, val: Object) => Object
interface TemplateFunction {
    (...args: Array<Object>): any;

    /** If true, `this.super$xxx` will be skipped. */
    nosuper?: boolean;
    /** If true, `this.super$xxx` will be inserted. Used only in post-build modification. */
    addSuper?: boolean;
    /** If true, previous methods will be ignored. */
    override?: boolean;
    /** If true, this method becomes fixed and won't mix with methods defined later. */
    final?: boolean;
    /** For boolean operation with the previous method. <br> `VALS`: "none", "and", "or". */
    boolMode?: string;
    /** `boolMode` for `this.super$xxx`. */
    superBoolMode?: string;
    /** Handles mixing of returned values. <br> `VALS`: "object", "array", merger function. */
    mergeMode?: string|TemplateFunctionResultMerger;
    /** Argument length of the final Java method. Required if there's any argument. */
    argLen?: number;

    /**
     * Previous method before mixing. Do not set.
     * @internal
     */
    funPrev?: Function;
    /**
     * Current method before mixing. Do not set.
     * @internal
     */
    funCur?: Function;
}


/** Object used to build {@link ExtendObject}. Contains properties defined by the template. */
type ExtendParamObject = {
    /** Overwrites template tags. */
    tempTags?: Array<string>;
    /** Overwrites Java fields. Note that values can be overwritten by JSON files later. */
    metaObj?: ExtendMetaObject;
}
/** Object used to build {@link ExtendObject}. Contains properties defined by the parent Java class. */
type ExtendMetaObject = Object
/** Object used in `extend`. */
type ExtendObject = Object


/**
 * For template param object.
 * Objects like arrays and maps should be wrapped in a provider function.
 * Otherwise, weird bugs can happen.
 * For example, blocks created with the same template using the same array.
 */
type TDynamic<T> = T|TemplateFunc<ExtendObject, T>|TemplateProv<T>


/**
 * Mixed type for contents created with template.
 * <br> `P` - Parent class.
 * <br> `T` - Content template.
 */
type TemplateInstance<P, T> = P&T&{
    readonly factory: rhino.ContextFactory;
    readonly delegee: T;
    readonly self: P&T;
}
