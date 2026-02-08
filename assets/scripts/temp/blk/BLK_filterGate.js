/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Vanilla sorter but two modes in one block.
   * {blk.invert} is useless for this.
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
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_io = require("lovec/mdl/MDL_io");
  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.selectionColumns = 10;
    };

    blk.config(JAVA.boolean, (b, bool) => {
      if(bool !== b.delegee.isInv) {
        b.delegee.isInv = bool;
        EFF.squareFadePack[b.block.size].at(b);
        TRIGGER.invertSelection.fire();
      };
    });

    blk.config(JAVA.object_arr, (b, cfgArr) => {
      switch(cfgArr[0]) {
        case "selectorBlock" :
          b.sortItem = MDL_content._ct(cfgArr[1], "rs");
          b.delegee.isInv = cfgArr[2];
          EFF.squareFadePack[b.block.size].at(b);
          break;
      };
    });
  };


  function comp_load(blk) {
    blk.invReg = fetchRegion(blk, "-inv");
  };


  function comp_setBars(blk) {
    blk.removeBar("items");
  };


  function comp_getTileTarget(b, itm, b_f, isFlip) {
    let rot = b_f.relativeTo(b);
    let b_t = b.nearby(rot);
    let tg;

    if((b.block.delegee.filterScrTup[0](b, b_f, itm) !== b.isInv) === b.enabled) {
      if(b.isSame(b_f) && b.isSame(b_t)) return tg;
      tg = b_t;
    } else {
      let b_s1 = b.nearby(Mathf.mod(rot - 1, 4));
      let b_s2 = b.nearby(Mathf.mod(rot + 1, 4));
      let cond1 = b_s1 != null && b_s1.team === b.team && !(b_s1.block.instantTransfer && b_f.block.instantTransfer) && b_s1.acceptItem(b, itm);
      let cond2 = b_s2 != null && b_s2.team === b.team && !(b_s2.block.instantTransfer && b_f.block.instantTransfer) && b_s2.acceptItem(b, itm);

      if(cond1 && !cond2) {
        tg = b_s1;
      } else if(!cond1 && cond2) {
        tg = b_s2;
      } else if(!cond2) {
        return tg;
      } else {
        tg = (b.rotation & (1 << rot)) === 0 ? b_s1 : b_s2;
        if(isFlip) b.rotation ^= (1 << rot);
      };
    };

    return tg;
  };


  function comp_buildConfiguration(b, tb) {
    if(!b.block.delegee.hideSelection) {
      MDL_table.setSelector_ct(
        tb, b.block, Vars.content.items().toArray(),
        () => b.sortItem, val => b.configure(val), false,
        b.block.selectionRows, b.block.selectionColumns,
      );
    };

    tb.row();
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
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(Sorter)
    .setTags("blk-dis", "blk-gate")
    .setParam({
      // @PARAM: Item is selected when this returns {true}.
      // @ARGS: b, b_f, itm
      filterScrTup: prov(() => [(b, b_f, itm) => itm === b.sortItem]),
      // @PARAM: Set this to {true} if item selection is not used.
      hideSelection: false,

      invReg: null,
    })
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


    }),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(Sorter.SorterBuild)
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
        return [
          "selectorBlock",
          this.sortItem == null ? "null" : this.sortItem.name,
          this.isInv,
        ].toJavaArr();
      }
      .setProp({
        noSuper: true,
      }),


      draw: function() {
        comp_draw(this);
      },


      write: function(wr) {
        let LCRevi = processRevision(wr);
        MDL_io._wr_ct(wr, this.sortItem);
        wr.bool(this.isInv);
      },


      read: function(rd, revi) {
        let LCRevi = processRevision(rd);
        this.sortItem = MDL_io._rd_ct(rd);
        this.isInv = rd.bool();
      },


    }),


  ];
