/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * The root of all units.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/cls/util/CLS_contentTemplate");


  const FRAG_faci = require("lovec/frag/FRAG_faci");
  const FRAG_unit = require("lovec/frag/FRAG_unit");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pollution = require("lovec/mdl/MDL_pollution");


  const DB_unit = require("lovec/db/DB_unit");


  /* <---------- component ----------> */


  function comp_init(utp) {
    if(!Vars.headless && !utp.skipOutlineSetup) {
      MDL_event._c_onLoad(() => {
        if(Core.atlas.has(utp.name + "-icon")) {
          utp.fullIcon = utp.uiIcon = Core.atlas.find(utp.name + "-icon");
        };
      });
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


  function comp_update(utp, unit) {
    if(utp.useLovecDamagePenalty) FRAG_unit.comp_update_damaged(utp, unit);
  };


  function comp_drawLight(utp, unit) {
    if(!utp.useConicalLight) {
      utp.super$drawLight(unit);
    } else {
      MDL_draw._l_arc(unit.x, unit.y, 1.0, utp.lightRadius, utp.lightConeScl, unit.rotation - 90.0, utp.lightColor, utp.lightOpacity);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(null)
  .setTags()
  .setParam({
    // @PARAM: See {RS_baseResource}.
    overwriteVanillaStat: true,
    // @PARAM: See {RS_baseResource}.
    overwriteVanillaProp: true,
    // @PARA<: See {BLK_baseBlock}.
    skipOutlineSetup: false,
    // @PARAM: Whether to enable health-based status effects.
    useLovecDamagePenalty: true,
    // @PARAM: Whether to use conical unit light instead of vanilla circular one.
    useConicalLight: true,
    // @PARAM: Affects cone angle of the light.
    lightConeScl: 0.4,

    entityName: "flying",                // Entity used by the type, do not change unless you know it well
    entityTemplate: null,
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


    update: function(unit) {
      comp_update(this, unit);
    },


    drawLight: function(unit) {
      comp_drawLight(this, unit);
    }
    .setProp({
      noSuper: true,
    }),


  });

  // Resolves entity mapping for the unit type
  module.exports.initUnit = function(utp) {
    let entityVal = DB_unit.db["map"]["entity"]["type"].read(utp.entityName, UnitEntity);
    if(typeof entityVal !== "number") {
      utp.constructor = () => extend(entityVal, {});
    } else {
      if(EntityMapping.idMap[entityVal] == null) {
        let templateGetter = DB_unit.db["map"]["entity"]["entityDef"].read(entityVal);
        if(templateGetter == null) throw new Error("Entity ([$1]) is not defined yet!".format(entityVal));
        utp.entityTemplate = templateGetter();

        let entityProv = prov(() => {
          processClassLoader();
          let unit = extend(utp.entityTemplate.getParent(), mergeObj(utp.entityTemplate.build(), {
            classId: function() {
              return entityVal;
            },
          }));
          processClassLoader();

          return unit;
        });
        EntityMapping.idMap[entityVal] = entityProv;
      };
      EntityMapping.nameMap.put(utp.entityName, EntityMapping.idMap[entityVal]);
      utp.constructor = EntityMapping.map(utp.entityName);
    };

    let dmgType = MDL_content._unitDmgType(utp);
    if(dmgType != null) {
      utp.databaseTag = "lovec-dmg0type-" + dmgType;
    };

    if(!tryJsProp(utp, "skipOutlineSetup", false)) FRAG_faci.setupOutline(utp);
  };
