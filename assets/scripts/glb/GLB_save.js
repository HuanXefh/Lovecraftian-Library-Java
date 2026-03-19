/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Lovec creates .lsav files for each save in "Mindustry/saves/mods/data/Lovec/saves".
   * Similarly, .plsav files are created for saves of the same planet (in campaign).
   * LSAV fields are registered in {@link DB_misc}.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  let
    lsav = {},
    lsavJsonVal = null,
    plsav = {},
    plsavJsonVal = null;


  function initLsav(mode) {
    if(mode == null) mode = "both";

    if(mode.equalsAny("both", "lsav")) {
      DB_misc.db["lsav"]["header"].forEachRow(3, (header, def, arrMode) => {
        lsav[header] = def;
      });
    };
    if(mode.equalsAny("both", "plsav")) {
      DB_misc.db["lsav"]["pHeader"].forEachRow(3, (header, def, arrMode) => {
        plsav[header] = def;
      });
    };

    exports.lsav = lsav;
    exports.plsav = plsav;
  };


  function loadLsav() {
    Time.run(6.0, () => {
      if(Vars.state.isEditor()) return;
      if(Vars.net.client()) {
        requestSync();
        return;
      };
      try {
        lsavJsonVal = MDL_json.parse(MDL_file._lsav());
        plsavJsonVal = MDL_json.parse(MDL_file._plsav());
      } catch(err) {
        Log.err("[LOVEC] Failed to load LSAV!" + "\n" + err);
        lsavJsonVal = null;
        plsavJsonVal = null;
      };
      if(lsavJsonVal == null || plsavJsonVal == null) return;

      DB_misc.db["lsav"]["header"].forEachRow(3, (header, def, arrMode) => {
        lsav[header] = tryVal(MDL_json.fetch(lsavJsonVal, header, false, arrMode), def);
      });
      DB_misc.db["lsav"]["pHeader"].forEachRow(3, (header, def, arrMode) => {
        plsav[header] = tryVal(MDL_json.fetch(plsavJsonVal, header, false, arrMode), def);
      });

      let mapCur = global.lovecUtil.fun._mapCur();

      // If map name not matched, clear the LSAV (creates a backup first)
      if(lsav["save-map"] !== "!UNDEF" && lsav["save-map"] !== mapCur) {
        MDL_json.write(MDL_file._lsav(true), lsav);
        initLsav("lsav");
      };
      // If outside of campaign, check map name for PLASV too
      if(!Vars.state.isCampaign() && !global.lovecUtil.prop.debug && plsav["save-map"] !== "!UNDEF" && plsav["save-map"] !== mapCur) {
        MDL_json.write(MDL_file._plsav(true), plsav);
        initLsav("plsav");
      };

      set("save-map", mapCur);
      set("save-map", mapCur, true);
      set("save-revision", LOVEC_REVISION);

      TRIGGER.lsavLoad.fire();
    });
  };


  /**
   * Saves LSAV data.
   * @return {void}
   */
  const saveLsav = function() {
    if(Vars.state.isEditor()) return;

    MDL_json.write(MDL_file._lsav(), lsav);
    MDL_json.write(MDL_file._plsav(), plsav);
  }
  .setAnno("server")
  .setAnno("non-console");
  exports.saveLsav = saveLsav;


  /**
   * Overwrites local LSAV object with `obj`.
   * @param {Object} obj
   * @return {void}
   */
  const __lsav = function(obj) {
    lsav = obj;
  }
  .setAnno("non-console");
  exports.__lsav = __lsav;


  /**
   * Overwrites local PLSAV object with `obj`.
   * @param {Object} obj
   * @return {void}
   */
  const __plsav = function(obj) {
    plsav = obj;
  }
  .setAnno("non-console");
  exports.__plsav = __plsav;


  /**
   * Sets a value in LSAV.
   * @param {string} header
   * @param {any} val
   * @param {boolean|unset} [isPSet] - If true, this method will set a value in PLSAV instead.
   * @param {boolean|unset} [suppressWarning]
   * @return {void}
   */
  const set = function(header, val, isPSet, suppressWarning) {
    let obj = isPSet ? plsav : lsav;
    let cond = false;
    if(suppressWarning) {
      cond = true;
    } else {
      if(val === undefined) {
        Log.warn("[LOVEC] Passing " + "undefined".color(Pal.remove) + " as LSAV value to " + header.color(Pal.accent) + "!");
      } else if(obj[header] === undefined) {
        Log.warn("[LOVEC] The LSAV field " + header.color(Pal.accent) + " is " + "undefined".color(Pal.remove) + "!");
      } else if(typeof val !== typeof obj[header]) {
        Log.warn("[LOVEC] LSAV value for ${1} changed to a different type!".format(header.color(Pal.accent)));
      } else {
        cond = true;
      };
    };

    if(cond) {
      obj[header] = val;
      sync();
    };
  }
  .setAnno("server");
  exports.set = set;


  /**
   * Sets a LSAV value only if it's marked as safe.
   * @param {string} header
   * @param {any} val
   * @param {boolean|unset} [isPSet] - If true, this method will set a value in PLSAV instead.
   * @return {void}
   */
  const setSafe = function(header, val, isPSet) {
    if(!DB_misc.db["lsav"][isPSet ? "pSafe" : "safe"].includes(header)) return;

    set(header, val, isPSet, false);
  }
  .setAnno("server");
  exports.setSafe = setSafe;


  /**
   * Gets a value in local LSAV.
   * @param {string} header
   * @param {boolean|unset} [isPGet] - If true, this method will get a value from PLSAV instead.
   * @return {any}
   */
  const get = function(header, isPGet) {
    return (isPGet ? plsav : lsav)[header];
  };
  exports.get = get;


  /**
   * Called on server side, synchronizes LSAV on all client sides.
   * @return {void}
   */
  const sync = function() {
    MDL_net.sendPacket(
      "server", "lovec-server-lsav-sync",
      JSON.stringify(lsav),
      true,
    );
    MDL_net.sendPacket(
      "server", "lovec-server-plsav-sync",
      JSON.stringify(plsav),
      true,
    );
  }
  .setAnno("init", function() {
    MDL_net.__packetHandler("client", "lovec-server-lsav-sync", payload => {
      __lsav(JSON.parse(payload));
    });
    MDL_net.__packetHandler("client", "lovec-server-plsav-sync", payload => {
      __plsav(JSON.parse(payload));
    });
  })
  .setAnno("server");
  exports.sync = sync;


  /**
   * Requests the server to send sync packets.
   * @return {void}
   */
  const requestSync = function() {
    MDL_net.sendPacket(
      "client", "lovec-client-lsav-sync-request",
      "",
      true, true,
    );
  }
  .setAnno("init", function() {
    MDL_net.__packetHandler("server", "lovec-client-lsav-sync-request", payload => {
      sync();
    });
  })
  .setAnno("client")
  .setAnno("non-console");
  exports.requestSync = requestSync;


  /**
   * Requests the server to set an LSAV value.
   * Only safe properties are allowed.
   * @param {string} header
   * @param {any} val
   * @param {boolean|unset} [isPSet] - If true, this method will set a value in PLSAV instead.
   * @return {void}
   */
  const requestSet = function(header, val, isPSet) {
    MDL_net.sendPacket(
      "client", "lovec-client-lsav-set-request",
      packPayload([
        header, val, isPSet,
      ]),
      true, true,
    );
  }
  .setAnno("init", function() {
    MDL_net.__packetHandler("server", "lovec-client-lsav-set-request", payload => {
      setSafe.apply(this, unpackPayload(payload));
    });
  })
  .setAnno("client")
  .setAnno("non-console");
  exports.requestSet = requestSet;


/*
  ========================================
  Section: Application
  ========================================
*/


  initLsav();


  MDL_event._c_onWorldLoad(() => {

    loadLsav();

  }, 75122009);


  MDL_event._c_onWorldSave(() => {

    saveLsav();

  }, 45111187);
