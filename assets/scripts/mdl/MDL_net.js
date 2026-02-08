/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods related to network.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- packet ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a new packet handler.
   * ---------------------------------------- */
  const __packetHandler = function thisFun(mode, header, payloadCaller) {
    if(header == null) return;
    if(thisFun.headers.includes(header)) ERROR_HANDLER.throw("headerConflict", header);
    if(mode == null) mode = "client";
    if(!mode.equalsAny(thisFun.modes)) return;
    if(payloadCaller == null) payloadCaller = Function.air;

    if(mode === "client" || mode === "both") Vars.netClient.addPacketHandler(header, payloadCaller);
    if(mode === "server" || mode === "both") Vars.netServer.addPacketHandler(header, payloadCaller);

    thisFun.headers.push(header);
  }
  .setProp({
    modes: ["client", "server", "both"],
    headers: [],
  });
  exports.__packetHandler = __packetHandler;


  /* ----------------------------------------
   * NOTE:
   *
   * Sends out a packet.
   * ---------------------------------------- */
  const sendPacket = function thisFun(mode, header, payload, isReliable, useConnection) {
    if(!global.lovec.param.modded || header == null || payload == null) return;
    if(mode == null) mode = "server";
    if(!mode.equalsAny(thisFun.modes)) return;

    if(mode === "server" || (mode === "both" && !Vars.net.client())) {
      isReliable ?
        Call.serverPacketReliable(header, payload) :
        Call.serverPacketUnreliable(header, payload);
    } else if(mode === "client" || mode === "both" && Vars.net.client()) {
      isReliable ?
        (useConnection ? Call.clientPacketReliable(Vars.player.con, header, payload) : Call.clientPacketReliable(header, payload)) :
        (useConnection ? Call.clientPacketUnreliable(Vars.player.con, header, payload) : Call.clientPacketUnreliable(header, payload));
    };
  }
  .setProp({
    modes: ["client", "server", "both"],
  });
  exports.sendPacket = sendPacket;


  /* <---------- http ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Fetches the latest version (tag) of a repository on GitHub.
   * If errored, the value will be {undefined}.
   * ---------------------------------------- */
  const fetchLatestVer = function(owner, repo, valCaller) {
    let val;
    Http.get("https://api.github.com/repos/" + owner + "/" + repo + "/releases/latest")
    .header("X-GitHub-Api-Version", "2022-11-28")
    .error(err => valCaller(val))
    .submit((res, exc) => {
      if(exc == null) val = parseResponse(res).tag_name;
      valCaller(val);
    });
  };
  exports.fetchLatestVer = fetchLatestVer;
