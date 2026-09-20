/** lovec.math.LCLerp */
declare class LCLerp {
    static calcParamFrac(param: number, param_f: number, param_t: number): number
    static lerp(val_f: number, val_t: number, param: number): number
    static lerp(val_f: number, val_t: number, param: number, param_f: number, param_t: number): number
    static sLerp(val_f: number, val_t: number, param: number): number
    static sLerp(val_f: number, val_t: number, param: number, param_f: number, param_t: number): number
    static biLerp(val1_f: number, val1_t: number, val2_f: number, val2_t: number, param1: number, param2: number, a: number): number
    static biLerp(val1_f: number, val1_t: number, val2_f: number, val2_t: number, param1: number, param2: number, a: number, param1_f: number, param1_t: number, param2_f: number, param2_t: number): number
    static sBiLerp(val1_f: number, val1_t: number, val2_f: number, val2_t: number, param1: number, param2: number, a: number): number
    static sBiLerp(val1_f: number, val1_t: number, val2_f: number, val2_t: number, param1: number, param2: number, a: number, param1_f: number, param1_t: number, param2_f: number, param2_t: number): number
    static applyInterp(val_f: number, val_t: number, param: number): number
    static applyInterp(val_f: number, val_t: number, param: number, param_f: number, param_t: number): number
    static applyInterp(val_f: number, val_t: number, param: number, interp: Interp): number
    static applyInterp(val_f: number, val_t: number, param: number, interp: Interp, param_f: number, param_t: number): number
}


/** lovec.math.LCMathFunc */
declare class LCMathFunc {
    static factorial(x: number): number
    static permutation(n: number, x: number): number
    static combination(n: number, x: number): number
    static gcd(a: number, b: number): number
    static lcm(a: number, b: number): number
    static gamma(x: number): number
    static beta(a: number, b: number): number

    static dampCos(x: number, mag: number, decay: number, omega: number, phi?: number): number

    static gaussian(x: number, mu: number, sigma: number): number
    static chiSquare(x: number, f: number): number

    static derivative(x: number, func: DoubleDoublef, delta?: number): number
    static derivativePrecise(x: number, func: DoubleDoublef, delta?: number): number
    static integral(base: number, cap: number, func: DoubleDoublef, segAmt?: number): number
    static integralPrecise(base: number, cap: number, func: DoubleDoublef, segAmt?: number): number
}


/** lovec.math.LCProbability */
declare class LCProbability {
    static generateDistribution(size: number, numF: Doublep): JavaArray<java.lang.Double>
    static randomDistribution(size: number, base: number, cap: number, seed?: number): JavaArray<java.lang.Double>
    static normalDistribution(size: number, mu: number, sigma: number): JavaArray<java.lang.Double>
}


/** lovec.math.LCRaycast */
declare class LCRaycast {
    static rayCheck(x1: number, y1: number, x2: number, y2: number, boolF: Boolf2<java.lang.Integer, java.lang.Integer>): boolean
    static rayFind<T>(x1: number, y1: number, x2: number, y2: number, func: Func2<java.lang.Integer, java.lang.Integer, T>): T|null
    static rayFindAll<T>(x1: number, y1: number, x2: number, y2: number, func: Func2<java.lang.Integer, java.lang.Integer, T>): Seq<T>
}


/** lovec.math.LCStatistics */
declare class LCStatistics {
    static mean(xs: Array<number>): number
    static difference(contArr: Array<Object>|null, xs: Array<number>, ys: Array<number>): Array<number>
    static differenceMean(xs: Array<number>, ys: Array<number>): number
    static standardDeviation(xs: Array<number>, mean?: number): number
    static variance(xs: Array<number>): number
    static variance(xs: Array<number>, notSample: boolean): number
    static variance(xs: Array<number>, mean: number): number
    static variance(xs: Array<number>, mean: number, notSample: boolean): number
    static covariance(xs: Array<number>, ys: Array<number>): number
    static covariance(xs: Array<number>, ys: Array<number>, notSample: boolean): number
    static covariance(xs: Array<number>, ys: Array<number>, meanX: number, meanY: number): number
    static covariance(xs: Array<number>, ys: Array<number>, meanX: number, meanY: number, notSample: boolean): number
    static differenceVariance(xs: Array<number>, ys: Array<number>, notSample?: boolean): number
    static zScore(contArr: Array<Object>|null, xs: Array<number>): Array<number>
    static zScore(x: number, mean: number, stdDev: number): number

    static performLinearRegression(xs: Array<number>, ys: Array<number>): void
    static linearRegressionSlope(): number
    static linearRegressionIntercept(): number
}
