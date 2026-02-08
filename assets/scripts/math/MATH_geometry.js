/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods that handles geometrical calculation.
   * Some of these are really costy!
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- point ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: x1, y1, x2, y2 | x1, y1, z1, x2, y2, z2 | ...
   * Simply calculates distance.
   * ---------------------------------------- */
  const _dst = function() {
    let val = 0.0;
    let i = 0, iCap = arguments.length / 2;
    while(i < iCap) {
      val += Math.pow(arguments[i + iCap] - arguments[i], 2);
      i++;
    };

    return Math.sqrt(val);
  };
  exports._dst = _dst;


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: x1, y1, x2, y2 | x1, y1, z1, x2, y2, z2 | ...
   * Manhattan distance.
   * ---------------------------------------- */
  const _dstManh = function() {
    let val = 0.0;
    let i = 0, iCap = arguments.length / 2;
    while(i < iCap) {
      val += Math.abs(arguments[i + iCap] - arguments[i]);
      i++;
    };

    return val;
  };
  exports._dstManh = _dstManh;


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: x1, y1, x2, y2 | x1, y1, z1, x2, y2, z2 | ...
   * Chebyshev distance.
   * ---------------------------------------- */
  const _dstCheb = function() {
    let val = 0.0;
    let i = 0, iCap = arguments.length / 2;
    while(i < iCap) {
      val = Math.max(val, arguments[i + iCap] - arguments[i]);
      i++;
    };

    return val;
  };
  exports._dstCheb = _dstCheb;


  /* <---------- path ----------> */


  function fetchPathTwoPointArg(arr, pathData, dim, ponInd_t) {
    arr.clear();
    dim._it(1, ind => arr.push(pathData[ponInd_t + ind]));
    dim._it(1, ind => arr.push(pathData[ponInd_t - dim + ind]));

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Calculates the total length of a path.
   * ---------------------------------------- */
  const _pathLen = function(pathData, dim) {
    if(dim == null) dim = 2;

    let len = 0.0;
    let i = 0, iCap = pathData.iCap();
    let tmpArr = [];
    while(i < iCap) {
      if(i === 0) continue;
      fetchPathTwoPointArg(tmpArr, pathData, dim, i);
      len += _dst.apply(null, tmpArr);
      i += dim;
    };

    return val;
  };
  exports._pathLen = _pathLen;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array of distances between points on the path.
   * ---------------------------------------- */
  const _pathSegLens = function(pathData, dim) {
    const arr = [];

    if(dim == null) dim = 2;

    let i = 0, iCap = pathData.iCap();
    let tmpArr = [];
    while(i < iCap) {
      if(i === 0) continue;
      fetchPathTwoPointArg(tmpArr, pathData, dim, i);
      arr.push(_dst.apply(null, tmpArr));
      i += dim;
    };

    return arr;
  };
  exports._pathSegLens = _pathSegLens;


  /* <---------- area ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * @ARG: x1, y1, x2, y2, x3, y3, ...
   * Calculates the area of a polygon.
   * Point coorinates should be arranged clockwise or anticlockwise.
   * See Shoelace Theorem.
   * ---------------------------------------- */
  const _area = function() {
    let iCap = arguments.length;
    if(iCap < 6) return 0.0;
    let tmp1 = 0.0, tmp2 = 0.0;
    let x_i, y_i, x_ii, y_ii;
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
  exports._area = _area;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether (x, y) is inside a rectangle at (cx, cy).
   * ---------------------------------------- */
  const _inRect = function(x, y, cx, cy, hw, hh) {
    if(hw == null) hw = 0.0;
    if(hh == null) hh = hw;
    if(hw < 0.0001 || hh < 0.0001) return false;

    return x > cx - hw
      && x < cx + hw
      && y > cy - hh
      && y < cy + hh;
  };
  exports._inRect = _inRect;


  /* ----------------------------------------
   * NOTE:
   *
   * @ARG: x, y, x1, y1, x2, y2, x3, y3, ...
   * Whether (x, y) is in the range of a polygon.
   * ---------------------------------------- */
  const _inPolygon = function() {
    let iCap = arguments.length;
    if(iCap < 8) return true;

    let x = arguments[0], y = arguments[1];
    let coords = [];
    for(let i = 2; i < iCap; i++) {
      coords.push(arguments[i]);
    };
    const area = _area.apply(null, coords);

    let iCap1 = coords.iCap();
    let tmpArea = 0.0;
    let x_i, y_i, x_ii, y_ii;
    for(let i = 0; i < iCap1; i += 2) {
      x_i = coords[i];
      y_i = coords[i + 1];
      x_ii = (i + 2 > iCap1 - 1) ? coords[0] : coords[i + 2];
      y_ii = (i + 3 > iCap1 - 1) ? coords[1] : coords[i + 3];

      tmpArea += _area(x, y, x_i, y_i, x_ii, y_ii);
    };

    return Math.abs(area - tmpArea) < 0.0000001;
  };
  exports._inPolygon = _inPolygon;
