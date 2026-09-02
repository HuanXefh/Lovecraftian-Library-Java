/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseMiner");
  const INTF = require("lovec/temp/intf/INTF_BLK_terrainHandler");
  const INTF_A = require("lovec/temp/intf/INTF_BLK_sameBlockRestrictionHandler");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.cropData == null) ERROR_HANDLER.throw("nullArgument", "cropData");

    blk.group = BlockGroup.none;
    blk.update = true;
    blk.configurable = true;
    blk.enableDrawStatus = false;
    blk.drawDynamic = true;
    blk.drawCached = false;

    blk.config(JAVA.string, (b, str) => {
      if(str === "SPEC: harvest") {
        b.ex_harvest();
        TRIGGER.cropHarvest.fire(b, b.delegee.stageItm);
      };
    });

    blk.cropParent = MDL_content.getCt(blk.cropParent, "rs");
    if(blk.cropParent != null) {
      if(!Vars.headless) {
        MDL_event.onLoad(() => {
          blk.uiIcon = blk.cropParent.uiIcon
          blk.fullIcon = blk.cropParent.fullIcon
        });
      };
      MDL_content.rename(blk, () => blk.cropParent.localizedName);
    };

    blk.ex_setupCropData();

    MDL_event.onLoadPost(() => {
      let i = 0;
      let iCap = blk.cropData.iCap();
      let itm, amt, p;
      while(i < iCap) {
        itm = blk.cropData[i].itm;
        amt = blk.cropData[i].amt;
        p = blk.cropData[i].p;
        if(itm != null && amt * p > 0.0) {
          MDL_recipeDict.addItmProdTerm(blk, itm, amt, p, {time: blk.ex_calcStageTotalTime(i) - blk.ex_calcStageTotalTime(blk.cropData[i].stageTo)});
        };
        i++;
      };
    });

    MOD_tmi.regisRc_crop(blk);
  };


  function comp_load(blk) {
    let iCap = blk.cropData.iCap();
    blk.cropRegs = fetchRegions(blk, "", iCap);
    blk.cropShaRegs = fetchRegions(blk, "-shadow", iCap);
  };


  function comp_setStats(blk) {
    blk.stats.add(fetchStat("lovec", "blk0min-cropstage"), newStatValue(tb => {
      tb.row();
      tb.table(Styles.none, tb1 => {
        let matArr = [[
          MDL_bundle.getTerm("lovec", "growth-stage"),
          MDL_bundle.getTerm("lovec", "time-required"),
          MDL_bundle.getTerm("lovec", "resource"),
        ]];
        let i = 0;
        let iCap = blk.cropData.iCap();
        while(i < iCap) {
          let stage = i;
          matArr.push([
            stage,
            blk.cropData[stage].dur < 0.0001 ? "-" : blk.cropData[stage].dur.time(2),
            tb2 => {
              tb2.center();
              let cell = MDL_table.rcCtIcon(tb2, blk.cropData[stage].itm, blk.cropData[stage].amt, blk.cropData[stage].p);
              if(cell != null) {
                cell.marginRight(0.0);
              };
            },
          ]);
          i++;
        };
        MDL_table.setTable(tb1, matArr);
      })
      .left()
      .padLeft(28.0);
    }));
    blk.stats.add(fetchStat("lovec", "blk0min-croptotaltime"), blk.growTotalTime.time(2));
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-grow-prog", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-grow-prog-amt", Strings.fixed(b.delegee.stageCur, 0) + " (" + b.delegee.growFrac.perc(0) + ")")),
      prov(() => Pal.ammo),
      () => Mathf.clamp(b.delegee.growFrac, 0.0, 1.0),
    ));
  };


  function comp_ex_setupCropData(blk) {
    let i = 0;
    let iCap = blk.cropData.iCap();
    let obj;
    while(i < iCap) {
      obj = blk.cropData[i];
      processNullParam(
        obj,
        "amt", 1,
        "p", 1.0,
        "stageTo", 0,
        "rad", 0.0,
        "canHide", false,
        "static", false,
        "scl", 1.0,
        "mag", 1.0,
        "wob", 1.0,
        "z", VAR.layer.cropLow,
        "offSha", -4.0,
        "drawF", function(b) {b.block.ex_drawCropDef(b)},
      );
      if(obj.dur == null) ERROR_HANDLER.throw("nullArgument", "cropData.dur");
      blk.growTotalTime += obj.dur;
      obj.itm = MDL_content.getCt(obj.itm, "rs");
      i++;
    };
  };


  function comp_onDestroyed(b) {
    if(b.stageDestroyScr != null) {
      b.stageDestroyScr(b);
    };
  };


  function comp_onProximityUpdate(b) {
    b.growEffc = b.block.ex_calcGrowEffc(b.tileX(), b.tileY());
    b.ex_onStageUpdate();
  };


  function comp_updateTile(b) {
    if(TIMER.secQuarter) {
      b.growFrac = b.growTime / b.block.delegee.growTotalTime;
    };
    if(!b.isFinalStage) {
      b.growTime += b.efficiency * Time.delta;
    };
    if(b.nextStageTime >= 0.0 && b.growTime >= b.nextStageTime) {
      b.ex_changeStage(b.stageCur + 1, false);
    };
    if(b.stageUpdateScr != null) {
      b.stageUpdateScr(b);
    };
  };


  function comp_updateEfficiencyMultiplier(b) {
    b.efficiency *= b.growEffc;
  };


  function comp_configTapped(b) {
    if(b.ex_checkCanHarvest()) {
      b.configure("SPEC: harvest");
    } else {
      MDL_ui.showFadeInfo("lovec", "crop-harvest-fail");
    };
    return false;
  };


  function comp_ex_changeStage(b, stageTo, resetTime) {
    if(stageTo < 0 || stageTo >= b.block.delegee.cropData.iCap()) return;

    b.stageCur = stageTo;
    if(resetTime) {
      b.growTime = b.block.ex_calcStageTotalTime(b.stageCur);
    };
    b.ex_onStageUpdate();
  };


  function comp_ex_onStageUpdate(b) {
    b.isFinalStage = Mathf.equal(b.stageCur, b.block.delegee.cropData.iCap() - 1);
    b.nextStageTime = b.isFinalStage ?
      -1.0 :
      b.block.ex_calcStageTotalTime(b.stageCur + 1);

    b.stageItm = b.block.delegee.cropData[b.stageCur].itm;
    b.stageItmAmt = b.block.delegee.cropData[b.stageCur].amt;
    b.stageItmP = b.block.delegee.cropData[b.stageCur].p;
    b.stageBackTo = b.block.delegee.cropData[b.stageCur].stageTo;
    b.stageReg = b.block.delegee.cropRegs[b.stageCur];
    b.stageShaReg = b.block.delegee.cropShaRegs[b.stageCur];
    b.stageCropRad = b.block.delegee.cropData[b.stageCur].rad;
    b.stageCanHide = b.block.delegee.cropData[b.stageCur].canHide;
    b.stageStatic = b.block.delegee.cropData[b.stageCur].static;
    b.stageCropScl = b.block.delegee.cropData[b.stageCur].scl;
    b.stageCropMag = b.block.delegee.cropData[b.stageCur].mag;
    b.stageCropWob = b.block.delegee.cropData[b.stageCur].wob;
    b.stageCropZ = b.block.delegee.cropData[b.stageCur].z;
    b.stageOffSha = b.block.delegee.cropData[b.stageCur].offSha;
    b.stageDrawF = b.block.delegee.cropData[b.stageCur].drawF;
    b.stageUpdateScr = b.block.delegee.cropData[b.stageCur].updateScr;
    b.stageHarvestScr = b.block.delegee.cropData[b.stageCur].harvestScr;
    b.stageDestroyScr = b.block.delegee.cropData[b.stageCur].destroyScr;
  };


  function comp_ex_harvest(b) {
    MDL_call.spawnLoots_server(b.x, b.y, b.stageItm, b.stageItmAmt.randFreq(b.stageItmP), VAR.range.cropLootRad);
    b.ex_changeStage(b.stageBackTo, true);
    MDL_effect.showAt(b.x, b.y, b.block.destroyEffect, 0.0);
    MDL_sound.playAt(b.x, b.y, b.block.destroySound);
    if(b.stageHarvestScr != null) {
      b.stageHarvestScr(b);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * A block that grows and can be harvested for items.
     * <br> `NAMEGEN`
     * @class BLK_crop
     * @extends BLK_baseMiner
     * @extends INTF_BLK_terrainHandler
     * @extends INTF_BLK_sameBlockRestrictionHandler
     */
    newClass().extendClass(PARENT[0], "BLK_crop").implement(INTF[0]).implement(INTF_A[0]).initClass()
    .setParent(Wall)
    .setTags("blk-crop")
    .setParam({


      /**
      * `PARAM`: The main item that this crop produces. Used for icon and name generation.
      * @memberof BLK_crop
      * @instance
      */
      cropParent: null,
      /**
       * `PARAM`: Crop stage data as an array.
       * @type {Array<CropData>|null}
       * @memberof BLK_crop
       * @instance
       */
      cropData: null,
      /**
       * `PARAM`
       * @override
       * @memberof BLK_crop
       * @instance
       */
      placeRestrictR: 1,


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @memberof BLK_crop
       * @instance
       */
      growTotalTime: 0.0,
      /**
       * `INTERNAL`
       * @memberof BLK_crop
       * @instance
       */
      cropRegs: null,
      /**
       * `INTERNAL`
       * @memberof BLK_crop
       * @instance
       */
      cropShaRegs: null,


      /* <------------------------------ vanilla ------------------------------ */


      solid: false,
      underBullets: true,
      hasShadow: false,
      destroyEffect: EFF.crackPlant,
      placeSound: fetchSound("se-step-grass"),
      breakSound: fetchSound("se-step-grass"),
      destroySound: fetchSound("se-step-grass"),


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


      setBars: function() {
        comp_setBars(this);
      },


      icons: function thisFun() {
        let reg = this.cropRegs.last();
        return reg != null && reg.found() ?
          [reg] :
          thisFun.funPrev.call(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @memberof BLK_crop
       * @instance
       * @return {void}
       */
      ex_setupCropData: function() {
        comp_ex_setupCropData(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Calculates growth efficiency at some tile.
       * @memberof BLK_crop
       * @instance
       * @param {number} tx
       * @param {number} ty
       * @return {number}
       */
      ex_calcGrowEffc: function thisFun(tx, ty) {
        if(LCNativeArray.checkTupChange(thisFun.tmpTup, tx, ty)) {
          thisFun.tmpVal = MDL_attr.calcSumRect(Vars.world.tile(tx, ty), this.placeRestrictR, this.size, TP_attr.attr0env_growth, AttrModes.FLOOR | AttrModes.OVERLAY) / Mathf.pow(this.size + this.placeRestrictR * 2, 2);
        };

        return thisFun.tmpVal;
      }
      .setProp({
        noSuper: true,
        tmpTup: [],
        tmpVal: 1.0,
      }),


      /**
       * Calculates time required to reach a stage.
       * @memberof BLK_crop
       * @instance
       * @param {number} stage
       * @return {number}
       */
      ex_calcStageTotalTime: function(stage) {
        let i = 0;
        let iCap = this.cropData.iCap();
        let time = 0.0;
        while(i < iCap && i < stage) {
          time += this.cropData[i].dur;
          i++;
        };

        return time;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof BLK_crop
       * @instance
       * @param {Building} b
       * @return {void}
       */
      ex_drawCropDef: function(b) {
        LCDrawf.tree(
          b.delegee.stageReg, b.delegee.stageShaReg,
          b.tile, b.delegee.stageCropRad, b.delegee.stageOffSha,
          b.delegee.stageCropScl, b.delegee.stageCropMag, b.delegee.stageCropWob,
          PARAM.TREE_ALPHA, b.delegee.stageCropZ,
          PARAM.SHOULD_DRAW_WOBBLE && !b.delegee.stageStatic, PARAM.SHOULD_CHECK_TREE_DISTANCE,
        );
      }
      .setProp({
        noSuper: true,
      }),


    }),


    /**
     * @class B_crop
     * @extends B_baseMiner
     * @extends INTF_B_terrainHandler
     * @extends INTF_B_sameBlockRestrictionHandler
     */
    newClass().extendClass(PARENT[1], "B_crop").implement(INTF[1]).implement(INTF_A[1]).initClass()
    .setParent(Wall.WallBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      growEffc: 1.0,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      growTime: 0.0,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      growFrac: 0.0,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      nextStageTime: -1.0,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      stageCur: 0,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      isFinalStage: false,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      stageItm: null,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      stageItmAmt: 1,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      stageItmP: 1.0,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      stageBackTo: 0,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      stageReg: null,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      stageShaReg: null,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      stageCropRad: 0.0,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      stageCanHide: false,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      stageStatic: false,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      stageCropScl: 1.0,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      stageCropMag: 1.0,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      stageCropWob: 1.0,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      stageCropZ: 60.0,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      stageOffSha: 0.0,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      stageDrawF: null,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      stageUpdateScr: null,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      stageHarvestScr: null,
      /**
       * `INTERNAL`
       * @memberof B_crop
       * @instance
       */
      stageDestroyScr: null,


    })
    .setMethod({


      onDestroyed: function() {
        comp_onDestroyed(this);
      },


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      updateEfficiencyMultiplier: function() {
        comp_updateEfficiencyMultiplier(this);
      },


      configTapped: function() {
        return comp_configTapped(this);
      }
      .setProp({
        noSuper: true,
      }),


      draw: function() {
        if(this.stageDrawF != null) {
          this.stageDrawF(this);
        } else {
          this.block.ex_drawCropDef(this);
        };
      }
      .setProp({
        noSuper: true,
      }),


      write: function(wr) {
        wr.i(this.stageCur);
        wr.f(this.growTime);
      },


      read: function(rd, revi) {
        this.stageCur = rd.i();
        this.growTime = rd.f();
      },


      /**
       * @memberof B_crop
       * @instance
       * @param {number} stageTo
       * @param {boolean} resetTime
       * @return {void}
       */
      ex_changeStage: function(stageTo, resetTime) {
        comp_ex_changeStage(this, stageTo, resetTime);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof B_crop
       * @instance
       * @return {void}
       */
      ex_onStageUpdate: function() {
        comp_ex_onStageUpdate(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof B_crop
       * @instance
       * @return {boolean}
       */
      ex_checkCanHarvest: function() {
        return this.stageItm != null && this.stageItmAmt * this.stageItmAmt > 0.0;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof B_crop
       * @instance
       * @return {void}
       */
      ex_harvest: function() {
        comp_ex_harvest(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
