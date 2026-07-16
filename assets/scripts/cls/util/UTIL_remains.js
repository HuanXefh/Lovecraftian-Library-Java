/*
  ========================================
  Section: Definition
  ========================================
*/


  /**
   * Utility class for handling building/unit remains.
   * @class
   */
  const UTIL_remains = newClass().initClass();


  const blkRemainsMap = new ObjectMap();
  const unitRemainsArr = [];
  const legRemainsArr = [];


  MDL_event._c_onLoad(() => {
    TRIGGER.mapExit.addGlobalListener(() => {
      blkRemainsMap.clear();
      unitRemainsArr.clear();
      legRemainsArr.clear();
    });
  });


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


  /**
   * Gets all building remains as an object map of tile and remains.
   * @return {ObjectMap}
   */
  UTIL_remains.getBlkRemainsMap = function() {
    return blkRemainsMap;
  };


  /**
   * Gets all unit remains as an array.
   * @return {Array<Decal>}
   */
  UTIL_remains.getUnitRemainsArr = function() {
    return unitRemainsArr;
  };


  /**
   * Whether some entity can leave remains on destroyed.
   * @param {Building|Unit} e
   * @return {boolean}
   */
  UTIL_remains.checkRemainsValid = function(e) {
    return e instanceof Building ?
      PARAM.SHOULD_CREATE_BUILD_REMAINS && !(e.block instanceof ConstructBlock) && (e.block.size > 1 || Mathf.chance(0.5)) && !MDL_cond._hasNoRemains(e.block) :
      !MDL_cond._hasNoRemains(e.type);
  };


  /**
   * Whether remains can be created on a tile.
   * @param {Tile|null} t
   * @return {boolean}
   */
  UTIL_remains.checkFloor = function(t) {
    return t != null && t.floor().canShadow;
  };


  /**
   * Whether remains is created on liquid floor.
   * @param {Tile|null} t
   * @param {Block|UnitType} etp
   * @return {boolean}
   */
  UTIL_remains.checkInLiq = function thisFun(t, etp) {
    return t != null
      && MDL_pos._tsRect(thisFun.tmpTs, t, 1, 1).every(ot => ot.floor().isLiquid)
      && (etp instanceof Block || (t.build == null && !(t.solid() && MDL_cond._isTreeBlock(t.block()))))
  }
  .setProp({
    tmpTs: [],
  });


  /**
   * Whether remains should float.
   * @param {Block|UnitType} etp
   * @param {number|unset} [hitSize]
   * @return {boolean}
   */
  UTIL_remains.checkFloating = function(etp, hitSize) {
    return !(etp instanceof Block) && tryVal(hitSize, MDL_entity._hitSize(etp)) < VAR.param.unitRemainsFloatThr;
  };


  /**
   * Gets a new building remains instance.
   * @param {number} x
   * @param {number} y
   * @param {Block} blk
   * @param {boolean} isPermanent
   * @param {Tile} t
   * @param {number} a
   * @param {number} z
   * @return {Decal}
   */
  UTIL_remains.getBuildRemains = function(
    x, y, blk, isPermanent,
    t, a, z
  ) {
    return extend(Decal, {


      lifetime: isPermanent ? Number.n8 : PARAM.UNIT_REMAINS_LIFETIME,
      x: x,
      y: y,
      t: t,
      hitSize: MDL_entity._hitSize(blk),
      rotation: Mathf.random(90.0) - 45.0,
      color: VAR.color.darkMix,
      a: a,
      aSha: 0.3,
      z: z,
      off: Mathf.random(VAR.param.buildRemainsOffCap),
      region: LCTexture.getBlockRegion(blk),


      remove() {
        blkRemainsMap.remove(this.t);
        this.super$remove();
      },


      draw() {
        processZ(this.z - 1.0, 5);

        Draw.color(Color.black, this.aSha - Mathf.curve(this.fin(), 0.98) * this.aSha);
        Draw.rect("square-shadow", this.x, this.y, this.hitSize * 2.1, this.hitSize * 2.1, this.rotation);
        Draw.draw(this.z, () => {
          UTIL_remains.DEBRIS_SHADER.delegee.region = this.region;
          UTIL_remains.DEBRIS_SHADER.delegee.mulColor.set(this.color);
          UTIL_remains.DEBRIS_SHADER.delegee.a = this.a - Mathf.curve(this.fin(), 0.98) * this.a;
          UTIL_remains.DEBRIS_SHADER.delegee.off = this.off;
          UTIL_remains.DEBRIS_SHADER.delegee.offCap = VAR.param.buildRemainsOffCap;
          Draw.shader(UTIL_remains.DEBRIS_SHADER);
          Draw.rect(this.region, this.x, this.y, this.rotation);
          Draw.shader();
          Draw.flush();
        });
        Draw.reset();

        processZ(null, 5);
      },


    });
  };


  /**
   * Gets a new unit remains instance.
   * @param {number} x
   * @param {number} y
   * @param {Unit|null} unit
   * @param {UnitType} utp
   * @param {Team} team
   * @param {boolean} isPermanent
   * @param {boolean} forceHot
   * @param {Tile} t
   * @param {Color|unset} tint
   * @param {number} a
   * @param {number} z
   * @param {boolean} inLiq
   * @param {boolean} shouldFloat
   * @return {Decal}
   */
  UTIL_remains.getUnitRemains = function(
    x, y, unit, utp, team, isPermanent, forceHot,
    t, tint, a, z, inLiq, shouldFloat
  ) {
    return extend(Decal, {


      lifetime: isPermanent ? Number.n8 : PARAM.UNIT_REMAINS_LIFETIME,
      offTime: Mathf.random(1200.0),
      x: x,
      y: y,
      xOri: x,
      yOri: y,
      floatOffX: 0.0,
      floatOffY: 0.0,
      t: t,
      hitSize: MDL_entity._hitSize(utp),
      clipRad: null,
      rotation: unit == null ? Mathf.random(360.0) : (unit.rotation - 90.0 + Mathf.range(25.0)),
      team: team,
      color: VAR.color.darkMix,
      tint: tint,
      a: a,
      aSha: 0.5,
      z: z,
      region: Core.atlas.find(utp.name + "-full", Core.atlas.find(utp.name + "-icon", utp.region)),
      cellRegion: Core.atlas.find(utp.name + "-cell-full", utp.cellRegion),
      softShadowRegion: utp.softShadowRegion,
      lineRegion: null,
      lineRegionRandOff: null,
      lineVec_f: null,
      lineVec_t: null,
      shouldFloat: shouldFloat,
      isHot: forceHot ? true : MDL_cond._isHot(unit, t),
      shouldFadeHeat: forceHot ? false : (!MDL_cond._isHotStatus(t.floor().status) || !inLiq),


      remove() {
        if(this.region != null) {
          unitRemainsArr.remove(this);
        } else if(this.lineRegion) {
          legRemainsArr.remove(this);
        };
        this.super$remove();
      },


      clipSize() {
        return this.clipRad != null ?
          this.clipRad :
          this.region != null ?
            this.region.width * 2.0 :
            0.0001;
      },


      draw() {
        if(this.shouldFloat) {
          this.floatOffX = Math.sin((Time.time + this.offTime) * 0.01) * 0.35 * Vars.tilesize;
          this.floatOffY = Math.cos((Time.time + this.offTime) * 0.05 + 32.0) * 0.15 * Vars.tilesize;
        };
        this.x = this.xOri + this.floatOffX;
        this.y = this.yOri + this.floatOffY;

        if(this.shouldFloat && Mathf.chanceDelta(0.01)) {
          MDL_effect._e_ripple(this.x, this.y, this.hitSize * 1.2);
        };

        processZ(this.z - 1.0, 6);

        if(this.softShadowRegion != null) {
          Draw.color(Color.black, this.aSha - Mathf.curve(this.fin(), 0.98) * this.aSha);
          Draw.rect(this.softShadowRegion, this.x, this.y, this.region.width * 0.4, this.region.width * 0.4, this.rotation);
        };
        Draw.z(this.z);
        this.tint != null ?
          Draw.tint(this.color, this.tint, 0.5) :
          !this.isHot ?
            Draw.color(this.color) :
            Draw.color(Color.valueOf(Tmp.c1, "ea8878").lerp(this.color, Interp.pow2Out.apply(this.fin())));
        Draw.alpha(this.a - Mathf.curve(this.fin(), 0.98) * this.a);
        if(this.region != null) {
          Draw.rect(this.region, this.x, this.y, this.rotation);
          Draw.color(Tmp.c2.set(this.color).mul(this.team.color), this.a - Mathf.curve(this.fin(), 0.98) * this.a);
          if(this.cellRegion != null) {
            Draw.rect(this.cellRegion, this.x, this.y, this.rotation);
          };
          if(this.isHot) {
            Draw.blend(Blending.additive);
            Draw.mixcol(VAR.color.heatMix, 1.0);
            Draw.alpha((0.5 + Mathf.absin(10.0, 0.5)) * (!this.isHot ? 0.0 : !this.shouldFadeHeat ? (0.5 - Mathf.curve(this.fin(), 0.98) * 0.5) : (0.5 - Interp.pow2Out.apply(this.fin()) * 0.5)));
            Draw.rect(this.region, this.x, this.y, this.rotation);
            Draw.blend();
          };
        } else if(this.lineRegion != null) {
          Tmp.v1.trns(this.rotation, this.lineRegionRandOff).add(this.floatOffX, this.floatOffY);
          Lines.stroke(this.lineRegion.height * Draw.scl);
          Lines.line(this.lineRegion, this.lineVec_f.x + Tmp.v1.x, this.lineVec_f.y + Tmp.v1.y, this.lineVec_t.x + Tmp.v1.x, this.lineVec_t.y + Tmp.v1.y, false);
          if(this.isHot) {
            Draw.blend(Blending.additive);
            Draw.mixcol(VAR.color.heatMix, 1.0);
            Draw.alpha((0.5 + Mathf.absin(10.0, 0.5)) * (!this.isHot ? 0.0 : !this.shouldFadeHeat ? (0.35 - Mathf.curve(this.fin(), 0.98) * 0.35) : (0.35 - Interp.pow2Out.apply(this.fin()) * 0.35)));
            Lines.line(this.lineRegion, this.lineVec_f.x + Tmp.v1.x, this.lineVec_f.y + Tmp.v1.y, this.lineVec_t.x + Tmp.v1.x, this.lineVec_t.y + Tmp.v1.y, false);
            Draw.blend();
          };
        };
        Draw.reset();

        processZ(null, 6);
      },


    });
  };


  /**
   * Gets new leg remains instances.
   * @param {Array|unset} contArr
   * @param {number} x
   * @param {number} y
   * @param {Unit|null} unit
   * @param {UnitType} utp
   * @param {Team} team
   * @param {boolean} isPermanent
   * @param {boolean} forceHot
   * @return {Array<Decal>}
   */
  UTIL_remains.getLegRemains = function thisFun(
    contArr, x, y, unit, utp, team, isPermanent, forceHot
  ) {
    let arr = contArr != null ? contArr.clear() : [];
    if(unit == null || !(unit instanceof Legsc)) return arr;

    let
      i = 0,
      iCap = unit.legs.length,
      leg,
      hitSize,
      t,
      ot,
      tint,
      a,
      z,
      offX,
      offY,
      offZ,
      inLiq,
      liq,
      shouldFloat,
      vecBase,
      vecLegJoint,
      remainsLeg,
      remainsLegBase;

    while(i < iCap) {
      leg = unit.legs[i];
      offX = Mathf.random(8.0);
      offY = Mathf.random(8.0);
      offZ = Mathf.random(0.01);
      vecBase = UTIL_remains.getLegRemains.calcLegOff(Tmp.v1, unit, i).add(x, y);
      vecLegJoint = Tmp.v2.set(leg.base).sub(leg.joint).inv().setLength(utp.legExtension).add(leg.joint);
      remainsLeg = null;
      remainsLegBase = null;

      tint = null;
      a = 0.7;
      z = VAR.layer.unitRemains - 0.01;
      liq = null;
      shouldFloat = false;

      // Leg
      Tmp.v4.set(vecBase).lerp(leg.joint, 0.5);
      t = Vars.world.tileWorld(Tmp.v4.x, Tmp.v4.y);
      if(t != null) {
        hitSize = vecBase.dst(leg.joint);
        inLiq = !LCRaycast.rayCheck(vecBase.x, vecBase.y, leg.joint.x, leg.joint.y, (tx, ty) => {
          ot = Vars.world.tile(tx, ty);
          return !UTIL_remains.checkInLiq(ot, utp);
        });
        if(inLiq) {
          shouldFloat = UTIL_remains.checkFloating(utp, hitSize);
          if(!shouldFloat) {
            liq = ot.floor().liquidDrop;
            tint = liq != null ? liq.color : t.getFloorColor();
            a = 0.4;
            z = VAR.layer.unitRemainsDrown - 0.01;
          };
        };
        remainsLeg = UTIL_remains.getUnitRemains(
          vecBase.x, vecBase.y, null, utp, team, isPermanent, forceHot,
          t, tint, a, z + offZ, inLiq, shouldFloat,
        );
        remainsLeg.hitSize = hitSize;
        remainsLeg.clipRad = hitSize * 1.3;
        remainsLeg.region = null;
        remainsLeg.cellRegion = null;
        remainsLeg.softShadowRegion = null;
        remainsLeg.lineRegion = utp.legRegion;
        remainsLeg.lineRegionRandOff = Mathf.random(utp.legRegion.width / 8.0);
        remainsLeg.lineVec_f = vecBase.cpy().add(offX, offY);
        remainsLeg.lineVec_t = leg.joint.cpy().add(offX, offY);
        remainsLeg.isHot = MDL_cond._isHot(unit, unit.tile);
      };

      offX = Mathf.random(8.0);
      offY = Mathf.random(8.0);
      tint = null;
      a = 0.7;
      z = VAR.layer.unitRemains - 0.01;
      liq = null;
      shouldFloat = false;

      // Leg base
      Tmp.v4.set(vecLegJoint).lerp(leg.base, 0.5);
      t = Vars.world.tileWorld(Tmp.v4.x, Tmp.v4.y);
      if(t != null) {
        hitSize = vecLegJoint.dst(leg.base);
        inLiq = !LCRaycast.rayCheck(vecLegJoint.x, vecLegJoint.y, leg.base.x, leg.base.y, (tx, ty) => {
          ot = Vars.world.tile(tx, ty);
          return !UTIL_remains.checkInLiq(ot, utp);
        });
        if(inLiq) {
          shouldFloat = UTIL_remains.checkFloating(utp, hitSize);
          if(!shouldFloat) {
            liq = ot.floor().liquidDrop;
            tint = liq != null ? liq.color : t.getFloorColor();
            a = 0.4;
            z = VAR.layer.unitRemainsDrown - 0.01;
          };
        };
        remainsLegBase = UTIL_remains.getUnitRemains(
          leg.joint.x, leg.joint.y, null, utp, team, isPermanent, forceHot,
          t, tint, a, z + offZ, inLiq, shouldFloat,
        );
        remainsLegBase.hitSize = hitSize;
        remainsLegBase.clipRad = hitSize * 1.3;
        remainsLegBase.region = null;
        remainsLegBase.cellRegion = null;
        remainsLegBase.softShadowRegion = null;
        remainsLegBase.lineRegion = utp.legBaseRegion;
        remainsLegBase.lineRegionRandOff = Mathf.random(utp.legBaseRegion.width / 8.0);
        remainsLegBase.lineVec_f = vecLegJoint.cpy().add(offX, offY);
        remainsLegBase.lineVec_t = leg.base.cpy().add(offX, offY);
        remainsLegBase.isHot = MDL_cond._isHot(unit, unit.tile);
      };

      arr.push(remainsLeg, remainsLegBase);
      i++;
    };

    return arr.compact();
  }
  .setProp({
    calcLegOff: function(vecOut, unit, ind) {
      vecOut.trns(UTIL_remains.getLegRemains.calcLegAngDef(unit, ind), unit.type.legBaseOffset);
      if(unit.type.legStraightness > 0.0) {
        Tmp.v3.trns(UTIL_remains.getLegRemains.calcLegAngDef(unit, ind) - unit.baseRotation, unit.type.legBaseOffset);
        Tmp.v3.y = Mathf.sign(Tmp.v3.y) * unit.type.legBaseOffset * unit.type.legStraightLength;
        Tmp.v3.rotate(unit.baseRotation);
        vecOut.lerp(Tmp.v3, unit.type.baseLegStraightness);
      };
      return vecOut;
    },
    calcLegAngDef: function(unit, ind) {
      return unit.baseRotation + 360.0 / unit.legs.length * ind + (360.0 / unit.legs.length / 2.0);
    },
  });


  /**
   * Creates a remains for some entity (or its type).
   * @param {number} x
   * @param {number} y
   * @param {Building|Unit|Block|UnitType|null} e0etp
   * @param {Team} team
   * @param {boolean|unset} [isPermanent] - If true, this remains won't despawn.
   * @param {boolean|unset} [forceHot] - If true, this remains is always heated.
   * @return {void}
   */
  UTIL_remains.create = function thisFun(x, y, e0etp, team, isPermanent, forceHot) {
    if(Vars.headless || e0etp == null) return;
    if(isPermanent == null) isPermanent = false;
    if(forceHot == null) forceHot = false;

    let e = instanceOfAny(e0etp, Building, Unit) ? e0etp : null;
    let etp = e0etp instanceof Building ?
      e0etp.block :
      e0etp instanceof Unit ?
        e0etp.type :
        e0etp;

    if(etp instanceof Block && UTIL_remains.DEBRIS_SHADER == null) return;
    let t = Vars.world.tileWorld(x, y);
    if(!UTIL_remains.checkFloor(t)) return;

    let
      tint = null,
      a = 1.0,
      z = etp instanceof Block ? VAR.layer.buildRemains : VAR.layer.unitRemains,
      inLiq = false,
      shouldFloat = false;

    if(UTIL_remains.checkInLiq(t, etp)) {
      // Remains is created on liquid floor
      inLiq = true;
      if(UTIL_remains.checkFloating(etp)) {
        // Floating
        shouldFloat = true;
      } else {
        // Sunken
        let liq = t.floor().liquidDrop;
        tint = liq != null ? liq.color : t.getFloorColor();
        a = 0.5;
        z = etp instanceof Block ? VAR.layer.buildRemainsDrown : VAR.layer.unitRemainsDrown;
      };
    };

    let remains = etp instanceof Block ?
      UTIL_remains.getBuildRemains(
        x, y, etp, isPermanent,
        t, a, z,
      ) :
      UTIL_remains.getUnitRemains(
        x, y, e, etp, team, isPermanent, forceHot,
        t, tint, a, z, inLiq, shouldFloat,
      );
    remains.add();

    if(e != null && e instanceof Legsc) {
      UTIL_remains.getLegRemains(thisFun.tmpArr, x, y, e, etp, team, isPermanent, forceHot).forEachFast(remains => {
        remains.add();
        legRemainsArr.push(remains);
      });
    };

    if(etp instanceof Block) {
      // Remove previous remains on the tile
      let remainsPrev = blkRemainsMap.get(t);
      if(remainsPrev != null) {
        remainsPrev.remove();
      };

      blkRemainsMap.put(t, remains);
    } else {
      unitRemainsArr.push(remains);
    };
  }
  .setProp({
    tmpArr: [],
  });


  /**
   * Removes all existing remains.
   * @return {void}
   */
  UTIL_remains.clear = function thisFun() {
    blkRemainsMap.each((t, remains) => thisFun.tmpArr.push(remains));
    unitRemainsArr.forEachFast(remains => thisFun.tmpArr.push(remains));
    legRemainsArr.forEachFast(remains => thisFun.tmpArr.push(remains));
    thisFun.tmpArr.forEachFast(remains => remains.remove());
    thisFun.tmpArr.clear();
  }
  .setProp({
    tmpArr: [],
  });


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/




UTIL_remains.DEBRIS_SHADER = fetchShader("shader0reg-debris");


module.exports = UTIL_remains;
