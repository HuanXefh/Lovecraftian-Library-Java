/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe factories using MultiBlockLib.
   * ----------------------------------------
   * DEDICATION:
   *
   * Supported by MultiBlockLib.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_recipeFactory");
  const EFF = require("lovec/glb/GLB_eff");


  /* <---------- auxiliary ----------> */


  const MultiBlockGenericCrafter = fetchClass("multiblock.extend.multiblock.MultiBlockGenericCrafter");


  /* <---------- component ----------> */


  function comp_updateTile(b) {
    if(b.isPayload()) return;

    if(!b.linkCreated) {
      b.linkEntities = b.block.setLinkBuild(b, b.block, b.tile, b.team, b.block.size, b.rotation);
      b.linkCreated = true;
      b.updateLinkProximity();
    };

    if(!b.linkValid) {
      b.linkEntities.each(ob => ob.kill());
      b.kill();
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/




  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_multiBlockLibRecipeFactory").initClass()
    .setParent(MultiBlockGenericCrafter)
    .setTags("blk-fac")
    .setParam({})
    .setMethod({}),


    // Building
    newClass().extendClass(PARENT[1], "BLK_multiBlockLibRecipeFactory").initClass()
    .setParent(MultiBlockGenericCrafter.MultiBlockCrafterBuild)
    .setParam({})
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_showRcChangeEff: function() {
        this.linkEntities.each(ob => EFF.squareFadePack[ob.block.size].at(ob));
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
