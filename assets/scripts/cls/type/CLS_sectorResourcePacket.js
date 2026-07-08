/*
  ========================================
  Section: Definition
  ========================================
*/


  /**
   * A packet of items sent to other sectors.
   * @todo Unfinished: read & write in PLSAV; dialog to show all packets in progress; pacekt accept effect at `b`.
   * @class
   * @param {string|unset} nameFrom
   * @param {string|unset} nameTo
   * @param {Array} itmAmtArr - <ROW>: itm_gn, amt.
   * @param {number|unset} [timeReq]
   */
  const CLS_sectorResourcePacket = newClass().initClass();


  CLS_sectorResourcePacket.prototype.init = function(nameFrom, nameTo, itmAmtArr, timeReq) {
    if(nameFrom == null) nameFrom = Vars.state.rules.sector == null ? "SPEC: windfall" : Vars.state.rules.sector.preset.name;
    if(nameTo == null) nameTo;

    this.from = nameFrom;
    this.to = nameTo;
    this.data = itmAmtArr;
    this.timeReq = timeReq != null ? timeReq : this.calcTimeReq();

    this.timeSpent = 0.0;

    inProgPackets.push(this);
  };


  const TIME_DST_RATIO = 8000.0;
  const inProgPackets = [];
  const arrivedPackets = [];
  const arrivedLocalPackets = [];


  let mapCur = null;


  MDL_event._c_onUpdate(() => {
    if(Vars.state.isPaused() || (global.lovecUtil.prop.debug ? !Vars.state.isGame() : !Vars.state.isCampaign())) return;

    CLS_sectorResourcePacket.update();
  });


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


  /**
   * Updates states of all packets.
   * @return {void}
   */
  CLS_sectorResourcePacket.update = function() {
    mapCur = global.lovecUtil.fun._mapCur();
    inProgPackets.forEachFast(packet => {
      packet.update();
    });
    if(TIMER.secTwo) {
      arrivedPackets.forEachFast(packet => {
        if(packet.to === mapCur) arrivedLocalPackets.push(packet);
      });
    };
    if(TIMER.secTen) {
      let b = Vars.player.team().core();
      arrivedLocalPackets.forEachFast(packet => {
        packet.handle();
      });
    };
  };


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/


  /**
   * Whether is packet has arrived.
   * @return {boolean}
   */
  CLS_sectorResourcePacket.prototype.isCompleted = function() {
    return this.timeSpent > this.timeReq - 0.0001;
  };


  /**
   * Gets time required to send this packet.
   * @return {number}
   */
  CLS_sectorResourcePacket.prototype.calcTimeReq = function() {
    return this.from === "SPEC: windfall" ?
      1800.0 :
      MDL_planet._dstSecBySec(this.from, this.to) * TIME_DST_RATIO;
  };


  /**
   * Removes this packet.
   * @return {void}
   */
  CLS_sectorResourcePacket.prototype.remove = function() {
    inProgPackets.remove(this);
    arrivedPackets.remove(this);
    arrivedLocalPackets.remove(this);
  };


  /**
   * Adds items in this packet to core if allowed.
   * @return {boolean}
   */
  CLS_sectorResourcePacket.prototype.handle = function() {
    if(this.to !== mapCur || !this.isCompleted()) return false;
    let b = Vars.player.team().core();
    if(b == null || !FRAG_item.acceptItmAmtArr(b, b, this.data)) return false;

    FRAG_item.addItmAmtArr(b, b, this.data);
    Core.app.post(() => {
      this.remove();
    });

    return true;
  };


  /**
   * Updates state of this packet.
   * @return {void}
   */
  CLS_sectorResourcePacket.prototype.update = function() {
    this.timeSpent = Math.min(this.timeSpent + Time.delta, this.timeReq);
    if(this.isCompleted()) {
      if(!this.handle()) {
        inProgPackets.remove(this);
        arrivedPackets.push(this);
        if(this.to === mapCur) {
          arrivedLocalPackets.push(this);
        };
      };
    };
  };




module.exports = CLS_sectorResourcePacket;
