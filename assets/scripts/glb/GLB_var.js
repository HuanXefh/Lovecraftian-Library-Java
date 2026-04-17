/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Most basic static parameters, just like {@link Vars} in Mindustry.
   * Do not import anything here!
   * @module lovec/glb/GLB_var
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  exports.ctParser = Reflect.get(Mods, Vars.mods, "parser");


  exports.lovecReviOff = 96;


  exports.layer = {
    offDraw: 6.11,
    offDrawOver: 26.11,
    effFlr: 14.11,
    effBase: 69.11,
    effHigh: 116.41,
    effSmog: 86.11,
    effSmogHigh: 116.01,
    effBloom: 109.61,
    p3dRange: 34.52,
    unitRange: 115.03,
    overText: 219.81,
    debugFlr: 2.21,
    debugTop: 118.91,

    vent: 0.61,
    randOv: 1.07,
    onConveyor: 29.76,
    buildRemainsDrown: 22.05,
    buildRemains: 27.07,
    unitRemainsDrown: 22.07,
    unitRemains: 58.11,
    dporeRevealed: 107.21,

    bulBase: 74.11,
    bulHigh: 86.01,
    bulFlame: 108.51,
  };


  exports.priority = {
    powTrans: 0.1,
    min: 0.2,
    fac: 0.5,
    powGen: 1.4,
    proj: 1.2,
  };


  exports.time = {
    liqIntv: 4.0,
    heatIntv: 20.0,
    paramIntv: 90.0,
    paramGlobalIntv: 110.0,
    paramLargeIntv: 600.0,
    lightningIntv: 40.0,
    unitIntv: 20.0,

    drownDef: 200.0,
    flrStaDef: 40.0,
    liqStaDef: 150.0,
    unitStaDef: 120.0,
    stackStaExtDef: 120.0,

    extraInfoCooldown: 50.0,
    lootProtection: 240.0,
    lootLifetime: 7200.0,
    noLinkDespawnTime: 30.0,
  };


  exports.chance = {
    effPCap: 0.08,

    unitUpdateP: 0.6,
    polUpdateP: 0.2,
  };


  exports.range = {
    mouseRad: 28.0,
    treeHideMaxRad: 28.0,
    presExploRad: 34.4,
    lootRad: 80.0,
    lootPickRad: 10.0,
    lootMergeRad: 4.0,
    unitLootRad: 18.0,

    offBuildStatR: 2.25,
    unitSurR: 4,
  };


  exports.length = {
    ordW: 120.0,
    charBtnW: 42.0,
    bgW: 1920.0,
    bgH: 1080.0,
    charaW: 450.0,
    charaH: 900.0,
  };


  exports.color = {
    whiteClear: Color.valueOf("ffffff00"),
    darkMix: Color.valueOf("606060"),
    heatMix: Color.valueOf("ff3838"),
    smogWhite: Color.valueOf("ffffff40"),
    smogWhiteThick: Color.valueOf("ffffff60"),
    smogWhiteThickest: Color.valueOf("ffffffc0"),
    rotorWhite: Color.valueOf("ffffff30"),
  };


  exports.param = {
    presExploDmg: 1800.0,
    presDmgFrac: 0.015,
    presDmgMin: 3.0,
    corDmgFrac: 0.0135,
    corDmgMin: 2.0,
    clogViscThr: 0.7,
    clogDmgMin: 3.0,
    impactDmgMin: 40.0,
    lightningDmg: 20.0,
    shortCircuitDmgFrac: 0.12,
    rpmDmgFrac: 0.15,
    heatDmgMax: 100.0,
    overheatedConversionDmg: 150.0,

    auxCap: 1.0,
    auxHeatTempFrac: 0.01666667,
    terFlrThr: 0.75,
    buildActiveEffcThr: 0.96,
    powSourceStdProd: 8000.0,

    ctNmColorMtp: 1.15,
    ctNmColorMtpHigh: 1.5,
    buildRemainsOffCap: 90.0,
    ovCogA1: 0.315,
    ovCogA2: 0.7,
  };


  MDL_event._c_onLoad(() => {
    exports.dialog = {
      ct1: Vars.headless ? null : new ContentInfoDialog(),
      ct2: Vars.headless ? null : new ContentInfoDialog(),
      ct3: Vars.headless ? null : new ContentInfoDialog(),
    };
  });
