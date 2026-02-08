/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles bit, a currency provided by Lovec.
   * Bit data is saved for each map.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const SAVE = require("lovec/glb/GLB_save");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the hash value for the current amount of bits.
   * ---------------------------------------- */
  const _bitHash = function(amt) {
    return String(amt + amt % 2 + amt % 3 + amt % 5 + amt % 7 + amt % 11).toHash() % 1000000.0;
  }
  .setAnno("non-console", null, 1145141919810);
  exports._bitHash = _bitHash;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets current amount of bits for a team.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Sets amount of bits for a team.
   * ---------------------------------------- */
  const __bitAmt = function(team, amt) {
    if(team == null || amt == null) return;
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


  /* ----------------------------------------
   * NOTE:
   *
   * Adds or removes some bits for a team.
   * ---------------------------------------- */
  const addBit = function(team, amtTrans) {
    if(team == null || amtTrans == null) return;
    if(amtTrans.fEqual(0.0)) return;

    return __bitAmt(team, _bitAmt(team) + amtTrans);
  }
  .setAnno("non-console");
  exports.addBit = addBit;
