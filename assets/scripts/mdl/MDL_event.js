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
  const _c_onPostRun = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Core.app.post(() => {
      scr();
    });
  };
  exports._c_onPostRun = _c_onPostRun;


  /**
   * Called after all contents are initialized (after `postInit`).
   * @param {function(): void} scr
   * @param {number|string|unset} [id]
   * @return {void}
   */
  const _c_onInit = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(ContentInitEvent, () => {
      scr();
    });
  };
  exports._c_onInit = _c_onInit;


  /**
   * Called on CLIENT LOAD.
   * @param {function(): void} scr
   * @param {number|string|unset} [id]
   * @return {void}
   */
  const _c_onLoad = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.run(ClientLoadEvent, () => {
      scr();
    });
  };
  exports._c_onLoad = _c_onLoad;


  /**
   * Called just after CLIENT LOAD.
   * @param {function(): void} scr
   * @param {number|string|unset} [id]
   * @return {void}
   */
  const _c_onLoadPost = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.run(ClientLoadEvent, () => {
      Core.app.post(() => {
        scr();
      });
    });
  };
  exports._c_onLoadPost = _c_onLoadPost;


  /**
   * Called several frames after CLIENT LOAD.
   * @param {number} delay
   * @param {function(): void} scr
   * @param {number|string|unset} [id]
   * @return {void}
   */
  const _c_onLoadDelay = function thisFun(delay, scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.run(ClientLoadEvent, () => {
      Time.run(delay, () => {
        scr();
      });
    });
  };
  exports._c_onLoadDelay = _c_onLoadDelay;


  /**
   * Variant of {@link _c_onLoadDelay} that cannot be canceled.
   * @param {number} delay
   * @param {function(): void} scr
   * @param {number|string|unset} [id]
   * @return {void}
   */
  const _c_onLoadDelayTask = function thisFun(delay, scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.run(ClientLoadEvent, () => {
      Time.runTask(delay, () => {
        scr();
      });
    });
  };
  exports._c_onLoadDelayTask = _c_onLoadDelayTask;


  /**
   * Called when starting loading a world, before `drawBase`.
   * @param {function(): void} scr
   * @param {number|string|unset} [id]
   * @return {void}
   */
  const _c_onWorldLoadStart = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(WorldLoadBeginEvent, () => {
      scr();
    });
  };
  exports._c_onWorldLoadStart = _c_onWorldLoadStart;


  /**
   * Called when finishing loading a world.
   * @param {function(): void} scr
   * @param {number|string|unset} [id]
   * @return {void}
   */
  const _c_onWorldLoad = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.run(WorldLoadEvent, () => {
      scr();
    });
  };
  exports._c_onWorldLoad = _c_onWorldLoad;


  /**
   * Called when saving a world.
   * @param {function(): void} scr
   * @param {number|string|unset} [id]
   * @return {void}
   */
  const _c_onWorldSave = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.run(SaveWriteEvent, () => {
      scr();
    });
  };
  exports._c_onWorldSave = _c_onWorldSave;


  /**
   * Called every frame when the game is not paused.
   * @param {function(): void} scr
   * @param {number|string|unset} [id]
   * @return {void}
   */
  const _c_onUpdate = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.run(Trigger.update, () => {
      scr();
    });
  };
  exports._c_onUpdate = _c_onUpdate;


  /**
   * Called every frame when drawing something.
   * @param {function(): void} scr
   * @param {number|string|unset} [id]
   * @return {void}
   */
  const _c_onDraw = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.run(Trigger.draw, () => {
      scr();
    });
  };
  exports._c_onDraw = _c_onDraw;


  /**
   * Called whenever a tile is tapped by local player, the tile is never null.
   * @param {function(Tile): void} scr
   * @param {number|string|unset} [id]
   * @return {void}
   */
  const _c_onTileTap = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(TapEvent, ev => {
      if(ev.player === Vars.player && ev.tile != null) scr(ev.tile);
    });
  };
  exports._c_onTileTap = _c_onTileTap;


  /**
   * Called whenever a building receives damage.
   * @param {function(Building, Bullet): void} scr
   * @param {number|string|unset} [id]
   * @return {void}
   */
  const _c_onBDamage = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(BuildDamageEvent, ev => {
      scr(ev.build, ev.source);
    });
  };
  exports._c_onBDamage = _c_onBDamage;


  /**
   * Called whenever a building is destroyed.
   * The building has already been removed!
   * @param {function(Tile): void} scr
   * @param {number|string|unset} [id]
   * @return {void}
   */
  const _c_onBDestroy = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(BlockDestroyEvent, ev => {
      scr(ev.tile);
    });
  };
  exports._c_onBDestroy = _c_onBDestroy;


  /**
   * Called whenever a unit receives damage.
   * @param {function(Unit, Bullet): void} scr
   * @param {number|string|unset} [id]
   * @return {void}
   */
  const _c_onUnitDamage = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(UnitDamageEvent, ev => {
      scr(ev.unit, ev.bullet);
    });
  };
  exports._c_onUnitDamage = _c_onUnitDamage;


  /**
   * Called whenever a unit is destroyed.
   * @param {function(Unit): void} scr
   * @param {number|string|unset} [id]
   * @return {void}
   */
  const _c_onUnitDestroy = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(UnitDestroyEvent, ev => {
      scr(ev.unit);
    });
  };
  exports._c_onUnitDestroy = _c_onUnitDestroy;


  /**
   * Called whenever a unit drowns.
   * @param {function(Unit): void} scr
   * @param {number|string|unset} [id]
   * @return {void}
   */
  const _c_onUnitDrown = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(UnitDrownEvent, ev => {
      scr(ev.unit);
    });
  };
  exports._c_onUnitDrown = _c_onUnitDrown;


  /**
   * Called when left mouse button is pressed.
   * <br> <DEDICATION>: Extended-UI.
   * @param {function(number, number, number, number): void} scr - <ARGS>: dx, dy, x_f, y_f.
   * @param {number|string|unset} [id]
   * @return {void}
   */
  const _c_onDrag = function thisFun(scr, id) {
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

      if(x < pad || x > MDL_ui._screenW() - pad || y < pad || y > MDL_ui._screenH() - pad) {
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
  exports._c_onDrag = _c_onDrag;


/*
  ========================================
  Section: Application
  ========================================
*/




  // Create `ids` array for every method here
  for(let key in module.exports) {
    module.exports[key].ids = [];
  };
