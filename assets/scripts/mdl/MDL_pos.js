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
   * Gets fraction of sides in contact.
   * @param {Building} b_f
   * @param {Building} b_t
   * @param {number|unset} [mode] - Determines which sides can be used. See {@link SideFracModes}.
   * @param {boolean|unset} [forceOneSide] - If true, only one side will be considered regardless of mode.
   * @param {boolean|unset} [useToAsParent] - If true, size of `b_t` will be used as denominator instead.
   * @return {number}
   */
  const _sideFrac = function thisFun(b_f, b_t, mode, forceOneSide, useToAsParent) {
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
  exports._sideFrac = _sideFrac;


  /* <------------------------------ raycast ------------------------------ */


  /* raycast check */


  /**
   * Whether the ray passes insulated blocks.
   * @param {number} x1
   * @param {number} x2
   * @param {number} y1
   * @param {number} y2
   * @param {Team|unset} [team]
   * @return {boolean}
   */
  const _rayCheck_insulated = function(x1, x2, y1, y2, team) {
    let ob;
    return LCRaycast.rayCheck(x1, y1, x2, y2, (tx, ty) => {
      ob = Vars.world.build(tx, ty);
      return ob != null && ob.isInsulated() && (team == null ? true : ob.team !== team);
    });
  };
  exports._rayCheck_insulated = _rayCheck_insulated;


  /**
   * Whether the ray passes laser absorbers.
   * @param {number} x1
   * @param {number} x2
   * @param {number} y1
   * @param {number} y2
   * @param {Team|unset} [team]
   * @return {boolean}
   */
  const _rayCheck_laser = function(x1, x2, y1, y2, team) {
    let ob;
    return LCRaycast.rayCheck(x1, y1, x2, y2, (tx, ty) => {
      ob = Vars.world.build(tx, ty);
      return ob != null && ob.block.absorbLasers && (team == null ? true : ob.team !== team);
    });
  };
  exports._rayCheck_laser = _rayCheck_laser;


  /**
   * Whether the ray passes solid blocks.
   * @param {number} x1
   * @param {number} x2
   * @param {number} y1
   * @param {number} y2
   * @return {boolean}
   */
  const _rayCheck_solid = function(x1, y1, x2, y2) {
    let ot;
    return LCRaycast.rayCheck(x1, y1, x2, y2, (tx, ty) => {
      ot = Vars.world.tile(tx, ty);
      return ot != null && ot.solid();
    });
  };
  exports._rayCheck_solid = _rayCheck_solid;


  /**
   * Variant of {@link _rayCheck_solid} for blocks that are solid to leg units.
   * @param {number} x1
   * @param {number} x2
   * @param {number} y1
   * @param {number} y2
   * @return {boolean}
   */
  const _rayCheck_legSolid = function(x1, y1, x2, y2) {
    return LCRaycast.rayCheck(x1, y1, x2, y2, (tx, ty) => {
      return EntityCollisions.legsSolid(tx, ty);
    });
  };
  exports._rayCheck_legSolid = _rayCheck_legSolid;


  /**
   * Whether the ray passes liquid or empty floor.
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {number|unset} [minRad] - Minimum radius required to return true.
   * @return {boolean}
   */
  const _rayCheck_mobileFlr = function(x1, y1, x2, y2, minRad) {
    if(minRad == null) minRad = 0.0;
    let ot;
    return LCRaycast.rayCheck(x1, y1, x2, y2, (tx, ty) => {
      ot = Vars.world.tile(tx, ty);
      return ot != null && Mathf.dst(x1, y1, x2, y2) >= minRad && (ot.floor() instanceof EmptyFloor || ot.floor().isLiquid);
    });
  };
  exports._rayCheck_mobileFlr = _rayCheck_mobileFlr;


  /* raycast find */


  /**
   * Gets first insulated building on the way.
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {Team|unset} [team]
   * @return {Building|null}
   */
  const _rayFind_insulated = function(x1, y1, x2, y2, team) {
    let ob;
    return LCRaycast.rayFind(x1, y1, x2, y2, (tx, ty) => {
      ob = Vars.world.build(tx, ty);
      return ob == null || !ob.isInsulated() || (team == null ? false : ob.team === team) ?
        null :
        ob;
    });
  };
  exports._rayFind_insulated = _rayFind_insulated;


  /**
   * Gets first laser absorber on the way.
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {Team|unset} [team]
   * @return {Building|null}
   */
  const _rayFind_laser = function(x1, y1, x2, y2, team) {
    let ob;
    return LCRaycast.rayFind(x1, y1, x2, y2, (tx, ty) => {
      ob = Vars.world.build(tx, ty);
      return ob == null || !ob.block.absorbLasers || (team == null ? false : ob.team === team) ?
        null :
        ob;
    });
  };
  exports._rayFind_laser = _rayFind_laser;


  /**
   * Gets first solid tile on the way.
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @return {Tile|null}
   */
  const _rayFind_solid = function(x1, y1, x2, y2) {
    let ot;
    return LCRaycast.rayFind(x1, y1, x2, y2, (tx, ty) => {
      ot = Vars.world.tile(tx, ty);
      return ot == null || !ot.solid() ?
        null :
        ot;
    });
  };
  exports._rayFind_solid = _rayFind_solid;


  /**
   * Gets first tile that is solid to leg units on the way.
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @return {Tile|null}
   */
  const _rayFind_legSolid = function(x1, y1, x2, y2) {
    let ot;
    return LCRaycast.rayFind(x1, y1, x2, y2, (tx, ty) => {
      ot = Vars.world.tile(tx, ty);
      return ot == null || !EntityCollisions.legsSolid(tx, ty) ?
        null :
        ot;
    });
  };
  exports._rayFind_legSolid = _rayFind_legSolid;


  /**
   * Gets first matching unit on the way.
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   * @param {function(Unit): boolean} boolF
   * @return {Unit|null}
   */
  const _rayFind_unit = function(x1, y1, x2, y2, boolF) {
    let ounit;
    return LCRaycast.rayFind(x1, y1, x2, y2, (tx, ty) => {
      ounit = _unit(tx.toFCoord(), ty.toFCoord(), 4.0);
      return ounit == null || !boolF(ounit) ?
        null :
        ounit;
    });
  };
  exports._rayFind_unit = _rayFind_unit;


  /* <------------------------------ unit ------------------------------ */


  /**
   * Gets a random non-loot unit at (x, y).
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @return {Unit|null}
   */
  const _unit = function thisFun(x, y, rad) {
    return _units(thisFun.tmpUnits, x, y, tryVal(rad, 6.0)).readRand();
  }
  .setProp({
    tmpUnits: [],
  });
  exports._unit = _unit;


  /**
   * Variant of {@link _unit} that excludes some unit.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @param {Unit|unset} [unit]
   * @return {Unit|null}
   */
  const _unitOther = function thisFun(x, y, rad, unit) {
    return _units(thisFun.tmpUnits, x, y, tryVal(rad, 6.0)).pullAll(unit).readRand();
  };
  exports._unitOther = _unitOther;


  /**
   * Gets non-loot units in a circular range.
   * @param {Array|unset} contArr
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @return {Array<Unit>}
   */
  const _units = function(contArr, x, y, rad) {
    let arr = contArr != null ? contArr.clear() : [];
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return arr;

    Units.nearby(null, x, y, rad, unit => {
      if(!MDL_cond._isIrregularUnit(unit)) arr.push(unit);
    });

    return arr;
  };
  exports._units = _units;


  /**
   * Iterates through non-loot units in range.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} rad
   * @param {Team|unset} team
   * @param {(function(Unit): boolean)|unset} boolF
   * @param {function(Unit): void} scr
   * @return {void}
   */
  const _it_units = function(x, y, rad, team, boolF, scr) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(team == null) team = null;
    if(boolF == null) boolF = Function.airTrue;

    Units.nearby(team, x, y, rad, unit => {
      if(!MDL_cond._isIrregularUnit(unit) && boolF(unit)) scr(unit);
    });
  };
  exports._it_units = _it_units;


  /**
   * Variant of {@link _units} for rectangular range.
   * @param {Array|unset} contArr
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [r]
   * @param {number|unset} [size]
   * @return {Array<Unit>}
   */
  const _unitsRect = function(contArr, x, y, r, size) {
    let arr = contArr != null ? contArr.clear() : [];
    if(r == null) r = 0;
    if(size == null) size = 1;
    let hw = (r + size * 0.5) * Vars.tilesize;

    Groups.unit.intersect(x - hw, y - hw, hw * 2.0, hw * 2.0, unit => {
      if(!MDL_cond._isIrregularUnit(unit)) arr.push(unit);
    });

    return arr;
  };
  exports._unitsRect = _unitsRect;


  /**
   * Variant of {@link _it_units} for rectangular range.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} r
   * @param {number|unset} size
   * @param {Team|unset} team
   * @param {(function(Unit): boolean)|unset} boolF
   * @param {function(Unit): void} scr
   * @return {void}
   */
  const _it_unitsRect = function(x, y, r, size, team, boolF, scr) {
    if(r == null) r = 0;
    if(size == null) size = 1;
    if(boolF == null) boolF = Function.airTrue;
    let hw = (r + size * 0.5) * Vars.tilesize;

    Groups.unit.intersect(x - hw, y - hw, hw * 2.0, hw * 2.0, unit => {
      if(!MDL_cond._isIrregularUnit(unit) && (team == null ? true : unit.team === team) && boolF(unit)) scr(unit);
    });
  };
  exports._it_unitsRect = _it_unitsRect;


  /**
   * Gets closest player unit.
   * @param {number} x
   * @param {number} y
   * @param {Team|unset} [team]
   * @param {number|unset} [rad]
   * @return {Unit|null}
   */
  const _unitPlayer = function(x, y, team, rad) {
    let unitPlayer = null;
    if(rad == null) rad = Number.n8;
    if(rad < 0.0001) return unitPlayer;

    let tmpRad = rad;
    let unit, dst;
    Groups.player.each(player => {
      unit = player.unit();
      if(unit != null && (team == null || unit.team === team)) {
        dst = Mathf.dst(x, y, unit.x, unit.y);
        if(dst < tmpRad) {
          tmpRad = dst;
          unitPlayer = unit;
        };
      };
    });

    return unitPlayer;
  };
  exports._unitPlayer = _unitPlayer;


  /**
   * Gets a player unit by name.
   * @param {string|unset} [name] - Leave empty to return yourself.
   * @return {Unit|null}
   */
  const _unitPlayerByName = function(name) {
    if(name == null) return Vars.player.unit();
    let player = Groups.player.find(tmp => tmp.name === name);
    return player == null ? null : player.unit();
  };
  exports._unitPlayerByName = _unitPlayerByName;


  /* <------------------------------ loot unit ------------------------------ */


  /**
   * Gets a random loot at (x, y).
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   */
  const _loot = function thisFun(x, y, rad) {
    return _loots(thisFun.tmpLoots, x, y, tryVal(rad, 6.0)).readRand();
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
    return _loots(thisFun.tmpLoots, x, y, rad).pullAll(loot).readRand();
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
    return _lootsByTs(thisFun.tmpLoots, ts).readRand();
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

    _it_units(x, y, null, rad, ounit => MDL_cond._isEnemy(ounit, team), ounit => arr.push(ounit));
    LCEntity.eachBuild(x, y, rad, null, ob => MDL_cond._isEnemy(ob, team), ob => arr.push(ob));

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
