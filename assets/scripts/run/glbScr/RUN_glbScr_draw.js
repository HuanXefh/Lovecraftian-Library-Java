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


  /** @global */
  TMPS_Z = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  /** @global */
  TMPS_XSCL = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
  /** @global */
  TMPS_YSCL = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
  /** @global */
  TMPS_REG = [
    new TextureRegion(), new TextureRegion(), new TextureRegion(), new TextureRegion(), new TextureRegion(),
    new TextureRegion(), new TextureRegion(), new TextureRegion(), new TextureRegion(), new TextureRegion(),
  ];


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

    if(!processZ.isTail) {
      TMPS_Z[ind] = Draw.z();
      if(z != null) {
        Draw.z(z);
      };
    } else {
      Draw.z(TMPS_Z[ind]);
    };

    processZ.isTail = !processZ.isTail;
  };
  processZ.isTail = false;


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
      TMPS_XSCL[indX] = Draw.xscl;
      TMPS_YSCL[indY] = Draw.yscl;
      Draw.xscl = tryVal(xscl, 1.0);
      Draw.yscl = tryVal(yscl, tryVal(xscl, 1.0));
    } else {
      Draw.xscl = TMPS_XSCL[indX];
      Draw.yscl = TMPS_YSCL[indY];
    };

    processScl.isTail = !processScl.isTail;
  };
  processScl.isTail = false;
