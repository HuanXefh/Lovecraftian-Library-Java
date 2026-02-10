/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Will be triggered when a specific flag is set.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseLogicBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_mapBlock");


  const MDL_flag = require("lovec/mdl/MDL_flag");


  /* <---------- component ----------> */


  function comp_updateTile(b) {
    if(b.isDormant || !MDL_flag._hasFlag(String(b.block.ex_getFlagStr(b)))) return;

    if(b.block.delegee.triggerOnlyOnce) {
      b.isDormant = true;
    };
    b.ex_onFlagTriggered();
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "MAP_flagTrigger").implement(INTF[0]).initClass()
    .setParent(null)
    .setTags("blk-log")
    .setParam({
      // @PARAM: If {true}, this block will be triggered only once and become dormant forever.
      triggerOnlyOnce: false,

      isWorldBlock: true,
    })
    .setMethod({


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * This string will be used in {Vars.state.rules.objectiveFlags}.
       * ----------------------------------------
       * IMPORTANT:
       *
       * The returned value is an object, NOT a string.
       * You have to convert it sometimes.
       * ---------------------------------------- */
      ex_getFlagStr: function(b) {
        return "";
      }
      .setProp({
        noSuper: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1], "MAP_flagTrigger").implement(INTF[1]).initClass()
    .setParent(null)
    .setParam({
      isDormant: false,
    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


      write: function(wr) {
        let LCRevi = processRevision(wr);
        wr.bool(this.isDormant);
      },


      read: function(rd, revi) {
        let LCRevi = processRevision(rd);
        this.isDormant = rd.bool();
      },


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Will be called every frame when a flag is set.
       * If the block triggers only once, this method is also called only once.
       * ---------------------------------------- */
      ex_onFlagTriggered: function() {

      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
