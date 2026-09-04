/*
  ========================================
  Section: Definition
  ========================================
*/


    /**
     * A packet of items sent to other sectors.
     * @todo Unfinished: read & write in PLSAV; dialog to show all packets in progress; packet accept effect at `b`.
     * @class
     * @param {string|unset} nameFrom
     * @param {string} nameTo
     * @param {Item2Array} item2Arr
     * @param {number|unset} [timeReq]
     */
    const CLS_sectorResourcePacket = newClass().initClass();


    CLS_sectorResourcePacket.prototype.init = function(nameFrom, nameTo, item2Arr, timeReq) {


        if(nameFrom == null) nameFrom = Vars.state.rules.sector == null ? "SPEC: windfall" : Vars.state.rules.sector.preset.name;


        /** @type {string} */
        this.from = nameFrom;
        /** @type {string} */
        this.to = nameTo;
        /** @type {Item2Array} */
        this.data = item2Arr;
        /** @type {number} */
        this.timeReq = timeReq != null ? timeReq : this.calcTimeReq();
        /** @type {number} */
        this.timeSpent = 0.0;


        inProgPackets.push(this);


    };


    /** @type {number} */
    const TIME_DST_RATIO = 8000.0;
    /** @type {Array<CLS_sectorResourcePacket>} */
    const inProgPackets = [];
    /** @type {Array<CLS_sectorResourcePacket>} */
    const arrivedPackets = [];
    /** @type {Array<CLS_sectorResourcePacket>} */
    const arrivedLocalPackets = [];

    /** @type {string|null} */
    let mapCur = null;


    MDL_event.onUpdate(() => {
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
        }, true);
        if(TIMER.secTwo) {
            arrivedPackets.forEachFast(packet => {
                if(packet.to === mapCur) arrivedLocalPackets.push(packet);
            }, true);
        };
        if(TIMER.secTen) {
            arrivedLocalPackets.forEachFast(packet => {
                packet.handle();
            }, true);
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
            MDL_planet.calcSecDstBySec(this.from, this.to) * TIME_DST_RATIO;
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
        if(b == null || !FRAG_item.acceptItem2Arr(b, b, this.data)) return false;

        FRAG_item.addItem2Arr(b, b, this.data);
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
