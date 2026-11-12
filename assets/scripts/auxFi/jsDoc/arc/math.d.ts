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
interface Position {
    getX(): number
    getY(): number
    angleTo(oposIns: Position): number
    angleTo(x: number, y: number): number
    dst(oposIns: Position): number
    dst(x: number, y: number): number
    dst2(oposIns: Position): number
    dst2(x: number, y: number): number
    within(oposIns: Position, dst: number): number
    within(x: number, y: number, dst: number): number
}
/** arc.math.geom.Vector */
interface Vector<T extends Vector<T>> {
    cpy(): T

    len(): number
    len2(): number
    limit(limit: number): T
    limit2(limit2: number): T
    setLength(len: number): T
    setLength2(len2: number): T
    setZero(): T
    clamp(min: number, max: number): T
    set(vec: T): T
    add(vec: T): T
    plus(vec: T): T
    sub(vec: T): T
    minus(vec: T): T
    scl(scl: number): T
    scl(vec: T): T
    unaryMinus(): T
    dot(vec: T): T
    times(vec: T): T
    div(vec: T): T
    nor(): T
    mulAdd(vec: T, scl: number): T
    mulAdd(vec: T, mulVec: T): T
    //dst(vec: T): number
    //dst2(vec: T): number
    lerp(vec: T, a: number): T
    interpolate(vec: T, a: number, interp: Interp): T
    setToRandomDirection(): T
    isUnit(): boolean
    isUnit(margin: number): boolean
    isZero(): boolean
    isZero(margin: number): boolean
    epsilonEquals(vec: T, epsilon: number): boolean
    isOnLine(vec: T, epsilon?: number): boolean
    isCollinear(vec: T, epsilon?: number): boolean
    isCollinearOpposite(vec: T, epsilon?: number): boolean
    isPerpendicular(vec: T, epsilon?: number): boolean
    hasSameDirection(vec: T): boolean
    hasOppositeDirection(vec: T): boolean
}
/** arc.math.Vec2 */
declare class Vec2 implements Vector<Vec2>, Position {
    x: number;
    y: number;
}
interface Vec2 extends Vector<Vec2>, Position {}
/** arc.math.Vec3 */
declare class Vec3 implements Vector<Vec3>, Position {
    x: number;
    y: number;
    z: number;
}
interface Vec3 extends Vector<Vec3>, Position {}


/** arc.math.Mat */
declare class Mat {}
/** arc.math.Mat3D */
declare class Mat3D {}
/** arc.math.Affine2 */
declare class Affine2 {}


/** arc.math.geom.Shape2D */
interface Shape2D {}
/** arc.math.geom.Rect */
declare class Rect implements Shape2D {}
interface Rect extends Shape2D {}
/** arc.math.geom.Circle */
declare class Circle implements Shape2D {}
interface Circle extends Shape2D {}
/** arc.math.geom.Ellipse */
declare class Ellipse implements Shape2D {}
interface Ellipse extends Shape2D {}
/** arc.math.geom.Polyline */
declare class Polyline implements Shape2D {}
interface Polyline extends Shape2D {}
/** arc.math.geom.Polygon */
declare class Polygon implements Shape2D {}
interface Polygon extends Shape2D {}


/** arc.math.geom.Plane */
declare class Plane {}
/** arc.math.geom.Sphere */
declare class Sphere {}
/** arc.math.geom.Icosphere */
declare class Icosphere {}
/** arc.math.geom.Quat */
declare class Quat {}
/** arc.math.geom.Ray */
declare class Ray {}


/** arc.math.geom.Geometry */
declare class Geometry {
    static readonly d4: Array<Point2>;
    static readonly d4c: Array<Point2>;
    static readonly d4x: Array<java.lang.Integer>;
    static readonly d4y: Array<java.lang.Integer>;
    static readonly d8: Array<Point2>;
    static readonly d8edge: Array<Point2>;

    static circle(tx: number, ty: number, r: number, cons: Intc2): void
    static circle(tx: number, ty: number, w: number, h: number, r: number, cons: Intc2): void
    static pixelCircle(ind: number, checker?: Geometry.SolidChecker): Array<Vec2>
    static regPoly(amt: number, size: number): JavaArray<java.lang.Float>

    static iterateLine(start: number, x1: number, y1: number, x2: number, y2: number, segW: number, cons: Floatc2): number
    static iteratePolygon(cons: Floatc2, verts: Array<java.lang.Float>): void
    static iteratePolySegments(verts: Array<java.lang.Float>, cons: Floatc4): void

    static findClosest<T extends Position>(x: number, y: number, objs: Array<T>): T
    static findClosest<T extends Position>(x: number, y: number, iterable: Iterable<T>, filter?: Boolf<T>): T
    static findFurthest<T extends Position>(x: number, y: number, iterable: Iterable<T>, filter?: Boolf<T>): T

    static raycast(tx1: number, ty1: number, tx2: number, ty2: number, caster: Geometry.Raycaster): boolean
    static raycastRect(x1: number, y1: number, x2: number, y2: number, rect: Rect): Vec2
    static raycastRect(x1: number, y1: number, x2: number, y2: number, offX: number, offY: number, halfX: number, halfY: number): Vec2
    static overlap(rect1: Rect, rect2: Rect, isX: boolean): Vec2

    static lowestPositiveRoot(a: number, b: number, c: number): number
    static colinear(x1: number, y1: number, x2: number, y2: number): boolean
    static triangleCentroid(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, out: Vec2): Vec2
    static triangleCircumcenter(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, out: Vec2): Vec2
    static triangleCircumradius(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): number
    static triangleQuality(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): number
    static triangleArea(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): number
    static quadrilateralCentroid(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, out: Vec2): Vec2
    static polygonCentroid(verts: Array<java.lang.Float>, off: java.lang.Integer, count: java.lang.Integer, out: Vec2): Vec2
    static polygonArea(verts: Array<java.lang.Float>, off: java.lang.Integer, count: java.lang.Integer): number
    static ensureCCW(verts: Array<java.lang.Float>): void
    static ensureCCW(verts: Array<java.lang.Float>, off: java.lang.Integer, count: java.lang.Integer): void
    static isClockwise(verts: Array<java.lang.Float>, off: java.lang.Integer, count: java.lang.Integer): boolean
    static toBarycoord(p: Vec2, a: Vec2, b: Vec2, c: Vec2, out: Vec2): Vec2
    static barycoordInsideTriangle(barycoord: Vec2): boolean
    static fromBarycoord(barycoord: Vec2, a: Vec2, b: Vec2, c: Vec2, out: Vec2): Vec2
    static fromBarycoord(barycoord: Vec2, a: number, b: number, c: number): number
    static vectorsToFloats(vecSeq: Seq<Vec2>): FloatSeq
}
declare namespace Geometry {
    interface Raycaster {
        accept(tx: number, ty: number): boolean
    }
    interface SolidChecker {
        solid(ind: number, tx: number, ty: number): boolean
    }
}


/** arc.math.geom.Spring1D */
declare class Spring1D {}
/** arc.math.geom.Spring2D */
declare class Spring2D {}


/** arc.math.geom.Path */
interface Path<T> {
    valueAt(out: T, a: number): T
    derivativeAt(out: T, a: number): T
    approximate(val: T): number
    locate(val: T): number
    approxLength(sampleAmt: number): number
}
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
}
interface Bezier<T extends Vector<T>> extends Path<T> {}


/** arc.math.geom.QuadTree */
declare class QuadTree<T extends QuadTree.QuadTreeObject> {
    bounds: Rect;
    objects: Seq<T>;
    botLeft: QuadTree<T>;
    botRight: QuadTree<T>;
    topLeft: QuadTree<T>;
    topRight: QuadTree<T>;
    leaf: boolean;
    totalObjects: number;

    constructor(bounds: Rect)

    insert(obj: T): void
    fill(objSeq: Seq<T>): void
    remove(obj: T): boolean
    clear(): void

    getObjects(out: Seq<T>): void
    intersect(x: number, y: number, w: number, h: number, cons: _Cons<T>): void
    intersect(x: number, y: number, w: number, h: number, boolf: _Boolf<T>): void
    intersect(rect: Rect, cons: Cons<T>): void
    intersect(x: number, y: number, w: number, h: number, out: Seq<T>): void
    intersect(rect: Rect, out: Seq<T>): void
    find(x: number, y: number, w: number, h: number, boolf: Boolf<T>): T
    any(x: number, y: number, w: number, h: number): boolean
}
declare namespace QuadTree {
    interface QuadTreeObject {
        hitbox(out: Rect): void
    }
}
/** arc.math.geom.IntQuadTree */
declare class IntQuadTree {}
