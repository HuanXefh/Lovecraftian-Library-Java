/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseLogicBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_mapBlock");


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


    /**
     * This block will be triggered when a specific flag is set.
     * @class MAP_flagTrigger
     * @extends BLK_baseLogicBlock
     * @extends INTF_BLK_mapBlock
     */
    newClass().extendClass(PARENT[0], "MAP_flagTrigger").implement(INTF[0]).initClass()
    .setParent(null)
    .setTags("blk-log")
    .setParam({


      /**
       * <PARAM>: If true, this block will be triggered only once and become dormant forever.
       * @memberof MAP_flagTrigger
       * @instance
       */
      triggerOnlyOnce: false,


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof MAP_flagTrigger
       * @instance
       */
      isWorldBlock: true,


      /* <------------------------------ vanilla ------------------------------ */


      forceDark: true,


    })
    .setMethod({


      /**
       * If the string returned is found in map flags, this block will be triggered.
       * <br> <LATER>
       * @memberof MAP_flagTrigger
       * @instance
       * @param {Building} b
       * @return {string}
       */
      ex_getFlagStr: function(b) {
        return "";
      }
      .setProp({
        noSuper: true,
      }),


    }),


    /**
     * @class B_flagTrigger
     * @extends B_baseLogicBlock
     * @extends INTF_B_mapBlock
     */
    newClass().extendClass(PARENT[1], "B_flagTrigger").implement(INTF[1]).initClass()
    .setParent(null)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_flagTrigger
       * @instance
       */
      isDormant: false,


    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


      write: function(wr) {
        wr.bool(this.isDormant);
      },


      read: function(rd, revi) {
        if(this.LCRevi === 5) rd.s();

        this.isDormant = rd.bool();
      },


      /**
       * Called every frame when a flag returned by {@link MAP_flagTrigger#ex_getFlagStr} is set.
       * If the block triggers only once, this method is also called only once.
       * <br> <LATER>
       * @memberof B_flagTrigger
       * @instance
       * @return {void}
       */
      ex_onFlagTriggered: function() {

      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
