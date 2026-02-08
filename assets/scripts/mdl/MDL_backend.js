/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Some backend methods, do not try this util you know how it works.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets/sets clipboard text.
   * ---------------------------------------- */
  const accClipboard = function(param) {
    if(param === "read") {
      return Core.app.getClipboardText();
    } else {
      let str = String(param);
      Core.app.setClipboardText(str);

      return str;
    };
  };
  exports.accClipboard = accClipboard;


  /* <---------- window ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Minimizes a window.
   * ---------------------------------------- */
  const _w_min = function(winLong) {
    SDLVideo.SDL_MinimizeWindow(tryVal(winLong, Core.app.window));
  }
  .setAnno("windows-only");
  exports._w_min = _w_min;


  /* ----------------------------------------
   * NOTE:
   *
   * Maximizes a window.
   * ---------------------------------------- */
  const _w_max = function(winLong) {
    SDLVideo.SDL_MaximizeWindow(tryVal(winLong, Core.app.window));
  }
  .setAnno("windows-only");
  exports._w_max = _w_max;


  /* ----------------------------------------
   * NOTE:
   *
   * Restores a window.
   * ---------------------------------------- */
  const _w_restor = function(winLong) {
    SDLVideo.SDL_RestoreWindow(tryVal(winLong, Core.app.window));
  }
  .setAnno("windows-only");
  exports._w_restor = _w_restor;


  /* ----------------------------------------
   * NOTE:
   *
   * Sets the title of a window.
   * ---------------------------------------- */
  const setWinTitle = function(winLong, str) {
    SDLVideo.SDL_SetWindowTitle(tryVal(winLong, Core.app.window), tryVal(str, Vars.appName));
  }
  .setAnno("windows-only");
  exports.setWinTitle = setWinTitle;


  /* ----------------------------------------
   * NOTE:
   *
   * Simply creates a message window.
   * ---------------------------------------- */
  const showMessage = function thisFun(mode, title, str) {
    if(mode != null) mode = "info";
    if(!mode.equalsAny(thisFun.modes)) return;

    SDLVideo.SDL_ShowSimpleMessageBox(
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
