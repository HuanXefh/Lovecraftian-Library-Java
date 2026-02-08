/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Stacked cogwheels.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_cogwheel");
  const VAR = require("lovec/glb/GLB_var");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_texture = require("lovec/mdl/MDL_texture");


  /* <---------- component ----------> */


  function comp_createIcons(blk, packer) {
    MDL_texture.comp_createIcons_ctTag(blk, packer, blk.undCog, blk.ovCog, "-full-gen");
  };


  function comp_init(blk) {
    blk.ovCog = MDL_content._ct(blk.ovCog, "blk");
    if(!MDL_cond._isCogwheel(blk.ovCog)) blk.ovCog = null;
    if(blk.ovCog == null) ERROR_HANDLER.throw("nullArgument", "ovCog");
    blk.undCog = MDL_content._ct(blk.undCog, "blk");
    if(!MDL_cond._isCogwheel(blk.undCog)) blk.undCog = null;
    if(blk.undCog == null) ERROR_HANDLER.throw("nullArgument", "undCog");

    blk.size = blk.undCog.size;

    // I have to put this in {blk.init} to prevent crash
    MDL_event._c_onLoad(() => {
      blk.region = blk.undCog.region;
      blk.invReg = blk.undCog.delegee.invReg;
      blk.customShadowRegion = blk.undCog.customShadowRegion;
      blk.ovReg = blk.ovCog.region;
      blk.ovInvReg = blk.ovCog.delegee.invReg;
      blk.ovShaReg = blk.ovCog.customShadowRegion;
      blk.cogDrawW = blk.region.width * 2.0 * 1.06 / Vars.tilesize;
      blk.cogOvDrawW = blk.ovReg.width * 2.0 * 1.06 / Vars.tilesize;
      blk.cogInvOffAng = 22.5 / (blk.undCog.size + 1) * 2.0;
      blk.cogOvInvOffAng = 22.5 / (blk.ovCog.size + 1) * 2.0;
      blk.fullIcon = blk.uiIcon = fetchRegion(blk, "-full-gen");
    });
  };


  function comp_ex_updateTorTransTgs(b) {
    b.torTransTgs.clear();
    b.torTransTgs.clear();
    let size, rot;
    size = b.block.size;
    while(size > 0) {
      rot = 0;
      while(rot < 4) {
        let ob = b.ex_findCog(size, rot, false);
        if(ob != null) b.torTransTgs.push(ob);
        rot++;
      };
      size -= 2;
    };
    if(b.block.delegee.ovCog.size > b.block.size) {
      size = b.block.delegee.ovCog.size;
      rot = 0;
      while(rot < 4) {
        let ob = b.ex_findCog(size + 2, rot, true);
        if(ob != null) b.torTransTgs.push(ob);
        rot++;
      };
    };
  };


  function comp_ex_drawCog(b) {
    let
      ang = Mathf.mod(b.torProg, 90.0),
      z1 = Layer.block + b.block.size * 0.001 + 0.72,
      z2 = Layer.power - 1.6 + b.block.delegee.ovCog.size * 0.001,
      ovA = b.block.delegee.ovCog.size > b.block.size ? VAR.blk_ovCogA1 : VAR.blk_ovCogA2;

    processZ(z1);

    if(b.isInv) {
      Draw.rect(b.block.delegee.invReg, b.x, b.y, b.block.delegee.cogDrawW, b.block.delegee.cogDrawW, -ang + 90.0 + b.block.delegee.cogInvOffAng);
      Draw.alpha(1.0 - ang / 90.0);
      Draw.rect(b.block.delegee.invReg, b.x, b.y, b.block.delegee.cogDrawW, b.block.delegee.cogDrawW, -ang + b.block.delegee.cogInvOffAng);
    } else {
      Draw.rect(b.block.region, b.x, b.y, b.block.delegee.cogDrawW, b.block.delegee.cogDrawW, ang);
      Draw.alpha(ang / 90.0);
      Draw.rect(b.block.region, b.x, b.y, b.block.delegee.cogDrawW, b.block.delegee.cogDrawW, ang - 90.0);
    };

    processZ(z1);
    processZ(z2);

    Draw.alpha(0.5);
    Draw.rect(b.block.delegee.ovShaReg, b.x, b.y);
    if(b.isInv) {
      Draw.alpha(ang / 90.0 * ovA);
      Draw.rect(b.block.delegee.ovInvReg, b.x, b.y, b.block.delegee.cogOvDrawW, b.block.delegee.cogOvDrawW, -ang + 90.0 + b.block.delegee.cogOvInvOffAng);
      Draw.alpha((1.0 - ang / 90.0) * ovA);
      Draw.rect(b.block.delegee.ovInvReg, b.x, b.y, b.block.delegee.cogOvDrawW, b.block.delegee.cogOvDrawW, -ang + b.block.delegee.cogOvInvOffAng);
    } else {
      Draw.alpha((1.0 - ang / 90.0) * ovA);
      Draw.rect(b.block.delegee.ovReg, b.x, b.y, b.block.delegee.cogOvDrawW, b.block.delegee.cogOvDrawW, ang);
      Draw.alpha(ang / 90.0 * ovA);
      Draw.rect(b.block.delegee.ovReg, b.x, b.y, b.block.delegee.cogOvDrawW, b.block.delegee.cogOvDrawW, ang - 90.0);
    };
    Draw.color();

    processZ(z2);
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
    .setTags("blk-cog", "blk-cog0stack")
    .setParam({
      // @PARAM: The over coghweel block.
      ovCog: null,
      // @PARAM: The under cogwheel block.
      undCog: null,

      ovReg: null,
      ovInvReg: null,
      ovShaReg: null,
      cogOvDrawW: 0.0,
      cogOvInvOffAng: 0.0,
    })
    .setMethod({


      createIcons: function(packer) {
        comp_createIcons(this, packer);
      },


      init: function() {
        comp_init(this);
      },


    }),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(Wall.WallBuild)
    .setParam({})
    .setMethod({


      ex_updateTorTransTgs: function() {
        comp_ex_updateTorTransTgs(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      ex_calcRpmTrans: function(b_t) {
        return !MDL_cond._isCogwheelStack(b_t.block) ? (this.rpmCur * this.block.size) : (this.rpmCur * this.block.delegee.ovCog.size);
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1.0,
      }),


      ex_calcRpmTransScl: function(b_f) {
        return !MDL_cond._isCogwheelStack(b_f.block) ? (1.0 / this.block.size) : (1.0 / this.block.delegee.ovCog.size);
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1.0,
      }),


      ex_findCog: function thisFun(size, rot, isOv) {
        let ob = thisFun.funPrev.apply(this, [size, rot]);
        return ob == null ?
          ob :
          !isOv ?
            ob :
            MDL_cond._isCogwheelStack(ob.block) ?
              ob :
              null;
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 3,
      }),


      ex_drawCog: function() {
        comp_ex_drawCog(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      ex_processData: function(wr0rd, LCRevi) {
        processData(
          wr0rd, LCRevi,
          (wr, revi) => {
            // Do nothing
          },

          (rd, revi) => {
            if(revi < 1) {
              rd.s();
            };
          },
        );
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
