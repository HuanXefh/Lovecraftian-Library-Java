/* <---------- import ----------> */


/* <---------- meta ----------> */


/**
 * Mathematical matrix.
 * @class
 * @param {Array<Array<number>>} matArr
 */
const CLS_matrix = newClass().initClass();


CLS_matrix.prototype.init = function(matArr) {
  /** @type {Array<Array<number>>} */
  this.matArr = matArr;
  this.rowAmt = this.matArr.length;
  this.colAmt = this.matArr[0].length;
};


/* <---------- static method ----------> */


var cls = CLS_matrix;


/**
 * Gets an empty m,n-matrix, by default filled with 0.
 * @param {number} m
 * @param {number} n
 * @param {number|unset} [def]
 * @return {CLS_matrix}
 */
cls.getEmptyMat = function(m, n, def) {
  return new CLS_matrix([].setVal(def == null ? 0 : def, m * n).chunk(n));
};


/**
 * Variant of {@link CLS_matrix.getEmptyMat} where matrix size is based on `mat`.
 * @param {CLS_matrix} mat
 * @param {number|unset} [def]
 * @return {CLS_matrix}
 */
cls.getEmptyMat_mat = function(mat, def) {
  return CLS_matrix.getEmptyMat(mat.getColAmt(), mat.getRowAmt(), def);
};


/**
 * Gets an n-unit matrix, where elements on the diagonal line are 1 by default.
 * @param {number} n
 * @param {number|unset} [def]
 * @return {CLS_matrix}
 */
cls.getUnitMat = function(n, def) {
  const mat = CLS_matrix.getEmptyMat(n, n);
  let i = 1;
  while(i <= n) {
    mat.set(i, i, def == null ? 1 : def);
    i++;
  };
  return mat;
};


/**
 * Converts `arr` into a vector (as matrix).
 * The result is by default a column vector.
 * @param {Array<number>} arr
 * @param {boolean|unset} [isRowVec]
 * @return {CLS_matrix}
 */
cls.getVec = function(arr, isRowVec) {
  const matArr = [];
  if(isRowVec) {
    matArr.push(arr.cpy());
  } else {
    arr.forEachFast(num => matArr.push([num]));
  };

  return new CLS_matrix(matArr);
};


/**
 * Converts a matrix into regular array for storage.
 * @param {CLS_matrix} mat
 * @return {Array<number>}
 */
cls.pack = function(mat) {
  let colAmt = mat.getColAmt();
  const matPack = mat.toArray().flatten();
  matPack.unshift(colAmt);

  return matPack;
};


/**
 * Converts packed matrix array back into matrix.
 * @param {Array<number>} matPack
 * @return {CLS_matrix}
 */
cls.unpack = function(matPack) {
  const matPack0 = matPack.cpy();

  return new CLS_matrix(matPack0.chunk(matPack0.shift(), 0));
};


/**
 * Writes a matrix.
 * @param {Writes} wr
 * @param {CLS_matrix} mat
 * @return {void}
 */
cls.write = function(wr, mat) {
  let matPack = mat.pack();
  MDL_io._wr_fs(wr, matPack);
};


/**
 * Reads a matrix.
 * @param {Reads} rd
 * @return {CLS_matrix}
 */
cls.read = function(rd) {
  let matPack = MDL_io._rd_fs(rd, []);
  return CLS_matrix.unpack(matPack);
};


/**
 * Converts an Arc vector into matrix vector.
 * @param {Vec2|Vec3} arcVec
 * @param {boolean|unset} isRowVec
 * @return {CLS_matrix}
 */
cls.fromArcVec = function(arcVec, isRowVec) {
  if(arcVec instanceof Vec2) {
    return CLS_matrix.getVec([arcVec.x, arcVec.y], isRowVec);
  } else if(arcVec instanceof Vec3) {
    return CLS_matrix.getVec([arcVec.x, arcVec.y, arcVec.z], isRowVec);
  } else {
    ERROR_HANDLER.throw("arcVectorConversionFail");
  };
};


/**
 * Converts a matrix vector into Arc vector.
 * @param {CLS_matrix} vec
 * @return {Vec2|Vec3}
 */
cls.toArcVec = function(vec) {
  if(!vec.isVec()) ERROR_HANDLER.throw("notVector", vec);

  let arr = vec.toArray().flatten();
  switch(arr.length) {
    case 2 : return new Vec2(arr[0], arr[1]);
    case 3 : return new Vec3(arr[0], arr[1], arr[2]);
    default : ERROR_HANDLER.throw("arcVectorConversionFail");
  };
};


/* <---------- instance method ----------> */


var ptp = CLS_matrix.prototype;


/**
 * Prints the elements in a single line.
 * @return {void}
 */
ptp.print = function() {
  this.matArr.print();
};


/**
 * Prints the elements in multiple lines.
 * @return {void}
 */
ptp.printEach = function() {
  this.matArr.printEach();
};


/**
 * Gets the element at (rowInd, colInd).
 * @return {number}
 */
ptp.get = function(rowInd, colInd) {
  return this.matArr[rowInd - 1][colInd - 1];
};


/**
 * Gets m of the matrix.
 * @return {number}
 */
ptp.getRowAmt = function() {
  return this.rowAmt;
};


/**
 * Gets n of the matrix.
 * @return {number}
 */
ptp.getColAmt = function() {
  return this.colAmt;
};


/**
 * Gets a copy of the internal 2D-array.
 * @return {Array<Array<number>>}
 */
ptp.toArray = function() {
  return this.matArr.cpy();
};


/**
 * Gets a copy of the matrix.
 * @return {CLS_matrix}
 */
ptp.cpy = function() {
  return new CLS_matrix(this.matArr);
};


/**
 * Iterates through all elements in the matrix.
 * @param {function(number): void} scr
 * @return {void}
 */
ptp.forEach = function(scr) {
  let iCap = this.getRowAmt(), jCap = this.getColAmt();
  for(let i = 0; i < iCap; i++) {
    for(let j = 0; j < jCap; j++) {
      scr(this.matArr[i][j]);
    };
  };
};


/**
 * Iterates through row arrays in the matrix.
 * @param {function(Array<number>): void} scr
 * @return {void}
 */
ptp.forEachRow = function(scr) {
  let iCap = this.getRowAmt();
  for(let i = 0; i < iCap; i++) {
    scr(this.matArr[i]);
  };
};


/**
 * Iterates through column arrays in the matrix.
 * @param {function(Array<number>): void} scr
 * @return {void}
 */
ptp.forEachCol = function(scr) {
  let iCap = this.getColAmt(), jCap = this.getRowAmt(), tmpArr = [];
  for(let i = 0; i < iCap; i++) {
    tmpArr.clear();
    for(let j = 0; j < jCap; j++) {
      tmpArr.push(this.matArr[j][i]);
    };
    scr(tmpArr);
  };
};


/**
 * Sets element at (colInd, rowInd).
 * @param {number} colInd
 * @param {number} rowInd
 * @param {number} ele
 * @return {this}
 */
ptp.set = function(colInd, rowInd, ele) {
  this.matArr[rowInd - 1][colInd - 1] = ele;
  return this;
};


/**
 * Normalizes this vector.
 * @param {number|unset} [def] - Length of final vector.
 * @return {this}
 */
ptp.nor = function(def) {
  if(!this.isVec()) ERROR_HANDLER.throw("notVector", this);
  if(def == null) def = 1.0;

  let len = this.len();
  if(def.fEqual(0.0)) return this;                // Does nothing for zero vector
  let i = 0, iCap = this.dimension();
  while(i < iCap) {
    (this.isRowVec() ? this.matArr[0][i] /= len * def : this.matArr[i][0] /= len * def);
    i++;
  };

  return this;
};


/**
 * Whether this is a square matrix.
 * @return {boolean}
 */
ptp.isSquare = function() {
  return this.getRowAmt() === this.getColAmt();
};


/**
 * Whether the two matrices are of the same size.
 * @param {CLS_matrix} mat
 * @return {boolean}
 */
ptp.sameSize = function(mat) {
  return this.getRowAmt() === mat.getRowAmt() && this.getColAmt() === mat.getColAmt();
};


/**
 * Whether this matrix can multiply with `mat`.
 * @param {CLS_matrix} mat
 * @return {boolean}
 */
ptp.canMul = function(mat) {
  return this.getColAmt() === mat.getRowAmt();
};


/**
 * Whether this is a scalar (1D-matrix).
 * @return {boolean}
 */
ptp.isScl = function() {
  return this.isColVec() && this.isRowVec();
};


/**
 * Whether this is a column or row vector.
 * @return {boolean}
 */
ptp.isVec = function() {
  return this.isColVec() || this.isRowVec();
};


/**
 * Whether this is a column vector.
 * @return {boolean}
 */
ptp.isColVec = function() {
  return this.colAmt === 1;
};


/**
 * Whether this is a row vector.
 * @return {boolean}
 */
ptp.isRowVec = function() {
  return this.rowAmt === 1;
};


/**
 * Gets dimension of the matrix.
 * @return {number}
 */
ptp.dimension = function() {
  return Math.max(this.getRowAmt(), this.getColAmt());
};


/**
 * Gets the transposed result as a new matrix.
 * @return {CLS_matrix}
 */
ptp.transpose = function() {
  const mat = CLS_matrix.getEmptyMat_mat(this);

  this.getRowAmt()._it(j => {
    this.getColAmt()._it(i => {
      mat.set(i + 1, j + 1, this.matArr[j][i]);
    });
  });

  return mat;
};


/**
 * Adds another matrix, returns the result as a new matrix.
 * @param {CLS_matrix} mat
 * @return {CLS_matrix}
 */
ptp.add = function(mat) {
  if(!this.sameSize(mat)) ERROR_HANDLER.throw("matrixSizeMismatch");
  const mat0 = CLS_matrix.getEmptyMat_mat(this);

  this.getRowAmt()._it(j => {
    this.getColAmt()._it(i => {
      mat0.set(i + 1, j + 1, this.matArr[j][i] + mat.matArr[j][i]);
    });
  });

  return mat0;
};


/**
 * Subtracts another matrix, returns the result as a new matrix.
 * @param {CLS_matrix} mat
 * @return {CLS_matrix}
 */
ptp.minus = function(mat) {
  return this.add(mat.scl(-1.0));
};


/**
 * Multiplies a scalar (or number), returns the result as a new matrix.
 * @param {number|CLS_matrix} scl
 * @return {CLS_matrix}
 */
ptp.scl = function(scl) {
  const mat = CLS_matrix.getEmptyMat_mat(this);

  let num;
  if(scl instanceof CLS_matrix) {
    num = scl.isScl() ? scl.get(1, 1) : NaN;
  } else {
    num = Number(scl);
  };
  if(isNaN(num)) num = 1.0;

  this.getRowAmt()._it(j => {
    this.getColAmt()._it(i => {
      mat.set(i + 1, j + 1, this.matArr[j][i] * num);
    });
  });

  return mat;
};


/**
 * Multiplies a matrix, returns the result as a new matrix.
 * @param {CLS_matrix} mat
 * @return {CLS_matrix}
 */
ptp.mul = function(mat) {
  if(!this.canMul(mat)) ERROR_HANDLER.throw("matrixMultiplicationInvalid");
  const mat0 = CLS_matrix.getEmptyMat_mat(this);

  this.getRowAmt()._it(j => {
    this.getColAmt()._it(i => {
      let sum = 0.0;
      this.getColAmt()._it(k => {
        sum += this.matArr[j][k] * mat.matArr[k][i];
      });
      mat0.set(i + 1, j + 1, sum);
    });
  });

  return mat0;
};


/**
 * Gets the submatrix at (rowInd, colInd).
 * @param {number} rowInd
 * @param {number} colInd
 * @return {CLS_matrix}
 */
ptp.submat = function(rowInd, colInd) {
  const mat = CLS_matrix.getEmptyMat_mat(this);

  (this.getRowAmt() - 1)._it(j => {
    (this.getColAmt() - 1)._it(i => {
      mat.set(i + 1, j + 1, this.matArr[j + 1 >= rowInd ? j + 1 : j][i + 1 >= colInd ? i + 1 : i]);
    });
  });

  return mat;
};


/**
 * Gets determinant of the matrix.
 * <br> <REFERENCE>: Bareiss algorithm.
 * @return {number}
 */
ptp.det = function() {
  if(!this.isSquare()) ERROR_HANDLER.throw("notSquareMatrix", this);

  const mat = this.cpy();
  let cap = mat.getRowAmt();
  cap._it(k => {
    cap._it(j => {
      cap._it(i => {
        mat.set(i + 1, j + 1, (mat.matArr[j][i] * mat.matArr[k][k] - mat.matArr[j][k] * mat.matArr[k][i]) / (k === 0 ? 1.0 : mat.matArr[k - 1][k - 1]));
      });
    });
  });

  return mat.matArr[cap - 1][cap - 1];
};


/**
 * Gets minor of the matrix at (rowInd, colInd).
 * @param {number} rowInd
 * @param {number} colInd
 * @return {number}
 */
ptp.minor = function(rowInd, colInd) {
  if(!this.isSquare()) ERROR_HANDLER.throw("notSquareMatrix", this);

  return this.submat(rowInd, colInd).det();
};


/**
 * Gets cofactor of the matrix at (rowInd, colInd).
 * @param {number} rowInd
 * @param {number} colInd
 * @return {number}
 */
ptp.cofactor = function(rowInd, colInd) {
  if(!this.isSquare()) ERROR_HANDLER.throw("notSquareMatrix", this);

  return Math.pow(-1, rowInd + colInd) * this.minor(rowInd, colInd);
};


/**
 * Gets adjugate of the matrix.
 * @return {CLS_matrix}
 */
ptp.adjugate = function() {
  if(!this.isSquare()) ERROR_HANDLER.throw("notSquareMatrix", this);
  const mat = CLS_matrix.getEmptyMat_mat(this);

  this.getRowAmt()._it(j => {
    this.getColAmt()._it(i => {
      mat.set(i + 1, j + 1, this.cofactor(i + 1, j + 1));
    });
  });

  return mat.transpose();
};


/**
 * Gets inverse of the matrix.
 * Will return null if the matrix does not have inverse.
 * @return {CLS_matrix|null}
 */
ptp.inverse = function() {
  if(!this.isSquare()) ERROR_HANDLER.throw("notSquareMatrix", this);
  let det = this.det();
  if(Math.abs(det) < 0.000001) return null;

  return this.adjugate().scl(1.0 / det);
};


/**
 * Gets trace of the matrix.
 * @return {number}
 */
ptp.trace = function() {
  if(!this.isSquare()) ERROR_HANDLER.throw("notSquareMatrix", this);

  let sum = 0.0;
  this.getRowAmt()._it(i => {
    sum += this.matArr[i][i];
  });

  return sum;
};


/**
 * Gets length of the vector.
 * @return {number}
 */
ptp.len = function() {
  if(!this.isVec()) ERROR_HANDLER.throw("notVector", this);

  let val = 0.0;
  this.forEach(num => val += Math.pow(num, 2));
  val = Math.sqrt(val);

  return val;
};


/**
 * Gets dot product with another vector.
 * @param {CLS_matrix} vec
 * @return {number}
 */
ptp.dotMul = function(vec) {
  if(!this.isVec()) ERROR_HANDLER.throw("notVector", this);
  if(!vec.isVec()) ERROR_HANDLER.throw("notVector", vec);

  let vec_l = this.isRowVec() ? this : this.transpose();
  let vec_r = vec.isColVec() ? vec : vec.transpose();
  if(!vec_l.canMul(vec_r)) ERROR_HANDLER.throw("matrixMultiplicationInvalid");

  return vec_l.mul(vec_r)[0][0];
};


/**
 * Gets cross product with another 3D-vector (as a new vector).
 * @param {CLS_matrix} vec
 * @return {CLS_matrix}
 */
ptp.crossMul = function(vec) {
  let vec_l = this.isColVec() ? this : this.transpose();
  let vec_r = vec.isColVec() ? vec : vec.transpose();
  if(vec_l.dimension() !== 3 || vec_r.dimension() !== 3) ERROR_HANDLER.throw("not3dVector");

  return new CLS_matrix([
    [0, -vec_l[2][0], vec_l[1][0]],
    [vec_l[2][0], 0, -vec_l[0][0]],
    [-vec_l[1][0], vec_l[0][0], 0],
  ]).mul(vec_r);
};


/**
 * Variant of {@link CLS_matrix.toArcVec} for instance.
 * @return {Vec2|Vec3}
 */
ptp.toArcVec = function() {
  return CLS_matrix.toArcVec(this);
};


module.exports = CLS_matrix;
