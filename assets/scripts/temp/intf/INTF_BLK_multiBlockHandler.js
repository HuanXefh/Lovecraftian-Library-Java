/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles multi-block structure.
   *
   * Format for {multiBlockData}:
   * {nmBlk, offTx, offTy, rot}
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const TRIGGER = require("lovec/glb/BOX_trigger");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_texture = require("lovec/mdl/MDL_texture");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.multiBlockData != null) {
      blk.multiBlockParsedData = [];
      blk.multiBlockData.forEachRow(4, (nmBlk, offTx, offTy, rot) => {
        let oblk = MDL_content._ct(nmBlk, "blk");
        if(oblk == null) return;
        oblk.delegee.isMultiBlockComponent = true;
        blk.multiBlockParsedData.push(oblk, offTx, offTy, rot);
      });
      if(blk.multiBlockParsedData.length === 0) {
        blk.multiBlockParsedData = null;
      };
    };
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    if(blk.multiBlockParsedData == null) return;

    blk.ex_drawMultiBlockPlan(Vars.player.team(), tx, ty, rot);
  };


  function comp_ex_drawMultiBlockPlan(blk, team, tx, ty, rot) {
    let i = 0, iCap = blk.multiBlockParsedData.iCap(), ot, oblk;
    while(i < iCap) {
      oblk = blk.multiBlockParsedData[i];
      ot = MDL_pos._tCenterRot(Vars.world.tile(tx + blk.multiBlockParsedData[i + 1], ty + blk.multiBlockParsedData[i + 2]), Vars.world.tile(tx, ty), rot, oblk.size, blk.size);
      if(ot == null) {
        i += 4;
        continue;
      }
      if(ot.build != null && ot.build.block === oblk && ot.build.team === team && (!oblk.rotate || oblk instanceof RotBlock ? true : ot.build.rotation === Mathf.mod(rot + blk.multiBlockParsedData[i + 3], 4))) {
        i += 4;
        continue;
      };
      Draw.color(ot.getLinkedTilesAs(oblk, Reflect.get(Block, "tempTiles")).find(ot => ot.solid() || ot.build != null) == null ? Color.white : Pal.remove, 0.5);
      Draw.rect(MDL_texture._regBlk(oblk), ot.x.toFCoord(oblk.size), ot.y.toFCoord(oblk.size), !oblk.rotate ? 0.0 : (rot + blk.multiBlockParsedData[i + 3]) * 90.0);
      i += 4;
    };
    Draw.color();
  };


  function comp_created(b) {
    if(b.block.delegee.multiBlockParsedData == null) return;

    TRIGGER.multiBlockUpdate.addListener(
      () => b.onProximityUpdate(),
      "building: " + b.id,
    );
  };


  function comp_onRemoved(b) {
    if(b.block.delegee.multiBlockParsedData == null) return;

    TRIGGER.multiBlockUpdate.removeListener("building: " + b.id);
  };


  function comp_onProximityUpdate(b) {
    if(b.block.delegee.multiBlockParsedData == null) return;

    b.multiBlockCompleted = true;
    b.multiBlockLinks.clear();
    let ot;
    b.block.delegee.multiBlockParsedData.forEachRow(4, (oblk, offTx, offTy, rot) => {
      ot = MDL_pos._tCenterRot(Vars.world.tile(b.tileX() + offTx, b.tileY() + offTy), b.tile, b.rotation, oblk.size, b.block.size);
      if(ot == null || ot.build == null || ot.build.block !== oblk || ot.build.tile !== ot || (!oblk.rotate || oblk instanceof RotBlock ? false : ot.build.rotation !== Mathf.mod(b.rotation + rot, 4))) {
        b.multiBlockCompleted = false;
        return;
      };
      b.multiBlockLinks.pushUnique(ot.build);
    });
  };


  function comp_updateEfficiencyMultiplier(b) {
    if(b.block.delegee.multiBlockParsedData == null) return;

    if(!b.multiBlockCompleted) {
      b.efficiency = 0.0
    } else {
      b.efficiency *= b.multiBlockLinks.reduce((effcPrev, ob) => Math.min(effcPrev, ob.efficiency), 1.0);
    };
  };


  function comp_drawSelect(b) {
    if(b.block.delegee.multiBlockParsedData == null) return;

    b.block.ex_drawMultiBlockPlan(b.team, b.tileX(), b.tileY(), b.rotation);
  };


  function comp_ex_postUpdateEfficiencyMultiplier(b) {
    comp_updateEfficiencyMultiplier(b);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        // @PARAM: Used to define a multi-block structure.
        multiBlockData: null,

        multiBlockParsedData: null,
      }),


      init: function() {
        comp_init(this);
      },


      drawPlace: function(tx, ty, rot, valid) {
        comp_drawPlace(this, tx, ty, rot, valid);
      },


      ex_drawMultiBlockPlan: function(team, tx, ty, rot) {
        comp_ex_drawMultiBlockPlan(this, team, tx, ty, rot);
      }
      .setProp({
        noSuper: true,
      }),


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        multiBlockCompleted: false,
        multiBlockLinks: prov(() => []),
      }),


      created: function() {
        comp_created(this);
      },


      onRemoved: function() {
        comp_onRemoved(this);
      },


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      updateEfficiencyMultiplier: function() {
        comp_updateEfficiencyMultiplier(this);
      },


      drawSelect: function() {
        comp_drawSelect(this);
      },


      ex_postUpdateEfficiencyMultiplier: function() {
        comp_ex_postUpdateEfficiencyMultiplier(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
