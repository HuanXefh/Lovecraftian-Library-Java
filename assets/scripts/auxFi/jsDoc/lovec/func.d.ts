declare function boolf2<P1, P2>(fun: (param1: P1, param2: P2) => boolean): Boolf2<P1, P2>
declare function boolf3<P1, P2, P3>(fun: (param1: P1, param2: P2, param3: P3) => boolean): Boolf3<P1, P2, P3>
declare function boolf4<P1, P2, P3, P4>(fun: (param1: P1, param2: P2, param3: P3, param4: P4) => boolean): Boolf4<P1, P2, P3, P4>
declare function boolf5<P1, P2, P3, P4, P5>(fun: (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5) => boolean): Boolf5<P1, P2, P3, P4, P5>
declare function boolf6<P1, P2, P3, P4, P5, P6>(fun: (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5, param6: P6) => boolean): Boolf6<P1, P2, P3, P4, P5, P6>


declare function integerf<P>(fun: (param: P) => number): Intf<P>
declare function integerf2<P1, P2>(fun: (param1: P1, param2: P2) => number): Intf2<P1, P2>
declare function integerf3<P1, P2, P3>(fun: (param1: P1, param2: P2, param3: P3) => number): Intf3<P1, P2, P3>
declare function integerf4<P1, P2, P3, P4>(fun: (param1: P1, param2: P2, param3: P3, param4: P4) => number): Intf4<P1, P2, P3, P4>
declare function integerf5<P1, P2, P3, P4, P5>(fun: (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5) => number): Intf5<P1, P2, P3, P4, P5>
declare function integerf6<P1, P2, P3, P4, P5, P6>(fun: (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5, param6: P6) => number): Intf6<P1, P2, P3, P4, P5, P6>


declare function floatf2<P1, P2>(fun: (param1: P1, param2: P2) => number): Floatf2<P1, P2>
declare function floatf3<P1, P2, P3>(fun: (param1: P1, param2: P2, param3: P3) => number): Floatf3<P1, P2, P3>
declare function floatf4<P1, P2, P3, P4>(fun: (param1: P1, param2: P2, param3: P3, param4: P4) => number): Floatf4<P1, P2, P3, P4>
declare function floatf5<P1, P2, P3, P4, P5>(fun: (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5) => number): Floatf5<P1, P2, P3, P4, P5>
declare function floatf6<P1, P2, P3, P4, P5, P6>(fun: (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5, param6: P6) => number): Floatf6<P1, P2, P3, P4, P5, P6>


declare function cons2<P1, P2>(fun: (param1: P1, param2: P2) => void): Cons2<P1, P2>
declare function cons3<P1, P2, P3>(fun: (param1: P1, param2: P2, param3: P3) => void): Cons3<P1, P2, P3>
declare function cons4<P1, P2, P3, P4>(fun: (param1: P1, param2: P2, param3: P3, param4: P4) => void): Cons4<P1, P2, P3, P4>
declare function cons5<P1, P2, P3, P4, P5>(fun: (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5) => void): Cons5<P1, P2, P3, P4, P5>
declare function cons6<P1, P2, P3, P4, P5, P6>(fun: (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5, param6: P6) => void): Cons6<P1, P2, P3, P4, P5, P6>


declare function func2<P1, P2, R>(fun: (param1: P1, param2: P2) => R): Func2<P1, P2, R>
declare function func3<P1, P2, P3, R>(fun: (param1: P1, param2: P2, param3: P3) => R): Func3<P1, P2, P3, R>
declare function func4<P1, P2, P3, P4, R>(fun: (param1: P1, param2: P2, param3: P3, param4: P4) => R): Func4<P1, P2, P3, P4, R>
declare function func5<P1, P2, P3, P4, P5, R>(fun: (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5) => R): Func5<P1, P2, P3, P4, P5, R>
declare function func6<P1, P2, P3, P4, P5, P6, R>(fun: (param1: P1, param2: P2, param3: P3, param4: P4, param5: P5, param6: P6) => R): Func6<P1, P2, P3, P4, P5, P6, R>


declare function tprov<T>(fun: () => T): TemplateProv<T>
declare function tfunc<T>(fun: (obj: ExtendObject) => T): TemplateFunc<ExtendObject, T>
