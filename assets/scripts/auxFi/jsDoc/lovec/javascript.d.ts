type Class<T> = new (...args: Array<Object>) => T


type unset = null|undefined
type Arguments = Array<Object>|IArguments
type ArgumentType = string|Function|null


type Plural<T> = T|Array<T>
type Dynamic<T> = T|(() => T)
type C0Function = () => void
type CFunction<P> = (param1: P) => void
type C2Function<P1, P2> = (param1: P1, param2: P2) => void
type C3Function<P1, P2, P3> = (param1: P1, param2: P2, param3: P3) => void
type C4Function<P1, P2, P3, P4> = (param1: P1, param2: P2, param3: P3, param4: P4) => void
type C5Function<P1, P2, P3, P4, P5> = (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5) => void
type C6Function<P1, P2, P3, P4, P5, P6> = (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5, param6: P6) => void
type F0Function<R> = () => R
type FFunction<P, R> = (param: P) => R
type F2Function<P1, P2, R> = (param1: P1, param2: P2) => R
type F3Function<P1, P2, P3, R> = (param1: P1, param2: P2, param3: P3) => R
type F4Function<P1, P2, P3, P4, R> = (param1: P1, param2: P2, param3: P3, param4: P4) => R
type F5Function<P1, P2, P3, P4, P5, R> = (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5) => R
type F6Function<P1, P2, P3, P4, P5, P6, R> = (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5, param6: P6) => R


type JSONObjectField = number|string|boolean|unset|Array<number|string|boolean|unset>
type JSONObject = Record<string, JSONObjectField>
type JSONString = string
