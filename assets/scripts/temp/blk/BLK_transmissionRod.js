/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Better than cogwheel for remote torque transfer.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseTorqueBlock");
  const TIMER = require("lovec/glb/GLB_timer");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.group = BlockGroup.none;
    blk.priority = TargetPriority.transport;
    blk.update = true;
    blk.drawDisabled = true;

    if(blk.overwriteVanillaProp) {
      blk.underBullets = true;
    };
  };


  function comp_load(blk) {
    blk.rodRegs = fetchRegions(blk, "-frame", 2, blk.rodFrameAmt);
    blk.dirReg = fetchRegion(blk, "-dir", "-arrow");
  };


  function comp_onProximityUpdate(b) {
    b.isVerticalRod = Mathf.mod(b.rotation, 4) !== 0;
  };


  function comp_updateTile(b) {
    if(TIMER.minTwo) b.rodProg = 0.0;

    b.rodProg += b.block.delegee.rodFrameAmt * b.rpmCur * Time.delta;
  };


  function comp_draw(b) {
    b.drawTeamTop();

    MDL_draw._reg_frameFade(
      b.x, b.y,
      b.block.delegee.rodRegs[b.isVerticalRod ? 1 : 0],
      b.rodProg, 60.0,
    );
    Draw.rect(b.block.delegee.dirReg, b.x, b.y, b.drawrot());
  };


  function comp_ex_updateTorTransTgs(b) {
    b.torTransTgs.clear();
    let ob = b.back();
    if(ob == null || ob.team !== b.team) return;

    if(
      MDL_cond._isTransmissionRod(ob.block) ?
        ob.relativeTo(b) === ob.rotation :
        MDL_cond._isGearBox(ob.block)
    ) {
      b.torTransTgs.push(ob);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_transmissionRod").initClass()
    .setParent(Wall)
    .setTags("blk-trans0rod")
    .setParam({
      // @PARAM: Amount of frames for the rod sprite.
      rodFrameAmt: 8,

      skipTorFetch: true,
      skipTorSupply: true,
      rodRegs: null,
      dirReg: null,
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      load: function() {
        comp_load(this);
      },


      ex_isSingleSized: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_transmissionRod").initClass()
    .setParent(Wall.WallBuild)
    .setParam({
      rotProg: 0.0,
      isVerticalRod: false,
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


      ex_updateTorTransTgs: function() {
        comp_ex_updateTorTransTgs(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
