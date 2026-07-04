/**
 * A collection of event triggers.
 * @module lovec/glb/BOX_trigger
 */


const BOX_trigger = new CLS_objectBox({


  /* <------------------------------ state ------------------------------ */


  /**
   * Triggered when map is changed.
   * Can be fired more than once!
   * <br> <ARGS>: nameMap.
   */
  mapChange: new CLS_eventTrigger("lovec-map-change"),


  /**
   * Triggered when exiting some map.
   * Can be fired more than once!
   * <br> <ARGS>: nameMap.
   */
  mapExit: new CLS_eventTrigger("lovec-map-exit"),


  /**
   * Triggered when a game is fully loaded (not in editor).
   */
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


  /**
   * Triggered when LSAV is loaded.
   */
  lsavLoad: new CLS_eventTrigger("lovec-lsav-load"),


  /* <------------------------------ event ------------------------------ */


  /**
   * Triggered for very costy updates.
   */
  majorIter: {
    start: new CLS_eventTrigger("lovec-major-iter-start"),
    /** <ARGS>: b, isActive. */
    building: new CLS_eventTrigger("lovec-major-iter-building"),
    /** <ARGS>: unit. */
    unit: new CLS_eventTrigger("lovec-major-iter-unit"),
    end: new CLS_eventTrigger("lovec-major-iter-end"),
  },


  /**
   * Triggered whenever a unit (not loot or anything internal) is destroyed.
   * <br> <ARGS>: unit.
   */
  unitDestroy: (function() {
    MDL_event._c_onUnitDestroy(unit => {
      if(unit.internal) return;
      BOX_trigger.unitDestroy.fire(unit);
    });

    return new CLS_eventTrigger("lovec-unit-destroy");
  })(),


  /**
   * Triggered whenever a unit gets hidden by trees.
   * <br> <ARGS>: unit.
   */
  treeHide: new CLS_eventTrigger("lovec-tree-hide"),


  /**
   * Triggered whenever a content is unlocked.
   * <br> <ARGS>: ct.
   */
  contentUnlock: (function() {
    Events.on(UnlockEvent, ev => {
      BOX_trigger.contentUnlock.fire(ev.content);
    });

    return new CLS_eventTrigger("lovec-content-unlock");
  })(),


  /**
   * Triggered whenever an item is produced in some Lovec factory.
   * <br> <ARGS>: b, itm, amt.
   */
  itemProduce: new CLS_eventTrigger("lovec-item-produce"),


  /**
   * Triggered every two seconds whenever a fluid is produced in some Lovec factory.
   * <br> <ARGS>: b, liq.
   */
  fluidProduce: new CLS_eventTrigger("lovec-fluid-produce"),


  /**
   * Triggered whenever a large building is built.
   * See {@link BLK_constructionCore}.
   * <br> <ARGS>: b.
   */
  constructionComplete: new CLS_eventTrigger("lovec-construction-complete"),


  /**
   * Triggered whenever a loot is spawned.
   * <br> <ARGS>: loot.
   */
  lootSpawn: new CLS_eventTrigger("lovec-loot-spawn"),


  /**
   * Triggered whenever a loot is explicitly destroyed.
   * <br> <ARGS>: loot.
   */
  lootDestroy: new CLS_eventTrigger("lovec-loot-destroy"),


  /**
   * Triggered whenever a loot is drowned.
   * <br> <ARGS>: loot.
   */
  lootDrown: new CLS_eventTrigger("lovec-loot-drown"),


  /**
   * Triggered whenever a loot is taken by some unit.
   * <br> <ARGS>: unit, itm, amt.
   */
  lootTake: new CLS_eventTrigger("lovec-loot-take"),


  /**
   * Triggered whenever an impact wave is created (before creation).
   * <br> <ARGS>: x, y, dmg, rad.
   */
  impactWave: new CLS_eventTrigger("lovec-impact-wave"),


  /**
   * Triggered whenever a unit is killed by impact wave.
   * <br> <ARGS>: x, y, unit.
   */
  impactWaveDeath: new CLS_eventTrigger("lovec-impact-wave-death"),


  /**
   * Triggered whenever a unit touches powered wire and get damaged.
   * <br> <ARGS>: b, unit.
   */
  wireTouch: new CLS_eventTrigger("lovec-wire-touch"),


  /**
   * Triggered every second when a unit is rotated by a cogwheel.
   * <br> <ARGS>: b, unit.
   */
  cogwheelUnitSpin: new CLS_eventTrigger("lovec-cogwheel-unit-spin"),


  /**
   * Triggered whenever a building explodes due to nearby fire.
   * <br> <ARGS>: b.
   */
  buildingFireExplosion: new CLS_eventTrigger("lovec-building-fire-explosion"),


  /**
   * Triggered when a boiler explodes.
   * <br> <ARGS>: b.
   */
  boilerExplosion: new CLS_eventTrigger("lovec-boiler-explosion"),


  /* <------------------------------ util ------------------------------ */


  /**
   * Triggered when block is placed: {@link INTF_BLK_torqueBlock}.
   * <br> <ARGS>: b.
   */
  torqueBlockPlace: new CLS_eventTrigger("lovec-torque-block-place"),


  /* <------------------------------ achievement ------------------------------ */


  /**
   * Triggered when a filter or overflow gate is inverted.
   */
  invertSelection: new CLS_eventTrigger("lovec-invert-selection"),


  /**
   * Triggered when a powered metal pipe short-circuits.
   */
  poweredMetalPipe: new CLS_eventTrigger("lovec-powered-metal-pipe"),


  /**
   * Triggered when a unit triggers wet-step lightning of a cable.
   */
  wetStepOnCable: new CLS_eventTrigger("lovec-wet-step-on-cable"),


  /**
   * Triggered when an incinerator does something.
   */
  incineratorExplosion: new CLS_eventTrigger("lovec-incinerator-explosion"),


  /**
   * Triggered when player is killed by impact wave.
   */
  impactWavePlayerDeath: new CLS_eventTrigger("lovec-impact-wave-player-death"),


  /**
   * Triggered when a remote core unloader is placed in front of a core.
   */
  remoteCoreUnloaderNearCore: new CLS_eventTrigger("lovec-remote-core-unloader-near-core"),


  /**
   * Triggered on client load if the game has crashed due to secret code.
   */
  secretCodeCrash: new CLS_eventTrigger("lovec-secret-code-crash"),


});


module.exports = BOX_trigger;
