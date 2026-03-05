/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * For in-game rendering.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- noise ----------> */


  let noiseArgs = null;


  function _noiseArgs() {
    return DB_env.db["param"]["map"]["noise"].read(PARAM.mapCur, null);
  };


  function drawNoise() {
    if(Vars.state.isMenu() || !Core.settings.getBool("showweather") || noiseArgs == null) return;
    let tex = VARGEN.noiseTexs[noiseArgs[0]];
    if(tex == null) return;

    processZ(Layer.weather - 0.9);

    let i = 0, iCap = noiseArgs.iCap();
    while(i < iCap) {
      Weather.drawNoise(tex, noiseArgs[i + 1], noiseArgs[i + 2], noiseArgs[i + 3], noiseArgs[i + 4], noiseArgs[i + 5], noiseArgs[i + 6], noiseArgs[i + 7], noiseArgs[i + 8]);
      i += 9;
    };
    Draw.reset();

    processZ();
  };


/*
  ========================================
  Section: Application
  ========================================
*/




  TRIGGER.gameLoad.addGlobalListener(() => {

    MDL_ui._d_fade(0.0, Color.black, 0.0, 2.0, 0.5);

    Time.run(30.0, () => {
      noiseArgs = _noiseArgs();
    });

  });




  MDL_event._c_onDraw(() => {

    drawNoise();

  }, 7792273);
