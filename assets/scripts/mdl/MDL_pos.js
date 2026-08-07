/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods to calculate position.
   * Most methods are defined in {@link LCPos}.
   * @module lovec/mdl/MDL_pos
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /** @global */
  const SideFracModes = new CLS_enum({
    FRONT: 0,
    BACK: 1,
    SIDE: 2,
    NON_FRONT: 3,
    NON_BACK: 4,
  })
  .globalize("SideFracModes");


  /**
   * Calculates fraction of sides in contact.
   * @param {Building} b_f
   * @param {Building} b_t
   * @param {number|unset} [mode] - Determines which sides can be used. See {@link SideFracModes}.
   * @param {boolean|unset} [forceOneSide] - If true, only one side will be considered regardless of mode.
   * @param {boolean|unset} [useToAsParent] - If true, size of `b_t` will be used as denominator instead.
   * @return {number}
   */
  const calcSideFrac = function thisFun(b_f, b_t, mode, forceOneSide, useToAsParent) {
    if(mode == null) mode = SideFracModes.FRONT;
    if(!SideFracModes.has(mode)) return 0.0;

    let frac = 0.0;
    if(!b_f.block.rotate) {
      frac = LCPos.getTilesEdge(thisFun.tmpTs, b_f.tile, b_f.block.size, false).count(b_t, t => t.build) / thisFun.tmpTs.length * (forceOneSide ? 4.0 : 1.0);
    } else {
      switch(mode) {
        case SideFracModes.FRONT :
          frac = LCPos.getTilesRot(thisFun.tmpTs, b_f.tile, b_f.rotation, b_f.block.size).count(b_t, t => t.build) / thisFun.tmpTs.length;
          break;
        case SideFracModes.BACK :
          frac = LCPos.getTilesRot(thisFun.tmpTs, b_f.tile, Mathf.mod(b_f.rotation + 2, 4), b_f.block.size).count(b_t, t => t.build) / thisFun.tmpTs.length;
          break;
        case SideFracModes.SIDE :
          frac = (LCPos.getTilesRot(thisFun.tmpTs, b_f.tile, Mathf.mod(b_f.rotation + 1, 4), b_f.block.size).count(b_t, t => t.build) + LCPos.getTilesRot(b_f.tile, Mathf.mod(b_f.rotation - 1, 4), b_f.block.size, thisFun.tmpTs).count(b_t, t => t.build)) / thisFun.tmpTs.length;
          break;
        case SideFracModes.NON_FRONT :
          frac = LCPos.getTilesEdge(thisFun.tmpTs, b_f.tile, b_f.block.size, false).count(b_t, t => LCPos.getRotation(b_f.tile, t) === b_f.rotation ? null : t.build) * 4.0 / thisFun.tmpTs.length;
          break;
        case SideFracModes.NON_BACK :
          frac = LCPos.getTilesEdge(thisFun.tmpTs, b_f.tile, b_f.block.size, false).count(b_t, t => LCPos.getRotation(b_f.tile, t) === Mathf.mod(b_f.rotation + 2, 4) ? null : t.build) * 4.0 / thisFun.tmpTs.length;
          break;
      };
    };

    return !useToAsParent ?
      frac :
      (frac * b_f.block.size / b_t.block.size);
  }
  .setProp({
    tmpTs: [],
  });
  exports.calcSideFrac = calcSideFrac;
