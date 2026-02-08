/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods related to interpolation.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MATH_geometry = require("lovec/math/MATH_geometry");


  /* <---------- base ----------> */


  function _paramFrac(param, param_f, param_t) {
    if(param_f == null) param_f = 0.0;
    if(param_t == null) param_t = 1.0;
    if(param == null) param = 0.0;
    if(param_f.fEqual(param_t)) return 0.0;

    return (param - param_f) / (param_t - param_f);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * More generalized lerp method.
   * ---------------------------------------- */
  const lerp = function(val_f, val_t, param, param_f, param_t) {
    return val_f + (val_t - val_f) * _paramFrac(param, param_f, param_t);
  };
  exports.lerp = lerp;


  /* ----------------------------------------
   * NOTE:
   *
   * Smooth version of {lerp}.
   * ---------------------------------------- */
  const smoothLerp = function thisFun(val_f, val_t, param, param_f, param_t) {
    return val_f + (val_t - val_f) * thisFun.calcA(_paramFrac(param, param_f, param_t));
  }
  .setProp({
    calcA: function(paramFrac) {
      return Math.pow(paramFrac, 5) * 6.0 - Math.pow(paramFrac, 4) * 15.0 + Math.pow(paramFrac, 3) * 10.0;
    },
  });
  exports.smoothLerp = smoothLerp;


  /* ----------------------------------------
   * NOTE:
   *
   * Bilinear version of {lerp}.
   * ---------------------------------------- */
  const biLerp = function(val1_f, val1_t, val2_f, val2_t, param1, param2, a_12, param1_f, param1_t, param2_f, param2_t) {
    return lerp(
      lerp(val1_f, val1_t, param1, param1_f, param1_t),
      lerp(val2_f, val2_t, param2, param2_f, param2_t),
      a_12,
    );
  };
  exports.biLerp = biLerp;


  /* ----------------------------------------
   * NOTE:
   *
   * Smooth version of {biLerp}.
   * ---------------------------------------- */
  const smoothBiLerp = function(val1_f, val1_t, val2_f, val2_t, param1, param2, a_12, param1_f, param1_t, param2_f, param2_t) {
    return smoothLerp(
      smoothLerp(val1_f, val1_t, param1, param1_f, param1_t),
      smoothLerp(val2_f, val2_t, param2, param2_f, param2_t),
      a_12,
    );
  };
  exports.smoothBiLerp = smoothBiLerp;


  /* ----------------------------------------
   * NOTE:
   *
   * Lerp method on a series of points.
   * This returns an n-tuple whose length depends on {dim}.
   * ---------------------------------------- */
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
        dim._it(1, ind => {
          tup.push(Mathf.lerp(pathData[i * dim + ind], pathData[i * dim + dim + ind], tmpFrac3));
        });
        break;
      };
      i++;
    };

    if(tmpFrac3 == null) dim._it(1, ind => tup.push(pathData[ind]));

    return tup;
  };
  exports.pathLerp = pathLerp;


  /* ----------------------------------------
   * NOTE:
   *
   * The path version of {biLerp}.
   * ---------------------------------------- */
  const pathBiLerp = function(pathData1, pathData2, dim, param1, param2, a_12, param1_f, param1_t, param2_f, param2_t) {
    return pathLerp([
      pathLerp(pathData1, dim, param1, param1_f, param1_t),
      pathLerp(pathData2, dim, param2, param2_f, param2_t),
    ].flatten(), dim, a12);
  };
  exports.pathBiLerp = pathBiLerp;


  /* ----------------------------------------
   * NOTE:
   *
   * More generalized interpolation method.
   * ---------------------------------------- */
  const applyInterp = function(val_f, val_t, param, interp, param_f, param_t) {
    return val_f + (val_f - val_t) * tryVal(interp, Interp.linear).apply(_paramFrac(param, param_f, param_t));
  };
  exports.applyInterp = applyInterp;
