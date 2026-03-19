/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.buildVisibility = BuildVisibility.editorOnly;

    if(blk.isWorldBlock) {
      blk.targetable = false;
      blk.breakable = false;
      blk.privileged = true;
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * For blocks that are only used for map making.
     * Templates implementing this should be name like "MAP_xxx".
     * @class INTF_BLK_mapBlock
     */
    new CLS_interface("INTF_BLK_mapBlock", {


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: Whether this is a block like world processor.
         * @memberof INTF_BLK_mapBlock
         * @instance
         */
        isWorldBlock: false,


      }),


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class INTF_B_mapBlock
     */
    new CLS_interface("INTF_B_mapBlock", {


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
