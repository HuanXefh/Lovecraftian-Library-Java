/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods for statistical calculation.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- param ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the mean difference between {xs} and {ys}.
   * ---------------------------------------- */
  const _diffMean = function(xs, ys) {
    return xs.subWith(ys).mean();
  };
  exports._diffMean = _diffMean;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the standard deviation of {xs}.
   * ---------------------------------------- */
  const _stdDev = function(xs, notSample) {
    return Math.sqrt(_vari(xs, notSample));
  };
  exports._stdDev = _stdDev;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the standard deviation of differences between {xs} and {ys}.
   * ---------------------------------------- */
  const _diffStdDev = function(xs, ys, notSample) {
    return Math.sqrt(_diffVari(xs, ys, notSample));
  };
  exports._diffStdDev = _diffStdDev;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the relative error of {xs}.
   * ---------------------------------------- */
  const _errRel = function(xs, trueVal) {
    let stdDev = _stdDev(xs);

    return (stdDev - trueVal) / trueVal;
  };
  exports._errRel = _errRel;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the variation of {xs}.
   * ---------------------------------------- */
  const _vari = function(xs, notSample) {
    let val = 0.0;

    let mean = xs.mean();
    for(let x in xs) {
      val += Math.pow(x - mean, 2);
    };
    val /= notSample ? xs.length : (xs.length - 1);

    return val;
  };
  exports._vari = _vari;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the variation of differences between {xs} and {ys}.
   * ---------------------------------------- */
  const _diffVari = function(xs, ys, notSample) {
    return _vari(xs.subWith(ys), notSample);
  };
  exports._diffVari = _diffVari;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the covariation of {xs} and {ys}.
   * ---------------------------------------- */
  const _cov = function(ys, xs, notSample) {
    let val = 0.0;
    if(xs == null) xs = Array.getIndArr(ys.length, true);

    let meanX = xs.mean(), meanY = ys.mean();
    let iCap = xs.iCap();
    for(let i = 0; i < iCap; i++) {
      val += (xs[i] - meanX) * (ys[i] - meanY);
    };
    val /= notSample ? iCap : (iCap - 1);

    return val;
  };
  exports._cov = _cov;


  /* <---------- regression ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Linear regression, returns slope and y-intercept as a 2-tuple.
   * ---------------------------------------- */
  const linearReg = function(ys, xs) {
    if(xs == null) xs = Array.getIndArr(ys.length, true);

    let meanX = xs.mean(), meanY = ys.mean();
    let iCap = xs.iCap();
    if(iCap < 2) return [0.0, 0.0];
    let tmp1 = 0.0, tmp2 = 0.0;
    for(let i = 0; i < iCap; i++) {
      tmp1 += Math.pow(xs[i] - meanX, 2);
      tmp2 += (xs[i] - meanX) * (ys[i] - meanY);
    };
    let slp = tmp2 / tmp1;
    let intc = meanY - meanX * slp;

    return [slp, intc];
  };
  exports.linearReg = linearReg;
