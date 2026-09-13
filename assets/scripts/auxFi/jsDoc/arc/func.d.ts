import Throwable = java.lang.Throwable;

/** arc.func.Boolc */
interface _Boolc {
    get(b: boolean): void
}
type Boolc = _Boolc|CFunction<boolean>
/** arc.func.Boolf */
interface _Boolf<P> {
    get(param: P): boolean
}
type Boolf<P> = _Boolf<P>|FFunction<P, boolean>
/** arc.func.Boolf2 */
interface _Boolf2<P1, P2> {
    get(param1: P1, param2: P2): boolean
}
type Boolf2<P1, P2> = _Boolf2<P1, P2>|F2Function<P1, P2, boolean>
/** arc.func.Boolf3 */
interface _Boolf3<P1, P2, P3> {
    get(param1: P1, param2: P2, param3: P3): boolean
}
type Boolf3<P1, P2, P3> = _Boolf3<P1, P2, P3>|F3Function<P1, P2, P3, boolean>
/** arc.func.Boolfp */
interface _Boolp {
    get(): boolean
}
type Boolp = _Boolp|F0Function<boolean>


/** arc.func.Cons */
interface _Cons<P> {
    get(param: P): void
}
type Cons<P> = _Cons<P>|CFunction<P>
/** arc.func.Cons2 */
interface _Cons2<P1, P2> {
    get(param1: P1, param2: P2): void
}
type Cons2<P1, P2> = _Cons2<P1, P2>|C2Function<P1, P2>
/** arc.func.Cons3 */
interface _Cons3<P1, P2, P3> {
    get(param1: P1, param2: P2, param3: P3): void
}
type Cons3<P1, P2, P3> = _Cons3<P1, P2, P3>|C3Function<P1, P2, P3>
/** arc.func.Cons4 */
interface _Cons4<P1, P2, P3, P4> {
    get(param1: P1, param2: P2, param3: P3, param4: P4): void
}
type Cons4<P1, P2, P3, P4> = _Cons4<P1, P2, P3, P4>|C4Function<P1, P2, P3, P4>
/** arc.func.ConsT */
interface _ConsT<P, E extends java.lang.Throwable> {
    get(param: P): void
}
type ConsT<P, E extends Throwable> = _ConsT<P, E>|C2Function<P, E>


/** arc.func.Floatc */
interface _Floatc {
    get(f: number): void
}
type Floatc = _Floatc|CFunction<number>
/** arc.func.Floatc2 */
interface _Floatc2 {
    get(f1: number, f2: number): void
}
type Floatc2 = _Floatc2|C2Function<number, number>
/** arc.func.Floatc4 */
interface _Floatc4 {
    get(f1: number, f2: number, f3: number, f4: number): void
}
type Floatc4 = _Floatc4|C4Function<number, number, number, number>
/** arc.func.Floatf */
interface _Floatf<P> {
    get(param: P): number
}
type Floatf<P> = _Floatf<P>|FFunction<P, number>
/** arc.func.FloatFloatf */
interface _FloatFloatf {
    get(f: number): number
}
type FloatFloatf = _FloatFloatf|FFunction<number, number>
/** arc.func.Floatp */
interface _Floatp {
    get(): number
}
type Floatp = _Floatp|F0Function<number>


/** arc.func.Func */
interface _Func<P, R> {
    get(param: P): R
}
type Func<P, R> = _Func<P, R>|FFunction<P, R>
/** arc.func.Func2 */
interface _Func2<P1, P2, R> {
    get(param1: P1, param2: P2): R
}
type Func2<P1, P2, R> = _Func2<P1, P2, R>|F2Function<P1, P2, R>
/** arc.func.Func3 */
interface _Func3<P1, P2, P3, R> {
    get(param1: P1, param2: P2, param3: P3): R
}
type Func3<P1, P2, P3, R> = _Func3<P1, P2, P3, R>|F3Function<P1, P2, P3, R>


/** arc.func.Intc */
interface _Intc {
    get(int: number): void
}
type Intc = _Intc|CFunction<number>
/** arc.func.Intc2 */
interface _Intc2 {
    get(int1: number, int2: number): void
}
type Intc2 = _Intc2|C2Function<number, number>
/** arc.func.Intc4 */
interface _Intc4 {
    get(int1: number, int2: number, int3: number, int4: number): void
}
type Intc4 = _Intc4|C4Function<number, number, number, number>
/** arc.func.Intf */
interface _Intf<P> {
    get(param: P): number
}
type Intf<P> = _Intf<P>|FFunction<P, number>
/** arc.func.IntIntf */
interface _IntIntf {
    get(int: number): number
}
type IntIntf = _IntIntf|FFunction<number, number>
/** arc.func.Intp */
interface _Intp {
    get(): number
}
type Intp = _Intp|F0Function<number>


/** arc.func.Longf */
interface _Longf<P> {
    get(param: P): number
}
type Longf<P> = _Longf<P>|FFunction<P, number>


/** arc.func.Prov */
interface _Prov<R> {
    get(): R
}
type Prov<R> = _Prov<R>|F0Function<R>
