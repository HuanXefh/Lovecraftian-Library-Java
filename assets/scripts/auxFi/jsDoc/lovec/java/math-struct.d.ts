/** lovec.math.struct.MathMeanArray */
declare class MathMeanArray {
    constructor(cap: number)

    getMean(): number
    getData(): Array<number>

    push(num: number): number
    clear(): this
}


/** lovec.math.struct.MathMatrix */
declare class MathMatrix implements Iterable<java.lang.Double> {}
interface MathMatrix extends Iterable<java.lang.Double> {}


/** lovec.math.struct.MathGraph */
declare class MathGraph implements Iterable<java.lang.Integer> {}
interface MathGraph extends Iterable<java.lang.Integer> {}
