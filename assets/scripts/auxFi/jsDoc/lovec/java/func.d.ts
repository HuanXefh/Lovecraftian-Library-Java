/** lovec.utils.func.Boolf4 */
interface _Boolf4<P1, P2, P3, P4> {
    get(param1: P1, param2: P2, param3: P3, param4: P4): boolean
}
type Boolf4<P1, P2, P3, P4> = _Boolf4<P1, P2, P3, P4>|F4Function<P1, P2, P3, P4, boolean>
/** lovec.utils.func.Boolf5 */
interface _Boolf5<P1, P2, P3, P4, P5> {
    get(param1: P1, param2: P2, param3: P3, param4: P4, param5: P5): boolean
}
type Boolf5<P1, P2, P3, P4, P5> = _Boolf5<P1, P2, P3, P4, P5>|F5Function<P1, P2, P3, P4, P5, boolean>
/** lovec.utils.func.Boolf6 */
interface _Boolf6<P1, P2, P3, P4, P5, P6> {
    get(param1: P1, param2: P2, param3: P3, param4: P4, param5: P5, param6: P6): boolean
}
type Boolf6<P1, P2, P3, P4, P5, P6> = _Boolf6<P1, P2, P3, P4, P5, P6>|F6Function<P1, P2, P3, P4, P5, P6, boolean>


/** lovec.utils.func.Intf2 */
interface _Intf2<P1, P2> {
    get(param1: P1, param2: P2): number
}
type Intf2<P1, P2> = _Intf2<P1, P2>|F2Function<P1, P2, number>
/** lovec.utils.func.Intf3 */
interface _Intf3<P1, P2, P3> {
    get(param1: P1, param2: P2, param3: P3): number
}
type Intf3<P1, P2, P3> = _Intf3<P1, P2, P3>|F3Function<P1, P2, P3, number>
/** lovec.utils.func.Intf4 */
interface _Intf4<P1, P2, P3, P4> {
    get(param1: P1, param2: P2, param3: P3, param4: P4): number
}
type Intf4<P1, P2, P3, P4> = _Intf4<P1, P2, P3, P4>|F4Function<P1, P2, P3, P4, number>
/** lovec.utils.func.Intf5 */
interface _Intf5<P1, P2, P3, P4, P5> {
    get(param1: P1, param2: P2, param3: P3, param4: P4, param5: P5): number
}
type Intf5<P1, P2, P3, P4, P5> = _Intf5<P1, P2, P3, P4, P5>|F5Function<P1, P2, P3, P4, P5, number>
/** lovec.utils.func.Intf6 */
interface _Intf6<P1, P2, P3, P4, P5, P6> {
    get(param1: P1, param2: P2, param3: P3, param4: P4, param5: P5, param6: P6): number
}
type Intf6<P1, P2, P3, P4, P5, P6> = _Intf6<P1, P2, P3, P4, P5, P6>|F6Function<P1, P2, P3, P4, P5, P6, number>


/** lovec.utils.func.Floatf2 */
interface _Floatf2<P1, P2> {
    get(param1: P1, param2: P2): number
}
type Floatf2<P1, P2> = _Floatf2<P1, P2>|F2Function<P1, P2, number>
/** lovec.utils.func.Floatf3 */
interface _Floatf3<P1, P2, P3> {
    get(param1: P1, param2: P2, param3: P3): number
}
type Floatf3<P1, P2, P3> = _Floatf3<P1, P2, P3>|F3Function<P1, P2, P3, number>
/** lovec.utils.func.Floatf4 */
interface _Floatf4<P1, P2, P3, P4> {
    get(param1: P1, param2: P2, param3: P3, param4: P4): number
}
type Floatf4<P1, P2, P3, P4> = _Floatf4<P1, P2, P3, P4>|F4Function<P1, P2, P3, P4, number>
/** lovec.utils.func.Floatf5 */
interface _Floatf5<P1, P2, P3, P4, P5> {
    get(param1: P1, param2: P2, param3: P3, param4: P4, param5: P5): number
}
type Floatf5<P1, P2, P3, P4, P5> = _Floatf5<P1, P2, P3, P4, P5>|F5Function<P1, P2, P3, P4, P5, number>
/** lovec.utils.func.Floatf6 */
interface _Floatf6<P1, P2, P3, P4, P5, P6> {
    get(param1: P1, param2: P2, param3: P3, param4: P4, param5: P5, param6: P6): number
}
type Floatf6<P1, P2, P3, P4, P5, P6> = _Floatf6<P1, P2, P3, P4, P5, P6>|F6Function<P1, P2, P3, P4, P5, P6, number>


/** lovec.utils.func.DoubleDoublef */
interface _DoubleDoublef {
    get(param: number): number
}
type DoubleDoublef = _DoubleDoublef|FFunction<number, number>


/** lovec.utils.func.Doublep */
interface _Doublep {
    get(): number
}
type Doublep = _Doublep|F0Function<number>


/** lovec.utils.func.Cons5 */
interface _Cons5<P1, P2, P3, P4, P5> {
    get(param1: P1, param2: P2, param3: P3, param4: P4, param5: P5): void
}
type Cons5<P1, P2, P3, P4, P5> = _Cons5<P1, P2, P3, P4, P5>|C5Function<P1, P2, P3, P4, P5>
/** lovec.utils.func.Cons6 */
interface _Cons6<P1, P2, P3, P4, P5, P6> {
    get(param1: P1, param2: P2, param3: P3, param4: P4, param5: P5, param6: P6): void
}
type Cons6<P1, P2, P3, P4, P5, P6> = _Cons6<P1, P2, P3, P4, P5, P6>|C6Function<P1, P2, P3, P4, P5, P6>


/** lovec.utils.func.Func4 */
interface _Func4<P1, P2, P3, P4, R> {
    get(param1: P1, param2: P2, param3: P3, param4: P4): R
}
type Func4<P1, P2, P3, P4, R> = _Func4<P1, P2, P3, P4, R>|F4Function<P1, P2, P3, P4, R>
/** lovec.utils.func.Func5 */
interface _Func5<P1, P2, P3, P4, P5, R> {
    get(param1: P1, param2: P2, param3: P3, param4: P4, param5: P5): R
}
type Func5<P1, P2, P3, P4, P5, R> = _Func5<P1, P2, P3, P4, P5, R>|F5Function<P1, P2, P3, P4, P5, R>
/** lovec.utils.func.Func6 */
interface _Func6<P1, P2, P3, P4, P5, P6, R> {
    get(param1: P1, param2: P2, param3: P3, param4: P4, param5: P5, param6: P6): R
}
type Func6<P1, P2, P3, P4, P5, P6, R> = _Func6<P1, P2, P3, P4, P5, P6, R>|F6Function<P1, P2, P3, P4, P5, P6, R>


/** lovec.utils.func.TemplateFunc */
interface TemplateFunc<P, R> {
    get(param: P): R
}
/** lovec.utils.func.TemplateProv */
interface TemplateProv<R> {
    get(): R
}
