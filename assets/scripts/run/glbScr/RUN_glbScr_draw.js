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


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  /** @global */
  TMP_Z = 0;
  /** @global */
  TMP_Z_A = 0;
  /** @global */
  TMP_Z_B = 0;
  /** @global */
  TMP_XSCL = 1.0;
  /** @global */
  TMP_YSCL = 1.0;
  /** @global */
  TMP_REG = new TextureRegion();


  /**
   * Used to control z-layer.
   * Should always be called twice!
   * @global
   * @param {number|unset} [z]
   * @return {void}
   */
  processZ = function(z) {
    if(!processZ.isTail) {
      TMP_Z = Draw.z();
      if(z != null) {
        Draw.z(z);
      };
    } else {
      Draw.z(TMP_Z);
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
   * @return {void}
   */
  processScl = function(xscl, yscl) {
    if(!processScl.isTail) {
      TMP_XSCL = Draw.xscl;
      TMP_YSCL = Draw.yscl;
      Draw.xscl = tryVal(xscl, 1.0);
      Draw.yscl = tryVal(yscl, tryVal(xscl, 1.0));
    } else {
      Draw.xscl = TMP_XSCL;
      Draw.yscl = TMP_YSCL;
    };

    processScl.isTail = !processScl.isTail;
  };
  processScl.isTail = false;


  /**
   * Collection of methods related to RGB color.
   * @global
   */
  RGB = {


    /**
     * Used to define color converter methods.
     * @param {function(Number, Number, Number, Number): any} rgbaCaller - <ARGS>: r, g, b, a.
     * @return {function(): any}
     */
    newColorConvert: function(rgbaCaller) {
      return newMultiFunction(
        [Color], function(color) {
          return rgbaCaller(color.r, color.g, color.b, color.a);
        },
        ["number", "number", "number", "number"], function(r, g, b, a) {
          return rgbaCaller(r, g, b, a);
        },
        ["number", "number", "number"], function(r, g, b) {
          return rgbaCaller(r, g, b, 1.0);
        },
      );
    },


    /**
     * @param {number} param
     * @return {number}
     */
    calcLinearRgbParam: function(param) {
      return param < 0.04045 ?
        param / 12.92 :
        Math.pow((param + 0.055) / 1.055, 2.4);
    },


  };


  /**
   * Gets grayscale color.
   * <br> <ARGS>: color.
   * <br> <ARGS>: r, g, b, a.
   * <br> <ARGS>: r, g, b.
   * @return {Color}
   */
  RGB.toGrayscale = RGB.newColorConvert(function(r, g, b, a) {
    let val = r * 0.2126 + g * 0.7152 + b * 0.0722;
    return Tmp.c1.set(val, val, val, a);
  });


  /**
   * Gets negative color.
   * <br> <ARGS>: color.
   * <br> <ARGS>: r, g, b, a.
   * <br> <ARGS>: r, g, b.
   * @return {Color}
   */
  RGB.toNegative = RGB.newColorConvert(function(r, g, b, a) {
    return Tmp.c1.set(1.0 - r, 1.0 - g, 1.0 - b, a);
  });


  /**
   * Gets luminance of given color.
   * <br> <ARGS>: color.
   * <br> <ARGS>: r, g, b, a.
   * <br> <ARGS>: r, g, b.
   * @return {number}
   */
  RGB.calcLuminance = RGB.newColorConvert(function(r, g, b, a) {
    let
      rLinear = RGB.calcLinearRgbParam(r),
      gLinear = RGB.calcLinearRgbParam(g),
      bLinear = RGB.calcLinearRgbParam(b);

    return (rLinear * 0.2126 + gLinear * 0.7152 + bLinear * 0.0722) * a;
  });


  /**
   * Gets perceived lightness of given color.
   * <br> <ARGS>: color.
   * <br> <ARGS>: r, g, b, a.
   * <br> <ARGS>: r, g, b.
   * @return {number}
   */
  RGB.calcLightness = RGB.newColorConvert(function(r, g, b, a) {
    let lumin = RGB.calcLuminance(r, g, b, a);
    return lumin < 0.008856 ?
      (lumin * 9.033) :
      ((Math.pow(lumin, 0.33333333) * 116.0 - 16.0) * 0.01);
  });
