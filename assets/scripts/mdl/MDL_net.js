/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods related to network.
   * @module lovec/mdl/MDL_net
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ packet ------------------------------ */


  /** @global */
  const PacketModes = new CLS_enum({
    BOTH: 0,
    CLIENT: 1,
    SERVER: 2,
  })
  .globalize("PacketModes");


  /**
   * Registers a new packet handler.
   * @param {number|unset} mode
   * @param {string} header
   * @param {function(string, Player|unset): void} payloadC
   * @param {boolean|unset} [addOnce] - If true, header conflict error will be suppressed. Used when explicitly called multiple times like in `init`.
   * @return {void};
   */
  const addPacketHandler = function thisFun(mode, header, payloadC, addOnce) {
    if(thisFun.headers.includes(header)) {
      if(addOnce) return;
      ERROR_HANDLER.throw("headerConflict", header);
    };
    if(mode == null) mode = PacketModes.CLIENT;
    if(!PacketModes.has(mode)) return;
    if(payloadC == null) payloadC = Function.air;

    if(mode === PacketModes.CLIENT || mode === PacketModes.BOTH) Vars.netClient.addPacketHandler(header, payloadC);
    if(mode === PacketModes.SERVER || mode === PacketModes.BOTH) Vars.netServer.addPacketHandler(header, (player, payload) => payloadC(payload, player));

    thisFun.headers.push(header);
  }
  .setProp({
    headers: [],
  });
  exports.addPacketHandler = addPacketHandler;


  /**
   * Sends out a packet.
   * @param {number|unset} mode
   * @param {string} header
   * @param {string|unset} [payload]
   * @param {boolean|unset} [isReliable]
   * @return {void}
   */
  const sendPacket = function (mode, header, payload, isReliable, useConnection) {
    if(!PARAM.MODDED || payload == null) return;
    if(mode == null) mode = PacketModes.SERVER;
    if(!PacketModes.has(mode)) return;

    if(mode === PacketModes.SERVER) {
      isReliable ?
        Call.serverPacketReliable(header, payload) :
        Call.serverPacketUnreliable(header, payload);
      if(DEBUG.shouldLogServerPacket) {
        console.log("[LOVEC] Sent server packet ${1}.".format(header.color(Pal.accent)));
      };
    } else if(mode === PacketModes.CLIENT) {
      isReliable ?
        Call.clientPacketReliable(header, payload) :
        Call.clientPacketUnreliable(header, payload);
      if(DEBUG.shouldLogClientPacket) {
        console.log("[LOVEC] Sent client packet ${2}.".format(header.color(Pal.accent)));
      };
    } else if(mode === PacketModes.BOTH) {
      sendPacket(Vars.net.client() ? PacketModes.SERVER : PacketModes.CLIENT, header, payload, isReliable, useConnection);
      Vars.net.client() ?
        Reflect.get(Vars.netClient, "customPacketHandlers").get(header).each(packetCons => packetCons.get(payload)) :
        Reflect.get(Vars.netServer, "customPacketHandlers").get(header).each(packetCons => packetCons.get(Vars.player, payload));
    };
  };
  exports.sendPacket = sendPacket;


  /* <------------------------------ HTTP ------------------------------ */


  /**
   * Performs an HTTP GET request, stores the response in a cache file.
   * <br> `ARGS`: path, url, callback, errCallback, header1, header2, header3, ...
   * @param {string} path - Relative path to common cache directory.
   * @param {string} url
   * @param {(function(Fi): void)|unset} [callback]
   * @param {(function(Error): void)|unset} [errCallback]
   * @return {void}
   */
  const fetchCache = function(path, url, callback, errCallback) {
    DEBUG.lastHttpUrl = url;
    let req = Http.get(url);
    if(arguments.length > 4) {
      req.header.apply(req, Array.from(arguments).splice(4));
    };
    req.error(err => {
      if(errCallback != null) {
        errCallback(err);
        return;
      };
      console.err("[LOVEC] Failed to fetch cache:\n" + err);
    });
    req.submit((res, exc) => {
      DEBUG.lastHttpRes = res;
      DEBUG.lastHttpExc = exc;
      if(exc != null) {
        if(errCallback != null) {
          errCallback(exc);
          return;
        };
        console.err("[LOVEC] Failed to fetch cache:\n" + err);
        return;
      };
      let fi = writeResponse(res, MDL_file.parsePath(MDL_file.commonCache, path, true), false);
      if(callback != null) {
        callback(fi);
      };
    });
  };
  exports.fetchCache = fetchCache;


  /**
   * Gets latest version (tag) of a repository on GitHub.
   * If errored the result will be null.
   * @param {string} owner
   * @param {string} repo
   * @param {function(string|unset): void} callback
   * @return {void}
   */
  const fetchLatestVer = function(owner, repo, callback) {
    fetchCache(
      "temp/lastVerFetch.log",
      "https://api.github.com/repos/" + owner + "/" + repo + "/releases/latest",
      fi => {
        callback(parseResponse(fi).tag_name);
      },
      err => callback(null),
    );
  };
  exports.fetchLatestVer = fetchLatestVer;
