/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Handles bit, a currency provided by Lovec.
   * Bit data is saved for each map.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  /**
   * Gets the hash value for current amount of bits.
   * @param {number} amt
   * @return {number}
   */
  const _bitHash = function(amt) {
    return String(amt + amt % 2 + amt % 3 + amt % 5 + amt % 7 + amt % 11).toHash() % 1000000.0;
  }
  .setAnno("non-console", null, 1145141919810);
  exports._bitHash = _bitHash;


  /**
   * Gets current amount of bits for a team.
   * @param {Team} team
   * @param {boolean|unset} [isGlobal]
   * @return {number}
   */
  const _bitAmt = function(team, isGlobal) {
    let raw = SAVE.get("bits", isGlobal).read(team.toString(), null);
    let amt = raw == null ? 0.0 : Number(raw);
    let hash = Number(SAVE.get("bit-hash", isGlobal).read(team.toString(), 48.0));

    if(_bitHash(amt) === hash) {
      return amt;
    };
    Log.warn("[LOVEC] Bit amount does not match the hash value???");
    __bitAmt(team, 0.0, isGlobal);
    return 0.0;
  }
  .setAnno("non-console", null, 0.0);
  exports._bitAmt = _bitAmt;


  /**
   * Sets amount of bits for a team.
   * @param {Team} team
   * @param {number} amt
   * @param {boolean|unset} [isGlobal]
   * @return {number}
   */
  const __bitAmt = function thisFun(team, amt, isGlobal) {
    if(amt < 0.0) amt = 0.0;

    thisFun.tmpArr1.cpy(SAVE.get("bits", isGlobal)).write(team.toString(), String(amt));
    thisFun.tmpArr2.cpy(SAVE.get("bit-hash", isGlobal)).write(team.toString(), _bitHash(amt));

    if(!Vars.net.client()) {
      SAVE.set("bits", thisFun.tmpArr1, isGlobal);
      SAVE.set("bit-hash", thisFun.tmpArr2, isGlobal);
    } else {
      SAVE.requestSet("bits", thisFun.tmpArr1, isGlobal);
      SAVE.requestSet("bit-hash", thisFun.tmpArr2, isGlobal);
    };

    return amt;
  }
  .setProp({
    tmpArr1: [],
    tmpArr2: [],
  })
  .setAnno("non-console");
  exports.__bitAmt = __bitAmt;


  /**
   * Adds or removes bits for a team.
   * @param {Team} team
   * @param {number} amtTrans
   * @return {number}
   */
  const addBit = function(team, amtTrans, isGlobal) {
    if(amtTrans.fEqual(0.0)) return;

    return __bitAmt(team, _bitAmt(team, isGlobal) + amtTrans, isGlobal);
  }
  .setAnno("non-console");
  exports.addBit = addBit;


  /**
   * Converts bits to global bits for a team.
   * Use negative amount for reversed conversion.
   * @param {Team} team
   * @param {number} amtTrans
   * @return {number}
   */
  const uploadBit = function(team, amtTrans) {
    if(amtTrans.fEqual(0.0)) return 0.0;
    if(amtTrans > 0.0) {
      amtTrans = Math.min(_bitAmt(team), amtTrans);
      addBit(team, -amtTrans);
      addBit(team, amtTrans, true)
    } else {
      amtTrans = Math.min(_bitAmt(team, true), -amtTrans);
      addBit(team, amtTrans);
      addBit(team, -amtTrans, true);
    };

    return amtTrans;
  };
  exports.uploadBit = uploadBit;
