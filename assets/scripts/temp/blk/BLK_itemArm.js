/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Wall, BLK_itemArm>} BLKItemArm
     */


    /**
     * @typedef {TemplateInstance<Wall.WallBuild, B_itemArm>} BItemArm
     * @prop {BLKItemArm} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseItemDistributor");
    const INTF_BLK_contentSelector = require("lovec/temp/intf/INTF_BLK_contentSelector");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKItemArm} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.clipSize += blk.delegee.itemDrawOff + 12.0;

        blk.group = BlockGroup.none;
        blk.priority = TargetPriority.transport;
        blk.update = true;
        blk.canOverdrive = true;
        blk.rotate = true;
        blk.drawArrow = false;
        blk.drawDisabled = true;
        blk.drawDynamic = true;
        blk.drawCached = false;

        blk.delegee.armPlayAng = Math.atan(7.0 / blk.delegee.moveR) * 2.0 * Math.PI;

        blk.config(JAVA.boolean, (b, bool) => {
            b.delegee.shouldDropLoot = bool;
        });
        blk.config(JAVA.float, (b, f) => {
            b.delegee.blk$moveStackAmt = f;
        });

        blk.self.ex_addConfigM("ctTarget", (b, val) => b.delegee.ctTarget = MDL_content.getCt(val, ContentGetModes.RS));
        blk.self.ex_addConfigM("shouldDropLoot", (b, val) => b.delegee.shouldDropLoot = val);
        blk.self.ex_addConfigM("stackThreshold", (b, val) => b.delegee.blk$moveStackAmt = val);
    };


    /**
     * @private
     * @param {BLKItemArm} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.armReg = fetchRegion(blk, "-arm");
        blk.delegee.itemReg = fetchRegion(blk, "-item");
    };


    /**
     * @private
     * @param {BLKItemArm} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(Stat.itemsMoved, blk.delegee.moveStackAmt * 60.0 / (blk.delegee.moveTime * 2.0 + blk.delegee.pickCooldown), StatUnit.itemsSecond);
        stats.add(fetchStat("lovec", "blk0item-stackamt"), blk.delegee.moveStackAmt);
    };


    /**
     * @private
     * @param {BItemArm} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        b.delegee.blk$armZ = b.block.delegee.armZ + b.x * -0.000001 - b.y * 0.00001 + b.block.delegee.moveR * 0.0001;
        b.delegee.moveTarget = TmpStateTag.pending;

        let ob = b.self.ex_findMoveB(false);
        b.delegee.playingWithUnit = false;
        b.delegee.playingWithCrank = ob != null && checkSubInsOfTemp(ob.block, "BLK_manualTurbine");
    };


    /**
     * @private
     * @param {BItemArm} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if((b.delegee.playingWithUnit || b.delegee.playingWithCrank) && b.efficiency > GLB_var.param.buildActiveEffcThr) {
            b.delegee.moveAng = Math.sin(GLB_var.time / 10.0) * b.block.delegee.armPlayAng;
            if(b.delegee.playingWithUnit && GLB_timer.secFive) {
                let unit = LCEntity.getUnit(b.self.ex_calcMoveIntCoord(false, false) * Vars.tilesize, b.self.ex_calcMoveIntCoord(false, true) * Vars.tilesize);
                if(unit != null && unit.isGrounded() && MDL_cond.canHeal(unit, b.team)) {
                    FRAG_attack.heal(unit, 1.0);
                };
            };
            if(!Vars.net.client() && b.delegee.playingWithCrank && GLB_timer.minHalf) {
                let ob = b.self.ex_findMoveB(false);
                if(ob != null && checkSubInsOfTemp(ob.block, "BLK_manualTurbine")) {
                    MDL_call.callOnce("arm plays crank: " + ob.pos(), () => ob.self.ex_configureClick());
                };
            };
        };

        if(GLB_timer.secHalf) {
            b.delegee.moveTarget = b.self.ex_findMoveB(true);
        };
        if(b.delegee.moveTarget === TmpStateTag.pending) return;

        if(!b.delegee.isBackMove) {
            // Moving forwards
            b.delegee.moveProg += b.self.ex_calcMoveProgInc();
            if(b.delegee.moveProg >= 1.0) {
                b.self.ex_waitTarget();
            };
        } else {
            // Moving backwards
            b.delegee.moveProg -= b.self.ex_calcMoveProgInc();
            if(b.delegee.moveProg <= 0.0) {
                b.self.ex_waitStart();
            };
        };

        if(!b.delegee.playingWithUnit && !b.delegee.playingWithCrank) {
            b.delegee.moveAng = b.delegee.moveProg * 180.0 * Mathf.sign(b.rotation <= 1);
        };
    };


    /**
     * @private
     * @param {BItemArm} b
     * @param {Table} tb
     * @return {void}
     */
    function comp_buildConfiguration(b, tb) {
        b.self.ex_buildSelector(tb);

        tb.row();
        tb.table(Styles.black6, tb1 => {
            MDL_table.margin(tb1);
            tb1.table(Styles.none, tb2 => {
                MDL_table.sliderCfg(
                    tb2, b,
                    () => "${1}: ${2}".format(MDL_bundle.getTerm("lovec", "stack-threshold"), b.delegee.blk$moveStackAmt),
                    1, b.block.delegee.moveStackAmt, 1, b.delegee.blk$moveStackAmt,
                    {align: Align.center},
                );
            });
        })
        .growX()
        .row();
        tb.table(Styles.none, tb1 => {
            MDL_table.btnCfgToggleColor(tb1, b, GLB_varGen.icons.dropLoot, b.delegee.shouldDropLoot)
            .tooltip(MDL_bundle.getInfo("lovec", "tt-switch-loot-dropping"), true);
        });
    };


    /**
     * @private
     * @param {BItemArm} b
     * @return {void}
     */
    function comp_draw(b) {
        let ang = b.drawrot() + b.delegee.moveAng;

        Draw.rect(b.block.region, b.x, b.y);
        processZ(b.delegee.blk$armZ);
        Draw.rect(b.block.delegee.armReg, b.x, b.y, ang);
        if(b.delegee.ctTarget instanceof Item && b.block.delegee.itemReg.found()) {
            Draw.color(b.delegee.ctTarget.color);
            Draw.rect(b.block.delegee.itemReg, b.x, b.y, ang);
            Draw.color();
        };
        if(b.delegee.moveItemCur != null && b.delegee.moveItemAmtCur > 0) {
            LCDraw.content(b.x + b.block.delegee.itemDrawOff * Mathf.cosDeg(ang), b.y + b.block.delegee.itemDrawOff * Mathf.sinDeg(ang), b.delegee.moveItemCur, 0.6, b.delegee.moveAng);
        };
        processZ();
    };


    /**
     * @private
     * @param {BItemArm} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        b.self.ex_drawSelected();
        LCDrawf.areaShrink(b.self.ex_findMoveT(false), 1, Pal.heal, 0.85);
        LCDrawf.areaShrink(b.self.ex_findMoveT(true), 1, Pal.techBlue, 0.85);
    };


    /**
     * @private
     * @param {BItemArm} b
     * @return {void}
     */
    function comp_ex_waitStart(b) {
        b.delegee.moveProg = 0.0;
        if(b.delegee.pickCd > 0.0) {
            b.delegee.pickCd = Mathf.maxZero(b.delegee.pickCd - b.edelta());
            return;
        };

        let b_f = b.self.ex_findMoveB(false);
        if(b_f != null) {
            b.delegee.playingWithUnit = false;
            b.self.ex_doPick(b_f);
        } else {
            b.self.ex_doFloorPick();
        };
    };


    /**
     * @private
     * @param {BItemArm} b
     * @return {void}
     */
    function comp_ex_waitTarget(b) {
        b.delegee.moveProg = 1.0;
        let b_t = b.self.ex_findMoveB(true);
        if(b_t != null) {
            if(b.self.ex_canInsertItem(b_t, b.delegee.moveItemCur, b.delegee.moveItemAmtCur)) {
                if(!b.delegee.isFirstInsertion) {
                    b.self.ex_doDump(b_t);
                } else {
                    b.delegee.isFirstInsertion = false;
                    if(!b.block.self.ex_shouldAlwaysDump(b_t.block)) {
                        b.self.ex_doInsert(b_t);
                    };
                };
                if(b.delegee.moveItemAmtCur <= 0) {
                    b.self.ex_moveBack();
                };
            };
        } else {
            b.self.ex_doFloorInsert();
        };
    };


    /**
     * @private
     * @param {BItemArm} b
     * @param {Building} b_f
     * @return {void}
     */
    function comp_ex_doPick(b, b_f) {
        if(b_f.block instanceof ItemSource) {
            if(b_f.outputItem == null) return;
            b.delegee.moveItemCur = b_f.outputItem;
            if(b.delegee.moveTarget == null || b.self.ex_canInsertItem(b.delegee.moveTarget, b.delegee.moveItemCur, b.delegee.blk$moveStackAmt)) {
                b.delegee.moveItemAmtCur = b.delegee.blk$moveStackAmt;
                b.self.ex_moveForward();
            };
        } else {
            b.delegee.moveItemCur = b.self.ex_getMoveItemTarget(b_f);
            if(b.delegee.moveItemCur != null && b.self.ex_canPickItem(b_f, b.delegee.moveItemCur, b.delegee.ctTarget == null ? 1 : b.delegee.blk$moveStackAmt) && (b.delegee.moveTarget == null || b.self.ex_canInsertItem(b.delegee.moveTarget, b.delegee.moveItemCur, b.delegee.blk$moveStackAmt))) {
                let amtTrans;
                if(b_f.getPayload() instanceof BuildPayload) {
                    amtTrans = Math.min(b_f.getPayload().build.items.get(b.delegee.moveItemCur), b.delegee.blk$moveStackAmt);
                    b_f.getPayload().build.removeStack(b.delegee.moveItemCur, amtTrans);
                } else {
                    amtTrans = Math.min(b_f.items.get(b.delegee.moveItemCur), b.delegee.blk$moveStackAmt);
                    b_f.removeStack(b.delegee.moveItemCur, amtTrans);
                };
                b.delegee.moveItemAmtCur = amtTrans;
                b.self.ex_moveForward();
            };
        };
    };


    /**
     * @private
     * @param {BItemArm} b
     * @return {void}
     */
    function comp_ex_doFloorPick(b) {
        if(GLB_timer.secHalf) {
            let unit = LCEntity.getUnit(b.self.ex_calcMoveIntCoord(false, false) * Vars.tilesize, b.self.ex_calcMoveIntCoord(false, true) * Vars.tilesize);
            if(unit != null && unit.isGrounded() && unit.stack.amount > 0) {
                b.delegee.playingWithUnit = false;
                b.self.ex_doUnitPick(unit);
            } else if(unit != null && unit.isGrounded() && LCProp.getHitSize(unit) <= 8.0) {
                b.delegee.playingWithUnit = true;
            } else {
                b.delegee.playingWithUnit = false;
                let loot = LCEntity.getLoot(b.self.ex_calcMoveIntCoord(false, false) * Vars.tilesize, b.self.ex_calcMoveIntCoord(false, true) * Vars.tilesize);
                if(loot != null && loot.stack.amount > 0) {
                    b.self.ex_doLootPick(loot);
                };
            };
        };
    };


    /**
     * @private
     * @param {BItemArm} b
     * @param {Unit} unit
     * @return {void}
     */
    function comp_ex_doUnitPick(b, unit) {
        b.delegee.moveItemCur = unit.item();
        if(b.delegee.moveTarget == null || b.self.ex_canInsertItem(b.delegee.moveTarget, b.delegee.moveItemCur, b.delegee.blk$moveStackAmt)) {
            let amtTrans = Math.min(unit.stack.amount, b.delegee.blk$moveStackAmt);
            b.delegee.moveItemAmtCur = amtTrans;
            FRAG_item.setUnitItem(unit, unit.item(), unit.stack.amount - amtTrans);
            b.self.ex_moveForward();
        };
    };


    /**
     * @private
     * @param {BItemArm} b
     * @param {LootUnit} loot
     * @return {void}
     */
    function comp_ex_doLootPick(b, loot) {
        b.delegee.moveItemCur = loot.item();
        if(b.delegee.moveTarget == null || b.self.ex_canInsertItem(b.delegee.moveTarget, b.delegee.moveItemCur, b.delegee.blk$moveStackAmt)) {
            let amtTrans = Math.min(loot.stack.amount, b.delegee.blk$moveStackAmt);
            b.delegee.moveItemAmtCur = amtTrans;
            FRAG_item.setUnitItem(loot, loot.item(), loot.stack.amount - amtTrans);
            loot.time = 0.0;
            b.self.ex_moveForward();
        };
    };


    /**
     * @private
     * @param {BItemArm} b
     * @param {Building} b_t
     * @return {void}
     */
    function comp_ex_doInsert(b, b_t) {
        let amtTrans;
        if(b_t.getPayload() instanceof BuildPayload) {
            // Insert items into payload
            amtTrans = b_t.getPayload().build.acceptStack(b.delegee.moveItemCur, b.delegee.moveItemAmtCur, b);
            if(amtTrans > 0) {
                b_t.getPayload().build.handleStack(b.delegee.moveItemCur, amtTrans, b);
                b.delegee.moveItemAmtCur -= amtTrans;
            };
        } else {
            // Insert items into building
            amtTrans = b.block.self.ex_shouldCheckStack(b_t.block) ?
                b_t.acceptStack(b.delegee.moveItemCur, b.delegee.moveItemAmtCur, b) :
                b_t.items == null ?
                    0 :
                    Math.min(b_t.getMaximumAccepted(b.delegee.moveItemCur) - b_t.items.get(b.delegee.moveItemAmtCur), b.delegee.moveItemAmtCur);
            if(amtTrans > 0) {
                b_t.handleStack(b.delegee.moveItemCur, amtTrans, b);
                b.delegee.moveItemAmtCur -= amtTrans;
            };
        };
    };


    /**
     * @private
     * @param {BItemArm} b
     * @return {void}
     */
    function comp_ex_doFloorInsert(b) {
        let unit = LCEntity.getUnit(b.self.ex_calcMoveIntCoord(true, false) * Vars.tilesize, b.self.ex_calcMoveIntCoord(true, true) * Vars.tilesize);
        if(unit != null && unit.isGrounded() && unit.acceptsItem(b.delegee.moveItemCur)) {
            b.self.ex_doUnitInsert(unit);
        };
        if(b.delegee.moveItemAmtCur <= 0) {
            b.self.ex_moveBack();
        } else if(b.delegee.shouldDropLoot) {
            let loot = LCEntity.getLoot(b.self.ex_calcMoveIntCoord(true, false) * Vars.tilesize, b.self.ex_calcMoveIntCoord(true, true) * Vars.tilesize);
            if(loot != null && loot.acceptsItem(b.delegee.moveItemCur)) {
                b.self.ex_doLootInsert(loot);
            };
            b.self.ex_doLootDump();
            b.self.ex_moveBack();
        };
    };


    /**
     * @private
     * @param {BItemArm} b
     * @param {Unit} unit
     * @return {void}
     */
    function comp_ex_doUnitInsert(b, unit) {
        let amtTrans = Math.min(unit.maxAccepted(b.delegee.moveItemCur) - unit.stack.amount, b.delegee.moveItemAmtCur);
        if(amtTrans > 0) {
            FRAG_item.setUnitItem(unit, b.delegee.moveItemCur, unit.stack.amount + amtTrans);
            b.delegee.moveItemAmtCur -= amtTrans;
        };
    };


    /**
     * @private
     * @param {BItemArm} b
     * @param {LootUnit} loot
     * @return {void}
     */
    function comp_ex_doLootInsert(b, loot) {
        let amtTrans = Math.min(loot.maxAccepted(b.delegee.moveItemCur) - loot.stack.amount, b.delegee.moveItemAmtCur);
        if(amtTrans > 0) {
            FRAG_item.setUnitItem(loot, b.delegee.moveItemCur, loot.stack.amount + amtTrans);
            loot.time = 0.0;
            b.delegee.moveItemAmtCur -= amtTrans;
        };
    };


    /**
     * @private
     * @param {BItemArm} b
     * @param {Building} b_t
     * @return {void}
     */
    function comp_ex_doDump(b, b_t) {
        b.delegee.dumpTimeCur += b.delta();
        if(b.delegee.dumpTimeCur >= b.block.dumpTime) {
            b.delegee.dumpTimeCur %= b.block.dumpTime;
            if(b_t.getPayload() instanceof BuildPayload) {
                // Dump items into payload
                if(b.delegee.moveItemAmtCur > 0) {
                    b_t.getPayload().build.handleItem(b, b.delegee.moveItemCur);
                    b.delegee.moveItemAmtCur--;
                };
            } else {
                // Dump items into building
                if(b.delegee.moveItemAmtCur > 0 && (!(b_t.block instanceof Conveyor) || b_t.items.get(b.delegee.moveItemCur) < b_t.getMaximumAccepted(b.delegee.moveItemCur))) {
                    b_t.handleItem(b, b.delegee.moveItemCur);
                    b.delegee.moveItemAmtCur--;
                };
            };
        };
    };


    /**
     * @private
     * @param {BItemArm} b
     * @return {void}
     */
    function comp_ex_doLootDump(b) {
        if(b.delegee.moveItemAmtCur > 0) {
            let item = b.delegee.moveItemCur;
            let amt = b.delegee.moveItemAmtCur;
            Core.app.post(() => {
                let ang = b.drawrot() + b.delegee.moveAng;
                MDL_call.spawnLoot_server(b.x + b.block.delegee.itemDrawOff * Mathf.cosDeg(ang), b.y + b.block.delegee.itemDrawOff * Mathf.sinDeg(ang), item, amt);
            });
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Inserter from Factorio.
         * Intentionally capable of interaction with enemy units.
         * <br> `SINGLESIZE`
         * @class BLK_itemArm
         * @extends BLK_baseItemDistributor
         * @extends INTF_BLK_contentSelector
         */
        newClass()
        .extendClass(PARENT[0], "BLK_itemArm")
        .implement(INTF_BLK_contentSelector[0])
        .initTemplate()
        .setParent("Wall")
        .setTags()
        .setParam({


            /**
             * `PARAM`: Time required to rotate by 180°. Needs double time to send an item.
             * @memberof BLK_itemArm
             * @instance
             * @type {number}
             */
            moveTime: 60.0,
            /**
             * `PARAM`: Cooldown time after item insertion.
             * @memberof BLK_itemArm
             * @instance
             * @type {number}
             */
            pickCooldown: 0.0,
            /**
             * `PARAM`: Reach distance.
             * @memberof BLK_itemArm
             * @instance
             * @type {number}
             */
            moveR: 1,
            /**
             * `PARAM`: Amount of items in each stack.
             * @memberof BLK_itemArm
             * @instance
             * @type {number}
             */
            moveStackAmt: 5,
            /**
             * `PARAM`: How far item is drawn from the center.
             * @memberof BLK_itemArm
             * @instance
             * @type {number}
             */
            itemDrawOff: 8.0,
            /**
             * `PARAM`: Z-layer of arm region.
             * @memberof BLK_itemArm
             * @instance
             * @type {number}
             */
            armZ: 69.1,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_itemArm
             * @instance
             * @type {number}
             */
            armPlayAng: 0.0,
            /**
             * `INTERNAL`
             * @memberof BLK_itemArm
             * @instance
             * @type {TextureRegion}
             */
            armReg: null,
            /**
             * `INTERNAL`
             * @memberof BLK_itemArm
             * @instance
             * @type {TextureRegion}
             */
            itemReg: null,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_itemArm
             * @instance
             * @type {boolean}
             */
            useConfigStr: true,


            /* <------------------------------ vanilla ------------------------------> */


            ignoreLineRotation: true,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            load: function() {
                comp_load(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            /**
             * Whether insertion happens using stack methods.
             * @memberof BLK_itemArm
             * @instance
             * @func
             * @param {Block} oblk
             * @return {boolean}
             */
            ex_shouldCheckStack: function(oblk) {
                return MDL_cond.isConveyor(oblk)
                    || MDL_cond.isBridge(oblk)
            }
            .setCache()
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * Whether batch insertion at the first time should be skipped.
             * @memberof BLK_itemArm
             * @instance
             * @func
             * @param {Block} oblk
             * @return {boolean}
             */
            ex_shouldAlwaysDump: function(oblk) {
                return MDL_cond.isNonStackConveyor(oblk)
                    || oblk instanceof ItemVoid;
            }
            .setCache()
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


        }),


        /**
         * @class B_itemArm
         * @extends B_baseItemDistributor
         * @extends INTF_B_contentSelector
         */
        newClass()
        .extendClass(PARENT[1], "B_itemArm")
        .implement(INTF_BLK_contentSelector[1])
        .initTemplate()
        .setParent("Wall.WallBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_itemArm
             * @instance
             * @type {boolean}
             */
            shouldDropLoot: false,
            /**
             * `INTERNAL`
             * @memberof B_itemArm
             * @instance
             * @type {Building|null|TmpStateTag}
             */
            moveTarget: TmpStateTag.pending,
            /**
             * `INTERNAL`
             * @memberof B_itemArm
             * @instance
             * @type {Item|null}
             */
            moveItemCur: null,
            /**
             * `INTERNAL`
             * @memberof B_itemArm
             * @instance
             * @type {number}
             */
            moveItemAmtCur: 0,
            /**
             * `INTERNAL`: Whether this item arm is moving back to start position.
             * @memberof B_itemArm
             * @instance
             * @type {boolean}
             */
            isBackMove: true,
            /**
             * `INTERNAL`: If true, batch insertion happens.
             * @memberof B_itemArm
             * @instance
             * @type {boolean}
             */
            isFirstInsertion: false,
            /**
             * `INTERNAL`: 0.0 for start position, 1.0 for target position.
             * @memberof B_itemArm
             * @instance
             * @type {number}
             */
            moveProg: 0.0,
            /**
             * `INTERNAL`
             * @memberof B_itemArm
             * @instance
             * @type {number}
             */
            moveAng: 0.0,
            /**
             * `INTERNAL`
             * @memberof B_itemArm
             * @instance
             * @type {number}
             */
            pickCd: 0.0,
            /**
             * `INTERNAL`
             * @memberof B_itemArm
             * @instance
             * @type {boolean}
             */
            playingWithUnit: false,
            /**
             * `INTERNAL`
             * @memberof B_itemArm
             * @instance
             * @type {boolean}
             */
            playingWithCrank: false,
            /**
             * `INTERNAL`
             * @memberof B_itemArm
             * @instance
             * @type {number|TmpStateTag}
             */
            blk$moveStackAmt: TmpStateTag.needReplace,
            /**
             * `INTERNAL`
             * @memberof B_itemArm
             * @instance
             * @type {number|TmpStateTag}
             */
            blk$armZ: TmpStateTag.needReplace,


        })
        .setMethod({


            onProximityUpdate: function() {
                comp_onProximityUpdate(this);
            },


            updateTile: function() {
                comp_updateTile(this);
            },


            config: function() {
                return packConfig({
                    ctTarget: this.delegee.ctTarget == null ? "null" : this.delegee.ctTarget.name,
                    shouldDropLoot: this.delegee.shouldDropLoot,
                    stackThreshold: this.delegee.blk$moveStackAmt,
                });
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            buildConfiguration: function(tb) {
                comp_buildConfiguration(this, tb);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            draw: function() {
                comp_draw(this);
                this.self.ex_drawRcIcon();
            }
            .setProp({
                noSuper: true,
            }),


            drawSelect: function() {
                comp_drawSelect(this);
            },


            status: function() {
                return this.delegee.pickCd > 0.0 ?
                    BlockStatus.inactive :
                    this.super$status();
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            write: function(wr) {
                this.self.ex_processData(wr);
                MDL_io.ct(wr, this.delegee.moveItemCur);
                wr.i(this.delegee.moveItemAmtCur);
                wr.bool(this.delegee.isBackMove);
                wr.f(this.delegee.moveProg);
                wr.bool(this.delegee.shouldDropLoot);
                wr.i(this.delegee.blk$moveStackAmt);
            },


            read: function(rd, revi) {
                this.self.ex_processData(rd);
                this.delegee.moveItemCur = MDL_io.ct(rd);
                this.delegee.moveItemAmtCur = rd.i();
                this.delegee.isBackMove = rd.bool();
                this.delegee.moveProg = rd.f();
                if(this.delegee.LCReviJson["B_itemArm"] >= 1) {
                    this.delegee.shouldDropLoot = rd.bool();
                    this.delegee.blk$moveStackAmt = rd.i();
                };
            },


            /**
             * @memberof B_itemArm
             * @instance
             * @func
             * @return {void}
             */
            ex_moveForward: function() {
                if(this.delegee.moveItemCur != null && this.delegee.moveItemAmtCur > 0) {
                    this.delegee.isBackMove = false;
                    this.delegee.isFirstInsertion = true;
                };
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof B_itemArm
             * @instance
             * @func
             * @return {void}
             */
            ex_moveBack: function() {
                this.delegee.isBackMove = true;
                this.delegee.moveItemCur = null;
                this.delegee.moveItemAmtCur = 0;
                this.delegee.pickCd = this.block.delegee.pickCooldown;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof B_itemArm
             * @instance
             * @func
             * @return {void}
             */
            ex_waitStart: function() {
                comp_ex_waitStart(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof B_itemArm
             * @instance
             * @func
             * @return {void}
             */
            ex_waitTarget: function() {
                comp_ex_waitTarget(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Picks item from a building.
             * @memberof B_itemArm
             * @instance
             * @func
             * @param {Building} b_f
             * @return {void}
             */
            ex_doPick: function(b_f) {
                comp_ex_doPick(this, b_f);
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**.
             * @memberof B_itemArm
             * @instance
             * @func
             * @return {void}
             */
            ex_doFloorPick: function() {
                comp_ex_doFloorPick(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Picks item from a unit.
             * @memberof B_itemArm
             * @instance
             * @func
             * @param {Unit} unit
             * @return {void}
             */
            ex_doUnitPick: function(unit) {
                comp_ex_doUnitPick(this, unit);
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * Picks item from a loot.
             * @memberof B_itemArm
             * @instance
             * @func
             * @param {LootUnit} loot
             * @return {void}
             */
            ex_doLootPick: function(loot) {
                comp_ex_doLootPick(this, loot);
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * Inserts item into a building.
             * @memberof B_itemArm
             * @instance
             * @func
             * @param {Building} b_t
             * @return {void}
             */
            ex_doInsert: function(b_t) {
                comp_ex_doInsert(this, b_t);
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * @memberof B_itemArm
             * @instance
             * @func
             * @return {void}
             */
            ex_doFloorInsert: function() {
                comp_ex_doFloorInsert(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Inserts item into a unit.
             * @memberof B_itemArm
             * @instance
             * @func
             * @param {Unit} unit
             * @return {void}
             */
            ex_doUnitInsert: function(unit) {
                comp_ex_doUnitInsert(this, unit);
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * Inserts item into a loot.
             * @memberof B_itemArm
             * @instance
             * @func
             * @param {LootUnit} loot
             * @return {void}
             */
            ex_doLootInsert: function(loot) {
                comp_ex_doLootInsert(this, loot);
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * Dumps item into a building.
             * @memberof B_itemArm
             * @instance
             * @func
             * @param {Building} b_t
             * @return {void}
             */
            ex_doDump: function(b_t) {
                comp_ex_doDump(this, b_t);
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * Dumps item as loot.
             * @memberof B_itemArm
             * @instance
             * @func
             * @return {void}
             */
            ex_doLootDump: function() {
                comp_ex_doLootDump(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_itemArm
             * @instance
             * @func
             * @return {boolean}
             */
            ex_isSingleSized: function() {
                return true;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * Whether it's time to take items from a building now.
             * @memberof B_itemArm
             * @instance
             * @func
             * @param {Building} b_f
             * @param {Item} item
             * @param {number} amt
             * @return {boolean}
             */
            ex_canPickItem: function(b_f, item, amt) {
                if(b_f.block instanceof ItemSource) return true;
                if(b_f.getPayload() instanceof BuildPayload) {
                    let ob = b_f.getPayload().build;
                    if(ob.items != null && ob.items.get(item) >= amt) return true;
                };

                return !MDL_cond.isDuct(b_f.block)
                    && b_f.items != null && b_f.items.get(item) >= amt;
            }
            .setProp({
                noSuper: true,
                argLen: 3,
            }),


            /**
             * Whether it's possible to insert items into a building now.
             * @memberof B_itemArm
             * @instance
             * @func
             * @param {Building} b_t
             * @param {Item} item
             * @param {number} amt
             * @return {boolean}
             */
            ex_canInsertItem: function(b_t, item, amt) {
                if(b_t.getPayload() instanceof BuildPayload) {
                    let ob = b_t.getPayload().build;
                    if(ob.items != null && MDL_cond.isContainer(ob.block) && ob.acceptStack(item, amt, b_t) >= amt) return true;
                };

                return !MDL_cond.isDuct(b_t.block)
                    && (!this.block.self.ex_shouldCheckStack(b_t.block) ? b_t.acceptItem(this, item) : b_t.acceptStack(item, amt, b_t) >= 1);
            }
            .setProp({
                noSuper: true,
                argLen: 3,
            }),


            /**
             * Gets tile for a pick/insertion target position.
             * @memberof B_itemArm
             * @instance
             * @func
             * @param {boolean} isTo
             * @return {Tile|null}
             */
            ex_findMoveT: function(isTo) {
                return GLB_var.world.tile(this.self.ex_calcMoveIntCoord(isTo, false), this.self.ex_calcMoveIntCoord(isTo, true));
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * Gets building on a pick/insertion target position.
             * @memberof B_itemArm
             * @instance
             * @func
             * @param {boolean} isTo
             * @return {Building|null}
             */
            ex_findMoveB: function(isTo) {
                let ob = GLB_var.world.build(this.self.ex_calcMoveIntCoord(isTo, false), this.self.ex_calcMoveIntCoord(isTo, true));
                return ob == null || ob.team !== this.team ?
                    null :
                    ob;
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * Calculates coordinates of target position.
             * @memberof B_itemArm
             * @instance
             * @func
             * @param {boolean} isTo
             * @param {boolean} isY
             * @return {number}
             */
            ex_calcMoveIntCoord: function(isTo, isY) {
                return !isY ?
                    this.rotation % 2 !== 0 ? this.tileX() : (this.tileX() + this.block.delegee.moveR * Mathf.sign(this.rotation >= 2) * (isTo ? 1 : -1)) :
                    this.rotation % 2 === 0 ? this.tileY() : (this.tileY() + this.block.delegee.moveR * Mathf.sign(this.rotation >= 2) * (isTo ? 1 : -1));
            }
            .setProp({
                noSuper: true,
                argLen: 2,
            }),


            /**
             * Gets target item to pick.
             * @memberof B_itemArm
             * @instance
             * @func
             * @param {Building} b_f
             * @return {Item|null}
             */
            ex_getMoveItemTarget: function(b_f) {
                return this.delegee.ctTarget != null ?
                    this.delegee.ctTarget :
                    b_f.getPayload() instanceof BuildPayload && b_f.getPayload().build.items != null ?
                        b_f.getPayload().build.items.first() :
                        b_f.items != null ?
                            b_f.items.first() :
                            null;
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * Calculates progress increase in a frame.
             * @memberof B_itemArm
             * @instance
             * @func
             * @return {number}
             */
            ex_calcMoveProgInc: function() {
                // Real time required is slightly shorter to match displayed speed
                return this.edelta() / Math.max(this.block.delegee.moveTime - 7.5, 0.0001);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @memberof B_itemArm
             * @instance
             * @func
             * @return {number}
             * @lovecAttached
             */
            ex_getReloadFrac: function() {
                return this.block.delegee.pickCooldown < 0.0001 ?
                    1.0 :
                    Mathf.clamp(1.0 - this.delegee.pickCd / this.block.delegee.pickCooldown);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_itemArm
             * @instance
             * @func
             * @return {void}
             */
            ex_handleConfigStrDef: function(str) {
                let ct = MDL_content.getCt(str, null, true);
                if(!this.block.delegee.selectionQueue.includes(ct)) return;
                this.delegee.ctTarget = ct;
                this.self.ex_onSelectorUpdate();
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


    ];
