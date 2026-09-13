/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Lovec version of {@link Events.on} and {@link Events.run}.
     * @module lovec/mdl/MDL_event
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /**
     * Called just after script is loaded.
     * @param {C0Function} scr
     * @param {number|string|unset} [id]
     * @return {void}
     */
    const onPostRun = function thisFun(scr, id) {
        if(id != null && thisFun.ids.includes(id)) return;
        if(id != null) thisFun.ids.push(id);

        Core.app.post(() => {
            scr();
        });
    };
    exports.onPostRun = onPostRun;


    /**
     * Called after all contents are initialized (after `postInit`).
     * @param {C0Function} scr
     * @param {number|string|unset} [id]
     * @return {void}
     */
    const onInit = function thisFun(scr, id) {
        if(id != null && thisFun.ids.includes(id)) return;
        if(id != null) thisFun.ids.push(id);

        Events.on(ContentInitEvent, ev => {
            scr();
        });
    };
    exports.onInit = onInit;


    /**
     * Called on CLIENT LOAD.
     * @param {C0Function} scr
     * @param {number|string|unset} [id]
     * @return {void}
     */
    const onLoad = function thisFun(scr, id) {
        if(id != null && thisFun.ids.includes(id)) return;
        if(id != null) thisFun.ids.push(id);

        Events.run(ClientLoadEvent, () => {
            scr();
        });
    };
    exports.onLoad = onLoad;


    /**
     * Called just after CLIENT LOAD.
     * @param {C0Function} scr
     * @param {number|string|unset} [id]
     * @return {void}
     */
    const onLoadPost = function thisFun(scr, id) {
        if(id != null && thisFun.ids.includes(id)) return;
        if(id != null) thisFun.ids.push(id);

        Events.run(ClientLoadEvent, () => {
            Core.app.post(() => {
                scr();
            });
        });
    };
    exports.onLoadPost = onLoadPost;


    /**
     * Called several frames after CLIENT LOAD.
     * @param {number} delay
     * @param {C0Function} scr
     * @param {number|string|unset} [id]
     * @return {void}
     */
    const onLoadDelay = function thisFun(delay, scr, id) {
        if(id != null && thisFun.ids.includes(id)) return;
        if(id != null) thisFun.ids.push(id);

        Events.run(ClientLoadEvent, () => {
            Time.run(delay, () => {
                scr();
            });
        });
    };
    exports.onLoadDelay = onLoadDelay;


    /**
     * Variant of {@link onLoadDelay} that cannot be canceled.
     * @param {number} delay
     * @param {C0Function} scr
     * @param {number|string|unset} [id]
     * @return {void}
     */
    const onLoadDelayTask = function thisFun(delay, scr, id) {
        if(id != null && thisFun.ids.includes(id)) return;
        if(id != null) thisFun.ids.push(id);

        Events.run(ClientLoadEvent, () => {
            Time.runTask(delay, () => {
                scr();
            });
        });
    };
    exports.onLoadDelayTask = onLoadDelayTask;


    /**
     * Called when starting loading a world, before `drawBase`.
     * @param {C0Function} scr
     * @param {number|string|unset} [id]
     * @return {void}
     */
    const onWorldLoadStart = function thisFun(scr, id) {
        if(id != null && thisFun.ids.includes(id)) return;
        if(id != null) thisFun.ids.push(id);

        Events.on(WorldLoadBeginEvent, ev => {
            scr();
        });
    };
    exports.onWorldLoadStart = onWorldLoadStart;


    /**
     * Called when finishing loading a world.
     * @param {C0Function} scr
     * @param {number|string|unset} [id]
     * @return {void}
     */
    const onWorldLoad = function thisFun(scr, id) {
        if(id != null && thisFun.ids.includes(id)) return;
        if(id != null) thisFun.ids.push(id);

        Events.run(WorldLoadEvent, () => {
            scr();
        });
    };
    exports.onWorldLoad = onWorldLoad;


    /**
     * Called when saving a world.
     * @param {C0Function} scr
     * @param {number|string|unset} [id]
     * @return {void}
     */
    const onWorldSave = function thisFun(scr, id) {
        if(id != null && thisFun.ids.includes(id)) return;
        if(id != null) thisFun.ids.push(id);

        Events.run(SaveWriteEvent, () => {
            scr();
        });
    };
    exports.onWorldSave = onWorldSave;


    /**
     * Called every frame when the game is not paused.
     * @param {C0Function} scr
     * @param {number|string|unset} [id]
     * @return {void}
     */
    const onUpdate = function thisFun(scr, id) {
        if(id != null && thisFun.ids.includes(id)) return;
        if(id != null) thisFun.ids.push(id);

        Events.run(Trigger.update, () => {
            scr();
        });
    };
    exports.onUpdate = onUpdate;


    /**
     * Called every frame when drawing something.
     * @param {C0Function} scr
     * @param {number|string|unset} [id]
     * @return {void}
     */
    const onDraw = function thisFun(scr, id) {
        if(id != null && thisFun.ids.includes(id)) return;
        if(id != null) thisFun.ids.push(id);

        Events.run(Trigger.draw, () => {
            scr();
        });
    };
    exports.onDraw = onDraw;


    /**
     * Called whenever a tile is tapped by local player, the tile is never null.
     * @param {CFunction(Tile)} scr
     * @param {number|string|unset} [id]
     * @return {void}
     */
    const onTileTap = function thisFun(scr, id) {
        if(id != null && thisFun.ids.includes(id)) return;
        if(id != null) thisFun.ids.push(id);

        Events.on(TapEvent, ev => {
            if(ev.player === Vars.player && ev.tile != null) scr(ev.tile);
        });
    };
    exports.onTileTap = onTileTap;


    /**
     * Called whenever a building receives damage.
     * @param {C2Function(Building, Bullet)} scr
     * @param {number|string|unset} [id]
     * @return {void}
     */
    const onBuildDamage = function thisFun(scr, id) {
        if(id != null && thisFun.ids.includes(id)) return;
        if(id != null) thisFun.ids.push(id);

        Events.on(BuildDamageEvent, ev => {
            scr(ev.build, ev.source);
        });
    };
    exports.onBuildDamage = onBuildDamage;


    /**
     * Called whenever a building is destroyed.
     * The building has already been removed!
     * @param {CFunction(Tile)} scr
     * @param {number|string|unset} [id]
     * @return {void}
     */
    const onBuildDestroy = function thisFun(scr, id) {
        if(id != null && thisFun.ids.includes(id)) return;
        if(id != null) thisFun.ids.push(id);

        Events.on(BlockDestroyEvent, ev => {
            scr(ev.tile);
        });
    };
    exports.onBuildDestroy = onBuildDestroy;


    /**
     * Called whenever a unit receives damage.
     * @param {C2Function(Unit, Bullet)} scr
     * @param {number|string|unset} [id]
     * @return {void}
     */
    const onUnitDamage = function thisFun(scr, id) {
        if(id != null && thisFun.ids.includes(id)) return;
        if(id != null) thisFun.ids.push(id);

        Events.on(UnitDamageEvent, ev => {
            scr(ev.unit, ev.bullet);
        });
    };
    exports.onUnitDamage = onUnitDamage;


    /**
     * Called whenever a unit is destroyed.
     * @param {CFunction(Unit)} scr
     * @param {number|string|unset} [id]
     * @return {void}
     */
    const onUnitDestroy = function thisFun(scr, id) {
        if(id != null && thisFun.ids.includes(id)) return;
        if(id != null) thisFun.ids.push(id);

        Events.on(UnitDestroyEvent, ev => {
            scr(ev.unit);
        });
    };
    exports.onUnitDestroy = onUnitDestroy;


    /**
     * Called whenever a unit drowns.
     * @param {CFunction(Unit)} scr
     * @param {number|string|unset} [id]
     * @return {void}
     */
    const onUnitDrown = function thisFun(scr, id) {
        if(id != null && thisFun.ids.includes(id)) return;
        if(id != null) thisFun.ids.push(id);

        Events.on(UnitDrownEvent, ev => {
            scr(ev.unit);
        });
    };
    exports.onUnitDrown = onUnitDrown;


    /**
     * Called whenever a player joins the game.
     * @param {CFunction(Player)} scr
     * @param {number|string|unset} [id]
     * @return {void}
     */
    const onPlayerJoin = function thisFun(scr, id) {
        if(id != null && thisFun.ids.includes(id)) return;
        if(id != null) thisFun.ids.push(id);

        Events.on(PlayerJoin, ev => {
            scr(ev.player);
        });
    };
    exports.onPlayerJoin = onPlayerJoin;


    /**
     * Called when left mouse button is pressed.
     * <br> `DEDICATION`: Extended-UI.
     * @param {C4Function(number, number, number, number)} scr - `ARGS`: dx, dy, x_f, y_f.
     * @param {number|string|unset} [id]
     * @return {void}
     */
    const onDrag = function thisFun(scr, id) {
        if(id != null && thisFun.ids.includes(id)) return;
        if(id != null) thisFun.ids.push(id);

        let
            x = null,
            y = null,
            startX = null,
            startY = null,
            lastX = null,
            lastY = null,
            isTapped = false,
            isReleased = false,
            isDragged = false,
            pad = 8.0;

        Events.run(Trigger.update, () => {
            isTapped = Core.input.keyTap(KeyCode.mouseLeft);
            isReleased = Core.input.keyRelease(KeyCode.mouseLeft);
            if(!isDragged && !isTapped && !isReleased) return;
            x = Core.input.mouseX();
            y = Core.input.mouseY();

            // Drag start
            if(isTapped) {
                isDragged = true;
                startX = x;
                startY = y;
            };
            // Drag end
            if(isReleased && isDragged) {
                isDragged = false;
                startX = null;
                startY = null;
                lastX = null;
                lastY = null;
            };
            // Trigger drag near margin
            if(x < pad || x > MDL_ui.getScreenW() - pad || y < pad || y > MDL_ui.getScreenH() - pad) {
                if(lastX != null && lastY != null) {
                    scr(0.0, 0.0, startX, startY);
                };
                return;
            };
            // Trigger drag
            if(isDragged) {
                if(lastX != null && lastY != null) {
                    scr(x - lastX, y - lastY, startX, startY);
                };
                lastX = x;
                lastY = y;
            };
        });
    };
    exports.onDrag = onDrag;


/*
  ========================================
  Section: Application
  ========================================
*/




    // Create `ids` array for every method here
    for(let key in module.exports) {
        module.exports[key].ids = [];
    };
