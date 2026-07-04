/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Handles various events globally.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ base ------------------------------ */


  function updateTitle() {
    let nameMap = global.lovecUtil.fun._mapCur();
    MDL_backend.setWinTitle(
      null,
      "${1}${2}".format(
        fetchSetting("misc-title-name"),
        !fetchSetting("misc-title-map") ? "" : ": ${1}".format(String.isEmpty(nameMap) ? "menu" : nameMap),
      ),
    );
  };


  function updateUnit() {
    if(!PARAM.MODDED) return;

    Groups.unit.each(unit => {
      if(MDL_cond._isIrregularUnit(unit)) return;

      if(PARAM.IS_NO_BUILD_MAP && VARGEN.staNoConstruction != null) {
        unit.apply(VARGEN.staNoConstruction, 60.0);
      };

      FRAG_unit.comp_update_surrounding(unit.type, unit);
      FRAG_unit.comp_update_heat(unit.type, unit);
    });
  };


  function updateDebug() {

  };


  /* <------------------------------ rules ------------------------------ */


  let
    shouldInitRules = true,
    shouldInitWea = true;

  function updateRules() {
    if(!shouldInitRules) return;

    shouldInitRules = false;
    shouldInitWea = true;
  };


  function updateWeather() {
    if(!shouldInitWea || !Vars.state.isGame() || Vars.state.isEditor()) return;

    shouldInitWea = false;
    Time.run(60.0, () => {
      let nameWeas = DB_env.db["param"]["map"]["weaEn"].read(PARAM.MAP_CURRENT, Array.air);
      if(nameWeas.length === 0) return;

      Groups.weather.clear();
      let seq = new Seq(), weaEn;
      nameWeas.forEachFast(nameWea => {
        weaEn = VARGEN.weaEns[nameWea];
        weaEn == null ?
          console.warn("[LOVEC] Invalid weather name: " + nameWea.color(Pal.accent)) :
          seq.add(weaEn);
      });
      Vars.state.rules.weather = seq;
    });
  };


  /* <------------------------------ attribute ------------------------------ */


  function updateAttr() {
    if(!Vars.state.isGame()) return;

    updateLightAttr();
  };


  function updateLightAttr() {
    Vars.state.rules.attributes.set(
      TP_attr.attr0env_light,
      !Vars.state.isGame() ?
        1.0 :
        (
          Attribute.light.env() + (
            !Vars.state.rules.lighting ?
              1.0 :
              (1.0 - Vars.state.rules.ambientLight.a)
          )
        ),
    );
  };


  /* <------------------------------ damage display ------------------------------ */


  function createDamageDisplay(e, bul) {
    if(!PARAM.ENABLE_DAMAGE_DISPLAY || e == null || bul == null) return;
    if(e instanceof Unit && (
      e.isMissile() && !PARAM.SHOULD_DRAW_MISSILE_STAT
    )) return;

    let dmg = MDL_entity._bulDmg(bul, e);
    if(dmg < PARAM.DAMAGE_DISPLAY_THRESHOLD) return;

    MDL_effect._e_dmg(
      e.x, e.y, dmg, bul.team,
      (e instanceof Building ? MDL_entity._bShield(e, true) : e.shield) > dmg ? "shield" : "health",
    );
  };


  /* <------------------------------ remains ------------------------------ */


  function createRemains(e) {
    if(e == null) return;

    if(e instanceof Building) {
      if(!PARAM.SHOULD_CREATE_BUILD_REMAINS || e.block instanceof ConstructBlock || e.block.size < 2 || MDL_cond._hasNoRemains(e.block)) return;
      MDL_effect._e_remains(e.x, e.y, e, e.team);
    } else {
      if(MDL_cond._hasNoRemains(e.type)) return;
      MDL_effect._e_remains(e.x, e.y, e, e.team);
    };
  };


  /* <------------------------------ status effect ------------------------------ */


  function triggerDeathStatus(unit) {
    let tup;
    VARGEN.deathStas.forEachFast(sta => {
      if(!unit.hasEffect(sta)) return;
      tup = sta.delegee.killedScrTup;
      if(tup == null) return;
      tup[0](unit);
    });
  };


/*
  ========================================
  Section: Application
  ========================================
*/



  TRIGGER.mapChange.addGlobalListener(nameMap => {

    PARAM.forceLoadParam();
    shouldInitRules = true;

    updateTitle();

  });


  MDL_event._c_onUpdate(() => {

    if(Vars.state.isPaused()) return;

    updateRules();
    updateWeather();
    updateAttr();

    updateDebug();
    updateUnit();

    if(Vars.state.isGame() && TIMER.paramLarge) {
      TRIGGER.majorIter.start.fire();
      VARGEN.mainTeams.forEachFast(team => {
        team.data().buildings.each(b => {
          TRIGGER.majorIter.building.fire(b, MDL_cond._isBuildingActive(b));
        });
        team.data().units.each(unit => {
          TRIGGER.majorIter.unit.fire(unit);
        });
      });
      TRIGGER.majorIter.end.fire();
    };

  }, 45262222);




  MDL_event._c_onBDamage((b, bul) => {

    createDamageDisplay(b, bul);

  }, 45751111);




  MDL_event._c_onBDestroy(t => {

    createRemains(t.build);

  }, 44932710);




  MDL_event._c_onUnitDamage((unit, bul) => {

    createDamageDisplay(unit, bul);

  }, 76523545);




  MDL_event._c_onUnitDestroy(unit => {

    createRemains(unit);
    triggerDeathStatus(unit);

    if(PARAM.SECRET_METAL_PIPE) MDL_effect.playAt(unit.x, unit.y, "se-meme-steel-pipe");

  }, 47596662);
