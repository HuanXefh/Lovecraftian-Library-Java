/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_partsBlock");


  /* <---------- component ----------> */


  function comp_loadIcon(blk) {
    blk.fullIcon = blk.uiIcon = fetchRegion(blk);
  };


  function comp_createIcons(blk, packer) {
    if(blk.recolorRegStr == null) return;
    let parent = blk.oreParent != null ?
      blk.oreParent :
      Object.findKeyByVal(DB_HANDLER.getDataObj("itm-pay-blk"), blk.name, null);
    if(parent == null) return;

    let pix = MDL_texture._pix_gsColor(
      Core.atlas.getPixmap(blk.recolorRegStr),
      Core.atlas.getPixmap(parent),
    );
    packer.add(MultiPacker.PageType.main, blk.name, pix);
    pix.dispose();
  };


  function comp_init(blk) {
    if(blk.requirements.length !== 1) throw new Error("Raw ore block should have only one item material!");

    if(blk.oreParent == null) {
      let oreParent = Object.findKeyByVal(DB_HANDLER.getDataObj("itm-pay-blk"), blk.name, null);
      if(oreParent != null) blk.oreParent = oreParent;
    };
    blk.oreParent = MDL_content._ct(blk.oreParent, "rs");

    if(blk.oreParent != null) {
      MDL_content.rename(blk, blk.oreParent.localizedName);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Ore as payload block, usually produced by a drill.
     * See {@link BLK_baseDrill#shouldDropPay}.
     * <br> <NAMEGEN>
     * @class BLK_rawOreBlock
     * @extends BLK_partsBlock
     */
    newClass().extendClass(PARENT[0], "BLK_rawOreBlock").initClass()
    .setParent(Wall)
    .setTags()
    .setParam({


      /**
       * <PARAM>: Ore item parent. If unset, this will be automatically set according to DB file.
       * <br> <DB>: itm-pay-blk.
       * @memberof BLK_rawOreBlock
       * @instance
       */
      oreParent: null,
      /**
       * <PARAM>: See {@link RS_baseResource}. Set this to null to disable sprite generation.
       * @memberof BLK_rawOreBlock
       * @instance
       */
      recolorRegStr: "lovec-gen-raw-ore-1",


    })
    .setMethod({


      loadIcon: function() {
        comp_loadIcon(this);
      },


      createIcons: function(packer) {
        comp_createIcons(this, packer);
      },


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class B_rawOreBlock
     * @extends B_partsBlock
     */
    newClass().extendClass(PARENT[1], "B_rawOreBlock").initClass()
    .setParent(Wall.WallBuild)
    .setParam({})
    .setMethod({}),


  ];
