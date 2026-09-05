/**
 * A collection of event triggers.
 * @module lovec/glb/BOX_trigger
 */


/**
 * @namespace BOX_trigger
 */
const BOX_trigger = new CLS_objectBox({


    /**
     * Triggers some event trigger by name.
     * Mostly for invocation from Java.
     * @param {String} name
     * @param {Object|unset} [arg1]
     * @param {Object|unset} [arg2]
     * @param {Object|unset} [arg3]
     * @param {Object|unset} [arg4]
     * @param {Object|unset} [arg5]
     * @param {Object|unset} [arg6]
     * @return {void}
     */
    fire: function(name, arg1, arg2, arg3, arg4, arg5, arg6) {
        let trigger = BOX_trigger[name];
        if(!(trigger instanceof CLS_eventTrigger)) throw new Error("No trigger found by name ${1}!".format(name));
        trigger.fire(arg1, arg2, arg3, arg4, arg5, arg6);
    },


    /* <------------------------------ state ------------------------------ */


    /**
     * Triggered when map is changed.
     * Can be fired more than once!
     * <br> `ARGS`: `string` - nameMap.
     * @type {CLS_eventTrigger}
     */
    mapChange: new CLS_eventTrigger("lovec-map-change"),


    /**
     * Triggered when exiting some map.
     * Can be fired more than once!
     * <br> `ARGS`: `string` - nameMap.
     * @type {CLS_eventTrigger}
     */
    mapExit: new CLS_eventTrigger("lovec-map-exit"),


    /**
     * Triggered when a game is fully loaded (not in editor).
     * @type {CLS_eventTrigger}
     */
    gameLoad: (function() {
        let isGame = false, lastIsGame = false;
        MDL_event.onUpdate(() => {
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
     * @type {CLS_eventTrigger}
     */
    lsavLoad: new CLS_eventTrigger("lovec-lsav-load"),


    /* <------------------------------ event ------------------------------ */


    /**
     * Triggered for very costy updates.
     * @type {Object<string, CLS_eventTrigger>}
     */
    majorIter: {
        start: new CLS_eventTrigger("lovec-major-iter-start"),
        /** `ARGS`: b, isActive. */
        building: new CLS_eventTrigger("lovec-major-iter-building"),
        /** `ARGS`: unit. */
        unit: new CLS_eventTrigger("lovec-major-iter-unit"),
        end: new CLS_eventTrigger("lovec-major-iter-end"),
    },


    /**
     * Triggered for data sync.
     * Never triggered in single player.
     * @type {CLS_eventTrigger}
     */
    majorSync: new CLS_eventTrigger("lovec-major-sync"),


    /**
     * Triggered whenever a unit (not loot or anything internal) is destroyed.
     * <br> `ARGS`: `Unit` - unit.
     * @type {CLS_eventTrigger}
     */
    unitDestroy: (function() {
        MDL_event.onUnitDestroy(unit => {
            if(unit.internal) return;
            BOX_trigger.unitDestroy.fire(unit);
        });

        return new CLS_eventTrigger("lovec-unit-destroy");
    })(),


    /**
     * Triggered whenever a unit gets hidden by trees.
     * <br> `ARGS`: `Unit` - unit.
     * @type {CLS_eventTrigger}
     */
    treeHide: new CLS_eventTrigger("lovec-tree-hide"),


    /**
     * Triggered whenever a content is unlocked.
     * <br> `ARGS`: `UnlockableContent` - ct.
     * @type {CLS_eventTrigger}
     */
    contentUnlock: (function() {
        Events.on(UnlockEvent, ev => {
            BOX_trigger.contentUnlock.fire(ev.content);
        });

        return new CLS_eventTrigger("lovec-content-unlock");
    })(),


    /**
     * Triggered whenever an item is produced in some Lovec factory.
     * <br> `ARGS`: `Building` - b, `Item` - item, `number` - amt.
     * @type {CLS_eventTrigger}
     */
    itemProduce: new CLS_eventTrigger("lovec-item-produce"),


    /**
     * Triggered every two seconds whenever a fluid is produced in some Lovec factory.
     * <br> `ARGS`: `Building` - b, `Liquid` - liq.
     * @type {CLS_eventTrigger}
     */
    fluidProduce: new CLS_eventTrigger("lovec-fluid-produce"),


    /**
     * Triggered whenever a crop is harvested.
     * <br> `ARGS`: `Building` - b, `Item` - item.
     * @type {CLS_eventTrigger}
     */
    cropHarvest: new CLS_eventTrigger("lovec-crop-harvest"),


    /**
     * Triggered whenever a large building is built.
     * See {@link BLK_constructionCore}.
     * <br> `ARGS`: `Building` - b.
     * @type {CLS_eventTrigger}
     */
    constructionComplete: new CLS_eventTrigger("lovec-construction-complete"),


    /**
     * Triggered whenever a loot is spawned.
     * <br> `ARGS`: `Unit` - loot.
     * @type {CLS_eventTrigger}
     */
    lootSpawn: new CLS_eventTrigger("lovec-loot-spawn"),


    /**
     * Triggered whenever a loot is explicitly destroyed.
     * <br> `ARGS`: `Unit` - loot.
     * @type {CLS_eventTrigger}
     */
    lootDestroy: new CLS_eventTrigger("lovec-loot-destroy"),


    /**
     * Triggered whenever a loot is drowned.
     * <br> `ARGS`: `Unit` - loot.
     * @type {CLS_eventTrigger}
     */
    lootDrown: new CLS_eventTrigger("lovec-loot-drown"),


    /**
     * Triggered whenever a loot is taken by some unit.
     * <br> `ARGS`: `Unit` - unit, `Item` - item, `number` - amt.
     * @type {CLS_eventTrigger}
     */
    lootTake: new CLS_eventTrigger("lovec-loot-take"),


    /**
     * Triggered whenever an impact wave is created (before creation).
     * <br> `ARGS`: `number` - x, `number` - y, `number` - dmg, `number` - rad.
     * @type {CLS_eventTrigger}
     */
    impactWave: new CLS_eventTrigger("lovec-impact-wave"),


    /**
     * Triggered whenever a unit is killed by impact wave.
     * <br> `ARGS`: `number` - x, `number` - y, `Unit` - unit.
     * @type {CLS_eventTrigger}
     */
    impactWaveDeath: new CLS_eventTrigger("lovec-impact-wave-death"),


    /**
     * Triggered whenever a unit touches powered wire and get damaged.
     * <br> `ARGS`: `Building` - b, `Unit` - unit.
     * @type {CLS_eventTrigger}
     */
    wireTouch: new CLS_eventTrigger("lovec-wire-touch"),


    /**
     * Triggered every second when a unit is rotated by a cogwheel.
     * <br> `ARGS`: `Building` - b, `Unit` - unit.
     * @type {CLS_eventTrigger}
     */
    cogwheelUnitSpin: new CLS_eventTrigger("lovec-cogwheel-unit-spin"),


    /**
     * Triggered whenever a building explodes due to nearby fire.
     * <br> `ARGS`: `Building` - b.
     * @type {CLS_eventTrigger}
     */
    buildingFireExplosion: new CLS_eventTrigger("lovec-building-fire-explosion"),


    /**
     * Triggered when a boiler explodes.
     * <br> `ARGS`: `Building` - b.
     * @type {CLS_eventTrigger}
     */
    boilerExplosion: new CLS_eventTrigger("lovec-boiler-explosion"),


    /* <------------------------------ util ------------------------------ */


    /**
     * Triggered when some ability data should be initialized.
     * @type {CLS_eventTrigger}
     */
    abilityDataInit: (function() {
        Time.run(0.0, () => {
            MDL_event.onWorldLoad(() => BOX_trigger.abilityDataInit.fire());
            BOX_trigger.majorSync.addGlobalListener(() => BOX_trigger.abilityDataInit.fire());
        });

        return new CLS_eventTrigger("lovec-ability-data-init");
    })(),


    /**
     * Triggered when block is placed: {@link INTF_BLK_torqueBlock}.
     * <br> `ARGS`: `Building` - b.
     * @type {CLS_eventTrigger}
     */
    torqueBlockPlace: new CLS_eventTrigger("lovec-torque-block-place"),


    /**
     * Triggered when block is configured: {@link INTF_BLK_torqueBlock}.
     * <br> `ARGS`: `Building` - b.
     * @type {CLS_eventTrigger}
     */
    torqueBlockConfigure: new CLS_eventTrigger("lovec-torque-block-configure"),


    /* <------------------------------ achievement ------------------------------ */


    /**
     * Triggered when a filter or overflow gate is inverted.
     * @type {CLS_eventTrigger}
     */
    invertSelection: new CLS_eventTrigger("lovec-invert-selection"),


    /**
     * Triggered when a powered metal pipe short-circuits.
     * @type {CLS_eventTrigger}
     */
    poweredMetalPipe: new CLS_eventTrigger("lovec-powered-metal-pipe"),


    /**
     * Triggered when a unit triggers wet-step lightning of a cable.
     * @type {CLS_eventTrigger}
     */
    wetStepOnCable: new CLS_eventTrigger("lovec-wet-step-on-cable"),


    /**
     * Triggered when an incinerator does something.
     * @type {CLS_eventTrigger}
     */
    incineratorExplosion: new CLS_eventTrigger("lovec-incinerator-explosion"),


    /**
     * Triggered when player is killed by impact wave.
     * @type {CLS_eventTrigger}
     */
    impactWavePlayerDeath: new CLS_eventTrigger("lovec-impact-wave-player-death"),


    /**
     * Triggered when a remote core unloader is placed in front of a core.
     * @type {CLS_eventTrigger}
     */
    remoteCoreUnloaderNearCore: new CLS_eventTrigger("lovec-remote-core-unloader-near-core"),


    /**
     * Triggered on client load if the game has crashed due to secret code.
     * @type {CLS_eventTrigger}
     */
    secretCodeCrash: new CLS_eventTrigger("lovec-secret-code-crash"),


});


module.exports = BOX_trigger;
