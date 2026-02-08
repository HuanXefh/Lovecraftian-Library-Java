/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Sets up current map rules.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const TRIGGER = require("lovec/glb/BOX_trigger");
  const PARAM = require("lovec/glb/GLB_param");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_backend = require("lovec/mdl/MDL_backend");
  const MDL_event = require("lovec/mdl/MDL_event");


  const DB_env = require("lovec/db/DB_env");


  /* <---------- base ----------> */


  let
    rules = null,
    hasInit = false,
    hasWea = false;


  function evComp_updateBase() {
    if(!hasInit) evComp_init();
    evComp_updateWeather();
  };


  function evComp_init() {
    rules = Vars.state.rules;
    hasWea = false;
    hasInit = true;
  };


  function evComp_updateWeather() {
    if(hasWea || !Vars.state.isGame() || Vars.state.isEditor()) return;

    hasWea = true;
    Time.run(60.0, () => {
      let nmWeas = DB_env.db["param"]["map"]["weaEn"].read(PARAM.mapCur, Array.air);
      if(nmWeas.length > 0) {
        Groups.weather.clear();

        let weaEnSeq = new Seq();
        nmWeas.forEachFast(nmWea => {
          let weaEn = VARGEN.weaEns[nmWea];
          weaEn == null ?
            Log.warn("[LOVEC] Invalid weather name: " + nmWea.color(Pal.remove)) :
            weaEnSeq.add(weaEn);
        });
        rules.weather = weaEnSeq;
      };
    });
  };


/*
  ========================================
  Section: Application
  ========================================
*/




  TRIGGER.mapChange.addGlobalListener(nmMap => {
    hasInit = false;
    PARAM.forceLoadParam();
    MDL_backend.setWinTitle(
      null,
      "[$1][$2]".format(
        fetchSetting("misc-title-name"),
        !fetchSetting("misc-title-map") ? "" : ": [$1]".format(nmMap === "" ? "menu" : nmMap),
      ),
    );
  });




  MDL_event._c_onUpdate(() => {

    evComp_updateBase();

  }, 72663182);
