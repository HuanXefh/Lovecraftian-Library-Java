/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /**
     * A packet of items sent to other sectors.
     * @todo Unfinished: read & write in PLSAV; dialog to show all packets in progress; packet accept effect at `b`.
     * @class
     * @param {string|unset} nameFrom
     * @param {string} nameTo
     * @param {Item2Array} data
     * @param {number|unset} [timeReq]
     */
    const CLS_sectorResourcePacket = newClass().initClass();


    /** @private */
    CLS_sectorResourcePacket.prototype.init = function(nameFrom, nameTo, data, timeReq) {


        if(nameFrom == null) nameFrom = Vars.state.rules.sector == null ? "SPEC: windfall" : Vars.state.rules.sector.preset.name;


        /** @type {string} */
        this.from = nameFrom;
        /** @type {string} */
        this.to = nameTo;
        /** @type {Item2Array} */
        this.data = data;
        /** @type {number} */
        this.timeReq = timeReq != null ? timeReq : this.calcTimeReq();
        /** @type {number} */
        this.timeSpent = 0.0;

        /** @type {boolean} */
        this.handled = false;


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
    /** @type {String|null} */
    let mapCur = null;


    MDL_event.onUpdate(() => {
        if(Vars.state.isPaused() || (global.lovecUtil.prop.debug ? !Vars.state.isGame() : !Vars.state.isCampaign())) return;
        CLS_sectorResourcePacket.update();
    });
    BOX_trigger.lsavLoad.addGlobalListener(() => {
        CLS_sectorResourcePacket.readPlsav();
    });
    BOX_trigger.lsavSave.addGlobalListener(() => {
        CLS_sectorResourcePacket.writePlsav();
    });


/*
  ================================================================================
  Section: Definition (Static)
  ================================================================================
*/


    /**
     * Updates state of all packets.
     * @return {void}
     */
    CLS_sectorResourcePacket.update = function() {
        mapCur = global.lovecUtil.fun.getMapCur();
        inProgPackets.forEachFast(packet => {
            packet.update();
        }, true);
        if(GLB_timer.secTwo) {
            arrivedPackets.forEachFast(packet => {
                if(packet.to === mapCur) {
                    arrivedLocalPackets.push(packet);
                };
            }, true);
        };
        if(GLB_timer.secTen) {
            arrivedLocalPackets.forEachFast(packet => {
                packet.handle();
            }, true);
        };
    };


    /**
     * Gets localized name for a place.
     * @param {string} name
     * @return {string}
     */
    CLS_sectorResourcePacket.getLocalizedSecName = function(name) {
        if(name === "SPEC: windfall") return MDL_bundle.getTerm("lovec", "unknown");
        let sec = Vars.content.sector(name);
        return sec != null ?
            sec.localizedName :
            name;
    };


    /**
     * Displays all active packets.
     * <br> `AI`
     * @param {Table} tb
     * @return {void}
     */
    CLS_sectorResourcePacket.display = function(tb) {
        let listTb = new Table();
        listTb.top().left();

        let pnCell = MDL_table.pnFixed(tb, pnTb => {
            pnTb.top().left();
            pnTb.add(listTb).growX().top();
        }, {
            w: MDL_ui.getUiW(),
            minH: 80.0,
            growX: true,
        });
        let pn = pnCell.get();
        pn.setScrollingDisabled(true, false);
        pn.setFadeScrollBars(false);

        /** @type {Array<{packet: CLS_sectorResourcePacket, lab: Label}>} */
        let entries = [];
        /** @type {Array<CLS_sectorResourcePacket>} */
        let lastPackets = null;

        let collect = function() {
            let
                i,
                iCap,
                packets = [];

            i = 0;
            iCap = inProgPackets.iCap();
            while(i < iCap) {
                if(!inProgPackets[i].handled) {
                    packets.push(inProgPackets[i]);
                };
                i++;
            };

            i = 0;
            iCap = arrivedPackets.iCap();
            while(i < iCap) {
                if(!arrivedPackets[i].handled) {
                    packets.push(arrivedPackets[i]);
                };
                i++;
            };

            i = 0;
            iCap = arrivedLocalPackets.iCap();
            while(i < iCap) {
                if(!arrivedLocalPackets[i].handled) {
                    packets.push(arrivedLocalPackets[i]);
                };
                i++;
            };

            return packets;
        };

        let getTimeText = function(packet) {
            return Strings.fixed(packet.timeSpent / 60.0, 1) + " / " +
                Strings.fixed(packet.timeReq / 60.0, 1) + " " + StatUnit.seconds.localized();
        };

        let updateTime = function(entry) {
            entry.lab.setText(getTimeText(entry.packet));
            entry.lab.setColor(entry.packet.isCompleted() ? GLB_color.heal : Color.white);
        };

        let buildItems = function(packet) {
            if(packet.data == null) return null;
            let
                i,
                iCap,
                item,
                stacks = [],
                stackChunk;

            i = 0;
            iCap = packet.data.iCap();
            while(i < iCap) {
                item = MDL_content.getCt(packet.data[i], ContentGetModes.RS, true);
                if(item != null) {
                    stacks.push(new ItemStack(item, Math.floor(packet.data[i + 1])));
                };
                i += 2;
            };
            if(stacks.length === 0) return null;

            let itemsTb = new Table();
            itemsTb.left().top();

            i = 0;
            iCap = stacks.iCap();
            while(i < iCap) {
                stackChunk = stacks.slice(i, i + 6);
                StatValues.items(false, stackChunk).display(itemsTb);
                itemsTb.row();
                i += 6;
            };

            return itemsTb;
        };

        let buildCard = function(packet) {
            let lab;
            listTb.table(Styles.grayPanel, card => {
                card.add(CLS_sectorResourcePacket.getLocalizedSecName(packet.from) + "  ->  " + CLS_sectorResourcePacket.getLocalizedSecName(packet.to))
                .color(GLB_color.accent)
                .padBottom(4.0)
                .center().top()
                .expandX()
                .wrap();
                card.row();
                card.left().top().defaults().left();
                MDL_table.br(card, 1);

                card.table(cons(st => {
                    st.add(MDL_bundle.getTerm("lovec", "time-required") + ":")
                    .color(GLB_color.gray)
                    .padRight(6.0)
                    .top();
                    lab = st.add("").top().get();
                    st.row();

                    let itemsTb = buildItems(packet);
                    if(itemsTb != null) {
                        st.add(MDL_bundle.getTerm("lovec", "item") + ":")
                        .color(GLB_color.gray)
                        .padRight(6.0)
                        .top();
                        st.add(itemsTb).left().top();
                    };
                }))
                .left()
                .top()
                .padTop(2.0)
                .growX();
            })
            .pad(5.0)
            .margin(10.0)
            .growX()
            .top()
            .uniformX();

            entries.push({packet: packet, lab: lab});
        };

        let rebuild = function() {
            let
                i,
                iCap,
                packets = collect(),
                same = lastPackets != null && packets.length === lastPackets.length;

            if(same) {
                i = 0;
                iCap = packets.iCap();
                for(i = 0; i < iCap; i++) {
                    if(packets[i] !== lastPackets[i]) {
                        same = false;
                        break;
                    };
                };
            };
            lastPackets = packets;

            if(!same) {
                let scrollY = pn.getScrollY();
                listTb.clearChildren();
                entries = [];
                if(packets.length === 0) {
                    listTb.add(MDL_bundle.getInfo("lovec", "nothing").color(Color.gray)).pad(8.0).center();
                } else {
                    i = 0;
                    iCap = packets.iCap();
                    while(i < iCap) {
                        buildCard(packets[i]);
                        if(i % 2 === 1) {
                            listTb.row();
                        };
                        i++;
                    };
                };
                Core.app.post(() => {
                    pn.setScrollY(scrollY);
                });
            };

            i = 0;
            iCap = entries.iCap();
            while(i < iCap) {
                updateTime(entries[i]);
                i++;
            };
        };

        rebuild();

        listTb.update(() => {
            if(GLB_timer.frameFour) {
                rebuild();
            };
        });
    };


    /**
     * Writes a packet as an object.
     * @param {Object|unset} contObj
     * @param {CLS_sectorResourcePacket} packet
     * @return {Object}
     */
    CLS_sectorResourcePacket.writeObj = function(contObj, packet) {
        let obj = contObj != null ? contObj : {};

        obj.from = packet.from;
        obj.to = packet.to;
        obj.data = packet.data;
        obj.timeReq = packet.timeReq;
        obj.timeSpent = packet.timeSpent;

        return obj;
    };


    /**
     * Reads an object and creates a new packet.
     * @param {Object} obj
     * @return {CLS_sectorResourcePacket}
     */
    CLS_sectorResourcePacket.readObj = function(obj) {
        let packet = new CLS_sectorResourcePacket(obj.from, obj.to, obj.data, obj.timeReq);
        packet.timeSpent = obj.timeSpent;
        return packet;
    };


    /**
     * Writes all packets into PLSAV.
     * @return {void}
     */
    CLS_sectorResourcePacket.writePlsav = function() {
        let objs = [];
        inProgPackets.forEachFast(packet => {
            if(packet.handled) return;
            objs.push(packet.writeObj({}));
        }, true);
        arrivedPackets.forEachFast(packet => {
            if(packet.handled) return;
            objs.push(packet.writeObj({}));
        }, true);
        arrivedLocalPackets.forEachFast(packet => {
            if(packet.handled) return;
            objs.push(packet.writeObj({}));
        }, true);
        GLB_save.set("sector-packet", objs, true);
    };


    /**
     * Reads packets from PLSAV.
     * @return {void}
     */
    CLS_sectorResourcePacket.readPlsav = function() {
        inProgPackets.clear();
        arrivedPackets.clear();
        arrivedLocalPackets.clear();
        GLB_save.get("sector-packet", true).forEachFast(obj => {
            CLS_sectorResourcePacket.readObj(obj);
        });
    };


/*
  ================================================================================
  Section: Definition (Instance)
  ================================================================================
*/


    /**
     * Whether this packet has arrived.
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
        this.handled = true;
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


    /**
     * Variant of {@link CLS_sectorResourcePacket.writeObj} for instances.
     * @param {Object|unset} [contObj]
     * @return {Object}
     */
    CLS_sectorResourcePacket.prototype.writeObj = function(contObj) {
        return CLS_sectorResourcePacket.writeObj(contObj, this);
    };




module.exports = CLS_sectorResourcePacket;
