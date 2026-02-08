/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Registers new dialog flows.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_dialogFlowBuilder = require("lovec/cls/util/builder/CLS_dialogFlowBuilder");


  /* <---------- base ----------> */


  // Example dialog flow, type {lovec.mdl_ui._d_flow('lovec-test')} in console to see
  newDialogFlow(
    "lovec-test",
    new CLS_dialogFlowBuilder()
    .setBgmStart(Musics.boss1)
    .setText("lovec", "test", 0).setSpeaker("lovec", "earlan").setChara({
      nmMod: "lovec", nmChara: "earlan",
      fracX: 0.5, isDark: false,
      anim: "fade-in",
    })
    .setText("lovec", "test", 1).setChara({
      nmMod: "lovec", nmChara: "earlan",
      fracX: 0.5, isDark: true,
    })
    .setColorTransition().setChara({
      nmMod: "lovec", nmChara: "earlan",
      fracX: 0.5, isDark: true,
    })
    .setText("lovec", "test", 2).setChara({
      nmMod: "lovec", nmChara: "earlan",
      fracX: 0.5, isDark: true,
      anim: "move", animParamObj: {
        transTimeS: 1.0,
        fracXFrom: 0.5,
        fracXTo: 0.33,
      },
    })
    .setBgmEnd().setChara({
      nmMod: "lovec", nmChara: "earlan",
      fracX: 0.33, isDark: true,
      anim: "fade-out",
    })
    .build(),
  );
