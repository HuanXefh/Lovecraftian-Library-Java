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
   * @param {function(): void} scr
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
   * @param {function(): void} scr
   * @param {number|string|unset} [id]
   * @return {void}
   */
  const onInit = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(ContentInitEvent, () => {
      scr();
    });
  };
  exports.onInit = onInit;


  /**
   * Called on CLIENT LOAD.
   * @param {function(): void} scr
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
   * @param {function(): void} scr
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
   * @param {function(): void} scr
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
   * @param {function(): void} scr
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
   * @param {function(): void} scr
   * @param {number|string|unset} [id]
   * @return {void}
   */
  const onWorldLoadStart = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(WorldLoadBeginEvent, () => {
      scr();
    });
  };
  exports.onWorldLoadStart = onWorldLoadStart;


  /**
   * Called when finishing loading a world.
   * @param {function(): void} scr
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
   * @param {function(): void} scr
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
   * @param {function(): void} scr
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
   * @param {function(): void} scr
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
   * @param {function(Tile): void} scr
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
   * @param {function(Building, Bullet): void} scr
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
   * @param {function(Tile): void} scr
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
   * @param {function(Unit, Bullet): void} scr
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
   * @param {function(Unit): void} scr
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
   * @param {function(Unit): void} scr
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
   * Called when left mouse button is pressed.
   * <br> `DEDICATION`: Extended-UI.
   * @param {function(number, number, number, number): void} scr - `ARGS`: dx, dy, x_f, y_f.
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

      if(x < pad || x > MDL_ui.getScreenW() - pad || y < pad || y > MDL_ui.getScreenH() - pad) {
        if(lastX != null && lastY != null) scr(0.0, 0.0, startX, startY);
        return;
      };

      if(isDragged) {
        if(lastX != null && lastY != null) scr(x - lastX, y - lastY, startX, startY);
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
