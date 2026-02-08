/* ----------------------------------------
 * NOTE:
 *
 * Matrix as a mathematical concept.
 * ---------------------------------------- */


/* <---------- import ----------> */


/* <---------- meta ----------> */


const CLS_matrix = newClass().initClass();


CLS_matrix.prototype.init = function(matArr) {
  if(matArr == null) matArr = [[0]];

  this.matArr = matArr;
  this.rowAmt = matArr.length;
  this.colAmt = matArr[0].length;
};


/* <---------- static method ----------> */


var cls = CLS_matrix;


/* ----------------------------------------
 * NOTE:
 *
 * Returns an empty m,n-matrix, by default filled with 0.
 * ---------------------------------------- */
cls.getEmptyMat = function(m, n, def) {
  return new CLS_matrix([].setVal(def == null ? 0 : def, m * n).chunk(n));
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns an empty matrix based on the size of {mat}.
 * ---------------------------------------- */
cls.getEmptyMat_mat = function(mat, def) {
  return CLS_matrix.getEmptyMat(mat.getColAmt(), mat.getRowAmt(), def);
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns an n-unit matrix, by default using 1.
 * ---------------------------------------- */
cls.getUnitMat = function(n, def) {
  const mat = CLS_matrix.getEmptyMat(n, n);
  let i = 1;
  while(i <= n) {
    mat.set(i, i, def == null ? 1 : def);
    i++;
  };
  return mat;
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns a vector from {arr}.
 * Result is a column vector by default.
 * ---------------------------------------- */
cls.getVec = function(arr, isRowVec) {
  const matArr = [];
  if(isRowVec) {
    matArr.push(arr.cpy());
  } else {
    arr.forEachFast(num => matArr.push([num]));
  };

  return new CLS_matrix(matArr);
};


/* ----------------------------------------
 * NOTE:
 *
 * Converts a matrix into a regular array for storage.
 * ---------------------------------------- */
cls.pack = function(mat) {
  if(!(mat instanceof CLS_matrix)) return null;

  let colAmt = mat.getColAmt();
  const mat0 = mat.toArray().flatten();
  mat0.unshift(colAmt);

  return mat0;
};


/* ----------------------------------------
 * NOTE:
 *
 * Converts a packed matrix array back into matrix.
 * ---------------------------------------- */
cls.unpack = function(matArrPack) {
  if(!(matArrPack instanceof Array)) return null;

  const mat = matArrPack.cpy();

  return new CLS_matrix(mat.chunk(mat.shift(), 0));
};


/* ----------------------------------------
 * NOTE:
 *
 * Converts an Arc vector to matrix vector.
 * ---------------------------------------- */
cls.fromArcVec = function(arcVec, isRowVec) {
  if(arcVec instanceof Vec2) {
    return CLS_matrix.getVec([arcVec.x, arcVec.y], isRowVec);
  } else if(arcVec instanceof Vec3) {
    return CLS_matrix.getVec([arcVec.x, arcVec.y, arcVec.z], isRowVec);
  } else {
    ERROR_HANDLER.throw("arcVectorConversionFail");
  };
};


/* <---------- instance method ----------> */


var ptp = CLS_matrix.prototype;


/* ----------------------------------------
 * NOTE:
 *
 * Prints the elements in a line.
 * ---------------------------------------- */
ptp.print = function() {
  this.matArr.print();
};


/* ----------------------------------------
 * NOTE:
 *
 * Prints the elements in multiple lines.
 * ---------------------------------------- */
ptp.printEach = function() {
  this.matArr.printEach();
};


/* ----------------------------------------
 * NOTE:
 *
 * Gets the element at (row, col).
 * ---------------------------------------- */
ptp.get = function(row, col) {
  return this.matArr[row - 1][col - 1];
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns m of the matrix.
 * ---------------------------------------- */
ptp.getRowAmt = function() {
  return this.rowAmt;
},


/* ----------------------------------------
 * NOTE:
 *
 * Returns n of the matrix.
 * ---------------------------------------- */
ptp.getColAmt = function() {
  return this.colAmt;
},


/* ----------------------------------------
 * NOTE:
 *
 * Returns a copy of the internal array.
 * ---------------------------------------- */
ptp.toArray = function() {
  return this.matArr.cpy();
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns a copy of the matrix.
 * ---------------------------------------- */
ptp.cpy = function() {
  return new CLS_matrix(this.matArr);
};


/* ----------------------------------------
 * NOTE:
 *
 * Iterates through every element in the matrix.
 * ---------------------------------------- */
ptp.forEach = function(scr) {
  let iCap = this.getRowAmt(), jCap = this.getColAmt();
  for(let i = 0; i < iCap; i++) {
    for(let j = 0; j < jCap; j++) {
      scr(this.matArr[i][j]);
    };
  };
};


/* ----------------------------------------
 * NOTE:
 *
 * Iterates through every row array in the matrix.
 * ---------------------------------------- */
ptp.forEachRow = function(scr) {
  let iCap = this.getRowAmt();
  for(let i = 0; i < iCap; i++) {
    scr(this.matArr[i]);
  };
};


/* ----------------------------------------
 * NOTE:
 *
 * Iterates through every column array in the matrix.
 * ---------------------------------------- */
ptp.forEachCol = function(scr) {
  let iCap = this.getColAmt(), jCap = this.getRowAmt();
  for(let i = 0; i < iCap; i++) {
    let tmpArr = [];
    for(let j = 0; j < jCap; j++) {
      tmpArr.push(this.matArr[j][i]);
    };
    scr(tmpArr);
  };
};


/* ----------------------------------------
 * NOTE:
 *
 * Sets the element at (colInd, rowInd).
 * Note that the index here starts at 1.
 * ---------------------------------------- */
ptp.set = function(colInd, rowInd, ele) {
  this.matArr[rowInd - 1][colInd - 1] = ele;
  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Normalizes the vector.
 * {def} is the target length.
 * ---------------------------------------- */
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


/* ----------------------------------------
 * NOTE:
 *
 * Whether it is a square matrix.
 * ---------------------------------------- */
ptp.isSquare = function() {
  return this.getRowAmt() === this.getColAmt();
};


/* ----------------------------------------
 * NOTE:
 *
 * Whether two matrices are of the same size.
 * ---------------------------------------- */
ptp.sameSize = function(mat) {
  return this.getRowAmt() === mat.getRowAmt() && this.getColAmt() === mat.getColAmt();
};


/* ----------------------------------------
 * NOTE:
 *
 * Whether this matrix can multiply {mat}.
 * ---------------------------------------- */
ptp.canMul = function(mat) {
  return this.getColAmt() === mat.getRowAmt();
};


/* vector condition */


/* ----------------------------------------
 * NOTE:
 *
 * Whether this is a scalar (1-dimensional matrix).
 * ---------------------------------------- */
ptp.isScl = function() {
  return this.isColVec() && this.isRowVec();
},


/* ----------------------------------------
 * NOTE:
 *
 * Whether this is a vector regardless of type.
 * ---------------------------------------- */
ptp.isVec = function() {
  return this.isColVec() || this.isRowVec();
},


/* ----------------------------------------
 * NOTE:
 *
 * Whether this is a column vector.
 * ---------------------------------------- */
ptp.isColVec = function() {
  return this.colAmt === 1;
};


/* ----------------------------------------
 * NOTE:
 *
 * Whether this is a row vector.
 * ---------------------------------------- */
ptp.isRowVec = function() {
  return this.rowAmt === 1;
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns dimension of the matrix.
 * ---------------------------------------- */
ptp.dimension = function() {
  return Math.max(this.getRowAmt(), this.getColAmt());
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns the transposed result as a new matrix.
 * ---------------------------------------- */
ptp.transpose = function() {
  const mat = CLS_matrix.getEmptyMat_mat(this);

  this.getRowAmt()._it(1, j => {
    this.getColAmt()._it(1, i => {
      mat.set(i + 1, j + 1, this.matArr[j][i]);
    });
  });

  return mat;
};


/* ----------------------------------------
 * NOTE:
 *
 * Lets a matrix adds another one, returns the result as a new matrix.
 * ---------------------------------------- */
ptp.add = function(mat) {
  if(!this.sameSize(mat)) ERROR_HANDLER.throw("matrixSizeMismatch");
  const mat0 = CLS_matrix.getEmptyMat_mat(this);

  this.getRowAmt()._it(1, j => {
    this.getColAmt()._it(1, i => {
      mat0.set(i + 1, j + 1, this.matArr[j][i] + mat.matArr[j][i]);
    });
  });

  return mat0;
};


/* ----------------------------------------
 * NOTE:
 *
 * Lets a matrix substracts another one, returns the result as a new matrix.
 * ---------------------------------------- */
ptp.minus = function(mat) {
  return this.add(mat.scl(-1.0));
};


/* ----------------------------------------
 * NOTE:
 *
 * Lets a matrix multiplies a scalar, returns the result as a new matrix.
 * ---------------------------------------- */
ptp.scl = function(scl) {
  const mat = CLS_matrix.getEmptyMat_mat(this);

  var num;
  if(scl instanceof CLS_matrix) {
    num = scl.isScl() ? scl.get(1, 1) : NaN;
  } else {
    num = Number(scl);
  };
  if(isNaN(num)) num = 1.0;

  this.getRowAmt()._it(1, j => {
    this.getColAmt()._it(1, i => {
      mat.set(i + 1, j + 1, this.matArr[j][i] * num);
    });
  });

  return mat;
};


/* ----------------------------------------
 * NOTE:
 *
 * Lets a matrix multiplies another one, returns the result as a new matrix.
 * ---------------------------------------- */
ptp.mul = function(mat) {
  if(!this.canMul(mat)) ERROR_HANDLER.throw("matrixMultiplicationInvalid");
  const mat0 = CLS_matrix.getEmptyMat_mat(this);

  this.getRowAmt()._it(1, j => {
    this.getColAmt()._it(1, i => {
      let sum = 0.0;
      this.getColAmt()._it(1, k => {
        sum += this.matArr[j][k] * mat.matArr[k][i];
      });
      mat0.set(i + 1, j + 1, sum);
    });
  });

  return mat0;
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns the submatrix at (colInd, rowInd).
 * ---------------------------------------- */
ptp.submat = function(colInd, RowInd) {
  const mat = CLS_matrix.getEmptyMat_mat(this);

  (this.getRowAmt() - 1)._it(1, j => {
    (this.getColAmt() - 1)._it(1, i => {
      mat.set(i + 1, j + 1, this.matArr[j + 1 >= rowInd ? j + 1 : j][i + 1 >= colInd ? i + 1 : i]);
    });
  });

  return mat;
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns determinant of the matrix.
 * ----------------------------------------
 * REFERENCE:
 *
 * <Bareiss algorithm>
 * ---------------------------------------- */
ptp.det = function() {
  if(!this.isSquare()) ERROR_HANDLER.throw("notSquareMatrix", this);

  const mat = this.cpy();
  let cap = mat.getRowAmt();
  cap._it(1, k => {
    cap._it(1, j => {
      cap._it(1, i => {
        mat.set(i + 1, j + 1, (mat.matArr[j][i] * mat.matArr[k][k] - mat.matArr[j][k] * mat.matArr[k][i]) / (k === 0 ? 1.0 : mat.matArr[k - 1][k - 1]));
      });
    });
  });

  return mat.matArr[cap - 1][cap - 1];
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns minor of the matrix at (row, col).
 * ---------------------------------------- */
ptp.minor = function(colInd, rowInd) {
  if(!this.isSquare()) ERROR_HANDLER.throw("notSquareMatrix", this);

  return this.submat(colInd, rowInd).det();
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns cofactor of the matrix at (row, col).
 * ---------------------------------------- */
ptp.cofactor = function(colInd, rowInd) {
  if(!this.isSquare()) ERROR_HANDLER.throw("notSquareMatrix", this);

  return Math.pow(-1, colInd + rowInd) * this.minor(colInd, rowInd);
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns adjugate of the matrix.
 * ---------------------------------------- */
ptp.adjugate = function() {
  if(!this.isSquare()) ERROR_HANDLER.throw("notSquareMatrix", this);
  const mat = CLS_matrix.getEmptyMat_mat(this);

  this.getRowAmt()._it(1, j => {
    this.getColAmt()._it(1, i => {
      mat.set(i + 1, j + 1, this.cofactor(i + 1, j + 1));
    });
  });

  return mat.transpose();
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns inverse of the matrix by using adjugate.
 * This method is nullable, as not every matrix has inverse.
 * ---------------------------------------- */
ptp.inverse = function() {
  if(!this.isSquare()) ERROR_HANDLER.throw("notSquareMatrix", this);
  let det = this.det();
  if(Math.abs(det) < 0.000001) return null;

  return this.adjugate().scl(1.0 / det);
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns trace of the matrix.
 * ---------------------------------------- */
ptp.trace = function() {
  if(!this.isSquare()) ERROR_HANDLER.throw("notSquareMatrix", this);

  var sum = 0.0;
  this.getRowAmt()._it(1, i => {
    sum += this.matArr[i][i];
  });

  return sum;
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns length of the vector.
 * ---------------------------------------- */
ptp.len = function() {
  if(!this.isVec()) ERROR_HANDLER.throw("notVector", this);
  var val = 0.0;

  this.forEach(num => val += Math.pow(num, 2));
  val = Math.sqrt(val);

  return val;
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns dot product of two vectors.
 * ---------------------------------------- */
ptp.dotMul = function(vec) {
  if(!this.isVec()) ERROR_HANDLER.throw("notVector", this);
  if(!vec.isVec()) ERROR_HANDLER.throw("notVector", vec);

  let vec_l = this.isRowVec() ? this : this.transpose();
  let vec_r = vec.isColVec() ? vec : vec.transpose();
  if(!vec_l.canMul(vec_r)) ERROR_HANDLER.throw("matrixMultiplicationInvalid");

  return vec_l.mul(vec_r);
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns cross product of two vectors.
 * ---------------------------------------- */
ptp.crossMul = function(vec) {
  let vec_l = this.isColVec() ? this : this.transpose();
  let vec_r = vec.isColVec() ? vec : vec.transpose();
  if(vec_l.dimension() !== 3 || vec_r.dimension() !== 3) ERROR_HANDLER.not3dVector();

  return new CLS_matrix([
    [0, -vec_l[2][0], vec_l[1][0]],
    [vec_l[2][0], 0, -vec_l[0][0]],
    [-vec_l[1][0], vec_l[0][0], 0],
  ]).mul(vec_r);
};


/* ----------------------------------------
 * NOTE:
 *
 * Converts the vector to an Arc vector.
 * ---------------------------------------- */
ptp.toArcVec = function() {
  if(!this.isVec()) ERROR_HANDLER.throw("notVector", this);

  let arr = this.toArray().flatten();
  switch(arr.length) {
    case 2 : return new Vec2(arr[0], arr[1]);
    case 3 : return new Vec3(arr[0], arr[1], arr[2]);
    default : ERROR_HANDLER.throw("arcVectorConversionFail");
  };
};


module.exports = CLS_matrix;
