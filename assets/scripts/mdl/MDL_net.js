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


  /* <---------- packet ----------> */


  const PacketModes = new CLS_enum({
    BOTH: 0,
    CLIENT: -1,
    SERVER: 1,
  });
  exports.PacketModes = PacketModes;


  /**
   * Registers a new packet handler.
   * @param {number|unset} mode
   * @param {string} header
   * @param {function(string): void} payloadCaller
   * @return {void};
   */
  const __packetHandler = function thisFun(mode, header, payloadCaller) {
    if(thisFun.headers.includes(header)) ERROR_HANDLER.throw("headerConflict", header);
    if(mode == null) mode = PacketModes.CLIENT;
    if(!PacketModes.has(mode)) return;
    if(payloadCaller == null) payloadCaller = Function.air;

    if(mode === PacketModes.CLIENT || mode === PacketModes.BOTH) Vars.netClient.addPacketHandler(header, payloadCaller);
    if(mode === PacketModes.SERVER || mode === PacketModes.BOTH) Vars.netServer.addPacketHandler(header, payloadCaller);

    thisFun.headers.push(header);
  }
  .setProp({
    headers: [],
  });
  exports.__packetHandler = __packetHandler;


  /**
   * Sends out a packet.
   * @param {number|unset} mode
   * @param {string} header
   * @param {string|unset} [payload]
   * @param {boolean|unset} [isReliable]
   * @param {boolean|unset} [useConnection]
   * @return {void}
   */
  const sendPacket = function (mode, header, payload, isReliable, useConnection) {
    if(!PARAM.MODDED || payload == null) return;
    if(mode == null) mode = PacketModes.SERVER;
    if(!PacketModes.has(mode)) return;

    if(mode === PacketModes.SERVER || (mode === PacketModes.BOTH && !Vars.net.client())) {
      isReliable ?
        Call.serverPacketReliable(header, payload) :
        Call.serverPacketUnreliable(header, payload);
    } else if(mode === PacketModes.CLIENT || (mode === PacketModes.BOTH && Vars.net.client())) {
      isReliable ?
        (useConnection ? Call.clientPacketReliable(Vars.player.con, header, payload) : Call.clientPacketReliable(header, payload)) :
        (useConnection ? Call.clientPacketUnreliable(Vars.player.con, header, payload) : Call.clientPacketUnreliable(header, payload));
    };
  };
  exports.sendPacket = sendPacket;


  /* <---------- http ----------> */


  /**
   * Gets latest version (tag) of a repository on GitHub.
   * If errored the result will be null.
   * @param {string} owner
   * @param {string} repo
   * @param {function(any): void} callback
   * @return {void}
   */
  const fetchLatestVer = function(owner, repo, callback) {
    let val = null;
    Http.get("https://api.github.com/repos/" + owner + "/" + repo + "/releases/latest")
    .header("X-GitHub-Api-Version", "2022-11-28")
    .error(err => callback(val))
    .submit((res, exc) => {
      if(exc == null) val = parseResponse(res).tag_name;
      callback(val);
    });
  };
  exports.fetchLatestVer = fetchLatestVer;
