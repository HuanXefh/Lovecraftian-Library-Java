/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Lovec creates .lsav files for each save in "Mindustry/saves/mods/data/Lovec/saves".
   * Fields are registered in {@link DB_misc}.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  let lsavJsonVal = null;
  let lsav = {};


  function initLsav() {
    DB_misc.db["lsav"]["header"].forEachRow(3, (header, def, arrMode) => {
      lsav[header] = def;
    });
    exports.lsav = lsav;
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
      } catch(err) {
        Log.err("[LOVEC] Failed to load LSAV!" + "\n" + err);
        lsavJsonVal = null;
      };
      if(lsavJsonVal == null) return;

      DB_misc.db["lsav"]["header"].forEachRow(3, (header, def, arrMode) => {
        lsav[header] = tryVal(MDL_json.fetch(lsavJsonVal, header, false, arrMode), def);
      });

      if(lsav["save-map"] !== "!UNDEF" && lsav["save-map"] !== global.lovecUtil.fun._mapCur()) {
        // If map name not matched, clear the LSAV (creates a backup first)
        MDL_json.write(MDL_file._lsav(true), lsav);
        initLsav();
      };

      set("save-map", global.lovecUtil.fun._mapCur());
    });
  };


  /**
   * Saves LSAV data.
   * @return {void}
   */
  const saveLsav = function() {
    if(Vars.state.isEditor()) return;

    MDL_json.write(MDL_file._lsav(), lsav);
  }
  .setAnno("server")
  .setAnno("non-console");
  exports.saveLsav = saveLsav;


  /**
   * Gets local LSAV object, only used for debugging.
   * @return {Object}
   */
  const _lsav = function() {
    return lsav;
  }
  .setAnno("debug");
  exports._lsav = _lsav;


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
   * Sets a value in LSAV.
   * @param {string} header
   * @param {any} val
   * @param {boolean|unset} [suppressWarning]
   * @return {void}
   */
  const set = function(header, val, suppressWarning) {
    if(header == null) return;

    let cond = false;
    if(suppressWarning) {
      cond = true;
    } else {
      if(val === undefined) {
        Log.warn("[LOVEC] Passing " + "undefined".color(Pal.remove) + " as LSAV value to " + header.color(Pal.accent) + "!");
      } else if(lsav[header] === undefined) {
        Log.warn("[LOVEC] The LSAV field " + header.color(Pal.accent) + " is " + "undefined".color(Pal.remove) + "!");
      } else if(typeof val !== typeof lsav[header]) {
        Log.warn("[LOVEC] LSAV value for [$1] changed to a different type!".format(header.color(Pal.accent)));
      } else {
        cond = true;
      };
    };

    if(cond) {
      lsav[header] = val;
      sync();
    };
  }
  .setAnno("server");
  exports.set = set;


  /**
   * Sets a LSAV value only if it's marked as safe.
   * @param {string} header
   * @param {any} val
   * @return {void}
   */
  const setSafe = function(header, val) {
    if(header == null) return;

    if(!DB_misc.db["lsav"]["safe"].includes(header)) return;

    set(header, val, false);
  }
  .setAnno("server");
  exports.setSafe = setSafe;


  /**
   * Gets a value in local LSAV.
   * @param {string} header
   * @return {any}
   */
  const get = function(header) {
    return lsav[header];
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
  }
  .setAnno("init", function() {
    MDL_net.__packetHandler("client", "lovec-server-lsav-sync", payload => {
      __lsav(JSON.parse(payload));
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
   * @return {void}
   */
  const requestSet = function(header, val) {
    MDL_net.sendPacket(
      "client", "lovec-client-lsav-set-request",
      packPayload([
        header, val,
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
