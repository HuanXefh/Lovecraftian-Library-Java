/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Vanilla {BasicBulletType} I guess.
   * Supports drawing shadow for the bullet.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/bul/BUL_baseBullet");


  /* <---------- component ----------> */


  function comp_load(btp) {
    btp.shaReg = btp.backRegion;
  };


  function comp_draw(btp, bul) {
    if(btp.shouldDrawShadow && Vars.world.floorWorld(bul.x, bul.y).canShadow) {
      processZ(btp.layer - 1.0);

      Draw.color(Pal.shadow, Pal.shadow.a);
      Draw.rect(btp.shaReg, bul.x + btp.offSha, bul.y + btp.offSha, bul.rotation - 90.0);
      Draw.color();

      processZ(btp.layer - 1.0);
    };

    btp.super$draw(bul);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(BasicBulletType)
  .setTags()
  .setParam({
    // @PARAM: Whether shadow of this bullet should be drawn.
    shouldDrawShadow: true,
    // @PARAM: Position offset for drawing shadow, if it's used.
    offSha: -4.0,

    shaReg: null,

    // For convenience
    frontColor: Pal.bulletYellow,
    backColor: Pal.bulletYellowBack,
    shrinkX: 0.0,
    shrinkY: 0.5,
    shrinkInterp: Interp.linear,
    spin: 0.0,
  })
  .setParamAlias([
    "w", "width", 5.0,
    "h", "height", 7.0,
    "spr", "sprite", "error",
    "backSpr", "backSprite", null,
    "sprOffAng", "rotationOffset", 0.0,
  ])
  .setMethod({


    load: function() {
      comp_load(this);
    },


    draw: function(bul) {
      comp_draw(this, bul);
    }
    .setProp({
      noSuper: true,
    }),


  });
