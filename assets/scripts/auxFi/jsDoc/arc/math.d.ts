/** arc.math.Scaled */
interface Scaled {}


/** arc.math.Mathf */
declare class Mathf {}


/** arc.math.Angles */
declare class Angles {}


/** arc.math.Rand */
declare class Rand {}


/** arc.math.Interp */
interface Interp {
    apply(a: number): number

    linear: Interp;
    reverse: Interp;
    smooth: Interp;
    smooth2: Interp;
    smoother: Interp;
    fade: Interp;

    one: Interp;
    zero: Interp;
    slope: Interp;

    pow2: Interp;
    pow2In: Interp;
    slowFast: Interp;
    pow2Out: Interp;
    fastSlow: Interp;
    pow2InInverse: Interp;
    pow2OutInverse: Interp;
    pow3: Interp;
    pow3In: Interp;
    pow3Out: Interp;
    pow3InInverse: Interp;
    pow3OutInverse: Interp;
    pow4: Interp;
    pow4In: Interp;
    pow4Out: Interp;
    pow5: Interp;
    pow5In: Interp;
    pow5Out: Interp;
    pow10: Interp;
    pow10In: Interp;
    pow10Out: Interp;

    sine: Interp;
    sineIn: Interp;
    sineOut: Interp;
    exp5: Interp;
    exp5In: Interp;
    exp5Out: Interp;
    exp10: Interp;
    exp10In: Interp;
    exp10Out: Interp;
    circle: Interp;
    circleIn: Interp;
    circleOut: Interp;
    elastic: Interp;
    elasticIn: Interp;
    elasticOut: Interp;
    swing: Interp;
    swingIn: Interp;
    swingOut: Interp;
    bounce: Interp;
    bounceIn: Interp;
    bounceOut: Interp;
}


/** arc.math.LinearRegression */
declare class LinearRegression {}


/** arc.math.WindowedMean */
declare class WindowedMean {}


/** arc.math.FloatCounter */
declare class FloatCounter {}


/** arc.math.geom.Point2 */
declare class Point2 {
    x: number;
    y: number;
}
/** arc.math.geom.Point3 */
declare class Point3 {
    x: number;
    y: number;
    z: number;
}
/** arc.math.geom.Position */
interface Position {}
/** arc.math.geom.Vector */
interface Vector<T extends Vector<T>> {}
/** arc.math.Vec2 */
declare class Vec2 implements Vector<Vec2>, Position {
    x: number;
    y: number;
}
/** arc.math.Vec3 */
declare class Vec3 implements Vector<Vec3>, Position {
    x: number;
    y: number;
    z: number;
}


/** arc.math.Mat */
declare class Mat {}
/** arc.math.Affine2 */
declare class Affine2 {}


/** arc.math.geom.Shape2D */
interface Shape2D {}
/** arc.math.geom.Rect */
declare class Rect implements Shape2D {}
/** arc.math.geom.Circle */
declare class Circle implements Shape2D {}
/** arc.math.geom.Ellipse */
declare class Ellipse implements Shape2D {}
/** arc.math.geom.Polyline */
declare class Polyline implements Shape2D {}
/** arc.math.geom.Polygon */
declare class Polygon implements Shape2D {}


/** arc.math.geom.Geometry */
declare class Geometry {}


/** arc.math.geom.Spring1D */
declare class Spring1D {}
/** arc.math.geom.Spring2D */
declare class Spring2D {}


/** arc.math.geom.Path */
interface Path<T> {}
/** arc.math.geom.Bezier */
declare class Bezier<T extends Vector<T>> implements Path<T> {
    static linear<T extends Vector<T>>(out: T, a: number, start: T, end: T, tmp: T): T
    static linearDerivative<T extends Vector<T>>(out: T, a: number, start: T, end: T, tmp: T): T
    static quadratic<T extends Vector<T>>(out: T, a: number, start: T, mid: T, end: T, tmp: T): T
    static quadraticDerivative<T extends Vector<T>>(out: T, a: number, start: T, mid: T, end: T, tmp: T): T
    static cubic<T extends Vector<T>>(out: T, a: number, start: T, mid1: T, mid2: T, end: T, tmp: T): T
    static cubicDerivative<T extends Vector<T>>(out: T, a: number, start: T, mid1: T, mid2: T, end: T, tmp: T): T

    set(...pons: Array<T>): this
    set(pons: Array<T>, off?: number, len?:number): this
    set(ponSeq: Seq<T>, off?: number, len?: number): this
    valueAt(out: T, a: number): T
    derivativeAt(out: T, a: number): T
    approxLength(sampleAmt: number): number
}


/** arc.math.geom.QuadTree */
declare class QuadTree<T extends QuadTree.QuadTreeObject> {}
declare namespace QuadTree {
    interface QuadTreeObject {}
}
/** arc.math.geom.IntQuadTree */
declare class IntQuadTree {}
