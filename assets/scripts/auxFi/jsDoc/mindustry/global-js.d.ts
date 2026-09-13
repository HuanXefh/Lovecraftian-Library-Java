declare function log(context: string, arg: Object): void
declare function print(arg: Object): void
declare function run(fun: () => void): java.lang._Runnable
declare function boolf<P>(fun: (arg: P) => boolean): _Boolf<P>
declare function boolp(fun: () => boolean): _Boolp
declare function floatf<P>(fun: (arg: P) => number): _Floatf<P>
declare function floatp(fun: () => number): _Floatp
declare function cons<P>(fun: (arg: P) => void): _Cons<P>
declare function prov<R>(fun: () => R): _Prov<R>
declare function func<P, R>(fun: (arg: P) => R): _Func<P, R>


declare function extend<T>(type: Class<T>, ...args: Array<Object>): T
