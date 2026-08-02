/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods to get coordinates, tiles and entities.
   * @module lovec/mdl/MDL_pos
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ rotation ------------------------------ */


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


  /* <------------------------------ loot unit ------------------------------ */


  /**
   * Gets a random loot at (x, y).
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   */
  const _loot = function thisFun(x, y, rad) {
    return _loots(thisFun.tmpLoots, x, y, tryVal(rad, 6.0)).random();
  }
  .setProp({
    tmpLoots: [],
  });
  exports._loot = _loot;


  /**
   * Variant of {@link _loot} that excludes some loot.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @param {Unit|unset} [loot]
   * @return {Unit|null}
   */
  const _lootOther = function thisFun(x, y, rad, loot) {
    return _loots(thisFun.tmpLoots, x, y, rad).pullAll(loot).random();
  }
  .setProp({
    tmpLoots: [],
  });
  exports._lootOther = _lootOther;


  /**
   * Gets loots in a circular range.
   * @param {Array|unset} contArr
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @return {Array<Unit>}
   */
  const _loots = function(contArr, x, y, rad) {
    let arr = contArr != null ? contArr.clear() : [];
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return arr;

    Units.nearby(null, x, y, rad, unit => {
      if(MDL_cond._isLoot(unit)) arr.push(unit);
    });

    return arr;
  };
  exports._loots = _loots;


  /**
   * Gets a random loot on given tiles.
   * @param {Array<Tile>} ts
   * @return {Unit|null}
   */
  const _lootByTs = function thisFun(ts) {
    return _lootsByTs(thisFun.tmpLoots, ts).random();
  }
  .setProp({
    tmpLoots: [],
  });
  exports._lootByTs = _lootByTs;


  /**
   * Variant of {@link _loots} that uses tile list instead.
   * @param {Array|unset} contArr
   * @param {Array<Tile>} ts
   * @return {Array<Unit>}
   */
  const _lootsByTs = function thisFun(contArr, ts) {
    let arr = contArr != null ? contArr.clear() : [];
    if(ts == null) return arr;

    ts.forEachFast(ot => {
      _loots(thisFun.tmpUnits, ot.worldx(), ot.worldy(), 6.0).forEachFast(loot => arr.pushUnique(loot));
    });

    return arr;
  }
  .setProp({
    tmpUnits: [],
  });
  exports._lootsByTs = _lootsByTs;


  /* <------------------------------ entity ------------------------------ */


  /**
   * Gets closest targetable entity.
   * @param {number} x
   * @param {number} y
   * @param {Team|unset} [team]
   * @param {number|unset} [rad]
   * @param {boolean|unset} [targetAir]
   * @param {boolean|unset} [targetGround]
   * @param {(function(TeamcGn): boolean)|unset} [boolF]
   * @return {HealthcGn|null}
   */
  const _eTg = function(x, y, team, rad, targetAir, targetGround, boolF) {
    if(team == null) return null;
    if(rad == null) rad = Number.n8;
    if(rad < 0.0001) return null;
    if(targetAir == null) targetAir = true;
    if(targetGround == null) targetGround = true;
    if(boolF == null) boolF = Function.airTrue;

    return Units.closestTarget(team, x, y, rad, ounit => ounit.checkTarget(targetAir, targetGround) && boolF(ounit), ot => targetGround && boolF(ot));
  };
  exports._eTg = _eTg;


  /**
   * Gets all valid target entities.
   * @param {Array|unset} contArr
   * @param {number} x
   * @param {number} y
   * @param {Team|unset} [team]
   * @param {number|unset} [rad]
   * @return {Array<HealthcGn>}
   */
  const _esTg = function(contArr, x, y, team, rad) {
    let arr = contArr != null ? contArr.clear() : [];

    if(team == null) return arr;
    if(rad == null) rad = Number.n8;
    if(rad < 0.0001) return arr;

    LCEntity.eachUnit(x, y, null, rad, ounit => MDL_cond._isEnemy(ounit, team), ounit => arr.push(ounit));
    LCEntity.eachBuild(x, y, null, rad, ob => MDL_cond._isEnemy(ob, team), ob => arr.push(ob));

    return arr;
  };
  exports._esTg = _esTg;


  /**
   * Gets targets in a chain like chained lightning.
   * @param {Array|unset} contArr
   * @param {number} x
   * @param {number} y
   * @param {Team|unset} [team]
   * @param {number|unset} [rad] - Maximum distance between position and the first target.
   * @param {number|unset} [chainRad] - Maximum distance between targets in the chain.
   * @param {number|unset} [chainCap] - Maximum targets in the chain.
   * @param {(function(TeamcGn): boolean)|unset} [chainRayCheck] - Determines whether the chain is blocked.
   * @return {Array<HealthcGn>}
   */
  const _esTgChain = function thisFun(contArr, x, y, team, rad, chainRad, chainCap, chainRayCheck) {
    let arr = contArr != null ? contArr.clear() : [];

    if(team == null) return arr;
    if(rad == null) rad = Number.n8;
    if(rad < 0.0001) return arr;
    if(chainRad == null) chainRad = 0.0;
    if(chainCap == null) chainCap = -1;
    if(chainRayCheck == null) chainRayCheck = Function.airFalse;

    let es = _esTg(thisFun.tmpEs, x, y, team, rad * 2.0);
    let tmpTg;
    let tmpX = x;
    let tmpY = y;
    let isFirst = true;
    let i = 0;
    while(chainCap < 0 ? true : i < chainCap) {
      tmpTg = Geometry.findClosest(tmpX, tmpY, es);
      if(tmpTg == null) break;
      if(Mathf.dst(tmpX, tmpY, tmpTg.x, tmpTg.y) > (isFirst ? rad : chainRad) + 0.0001) break;
      if(chainRayCheck(tmpX, tmpY, tmpTg.x, tmpTg.y)) break;

      arr.push(tmpTg);
      es.remove(tmpTg);
      tmpX = tmpTg.x;
      tmpY = tmpTg.y;

      isFirst = false;
      i++;
    };

    return arr;
  }
  .setProp({
    tmpEs: [],
  });
  exports._esTgChain = _esTgChain;


  /* <------------------------------ bullet ------------------------------ */


  /**
   * Gets bullets in a circular range.
   * @param {Array|unset} contArr
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @return {Bullet[]}
   */
  const _buls = function thisFun(contArr, x, y, rad) {
    let arr = contArr != null ? contArr.clear() : [];

    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return arr;

    Groups.bullet
    .intersect(x - rad, y - rad, rad * 2.0, rad * 2.0)
    .each(
      bul => bul.within(x, y, rad + bul.hitSize * 0.5),
      bul => arr.push(bul),
    );
    return arr;
  };
  exports._buls = _buls;


  /**
   * Iterates through bullets in range.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} rad
   * @param {Team|unset} team
   * @param {(function(Bullet): boolean)|unset} boolF
   * @param {function(Bullet): void} scr
   * @return {void}
   */
  const _it_buls = function(x, y, rad, team, boolF, scr) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(boolF == null) boolF = Function.airTrue;

    Groups.bullet
    .intersect(x - rad, y - rad, rad * 2.0, rad * 2.0)
    .each(
      bul => bul.team !== Team.derelict && (team == null ? true : bul.team !== team) && bul.within(x, y, rad + bul.hitSize * 0.5) && boolF(bul),
      bul => scr(bul),
    );
  };
  exports._it_buls = _it_buls;


  /**
   * Gets closest enemy bullet.
   * @param {number} x
   * @param {number} y
   * @param {Team|unset} [team]
   * @param {number|unset} [rad]
   * @param {boolean|unset} [ignoreHittable]
   */
  const _bulTg = function(x, y, team, rad, ignoreHittable) {
    if(team == null) return null;
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return null;

    let tmpDst = Number.n8;
    let bulTg = null, dst;
    _it_buls(
      x, y, rad, team,
      bul => ignoreHittable ? true : bul.type.hittable,
      bul => {
        dst = Mathf.dst(x, y, bul.x, bul.y);
        if(dst >= tmpDst) return;
        tmpDst = dst;
        bulTg = bul;
      },
    );

    return bulTg;
  };
  exports._bulTg = _bulTg;
