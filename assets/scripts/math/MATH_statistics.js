/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods for statistical calculation.
   * @module lovec/math/MATH_statistics
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ param ------------------------------ */


  /**
   * Gets mean difference between `xs` and `ys`.
   * @param {Array<number>} xs
   * @param {Array<number>} ys
   * @return {number}
   */
  const getDiffMean = function(xs, ys) {
    return xs.subWith(ys).mean();
  };
  exports.getDiffMean = getDiffMean;


  /**
   * Gets standard deviation of `xs`.
   * @param {Array<number>} xs
   * @param {boolean|unset} [notSample]
   * @return {number}
   */
  const getStdDev = function(xs, notSample) {
    return Math.sqrt(getVari(xs, notSample));
  };
  exports.getStdDev = getStdDev;


  /**
   * Gets standard deviation of differences between `xs` and `ys`.
   * @param {Array<number>} xs
   * @param {Array<number>} ys
   * @param {boolean|unset} [notSample]
   * @return {number}
   */
  const getDiffStdDev = function(xs, ys, notSample) {
    return Math.sqrt(getDiffVari(xs, ys, notSample));
  };
  exports.getDiffStdDev = getDiffStdDev;


  /**
   * Calculates z-score of each number in `xs`.
   * @param {Array<number>} xs
   * @param {boolean|unset} [notSample]
   * @return {Array<number>}
   */
  const getZScore = function(xs, notSample) {
    let mean = xs.mean();
    let stdDev = getStdDev(xs, notSample);
    return xs.map(x => (x - mean) / stdDev);
  };
  exports.getZScore = getZScore;


  /**
   * Variant of {@link getZScore} with assigned mean value and standard deviation.
   * @param {Array<number>} xs
   * @param {number} mean
   * @param {number} stdDev
   * @param {boolean|unset} [notSample]
   * @return {Array<number>}
   */
  const getTScore = function(xs, mean, stdDev, notSample) {
    return getZScore(xs, notSample).inSituMap(x => x * stdDev + mean);
  };
  exports.getTScore = getTScore;


  /**
   * Gets relative error of `xs`.
   * @param {Array<number>} xs
   * @param {number} trueVal
   * @return {number}
   */
  const getErrRel = function(xs, trueVal) {
    let stdDev = getStdDev(xs);

    return (stdDev - trueVal) / trueVal;
  };
  exports.getErrRel = getErrRel;


  /**
   * Gets variation of `xs`.
   * @param {Array<number>} xs
   * @param {boolean|unset} [notSample]
   * @return {number}
   */
  const getVari = function(xs, notSample) {
    let val = 0.0;

    let mean = xs.mean();
    for(let x in xs) {
      val += Math.pow(x - mean, 2);
    };
    val /= notSample ? xs.length : (xs.length - 1);

    return val;
  };
  exports.getVari = getVari;


  /**
   * Gets variation of differences between `xs` and `ys`.
   * @param {Array<number>} xs
   * @param {Array<number>} ys
   * @param {boolean|unset} [notSample]
   * @return {number}
   */
  const getDiffVari = function(xs, ys, notSample) {
    return getVari(xs.subWith(ys), notSample);
  };
  exports.getDiffVari = getDiffVari;


  /**
   * Gets covariation of `xs` and `ys`.
   * @param {Array<number>} xs
   * @param {Array<number>} ys
   * @param {boolean|unset} [notSample]
   * @return {number}
   */
  const getCov = function(xs, ys, notSample) {
    let val = 0.0;
    if(xs == null) xs = Array.getIndexArray(ys.length, true);

    let meanX = xs.mean(), meanY = ys.mean();
    let iCap = xs.iCap();
    for(let i = 0; i < iCap; i++) {
      val += (xs[i] - meanX) * (ys[i] - meanY);
    };
    val /= notSample ? iCap : (iCap - 1);

    return val;
  };
  exports.getCov = getCov;


  /* <------------------------------ multi-dimensional ------------------------------ */


  /**
   * Gets covariation matrix of `xss`.
   * @param {Array<Array<number>>} xss
   * @param {boolean|unset} [notSample]
   * @return {MathMatrix}
   */
  const getCovMat = function(xss, notSample) {
    const matArr = [];

    for(let j = 0; j < xss.length; j++) {
      let rowArr = [];
      for(let i = 0; i < xss.length; i++) {
        rowArr.push(getCov(xss[j], xss[i], notSample));
      };
      matArr.push(rowArr);
    };

    return new MathMatrix(matArr);
  };
  exports.getCovMat = getCovMat;


  /* <------------------------------ regression ------------------------------ */


  /**
   * Linear regression.
   * @param {Array<number>} xs
   * @param {Array<number>} ys
   * @return {[number, number]} `TUPLE`: slip, intc.
   */
  const linearReg = function(xs, ys) {
    if(xs == null) xs = Array.getIndexArray(ys.length, true);

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
