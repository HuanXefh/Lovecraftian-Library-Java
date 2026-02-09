/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Global draw methods in Lovec.
   * Also responsible for color methods.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  TMP_Z = 0;
  TMP_Z_A = 0;
  TMP_Z_B = 0;
  TMP_XSCL = 1.0;
  TMP_YSCL = 1.0;
  TMP_REG = new TextureRegion();


  /* ----------------------------------------
   * NOTE:
   *
   * Used for draw methods to control z-layer.
   * Should always be called twice!
   * ---------------------------------------- */
  processZ = function(z) {
    if(z == null) return;

    if(!processZ.isTail) {
      TMP_Z = Draw.z();
      Draw.z(z);
    } else {
      Draw.z(TMP_Z);
    };

    processZ.isTail = !processZ.isTail;
  };
  processZ.isTail = false;


  /* ----------------------------------------
   * NOTE:
   *
   * Basically {Draw.scl}, which cannot be called in JS cauz it's name of both field and method.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Collection of methods related to RGB color.
   * ---------------------------------------- */
  RGB = {


    /* ----------------------------------------
     * NOTE:
     *
     * Used to define color converter methods.
     * ---------------------------------------- */
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


    calcLinearRgbParam: function(param) {
      return param < 0.04045 ?
        param / 12.92 :
        Math.pow((param + 0.055) / 1.055, 2.4);
    },


  };


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a grayscale color.
   * ---------------------------------------- */
  RGB.toGrayscale = RGB.newColorConvert(function(r, g, b, a) {
    let val = r * 0.2126 + g * 0.7152 + b * 0.0722;
    return Tmp.c1.set(val, val, val, a);
  });


  /* ----------------------------------------
   * NOTE:
   *
   * Creates a negative color.
   * ---------------------------------------- */
  RGB.toNegative = RGB.newColorConvert(function(r, g, b, a) {
    return Tmp.c1.set(1.0 - r, 1.0 - g, 1.0 - b, a);
  });


  /* ----------------------------------------
   * NOTE:
   *
   * Calculates luminance of a color.
   * ---------------------------------------- */
  RGB.calcLuminance = RGB.newColorConvert(function(r, g, b, a) {
    let
      rLinear = RGB.calcLinearRgbParam(r),
      gLinear = RGB.calcLinearRgbParam(g),
      bLinear = RGB.calcLinearRgbParam(b);

    return (rLinear * 0.2126 + gLinear * 0.7152 + bLinear * 0.0722) * a;
  });


  /* ----------------------------------------
   * NOTE:
   *
   * Calculates perceived lightness of a color.
   * ---------------------------------------- */
  RGB.calcLightness = RGB.newColorConvert(function(r, g, b, a) {
    let lumin = RGB.calcLuminance(r, g, b, a);
    return lumin < 0.008856 ?
      (lumin * 9.033) :
      ((Math.pow(lumin, 0.33333333) * 116.0 - 16.0) * 0.01);
  });
