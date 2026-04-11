/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Some backend methods, do not try this util you know how it works.
   * @module lovec/mdl/MDL_backend
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  const useSDL3 = typeof SDLVideo.SDL_SetWindowTitle === "function";


  /**
   * Gets/sets clipboard text.
   * @param {string} param
   * @return {string}
   */
  const accClipboard = function(param) {
    if(param === "read") {
      return Core.app.getClipboardText();
    };

    let str = String(param);
    Core.app.setClipboardText(str);

    return str;
  };
  exports.accClipboard = accClipboard;


  /* <---------- window ----------> */


  /**
   * Minimizes a window.
   * @param {number|unset} [winLong]
   * @return {void}
   */
  const _w_min = function(winLong) {
    (useSDL3 ? SDLVideo : SDL).SDL_MinimizeWindow(tryVal(winLong, Core.app.window));
  }
  .setAnno("windows-only");
  exports._w_min = _w_min;


  /**
   * Maximizes a window.
   * @param {number|unset} [winLong]
   * @return {void}
   */
  const _w_max = function(winLong) {
    (useSDL3 ? SDLVideo : SDL).SDL_MaximizeWindow(tryVal(winLong, Core.app.window));
  }
  .setAnno("windows-only");
  exports._w_max = _w_max;


  /**
   * Restores a window.
   * @param {number|unset} [winLong]
   * @return {void}
   */
  const _w_restore = function(winLong) {
    (useSDL3 ? SDLVideo : SDL).SDL_RestoreWindow(tryVal(winLong, Core.app.window));
  }
  .setAnno("windows-only");
  exports._w_restore = _w_restore;


  /**
   * Sets title of a window.
   * @param {number|unset} [winLong]
   * @param {string|unset} [title]
   * @return {void}
   */
  const setWinTitle = function(winLong, title) {
    (useSDL3 ? SDLVideo : SDL).SDL_SetWindowTitle(tryVal(winLong, Core.app.window), tryVal(title, Vars.appName));
  }
  .setAnno("windows-only");
  exports.setWinTitle = setWinTitle;


  /**
   * Creates a message window.
   * @param {string|unset} [mode]
   * @param {string|unset} [title]
   * @param {string|unset} [str]
   * @return {void}
   */
  const showMessage = function thisFun(mode, title, str) {
    if(mode == null) mode = "info";
    if(!mode.equalsAny(thisFun.modes)) return;

    (useSDL3 ? SDLVideo : SDL).SDL_ShowSimpleMessageBox(
      mode === "info" ?
        0x00000040 :
        mode === "warn" ?
          0x00000020 :
          0x00000010,
      tryVal(title, ""),
      tryVal(str, ""),
    );
  }
  .setProp({
    modes: ["info", "warn", "err"],
  })
  .setAnno("windows-only");
  exports.showMessage = showMessage;
