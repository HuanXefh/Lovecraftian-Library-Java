/** lovec.utils.extend.SLCNativeArray */
declare class SLCNativeArray {
    static checkTupChange(tup: Array<Object>, ...eles: Array<Object>): boolean
}


/** lovec.utils.extend.SLCNativeObject */
declare class SLCNativeObject {
    static numIncre(obj: Object, key: string, num?: number): number
    static numSum(obj: Object, mapF?: Floatf2<string, number>|null): number
    static numMax(obj: Object, mapF?: Floatf2<string, number>|null): number
    static numMin(obj: Object, mapF?: Floatf2<string, number>|null): number
    static numSomeLargerThan(obj1: Object, obj2: Object, equal: boolean): boolean
    static numSomeLargerThan(obj: Object, num: number, equal: boolean): boolean
    static numSomeLargerThan(obj: Object, valF: _Floatf2<string, number>, equal: boolean): boolean
    static numSomeSmallerThan(obj1: Object, obj2: Object, equal: boolean): boolean
    static numSomeSmallerThan(obj: Object, num: number, equal: boolean): boolean
    static numSomeSmallerThan(obj: Object, valF: _Floatf2<string, number>, equal: boolean): boolean
    static numAllLargerThan(obj1: Object, obj2: Object, equal: boolean): boolean
    static numAllLargerThan(obj: Object, num: number, equal: boolean): boolean
    static numAllLargerThan(obj: Object, valF: _Floatf2<string, number>, equal: boolean): boolean
    static numAllSmallerThan(obj1: Object, obj2: Object, equal: boolean): boolean
    static numAllSmallerThan(obj: Object, num: number, equal: boolean): boolean
    static numAllSmallerThan(obj: Object, valF: _Floatf2<string, number>, equal: boolean): boolean
}
