/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Handles geometrical calculation.
   * Some of these are really costy!
   * @module lovec/math/MATH_geometry
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ point ------------------------------ */


  /**
   * Calculates distance between two n-dimensional points.
   * <br> `ARGS`: x1, y1, x2, y2 | x1, y1, z1, x2, y2, z2 | ...
   * @return {number}
   */
  const calcDst = function() {
    let val = 0.0;
    let i = 0, iCap = arguments.length / 2;
    while(i < iCap) {
      val += Math.pow(arguments[i + iCap] - arguments[i], 2);
      i++;
    };

    return Math.sqrt(val);
  };
  exports.calcDst = calcDst;


  /**
   * Variant of {@link calcDst} for Manhattan distance.
   * <br> `ARGS`: x1, y1, x2, y2 | x1, y1, z1, x2, y2, z2 | ...
   * @return {number}
   */
  const calcDstManhattan = function() {
    let val = 0.0;
    let i = 0, iCap = arguments.length / 2;
    while(i < iCap) {
      val += Math.abs(arguments[i + iCap] - arguments[i]);
      i++;
    };

    return val;
  };
  exports.calcDstManhattan = calcDstManhattan;


  /**
   * Variant of {@link calcDst} for Chebyshev distance.
   * <br> `ARGS`: x1, y1, x2, y2 | x1, y1, z1, x2, y2, z2 | ...
   * @return {number}
   */
  const calcDstChebyshev = function() {
    let val = 0.0;
    let i = 0, iCap = arguments.length / 2;
    while(i < iCap) {
      val = Math.max(val, arguments[i + iCap] - arguments[i]);
      i++;
    };

    return val;
  };
  exports.calcDstChebyshev = calcDstChebyshev;


  /* <------------------------------ path ------------------------------ */


  function fetchPathTwoPointArg(arr, pathData, dim, ponInd_t) {
    arr.clear();
    dim._it(ind => arr.push(pathData[ponInd_t + ind]));
    dim._it(ind => arr.push(pathData[ponInd_t - dim + ind]));

    return arr;
  };


  /**
   * Gets total length of a path.
   * @param {PointArray} pathData
   * @param {number|unset} [dim]
   * @return {number}
   */
  const calcPathLen = function thisFun(pathData, dim) {
    if(dim == null) dim = 2;

    let len = 0.0;
    let i = 0, iCap = pathData.iCap();
    thisFun.tmpArr.clear();
    while(i < iCap) {
      if(i === 0) continue;
      fetchPathTwoPointArg(thisFun.tmpArr, pathData, dim, i);
      len += calcDst.apply(null, thisFun.tmpArr);
      i += dim;
    };

    return len;
  }
  .setProp({
    tmpArr: [],
  });
  exports.calcPathLen = calcPathLen;


  /**
   * Gets an array of distances between points on the path.
   * @param {Array|unset} contArr
   * @param {PointArray} pathData
   * @param {number|unset} [dim]
   * @return {Array<number>}
   */
  const calcPathSegLens = function thisFun(contArr, pathData, dim) {
    let arr = contArr != null ? contArr.clear() : [];
    if(dim == null) dim = 2;

    let i = 0, iCap = pathData.iCap();
    thisFun.tmpArr.clear();
    while(i < iCap) {
      if(i === 0) continue;
      fetchPathTwoPointArg(thisFun.tmpArr, pathData, dim, i);
      arr.push(calcDst.apply(null, thisFun.tmpArr));
      i += dim;
    };

    return arr;
  }
  .setProp({
    tmpArr: [],
  });
  exports.calcPathSegLens = calcPathSegLens;


  /* <------------------------------ area ------------------------------ */


  /**
   * Gets area of a 2D polygon.
   * <br> `ARGS`: x1, y1, x2, y2, x3, y3, ...
   * <br> `REFERENCE`: Shoelace theorem.
   * @return {number}
   */
  const calcArea = function() {
    let iCap = arguments.length;
    if(iCap < 6) return 0.0;

    let
      x_i,
      y_i,
      x_ii,
      y_ii,
      tmp1 = 0.0,
      tmp2 = 0.0;

    for(let i = 0; i < iCap; i += 2) {
      x_i = arguments[i];
      y_i = arguments[i + 1];
      x_ii = (i + 2 > iCap - 1) ? arguments[0] : arguments[i + 2];
      y_ii = (i + 3 > iCap - 1) ? arguments[1] : arguments[i + 3];

      tmp1 += x_i * y_ii;
      tmp2 += x_ii * y_i;
    };

    return Math.abs(tmp1 - tmp2) * 0.5;
  };
  exports.calcArea = calcArea;


  /**
   * Whether (x, y) is inside a 2D-polygon.
   * <br> `ARGS`: x, y, x1, y1, x2, y2, x3, y3, ...
   * @return {boolean}
   */
  const checkInPolygon = function thisFun() {
    let iCap = arguments.length;
    if(iCap < 8) return true;

    let x = arguments[0], y = arguments[1];
    thisFun.coords.clear();
    for(let i = 2; i < iCap; i++) {
      thisFun.coords.push(arguments[i]);
    };
    let area = calcArea.apply(null, thisFun.coords);

    let
      x_i,
      y_i,
      x_ii,
      y_ii,
      iCap1 = thisFun.coords.iCap(),
      tmpArea = 0.0;

    for(let i = 0; i < iCap1; i += 2) {
      x_i = thisFun.coords[i];
      y_i = thisFun.coords[i + 1];
      x_ii = (i + 2 > iCap1 - 1) ? thisFun.coords[0] : thisFun.coords[i + 2];
      y_ii = (i + 3 > iCap1 - 1) ? thisFun.coords[1] : thisFun.coords[i + 3];

      tmpArea += calcArea(x, y, x_i, y_i, x_ii, y_ii);
    };

    return Math.abs(area - tmpArea) < 0.0000001;
  }
  .setProp({
    coords: [],
  });
  exports.checkInPolygon = checkInPolygon;
