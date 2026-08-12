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
    blk.rotate = true;
    blk.drawArrow = false;
    blk.drawDisabled = true;
    blk.drawDynamic = true;
    blk.drawCached = false;
  };


  function comp_load(blk) {
    blk.armReg = fetchRegion(blk, "-arm");
    blk.itemReg = fetchRegion(blk, "-item");
  };


  function comp_setStats(blk) {
    blk.stats.add(Stat.itemsMoved, blk.moveStackAmt * 60.0 / blk.moveTime / 2.0, StatUnit.itemsSecond);
  };


  function comp_onProximityUpdate(b) {
    b.moveTg = TmpStateTag.pending;
  };


  function comp_updateTile(b) {
    if(TIMER.secHalf) {
      b.moveTg = b.ex_findMoveB(true);
    };
    if(b.moveTg === TmpStateTag.pending) return;

    if(!b.isBackMove) {
      b.moveProg += b.ex_getMoveProdInc();
      if(b.moveProg >= 1.0) {
        b.moveProg = 1.0;
        let b_t = b.ex_findMoveB(true);
        if(b_t != null) {
          if(b.ex_canInsertItm(b_t, b.moveItmCur, b.moveItmAmtCur)) {
            if(b.isFirstInsertion) {
              b.isFirstInsertion = false;
              let amtTrans = b.block.ex_canForceInsert(b_t.block) ?
                b_t.acceptStack(b.moveItmCur, b.moveItmAmtCur, b) :
                Math.min(b_t.getMaximumAccepted(b.moveItmCur) - b_t.items.get(b.moveItmAmtCur), b.moveItmAmtCur);
              if(amtTrans > 0) {
                b_t.handleStack(b.moveItmCur, amtTrans, b);
                b.moveItmAmtCur -= amtTrans;
              };
            } else {
              if(b.moveItmAmtCur > 0 && b.timer.get(b.block.timerDump, b.block.dumpTime / b.timeScale)) {
                b_t.handleItem(b, b.moveItmCur);
                b.moveItmAmtCur--;
              };
            };
            if(b.moveItmAmtCur <= 0) {
              b.isBackMove = true;
              b.moveItmCur = null;
            };
          };
        } else {
          let itm = b.moveItmCur;
          let amt = b.moveItmAmtCur;
          Core.app.post(() => {
            let ang = b.drawrot() + b.moveAng;
            MDL_call.spawnLoot_server(b.x + b.block.delegee.itmDrawOff * Mathf.cosDeg(ang), b.y + b.block.delegee.itmDrawOff * Mathf.sinDeg(ang), itm, amt);
          });
          b.isBackMove = true;
          b.moveItmCur = null;
          b.moveItmAmtCur = 0;
        };
      };
    } else {
      b.moveProg -= b.ex_getMoveProdInc();
      if(b.moveProg <= 0.0) {
        b.moveProg = 0.0;
        let b_f = b.ex_findMoveB(false);
        if(b_f != null) {
          b.moveItmCur = b.ex_getMoveItmTg(b_f);
          if(b.moveItmCur != null && b.ex_canPickItm(b_f, b.moveItmCur, b.ctTg == null ? 1 : b.blk$moveStackAmt) && (b.moveTg == null || b.ex_canInsertItm(b.moveTg, b.moveItmCur, b.blk$moveStackAmt))) {
            let amtTrans = Math.min(b_f.items.get(b.moveItmCur), b.blk$moveStackAmt);
            b.isBackMove = false;
            b.isFirstInsertion = true;
            b.moveItmAmtCur = amtTrans;
            b_f.removeStack(b.moveItmCur, b.moveItmAmtCur);
          };
        };
      };
    };

    b.moveAng = b.moveProg * 180.0 * Mathf.sign(b.rotation <= 1);
  };


  function comp_draw(b) {
    let ang = b.drawrot() + b.moveAng;

    Draw.rect(b.block.region, b.x, b.y);
    processZ(Layer.groundUnit - 0.1);
    Draw.rect(b.block.delegee.armReg, b.x, b.y, ang);
    if(b.ctTg instanceof Item && b.block.delegee.itemReg.found()) {
      Draw.color(b.ctTg.color);
      Draw.rect(b.block.delegee.itemReg, b.x, b.y, ang);
      Draw.color();
    };
    if(b.moveItmCur != null && b.moveItmAmtCur > 0) {
      LCDraw.content(b.x + b.block.delegee.itmDrawOff * Mathf.cosDeg(ang), b.y + b.block.delegee.itmDrawOff * Mathf.sinDeg(ang), b.moveItmCur, 0.6, b.moveAng);
    };
    processZ(-1.0);
  };


  function comp_drawSelect(b) {
    b.ex_drawSelected();
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Inserter from Factorio.
     * @class BLK_itemArm
     * @extends BLK_baseItemDistributor
     */
    newClass().extendClass(PARENT[0], "BLK_itemArm").implement(INTF[0]).initClass()
    .setParent(Wall)
    .setTags()
    .setParam({


      /**
       * `PARAM`: Time required to rotate by 180°. Needs double time to send an item.
       * @memberof BLK_itemArm
       * @instance
       */
      moveTime: 60.0,
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


      /* <------------------------------ internal ------------------------------ */


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
       * Whether insertion can happen regardless of relative rotation.
       * @memberof BLK_itemArm
       * @instance
       * @param {Block} oblk
       * @return {boolean}
       */
      ex_canForceInsert: function(oblk) {
        return MDL_cond._isConveyor(oblk)
          || MDL_cond._isBridge(oblk)
      }
      .setCache()
      .setProp({
        noSuper: true,
        argLen: 1,
      })


    }),


    /**
     * @class B_itemArm
     * @extends B_baseItemDistributor
     */
    newClass().extendClass(PARENT[1], "B_itemArm").implement(INTF[1]).initClass()
    .setParent(Wall.WallBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL
       * @memberof B_itemArm
       * @instance
       */
      moveTg: TmpStateTag.pending,
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
      blk$moveStackAmt: TmpStateTag.needReplace,


    })
    .setMethod({


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      draw: function() {
        comp_draw(this);
      }
      .setProp({
        noSuper: true,
      }),


      drawSelect: function() {
        comp_drawSelect(this);
      },


      write: function(wr) {
        this.ex_processData(wr);

        MDL_io.ct(wr, this.moveItmCur);
        wr.i(this.moveItmAmtCur);
        wr.bool(this.isBackMove);
        wr.f(this.moveProg);
      },


      read: function(rd, revi) {
        this.ex_processData(rd);

        this.moveItmCur = MDL_io.ct(rd);
        this.moveItmAmtCur = rd.i();
        this.isBackMove = rd.bool();
        this.moveProg = rd.f();
      },


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
        return !MDL_cond._isDuct(b_f.block)
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
        return !MDL_cond._isDuct(b_t.block)
          && (this.block.ex_canForceInsert(b_t.block) ? b_t.acceptStack(itm, amt, b_t) > 0 : b_t.acceptItem(this, itm));
      }
      .setProp({
        noSuper: true,
        argLen: 3,
      }),


      /**
       * Gets building on a pick/insertion target position.
       * @memberof B_itemArm
       * @instance
       * @param {boolean} isTo
       * @return {Building|null}
       */
      ex_findMoveB: function(isTo) {
        return Vars.world.build(
          this.rotation % 2 !== 0 ? this.tileX() : (this.tileX() + this.block.delegee.moveR * Mathf.sign(this.rotation >= 2) * (isTo ? 1 : -1)),
          this.rotation % 2 === 0 ? this.tileY() : (this.tileY() + this.block.delegee.moveR * Mathf.sign(this.rotation >= 2) * (isTo ? 1 : -1)),
        );
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * Gets target item to pick.
       * @memberof B_itemArm
       * @instance
       * @param {Building} b_f
       * @return {Item|null}
       */
      ex_getMoveItmTg: function(b_f) {
        return this.ctTg != null ?
          this.ctTg :
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
        return this.edelta() / this.block.delegee.moveTime;
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
