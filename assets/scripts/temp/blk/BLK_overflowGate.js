/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Overflow gate with {blk.invert} being useless.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseItemGate");
  const TRIGGER = require("lovec/glb/BOX_trigger");
  const EFF = require("lovec/glb/GLB_eff");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.configurable = true;
    blk.saveConfig = true;
    blk.clearOnDoubleTap = false;

    blk.config(JAVA.boolean, (b, bool) => {
      if(bool !== b.delegee.isInv) {
        b.delegee.isInv = bool;
        EFF.squareFadePack[b.block.size].at(b);
        TRIGGER.invertSelection.fire();
      };
    });
  };


  function comp_load(blk) {
    blk.invReg = fetchRegion(blk, "-inv");
  };


  function comp_getTileTarget(b, itm, b_f, isFlip) {
    let rot = b_f.relativeTo(b);
    let b_t = b.nearby(rot);
    let tg = b_t;
    let cond0 = b_t != null && b_t.team === b.team && !(b_t.block.instantTransfer && b_f.block.instantTransfer) && b_t.acceptItem(b, itm);

    if(!cond0 || b.isInv === b.enabled) {
      let b_s1 = b.nearby(Mathf.mod(rot - 1, 4));
      let b_s2 = b.nearby(Mathf.mod(rot + 1, 4));
      let cond1 = b_s1 != null && b_s1.team === b.team && !(b_s1.block.instantTransfer && b_f.block.instantTransfer) && b_s1.acceptItem(b, itm);
      let cond2 = b_s2 != null && b_s2.team === b.team && !(b_s2.block.instantTransfer && b_f.block.instantTransfer) && b_s2.acceptItem(b, itm);

      if(!cond1 && !cond2) {
        return b.isInv === b.enabled && cond0 ? b_t : null;
      };
      if(cond1 && !cond2) {
        tg = b_s1;
      } else if(!cond1 && cond2) {
        tg = b_s2;
      } else {
        tg = (b.rotation & (1 << rot)) === 0 ? b_s1 : b_s2;
        if(isFlip) b.rotation ^= (1 << rot);
      };
    };

    return tg;
  };


  function comp_buildConfiguration(b, tb) {
    MDL_table.__btnCfgToggle(tb, b, VARGEN.icons.swap, VARGEN.icons.swap, b.isInv)
    .tooltip(MDL_bundle._info("lovec", "tt-invert-selection"), true);
  };


  function comp_draw(b) {
    if(b.isInv) Draw.rect(b.block.delegee.invReg, b.x, b.y);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_overflowGate").initClass()
    .setParent(OverflowGate)
    .setTags("blk-dis", "blk-gate")
    .setParam({
      invReg: null,
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
    newClass().extendClass(PARENT[1], "BLK_overflowGate").initClass()
    .setParent(OverflowGate.OverflowGateBuild)
    .setParam({
      isInv: false,
    })
    .setMethod({


      getTileTarget: function(itm, b_f, isFlip) {
        return comp_getTileTarget(this, itm, b_f, isFlip);
      }
      .setProp({
        noSuper: true,
      }),


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      config: function() {
        return this.isInv;
      }
      .setProp({
        noSuper: true,
      }),


      draw: function() {
        comp_draw(this);
      },


      write: function(wr) {
        let LCRevi = processRevision(wr);
        wr.bool(this.isInv);
      },


      read: function(rd, revi) {
        let LCRevi = processRevision(rd);
        this.isInv = rd.bool();
      },


    }),


  ];
