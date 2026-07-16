/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Global draw methods in Lovec, also responsible for color methods.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ base ------------------------------ */


  /**
   * Temporarily changes z-layer.
   * Should always be called twice!
   * @global
   * @param {number|unset} [z]
   * @param {number|unset} [ind]
   * @return {void}
   */
  processZ = function(z, ind) {
    if(z == null) z = -1;
    ind == null ?
      LCDraw.processZ(z) :
      LCDraw.processZ(z, ind);
  };


  /**
   * Temporarily changes scaling.
   * Should always be called twice!
   * @global
   * @param {number|unset} [xscl]
   * @param {number|unset} [yscl]
   * @param {number|unset} [ind]
   * @return {void}
   */
  processScl = function(xscl, yscl, ind) {
    if(xscl == null) xscl = 1.0;
    if(yscl == null) yscl = xscl;
    LCDraw.processScl(xscl, yscl, tryVal(ind, 0))
  };
