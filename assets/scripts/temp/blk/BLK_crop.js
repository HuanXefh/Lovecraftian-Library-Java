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

    blk.enableDrawStatus = false;
    blk.drawDynamic = true;
    blk.drawCached = false;

    blk.ex_setupCropData();
  };


  function comp_load(blk) {
    let iCap = blk.cropData.iCap();
    blk.cropRegs = fetchRegions(blk, "", iCap);
    blk.cropShaRegs = fetchRegions(blk, "-shadow", iCap);
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
        "rad", 0.0,
        "canHide", false,
        "scl", 1.0,
        "mag", 1.0,
        "wob", 1.0,
        "z", VAR.layer.cropLow,
        "offSha", -4.0,
        "drawF", function(b) {b.block.ex_drawCropDef(b)},
      );
      obj.itm = MDL_content.getCt(obj.itm, "rs");
      i++;
    };
  };


  function comp_onProximityUpdate(b) {
    b.growEffc = b.block.ex_calcGrowEffc(b.tileX(), b.tileY());
    b.ex_onStageUpdate();
  };


  function comp_updateTile(b) {
    if(!b.isFinalStage) {
      b.growTime += b.efficiency * Time.delta;
    };
    if(b.nextStageTime >= 0.0 && b.growTime >= b.nextStageTime) {
      b.ex_changeStage(b.stageCur + 1);
    };
  };


  function comp_updateEfficiencyMultiplier(b) {
    b.efficiency *= b.growEffc;
  };


  function comp_ex_changeStage(b, stageTo) {
    if(stageTo < 0 || stageTo >= b.block.delegee.cropData.iCap()) return;

    b.stageCur = stageTo;
    b.isFinalStage = b.stageCur === b.block.delegee.cropData.iCap();
    b.ex_onStageUpdate();
  };


  function comp_ex_onStageUpdate(b) {
    b.nextStageTime = b.isFinalStage ?
      -1.0 :
      b.block.ex_calcStageTotalTime(b.stageCur + 1);

    b.stageItm = b.block.delegee.cropData[b.stageCur].itm;
    b.stageItmAmt = b.block.delegee.cropData[b.stageCur].amt;
    b.stageItmP = b.block.delegee.cropData[b.stageCur].p;
    b.stageReg = b.block.delegee.cropRegs[b.stageCur];
    b.stageShaReg = b.block.delegee.cropShaRegs[b.stageCur];
    b.stageCropRad = b.block.delegee.cropData[b.stageCur].rad;
    b.stageCropScl = b.block.delegee.cropData[b.stageCur].scl;
    b.stageCropMag = b.block.delegee.cropData[b.stageCur].mag;
    b.stageCropWob = b.block.delegee.cropData[b.stageCur].wob;
    b.stageCropZ = b.block.delegee.cropData[b.stageCur].z;
    b.stageOffSha = b.block.delegee.cropData[b.stageCur].offSha;
    b.stageDrawF = b.block.delegee.cropData[b.stageCur].drawF;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * A block that grows and can be harvested for items.
     * @todo Unfinished: in-game behavior test; progress bar; button to harvest; read & write; grow amd harvest scripts.
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
      placeRestrictR: 2,


      /* <------------------------------ internal ------------------------------ */


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


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      load: function() {
        comp_load(this);
      },


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
          thisFun.tmpVal = MDL_attr.calcSumRect(Vars.world.tile(tx, ty), this.placeRestrictR, this.size, TP_attr.attr0env_growth, AttrModes.FLOOR & AttrModes.OVERLAY) / Mathf.pow(this.size + this.placeRestrictR * 2, 2);
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
        while(i < iCap || i < stage) {
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
          b.tile, b.delegee.stageCropRad, b.delegee.stageShaOff,
          b.delegee.stageCropScl, b.delegee.stageCropMag, b.delegee.stageCropWob,
          PARAM.TREE_ALPHA, b.delegee.stageCropZ,
          PARAM.SHOULD_DRAW_WOBBLE, PARAM.SHOULD_CHECK_TREE_DISTANCE,
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


    })
    .setMethod({


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      updateEfficiencyMultiplier: function() {
        comp_updateEfficiencyMultiplier(this);
      },


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


      /**
       * @memberof B_crop
       * @instance
       * @param {number} stageTo
       * @return {void}
       */
      ex_changeStage: function(stageTo) {
        comp_ex_changeStage(this, stageTo);
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


    }),


  ];
