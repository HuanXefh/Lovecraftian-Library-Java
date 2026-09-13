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




    /**
     * @global
     */
    const LogModes = new CLS_enum({
        /** @type {ENumber} */
        INFO: 0,
        /** @type {ENumber} */
        I: 0,
        /** @type {ENumber} */
        WARN: 1,
        /** @type {ENumber} */
        W: 1,
        /** @type {ENumber} */
        ERROR: 2,
        /** @type {ENumber} */
        ERR: 2,
        /** @type {ENumber} */
        E: 2,
        /** @type {ENumber} */
        DEBUG: 3,
        /** @type {ENumber} */
        D: 3,
    });
    globalize(LogModes, "LogModes");


    /**
     * @global
     */
    const MethodMixModes = new CLS_enum({
        /** @type {ENumber} */
        NORMAL: 0,
        /** @type {ENumber} */
        BUILD: 1,
    });
    globalize(MethodMixModes, "MethodMixModes");




    require("lovec/run/jsExt/RUN_jsPostExt_function");
    require("lovec/run/jsExt/RUN_jsPostExt_class");
    require("lovec/run/jsExt/RUN_jsPostExt_math");
