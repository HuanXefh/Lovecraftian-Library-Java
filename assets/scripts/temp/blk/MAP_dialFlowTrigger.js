/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Used to trigger a dialog flow in game.
   * For example, if you have a trigger with "lovec-test" as the dialog flow name, you can trigger it by adding flag named "dialFlow: lovec-test".
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/MAP_flagTrigger");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.group = BlockGroup.none;
    blk.update = true;
    blk.configurable = true;

    blk.config(JAVA.string, (b, str) => {
      b.delegee.nmDialFlow = str;
    });
  };


  function comp_configTapped(b) {
    Vars.ui.showTextInput(
      MDL_bundle._info("lovec", "dial-enter-dialog-flow-name"),
      MDL_bundle._info("lovec", "dial-enter-dialog-flow-name", true),
      255,
      b.nmDialFlow,
      false,
      str => {
        str !== "read" ?
          b.configure(str) :
          Vars.ui.showErrorMessage(MDL_bundle._info("lovec", "reserved-read"));
      },
      Function.air,
    );

    return false;
  };


  function comp_drawSelect(b) {
    if(!Vars.state.isEditor()) return;

    MDL_draw._d_textSelect(b, b.nmDialFlow, true);
  };


  function comp_ex_onFlagTriggered(b) {
    MDL_ui._d_flow(b.nmDialFlow);
    if(Vars.state.isCampaign() && VARGEN.dialFlowNmCtMap.containsKey(b.nmDialFlow)) {
      VARGEN.dialFlowNmCtMap.get(b.nmDialFlow).unlock();
    };
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
    .setTags("blk-log")
    .setParam({
      triggerOnlyOnce: true,
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      ex_getFlagStr: function(b) {
        return "dialFlow: " + b.delegee.nmDialFlow;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(Wall.WallBuild)
    .setParam({
      nmDialFlow: "lovec-test",
    })
    .setMethod({


      configTapped: function() {
        return comp_configTapped(this);
      }
      .setProp({
        noSuper: true,
      }),


      shouldShowConfigure: function(pl) {
        return Vars.state.isEditor();
      }
      .setProp({
        noSuper: true,
      }),


      drawSelect: function() {
        comp_drawSelect(this);
      },


      write: function(wr) {
        let LCRevi = processRevision(wr);
        wr.str(this.nmDialFlow);
      },


      read: function(rd, revi) {
        let LCRevi = processRevision(rd);
        this.nmDialFlow = rd.str();
      },


      ex_onFlagTriggered: function() {
        comp_ex_onFlagTriggered(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
