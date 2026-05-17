/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Another part of extension called later than {@link RUN_methodExt}.
   */


/*
  ========================================
  Section: Application
  ========================================
*/


  /** @global */
  const LogModes = new CLS_enum({
    INFO: 0,
    I: 0,
    WARN: 1,
    W: 1,
    ERROR: 2,
    ERR: 2,
    E: 2,
    DEBUG: 3,
    D: 3,
  })
  .globalize("LogModes");


  require("lovec/run/jsExt/RUN_jsPostExt_function");
  require("lovec/run/jsExt/RUN_jsPostExt_class");
  require("lovec/run/jsExt/RUN_jsPostExt_math");
