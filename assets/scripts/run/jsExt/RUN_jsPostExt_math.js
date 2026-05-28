/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * More methods for mathematical calculation.
   */


/*
  ========================================
  Section: Definition (Function)
  ========================================
*/


  /** @global */
  const ConvolutionModes = new CLS_enum({
    FULL: 0,
    SAME: 1,
    VALID: 2,
  })
  .globalize("ConvolutionModes");


  /**
   * Performs convolution between two arrays.
   * @param {Array<number>} arr
   * @param {number|unset} [mode]
   * @param {Array<number>|unset} [contArr]
   * @return {Array<number>}
   */
  Array.prototype.convol = function(arr, mode, contArr) {
    if(this.length === 0 || arr.length === 0) throw new Error("Cannot perform convolution on empty array!");
    if(mode == null) mode = ConvolutionModes.FULL;

    let i = 0, iCap = this.iCap(), j, jCap = arr.iCap();
    Array.prototype.convol.tmpArr.setVal(0.0, iCap + jCap - 1);
    while(i < iCap) {
      j = 0;
      while(j < jCap) {
        Array.prototype.convol.tmpArr[i + j] += this[i] * arr[j];
        j++;
      };
      i++;
    };

    let arr0 = contArr != null ? contArr.clear() : [];
    if(mode === ConvolutionModes.SAME) {
      let startInd = jCap % 2 !== 0 ?
        ((jCap - 1) * 0.5) :
        (jCap * 0.5 - 1);
      i = 0;
      while(i < iCap) {
        arr0.push(Array.prototype.convol.tmpArr[startInd + i]);
        i++;
      };
    } else if(mode === ConvolutionModes.VALID) {
      i = 0;
      let kCap = iCap - jCap + 1;
      while(i < kCap) {
        arr0.push(Array.prototype.convol.tmpArr[jCap - 1 + i]);
        i++;
      };
    } else {
      arr0.cpy(Array.prototype.convol.tmpArr);
    };

    return arr0;
  };
  Array.prototype.convol.tmpArr = [];
