/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Sets up current map rules.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  let
    rules = null,
    hasInit = false,
    hasWea = false;


  function update() {
    if(!hasInit) init();
    updateWeather();
  };


  function init() {
    rules = Vars.state.rules;
    hasWea = false;
    hasInit = true;
  };


  function updateWeather() {
    if(hasWea || !Vars.state.isGame() || Vars.state.isEditor()) return;

    hasWea = true;
    Time.run(60.0, () => {
      let nmWeas = DB_env.db["param"]["map"]["weaEn"].read(PARAM.MAP_CURRENT, Array.air);
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
      "${1}${2}".format(
        fetchSetting("misc-title-name"),
        !fetchSetting("misc-title-map") ? "" : ": ${1}".format(String.isEmpty(nmMap) ? "menu" : nmMap),
      ),
    );

  });




  MDL_event._c_onUpdate(() => {

    update();

  }, 72663182);
