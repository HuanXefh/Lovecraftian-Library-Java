type Class<T> = new (...args: Array<Object>) => T


type unset = null|undefined
type Arguments = Array<Object>|IArguments
type ArgumentType = string|Function|null


type Plural<T> = T|Array<T>
type Dynamic<T> = T|(() => T)
type Tup1<T> = Array<T>
type Tup2<T1, T2> = Array<T1, T2>
type Tup3<T1, T2, T3> = Array<T1, T2, T3>
type Tup4<T1, T2, T3, T4> = Array<T1, T2, T3, T4>
type Tup5<T1, T2, T3, T4, T5> = Array<T1, T2, T3, T4, T5>
type Tup6<T1, T2, T3, T4, T5, T6> = Array<T1, T2, T3, T4, T5, T6>
type Tup7<T1, T2, T3, T4, T5, T6, T7> = Array<T1, T2, T3, T4, T5, T6, T7>
type Tup8<T1, T2, T3, T4, T5, T6, T7, T8> = Array<T1, T2, T3, T4, T5, T6, T7, T8>
type Tup9<T1, T2, T3, T4, T5, T6, T7, T8, T9> = Array<T1, T2, T3, T4, T5, T6, T7, T8, T9>
type Tup10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> = Array<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>
type C0Function = () => void
type CFunction<P> = (param1: P) => void
type C2Function<P1, P2> = (param1: P1, param2: P2) => void
type C3Function<P1, P2, P3> = (param1: P1, param2: P2, param3: P3) => void
type C4Function<P1, P2, P3, P4> = (param1: P1, param2: P2, param3: P3, param4: P4) => void
type C5Function<P1, P2, P3, P4, P5> = (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5) => void
type C6Function<P1, P2, P3, P4, P5, P6> = (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5, param6: P6) => void
type C7Function<P1, P2, P3, P4, P5, P6, P7> = (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5, param6: P6, param7: P7) => void
type C8Function<P1, P2, P3, P4, P5, P6, P7, P8> = (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5, param6: P6, param7: P7, param8: P8) => void
type C9Function<P1, P2, P3, P4, P5, P6, P7, P8, P9> = (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5, param6: P6, param7: P7, param8: P8, param9: P9) => void
type C10Function<P1, P2, P3, P4, P5, P6, P7, P8, P9, P10> = (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5, param6: P6, param7: P7, param8: P8, param9: P9, param10: P10) => void
type F0Function<R> = () => R
type FFunction<P, R> = (param: P) => R
type F2Function<P1, P2, R> = (param1: P1, param2: P2) => R
type F3Function<P1, P2, P3, R> = (param1: P1, param2: P2, param3: P3) => R
type F4Function<P1, P2, P3, P4, R> = (param1: P1, param2: P2, param3: P3, param4: P4) => R
type F5Function<P1, P2, P3, P4, P5, R> = (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5) => R
type F6Function<P1, P2, P3, P4, P5, P6, R> = (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5, param6: P6) => R
type F7Function<P1, P2, P3, P4, P5, P6, P7, R> = (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5, param6: P6, param7: P7) => R
type F8Function<P1, P2, P3, P4, P5, P6, P7, P8, R> = (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5, param6: P6, param7: P7, param8: P8) => R
type F9Function<P1, P2, P3, P4, P5, P6, P7, P8, P9, R> = (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5, param6: P6, param7: P7, param8: P8, param9: P9) => R
type F10Function<P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, R> = (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5, param6: P6, param7: P7, param8: P8, param9: P9, param10: P10) => R


type JSONObjectField = number|string|boolean|unset|Array<number|string|boolean|unset>
type JSONObject = Record<string, JSONObjectField>
type JSONString = string
