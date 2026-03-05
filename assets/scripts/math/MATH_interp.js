/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods related to interpolation.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  function _paramFrac(param, param_f, param_t) {
    if(param_f == null) param_f = 0.0;
    if(param_t == null) param_t = 1.0;
    if(param == null) param = 0.0;
    if(param_f.fEqual(param_t)) return 0.0;

    return (param - param_f) / (param_t - param_f);
  };


  /**
   * Generalized lerp method.
   * @param {number} val_f
   * @param {number} val_t
   * @param {number|unset} [param]
   * @param {number|unset} [param_f]
   * @param {number|unset} [param_t]
   * @return {number}
   */
  const lerp = function(val_f, val_t, param, param_f, param_t) {
    return val_f + (val_t - val_f) * _paramFrac(param, param_f, param_t);
  };
  exports.lerp = lerp;


  /**
   * Smooth version of {@link lerp}.
   * @param {number} val_f
   * @param {number} val_t
   * @param {number|unset} [param]
   * @param {number|unset} [param_f]
   * @param {number|unset} [param_t]
   * @return {number}
   */
  const smoothLerp = function thisFun(val_f, val_t, param, param_f, param_t) {
    return val_f + (val_t - val_f) * thisFun.calcA(_paramFrac(param, param_f, param_t));
  }
  .setProp({
    calcA: function(paramFrac) {
      return Math.pow(paramFrac, 5) * 6.0 - Math.pow(paramFrac, 4) * 15.0 + Math.pow(paramFrac, 3) * 10.0;
    },
  });
  exports.smoothLerp = smoothLerp;


  /**
   * Bilinear version of {@link lerp}.
   * @param {number} val1_f
   * @param {number} val1_t
   * @param {number} val2_f
   * @param {number} val2_t
   * @param {number|unset} [param1]
   * @param {number|unset} [param2]
   * @param {number|unset} [a_12]
   * @param {number|unset} [param1_f]
   * @param {number|unset} [param1_t]
   * @param {number|unset} [param2_f]
   * @param {number|unset} [param2_t]
   * @return {number}
   */
  const biLerp = function(val1_f, val1_t, val2_f, val2_t, param1, param2, a_12, param1_f, param1_t, param2_f, param2_t) {
    return lerp(
      lerp(val1_f, val1_t, param1, param1_f, param1_t),
      lerp(val2_f, val2_t, param2, param2_f, param2_t),
      a_12,
    );
  };
  exports.biLerp = biLerp;


  /**
   * Smooth version of {@link biLerp}.
   * @param {number} val1_f
   * @param {number} val1_t
   * @param {number} val2_f
   * @param {number} val2_t
   * @param {number|unset} [param1]
   * @param {number|unset} [param2]
   * @param {number|unset} [a_12]
   * @param {number|unset} [param1_f]
   * @param {number|unset} [param1_t]
   * @param {number|unset} [param2_f]
   * @param {number|unset} [param2_t]
   * @return {number}
   */
  const smoothBiLerp = function(val1_f, val1_t, val2_f, val2_t, param1, param2, a_12, param1_f, param1_t, param2_f, param2_t) {
    return smoothLerp(
      smoothLerp(val1_f, val1_t, param1, param1_f, param1_t),
      smoothLerp(val2_f, val2_t, param2, param2_f, param2_t),
      a_12,
    );
  };
  exports.smoothBiLerp = smoothBiLerp;


  /**
   * Path version of {@link lerp}.
   * @param {PathData} pathData
   * @param {number|unset} [dim]
   * @param {number|unset} [param]
   * @param {number|unset} [param_f]
   * @param {number|unset} [param_t]
   * @return {Array<number>} Result is returned as n-dimensional point.
   */
  const pathLerp = function(pathData, dim, param, param_f, param_t) {
    const tup = [];
    if(dim == null) dim = 2;

    let paramFrac = _paramFrac(param, param_f, param_t);
    let pathLen = MATH_geometry._pathLen(pathData, dim);
    let pathSegLens = MATH_geometry._pathSegLens(pathData, dim);
    let i = 0, iCap = pathSegLens.iCap();
    let tmpFrac1, tmpFrac2 = 0.0, tmpFrac3 = null;
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
  };
  exports.pathLerp = pathLerp;


  /**
   * Bilinear version of {@link pathLerp}.
   * @param {PathData} pathData1
   * @param {PathData} pathData2
   * @param {number|unset} [dim]
   * @param {number|unset} [param1]
   * @param {number|unset} [param2]
   * @param {number|unset} [a_12]
   * @param {number|unset} [param1_f]
   * @param {number|unset} [param1_t]
   * @param {number|unset} [param2_f]
   * @param {number|unset} [param2_t]
   * @return {Array<number>}
   */
  const pathBiLerp = function(pathData1, pathData2, dim, param1, param2, a_12, param1_f, param1_t, param2_f, param2_t) {
    return pathLerp([
      pathLerp(pathData1, dim, param1, param1_f, param1_t),
      pathLerp(pathData2, dim, param2, param2_f, param2_t),
    ].flatten(), dim, a_12);
  };
  exports.pathBiLerp = pathBiLerp;


  /**
   * Generalized way to use {@link Interp}.
   * @param {number} val_f
   * @param {number} val_t
   * @param {number|unset} [param]
   * @param {Interp|unset} [interp]
   * @param {number|unset} [param_f]
   * @param {number|unset} [param_t]
   * @return {number}
   */
  const applyInterp = function(val_f, val_t, param, interp, param_f, param_t) {
    return val_f + (val_f - val_t) * tryVal(interp, Interp.linear).apply(_paramFrac(param, param_f, param_t));
  };
  exports.applyInterp = applyInterp;
