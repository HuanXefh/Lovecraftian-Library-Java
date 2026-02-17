/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods to get coorinates, tiles and entities.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MATH_geometry = require("lovec/math/MATH_geometry");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");


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


  /* ----------------------------------------
   * NOTE:
   *
   * Distance calculation for tile coordinates.
   * ---------------------------------------- */
  const _dstT = function(tx1, ty1, tx2, ty2) {
    if(tx1 == null || ty1 == null || tx2 == null || ty2 == null) return Number.n8;

    return Mathf.dst(tx1, ty1, tx2, ty2) * Vars.tilesize;
  };
  exports._dstT = _dstT;


  /* <---------- rotation ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets relative rotation from {t_f} to {t_t}.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {_rotTs} for buildings.
   * ---------------------------------------- */
  const _rotBs = function(b_f, b_t) {
    return _rotTs(b_f.tile, b_t.tile);
  };
  exports._rotBs = _rotBs;


  /* ----------------------------------------
   * NOTE:
   *
   * Fraction of sides of {b_f} touched by {b_t}.
   * ---------------------------------------- */
  const _sideFrac = function thisFun(b_f, b_t) {
    return (
      !b_f.block.rotate ?
        _tsEdge(b_f.tile, b_f.block.size, false, thisFun.tmpTs) :
        _tsRot(b_f.tile, b_f.rotation, b_f.block.size, thisFun.tmpTs)
    ).count(b_t, t => t.build) / thisFun.tmpTs.length;
  }
  .setProp({
    tmpTs: [],
  });
  exports._sideFrac = _sideFrac;


  /* <---------- raycast ----------> */


  /* raycast check */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the ray passes insulated blocks.
   * ---------------------------------------- */
  const _rayCheck_insulated = function(x1, x2, y1, y2, team) {
    let ob;
    return LCRaycast.rayCheck(x1, y1, x2, y2, (tx, ty) => {
      ob = Vars.world.build(tx, ty);
      return ob != null && ob.isInsulated() && (team == null ? true : ob.team !== team);
    });
  };
  exports._rayCheck_insulated = _rayCheck_insulated;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the ray passes laser absorbers.
   * ---------------------------------------- */
  const _rayCheck_laser = function(x1, x2, y1, y2, team) {
    let ob;
    return LCRaycast.rayCheck(x1, y1, x2, y2, (tx, ty) => {
      ob = Vars.world.build(tx, ty);
      return ob != null && ob.block.absorbLasers && (team == null ? true : ob.team !== team);
    });
  };
  exports._rayCheck_laser = _rayCheck_laser;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the ray passes solid blocks.
   * ---------------------------------------- */
  const _rayCheck_solid = function(x1, y1, x2, y2) {
    let ot;
    return LCRaycast.rayCheck(x1, y1, x2, y2, (tx, ty) => {
      ot = Vars.world.tile(tx, ty);
      return ot != null && ot.solid();
    });
  };
  exports._rayCheck_solid = _rayCheck_solid;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the ray passes mobile floor blocks.
   * Liquid floor and empty floor are considered mobile, which may reduce the transmission of impact wave.
   * Use {minRad} to set the minimum range required to return {true}.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the first insulated building on the way.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the first laser-absorbing building on the way.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the first solid tile on the way.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the first matching unit on the way.
   * ---------------------------------------- */
  const _rayFind_unit = function(x1, y1, x2, y2, boolF, caller) {
    let ounit;
    return LCRaycast.rayFind(x1, y1, x2, y2, (tx, ty) => {
      ounit = _unit(tx.toFCoord(), ty.toFCoord(), 4.0, caller);
      return ounit == null || !boolF(ounit) ?
        null :
        ounit;
    });
  };
  exports._rayFind_unit = _rayFind_unit;


  /* <---------- coordinate ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the back side position as a 2-tuple.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Gets player position as a 2-tup.
   * ---------------------------------------- */
  const _coordsPlayer = function thisFun() {
    let unit = Vars.player.unit();
    thisFun.tmpTup.clear();
    unit == null ?
      thisFun.tmpTup.push(Number.n12, Number.n12) :
      thisFun.tmpTup.push(unit.x, unit.y);

    return thisFun.tmpTup;
  }
  .setProp({
    tmpTup: [],
  });
  exports._coordsPlayer = _coordsPlayer;


  /* <---------- tile ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the tile at given world position.
   * ---------------------------------------- */
  const _tPos = function(x, y) {
    return Vars.world.tileWorld(x, y);
  };
  exports._tPos = _tPos;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets another tile based on rotation.
   * ---------------------------------------- */
  const _tRot = function(t, rot) {
    if(t == null) return null;

    return t.nearby(Geometry.d4[rot]);
  };
  exports._tRot = _tRot;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a tile by rotation from {t}, with {tCenter} as the center.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Randomly selects a tile from a list of tiles, using {boolF} as the filter function.
   * Use {iCap} to manually set the max attempts to try.
   * ---------------------------------------- */
  const _tRand_base = function(ts, boolF, iCap) {
    if(iCap == null) iCap = ts.iCap();
    if(iCap === 0) return null;

    let i = 0;
    let t = null;
    while((i < iCap && (t == null || boolF(t))) || i === 0) {
      t = ts[(iCap - 1.0).randInt()];
      i++;
    };

    return t;
  };
  exports._tRand_base = _tRand_base;


  const _tRand_ground = function(ts, iCap) {
    return _tRand_base(ts, t => {
      return t.solid() || (t.floor().isLiquid && !t.floor().shallow);
    }, iCap);
  };
  exports._tRand_ground = _tRand_ground;


  const _tRand_naval = function(ts, iCap) {
    return _tRand_base(ts, t => {
      return t.solid() || !t.floor().isLiquid;
    }, iCap);
  };
  exports._tRand_naval = _tRand_naval;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the closest tile that has an ore for {itm_gn}.
   * ---------------------------------------- */
  const _tOre = function(x, y, itm_gn) {
    if(itm_gn == null) return null;

    return Vars.indexer.findClosestOre(x, y, MDL_content._ct(itm_gn, "rs"));
  };
  exports._tOre = _tOre;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the tile under your cursor.
   * ---------------------------------------- */
  const _tMouse = function() {
    return _tPos(Core.input.mouseWorldX(), Core.input.mouseWorldY());
  };
  exports._tMouse = _tMouse;


  /* <---------- tiles ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the tiles on a specific edge, according to {rot}.
   * Imagine a large WallCrafter.
   * ---------------------------------------- */
  const _tsRot = function(t, rot, size, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    if(t == null) return arr;
    if(rot == null) rot = 0;
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


  /* ----------------------------------------
   * NOTE:
   *
   * Gets all tiles on the edges, use {isInside} to get inner edges instead.
   * ---------------------------------------- */
  const _tsEdge = function(t, size, isInside, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    if(t == null) return arr;
    if(size == null) size = 1;

    var iCap = size * 4;
    let pons2 = isInside ? Edges.getInsideEdges(size) : Edges.getEdges(size);
    for(let i = 0; i < iCap; i++) {
      let ot = t.nearby(pons2[i]);
      if(ot != null) arr.push(ot);
    };

    return arr;
  };
  exports._tsEdge = _tsEdge;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets tiles in a rectangular range, which is a very common idea.
   * ---------------------------------------- */
  const _tsRect = function(t, r, size, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    if(t == null) return arr;
    if(r == null) r = 0;
    if(size == null) size = 1;

    let iBase, iCap;
    if(size % 2 == 0) {
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


  /* ----------------------------------------
   * NOTE:
   *
   * Gets tiles the block will occupy.
   * ---------------------------------------- */
  const _tsBlock = function(blk, tx, ty, contArr) {
    return _tsRect(Vars.world.tile(tx, ty), 0, blk.size, contArr);
  };
  exports._tsBlock = _tsBlock;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets tiles the building occupies.
   * ---------------------------------------- */
  const _tsBuild = function(b, contArr) {
    return _tsRect(b.tile, 0, b.block.size, contArr);
  };
  exports._tsBuild = _tsBuild;


  /* ----------------------------------------
   * NOTE:
   *
   * Like {_tsRect}, but rotation is included.
   * Image a UnitAssemblier.
   * ---------------------------------------- */
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

    return ot == null ? arr : _tsRect(ot, r, size, useTmp);
  };
  exports._tsRectRot = _tsRectRot;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets tiles in a circular range, like what's done for a Mender.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Gets tiles in a quilateral triangular range... weird.
   * ---------------------------------------- */
  const _tsTri = function(t, rad, ang, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    if(t == null) return arr;
    if(rad == null) rad = 0.0;
    if(ang == null) ang = 0.0;

    let
      x = t.worldx(),
      y = t.worldy(),
      x1 = x + rad * Mathf.cosDeg(ang + 90.0),
      y1 = y + rad * Mathf.sinDeg(ang + 90.0),
      x2 = x + rad * Mathf.cosDeg(ang + 210.0),
      y2 = y + rad * Mathf.sinDeg(ang + 210.0),
      x3 = x + rad * Mathf.cosDeg(ang + 330.0),
      y3 = y + rad * Mathf.sinDeg(ang + 330.0),
      r = Math.ceil(Math.abs(Mathf.dst(x1, y1, x2, y2) * Mathf.sinDeg(120.0 - ang) * 0.5) / Vars.tilesize);

    let iBase = -r, iCap = r + 1;
    for(let i = iBase; i < iCap; i++) {
      for(let j = iBase; j < iCap; j++) {
        let ot = t.nearby(i, j);
        if(ot != null && MATH_geometry._inPolygon(ot.worldx(), ot.worldy(), x1, y1, x2, y2, x3, y3)) arr.push(ot);
      };
    };

    return arr;
  };
  exports._tsTri = _tsTri;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets tiles with Manhattan distance less than or equal to {r}.
   * ---------------------------------------- */
  const _tsDstManh = function(t, r, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    if(t == null) return arr;
    if(r == null) r = 0;

    let iBase = -r;
    let iCap = r + 1;
    let jBase, jCap;
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


  /* ----------------------------------------
   * NOTE:
   *
   * Gets linked tiles of {t}.
   * ---------------------------------------- */
  const _tsLinked = function(t, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    if(t == null) return arr;

    t.getLinkedTiles(ot => arr.push(ot));

    return arr;
  };
  exports._tsLinked = _tsLinked;


  /* ----------------------------------------
   * NOTE:
   *
   * Iterates through linked tiles of {t}.
   * ---------------------------------------- */
  const _it_linked = function(t, scr) {
    if(t == null || scr == null) return;

    t.getLinkedTiles(scr);
  };
  exports._it_linked = _it_linked;


  /* <---------- entity ----------> */


  /* filter */


  const _f_base = function(es, scr) {
    return es.filter(e => scr(e));
  };
  exports._f_base = _f_base;


  const _f_nm = function(es, nm) {
    return _f_base(es, e => {
      if(e instanceof Building) return e.block.name === nm;
      if(e instanceof Unit) return e.type.name === nm;

      return false;
    });
  };
  exports._f_nm = _f_nm;


  const _f_team = function(es, team) {
    return _f_base(es, e => {
      return e.team === team;
    });
  };
  exports._f_team = _f_team;


  const _f_enemy = function(es, team) {
    return _f_base(es, e => {
      return (e.team !== Team.derelict) && (e.team !== team) && ((e instanceof Building) ? e.block.targetable : e.type.targetable);
    });
  };
  exports._f_enemy = _f_enemy;


  const _f_same = function(es, nm, team) {
    return _f_base(es, e => {
      if(e.team !== team) return false;

      if(e instanceof Building) return e.block.name === nm;
      if(e instanceof Unit) return e.type.name === nm;

      return false;
    });
  };
  exports._f_same = _f_same;


  /* building */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets all buildings in a circular range.
   * ---------------------------------------- */
  const _bs = function(x, y, rad, caller, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return arr;

    Vars.indexer.eachBlock(null, x, y, rad, ob => ob !== caller, ob => arr.push(ob));

    return arr;
  };
  exports._bs = _bs;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets all buildings in {ts}, no duplicates.
   * ---------------------------------------- */
  const _bsTs = function(ts, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    ts.forEachFast(ot => {
      if(ot.build != null && !arr.includes(ot.build)) arr.push(ot.build);
    });

    return arr;
  };
  exports._bsTs = _bsTs;


  /* ----------------------------------------
   * NOTE:
   *
   * Iterates through buildings in range that match {boolF}.
   * Much less costy than using {ts}!
   * ---------------------------------------- */
  const _it_bs = function(x, y, rad, team, boolF, scr) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(team == null) team = null;
    if(boolF == null) boolF = Function.airTrue;

    Vars.indexer.eachBlock(team, x, y, rad, boolF, scr);
  };
  exports._it_bs = _it_bs;


  /* ----------------------------------------
   * NOTE:
   *
   * Base for methods that find a building with {boolF}.
   * {team} is required.
   * ---------------------------------------- */
  const _b_base = function(x, y, team, rad, boolF) {
    if(team == null) return null;
    if(rad == null) rad = Number.n8;
    if(rad < 0.0001) return null;

    return Vars.indexer.findTile(team, x, y, rad, boolF);
  };
  exports._b_base = _b_base;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a container for item transfer.
   * ---------------------------------------- */
  const _b_cont = function(x, y, team, rad, itm, amt) {
    if(itm == null) return null;
    if(amt == null) amt = 0;
    if(amt < 1) return null;

    return _b_base(x, y, team, rad, b => MDL_cond._isContainer(b.block) && b.acceptStack(itm, amt) >= amt);
  };
  exports._b_cont = _b_cont;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets an active ore scanner in range.
   * ---------------------------------------- */
  const _b_scan = function(x, y, team, rad, dpLvlReq) {
    return _b_base(x, y, team, rad, b => MDL_cond._isOreScanner(b.block) && b.block.delegee.scanTier >= tryVal(dpLvlReq, 0) && b.efficiency > 0.0 && Mathf.dst(x, y, b.x, b.y) < b.block.delegee.blkRad);
  };
  exports._b_scan = _b_scan;


  /* unit */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a random non-loot unit near (x, y), return {null} if not found.
   * ---------------------------------------- */
  const _unit = function thisFun(x, y, rad, caller) {
    return _units(x, y, rad, caller, thisFun.tmpUnits).readRand();
  }
  .setProp({
    tmpUnits: [],
  });
  exports._unit = _unit;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets all units in a circular range.
   * This will filter out loot units.
   * ---------------------------------------- */
  const _units = function(x, y, rad, caller, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return arr;

    Units.nearby(null, x, y, rad, unit => {
      if(unit !== caller && !MDL_cond._isIrregularUnit(unit)) arr.push(unit);
    });

    return arr;
  };
  exports._units = _units;


  /* ----------------------------------------
   * NOTE:
   *
   * Iterates through units in range that match {boolF}.
   * This will filter out loot units.
   * ---------------------------------------- */
  const _it_units = function(x, y, rad, team, boolF, scr) {
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return;
    if(team == null) team = null;                // {undefined} will cause an error here
    if(boolF == null) boolF = Function.airTrue;

    Units.nearby(team, x, y, rad, unit => {
      if(!MDL_cond._isIrregularUnit(unit) && boolF(unit)) scr(unit);
    });
  };
  exports._it_units = _it_units;


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {_units} for rectangular range.
   * ---------------------------------------- */
  const _unitsRect = function(x, y, r, size, caller, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    if(r == null) r = 0;
    if(size == null) size = 1;
    let hw = (r + size * 0.5) * Vars.tilesize;

    Groups.unit.intersect(x - hw, y - hw, hw * 2.0, hw * 2.0, unit => {
      if(unit !== caller && !MDL_cond._isIrregularUnit(unit)) arr.push(unit);
    });

    return arr;
  };
  exports._unitsRect = _unitsRect;


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {_it_units} for rectangular range.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the closest unit controlled by any player.
   * Set {team} to {null} to ignore player team.
   *
   * Don't abuse {Vars.player} in blocks and units!
   * ---------------------------------------- */
  const _unitPl = function(x, y, team, rad) {
    let unit_pl = null;

    if(rad == null) rad = Number.n8;
    if(rad < 0.0001) return unit_pl;

    let tmpRad = rad;
    let unit, dst;
    Groups.player.each(pl => {
      unit = pl.unit();
      if(unit != null && (team == null || unit.team === team)) {
        dst = Mathf.dst(x, y, unit.x, unit.y);
        if(dst < tmpRad) {
          tmpRad = dst;
          unit_pl = unit;
        };
      };
    });

    return unit_pl;
  };
  exports._unitPl = _unitPl;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a player unit by player name, can be {null}.
   * IF {nm} not given, this returns YOU.
   * ---------------------------------------- */
  const _unitPlNm = function(nm) {
    if(nm == null) return Vars.player.unit();
    let pl = Groups.player.find(tmp => tmp.name === nm);

    return pl == null ? null : pl.unit();
  };
  exports._unitPlNm = _unitPlNm;


  /* loot unit */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a random loot unit near (x, y), return {null} if not found.
   * ---------------------------------------- */
  const _loot = function thisFun(x, y, rad, caller) {
    return _loots(x, y, rad, caller, thisFun.tmpLoots).readRand();
  }
  .setProp({
    tmpLoots: [],
  });
  exports._loot = _loot;


  /* ----------------------------------------
   * NOTE:
   *
   * {_units} but for loot unit.
   * ---------------------------------------- */
  const _loots = function(x, y, rad, caller, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return arr;

    Units.nearby(null, x, y, rad, unit => {
      if(unit !== caller && MDL_cond._isLoot(unit)) arr.push(unit);
    });

    return arr;
  };
  exports._loots = _loots;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a random loot unit in {ts}.
   * ---------------------------------------- */
  const _lootTs = function thisFun(ts, caller) {
    return _lootsTs(ts, caller, thisFun.tmpLoots).readRand();
  }
  .setProp({
    tmpLoots: [],
  });
  exports._lootTs = _lootTs;


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {_loots} that uses {ts} instead.
   * ---------------------------------------- */
  const _lootsTs = function thisFun(ts, caller, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    if(ts == null) return arr;

    ts.forEachFast(ot => {
      _loots(ot.worldx(), ot.worldy(), 6.0, caller, thisFun.tmpUnits).forEachFast(loot => arr.pushUnique(loot));
    });

    return arr;
  }
  .setProp({
    tmpUnits: [],
  });
  exports._lootsTs = _lootsTs;


  /* entity */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the closest unit/building that is a valid target.
   * ---------------------------------------- */
  const _eTg = function(x, y, team, rad, targetAir, targetGround, boolF) {
    if(team == null) return;
    if(rad == null) rad = Number.n8;
    if(rad < 0.0001) return;
    if(targetAir == null) targetAir = true;
    if(targetGround == null) targetGround = true;
    if(boolF == null) boolF = Function.airTrue;

    return Units.closestTarget(team, x, y, rad, ounit => ounit.checkTarget(targetAir, targetGround) && boolF(ounit), ot => targetGround && boolF(ot));
  };
  exports._eTg = _eTg;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets all units and buildings that are valid targets.
   * ---------------------------------------- */
  const _esTg = function thisFun(x, y, team, rad, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    if(team == null) return arr;
    if(rad == null) rad = Number.n8;
    if(rad < 0.0001) return arr;

    arr.pushAll(_f_enemy(_units(x, y, rad, null, thisFun.tmpUnits), team));
    arr.pushAll(_f_enemy(_bs(x, y, rad, null, thisFun.tmpBs), team));

    return arr;
  }
  .setProp({
    tmpBs: [],
    tmpUnits: [],
  });
  exports._esTg = _esTg;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets targets in a chain, like chained lightning.
   * {chainRayCheck} is used to determine whether the chain is blocked.
   * ---------------------------------------- */
  const _esTgChain = function thisFun(x, y, team, rad, rad_chain, chainCap, chainRayCheck, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    if(team == null) return arr;
    if(rad == null) rad = Number.n8;
    if(rad < 0.0001) return arr;
    if(rad_chain == null) rad_chain = 0.0;
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
      if(Mathf.dst(tmpX, tmpY, tmpTg.x, tmpTg.y) > (isFirst ? rad : rad_chain) + 0.0001) break;
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


  /* ----------------------------------------
   * NOTE:
   *
   * Gets all bullets in a circular range.
   * ---------------------------------------- */
  const _buls = function thisFun(x, y, rad, caller, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return arr;

    Groups.bullet
    .intersect(x - rad, y - rad, rad * 2.0, rad * 2.0)
    .each(
      bul => bul != caller && bul.within(x, y, rad + bul.hitSize * 0.5),
      bul => arr.push(bul),
    );
    return arr;
  };
  exports._buls = _buls;


  /* ----------------------------------------
   * NOTE:
   *
   * Iterates through all nearby bullets that match {boolF}.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the closest hittable enemy bullet.
   * ---------------------------------------- */
  const _bulTg = function(x, y, team, rad, ignoreHittable, caller) {
    if(team == null) return null;
    if(rad == null) rad = 0.0;
    if(rad < 0.0001) return null;

    let tmpDst = Number.n8;
    let bulTg = null, dst;
    _it_buls(
      x, y, rad, team,
      bul => bul !== caller && (ignoreHittable ? true : bul.type.hittable),
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
