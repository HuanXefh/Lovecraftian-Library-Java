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


  /* <---------- base ----------> */


  /**
   * Used to control z-layer.
   * Should always be called twice!
   * @global
   * @param {number|unset} [z]
   * @param {number|unset} [ind]
   * @return {void}
   */
  processZ = function(z, ind) {
    if(ind == null) ind = 0;

    if(!processZ.isTailArr[ind]) {
      processZ.zArr[ind] = Draw.z();
      if(z != null) {
        Draw.z(z);
      };
    } else {
      Draw.z(processZ.zArr[ind]);
    };

    processZ.isTailArr[ind] = !processZ.isTailArr[ind];
  };
  processZ.zArr = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
  processZ.isTailArr = [false, false, false, false, false, false, false, false, false, false];


  /**
   * Used to control scaling.
   * Basically {@link Draw.scl} which cannot be called in JS cauz it's name of both property and method.
   * Should always be called twice!
   * @global
   * @param {number|unset} [xscl]
   * @param {number|unset} [yscl]
   * @param {number|unset} [indX]
   * @param {number|unset} [indY]
   * @return {void}
   */
  processScl = function(xscl, yscl, indX, indY) {
    if(indX == null) indX = 0;
    if(indY == null) indY = indX;

    if(!processScl.isTail) {
      processScl.xsclArr[indX] = Draw.xscl;
      processScl.ysclArr[indY] = Draw.yscl;
      Draw.xscl = tryVal(xscl, 1.0);
      Draw.yscl = tryVal(yscl, tryVal(xscl, 1.0));
    } else {
      Draw.xscl = processScl.xsclArr[indX];
      Draw.yscl = processScl.ysclArr[indY];
    };

    processScl.isTailArr[indY] = !processScl.isTailArr[indY];
  };
  processScl.xsclArr = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
  processScl.ysclArr = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
  processScl.isTailArr = [false, false, false, false, false, false, false, false, false, false];
