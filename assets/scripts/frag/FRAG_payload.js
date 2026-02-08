/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods for payload.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const DB_block = require("lovec/db/DB_block");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Converts a block or unit type into a payload.
   * ---------------------------------------- */
  const _pay = function(ct_gn, team) {
    if(team == null) return null;

    let ct = global.lovecUtil.fun._ct(ct_gn);
    if(ct instanceof Block) {
      return new BuildPayload(ct, team);
    } else if(ct instanceof UnitType) {
      return new UnitPayload(ct.create(team));
    } else {
      return null;
    };
  };
  exports._pay = _pay;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the size of some content as payload.
   * ---------------------------------------- */
  const _paySize = function(ct_gn) {
    let ct = global.lovecUtil.fun._ct(ct_gn);
    if(ct instanceof Block) return ct.size;
    if(ct instanceof UnitType) return ct.hitSize / Vars.tilesize;
    return 1;
  }
  .setCache();
  exports._paySize = _paySize;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a list of payload input sites around {b}.
   * ---------------------------------------- */
  const _bsPayInput = function(b, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    let obj = DB_block.db["class"]["group"]["payloadSite"]
    b.proximity.each(
      ob => obj["dynamic"].hasIns(ob.block) ?
        true :
        obj["fixed"].hasIns(ob.block) && ob.relativeTo(b) === ob.rotation,
      ob => arr.push(ob),
    );

    return arr;
  };
  exports._bsPayInput = _bsPayInput;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a list of payload output sites around {b}.
   * ---------------------------------------- */
  const _bsPayOutput = function(b, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    let obj = DB_block.db["class"]["group"]["payloadSite"]
    b.proximity.each(
      ob => obj["dynamic"].hasIns(ob.block) ?
        true :
        obj["fixed"].hasIns(ob.block) && ob.relativeTo(b) !== ob.rotation && (
          !b.block.rotate ?
            true :
            b.relativeTo(ob) === b.rotation
        ),
      ob => arr.push(ob),
    );

    return arr;
  };
  exports._bsPayOutput = _bsPayOutput;


  /* <---------- crafting ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Takes a payload out of some building.
   * ---------------------------------------- */
  const takeAt = function(b) {
    let pay = null;
    if(b.getPayload() == null) return pay;

    pay = b.getPayload();
    let key = readClassFunMap(DB_block.db["class"]["group"]["payloadKey"], b.block, Function.air);
    if(key == null) {
      throw new Error("Payload key is not defined for [$1]???".format(b.block.name));
    } else {
      b[key] = null;
    };

    return pay;
  };
  exports.takeAt = takeAt;


  /* ----------------------------------------
   * NOTE:
   *
   * Produces a payload in some building.
   * ---------------------------------------- */
  const produceAt = function(b, pay, delay) {
    if(pay == null || !b.acceptPayload(b, pay)) return false;

    Time.run(tryVal(delay, 25.0), () => {
      b.handlePayload(b, pay);
    });

    return true;
  };
  exports.produceAt = produceAt;
