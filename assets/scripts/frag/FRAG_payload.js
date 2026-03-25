/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods for payload.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  /**
   * Converts a block or unit type into a payload.
   * @param {string|Block|UnitType|null} ct_gn
   * @param {Team} team
   * @return {Payload|null}
   */
  const _pay = function(ct_gn, team) {
    let ct = findContent(ct_gn);
    if(ct instanceof Block) {
      return new BuildPayload(ct, team);
    } else if(ct instanceof UnitType) {
      return new UnitPayload(ct.create(team));
    };

    return null;
  };
  exports._pay = _pay;


  /**
   * Gets size of some content as payload.
   * @param {string|Block|UnitType|null} ct_gn
   * @return {number}
   */
  const _paySize = function(ct_gn) {
    let ct = findContent(ct_gn);
    if(ct instanceof Block) return ct.size;
    if(ct instanceof UnitType) return ct.hitSize / Vars.tilesize;
    return 1;
  }
  .setCache();
  exports._paySize = _paySize;


  /**
   * Gets a list of payload input sites around `b`.
   * @param {Building} b
   * @param {Array|unset} [contArr]
   * @return {Array<Building>}
   */
  const _bsPayInput = function(b, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    let obj = DB_block.db["class"]["group"]["payloadSite"];
    b.proximity.each(
      ob => MDL_pos._sideFrac(ob, b, true) >= 0.5 && (
        obj["dynamic"].hasIns(ob.block) ?
          true :
          obj["fixed"].hasIns(ob.block) && ob.relativeTo(b) === ob.rotation
      ),
      ob => arr.push(ob),
    );

    return arr;
  };
  exports._bsPayInput = _bsPayInput;


  /**
   * Gets a list of payload output sites around `b`.
   * @param {Building} b
   * @param {Array|unset} [contArr]
   * @return {Array<Building>}
   */
  const _bsPayOutput = function(b, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    let obj = DB_block.db["class"]["group"]["payloadSite"];
    b.proximity.each(
      ob => MDL_pos._sideFrac(b, ob, true) >= 0.5 && (
        obj["dynamic"].hasIns(ob.block) ?
          true :
          obj["fixed"].hasIns(ob.block) && ob.relativeTo(b) !== ob.rotation && (
            !b.block.rotate ?
              true :
              b.relativeTo(ob) === b.rotation
          )
      ),
      ob => arr.push(ob),
    );

    return arr;
  };
  exports._bsPayOutput = _bsPayOutput;


  /* <---------- crafting ----------> */


  /**
   * Takes a payload out of some building.
   * @param {Building} b
   * @return {Payload|null}
   */
  const takeAt = function(b) {
    let pay = null;
    if(b.getPayload() == null) return pay;

    pay = b.getPayload();
    let key = readClassFunMap(DB_block.db["class"]["group"]["payloadKey"], b.block, Function.air);
    if(key == null) {
      throw new Error("Payload key is not defined for ${1}???".format(b.block.name));
    } else {
      b[key] = null;
    };

    return pay;
  };
  exports.takeAt = takeAt;


  /**
   * Produces a payload in some building.
   * @param {Building} b
   * @param {Payload|null} pay
   * @param {number|unset} [delay] - Used for effect.
   * @return {boolean}
   */
  const produceAt = function(b, pay, delay) {
    if(pay == null || !b.acceptPayload(b, pay)) return false;

    Time.run(tryVal(delay, 25.0), () => {
      b.handlePayload(b, pay);
      Fx.placeBlock.at(b, pay.size() / Vars.tilesize);
      MDL_effect._s_payloadDrop(b.x, b.y, pay.content());
    });

    return true;
  };
  exports.produceAt = produceAt;
