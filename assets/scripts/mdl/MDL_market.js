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


  /* <---------- import ----------> */


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
   * @param {Team|unset} [team]
   * @return {number}
   */
  const _bitAmt = function(team) {
    if(team == null) return 0.0;

    let raw = SAVE.get("bits").read(team.toString(), null);
    let amt = raw == null ? 0.0 : Number(raw);
    let hash = Number(SAVE.get("bit-hash").read(team.toString(), 48.0));

    if(_bitHash(amt) === hash) {
      return amt;
    } else {
      Log.warn("[LOVEC] Bit amount does not match the hash value???");
      __bitAmt(team, 0.0);
      return 0.0;
    };

    return amt;
  }
  .setAnno("non-console", null, 0.0);
  exports._bitAmt = _bitAmt;


  /**
   * Sets amount of bits for a team.
   * @param {Team} team
   * @param {number} amt
   * @return {number}
   */
  const __bitAmt = function(team, amt) {
    if(amt < 0.0) amt = 0.0;

    let arr1 = SAVE.get("bits").cpy().write(team.toString(), String(amt));
    let arr2 = SAVE.get("bit-hash").cpy().write(team.toString(), _bitHash(amt));

    if(!Vars.net.client()) {
      SAVE.set("bits", arr1);
      SAVE.set("bit-hash", arr2);
    } else {
      SAVE.requestSet("bits", arr1);
      SAVE.requestSet("bit-hash", arr2);
    };

    return amt;
  }
  .setAnno("non-console");
  exports.__bitAmt = __bitAmt;


  /**
   * Adds or removes bits for a team.
   * @param {Team} team
   * @param {number} amtTrans
   * @return {number}
   */
  const addBit = function(team, amtTrans) {
    if(amtTrans.fEqual(0.0)) return;

    return __bitAmt(team, _bitAmt(team) + amtTrans);
  }
  .setAnno("non-console");
  exports.addBit = addBit;
