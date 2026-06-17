/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_wallDrill");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.drawArrow = false;

    if(blk.size % 2 !== blk.range % 2) {
      blk.range = blk.range + 1;
    };

    MOD_tmi._r_rangeWallDrill(blk);
  };


  function comp_load(blk) {
    blk.topGlowReg = fetchRegion(blk, "-top-glow");
  };


  function comp_setBars(blk) {
    blk.addBar("drillspeed", b => new Bar(
      prov(() => Core.bundle.format("bar.drillspeed", Strings.fixed(b.lastDrillSpeed * 60.0, 2))),
      prov(() => Pal.ammo),
      () => Mathf.clamp(b.time / blk.ex_calcDrillTime(b.delegee.mineRsTup[0], b.delegee.totalOreAmt)),
    ));
  };


  const comp_canPlaceOn = function thisFun(blk, t, team, rot) {
    if(t == null) return false;
    if(checkTupChange(thisFun.tmpTup, true, blk, t, team, rot)) {
      blk.ex_updateMineMap(blk.tmpMineMap, blk.tmpMineRsTup, blk.tmpOreTs, t.x, t.y, rot);
    };

    return blk.tmpMineRsTup[0] != null;
  }
  .setProp({
    tmpTup: [],
  });


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    MDL_draw._d_rectPlaceRot(blk, tx, ty, blk.range * 0.5, rot, valid, true);
    if(Vars.world.tile(tx, ty) == null || blk.tmpMineRsTup[0] == null) return;
    blk.ex_drawDrillText(tx, ty, valid, 60.0 / blk.ex_calcDrillTime(blk.tmpMineRsTup[0], Math.pow(blk.range, 2)) * blk.tmpTotalOreAmt, blk.tmpMineRsTup[1].length > 1 ? null : blk.ex_findPlaceRsIcon(tx, ty, blk.tmpMineRsTup[0]));
  };


  function comp_ex_updateMineMap(blk, contMap, contTup, contArr, tx, ty, rot) {
    contMap.clear();
    contTup[0] = null;
    contTup[1].clear();
    blk.tmpTotalOreAmt = 0;
    let itm = null, amt = 0, tmpAmt = 0;
    blk.ex_findOreTs(contArr, tx, ty, rot).forEachFast(ot => {
      itm = blk.mineMode === "wall" ?
        ot.wallDrop() :
        blk.mineMode === "floor" ?
          ot.drop() :
          tryVal(ot.wallDrop(), ot.drop());
      if(itm == null) return;
      amt = contMap.get(itm, 0) + 1;
      blk.tmpTotalOreAmt++;
      contMap.put(itm, amt);
      if(amt > tmpAmt) {
        tmpAmt = amt;
        contTup[0] = itm;
        contTup[1].pushUnique(itm);
      };
    });
  };


  function comp_ex_findOreTs(blk, contArr, tx, ty, rot) {
    let itm, oblk;
    return MDL_pos._tsRectRot(contArr, Vars.world.tile(tx, ty), blk.range * 0.5, rot, blk.size).inSituFilter(ot => {
      itm = null;
      oblk = Blocks.air;
      if(blk.mineMode === "wall" || blk.mineMode === "any") {
        itm = ot.wallDrop();
        oblk = ot.overlay().wallOre ? ot.overlay() : ot.block();
      } else if(blk.mineMode === "floor" || blk.mineMode === "any") {
        itm = ot.drop();
        oblk = ot.overlay().wallOre ? ot.floor() : ot.overlay();
        if(oblk.itemDrop !== itm) {
          oblk = ot.floor();
        };
      };
      return itm != null && oblk.itemDrop === itm && blk.ex_canMine(oblk, itm, 1.0);
    });
  };


  function comp_created(b) {
    b.beamOffTime = Mathf.random(60000.0);
  };


  function comp_onProximityUpdate(b) {
    b.block.ex_updateMineMap(b.mineMap, b.mineRsTup, b.oreTs, b.tileX(), b.tileY(), b.rotation);
    b.totalOreAmt = b.block.delegee.tmpTotalOreAmt;
    b.mineRsTgs.cpy(b.mineRsTup[1]);

    let vec2 = MDL_pos._coordsRectRotCenter(b.x, b.y, b.block.range * 0.5, b.rotation, b.block.size);
    b.mineRectCx = vec2.x;
    b.mineRectCy = vec2.y;
  };


  function comp_updateTile(b) {
    b.warmup = Mathf.approachDelta(b.warmup, Mathf.num(b.efficiency > 0.0), 0.01666667);

    if(b.mineRsTup[0] != null) {
      let mtp = Mathf.lerp(1.0, b.block.optionalBoostIntensity, b.optionalEfficiency);
      let drillTime = b.block.ex_calcDrillTime(b.mineRsTup[0], b.totalOreAmt);
      b.boostWarmup = Mathf.lerpDelta(b.boostWarmup, b.optionalEfficiency, 0.1);
      b.lastDrillSpeed = Math.pow(b.block.range, 2) * mtp * b.timeScale / drillTime * b.efficiency;
      b.time += b.edelta() * mtp;

      if(b.time >= drillTime) {
        b.mineMap.each((itm, amt) => {
          FRAG_item.offload(b, b, itm, Math.pow(b.block.range, 2) * amt / b.totalOreAmt);
        });
        b.time %= drillTime;
        b.ex_onCraft();
      };
    };

    if(b.timer.get(b.block.timerDump, b.block.dumpTime / b.timeScale)) {
      b.dump();
    };
  };


  function comp_draw(b) {
    Draw.rect(b.block.region, b.x, b.y);
    Draw.rect(b.block.topRegion, b.x, b.y, b.rotdeg());

    if(b.isPayload()) return;

    let color = Tmp.c1.set(b.block.heatColor).lerp(b.block.boostHeatColor, b.boostWarmup);
    let glowA = b.warmup * (b.block.heatColor.a * (1.0 - b.block.heatPulse + Mathf.absin(b.block.heatPulseScl, b.block.heatPulse)));

    if(b.block.glowRegion.found()) {
      processZ(Layer.blockAdditive);
      Draw.blend(Blending.additive);
      Draw.color(color, glowA);
      Draw.rect(b.block.glowRegion, b.x, b.y, b.rotdeg());
      Draw.blend();
      processZ();
    };
    if(b.block.delegee.topGlowReg.found()) {
      processZ(VAR.layer.mineBeam + 0.2);
      Draw.blend(Blending.additive);
      Draw.color(color, glowA);
      Draw.rect(b.block.delegee.topGlowReg, b.x, b.y);
      Draw.blend();
      processZ();
    };
    if(b.warmup > 0.0) {
      MDL_draw._d_laserRandMine(b.x, b.y, b.mineRectCx, b.mineRectCy, b.block.range * 0.5 * Vars.tilesize, b.beamOffTime, 0, 1.0, color, Color.white, b.warmup * 0.6, true);
      MDL_draw._d_laserRandMine(b.x, b.y, b.mineRectCx, b.mineRectCy, b.block.range * 0.5 * Vars.tilesize, b.beamOffTime + 1800.0, 1, 1.0, color, Color.white, b.warmup * 0.6, true);
      MDL_draw._d_laserRandMine(b.x, b.y, b.mineRectCx, b.mineRectCy, b.block.range * 0.5 * Vars.tilesize, b.beamOffTime + 4200.0, -1, 1.0, color, Color.white, b.warmup * 0.6, true);
    };
  };


  function comp_drawSelect(b) {
    MDL_draw._d_rectSelectRot(b, b.block.range * 0.5, b.rotation, true, true);
    if(b.mineRsTup[0] == null) return;
    b.drawItemSelection(b.mineRsTup[0]);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * A wall drill that mines all blocks in the frontal rectangular range.
     * <br> <IMPORTANT>: `blk.range` is full width of the range, since that it must be an integer.
     * @class BLK_rangeWallDrill
     * @extends BLK_wallDrill
     */
    newClass().extendClass(PARENT[0], "BLK_rangeWallDrill").initClass()
    .setParent(BeamDrill)
    .setTags("blk-min", "blk-drl")
    .setParam({


      /**
       * <PARAM>: "wall" for blocks, "floor" for floors and overlay floors, "both" for any.
       * @memberof BLK_rangeWallDrill
       * @instance
       */
      mineMode: "wall",


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof BLK_rangeWallDrill
       * @instance
       */
      tmpOreTs: prov(() => []),
      /**
       * <INTERNAL>
       * @memberof BLK_rangeWallDrill
       * @instance
       */
      tmpMineMap: prov(() => new ObjectMap()),
      /**
       * <INTERNAL>
       * @memberof BLK_rangeWallDrill
       * @instance
       */
      tmpTotalOreAmt: 0,
      /**
       * <INTERNAL>
       * @memberof BLK_rangeWallDrill
       * @instance
       */
      tmpMineRsTup: prov(() => [null, []]),
      /**
       * <INTERNAL>
       * @memberof BLK_rangeWallDrill
       * @instance
       */
      topGlowReg: null,


    })
    .setParamAlias([
      "mineR", "range", 5,
    ])
    .setMethod({


      init: function() {
        comp_init(this);
      },


      load: function() {
        comp_load(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


      canPlaceOn: function thisFun(t, team, rot) {
        return comp_canPlaceOn(this, t, team, rot) && thisFun.funPrev.funPrev.apply(this, arguments);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      drawPlace: function thisFun(tx, ty, rot, valid) {
        comp_drawPlace(this, tx, ty, rot, valid);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * Updates information about mineable ores in range.
       * @memberof BLK_rangeWallDrill
       * @instance
       * @param {ObjectMap} contMap - Stores mineable ores and their amounts.
       * @param {Array} contTup - Stores found ores. <br> <TUP>: mainItm, foundItms.
       * @param {Array<Tile>} contArr - Stores tiles in range temporarily.
       * @param {number} tx
       * @param {number} ty
       * @param {number} rot
       * @return {void}
       */
      ex_updateMineMap: function(contMap, contTup, contArr, tx, ty, rot) {
        comp_ex_updateMineMap(this, contMap, contTup, contArr, tx, ty, rot);
      }
      .setProp({
        noSuper: true,
        argLen: 6,
      }),


      /**
       * @memberof BLK_rangeWallDrill
       * @instance
       * @param {Array<Tile>} contArr
       * @param {number} tx
       * @param {number} ty
       * @param {number} rot
       * @return {Array<Tile>}
       */
      ex_findOreTs: function(contArr, tx, ty, rot) {
        return comp_ex_findOreTs(this, contArr, tx, ty, rot);
      }
      .setProp({
        noSuper: true,
        argLen: 4,
      }),


      /**
       * @override
       * @memberof BLK_rangeWallDrill
       * @instance
       * @return {number}
       */
      ex_getRcDictOutputScl: function() {
        return Math.pow(this.range, 2) / this.size;
      }
      .setProp({
        noSuper: true,
        mergeMode: function(valPrev, val) {
          return valPrev * val;
        },
      }),


      /**
       * @memberof BLK_rangeWallDrill
       * @instance
       * @param {Item} itm
       * @param {number} totalAmt
       * @return {number}
       */
      ex_calcDrillTime: function(itm, totalAmt) {
        return this.getDrillTime(itm) / Math.max(totalAmt, 0.000001) * Math.pow(this.range, 2);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      })


    }),


    /**
     * @class B_rangeWallDrill
     * @extends B_wallDrill
     */
    newClass().extendClass(PARENT[1], "B_rangeWallDrill").initClass()
    .setParent(BeamDrill.BeamDrillBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_rangeWallDrill
       * @instance
       */
      oreTs: prov(() => []),
      /**
       * <INTERNAL>
       * @memberof B_rangeWallDrill
       * @instance
       */
      mineMap: prov(() => new ObjectMap()),
      /**
       * <INTERNAL>
       * @memberof B_rangeWallDrill
       * @instance
       */
      totalOreAmt: 0,
      /**
       * <INTERNAL>
       * @memberof B_rangeWallDrill
       * @instance
       */
      mineRsTup: prov(() => [null, []]),
      /**
       * <INTERNAL>
       * @memberof B_rangeWallDrill
       * @instance
       */
      mineRectCx: 0.0,
      /**
       * <INTERNAL>
       * @memberof B_rangeWallDrill
       * @instance
       */
      mineRectCy: 0.0,
      /**
       * <INTERNAL>
       * @memberof B_rangeWallDrill
       * @instance
       */
      beamOffTime: 0.0,


    })
    .setMethod({


      created: function() {
        comp_created(this);
      },


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      updateTile: function thisFun() {
        thisFun.funPrev.funPrev.call(this);
        comp_updateTile(this);
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
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
