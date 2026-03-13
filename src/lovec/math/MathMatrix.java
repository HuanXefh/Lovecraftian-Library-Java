package lovec.math;

import arc.func.Boolf;
import arc.func.Cons;
import arc.func.Func2;
import arc.math.Mathf;
import arc.math.geom.Vec2;
import arc.math.geom.Vec3;
import arc.util.Log;
import arc.util.Nullable;

public class MathMatrix {


    protected static final StringBuilder strBuilder = new StringBuilder();


    protected double[][] data;
    protected final int rowAmt;
    protected final int colAmt;


    public MathMatrix(int m, int n) {
        this.rowAmt = m;
        this.colAmt = n;
        this.data = new double[m][n];
    };
    // Overloading
    public MathMatrix(int n) {
        this(n, n);
    };


    public MathMatrix(double[][] matArr) {
        this.rowAmt = matArr.length;
        this.colAmt = matArr[0].length;
        this.data = matArr;
    };


    /*
      ========================================
      Section: Definition (Static)
      ========================================
    */


    /* <-------------------- modification --------------------> */


    /**
     * Gets an n-unit matrix.
     */
    public static MathMatrix getUnitMat(int n, double def) {
        return new MathMatrix(n).setEach((i, j) -> i == j ? def : 0);
    };
    // Overloading
    public static MathMatrix getUnitMat(int n) {
        return getUnitMat(n, 1);
    };


    /**
     * Gets a 2D-rotation matrix.
     */
    public static MathMatrix getRotMat2d(float ang) {
        double[][] matArr = {
            {Mathf.cosDeg(ang), -Mathf.sinDeg(ang)},
            {Mathf.sinDeg(ang), Mathf.cosDeg(ang)}
        };
        return new MathMatrix(matArr);
    };


    /**
     * Gets a 3D-rotation matrix.
     */
    public static MathMatrix getRotMat3d(float angZ, float angY, float angX) {
        double[][] matArr = {
            {Mathf.cosDeg(angZ) * Mathf.cosDeg(angY), Mathf.cosDeg(angZ) * Mathf.sinDeg(angY) * Mathf.sinDeg(angX) - Mathf.sinDeg(angZ) * Mathf.cosDeg(angX), Mathf.cosDeg(angZ) * Mathf.sinDeg(angY) * Mathf.cosDeg(angX) + Mathf.sinDeg(angZ) * Mathf.sinDeg(angX)},
            {Mathf.sinDeg(angZ) * Mathf.cosDeg(angY), Mathf.sinDeg(angZ) * Mathf.sinDeg(angY) * Mathf.sinDeg(angX) + Mathf.cosDeg(angZ) * Mathf.cosDeg(angX), Mathf.sinDeg(angZ) * Mathf.sinDeg(angY) * Mathf.cosDeg(angX) - Mathf.cosDeg(angZ) * Mathf.sinDeg(angX)},
            {-Mathf.sinDeg(angY), Mathf.cosDeg(angY) * Mathf.sinDeg(angX), Mathf.cosDeg(angY) * Mathf.cosDeg(angX)}
        };
        return new MathMatrix(matArr);
    };


    /*
      ========================================
      Section: Definition (Instance)
      ========================================
    */


    /* <-------------------- property --------------------> */


    /**
     * Gets the element at (x, y).
     */
    public double get(int x, int y) {
        return data[y][x];
    };


    /**
     * Gets amount of rows in this matrix.
     */
    public int getRowAmt() {
        return rowAmt;
    };


    /**
     * Gets amount of columns in this matrix.
     */
    public int getColAmt() {
        return colAmt;
    };


    /**
     * Gets dimension of this matrix.
     */
    public int getDimension() {
        return Math.max(rowAmt, colAmt);
    };


    /* <-------------------- condition --------------------> */


    /**
     * Whether this is a square matrix.
     */
    public boolean isSquare() {
        return rowAmt == colAmt;
    };


    /**
     * Whether the two matrices are of the same size.
     */
    public boolean isSameSizeWith(MathMatrix mat) {
        return isSameSizeWith(mat.data);
    };
    // Overloading
    public boolean isSameSizeWith(double[][] matArr) {
        return rowAmt == matArr.length && colAmt == matArr[0].length;
    };


    /**
     * Whether this matrix can multiply with `mat`.
     */
    public boolean canMultiply(MathMatrix mat) {
        return canMultiply(mat.data);
    };
    // Overloading
    public boolean canMultiply(double[][] matArr) {
        return colAmt == matArr.length;
    };


    /* <-------------------- iteration --------------------> */


    /**
     * Iterates through elements in this matrix (row by row and left to right).
     */
    public void each(Boolf filter, Cons cons) {
        for(int j = 0; j < rowAmt; j++) {
            for(int i = 0; i < colAmt; i++) {
                if(filter.get(data[j][i])) {
                    cons.get(data[j][i]);
                };
            };
        };
    };
    // Overloading
    public void each(Cons cons) {
        each(val -> true, cons);
    };


    /* <-------------------- modification --------------------> */


    /**
     * Sets up this matrix with given values.
     */
    public MathMatrix set(double[][] matArr) throws IllegalArgumentException {
        if(matArr.length != rowAmt || matArr[0].length != colAmt) throw new IllegalArgumentException("Unmatched matrix size!");
        for(int j = 0; j < rowAmt; j++) {
            for(int i = 0; i < colAmt; i++) {
                data[j][i] = matArr[j][i];
            };
        };
        return this;
    };
    // Overloading
    public MathMatrix set(double num) {
        for(int j = 0; j < rowAmt; j++) {
            for(int i = 0; i < colAmt; i++) {
                data[j][i] = num;
            };
        };
        return this;
    };


    /**
     * Sets element at (x, y).
     */
    public MathMatrix set(int x, int y, double num) {
        data[y][x] = num;
        return this;
    };


    /**
     * Sets each element in this matrix by using a {@link Func2}.
     */
    public MathMatrix setEach(Func2<Integer, Integer, Double> mapper) {
        for(int j = 0; j < rowAmt; j++) {
            for(int i = 0; i < colAmt; i++) {
                data[j][i] = mapper.get(i, j);
            };
        };
        return this;
    };


    /* <-------------------- operation --------------------> */


    /**
     * Adds another matrix.
     */
    public MathMatrix add(MathMatrix mat) throws IllegalArgumentException {
        return add(mat.data);
    };
    // Overloading
    public MathMatrix add(double[][] matArr) throws IllegalArgumentException {
        if(!isSameSizeWith(matArr)) throw new IllegalArgumentException("Unmatched matrix size!");
        setEach((i, j) -> data[j][i] + matArr[j][i]);
        return this;
    };


    /**
     * Subtracts another matrix.
     */
    public MathMatrix sub(MathMatrix mat) throws IllegalArgumentException {
        return sub(mat.data);
    };
    // Overloading
    public MathMatrix sub(double[][] matArr) throws IllegalArgumentException {
        if(!isSameSizeWith(matArr)) throw new IllegalArgumentException("Unmatched matrix size!");
        return scl(-1).add(matArr).scl(-1);
    };


    /**
     * Multiplies a scalar.
     */
    public MathMatrix scl(double num) {
        setEach((i, j) -> data[j][i] * num);
        return this;
    };
    // Overloading
    public MathMatrix scl(MathMatrix mat) throws IllegalArgumentException {
        if(mat.rowAmt != 1 || mat.colAmt != 1) throw new IllegalArgumentException("Given matrix is not 1x1!");
        return scl(mat.get(0, 0));
    };


    /**
     * Multiplies another matrix.
     * Result is returned as a new matrix.
     */
    public MathMatrix mul(MathMatrix mat) throws IllegalArgumentException {
        return mul(mat.data);
    };
    // Overloading
    public MathMatrix mul(double[][] matArr) throws IllegalArgumentException {
        if(!canMultiply(matArr)) throw new IllegalArgumentException("Unmatched matrix size!");
        var mat0 = new MathMatrix(rowAmt, matArr[0].length);
        for(int j = 0; j < rowAmt; j++) {
            for(int i = 0; i < matArr[0].length; i++) {
                double sum = 0;
                for(int k = 0; k < colAmt; k++) {
                    sum += data[j][k] * matArr[k][i];
                };
                mat0.set(i, j, sum);
            };
        };
        return mat0;
    };


    /**
     * Transpose this matrix.
     * Result is returned as a new matrix.
     */
    public MathMatrix transpose() {
        var mat0 = new MathMatrix(colAmt, rowAmt);
        for(int j = 0; j < rowAmt; j++) {
            for(int i = 0; i < colAmt; i++) {
                mat0.data[i][j] = data[j][i];
            };
        };
        return mat0;
    };


    /* <-------------------- calculation --------------------> */


    /**
     * Gets submatrix at (x, y).
     */
    public MathMatrix submat(int x, int y) {
        var mat0 = new MathMatrix(rowAmt - 1, colAmt - 1);
        for(int j = 0; j < rowAmt - 1; j++) {
            for(int i = 0; i < colAmt - 1; i++) {
                mat0.set(i, j, data[j >= y ? j + 1 : j][i >= x ? i + 1 : i]);
            };
        };
        return mat0;
    };


    /**
     * Calculates determinant of this matrix.
     */
    public double det() throws IllegalArgumentException {
        if(!isSquare()) throw new IllegalArgumentException("Cannot calculate determinant for a non-square matrix!");
        var mat = cpy();
        for(int k = 1; k < rowAmt; k++) {
            for(int i = k + 1; i < rowAmt + 1; i++) {
                for(int j = k + 1; j < rowAmt + 1; j++) {
                    mat.set(i - 1, j - 1, (mat.data[j - 1][i - 1] * mat.data[k - 1][k - 1] - mat.data[j - 1][k - 1] * mat.data[k - 1][i - 1]) / (k == 1 ? 1 : mat.data[k - 1][k - 1]));
                };
                mat.set(i - 1, k - 1, 0);
            };
        };
        return mat.get(rowAmt - 1, rowAmt - 1);
    };


    /**
     * Calculates minor at (x, y).
     */
    public double minor(int x, int y) throws IllegalArgumentException {
        if(!isSquare()) throw new IllegalArgumentException("Cannot calculate minor for a non-square matrix!");
        return submat(x, y).det();
    };


    /**
     * Calculates cofactor at (x, y).
     */
    public double cofactor(int x, int y) throws IllegalArgumentException {
        if(!isSquare()) throw new IllegalArgumentException("Cannot calculate cofactor for a non-square matrix!");
        return Math.pow(-1, x + y) * minor(x, y);
    };


    /**
     * Gets adjugate of this matrix.
     */
    public MathMatrix adjugate() throws IllegalArgumentException {
        if(!isSquare()) throw new IllegalArgumentException("Only square matrices can have adjugate!");
        var mat = new MathMatrix(rowAmt, colAmt);
        for(int j = 0; j < rowAmt; j++) {
            for(int i = 0; i < colAmt; i++) {
                mat.set(i, j, cofactor(i, j));
            };
        };
        return mat.transpose();
    };


    /**
     * Calculates inverse of this matrix.
     * Returns null if no inverse.
     */
    public @Nullable MathMatrix inverse() throws IllegalArgumentException {
        if(!isSquare()) throw new IllegalArgumentException("Only square matrices can have inverse!");
        var det = det();
        if(Math.abs(det) < 0.000001) return null;

        return adjugate().scl(1 / det);
    };


    /**
     * Gets trace of this matrix.
     */
    public double trace() throws IllegalArgumentException {
        if(!isSquare()) throw new IllegalArgumentException("Only square matrices can have trace!");
        double sum = 0;
        for(int i = 0; i < rowAmt; i++) {
            sum += data[i][i];
        };
        return sum;
    };


    /* <-------------------- util --------------------> */


    public MathMatrix cpy() {
        return new MathMatrix(data);
    };


    public double[] toArray() {
        var arr = new double[rowAmt * colAmt];
        for(int j = 0; j < rowAmt; j++) {
            for(int i = 0; i < colAmt; i++) {
                arr[j * colAmt + i] = data[j][i];
            };
        };
        return arr;
    };


    @Override
    public String toString() {
        boolean anyVal = false;
        strBuilder.setLength(0);
        strBuilder.append("[\n");
        for(int j = 0; j < rowAmt; j++) {
            strBuilder.append("    ");
            for(int i = 0; i < colAmt; i++) {
                strBuilder.append(data[j][i]);
                strBuilder.append(",");
            };
            strBuilder.append("\n");
        };
        strBuilder.append("]");
        return strBuilder.toString();
    };


    /*
      ========================================
      Section: Definition (Static, Vector)
      ========================================
    */


    /* <-------------------- modification --------------------> */


    /**
     * Converts `arr` to a vector.
     * Result is a column vector by default.
     */
    public static MathMatrix getVec(double[] arr, boolean isRowVec) {
        if(!isRowVec) {
            double[][] matArr = {arr};
            return new MathMatrix(matArr);
        };
        var matArr = new double[1][arr.length];
        for(int i = 0; i < arr.length; i++) {
            matArr[i][0] = arr[i];
        };
        return new MathMatrix(matArr);
    };
    // Overloading
    public static MathMatrix getVec(double[] arr) {
        return getVec(arr, false);
    };


    /**
     * Converts an Arc vector into matrix vector.
     */
    public static @Nullable MathMatrix fromArcVec(Object arcVec, boolean isRowVec) {
        if(arcVec instanceof Vec2 vec2) {
            double[] arr = {vec2.x, vec2.y};
            return getVec(arr, isRowVec);
        } else if(arcVec instanceof Vec3 vec3) {
            double[] arr = {vec3.x, vec3.y, vec3.z};
            return getVec(arr, isRowVec);
        };

        return null;
    };
    // Overloading
    public static @Nullable MathMatrix fromArcVec(Object arcVec) {
        return fromArcVec(arcVec, false);
    };


    /**
     * Converts a matrix vector into Arc vector.
     */
    public static @Nullable Object toArcVec(MathMatrix vec) throws IllegalArgumentException {
        if(!vec.isVec()) throw new IllegalArgumentException("Argument is not a vector:\n" + vec);
        var arr = vec.toArray();
        if(arr.length == 2) {
            return new Vec2((float)(arr[0]), (float)(arr[1]));
        } else if(arr.length == 3) {
            return new Vec3((float)(arr[0]), (float)(arr[1]), (float)(arr[2]));
        };

        return null;
    };


    /*
      ========================================
      Section: Definition (Instance, Vector)
      ========================================
    */


    /* <-------------------- property --------------------> */


    /**
     * Calculates length of this vector.
     */
    public double len() throws IllegalArgumentException {
        return Math.sqrt(len2());
    };


    /**
     * Calculates squared length of this vector.
     */
    public double len2() throws IllegalArgumentException {
        if(!this.isVec()) throw new IllegalArgumentException("Argument is not a vector:\n" + this);
        double len = 0;
        if(!isRowVec()) {
            for(int i = 0; i < rowAmt; i++) {
                len += Math.pow(data[i][0], 2);
            };
        } else {
            for(int i = 0; i < colAmt; i++) {
                len += Math.pow(data[0][i], 2);
            };
        };
        return len;
    };


    /* <-------------------- condition --------------------> */


    /**
     * Whether this is a matrix vector.
     */
    public boolean isVec() {
        return isColVec() || isRowVec();
    };


    /**
     * Whether this is a row vector.
     */
    public boolean isRowVec() {
        return rowAmt == 1;
    };


    /**
     * Whether this is a column vector.
     */
    public boolean isColVec() {
        return colAmt == 1;
    };


    /* <-------------------- modification --------------------> */


    /**
     * Normalizes this vector.
     */
    public MathMatrix nor(double len) throws IllegalArgumentException {
        if(!this.isVec()) throw new IllegalArgumentException("Argument is not a vector:\n" + this);
        // Do nothing for zero vector
        if(Math.abs(len) < 0.0001) return this;
        var lenPrev = len();
        if(!isRowVec()) {
            for(int i = 0; i < rowAmt; i++) {
                data[i][0] /= lenPrev * len;
            };
        } else {
            for(int i = 0; i < colAmt; i++) {
                data[0][i] /= lenPrev * len;
            };
        };
        return this;
    };


    /* <-------------------- operation --------------------> */


    /**
     * Calculates dot product with another vector.
     */
    public double dotMul(MathMatrix vec) throws IllegalArgumentException {
        if(!this.isVec()) throw new IllegalArgumentException("Argument is not a vector:\n" + this);
        if(!vec.isVec()) throw new IllegalArgumentException("Argument is not a vector:\n" + vec);
        return dotMul(vec.toArray());
    };
    // Overloading
    public double dotMul(double[] arr) throws IllegalArgumentException {
        if(rowAmt != arr.length) throw new IllegalArgumentException("Unmatched vector dimension!");
        return mul(getVec(arr)).get(0, 0);
    };


    /**
     * Calculates cross product with another vector (3D only).
     */
    public MathMatrix crossMul(MathMatrix vec) throws IllegalArgumentException {
        var vec0 = isRowVec() ? this : this.transpose();
        return crossMul(vec.toArray());
    };
    // Overloading
    public MathMatrix crossMul(double[] arr) throws IllegalArgumentException {
        if(getDimension() != 3 || arr.length != 3) throw new IllegalArgumentException("Cross product is only for 3D-vectors!");
        double[][] matArr = {
            {0, data[2][0], data[1][0]},
            {data[2][0], 0, -data[0][0]},
            {-data[1][0], data[0][0], 0}
        };
        return new MathMatrix(matArr).mul(getVec(arr));
    };


    /* <-------------------- util --------------------> */


    /**
     * Variant of {@link #toArcVec} for instance.
     */
    public @Nullable Object toArcVec() throws IllegalArgumentException {
        return toArcVec(this);
    };


};
