/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods to get coorinates, tiles and entities.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- meta ----------> */


  const sizeOffsetPon2s = [

    [],

    [
      new Point2(0, 0),
    ],

    [
      new Point2(0, 0), new Point2(1, 0),
      new Point2(0, 1), new Point2(1, 1),
    ],

    [
      new Point2(-1, -1), new Point2(0, -1), new Point2(1, -1),
      new Point2(-1, 0), new Point2(0, 0), new Point2(1, 0),
      new Point2(-1, 1), new Point2(0, 1), new Point2(1, 1),
    ],

    [
      new Point2(-1, -1), new Point2(0, -1), new Point2(1, -1), new Point2(2, -1),
      new Point2(-1, 0), new Point2(0, 0), new Point2(1, 0), new Point2(2, 0),
      new Point2(-1, 1), new Point2(0, 1), new Point2(1, 1), new Point2(2, 1),
      new Point2(-1, 2), new Point2(0, 2), new Point2(1, 2), new Point2(2, 2),
    ],

    [
      new Point2(-2, -2), new Point2(-1, -2), new Point2(0, -2), new Point2(1, -2), new Point2(2, -2),
      new Point2(-2, -1), new Point2(-1, -1), new Point2(0, -1), new Point2(1, -1), new Point2(2, -1),
      new Point2(-2, 0), new Point2(-1, 0), new Point2(0, 0), new Point2(1, 0), new Point2(2, 0),
      new Point2(-2, 1), new Point2(-1, 1), new Point2(0, 1), new Point2(1, 1), new Point2(2, 1),
      new Point2(-2, 2), new Point2(-1, 2), new Point2(0, 2), new Point2(1, 2), new Point2(2, 2),
    ],

  ];
  exports.sizeOffsetPon2s = sizeOffsetPon2s;


  /* <---------- distance ----------> */


  /**
   * Calculates distance between tiles.
   * <br> <ARGS>: tx1, ty1, tx2, ty2.
   * <br> <ARGS>: t1, t2.
   * @return {number}
   */
  const _dstT = newMultiFunction(
    function(tx1, ty1, tx2, ty2) {
      return Mathf.dst(tx1, ty1, tx2, ty2) * Vars.tilesize;
    },
    function(t1, t2) {
      return t1 == null || t2 == null ?
        Number.n8 :
        _dstT(t1.x, t1.y, t2.x, t2.y);
    },
  );
  exports._dstT = _dstT;


  /* <---------- rotation ----------> */


  /**
   * Gets relative rotation from a tile to another tile.
   * @param {Tile} t_f
   * @param {Tile} t_t
   * @return {number}
   */
  const _rotTs = function(t_f, t_t) {
    let
      cond1 = t_t.x >= t_f.x,
      cond2 = t_t.y >= t_f.y,
      cond3 = Math.abs(t_t.x - t_f.x) >= Math.abs(t_t.y - t_f.y);

    return cond1 ?
      (cond3 ? 0 : (cond2 ? 1 : 3)) :
      (cond3 ? 2 : (cond2 ? 1 : 3));
  };
  exports._rotTs = _rotTs;


  /**
   * Variant of {@link _rotTs} for buildings.
   * @param {Building} b_f
   * @param {Building} b_t
   * @return {number}
   */
  const _rotBs = function(b_f, b_t) {
    return _rotTs(b_f.tile, b_t.tile);
  };
  exports._rotBs = _rotBs;


  /**
   * Gets fraction of sides in contact.
   * @param {Building} b_f
   * @param {Building} b_t
   * @param {boolean|unset} [forceOneSide]
   * @param {string|unset} [mode] - Determines which sides can be used. <br> <VALS>: "front", "back", "side", "non-front", "non-back".
   * @return {number}
   */
  const _sideFrac = function thisFun(b_f, b_t, forceOneSide, mode) {
    if(mode == null) mode = "front";

    if(!b_f.block.rotate) return _tsEdge(b_f.tile, b_f.block.size, false, thisFun.tmpTs).count(b_t, t => t.build) / thisFun.tmpTs.length * (forceOneSide ? 4.0 : 1.0);
    switch(mode) {
      case "front" : return _tsRot(b_f.tile, b_f.rotation, b_f.block.size, thisFun.tmpTs).count(b_t, t => t.build) / thisFun.tmpTs.length;
      case "back" : return _tsRot(b_f.tile, Mathf.mod(b_f.rotation + 2, 4), b_f.block.size, thisFun.tmpTs).count(b_t, t => t.build) / thisFun.tmpTs.length;
      case "side" : return (_tsRot(b_f.tile, Mathf.mod(b_f.rotation + 1, 4), b_f.block.size, thisFun.tmpTs).count(b_t, t => t.build) + _tsRot(b_f.tile, Mathf.mod(b_f.rotation - 1, 4), b_f.block.size, thisFun.tmpTs).count(b_t, t => t.build)) / thisFun.tmpTs.length;
      case "non-front": return _tsEdge(b_f.tile, b_f.block.size, false, thisFun.tmpTs).count(b_t, t => _rotTs(b_f.tile, t) === b_f.rotation ? null : t.build) * 4.0 / thisFun.tmpTs.length;
      case "non-back": return _tsEdge(b_f.tile, b_f.block.size, false, thisFun.tmpTs).count(b_t, t => _rotTs(b_f.tile, t) === Mathf.mod(b_f.rotation + 2, 4) ? null : t.build) * 4.0 / thisFun.tmpTs.length;
    };

    return 0.0;
  }
  .setProp({
    tmpTs: [],
  });
  exports._sideFrac = _sideFrac;


  /* <---------- raycast ----------> */


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


  /* <---------- coordinate ----------> */


  /**
   * Gets the back side position as a 2-tuple.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} size
   * @param {number} rot
   * @return {[number, number]} <TUP>: tgX, tgY.
   */
  const _coordsBack = function thisFun(x, y, size, rot) {
    let
      off = (tryVal(size, 1) + 0.5) * Vars.tilesize * 0.5,
      tgX = x,
      tgY = y;
    switch(rot) {
      case 0 :
        tgX = x - off;
        tgY = y;
        break;
      case 1 :
        tgX = x;
        tgY = y - off;
        break;
      case 2 :
        tgX = x + off;
        tgY = y;
        break;
      case 3 :
        tgX = x;
        tgY = y + off;
        break;
      default :
        ERROR_HANDLER.throw("nullArgument", "rot");
    };
    thisFun.tmpTup.clear().push(tgX, tgY);

    return thisFun.tmpTup;
  }
  .setProp({
    tmpTup: [],
  });
  exports._coordsBack = _coordsBack;


  /**
   * Gets player position as a 2-tup.
   * @return {[number, number]} <TUP>: x, y.
   */
  const _coordsPlayer = function thisFun() {
    let unit = Vars.player.unit();
    thisFun.tmpTup[0] = unit == null ? Number.n12 : unit.x;
    thisFun.tmpTup[1] = unit == null ? Number.n12 : unit.y;

    return thisFun.tmpTup;
  }
  .setProp({
    tmpTup: [],
  });
  exports._coordsPlayer = _coordsPlayer;


  /* <---------- tile ----------> */


  /**
   * Gets a tile by rotation from original tile, with the center as another tile.
   * Used for rotation of building list.
   * @param {Tile|null} t - Tile to rotate from.
   * @param {Tile|null} tCenter - The center position.
   * @param {number} rot
   * @param {number|unset} [size]
   * @param {number|unset} [sizeCenter]
   * @return {Tile|null}
   */
  const _tCenterRot = function(t, tCenter, rot, size, sizeCenter) {
    if(t == null || tCenter == null) return null;

    // WTF is going on
    let
      off = tryVal(size, 1) % 2 === 0 ? 0.5 : 0.0,
      offCenter = tryVal(sizeCenter, 1) % 2 === 0 ? 0.5 : 0.0;
    Tmp.v1.set(t.x + off - tCenter.x - offCenter, t.y + off - tCenter.y - offCenter);
    switch(rot) {
      case 0 :
        Tmp.v2.set(Tmp.v1.x, Tmp.v1.y);
        break;
      case 1 :
        Tmp.v2.set(-Tmp.v1.y, Tmp.v1.x);
        break;
      case 2 :
        Tmp.v2.set(-Tmp.v1.x, -Tmp.v1.y);
        break;
      case 3 :
        Tmp.v2.set(Tmp.v1.y, -Tmp.v1.x);
        break;
      default:
        ERROR_HANDLER.throw("nullArgument", "rot");
    };

    return Vars.world.tile(tCenter.x + Tmp.v2.x - off + offCenter, tCenter.y + Tmp.v2.y - off + offCenter);
  };
  exports._tCenterRot = _tCenterRot;


  /**
   * Gets the closest ore tile for some item.
   * @param {number} x
   * @param {number} y
   * @param {ItemGn} itm_gn
   * @return {Tile|null}
   */
  const _tOre = function(x, y, itm_gn) {
    if(itm_gn == null) return null;

    return Vars.indexer.findClosestOre(x, y, MDL_content._ct(itm_gn, "rs"));
  };
  exports._tOre = _tOre;


  /**
   * Gets the tile under mouse.
   * @return {Tile|null}
   */
  const _tMouse = function() {
    return Vars.headless ? null : Vars.world.tileWorld(Core.input.mouseWorldX(), Core.input.mouseWorldY());
  };
  exports._tMouse = _tMouse;


  /* <---------- tiles ----------> */


  /**
   * Gets tiles on a specific edge, like what's done in {@link WallCrafter}.
   * @param {Tile|null} t
   * @param {number} rot
   * @param {number|unset} [size]
   * @param {Array|unset} [contArr]
   * @return {Array<Tile>}
   */
  const _tsRot = function(t, rot, size, contArr) {
    const arr = contArr != null ? contArr.clear() : [];
    if(t == null) return arr;
    if(size == null) size = 1;

    let iBase, iCap;
    if(size % 2 === 0) {
      iBase = (size * 0.5 - 1) * -1;
      iCap = size * 0.5 + 1;
    } else {
      iBase = (size - 1) * -0.5;
      iCap = (size - 1) * 0.5 + 1;
    };

    let px, py;
    for(let i = iBase; i < iCap; i++) {
      if(size % 2 === 0) {
        switch(rot) {
          case 0 :
            px = size * 0.5 + 1;
            py = i;
            break;
          case 1 :
            px = i;
            py = size * 0.5 + 1;
            break;
          case 2 :
            px = size * -0.5;
            py = i;
            break;
          case 3 :
            px = i;
            py = size * -0.5;
            break;
        };
      } else {
        switch(rot) {
          case 0 :
            px = (size + 1) * 0.5;
            py = i;
            break;
          case 1 :
            px = i;
            py = (size + 1) * 0.5;
            break;
          case 2 :
            px = (size + 1) * -0.5;
            py = i;
            break;
          case 3 :
            px = i;
            py = (size + 1) * -0.5;
            break;
        };
      };

      let ot = t.nearby(px, py);
      if(ot != null) arr.push(ot);
    };

    return arr;
  };
  exports._tsRot = _tsRot;


  /**
   * Gets all tiles on the four edges.
   * @param {Tile|null} t
   * @param {number|unset} [size]
   * @param {boolean|unset} [isInside] - If true, this method will use inner edges instead.
   * @param {Array|unset} [contArr]
   * @return {Array<Tile>}
   */
  const _tsEdge = function(t, size, isInside, contArr) {
    const arr = contArr != null ? contArr.clear() : [];
    if(t == null) return arr;
    if(size == null) size = 1;

    let iCap = size * 4;
    let pons2 = isInside ? Edges.getInsideEdges(size) : Edges.getEdges(size);
    for(let i = 0; i < iCap; i++) {
      let ot = t.nearby(pons2[i]);
      if(ot != null) arr.push(ot);
    };

    return arr;
  };
  exports._tsEdge = _tsEdge;


  /**
   * Gets tiles in a rectangular range.
   * @param {Tile|null} t
   * @param {number|unset} [r]
   * @param {number|unset} [size]
   * @param {Array|unset} [contArr]
   * @return {Array<Tile>}
   */
  const _tsRect = function(t, r, size, contArr) {
    const arr = contArr != null ? contArr.clear() : [];
    if(t == null) return arr;
    if(r == null) r = 0;
    if(size == null) size = 1;

    let iBase, iCap;
    if(size % 2 === 0) {
      iBase = -(size * 0.5 - 1 + r);
      iCap = -iBase + 2;
    } else {
      iBase = -((size - 1) * 0.5 + r);
      iCap = -iBase + 1;
    };

    for(let i = iBase; i < iCap; i++) {
      for(let j = iBase; j < iCap; j++) {
        let ot = t.nearby(i, j);
        if(ot != null) arr.push(ot);
      };
    };

    return arr;
  };
  exports._tsRect = _tsRect;


  /**
   * Gets tiles that some block will occupy.
   * @param {Block} blk
   * @param {number} tx
   * @param {number} ty
   * @param {Array|unset} [contArr]
   * @return {Array<Tile>}
   */
  const _tsBlock = function(blk, tx, ty, contArr) {
    return _tsRect(Vars.world.tile(tx, ty), 0, blk.size, contArr);
  };
  exports._tsBlock = _tsBlock;


  /**
   * Gets tiles that some building occupies.
   * @param {Building} b
   * @param {Array|unset} [contArr]
   * @return {Array<Tile>}
   */
  const _tsBuild = function(b, contArr) {
    return _tsRect(b.tile, 0, b.block.size, contArr);
  };
  exports._tsBuild = _tsBuild;


  /**
   * Variant of {@link _tsRect} that uses rotation, like what's done in {@link UnitAssembler}.
   * @param {Tile|null} t
   * @param {number|unset} r
   * @param {number} rot
   * @param {number|unset} [size]
   * @param {Array|unset} [contArr]
   * @return {Array<Tile>}
   */
  const _tsRectRot = function(t, r, rot, size, contArr) {
    const arr = contArr != null ? contArr.clear() : [];
    if(t == null) return arr;
    if(r == null) r = 0;
    if(size == null) size = 1;

    let px = 0, py = 0;
    switch(rot) {
      case 0 :
        px = r + size;
        break;
      case 1 :
        py = r + size;
        break;
      case 2 :
        px = (size % 2 === 0) ? -(r + size) + 1 : -(r + size);
        break;
      case 3 :
        py = (size % 2 === 0) ? -(r + size) + 1 : -(r + size);
        break;
      default :
        ERROR_HANDLER.throw("nullArgument", "rot");
    };
    let ot = t.nearby(px, py);

    return ot == null ? arr : _tsRect(ot, r, size, arr);
  };
  exports._tsRectRot = _tsRectRot;


  /**
   * Gets tiles in a circular range.
   * @param {Tile|null} t
   * @param {number|unset} [r]
   * @param {number|unset} [size]
   * @param {Array|unset} [contArr]
   * @return {Array<Tile>}
   */
  const _tsCircle = function(t, r, size, contArr) {
    const arr = contArr != null ? contArr.clear() : [];
    if(t == null) return arr;
    if(r == null) r = 0;
    if(size == null) size = 1;

    let w = Vars.world.width();
    let h = Vars.world.height();

    if(size % 2 !== 0) {
      Geometry.circle(t.x, t.y, w, h, r, (tx, ty) => {
        let ot = Vars.world.tile(tx, ty);
        if(ot != null) arr.push(ot);
      });
    } else {
      let ot0;
      for(let i = 0; i < 4; i++) {
        ot0 = t.nearby(sizeOffsetPon2s[2][i]);
        if(ot0 == null) continue;
        Geometry.circle(ot0.x, ot0.y, w, h, r, (tx, ty) => {
          let ot = Vars.world.tile(tx, ty);
          if(ot != null && !arr.includes(ot)) arr.push(ot);
        });
      };
    };

    return arr;
  };
  exports._tsCircle = _tsCircle;


  /**
   * Gets tiles in range using Manhattan distance.
   * @param {Tile|null} t
   * @param {number|unset} [r]
   * @param {Array|unset} [contArr]
   * @return {Array<Tile>}
   */
  const _tsDstManh = function(t, r, contArr) {
    const arr = contArr != null ? contArr.clear() : [];
    if(t == null) return arr;
    if(r == null) r = 0;

    let iBase = -r, iCap = r + 1, jBase, jCap;
    for(let i = iBase; i < iCap; i++) {
      jBase = -(r - Math.abs(i));
      jCap = -jBase + 1;
      for(let j = jBase; j < jCap; j++) {
        let ot = t.nearby(i, j);
        if(ot != null) arr.push(ot);
      };
    };

    return arr;
  };
  exports._tsDstManh = _tsDstManh;


  /**
   * Gets linked tiles of some tile.
   * @param {Tile|null} t
   * @param {Array|unset} [contArr]
   * @return {Array<Tile>}
   */
  const _tsLinked = function(t, contArr) {
    const arr = contArr != null ? contArr.clear() : [];
    if(t == null) return arr;

    t.getLinkedTiles(ot => arr.push(ot));

    return arr;
  };
  exports._tsLinked = _tsLinked;


  /**
   * Iterates through linked tiles of some tile.
   * @param {Tile|null} t
   * @param {function(Tile): void} scr
   * @return {void}
   */
  const _it_linked = function(t, scr) {
    if(t == null) return;

    t.getLinkedTiles(scr);
  };
  exports._it_linked = _it_linked;


  /* building */


  /**
   * Gets buildings in a circular range.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @param {Array|unset} [contArr]
   * @return {Building[]}
   */
  const _bs = function(x, y, rad, contArr) {
    const arr = contArr != null ? contArr.clear() : [];
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return arr;

    Vars.indexer.eachBlock(null, x, y, rad, ob => true, ob => arr.push(ob));

    return arr;
  };
  exports._bs = _bs;


  /**
   * Gets building in given tiles, no duplicates.
   * @param {Array<Tile>} ts
   * @param {Array|unset} [contArr]
   * @return {Building[]}
   */
  const _bsTs = function(ts, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    ts.forEachFast(ot => {
      if(ot.build != null && !arr.includes(ot.build)) arr.push(ot.build);
    });

    return arr;
  };
  exports._bsTs = _bsTs;


  /**
   * Iterates through buildings in range.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} rad
   * @param {Team|unset} team
   * @param {(function(Building): boolean)|unset} boolF
   * @param {function(Building): void} scr
   * @return {void}
   */
  const _it_bs = function(x, y, rad, team, boolF, scr) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(team == null) team = null;
    if(boolF == null) boolF = Function.airTrue;

    Vars.indexer.eachBlock(team, x, y, rad, boolF, scr);
  };
  exports._it_bs = _it_bs;


  /**
   * Base for methods that find a building in range.
   * @param {number} x
   * @param {number} y
   * @param {Team|unset} team
   * @param {number|unset} rad
   * @param {function(Building): boolean} boolF
   * @return {Building|null}
   */
  const _b_base = function(x, y, team, rad, boolF) {
    if(team == null) return null;
    if(rad == null) rad = Number.n8;
    if(rad < 0.0001) return null;

    return Vars.indexer.findTile(team, x, y, rad, boolF);
  };
  exports._b_base = _b_base;


  /**
   * Finds a container for item transfer.
   * @param {number} x
   * @param {number} y
   * @param {Team|unset} team
   * @param {number|unset} rad
   * @param {ItemGn} itm_gn
   * @param {number|unset} [amt]
   * @return {Building|null}
   */
  const _b_cont = function(x, y, team, rad, itm_gn, amt) {
    let itm = MDL_content._ct(itm_gn, "rs");
    if(itm == null) return null;
    if(amt == null) amt = 0;
    if(amt < 1) return null;

    return _b_base(x, y, team, rad, b => MDL_cond._isContainer(b.block) && b.acceptStack(itm, amt) >= amt);
  };
  exports._b_cont = _b_cont;


  /**
   * Finds an active ore scanner.
   * @param {number} x
   * @param {number} y
   * @param {Team|unset} [team]
   * @param {number|unset} [rad]
   * @param {number|unset} [dpLvlReq]
   * @return {Building|null}
   */
  const _b_scan = function(x, y, team, rad, dpLvlReq) {
    return _b_base(x, y, team, rad, b => MDL_cond._isOreScanner(b.block) && b.block.delegee.scanTier >= tryVal(dpLvlReq, 0) && b.efficiency > 0.0 && Mathf.dst(x, y, b.x, b.y) < b.block.delegee.blkRad);
  };
  exports._b_scan = _b_scan;


  /* unit */


  /**
   * Gets a random non-loot unit at (x, y).
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @return {Unit|null}
   */
  const _unit = function thisFun(x, y, rad) {
    return _units(x, y, tryVal(rad, 6.0), thisFun.tmpUnits).readRand();
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
    return _units(x, y, tryVal(rad, 6.0), thisFun.tmpUnits).pullAll(unit).readRand();
  };
  exports._unitOther = _unitOther;


  /**
   * Gets non-loot units in a circular range.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @param {Array|unset} [contArr]
   * @return {Units[]}
   */
  const _units = function(x, y, rad, contArr) {
    const arr = contArr != null ? contArr.clear() : [];
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
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [r]
   * @param {number|unset} [size]
   * @param {Array|unset} [contArr]
   * @return {Units[]}
   */
  const _unitsRect = function(x, y, r, size, contArr) {
    const arr = contArr != null ? contArr.clear() : [];
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
  const _unitPl = function(x, y, team, rad) {
    let unitPlayer = null;
    if(rad == null) rad = Number.n8;
    if(rad < 0.0001) return unitPlayer;

    let tmpRad = rad;
    let unit, dst;
    Groups.player.each(pl => {
      unit = pl.unit();
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
  exports._unitPl = _unitPl;


  /**
   * Gets a player unit by name.
   * @param {string|unset} [nm] - Leave empty to return yourself.
   * @return {Unit|null}
   */
  const _unitPlNm = function(nm) {
    if(nm == null) return Vars.player.unit();
    let pl = Groups.player.find(tmp => tmp.name === nm);
    return pl == null ? null : pl.unit();
  };
  exports._unitPlNm = _unitPlNm;


  /* loot unit */


  /**
   * Gets a random loot at (x, y).
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   */
  const _loot = function thisFun(x, y, rad) {
    return _loots(x, y, tryVal(rad, 6.0), thisFun.tmpLoots).readRand();
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
    return _loots(x, y, rad, thisFun.tmpLoots).pullAll(loot).readRand();
  }
  .setProp({
    tmpLoots: [],
  });
  exports._lootOther = _lootOther;


  /**
   * Gets loots in a circular range.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @param {Array|unset} [contArr]
   * @return {Units[]}
   */
  const _loots = function(x, y, rad, contArr) {
    const arr = contArr != null ? contArr.clear() : [];
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
  const _lootTs = function thisFun(ts) {
    return _lootsTs(ts, thisFun.tmpLoots).readRand();
  }
  .setProp({
    tmpLoots: [],
  });
  exports._lootTs = _lootTs;


  /**
   * Variant of {@link _loots} that uses tile list instead.
   * @param {Array<Tile>} ts
   * @param {Array|unset} [contArr]
   * @return {Units[]}
   */
  const _lootsTs = function thisFun(ts, contArr) {
    const arr = contArr != null ? contArr.clear() : [];
    if(ts == null) return arr;

    ts.forEachFast(ot => {
      _loots(ot.worldx(), ot.worldy(), 6.0, thisFun.tmpUnits).forEachFast(loot => arr.pushUnique(loot));
    });

    return arr;
  }
  .setProp({
    tmpUnits: [],
  });
  exports._lootsTs = _lootsTs;


  /* entity */


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
   * @param {number} x
   * @param {number} y
   * @param {Team|unset} [team]
   * @param {number|unset} [rad]
   * @param {Array|unset} [contArr]
   * @return {HealthcGn[]}
   */
  const _esTg = function(x, y, team, rad, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    if(team == null) return arr;
    if(rad == null) rad = Number.n8;
    if(rad < 0.0001) return arr;

    _it_units(x, y, rad, null, ounit => MDL_cond._isEnemy(ounit, team), ounit => arr.push(ounit));
    _it_bs(x, y, rad, null, ob => MDL_cond._isEnemy(ob, team), ob => arr.push(ob));

    return arr;
  };
  exports._esTg = _esTg;


  /**
   * Gets targets in a chain like chained lightning.
   * @param {number} x
   * @param {number} y
   * @param {Team|unset} [team]
   * @param {number|unset} [rad] - Maximum distance between position and the first target.
   * @param {number|unset} [chainRad] - Maximum distance between targets in the chain.
   * @param {number|unset} [chainCap] - Maximum targets in the chain.
   * @param {(function(TeamcGn): boolean)|unset} [chainRayCheck] - Determines whether the chain is blocked.
   * @param {Array|unset} [contArr]
   * @return {HealthcGn[]}
   */
  const _esTgChain = function thisFun(x, y, team, rad, chainRad, chainCap, chainRayCheck, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    if(team == null) return arr;
    if(rad == null) rad = Number.n8;
    if(rad < 0.0001) return arr;
    if(chainRad == null) chainRad = 0.0;
    if(chainCap == null) chainCap = -1;
    if(chainRayCheck == null) chainRayCheck = Function.airFalse;

    let es = _esTg(x, y, team, rad * 2.0, thisFun.tmpEs);
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


  /* bullet */


  /**
   * Gets bullets in a circular range.
   * @param {number} x
   * @param {number} y
   * @param {number|unset} [rad]
   * @param {Array|unset} [contArr]
   * @return {Bullet[]}
   */
  const _buls = function thisFun(x, y, rad, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

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
