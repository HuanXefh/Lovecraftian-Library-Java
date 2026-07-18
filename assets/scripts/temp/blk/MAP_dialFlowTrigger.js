/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/MAP_flagTrigger");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.group = BlockGroup.none;
    blk.update = true;
    blk.configurable = true;

    blk.config(JAVA.string, (b, str) => {
      b.delegee.nameDialFlow = str;
    });
  };


  function comp_configTapped(b) {
    Vars.ui.showTextInput(
      MDL_bundle._info("lovec", "dial-enter-dialog-flow-name"),
      MDL_bundle._info("lovec", "dial-enter-dialog-flow-name", true),
      255,
      b.nameDialFlow,
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

    MDL_draw._d_textSelect(b, b.nameDialFlow, true);
  };


  function comp_ex_onFlagTriggered(b) {
    MDL_ui._d_flow(b.nameDialFlow);
    if(Vars.state.isCampaign() && UTIL_dialogFlow.getNameCtMap().containsKey(b.nameDialFlow)) {
      UTIL_dialogFlow.getNameCtMap().get(b.nameDialFlow).unlock();
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Used to trigger a dialog flow in game.
     * For example, if you have a trigger with "lovec-test" as the dialog flow name, you can trigger it by adding flag named "dialFlow: lovec-test".
     * @class MAP_dialFlowTrigger
     * @extends MAP_flagTrigger
     */
    newClass().extendClass(PARENT[0], "MAP_dialFlowTrigger").initClass()
    .setParent(Wall)
    .setTags("blk-non-wall")
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @override
       * @memberof MAP_dialFlowTrigger
       * @instance
       */
      triggerOnlyOnce: true,


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      /**
       * @override
       * @memberof MAP_dialFlowTrigger
       * @instance
       * @param {Building} b
       * @return {string}
       */
      ex_getFlagStr: function(b) {
        return "dialFlow: " + b.delegee.nameDialFlow;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    /**
     * @class B_dialFlowTrigger
     * @extends B_flagTrigger
     */
    newClass().extendClass(PARENT[1], "B_dialFlowTrigger").initClass()
    .setParent(Wall.WallBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @memberof B_dialFlowTrigger
       * @instance
       */
      nameDialFlow: "lovec-test",


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
        wr.str(this.nameDialFlow);
      },


      read: function(rd, revi) {
        if(this.LCRevi === 5) rd.s();

        this.nameDialFlow = rd.str();
      },


      /**
       * @override
       * @memberof B_dialFlowTrigger
       * @instance
       * @return {void}
       */
      ex_onFlagTriggered: function() {
        comp_ex_onFlagTriggered(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
