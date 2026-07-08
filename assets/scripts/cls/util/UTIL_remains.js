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


  const TMP_ARR = [];
  const blkRemainsMap = new ObjectMap();
  const unitRemainsArr = [];


  MDL_event._c_onLoad(() => {
    TRIGGER.mapExit.addGlobalListener(() => {
      blkRemainsMap.clear();
      unitRemainsArr.clear();
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
      region: MDL_texture._regBlk(blk),


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
   * @param {Unit} unit
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
      t: t,
      hitSize: MDL_entity._hitSize(utp),
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
      shouldFloat: shouldFloat,
      isHot: forceHot ? true : MDL_cond._isHot(unit, t),
      shouldFadeHeat: forceHot ? false : (!MDL_cond._isHotStatus(t.floor().status) || !inLiq),


      remove() {
        unitRemainsArr.remove(this);
        this.super$remove();
      },


      draw() {
        this.x = this.xOri + (!this.shouldFloat ? 0.0 : Math.sin((Time.time + this.offTime) * 0.01) * 0.35 * Vars.tilesize);
        this.y = this.yOri + (!this.shouldFloat ? 0.0 : Math.cos((Time.time + this.offTime) * 0.05 + 32.0) * 0.15 * Vars.tilesize);

        if(this.shouldFloat && Mathf.chanceDelta(0.01)) {
          MDL_effect._e_ripple(this.x, this.y, this.hitSize * 1.2);
        };

        processZ(this.z - 1.0, 6);

        Draw.color(Color.black, this.aSha - Mathf.curve(this.fin(), 0.98) * this.aSha);
        Draw.rect(this.softShadowRegion, this.x, this.y, this.region.width * 0.4, this.region.width * 0.4, this.rotation);
        Draw.z(this.z);
        this.tint != null ?
          Draw.tint(this.color, this.tint, 0.5) :
          !this.isHot ?
            Draw.color(this.color) :
            Draw.color(Color.valueOf(Tmp.c1, "ea8878").lerp(this.color, Interp.pow2Out.apply(this.fin())));
        Draw.alpha(this.a - Mathf.curve(this.fin(), 0.98) * this.a);
        Draw.rect(this.region, this.x, this.y, this.rotation);
        Draw.color(Tmp.c2.set(this.color).mul(this.team.color), this.a - Mathf.curve(this.fin(), 0.98) * this.a);
        Draw.rect(this.cellRegion, this.x, this.y, this.rotation);
        Draw.color();
        if(this.isHot) {
          Draw.blend(Blending.additive);
          Draw.mixcol(VAR.color.heatMix, 1.0);
          Draw.alpha((0.5 + Mathf.absin(10.0, 0.5)) * !this.isHot ? 0.0 : !this.shouldFadeHeat ? (0.5 - Mathf.curve(this.fin(), 0.98) * 0.5) : (0.5 - Interp.pow2Out.apply(this.fin()) * 0.5));
          Draw.rect(this.region, this.x, this.y, this.rotation);
          Draw.blend();
        };
        Draw.reset();

        processZ(null, 6);
      },


    });
  };


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
  UTIL_remains.create = function(x, y, e0etp, team, isPermanent, forceHot) {
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
    if(t == null || !t.floor().canShadow) return;

    let
      tint = null,
      a = 1.0,
      z = etp instanceof Block ? VAR.layer.buildRemains : VAR.layer.unitRemains,
      inLiq = false,
      shouldFloat = false;

    if(
      MDL_pos._tsRect(TMP_ARR, t, 1, 1).every(ot => ot.floor().isLiquid)
        && (etp instanceof Block || (t.build == null && !(t.solid() && MDL_cond._isTreeBlock(t.block()))))
    ) {
      // Remains is created on liquid floor
      inLiq = true;
      if(!(etp instanceof Block) && MDL_entity._hitSize(etp) < VAR.param.unitRemainsFloatThr) {
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
  };


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/




UTIL_remains.DEBRIS_SHADER = fetchShader("shader0reg-debris");


module.exports = UTIL_remains;
