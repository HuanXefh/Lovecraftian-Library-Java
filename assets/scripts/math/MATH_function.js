/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods used as mathematical functions.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  /**
   * Damped cosinusoid function.
   * @param {number} x
   * @param {number} mag
   * @param {number} decay
   * @param {number} omega
   * @param {number|unset} [phi]
   * @return {number}
   */
  const _f_dampCos = function(x, mag, decay, omega, phi) {
    return mag * Math.exp(-decay * x) * Math.cos(omega * x - tryVal(phi, 0.0));
  };
  exports._f_dampCos = _f_dampCos;


  /**
   * Gaussian function.
   * @param {number} x
   * @param {number} mu
   * @param {number} sigma
   * @return {number}
   */
  const _f_gaussian = function(x, mu, sigma) {
    return 1.0 / Math.sqrt(2.0 * Math.PI * Math.pow(sigma, 2))
      * Math.exp(-1.0 * Math.pow(x - mu, 2) / (2.0 * Math.pow(sigma, 2)));
  };
  exports._f_gaussian = _f_gaussian;


  /**
   * Derivative of `mathFun` at x.
   * @param {number} x
   * @param {function(): number} mathFun
   * @return {number}
   */
  const _f_deri = function thisFun(x, mathFun) {
    return (mathFun(x + thisFun.delta) - mathFun(x)) / thisFun.delta;
  }
  .setProp({
    delta: 0.00001,
  });
  exports._f_deri = _f_deri;


  /**
   * Riemann sum of `mathFun` over (base, cap).
   * Uses midpoints for less error.
   * @param {number} base
   * @param {number} cap
   * @param {function(): number} mathFun
   * @param {number|unset} [segAmt]
   * @return {number}
   */
  const _f_riemannSum = function(base, cap, mathFun, segAmt) {
    if(segAmt == null) segAmt = 1000;

    let val = 0.0;
    let dx = (cap - base) / segAmt;
    for(let i = 0; i < segAmt; i++) {
      val += mathFun(base + dx * (0.5 + i));
    };

    return val * dx;
  };
  exports._f_riemannSum = _f_riemannSum;
