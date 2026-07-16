/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods related to interpolation.
   * @module lovec/math/MATH_interp
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ lerp ------------------------------ */


  /**
   * Generalized lerp.
   * @param {number} val_f
   * @param {number} val_t
   * @param {number} param
   * @param {number|unset} [param_f]
   * @param {number|unset} [param_t]
   * @return {number}
   */
  const lerp = function(val_f, val_t, param, param_f, param_t) {
    return param_f == null || param_t == null ?
      LCLerp.lerp(val_f, val_t, param) :
      LCLerp.lerp(val_f, val_t, param, param_f, param_t);
  };
  exports.lerp = lerp;


  /**
   * Smooth version of {@link lerp}.
   * @param {number} val_f
   * @param {number} val_t
   * @param {number} param
   * @param {number|unset} [param_f]
   * @param {number|unset} [param_t]
   * @return {number}
   */
  const smoothLerp = function(val_f, val_t, param, param_f, param_t) {
    return param_f == null || param_t == null ?
      LCLerp.sLerp(val_f, val_t, param) :
      LCLerp.sLerp(val_f, val_t, param, param_f, param_t);
  };
  exports.smoothLerp = smoothLerp;


  /**
   * Bilinear version of {@link lerp}.
   * @param {number} val1_f
   * @param {number} val1_t
   * @param {number} val2_f
   * @param {number} val2_t
   * @param {number} param1
   * @param {number} param2
   * @param {number} a
   * @param {number|unset} [param1_f]
   * @param {number|unset} [param1_t]
   * @param {number|unset} [param2_f]
   * @param {number|unset} [param2_t]
   * @return {number}
   */
  const biLerp = function(val1_f, val1_t, val2_f, val2_t, param1, param2, a, param1_f, param1_t, param2_f, param2_t) {
    return param1_f == null || param1_t == null || param2_f == null || param2_t == null ?
      LCLerp.biLerp(val1_f, val1_t, val2_f, val2_t, param1, param2, a) :
      LCLerp.biLerp(val1_f, val1_t, val2_f, val2_t, param1, param2, a, param1_f, param1_t, param2_f, param2_t);
  };
  exports.biLerp = biLerp;


  /**
   * Smooth version of {@link biLerp}.
   * @param {number} val1_f
   * @param {number} val1_t
   * @param {number} val2_f
   * @param {number} val2_t
   * @param {number} param1
   * @param {number} param2
   * @param {number} a
   * @param {number|unset} [param1_f]
   * @param {number|unset} [param1_t]
   * @param {number|unset} [param2_f]
   * @param {number|unset} [param2_t]
   * @return {number}
   */
  const smoothBiLerp = function(val1_f, val1_t, val2_f, val2_t, param1, param2, a, param1_f, param1_t, param2_f, param2_t) {
    return param1_f == null || param1_t == null || param2_f == null || param2_t == null ?
      LCLerp.sBiLerp(val1_f, val1_t, val2_f, val2_t, param1, param2, a) :
      LCLerp.sBiLerp(val1_f, val1_t, val2_f, val2_t, param1, param2, a, param1_f, param1_t, param2_f, param2_t);
  };
  exports.smoothBiLerp = smoothBiLerp;


  /**
   * Path version of {@link lerp}.
   * @param {Array|unset} contTup
   * @param {PointArray} pathData
   * @param {number|unset} dim
   * @param {number} param
   * @param {number|unset} [param_f]
   * @param {number|unset} [param_t]
   * @return {Array<number>} Result is returned as n-dimensional point.
   */
  const pathLerp = function thisFun(contTup, pathData, dim, param, param_f, param_t) {
    let tup = contTup != null ? contTup.clear() : [];
    if(dim == null) dim = 2;
    if(param_f == null) param_f = 0.0;
    if(param_t == null) param_t = 1.0;

    let
      i = 0,
      iCap = pathSegLens.iCap(),
      tmpFrac1,
      tmpFrac2 = 0.0,
      tmpFrac3 = null,
      paramFrac = LCLerp.calcParamFrac(param, param_f, param_t),
      pathLen = MATH_geometry._pathLen(pathData, dim),
      pathSegLens = MATH_geometry._pathSegLens(thisFun.tmpArr, pathData, dim);

    while(i < iCap) {
      tmpFrac1 = tmpFrac2;
      tmpFrac2 += pathSegLens[i] / pathLen;
      if(tmpFrac2 > paramFrac) {
        tmpFrac3 = (paramFrac - tmpFrac1) / (tmpFrac2 - tmpFrac1);
        dim._it(ind => {
          tup.push(Mathf.lerp(pathData[i * dim + ind], pathData[i * dim + dim + ind], tmpFrac3));
        });
        break;
      };
      i++;
    };
    if(tmpFrac3 == null) dim._it(ind => tup.push(pathData[ind]));

    return tup;
  }
  .setProp({
    tmpArr: [],
  });
  exports.pathLerp = pathLerp;


  /**
   * Bilinear version of {@link pathLerp}.
   * @param {Array|unset} contTup
   * @param {PointArray} pathData1
   * @param {PointArray} pathData2
   * @param {number|unset} dim
   * @param {number} param1
   * @param {number} param2
   * @param {number} a
   * @param {number|unset} [param1_f]
   * @param {number|unset} [param1_t]
   * @param {number|unset} [param2_f]
   * @param {number|unset} [param2_t]
   * @return {Array<number>}
   */
  const pathBiLerp = function thisFun(contTup, pathData1, pathData2, dim, param1, param2, a, param1_f, param1_t, param2_f, param2_t) {
    thisFun.tmpArrs[0].clear();
    thisFun.tmpArrs[1].clear();
    thisFun.tmpArrs[2].clear();
    pathLerp(thisFun.tmpArrs[0], pathData1, dim, param1, param1_f, param1_t);
    pathLerp(thisFun.tmpArrs[1], pathData2, dim, param2, param2_f, param2_t);
    thisFun.tmpArrs[2].pushAll(thisFun.tmpArrs[0]).pushAll(thisFun.tmpArrs[1]);

    return pathLen(contTup, thisFun.tmpArrs[2], dim, a);
  }
  .setProp({
    tmpArrs: [
      [], [], [],
    ],
  });
  exports.pathBiLerp = pathBiLerp;


  /* <------------------------------ interp ------------------------------ */


  /**
   * Generalized way to use {@link Interp}.
   * @param {number} val_f
   * @param {number} val_t
   * @param {number} param
   * @param {Interp|unset} [interp]
   * @param {number|unset} [param_f]
   * @param {number|unset} [param_t]
   * @return {number}
   */
  const applyInterp = function(val_f, val_t, param, interp, param_f, param_t) {
    return param_f == null || param_t == null ?
      (
        interp == null ?
          LCLerp.applyInterp(val_f, val_t, param) :
          LCLerp.applyInterp(val_f, val_t, param, interp)
      ) :
      (
        interp == null ?
          LCLerp.applyInterp(val_f, val_t, param, param_f, param_t) :
          LCLerp.applyInterp(val_f, val_t, param, interp, param_f, param_t)
      );
  };
  exports.applyInterp = applyInterp;
