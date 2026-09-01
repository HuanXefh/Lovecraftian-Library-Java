/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseItemDistributor");
  const INTF = require("lovec/temp/intf/INTF_BLK_contentSelector");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.group = BlockGroup.none;
    blk.priority = TargetPriority.transport;
    blk.update = true;
    blk.canOverdrive = true;
    blk.rotate = true;
    blk.drawArrow = false;
    blk.drawDisabled = true;
    blk.drawDynamic = true;
    blk.drawCached = false;

    blk.armPlayAng = Math.atan(7.0 / blk.moveR) * 2.0 * Math.PI;

    blk.config(JAVA.boolean, (b, bool) => {
      b.delegee.shouldDropLoot = bool;
    });
    blk.config(JAVA.float, (b, f) => {
      b.delegee.blk$moveStackAmt = f;
    });

    blk.ex_addConfigM("ctTarget", (b, val) => b.delegee.ctTarget = MDL_content.getCt(val, "rs"));
    blk.ex_addConfigM("shouldDropLoot", (b, val) => b.delegee.shouldDropLoot = val);
    blk.ex_addConfigM("stackThreshold", (b, val) => b.delegee.blk$moveStackAmt = val);
  };


  function comp_load(blk) {
    blk.armReg = fetchRegion(blk, "-arm");
    blk.itemReg = fetchRegion(blk, "-item");
  };


  function comp_setStats(blk) {
    blk.stats.add(Stat.itemsMoved, blk.moveStackAmt * 60.0 / (blk.moveTime * 2.0 + blk.pickCooldown), StatUnit.itemsSecond);
    blk.stats.add(fetchStat("lovec", "blk0itm-stackamt"), blk.moveStackAmt);
  };


  function comp_onProximityUpdate(b) {
    b.blk$armZ = b.block.delegee.armZ + b.x * -0.000001 - b.y * 0.00001 + b.block.delegee.moveR * 0.0001;
    b.moveTarget = TmpStateTag.pending;

    let ob = b.ex_findMoveB(false);
    b.playingWithUnit = false;
    b.playingWithCrank = ob != null && checkSubInsOfTemp(ob.block, "BLK_manualTurbine");
  };


  function comp_updateTile(b) {
    if((b.playingWithUnit || b.playingWithCrank) && b.efficiency > VAR.param.buildActiveEffcThr) {
      b.moveAng = Math.sin(Time.time / 10.0) * b.block.delegee.armPlayAng;
      if(b.playingWithUnit && TIMER.secFive) {
        let unit = LCEntity.getUnit((b.ex_calcMoveIntCoord(false, false) + 0.5) * Vars.tilesize, (b.ex_calcMoveIntCoord(false, true) + 0.5) * Vars.tilesize);
        if(unit != null && unit.isGrounded() && MDL_cond.canHeal(unit, b.team)) {
          FRAG_attack.heal(unit, 1.0);
        };
      };
      if(!Vars.net.client() && b.playingWithCrank && TIMER.minHalf) {
        let ob = b.ex_findMoveB(false);
        if(ob != null && checkSubInsOfTemp(ob.block, "BLK_manualTurbine")) {
          MDL_call.callOnce("arm plays crank: " + ob.pos(), () => ob.ex_configureClick());
        };
      };
    };

    if(TIMER.secHalf) {
      b.moveTarget = b.ex_findMoveB(true);
    };
    if(b.moveTarget === TmpStateTag.pending) return;

    if(!b.isBackMove) {
      // Moving forwards
      b.moveProg += b.ex_getMoveProdInc();
      if(b.moveProg >= 1.0) {
        b.ex_waitTarget();
      };
    } else {
      // Moving backwards
      b.moveProg -= b.ex_getMoveProdInc();
      if(b.moveProg <= 0.0) {
        b.ex_waitStart();
      };
    };

    if(!b.playingWithUnit && !b.playingWithCrank) {
      b.moveAng = b.moveProg * 180.0 * Mathf.sign(b.rotation <= 1);
    };
  };


  function comp_buildConfiguration(b, tb) {
    b.ex_buildSelector(tb);

    tb.row();
    tb.table(Styles.black6, tb1 => {
      MDL_table.margin(tb1);
      tb1.table(Styles.none, tb2 => {
        MDL_table.sliderCfg(tb2, b, () => "${1}: ${2}".format(MDL_bundle.getTerm("lovec", "stack-threshold"), b.blk$moveStackAmt), 1, b.block.delegee.moveStackAmt, 1, b.blk$moveStackAmt);
      });
    })
    .growX()
    .row();
    tb.table(Styles.none, tb1 => {
      MDL_table.btnCfgToggleColor(tb1, b, VARGEN.icons.dropLoot, b.shouldDropLoot)
      .tooltip(MDL_bundle.getInfo("lovec", "tt-switch-loot-dropping"), true);
    });
  };


  function comp_draw(b) {
    let ang = b.drawrot() + b.moveAng;

    Draw.rect(b.block.region, b.x, b.y);
    processZ(b.blk$armZ);
    Draw.rect(b.block.delegee.armReg, b.x, b.y, ang);
    if(b.ctTarget instanceof Item && b.block.delegee.itemReg.found()) {
      Draw.color(b.ctTarget.color);
      Draw.rect(b.block.delegee.itemReg, b.x, b.y, ang);
      Draw.color();
    };
    if(b.moveItmCur != null && b.moveItmAmtCur > 0) {
      LCDraw.content(b.x + b.block.delegee.itmDrawOff * Mathf.cosDeg(ang), b.y + b.block.delegee.itmDrawOff * Mathf.sinDeg(ang), b.moveItmCur, 0.6, b.moveAng);
    };
    processZ();
  };


  function comp_drawSelect(b) {
    b.ex_drawSelected();

    LCDrawf.areaShrink(b.ex_findMoveT(false), 1, Pal.heal, 0.85);
    LCDrawf.areaShrink(b.ex_findMoveT(true), 1, Pal.techBlue, 0.85);
  };


  function comp_ex_waitStart(b) {
    b.moveProg = 0.0;
    if(b.pickCd > 0.0) {
      b.pickCd = Mathf.maxZero(b.pickCd - b.edelta());
      return;
    };

    let b_f = b.ex_findMoveB(false);
    if(b_f != null) {
      b.playingWithUnit = false;
      b.ex_doPick(b_f);
    } else {
      b.ex_doFloorPick();
    };
  };


  function comp_ex_waitTarget(b) {
    b.moveProg = 1.0;
    let b_t = b.ex_findMoveB(true);
    if(b_t != null) {
      if(b.ex_canInsertItm(b_t, b.moveItmCur, b.moveItmAmtCur)) {
        if(!b.isFirstInsertion) {
          b.ex_doDump(b_t);
        } else {
          b.isFirstInsertion = false;
          if(!b.block.ex_shouldAlwaysDump(b_t.block)) {
            b.ex_doInsert(b_t);
          };
        };
        if(b.moveItmAmtCur <= 0) {
          b.ex_moveBack();
        };
      };
    } else {
      b.ex_doFloorInsert();
    };
  };


  function comp_ex_doPick(b, b_f) {
    if(b_f.block instanceof ItemSource) {
      if(b_f.outputItem == null) return;
      b.moveItmCur = b_f.outputItem;
      if(b.moveTarget == null || b.ex_canInsertItm(b.moveTarget, b.moveItmCur, b.blk$moveStackAmt)) {
        b.moveItmAmtCur = b.blk$moveStackAmt;
        b.ex_moveForward();
      };
    } else {
      b.moveItmCur = b.ex_getMoveItmTarget(b_f);
      if(b.moveItmCur != null && b.ex_canPickItm(b_f, b.moveItmCur, b.ctTarget == null ? 1 : b.blk$moveStackAmt) && (b.moveTarget == null || b.ex_canInsertItm(b.moveTarget, b.moveItmCur, b.blk$moveStackAmt))) {
        let amtTrans;
        if(b_f.getPayload() instanceof BuildPayload) {
          amtTrans = Math.min(b_f.getPayload().build.items.get(b.moveItmCur), b.blk$moveStackAmt);
          b_f.getPayload().build.removeStack(b.moveItmCur, amtTrans);
        } else {
          amtTrans = Math.min(b_f.items.get(b.moveItmCur), b.blk$moveStackAmt);
          b_f.removeStack(b.moveItmCur, amtTrans);
        };
        b.moveItmAmtCur = amtTrans;
        b.ex_moveForward();
      };
    };
  };


  function comp_ex_doFloorPick(b) {
    if(TIMER.secHalf) {
      let unit = LCEntity.getUnit((b.ex_calcMoveIntCoord(false, false) + 0.5) * Vars.tilesize, (b.ex_calcMoveIntCoord(false, true) + 0.5) * Vars.tilesize);
      if(unit != null && unit.isGrounded() && unit.stack.amount > 0) {
        b.playingWithUnit = false;
        b.ex_doUnitPick(unit);
      } else if(unit != null && unit.isGrounded() && LCProp.getHitSize(unit) <= 8.0) {
        b.playingWithUnit = true;
      } else {
        b.playingWithUnit = false;
        let loot = LCEntity.getLoot((b.ex_calcMoveIntCoord(false, false) + 0.5) * Vars.tilesize, (b.ex_calcMoveIntCoord(false, true) + 0.5) * Vars.tilesize);
        if(loot != null && loot.stack.amount > 0) {
          b.ex_doLootPick(loot);
        };
      };
    };
  };


  function comp_ex_doUnitPick(b, unit) {
    b.moveItmCur = unit.item();
    if(b.moveTarget == null || b.ex_canInsertItm(b.moveTarget, b.moveItmCur, b.blk$moveStackAmt)) {
      let amtTrans = Math.min(unit.stack.amount, b.blk$moveStackAmt);
      b.moveItmAmtCur = amtTrans;
      FRAG_item.setUnitItem(unit, unit.item(), unit.stack.amount - amtTrans);
      b.ex_moveForward();
    };
  };


  function comp_ex_doLootPick(b, loot) {
    b.moveItmCur = loot.item();
    if(b.moveTarget == null || b.ex_canInsertItm(b.moveTarget, b.moveItmCur, b.blk$moveStackAmt)) {
      let amtTrans = Math.min(loot.stack.amount, b.blk$moveStackAmt);
      b.moveItmAmtCur = amtTrans;
      FRAG_item.setUnitItem(loot, loot.item(), loot.stack.amount - amtTrans);
      loot.time = 0.0;
      b.ex_moveForward();
    };
  };


  function comp_ex_doInsert(b, b_t) {
    let amtTrans;
    if(b_t.getPayload() instanceof BuildPayload) {
      // Insert items into payload
      amtTrans = b_t.getPayload().build.acceptStack(b.moveItmCur, b.moveItmAmtCur, b);
      if(amtTrans > 0) {
        b_t.getPayload().build.handleStack(b.moveItmCur, amtTrans, b);
        b.moveItmAmtCur -= amtTrans;
      };
    } else {
      // Insert items into building
      amtTrans = b.block.ex_shouldCheckStack(b_t.block) ?
        b_t.acceptStack(b.moveItmCur, b.moveItmAmtCur, b) :
        b_t.items == null ?
          0 :
          Math.min(b_t.getMaximumAccepted(b.moveItmCur) - b_t.items.get(b.moveItmAmtCur), b.moveItmAmtCur);
      if(amtTrans > 0) {
        b_t.handleStack(b.moveItmCur, amtTrans, b);
        b.moveItmAmtCur -= amtTrans;
      };
    };
  };


  function comp_ex_doFloorInsert(b) {
    let unit = LCEntity.getUnit((b.ex_calcMoveIntCoord(true, false) + 0.5) * Vars.tilesize, (b.ex_calcMoveIntCoord(true, true) + 0.5) * Vars.tilesize);
    if(unit != null && unit.isGrounded() && unit.acceptsItem(b.moveItmCur)) {
      b.ex_doUnitInsert(unit);
    };
    if(b.moveItmAmtCur <= 0) {
      b.ex_moveBack();
    } else if(b.shouldDropLoot) {
      let loot = LCEntity.getLoot((b.ex_calcMoveIntCoord(true, false) + 0.5) * Vars.tilesize, (b.ex_calcMoveIntCoord(true, true) + 0.5) * Vars.tilesize);
      if(loot != null && loot.acceptsItem(b.moveItmCur)) {
        b.ex_doLootInsert(loot);
      };
      b.ex_doLootDump();
      b.ex_moveBack();
    };
  };


  function comp_ex_doUnitInsert(b, unit) {
    let amtTrans = Math.min(unit.maxAccepted(b.moveItmCur) - unit.stack.amount, b.moveItmAmtCur);
    if(amtTrans > 0) {
      FRAG_item.setUnitItem(unit, b.moveItmCur, unit.stack.amount + amtTrans);
      b.moveItmAmtCur -= amtTrans;
    };
  };


  function comp_ex_doLootInsert(b, loot) {
    let amtTrans = Math.min(loot.maxAccepted(b.moveItmCur) - loot.stack.amount, b.moveItmAmtCur);
    if(amtTrans > 0) {
      FRAG_item.setUnitItem(loot, b.moveItmCur, loot.stack.amount + amtTrans);
      loot.time = 0.0;
      b.moveItmAmtCur -= amtTrans;
    };
  };


  function comp_ex_doDump(b, b_t) {
    if(b_t.getPayload() instanceof BuildPayload) {
      // Dump items into payload
      if(b.moveItmAmtCur > 0 && b.timer.get(b.block.timerDump, b.block.dumpTime / b.timeScale)) {
        b_t.getPayload().build.handleItem(b, b.moveItmCur);
        b.moveItmAmtCur--;
      };
    } else {
      // Dump items into building
      if(b.moveItmAmtCur > 0 && (!(b_t.block instanceof Conveyor) || b_t.items.get(b.moveItmCur) < b_t.getMaximumAccepted(b.moveItmCur)) && b.timer.get(b.block.timerDump, b.block.dumpTime / b.timeScale)) {
        b_t.handleItem(b, b.moveItmCur);
        b.moveItmAmtCur--;
      };
    };
  };


  function comp_ex_doLootDump(b) {
    if(b.moveItmAmtCur > 0) {
      let itm = b.moveItmCur;
      let amt = b.moveItmAmtCur;
      Core.app.post(() => {
        let ang = b.drawrot() + b.moveAng;
        MDL_call.spawnLoot_server(b.x + b.block.delegee.itmDrawOff * Mathf.cosDeg(ang), b.y + b.block.delegee.itmDrawOff * Mathf.sinDeg(ang), itm, amt);
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
     * @class BLK_itemArm
     * @extends BLK_baseItemDistributor
     * @extends INTF_BLK_contentSelector
     */
    newClass().extendClass(PARENT[0], "BLK_itemArm").implement(INTF[0]).initClass()
    .setParent(Wall)
    .setTags()
    .setParam({


      /**
       * `PARAM`: Time required to rotate by 180°. Needs double time to send an item.
       * <br> `SINGLESIZE`
       * @memberof BLK_itemArm
       * @instance
       */
      moveTime: 60.0,
      /**
       * `PARAM`: Cooldown time after item insertion.
       * @memberof BLK_itemArm
       * @instance
       */
      pickCooldown: 0.0,
      /**
       * `PARAM`: Reach distance.
       * @memberof BLK_itemArm
       * @instance
       */
      moveR: 1,
      /**
       * `PARAM`: Amount of items in each stack.
       * @memberof BLK_itemArm
       * @instance
       */
      moveStackAmt: 5,
      /**
       * `PARAM`: How far item is drawn from the center.
       * @memberof BLK_itemArm
       * @instance
       */
      itmDrawOff: 8.0,
      /**
       * `PARAM`: Z-layer of arm region.
       * @memberof BLK_itemArm
       * @instance
       */
      armZ: 69.1,


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @memberof BLK_itemArm
       * @instance
       */
      armPlayAng: 0.0,
      /**
       * `INTERNAL`
       * @memberof BLK_itemArm
       * @instance
       */
      armReg: null,
      /**
       * `INTERNAL`
       * @memberof BLK_itemArm
       * @instance
       */
      itemReg: null,
      /**
       * `INTERNAL`
       * @override
       * @memberof BLK_itemArm
       * @instance
       */
      useConfigStr: true,


      /* <------------------------------ vanilla ------------------------------ */


      ignoreLineRotation: true,


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      load: function() {
        comp_load(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      /**
       * Whether insertion happens using stack methods.
       * @memberof BLK_itemArm
       * @instance
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
       * Whether batch insertion at once should be skipped.
       * @memberof BLK_itemArm
       * @instance
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
    newClass().extendClass(PARENT[1], "B_itemArm").implement(INTF[1]).initClass()
    .setParent(Wall.WallBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @memberof B_itemArm
       * @instance
       */
      shouldDropLoot: false,
      /**
       * `INTERNAL
       * @memberof B_itemArm
       * @instance
       */
      moveTarget: TmpStateTag.pending,
      /**
       * `INTERNAL`
       * @memberof B_itemArm
       * @instance
       */
      moveItmCur: null,
      /**
       * `INTERNAL`
       * @memberof B_itemArm
       * @instance
       */
      moveItmAmtCur: 0,
      /**
       * `INTERNAL`
       * @memberof B_itemArm
       * @instance
       */
      isBackMove: true,
      /**
       * `INTERNAL`
       * @memberof B_itemArm
       * @instance
       */
      isFirstInsertion: false,
      /**
       * `INTERNAL`
       * @memberof B_itemArm
       * @instance
       */
      moveProg: 0.0,
      /**
       * `INTERNAL`
       * @memberof B_itemArm
       * @instance
       */
      moveAng: 0.0,
      /**
       * `INTERNAL`
       * @memberof B_itemArm
       * @instance
       */
      pickCd: 0.0,
      /**
       * `INTERNAL`
       * @memberof B_itemArm
       * @instance
       */
      playingWithUnit: false,
      /**
       * `INTERNAL`
       * @memberof B_itemArm
       * @instance
       */
      playingWithCrank: false,
      /**
       * `INTERNAL`
       * @memberof B_itemArm
       * @instance
       */
      blk$moveStackAmt: TmpStateTag.needReplace,
      /**
       * `INTERNAL`
       * @memberof B_itemArm
       * @instance
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
          ctTarget: this.ctTarget == null ? "null" : this.ctTarget.name,
          shouldDropLoot: this.shouldDropLoot,
          stackThreshold: this.blk$moveStackAmt,
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
      }
      .setProp({
        noSuper: true,
      }),


      drawSelect: function() {
        comp_drawSelect(this);
      },


      status: function() {
        return this.pickCd > 0.0 ?
          BlockStatus.inactive :
          this.super$status();
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      write: function(wr) {
        this.ex_processData(wr);

        MDL_io.ct(wr, this.moveItmCur);
        wr.i(this.moveItmAmtCur);
        wr.bool(this.isBackMove);
        wr.f(this.moveProg);
        wr.bool(this.shouldDropLoot);
        wr.i(this.blk$moveStackAmt);
      },


      read: function(rd, revi) {
        this.ex_processData(rd);

        this.moveItmCur = MDL_io.ct(rd);
        this.moveItmAmtCur = rd.i();
        this.isBackMove = rd.bool();
        this.moveProg = rd.f();
        if(this.LCReviSub >= 1) {
          this.shouldDropLoot = rd.bool();
          this.blk$moveStackAmt = rd.i();
        };
      },


      /**
       * @memberof B_itemArm
       * @instance
       * @return {void}
       */
      ex_moveForward: function() {
        if(this.moveItmCur != null && this.moveItmAmtCur > 0) {
          this.isBackMove = false;
          this.isFirstInsertion = true;
        };
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof B_itemArm
       * @instance
       * @return {void}
       */
      ex_moveBack: function() {
        this.isBackMove = true;
        this.moveItmCur = null;
        this.moveItmAmtCur = 0;
        this.pickCd = this.block.delegee.pickCooldown;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof B_itemArm
       * @instance
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
       * @param {Unit} loot
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
       * @param {Unit} loot
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
       * @return {void}
       */
      ex_doLootDump: function() {
        comp_ex_doLootDump(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @override
       * @memberof B_itemArm
       * @instance
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
       * @param {Building} b_f
       * @param {Item} itm
       * @param {number} amt
       * @return {boolean}
       */
      ex_canPickItm: function(b_f, itm, amt) {
        if(b_f.block instanceof ItemSource) return true;
        if(b_f.getPayload() instanceof BuildPayload) {
          let ob = b_f.getPayload().build;
          if(ob.items != null && ob.items.get(itm) >= amt) return true;
        };

        return !MDL_cond.isDuct(b_f.block)
          && b_f.items != null && b_f.items.get(itm) >= amt;
      }
      .setProp({
        noSuper: true,
        argLen: 3,
      }),


      /**
       * Whether it's possible to insert items into a building now.
       * @memberof B_itemArm
       * @instance
       * @param {Building} b_t
       * @param {Item} itm
       * @param {number} amt
       * @return {boolean}
       */
      ex_canInsertItm: function(b_t, itm, amt) {
        if(b_t.getPayload() instanceof BuildPayload) {
          let ob = b_t.getPayload().build;
          if(ob.items != null && MDL_cond.isContainer(ob.block) && ob.acceptStack(itm, amt, b_t) >= amt) return true;
        };

        return !MDL_cond.isDuct(b_t.block)
          && (!this.block.ex_shouldCheckStack(b_t.block) ? b_t.acceptItem(this, itm) : b_t.acceptStack(itm, amt, b_t) >= 1);
      }
      .setProp({
        noSuper: true,
        argLen: 3,
      }),


      /**
       * Gets tile for a pick/insertion target position.
       * @memberof B_itemArm
       * @instance
       * @param {boolean} isTo
       * @return {Tile|null}
       */
      ex_findMoveT: function(isTo) {
        return Vars.world.tile(this.ex_calcMoveIntCoord(isTo, false), this.ex_calcMoveIntCoord(isTo, true));
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * Gets building on a pick/insertion target position.
       * @memberof B_itemArm
       * @instance
       * @param {boolean} isTo
       * @return {Building|null}
       */
      ex_findMoveB: function(isTo) {
        let ob = Vars.world.build(this.ex_calcMoveIntCoord(isTo, false), this.ex_calcMoveIntCoord(isTo, true));
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
       * @param {Building} b_f
       * @return {Item|null}
       */
      ex_getMoveItmTarget: function(b_f) {
        return this.ctTarget != null ?
          this.ctTarget :
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
       * @return {number}
       */
      ex_getMoveProdInc: function() {
        // Real time required is slightly shorter to match displayed speed
        return this.edelta() / Math.max(this.block.delegee.moveTime - 7.5, 0.0001);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof B_itemArm
       * @instance
       * @return {number}
       */
      ex_getReloadFrac: function() {
        return this.block.delegee.pickCooldown < 0.0001 ?
          1.0 :
          Mathf.clamp(1.0 - this.pickCd / this.block.delegee.pickCooldown);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @override
       * @memberof B_itemArm
       * @instance
       * @return {void}
       */
      ex_handleConfigStrDef: function(str) {
        let ct = MDL_content.getCt(str, null, true);
        if(!this.block.delegee.selectionQueue.includes(ct)) return;
        this.ctTarget = ct;
        this.ex_onSelectorUpdate();
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @override
       * @memberof B_itemArm
       * @instance
       * @return {number}
       */
      ex_subRevi: function() {
        return 1;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
