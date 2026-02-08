/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * For blocks that are only used for map making.
   * Templates implementing this should be name like {MAP_xxx} for distinction.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.buildVisibility = BuildVisibility.editorOnly;

    if(blk.isWorldBlock) {
      blk.targetable = false;
      blk.breakable = false;
      blk.privileged = true;
      blk.forceDark = true;
    };
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
        // @PARAM: Whether this is a block like world processor.
        isWorldBlock: false,
      }),


      init: function() {
        comp_init(this);
      },


    }),


    // Building
    new CLS_interface({


      damage: function() {
        if(this.block.privileged) return;
        this.super$damage.apply(this, arguments);
      }
      .setProp({
        noSuper: true,
      }),


      canPickup: function() {
        return false;
      }
      .setProp({
        noSuper: true,
      }),


      collide: function(bul) {
        return !this.block.privileged;
      }
      .setProp({
        boolMode: "and",
      }),


    }),


  ];
