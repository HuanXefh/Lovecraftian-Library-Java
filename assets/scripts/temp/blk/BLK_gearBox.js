/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * The bridge between fluid torque and data torque, cogwheel and transmission rod.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_cogwheel");


  const MDL_cond = require("lovec/mdl/MDL_cond");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.solid = true;
      blk.underBullets = false;
    };
  };


  function comp_load(blk) {
    blk.topReg = fetchRegion(blk, "-top");
    blk.topInvReg = fetchRegion(blk, "-top-inv");
    blk.botReg = fetchRegion(blk, "-bot", "-bottom");
    // Make the cogwheel smaller since it's in a box
    blk.cogDrawW = blk.region.width * 2.0 * 0.96 / Vars.tilesize;
  };


  function comp_draw(b) {
    b.drawTeamTop();

    Draw.rect(b.block.delegee.botReg, b.x, b.y);

    TMP_Z_A = Draw.z();

    Draw.z(Layer.block + 1.0);
    b.ex_drawCog();
    Draw.rect(b.block.delegee.topReg, b.x, b.y);
    if(b.isInv) {
      Draw.rect(b.block.delegee.topInvReg, b.x, b.y);
    };

    Draw.z(TMP_Z_A);
  };


  function comp_ex_updateTorTransTgs(b) {
    b.torTransTgs.clear();
    b.proximity.each(
      ob => MDL_cond._isTransmissionRod(ob.block) ?
        ob.front() === b :
        false,
      ob => b.torTransTgs.push(ob),
    );
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(Wall)
    .setTags("blk-cog", "blk-cog0box")
    .setParam({
      skipTorFetch: false,
      skipTorSupply: false,
      topReg: null,
      topInvReg: null,
      botReg: null,
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      load: function() {
        comp_load(this);
      },


    }),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(Wall.WallBuild)
    .setParam({})
    .setMethod({


      unitOn: function(unit) {
        // Do nothing
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
        override: true,
      }),


      ex_updateTorTransTgs: function() {
        comp_ex_updateTorTransTgs(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
