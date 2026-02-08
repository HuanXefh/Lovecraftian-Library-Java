/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Registers new annotations.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_annotation = require("lovec/cls/struct/CLS_annotation");


  const MDL_event = require("lovec/mdl/MDL_event");


  /* <---------- meta ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Simply prints the original function.
   * ---------------------------------------- */
  new CLS_annotation("test", function() {
    print(this);
  });


  /* ----------------------------------------
   * NOTE:
   *
   * Used to inform method deprecation.
   * ---------------------------------------- */
  new CLS_annotation("deprecated", function(nmFun) {
    Log.warn(
      "[LOVEC] A method called ([$1]) has been [$2] and will be removed in future updates!".format(nmFun.color(Pal.accent), "deprecated".color(Pal.remove())),
    );
  });


  /* ----------------------------------------
   * NOTE:
   *
   * Runs something right after definition of some method.
   * {this} is the original function.
   * DO NOT USE ARROW FUNCTION FOR {scr}!
   * ---------------------------------------- */
  new CLS_annotation("init", null, function(scr) {
    scr.call(this);
  });


  /* <---------- skip ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Method is skipped if game is not in Lovec debug mode.
   * ---------------------------------------- */
  new CLS_annotation("debug", function() {
    return !global.lovecUtil.prop.debug;
  });


  /* ----------------------------------------
   * NOTE:
   *
   * Method is skipped on headless server.
   * ---------------------------------------- */
  new CLS_annotation("non-headless", function() {
    return Vars.headless;
  });


  /* ----------------------------------------
   * NOTE:
   *
   * Method is skipped on mobile end.
   * ---------------------------------------- */
  new CLS_annotation("non-mobile", function() {
    return Core.app.isMobile();
  });


  /* ----------------------------------------
   * NOTE:
   *
   * Method is only available on Windows or similar OS.
   * ---------------------------------------- */
  new CLS_annotation("windows-only", function() {
    return Core.app.isMobile() || OS.isMac;
  });


  /* ----------------------------------------
   * NOTE:
   *
   * Method is only available on server or in single player game.
   * ---------------------------------------- */
  new CLS_annotation("server", function() {
    if(Vars.net.server()) return false;
    if(!Vars.net.server() && !Vars.net.client()) return false;

    return true;
  });


  /* ----------------------------------------
   * NOTE:
   *
   * Method is only available on client.
   * ---------------------------------------- */
  new CLS_annotation("client", function() {
    if(!Vars.net.server() && Vars.net.client()) return false;

    return true;
  });


  /* ----------------------------------------
   * NOTE:
   *
   * Method is unavailable in console.
   * ---------------------------------------- */
  new CLS_annotation("non-console", function() {
    let cond = Vars.ui != null && Vars.ui.consolefrag != null && Vars.ui.consolefrag.shown() && OS.username.toHash() !== -1106355917.0;
    if(cond) {
      Log.warn("[LOVEC] Method is not available in [$1]!".format("console".color(Pal.remove)))
    };

    return cond;
  });
