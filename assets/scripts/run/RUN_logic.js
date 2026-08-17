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
    MDL_backend.setTitle(
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
      if(MDL_cond.isIrregularUnit(unit)) return;

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
    Time.run(VAR.delay.mapChange.setWeather, () => {
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

    let dmg = MDL_prop.calcBulDmg(bul, e);
    if(dmg < PARAM.DAMAGE_DISPLAY_THRESHOLD) return;

    MDL_effect.damage(
      e.x, e.y, dmg, bul.team,
      (e instanceof Building ? MDL_prop.getBuildShield(e, true) : e.shield) > dmg ? "shield" : "health",
    );
  };


  /* <------------------------------ remains ------------------------------ */


  function createRemains(e) {
    if(e == null || !UTIL_remains.checkRemainsValid(e)) return;

    UTIL_remains.create(e.x, e.y, e, e.team, false, false);
  };


  /* <------------------------------ status effect ------------------------------ */


  function triggerDeathStatus(unit) {
    let scr;
    VARGEN.deathStas.forEachFast(sta => {
      if(!unit.hasEffect(sta)) return;
      scr = sta.delegee.killedScr;
      if(scr == null) return;
      scr.get(unit);
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


  MDL_event.onUpdate(() => {

    if(Vars.state.isPaused()) return;

    if(TIMER.secQuarter && DEBUG.shouldLogDelta) {
      console.log("[LOVEC] Current delta: " + Time.delta);
    };

    updateRules();
    updateWeather();
    updateAttr();

    updateDebug();
    updateUnit();

    if(Vars.state.isGame() && TIMER.paramLarge) {
      TRIGGER.majorIter.start.fire();
      VARGEN.mainTeams.forEachFast(team => {
        team.data().buildings.each(b => {
          TRIGGER.majorIter.building.fire(b, MDL_cond.isBuildingActive(b));
        });
        team.data().units.each(unit => {
          TRIGGER.majorIter.unit.fire(unit);
        });
      });
      TRIGGER.majorIter.end.fire();
    };

  });




  MDL_event.onBuildDamage((b, bul) => {

    createDamageDisplay(b, bul);

  });




  MDL_event.onBuildDestroy(t => {

    createRemains(t.build);

  });




  MDL_event.onUnitDamage((unit, bul) => {

    createDamageDisplay(unit, bul);

  });




  MDL_event.onUnitDestroy(unit => {

    createRemains(unit);
    triggerDeathStatus(unit);

  });
