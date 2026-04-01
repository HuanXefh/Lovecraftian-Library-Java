/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = CLS_contentTemplate;


  /* <---------- component ----------> */


  function comp_init(utp) {
    if(!Vars.headless && !utp.skipOutlineSetup) {
      MDL_event._c_onLoad(() => {
        if(Core.atlas.has(utp.name + "-icon")) {
          utp.fullIcon = utp.uiIcon = Core.atlas.find(utp.name + "-icon");
        };
      });
    };

    if(utp.unitDurabCap > 0.0) {
      setAbility(utp, abis => [
        abis,
        fetchAbility("unit-ability", {
          durabCap: utp.unitDurabCap,
        }),
      ]);
    };
  };


  function comp_setStats(utp) {
    if(utp.overwriteVanillaStat) {
      utp.stats.remove(Stat.mineTier);
    };

    if(MDL_cond._isNonRobot(utp)) utp.stats.add(fetchStat("lovec", "utp-notrobot"), true);
    let polTol = MDL_pollution._polTol(utp);
    if(!polTol.fEqual(500.0)) utp.stats.add(fetchStat("lovec", "blk-poltol"), polTol, fetchStatUnit("lovec", "polunits"));
  };


  function comp_killed(utp, unit) {
    VARGEN.unitDataMap.remove(unit);
  };


  function comp_update(utp, unit) {
    if(utp.useLovecDamagePenalty) FRAG_unit.comp_update_damaged(utp, unit);

    if(utp.hasUnitData && unit.delegee != null && TIMER.secHalf) {
      if(!VARGEN.unitDataMap.containsKey(unit)) VARGEN.unitDataMap.put(unit, {});
      utp.ex_writeUnitData(unit, VARGEN.unitDataMap.get(unit));
    };

    if(utp.unitDurabCap > 0.0 && unit.delegee != null && unit.delegee.unitDurabUsed != null) {
      if(unit.delegee.unitDurabUsed >= utp.unitDurabCap) {
        utp.ex_onDurabOutage(unit);
      } else {
        unit.delegee.unitDurabUsed += Time.delta;
        utp.ex_onDurabDec(unit);
      };
    };
  };


  function comp_draw(utp, unit) {
    if(utp.drawShields && (utp.baseShieldA > 0.0 || unit.shieldAlpha > 0.0) && unit.shield > 0.0) {
      utp.ex_drawShield(unit);
    };
  };


  function comp_drawLight(utp, unit) {
    if(!utp.useConicalLight) {
      utp.super$drawLight(unit);
    } else {
      MDL_draw._l_arc(unit.x, unit.y, 1.0, utp.lightRadius, utp.lightConeScl, unit.rotation - 90.0, utp.lightColor, utp.lightOpacity);
    };
  };


  function comp_ex_drawShield(utp, unit) {
    LCDraw.shieldCircle(
      unit.x, unit.y,
      unit.hitSize * utp.shieldRadScl * 1.3 + Mathf.lerp(0.0, utp.shieldRadHitInc, unit.shieldAlpha),
      utp.ex_getShieldColor(unit),
      Mathf.lerp(utp.baseShieldA, 1.0, unit.shieldAlpha),
    );
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Root of all units.
   * @class UNIT_baseUnit
   * @extends CLS_contentTemplate
   */
  module.exports = newClass().extendClass(PARENT, "UNIT_baseUnit").initClass()
  .setParent(null)
  .setTags()
  .setParam({


    /**
     * <PARAM>: See {@link RS_baseResource}.
     * @memberof UNIT_baseUnit
     * @instance
     */
    overwriteVanillaStat: true,
    /**
     * <PARAM>: See {@link RS_baseResource}.
     * @memberof UNIT_baseUnit
     * @instance
     */
    overwriteVanillaProp: true,
    /**
     * <PARAM>: See {@link BLK_baseBlock}.
     * @memberof UNIT_baseUnit
     * @instance
     */
    skipOutlineSetup: false,
    /**
     * <PARAM>: Whether to enable health-based status effects.
     * @memberof UNIT_baseUnit
     * @instance
     */
    useLovecDamagePenalty: true,
    /**
     * <PARAM>: If larger than 0.0, shield will always be drawn.
     * @memberof UNIT_baseUnit
     * @instance
     */
    baseShieldA: 0.0,
    /**
     * <PARAM>: Shield radius scaling.
     * @memberof UNIT_baseUnit
     * @instance
     */
    shieldRadScl: 1.0,
    /**
     * <PARAM>: Increase of shield radius when hit or regenerated.
     * @memberof UNIT_baseUnit
     * @instance
     */
    shieldRadHitInc: 0.75,
    /**
     * <PARAM>: Whether to use conical light instead of vanilla circular light.
     * @memberof UNIT_baseUnit
     * @instance
     */
    useConicalLight: true,
    /**
     * <PARAM>: Affects cone angle of the light. Requires {@link UNIT_baseUnit#useConicalLight} to be true.
     * @memberof UNIT_baseUnit
     * @instance
     */
    lightConeScl: 0.4,
    /**
     * <PARAM>: Durability in frames, the unit will be destroyed if run out of durability. Use negative value to disable this mechanics.
     * @memberof
     * @instance
     */
    unitDurabCap: -1.0,


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>: Entity used by this type, do not change unless you know how it works.
     * @memberof UNIT_baseUnit
     * @instance
     */
    entityName: "flying",
    /**
     * <INTERNAL> The content template used for unit entity.
     * @memberof UNIT_baseUnit
     * @instance
     */
    entityTemplate: null,
    /**
     * <INTERNAL>
     * @memberof UNIT_baseUnit
     * @instance
     */
    hasUnitData: true,


  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


    killed: function(unit) {
      comp_killed(this, unit);
    },


    update: function(unit) {
      comp_update(this, unit);
    },


    draw: function(unit) {
      comp_draw(this, unit);
    },


    drawLight: function(unit) {
      comp_drawLight(this, unit);
    }
    .setProp({
      noSuper: true,
    }),


    drawShield: function(unit) {

    }
    .setProp({
      noSuper: true,
    }),


    /**
     * @memberof UNIT_baseUnit
     * @instance
     * @param {Unit} unit
     * @return {Color}
     */
    ex_getShieldColor: function(unit) {
      return Tmp.c2.set(tryVal(this.shieldColor, unit.team.color)).lerp(Color.white, Mathf.clamp(unit.hitTime / 2.0));
    }
    .setProp({
      noSuper: true,
    }),


    /**
     * @memberof UNIT_baseUnit
     * @instance
     * @param {Unit} unit
     * @return {void}
     */
    ex_drawShield: function(unit) {
      comp_ex_drawShield(this, unit);
    }
    .setProp({
      noSuper: true,
    }),


    /**
     * Called when this unit is out of durability.
     * By default, this unit will be destroyed.
     * <br> <LATER>
     * @memberof UNIT_baseUnit
     * @instance
     * @param {Unit} unit
     * @return {void}
     */
    ex_onDurabOutage: function(unit) {
      unit.kill();
    }
    .setProp({
      noSuper: true,
      argLen: 1,
    }),


    /**
     * Called when this unit's durability decreases.
     * <br> <LATER>
     * @memberof UNIT_baseUnit
     * @instance
     * @param {Unit} unit
     * @return {void}
     */
    ex_onDurabDec: function(unit) {

    }
    .setProp({
      noSuper: true,
      argLen: 1,
    }),


    /**
     * @memberof UNIT_baseUnit
     * @instance
     * @param {Unit} unit
     * @param {Object} dataObj
     * @return {void}
     */
    ex_writeUnitData: function(unit, dataObj) {
      dataObj.unitDurabUsed = unit.delegee.unitDurabUsed;
    }
    .setProp({
      noSuper: true,
      argLen: 2,
    }),


    /**
     * @memberof UNIT_baseUnit
     * @instance
     * @param {Unit} unit
     * @param {Object} dataObj
     * @return {void}
     */
    ex_readUnitData: function(unit, dataObj) {
      unit.delegee.unitDurabUsed = Number(dataObj.unitDurabUsed);
    }
    .setProp({
      noSuper: true,
      argLen: 2,
    }),


  });


  /**
   * @memberof UNIT_baseUnit
   * @param {UnitType} utp
   * @return {void}
   */
  module.exports.initUnit = function(utp) {
    // Resolve entity mapping
    let entityVal = DB_unit.db["map"]["entity"]["type"].read(utp.delegee.entityName, UnitEntity);
    if(typeof entityVal !== "number") {
      utp.constructor = () => extend(entityVal, {});
    } else {
      if(EntityMapping.idMap[entityVal] == null) {
        let templateGetter = DB_unit.db["map"]["entity"]["entityDef"].read(entityVal);
        if(templateGetter == null) throw new Error("Entity (${1}) is not defined yet!".format(entityVal));
        utp.delegee.entityTemplate = templateGetter();

        EntityMapping.idMap[entityVal] = prov(() => {
          processClassLoader();
          let unit = extend(utp.delegee.entityTemplate.getParent(), mergeObj(utp.delegee.entityTemplate.build(), {
            classId: function () {
              return entityVal;
            },
          }));
          processClassLoader();

          return unit;
        });
      };
      EntityMapping.nameMap.put(utp.delegee.entityName, EntityMapping.idMap[entityVal]);
      utp.constructor = EntityMapping.map(utp.delegee.entityName);
    };

    // Resolve type affinity for damage
    let dmgType = MDL_content._unitDmgType(utp);
    if(dmgType != null) {
      utp.databaseTag = "lovec-dmg0type-" + dmgType;
    };

    if(!tryJsProp(utp, "skipOutlineSetup", false)) FRAG_faci.setupOutline(utp);
  };
