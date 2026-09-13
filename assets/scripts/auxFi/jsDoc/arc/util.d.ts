/** arc.util.Log */
declare class Log {}


/** arc.util.Time */
declare class Time {
    static delta: number;
    static time: number;
    static globalTime: number;

    static run(delay: number, run: java.lang.Runnable): void
    static runTask(delay: number, run: java.lang.Runnable): void
    static mark(): void
    static elapsed(): number
}
/** arc.util.Interval */
declare class Interval {
    constructor()
    constructor(cap: number)

    get(time: number): boolean
    get(id: number, time: number): boolean
    check(id: number, time: number): boolean
    reset(id: number, time: number): void
    clear(): void
    getTime(id: number): number
    getTimes(id: number): Array<number>
}


/** arc.util.Disposable */
interface Disposable {}


/** arc.util.pooling.Pool */
declare class Pool<T> {
    obtain(): T
    getFree(): number
    free(obj: T): void
    freeAll(objSeq: Seq<T>): void
    clear(): void
}
declare namespace Pool {
    interface Poolable {}
}
/** arc.util.pooling.Pools */
declare class Pools {
    static get<T>(type: Class<T>, objF: Prov<T>, max?: number): Pool<T>
    static set<T>(type: Class<T>, pool: Pool<T>): void
    static obtain<T>(type: Class<T>, objF: Prov<T>): T
    static free(obj: Object): void
    static freeAll(objSeq: Seq<Object>, samePool?: boolean): void
}


/** arc.util.Tmp */
declare class Tmp {
    static p1: Point2;
    static p2: Point2;
    static p3: Point2;

    static v1: Vec2;
    static v2: Vec2;
    static v3: Vec2;
    static v4: Vec2;
    static v5: Vec2;
    static v6: Vec2;
    static t1: Vec2;

    static v31: Vec3;
    static v32: Vec3;
    static v33: Vec3;
    static v34: Vec3;

    static m1: Mat;
    static m2: Mat;
    static m3: Mat;
    static m4: Mat;

    static r1: Rect;
    static r2: Rect;
    static r3: Rect;

    static cr1: Circle;
    static cr2: Circle;
    static cr3: Circle;

    static c1: Color;
    static c2: Color;
    static c3: Color;
    static c4: Color;

    static tr1: TextureRegion;
    static tr2: TextureRegion;

    static bz2: Bezier<Vec2>;
    static bz3: Bezier<Vec3>;
}


/** arc.util.OS */
declare class OS {
    static readonly cores: number;
    static readonly username: string;
    static readonly userHome: string;
    static readonly osName: string;
    static readonly osVersion: string;
    static readonly osArch: string;
    static readonly osArchBits: string;
    static readonly javaVersion: string;
    static readonly javaVersionNumber: number;
    static isWindows: boolean;
    static isLinux: boolean;
    static isMac: boolean;
    static isIos: boolean;
    static isAndroid: boolean;
    static isARM: boolean;
    static is64Bit: boolean;
    static isMobile: boolean;
    static isDesktop: boolean;
}


/** arc.util.Reflect */
declare class Reflect {
    static newArray<T>(type: Class<T>, len: number): JavaArray<T>
    static cons<T>(type: Class<T>): Prov<T>
    // @ts-ignore
    static get(type: Class<Object>, name: string): *
    // @ts-ignore
    static get(type: Object, name: string): *
    // @ts-ignore
    static get(type: Class<Object>, ins: Object|null, name: string): *
    // @ts-ignore
    static set(ins: Object, name: string, val: Object): void
    // @ts-ignore
    static set(type: Class<Object>, name: string, val: Object): void
    // @ts-ignore
    static set(type: Class<Object>, ins: Object|null, name: string, val: Object): void
    static invoke(ins: Object|null, name: string, args: Array<Object>, ...argTypes: Array<Class<Object>>): any
    static invoke(type: Class<Object>, name: string, args: Array<Object>, ...argTypes: Array<Class<Object>>): any
    static invoke(ins: Object|null, name: string): any
    static invoke(type: Class<Object>, name: string): any
    static invoke(type: Class<Object>, ins: Object|null, name: string, args: Array<Object>, ...argTypes: Array<Class<Object>>): any
    static make(type: string): Object
}


/** arc.util.Strings */
declare class Strings {
    static readonly utf8: java.nio.charset.Charset;
    static readonly ascii: java.nio.charset.Charset;

    static sha256(str: string): Array<java.lang.Byte>
    static formatByteCount(bytes: number): string
    static bytesToHex(bytes: Array<java.lang.Byte>): string
    static encode(str: string): string
    static deflate(str: string): Array<java.lang.Byte>
    static undeflate(bytes: Array<java.lang.Byte>): string

    static getFileExtension(path: string): string
    static getFileName(path: string): string
    static getFileNameWithoutExtension(path: string): string
    static isSafeFilename(name: string): boolean
    static sanitizeFilename(name: string): string
    static sanitizeVersion(verStr: string): Array<number>|null
    static checkNewerSemver(verStr: string, verStrTarget: string): boolean

    static autoFixed(num: number, deciAmt: number): string
    static fixed(num: number, deciAmt: number): string
    static formatMillis(num: number): string

    static matches(str1: string, str2: string): boolean
    static count(str: StringGn, l: Letter): number
    static truncate(str: string, len: number, ellipsis?: string): string
    static stripColors(str: StringGn): string
    static stripGlyphs(str: StringGn): string
    static format(str: string, ...objs: Array<Object>): string
    static join(separator: string, ...strs: Array<string>): string
    static join(separator: string, iterable: Iterable<string>): string
    static levenshtein(str1: string, str2: string): number
    static biasedLevenshtein(str1: string, str2: string): number
    static animated(time: number, len: number, scl: number, str: string): string

    static parseInt(str: string, def?: number): number
    static parseInt(str: string, radix: number, def: number, start?: number, end?: number): number
    static parseLong(str: string, def: number): number
    static parseLong(str: string, radix: number, def: number): number
    static parseLong(str: string, radix: number, start: number, end: number, def: number): number
    static parseFloat(str: string, def?: number): number
    static parseDouble(str: string, def: number): number
    static parseColor(str: string, def?: Color): Color
    static parseColorOrNull(color: Color, str: string): Color|null

    static capitalize(str: string): string
    static kebabToCamel(str: string): string
    static camelToKebab(str: string): string
    static insertSpaces(str: string): string
    static camelize(str: string): string
}
/** arc.util.I18NBundle */
declare class I18NBundle {
    getLocale(): java.util.Locale
    has(key: string): boolean
    get(key: string, def?: string): string
    getOrNull(key: string): string
    getNotNull(key: string): string
    format(key: string, ...args: Array<Object>): string
    formatString(str: string, ...args: Array<Object>): string
    formatFloat(key: string, num: number, deciAmt: number): string
}


/** arc.util.Align */
declare class Align {
    static readonly center: number;
    static readonly top: number;
    static readonly bottom: number;
    static readonly left: number;
    static readonly right: number;
    static readonly topLeft: number;
    static readonly topRight: number;
    static readonly bottomLeft: number;
    static readonly bottomRight: number;
}


/** arc.util.noise.Ridged */
declare class Ridged {
    static noise2d(seed: number, x: number, y: number, freq: number): number
    static noise2d(seed: number, x: number, y: number, oct: number, freq: number): number
    static noise2d(seed: number, x: number, y: number, oct: number, persis: number, freq: number): number
    static noise3d(seed: number, x: number, y: number, z: number, freq: number): number
    static noise3d(seed: number, x: number, y: number, z: number, oct: number, freq: number): number
}
/** arc.util.noise.Simplex */
declare class Simplex {
    static noise2d(seed: number, oct: number, persis: number, scl: number, x: number, y: number): number
    static noise3d(seed: number, oct: number, persis: number, scl: number, x: number, y: number, z: number): number
    static noise4d(seed: number, oct: number, persis: number, scl: number, x: number, y: number, z: number, w: number): number
}
/** arc.util.noise.VoronoiNoise */
declare class VoronoiNoise {
    static valueNoise2D(x: number, z: number, seed: number): number
    static valueNoise3D(x: number, y: number, z: number, seed: number): number

    constructor(seed: number, useManhattan: boolean)

    isUseDistance(): boolean
    setUseDistance(bool: boolean): void
    getSeed(): number
    setSeed(seed: number): void

    noise(x: number, z: number, freq: number): number
    noise(x: number, y: number, z: number, freq: number): number
}


/** arc.util.io.Writes */
declare class Writes implements java.io.Closeable {
    output: java.io.DataOutput;

    constructor(output: java.io.DataOutput)

    i(int: java.lang.Integer): void
    b(byte: java.lang.Byte): void
    b(bytes: Array<java.lang.Byte>, off: number, len: number): void
    s(short: java.lang.Short): void
    l(long: java.lang.Long): void
    f(f: java.lang.Float): void
    d(double: java.lang.Double): void
    bool(bool: java.lang.Boolean): void
    str(str: java.lang.String): void
}
/** arc.util.io.Reads */
declare class Reads implements java.io.Closeable {
    input: java.io.DataInput;

    constructor(output: java.io.DataInput)

    i(): java.lang.Integer
    b(): java.lang.Byte
    b(len: number): Array<java.lang.Byte>
    b(bytes: Array<java.lang.Byte>, off: number, len: number): Array<java.lang.Byte>
    ub(): java.lang.Integer
    s(): java.lang.Short
    us(): java.lang.Integer
    l(): java.lang.Long
    f(): java.lang.Float
    d(): java.lang.Double
    bool(): java.lang.Boolean
    str(): java.lang.String
    str(maxLen: number): java.lang.String
    skip(amt: number): void
}


/** arc.util.serialization.Base64Coder */
declare class Base64Coder {
    static encodeString(str: string, urlSafe?: boolean): string
    static encodeLines(bytes: Array<java.lang.Byte>): string
    static encodeLines(bytes: Array<java.lang.Byte>, off: number, len: number, lineLen: number, lineSeparator: string, charMap: Base64Coder.CharMap): string
    static encode(bytes: Array<java.lang.Byte>, urlSafe?: boolean): Array<java.lang.Character>
    static encode(bytes: Array<java.lang.Byte>, charMap: Base64Coder.CharMap): Array<java.lang.Character>
    static encode(bytes: Array<java.lang.Byte>, charMap: Array<java.lang.Character>): Array<java.lang.Character>
    static encode(bytes: Array<java.lang.Byte>, len: number): Array<java.lang.Character>
    static encode(bytes: Array<java.lang.Byte>, off: number, len: number, charMap: Base64Coder.CharMap): Array<java.lang.Character>
    static encode(bytes: Array<java.lang.Byte>, off: number, len: number, charMap: Array<java.lang.Character>): Array<java.lang.Character>
    static decodeString(str: string, urlSafe?: boolean): string
    static decodeLines(str: string): Array<java.lang.Byte>
    static decodeLines(str: string, invCharMap: Base64Coder.CharMap): Array<java.lang.Byte>
    static decodeLines(str: string, invCharMap: Array<java.lang.Byte>): Array<java.lang.Byte>
    static decode(str: string): Array<java.lang.Byte>
    static decode(str: string, invCharMap: Base64Coder.CharMap): Array<java.lang.Byte>
    static decode(bytes: Array<java.lang.Byte>): Array<java.lang.Byte>
    static decode(bytes: Array<java.lang.Byte>, invCharMap: Base64Coder.CharMap): Array<java.lang.Byte>
    static decode(bytes: Array<java.lang.Byte>, invCharMap: Array<java.lang.Byte>): Array<java.lang.Byte>
    static decode(bytes: Array<java.lang.Byte>, off: number, len: number, invCharMap: Base64Coder.CharMap): Array<java.lang.Byte>
    static decode(bytes: Array<java.lang.Byte>, off: number, len: number, invCharMap: Array<java.lang.Byte>): Array<java.lang.Byte>
}
declare namespace Base64Coder {
    class CharMap {
        constructor(char63: java.lang.Character, char64: java.lang.Character)

        getEncodingMap(): Array<java.lang.Character>
        getDecodingMap(): Array<java.lang.Byte>
    }
}


/** arc.util.serialization.Json */
declare class Json {
    getIgnoreUnknownFields(): boolean
    setIgnoreUnknownFields(bool: boolean): void
    setIgnoreDeprecated(bool: boolean): void
    setReadDeprecated(bool: boolean): void
    setOutputType(type: JsonWriter.OutputType): void
    setQuoteLongValues(bool: boolean): void
    setEnumNames(bool: boolean): void
    setUsePrototypes(bool: boolean): void

    addClassTag(tag: string, type: Class<Object>): void
    getClass(tag: string): Class<Object>
    getTag(type: Class<T>): string
    setTypeName(name: string): void
    setElementType(type: Class<Object>, fieldName: string, elementType: Class<Object>): void

    setDefaultSerializer(serializer: Json.Serializer<Object>): void
    setSerializer<T>(type: Class<T>, serializer: Json.Serializer<T>): void
    getSerializer<T>(type: Class<T>): Json.Serializer<T>

    getWriter(): BaseJsonWriter
    setWriter(writer: BaseJsonWriter): void

    writeField(obj: Object, name: string, elementType?: Class<Object>): void
    writeField(obj: Object, fieldName: string, jsonName: string, elementType?: Class<Object>): void
    writeFields(obj: Object): void
    readField(obj: Object, name: string, jsonVal: JsonValue): void
    readField(obj: Object, name: string, elementType: Class<Object>, jsonVal: JsonValue): void
    readField(obj: Object, fieldName: string, jsonName: string, jsonVal: JsonValue): void
    readField(obj: Object, fieldName: string, jsonName: string, elementType: Class<Object>, jsonVal: JsonValue): void
    readField(obj: Object, field: java.lang.reflect.Field, jsonName: string, elementType: Class<Object>, jsonVal: JsonValue): void
    readFields(obj: Object, jsonVal: JsonValue): void
    writeValue(name: string, val: Object, knownType?: Class<Object>, elementType?: Class<Object>): void
    writeValue(val: Object, knownType?: Class<Object>, elementType?: Class<Object>): void
    readValue<T>(name: string, type: Class<T>, jsonVal: JsonValue): T|null
    readValue<T>(name: string, type: Class<T>, def: T, jsonVal: JsonValue): T|null
    readValue<T>(name: string, type: Class<T>, elementType: Class<Object>, jsonVal: JsonValue): T|null
    readValue<T>(name: string, type: Class<T>, elementType: Class<Object>, def: T, jsonVal: JsonValue): T|null
    readValue<T>(type: Class<T>, jsonVal: JsonValue): T|null
    readValue<T>(type: Class<T>, elementType: Class<Object>, jsonVal: JsonValue): T|null
    readValue<T>(type: Class<T>, elementType: Class<Object>, def: T, jsonVal: JsonValue): T|null
    readValue<T>(type: Class<T>, elementType: Class<Object>, jsonVal: JsonValue, keyType: Class<Object>): T|null
    toJson(obj: Object, knownType?: Class<Object>, elementType?: Class<Object>): string
    toJson(obj: Object, fi: Fi): void
    toJson(obj: Object, knownType: Class<Object>, fi: Fi): void
    toJson(obj: Object, knownType: Class<Object>, elementType: Class<Object>, fi: Fi): void
    toJson(obj: Object, writer: java.io.Writer): void
    toJson(obj: Object, knownType: Class<Object>, writer: java.io.Writer): void
    toJson(obj: Object, knownType: Class<Object>, elementType: Class<Object>, writer: java.io.Writer): void
    toUBJson(obj: Object, knownType: Class<Object>, stream: java.io.OutputStream): void
    fromJson<T>(type: Class<T>, reader: java.io.Reader): T
    fromJson<T>(type: Class<T>, elementType: Class<Object>, reader: java.io.Reader): T
    fromJson<T>(type: Class<T>, stream: java.io.InputStream): T
    fromJson<T>(type: Class<T>, elementType: Class<Object>, stream: java.io.InputStream): T
    fromJson<T>(type: Class<T>, fi: Fi): T
    fromJson<T>(type: Class<T>, elementType: Class<Object>, fi: Fi): T
    fromJson<T>(type: Class<T>, str: string): T
    fromJson<T>(type: Class<T>, elementType: Class<Object>, str: string): T
    fromJson<T>(type: Class<T>, data: Array<java.lang.Character>, off: number, offLen: number): T
    fromJson<T>(type: Class<T>, elementType: Class<Object>, data: Array<java.lang.Character>, off: number, offLen: number): T

    copyFields(obj_f: Object, obj_t: Object, setFinals?: boolean): void
}
declare namespace Json {
    interface Serializer<T> {}
    interface JsonSerializable {}
    class FieldMetaData {
        readonly field: java.lang.reflect.Field;
        elementType: java.lang.Class<Object>|null;
        keyType: java.lang.Class<Object>|null;
    }
}
/** arc.util.serialization.BaseJsonWriter */
interface BaseJsonWriter extends java.io.Closeable {}
/** arc.util.serialization.JsonWriter */
declare class JsonWriter extends java.io.Writer implements BaseJsonWriter {}
declare namespace JsonWriter {
    class OutputType {
        static json: OutputType;
        static javascript: OutputType;
        static minimal: OutputType;
    }
}
/** arc.util.serialization.BaseJsonReader */
interface BaseJsonReader {}
/** arc.util.serialization.JsonReader */
declare class JsonReader implements BaseJsonReader {
    parse(jsonStr: string): JsonValue
    parse(reader: java.io.Reader): JsonValue
    parse(stream: java.io.InputStream): JsonValue
    parse(fi: Fi): JsonValue
    parse(bytes: Array<java.lang.Byte>, off: number, len: number): JsonValue
}
/** arc.util.serialization.Jval */
declare class Jval {
    static readonly TRUE: Jval;
    static readonly FALSE: Jval;
    static readonly NULL: Jval;

    constructor(val: Object)

    static newArray(): Jval
    static newObject(): Jval
    static valueOf(num: number): Jval
    static valueOf(bool: boolean): Jval
    static valueOf(str: string): Jval

    static read(reader: java.io.Reader): Jval
    static read(bytes: Array<java.lang.Byte>): Jval
    static read(str: string): Jval
    writeTo(writer: java.io.Writer, format?: Jval.Jformat): void
    toString(): string
    toString(format: Jval.Jformat): string

    get(name: string): Jval
    getType(): Jval.Jtype
    add(val: Jval): void
    add(num: number): void
    add(bool: boolean): void
    add(str: string): void
    add(name: string, str: string): void
    add(name: string, val: Jval): void
    put(name: string, val: Jval): this
    put(name: string, num: number): this
    put(name: string, bool: boolean): this
    put(name: string, str: string): this
    remove(name: string): Jval
    has(name: string): boolean
    isNumber(): boolean
    isBoolean(): boolean
    isTrue(): boolean
    isFalse(): boolean
    isString(): boolean
    isArray(): boolean
    isObject(): boolean
    isNull(): boolean
    asInt(): java.lang.Integer
    asByte(): java.lang.Byte
    asShort(): java.lang.Short
    asLong(): java.lang.Long
    asFloat(): java.lang.Float
    asDouble(): java.lang.Double
    asBool(): java.lang.Boolean
    asString(): java.lang.String
    asArray(): Jval.JsonArray
    asObject(): Jval.JsonMap
    getInt(name: string, def: java.lang.Integer): java.lang.Integer
    getLong(name: string, def: java.lang.Long): java.lang.Long
    getFloat(name: string, def: java.lang.Float): java.lang.Float
    getDouble(name: string, def: java.lang.Double): java.lang.Double
    getBool(name: string, def: java.lang.Boolean): java.lang.Boolean
    getString(name: string): java.lang.String|null
    getString(name: string, def: java.lang.String|null): java.lang.String|null
}
declare namespace Jval {
    class JsonMap extends ArrayMap<string, Jval> {}
    class JsonArray extends Seq<Jval> {}
    class Jformat {
        static plain: Jformat;
        static minimal: Jformat;
        static formatted: Jformat;
        static hjson: Jformat;
    }
    class Jtype {
        static string: Jtype;
        static number: Jtype;
        static object: Jtype;
        static array: Jtype;
        static bool: Jtype;
        static nil: Jtype;
    }
}
/** arc.util.serialization.JsonValue */
declare class JsonValue {
    name: string|null;
    child: JsonValue|null;
    next: JsonValue|null;
    prev: JsonValue|null;
    parent: JsonValue|null;
    size: number;

    type(): JsonValue.ValueType
    setType(type: JsonValue.ValueType): void
    //name(): string
    setName(name: string): void
    //parent(): JsonValue|null
    //child(): JsonValue|null
    addChild(jsonVal: JsonValue): void
    addChild(name: string, jsonVal: JsonValue): void
    //next(): JsonValue|null
    setNext(jsonVal: JsonValue): void
    //prev(): JsonValue|null
    setPrev(jsonVal: JsonValue): void

    get(ind: number): JsonValue|null
    get(name: string): JsonValue|null
    set(long: java.lang.Long, strVal: string): void
    set(double: java.lang.Double, strVal: string): void
    set(str: string): void
    set(bool: boolean): void
    has(name: string): boolean
    require(ind: number): JsonValue
    require(name: string): JsonValue
    remove(ind: number): JsonValue
    remove(name: string): JsonValue
    hasChild(name: string): boolean
    getChild(name: string): JsonValue|null

    isNumber(): boolean
    isLong(): boolean
    isDouble(): boolean
    isBoolean(): boolean
    isString(): boolean
    isArray(): boolean
    isObject(): boolean
    isNull(): boolean
    isValue(): boolean

    asInt(): java.lang.Integer
    asByte(): java.lang.Byte
    asShort(): java.lang.Short
    asLong(): java.lang.Long
    asFloat(): java.lang.Float
    asDouble(): java.lang.Double
    asBoolean(): java.lang.Boolean
    asChar(): java.lang.Character
    asString(): java.lang.String
    asIntArray(): JavaArray<java.lang.Integer>
    asByteArray(): JavaArray<java.lang.Byte>
    asShortArray(): JavaArray<java.lang.Short>
    asLongArray(): JavaArray<java.lang.Long>
    asFloatArray(): JavaArray<java.lang.Float>
    asDoubleArray(): JavaArray<java.lang.Double>
    asBooleanArray(): JavaArray<java.lang.Boolean>
    asCharArray(): JavaArray<java.lang.Character>
    asStringArray(): JavaArray<java.lang.String>

    getInt(name: string, def?: number): java.lang.Integer
    getByte(name: string, def?: number): java.lang.Byte
    getShort(name: string, def?: number): java.lang.Short
    getLong(name: string, def?: number): java.lang.Long
    getFloat(name: string, def?: number): java.lang.Float
    getDouble(name: string, def?: number): java.lang.Double
    getBoolean(name: string, def?: string): java.lang.Boolean
    getChar(name: string, def?: string): java.lang.Character
    getString(name: string, def?: string): java.lang.String

    toJson(type: JsonWriter.OutputType): string
}
declare namespace JsonValue {
    class ValueType {
        static object: ValueType;
        static array: ValueType;
        static stringValue: ValueType;
        static doubleValue: ValueType;
        static longValue: ValueType;
        static booleanValue: ValueType;
        static nullValue: ValueType;
    }
}


/** arc.util.Http */
declare class Http {
    static request(method: Http.HttpMethod, url: string): Http.HttpRequest
    static get(url: string): Http.HttpRequest
    static get(url: string, callback: ConsT<Http.HttpResponse, java.lang.Exception>, errCallback?: Cons<java.lang.Throwable>): void
    static post(url: string, content?: string): Http.HttpRequest
    static post(url: string, callback: ConsT<Http.HttpResponse, java.lang.Exception>, errCallback?: Cons<java.lang.Throwable>): void
}
declare namespace Http {
    class HttpResponse {
        getContentLength(): number
        getResult(): Array<java.lang.Byte>
        getResultAsString(): string
        getResultAsStream(): java.io.InputStream
        getStatus(): HttpStatus
        getHeader(name: string): string
        getHeaders(): ObjectMap<string, Seq<string>>
    }
    class HttpRequest {
        method: HttpMethod;
        url: string;
        headers: ObjectMap<string, string>;
        timeout: number;
        content: string;
        contentStream: java.io.InputStream;
        followRedirects: boolean;
        includeCredentials: boolean;
        errorHandler: Cons<java.lang.Throwable>;

        error(cons: Cons<java.lang.Throwable>): this
        //method(method: HttpMethod): this
        //url(url: string): this
        //timeout(timeout: number): this
        redirects(bool: boolean): this
        credentials(bool: boolean): this
        header(name: string, val: string): this
        //content(content: string): this
        //content(stream: java.io.InputStream): this
        submit(callback: ConsT<HttpResponse, java.lang.Exception>): void
        block(callback: ConsT<HttpResponse, java.lang.Exception>): void
    }
    class HttpMethod {
        static GET: HttpMethod;
        static POST: HttpMethod;
        static PUT: HttpMethod;
        static DELETE: HttpMethod;
        static HEAD: HttpMethod;
        static CONNECT: HttpMethod;
        static OPTIONS: HttpMethod;
        static TRACE: HttpMethod;
    }
    class HttpStatus {
        static UNKNOWN_STATUS: HttpStatus;

        static CONTINUE: HttpStatus;
        static SWITCHING_PROTOCOLS: HttpStatus;
        static PROCESSING: HttpStatus;
        static EARLY_HINTS: HttpStatus;

        static OK: HttpStatus;
        static CREATED: HttpStatus;
        static ACCEPTED: HttpStatus;
        static NON_AUTHORITATIVE_INFORMATION: HttpStatus;
        static NO_CONTENT: HttpStatus;
        static RESET_CONTENT: HttpStatus;
        static PARTIAL_CONTENT: HttpStatus;
        static MULTI_STATUS: HttpStatus;
        static ALREADY_REPORTED: HttpStatus;
        static IM_USED: HttpStatus;

        static MULTIPLE_CHOICES: HttpStatus;
        static MOVED_PERMANENTLY: HttpStatus;
        static MOVED_TEMPORARILY: HttpStatus;
        static SEE_OTHER: HttpStatus;
        static NOT_MODIFIED: HttpStatus;
        static USE_PROXY: HttpStatus;
        static SWITCH_PROXY: HttpStatus;
        static TEMPORARY_REDIRECT: HttpStatus;
        static PERMANENT_REDIRECT: HttpStatus;

        static BAD_REQUEST: HttpStatus;
        static UNAUTHORIZED: HttpStatus;
        static PAYMENT_REQUIRED: HttpStatus;
        static FORBIDDEN: HttpStatus;
        static NOT_FOUND: HttpStatus;
        static METHOD_NOT_ALLOWED: HttpStatus;
        static NOT_ACCEPTABLE: HttpStatus;
        static PROXY_AUTHENTICATION_REQUIRED: HttpStatus;
        static REQUEST_TIMEOUT: HttpStatus;
        static CONFLICT: HttpStatus;
        static GONE: HttpStatus;
        static LENGTH_REQUIRED: HttpStatus;
        static PRECONDITION_FAILED: HttpStatus;
        static REQUEST_TOO_LONG: HttpStatus;
        static UNSUPPORTED_MEDIA_TYPE: HttpStatus;
        static REQUESTED_RANGE_NOT_SATISFIABLE: HttpStatus;
        static EXPECTATION_FAILED: HttpStatus;
        static IM_A_TEAPOT: HttpStatus;
        static INSUFFICIENT_SPACE_ON_RESOURCE: HttpStatus;
        static METHOD_FAILURE: HttpStatus;
        static MISDIRECTED_REQUEST: HttpStatus;
        static UNPROCESSABLE_ENTITY: HttpStatus;
        static LOCKED: HttpStatus;
        static FAILED_DEPENDENCY: HttpStatus;
        static TOO_EARLY: HttpStatus;
        static UPGRADE_REQUIRED: HttpStatus;
        static PRECONDITION_REQUIRED: HttpStatus;
        static TOO_MANY_REQUESTS: HttpStatus;
        static REQUEST_HEADER_FIELDS_TOO_LARGE: HttpStatus;
        static UNAVAILABLE_FOR_LEGAL_REASONS: HttpStatus;

        static INTERNAL_SERVER_ERROR: HttpStatus;
        static NOT_IMPLEMENTED: HttpStatus;
        static BAD_GATEWAY: HttpStatus;
        static SERVICE_UNAVAILABLE: HttpStatus;
        static GATEWAY_TIMEOUT: HttpStatus;
        static HTTP_VERSION_NOT_SUPPORTED: HttpStatus;
        static VARIANT_ALSO_NEGOTIATES: HttpStatus;
        static INSUFFICIENT_STORAGE: HttpStatus;
        static LOOP_DETECTED: HttpStatus;
        static NOT_EXTENDED: HttpStatus;
        static NETWORK_AUTHENTICATION_REQUIRED: HttpStatus;
    }
}
