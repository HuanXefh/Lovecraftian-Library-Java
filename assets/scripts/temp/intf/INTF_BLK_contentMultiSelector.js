/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles item multi-selector.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const EFF = require("lovec/glb/GLB_eff");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_io = require("lovec/mdl/MDL_io");
  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.selectionColumns = 10;
    };

    blk.selectionQueue.pushAll(blk.ex_findSelectionTgs());

    blk.configurable = true;
    blk.saveConfig = false;
    blk.clearOnDoubleTap = false;

    blk.config(JAVA.string, (b, str) => {
      b.ex_accCtTgs(str, false);
      EFF.squareFadePack[b.block.size].at(b);
      b.ex_onSelectorUpdate();
    });

    blk.config(JAVA.object_arr, (b, cfgArr) => {
      switch(cfgArr[0]) {
        case "selectorBlock" :
          let i = 1, iCap = cfgArr.iCap();
          while(i < iCap) {
            let ct = MDL_content._ct(cfgArr[i], null, true);
            if(ct != null) b.ex_accCtTgs(ct, true);
            i++;
          };
          EFF.squareFadePack[b.block.size].at(b);
          b.ex_onSelectorConfigLoad(cfgArr);
          break;

        case "selector" :
          b.ex_accCtTgs(cfgArr[1], cfgArr[2]);
          EFF.squareFadePack[b.block.size].at(b);
          b.ex_onSelectorUpdate();
          break;
      };
    });
  };


  function comp_buildConfiguration(b, tb) {
    b.ex_buildSelector(tb);

    tb.row();
    MDL_table.__btnCfg(tb, b, b => {
      b.configure("clear");
      b.deselect();
    }, VARGEN.icons.cross).tooltip(MDL_bundle._info("lovec", "tt-clear-selection"), true)
  };


  function comp_ex_buildSelector(b, tb) {
    MDL_table.setSelector_ctMulti(
      tb, b.block, b.block.delegee.selectionQueue,
      () => b.ex_accCtTgs("read", false), val => b.configure(val), false,
      b.block.selectionRows, b.block.selectionColumns,
    );
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
        selectionQueue: prov(() => []),
      }),


      init: function() {
        comp_init(this);
      },


      ex_findSelectionTgs: function() {
        return Vars.content.items().toArray();
      }
      .setProp({
        noSuper: true,
      }),


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        ctTgs: prov(() => []),
      }),


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      config: function() {
        return ["selectorBlock"]
        .pushAll(this.ctTgs.map(ct => ct == null ? "null" : ct.name))
        .toJavaArr();
      }
      .setProp({
        noSuper: true,
      }),


      ex_accCtTgs: function(param, isAdd) {
        switch(param) {
          case "read" :
            return this.ctTgs;
          case "clear" :
            this.block.lastConfig = "clear";
            return this.ctTgs.clear();
          default :
            return isAdd ?
              this.ctTgs.pushUnique(param) :
              this.ctTgs.remove(param);
        };
      }
      .setProp({
        noSuper: true,
      }),


      ex_buildSelector: function(tb) {
        comp_ex_buildSelector(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      // @LATER
      ex_onSelectorConfigLoad: function(cfgArr) {

      }
      .setProp({
        noSuper: true,
      }),


      // @LATER
      ex_onSelectorUpdate: function() {

      }
      .setProp({
        noSuper: true,
      }),


      ex_processData: function(wr0rd, LCRevi) {
        processData(
          wr0rd, LCRevi,

          (wr, revi) => {
            MDL_io._wr_cts(wr, this.ctTgs);
          },

          (rd, revi) => {
            MDL_io._rd_cts(rd, this.ctTgs);
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
