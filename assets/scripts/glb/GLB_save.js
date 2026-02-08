/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Lovec will create .lsav files for each save, in "Mindustry/saves/mods/data/lovec/saves".
   * To register a new field, check {DB_misc.db["lsav"]["header"]}.
   * You can use {set} method defined here to change a value, and it will be saved finally.
   * ----------------------------------------
   * IMPORTANT:
   *
   * LSAV is only saved on server side, don't use it directly on client side.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_file = require("lovec/mdl/MDL_file");
  const MDL_json = require("lovec/mdl/MDL_json");
  const MDL_net = require("lovec/mdl/MDL_net");


  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- base ----------> */


  let lsavJsonVal = null;
  let lsav = {};
  let saveRevision = 0;


  /* ----------------------------------------
   * NOTE:
   *
   * Sets up the LSAV with default values.
   * ---------------------------------------- */
  function initLsav() {
    DB_misc.db["lsav"]["header"].forEachRow(3, (header, def, arrMode) => {
      lsav[header] = def;
    });
    exports.lsav = lsav;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Loads the LSAV object, delayed so world is completely loaded then.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Writes the LSAV object to local file.
   * ---------------------------------------- */
  const saveLsav = function() {
    if(Vars.state.isEditor()) return;

    MDL_json.write(MDL_file._lsav(), lsav);
  }
  .setAnno("server");


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the local LSAV object, only used for testing.
   * ---------------------------------------- */
  const _lsav = function() {
    return lsav;
  }
  .setAnno("debug");
  exports._lsav = _lsav;


  /* ----------------------------------------
  * NOTE:
  *
  * Overwrites the LSAV object with {obj}.
  * ---------------------------------------- */
  const __lsav = function(obj) {
    lsav = obj;
  }
  .setAnno("non-console");
  exports.__lsav = __lsav;


  /* ----------------------------------------
   * NOTE:
   *
   * Sets a value in LSAV.
   * ---------------------------------------- */
  const set = function(header, val, suppressWarning) {
    if(header == null) return;

    var cond = false;
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


  /* ----------------------------------------
   * NOTE:
   *
   * Sets a LSAV value only if it's marked as safe.
   * ---------------------------------------- */
  const setSafe = function(header, val) {
    if(header == null) return;

    if(!DB_misc.db["lsav"]["safe"].includes(header)) return;

    set(header, val, false);
  }
  .setAnno("server");
  exports.setSafe = setSafe;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a value in local LSAV.
   * ---------------------------------------- */
  const get = function(header) {
    return lsav[header];
  };
  exports.get = get;


  /* ----------------------------------------
   * NOTE:
   *
   * Called on server side, synchronizes LSAV on all client sides.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Requests the server to send sync packets.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Requests the server to set an LSAV value.
   * Only safe properties are allowed.
   * ---------------------------------------- */
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
