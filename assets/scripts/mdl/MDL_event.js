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


  /* <---------- trigger ----------> */


  /**
   * Called just after script is loaded.
   * @param {function(): void} scr
   * @param {number|string} id
   * @return {void}
   */
  const _c_onPostRun = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Core.app.post(() => {
      scr();
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onPostRun = _c_onPostRun;


  /**
   * Called after all contents are initialized (after `postInit`).
   * @param {function(): void} scr
   * @param {number|string} id
   * @return {void}
   */
  const _c_onInit = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(ContentInitEvent, () => {
      scr();
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onInit = _c_onInit;


  /**
   * Called on CLIENT LOAD.
   * @param {function(): void} scr
   * @param {number|string} id
   * @return {void}
   */
  const _c_onLoad = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.run(ClientLoadEvent, () => {
      scr();
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onLoad = _c_onLoad;


  /**
   * Called when starting loading a world, before `drawBase`.
   * @param {function(): void} scr
   * @param {number|string} id
   * @return {void}
   */
  const _c_onWorldLoadStart = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(WorldLoadBeginEvent, () => {
      scr();
    });
  }.
  setProp({
    ids: [],
  });
  exports._c_onWorldLoadStart = _c_onWorldLoadStart;


  /**
   * Called when finishing loading a world.
   * @param {function(): void} scr
   * @param {number|string} id
   * @return {void}
   */
  const _c_onWorldLoad = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.run(WorldLoadEvent, () => {
      scr();
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onWorldLoad = _c_onWorldLoad;


  /**
   * Called when saving a world.
   * @param {function(): void} scr
   * @param {number|string} id
   * @return {void}
   */
  const _c_onWorldSave = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.run(SaveWriteEvent, () => {
      scr();
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onWorldSave = _c_onWorldSave;


  /**
   * Called every frame when the game is not paused.
   * @param {function(): void} scr
   * @param {number|string} id
   * @return {void}
   */
  const _c_onUpdate = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.run(Trigger.update, () => {
      scr();
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onUpdate = _c_onUpdate;


  /**
   * Called every frame when drawing something.
   * @param {function(): void} scr
   * @param {number|string} id
   * @return {void}
   */
  const _c_onDraw = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.run(Trigger.draw, () => {
      scr();
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onDraw = _c_onDraw;


  /**
   * Called whenever a tile is tapped by local player, the tile is never null.
   * @param {function(Tile): void} scr
   * @param {number|string} id
   * @return {void}
   */
  const _c_onTileTap = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(TapEvent, ev => {
      if(ev.player === Vars.player && ev.tile != null) scr(ev.tile);
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onTileTap = _c_onTileTap;


  /**
   * Called whenever a building receives damage.
   * @param {function(Building, Bullet): void} scr
   * @param {number|string} id
   * @return {void}
   */
  const _c_onBDamage = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(BuildDamageEvent, ev => {
      scr(ev.build, ev.source);
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onBDamage = _c_onBDamage;


  /**
   * Called whenever a building is destroyed.
   * The building has already been removed!
   * @param {function(Tile): void} scr
   * @param {number|string} id
   * @return {void}
   */
  const _c_onBDestroy = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(BlockDestroyEvent, ev => {
      scr(ev.tile);
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onBDestroy = _c_onBDestroy;


  /**
   * Called whenever a unit receives damage.
   * @param {function(Unit, Bullet): void} scr
   * @param {number|string} id
   * @return {void}
   */
  const _c_onUnitDamage = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(UnitDamageEvent, ev => {
      scr(ev.unit, ev.bullet);
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onUnitDamage = _c_onUnitDamage;


  /**
   * Called whenever a unit is destroyed.
   * @param {function(Unit): void} scr
   * @param {number|string} id
   * @return {void}
   */
  const _c_onUnitDestroy = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(UnitDestroyEvent, ev => {
      scr(ev.unit);
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onUnitDestroy = _c_onUnitDestroy;


  /**
   * Called whenever a unit drowns.
   * @param {function(Unit): void} scr
   * @param {number|string} id
   * @return {void}
   */
  const _c_onUnitDrown = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    Events.on(UnitDrownEvent, ev => {
      scr(ev.unit);
    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onUnitDrown = _c_onUnitDrown;


  /* custom */


  /**
   * Called when left mouse button is pressed.
   * <br> <DEDICATION>: Extended-UI.
   * @param {function(number, number, number, number): void} scr - <ARGS>: dx, dy, x_f, y_f.
   * @param {number|string} id
   * @return {void}
   */
  const _c_onDrag = function thisFun(scr, id) {
    if(id != null && thisFun.ids.includes(id)) return;
    if(id != null) thisFun.ids.push(id);

    let isDragged = false;
    let startX = null, startY = null, lastX = null, lastY = null;
    let x = null, y = null;
    Events.run(Trigger.update, () => {

      let isTapped = Core.input.keyTap(KeyCode.mouseLeft);
      let isReleased = Core.input.keyRelease(KeyCode.mouseLeft);

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

      if(isDragged) {
        if(lastX != null && lastY != null) scr(x - lastX, y - lastY, startX, startY);
        lastX = x;
        lastY = y;
      };

    });
  }
  .setProp({
    ids: [],
  });
  exports._c_onDrag = _c_onDrag;
