/** lovec.math.struct.LCMeanArray */
declare class LCMeanArray {
    constructor(cap: number)

    getMean(): number
    getData(): Array<number>

    push(num: number): number
    clear(): this
}


/** lovec.math.struct.LCMatrix */
declare class LCMatrix implements Iterable<java.lang.Double> {}
interface LCMatrix extends Iterable<java.lang.Double> {}


/** lovec.math.struct.LCGraph */
declare class LCGraph implements Iterable<java.lang.Integer> {}
interface LCGraph extends Iterable<java.lang.Integer> {}
