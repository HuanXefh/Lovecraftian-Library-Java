/* ----------------------------------------
 * NOTE:
 *
 * A collection of event triggers.
 * Most triggers here will clear their listeners when map is changed, which are meant for buildings & units.
 * ---------------------------------------- */


/* <---------- import ----------> */


const CLS_objectBox = require("lovec/cls/struct/CLS_objectBox");
const CLS_eventTrigger = require("lovec/cls/util/CLS_eventTrigger");


const MDL_event = require("lovec/mdl/MDL_event");


/* <---------- meta ----------> */


const BOX_trigger = new CLS_objectBox({


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: nmMap
   * Triggered when map is changed.
   * ---------------------------------------- */
  mapChange: new CLS_eventTrigger("lovec-map-change"),


  /* ----------------------------------------
   * NOTE:
   *
   * Triggered when a game is fully loaded (not in editor).
   * ---------------------------------------- */
  gameLoad: (function() {
    let isGame = false, lastIsGame = false;
    MDL_event._c_onUpdate(() => {
      isGame = Vars.state.isGame() && !Vars.state.isEditor();
      if(isGame !== lastIsGame && isGame) {
        BOX_trigger.gameLoad.fire();
      };
      lastIsGame = isGame;
    });

    return new CLS_eventTrigger("lovec-game-load");
  })(),


  /* ----------------------------------------
   * NOTE:
   *
   * Triggered for very costy updates.
   * ---------------------------------------- */
  majorIter: {
    start: new CLS_eventTrigger("lovec-major-iter-start"),

    // @ARGS: b, isActive
    building: new CLS_eventTrigger("lovec-major-iter-building"),
    // @ARGS: unit
    unit: new CLS_eventTrigger("lovec-major-iter-unit"),

    end: new CLS_eventTrigger("lovec-major-iter-end"),
  },


  /* ----------------------------------------
   * NOTE:
   *
   * Triggered when a multi-block component's proximity is updated.
   * ---------------------------------------- */
  multiBlockUpdate: new CLS_eventTrigger("lovec-multi-block-update"),


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: unit
   * Triggered whenever a unit (not loot or anything internal) is destroyed.
   * ---------------------------------------- */
  unitDestroy: (function() {
    MDL_event._c_onUnitDestroy(unit => {
      if(unit.internal) return;
      BOX_trigger.unitDestroy.fire(unit);
    });

    return new CLS_eventTrigger("lovec-unit-destroy");
  })(),


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: unit
   * Triggered whenever a unit gets hidden by trees.
   * ---------------------------------------- */
  treeHide: new CLS_eventTrigger("lovec-tree-hide"),


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: b, itm, amt
   * Triggered whenever an item is produced in some Lovec factory.
   * ---------------------------------------- */
  itemProduce: new CLS_eventTrigger("lovec-item-produce"),


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: loot
   * Triggered whenever a loot unit is spawned.
   * ---------------------------------------- */
  lootSpawn: new CLS_eventTrigger("lovec-loot-spawn"),


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: unit
   * Triggered whenever a loot unit is explicitly destroyed.
   * ---------------------------------------- */
  lootDestroy: new CLS_eventTrigger("lovec-loot-destroy"),


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: unit, itm, amt
   * Triggered whenever a loot item is taken by some unit.
   * ---------------------------------------- */
  lootTake: new CLS_eventTrigger("lovec-loot-take"),


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: x, y, dmg, rad
   * Triggered whenever an impact wave is created (before creation).
   * ---------------------------------------- */
  impactWave: new CLS_eventTrigger("lovec-impact-wave"),


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: x, y, unit
   * Triggered whenever a unit is killed by impact wave.
   * ---------------------------------------- */
  impactWaveDeath: new CLS_eventTrigger("lovec-impact-wave-death"),


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: b, unit
   * Triggered whenever a unit touches powered wire.
   * ---------------------------------------- */
  wireTouch: new CLS_eventTrigger("lovec-wire-touch"),


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: b, unit
   * Triggered every second when a unit is rotated by a cogwheel.
   * ---------------------------------------- */
  cogwheelUnitSpin: new CLS_eventTrigger("lovec-cogwheel-unit-spin"),


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: b
   * Triggered whenever a building explodes due to nearby fire.
   * ---------------------------------------- */
  buildingFireExplosion: new CLS_eventTrigger("lovec-building-fire-explosion"),


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: b
   * Triggered when a boiler explodes.
   * ---------------------------------------- */
  boilerExplosion: new CLS_eventTrigger("lovec-boiler-explosion"),


  /* VERY SPECIAL ZONE */


  /* ----------------------------------------
   * NOTE:
   *
   * Triggered when a filter or overflow gate is inverted.
   * ---------------------------------------- */
  invertSelection: new CLS_eventTrigger("lovec-invert-selection"),


  /* ----------------------------------------
   * NOTE:
   *
   * Triggered when a powered metal pipe short-circuits.
   * ---------------------------------------- */
  poweredMetalPipe: new CLS_eventTrigger("lovec-powered-metal-pipe"),


  /* ----------------------------------------
   * NOTE:
   *
   * Triggered when a unit triggers wet-step lightning of a cable.
   * ---------------------------------------- */
  wetStepOnCable: new CLS_eventTrigger("lovec-wet-step-on-cable"),


  /* ----------------------------------------
   * NOTE:
   *
   * Triggered when an incinerator does something.
   * ---------------------------------------- */
  incineratorExplosion: new CLS_eventTrigger("lovec-incinerator-explosion"),


  /* ----------------------------------------
   * NOTE:
   *
   * Triggered when player is killed by impact wave.
   * ---------------------------------------- */
  impactWavePlayerDeath: new CLS_eventTrigger("lovec-impact-wave-player-death"),


  /* ----------------------------------------
   * NOTE:
   *
   * Triggered when a remote core unloader is placed in front of a core.
   * ---------------------------------------- */
  remoteCoreUnloaderNearCore: new CLS_eventTrigger("lovec-remote-core-unloader-near-core"),


  /* ----------------------------------------
   * NOTE:
   *
   * Triggered on client load if the game has crashed due to secret code.
   * ---------------------------------------- */
  secretCodeCrash: new CLS_eventTrigger("lovec-secret-code-crash"),


});


module.exports = BOX_trigger;
