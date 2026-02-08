/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles methods that most factories and generators should have.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  // TODO: Test.


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");


  /* <---------- component ----------> */


  function comp_init() {
    blk.configurable = true;

    blk.config(Vec2, (b, vec2) => {
      b.delegee.posConfigVec2.set(vec2);
      b.delegee.posConfigT = Vars.world.tileWorld(vec2.x, vec2.y);
      b.delegee.posConfigB = Vars.world.buildWorld(vec2.x, vec2.y);
    });
  };


  function comp_onConfigureTapped(b, x, y) {
    if(Mathf.dst(b.x, b.y, x, y) <= b.ex_getPosConfigRad() && b.ex_checkPosConfigValid(x, y)) {
      b.configure(Tmp.v1.set(x, y));
      return true;
    };

    return false;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    new CLS_interface({


      init: function() {
        comp_init(this);
      },


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        posConfigVec2: prov(() => new Vec2()),
        posConfigT: null,
        posConfigB: null,
      }),


      onConfigureTapped: function(x, y) {
        return comp_onConfigureTapped(this, x, y);
      },


      // @LATER
      ex_getPosConfigRad: function() {
        return 0.0;
      }
      .setProp({
        noSuper: true,
      }),


      // @LATER
      ex_checkPosConfigValid: function(x, y) {
        return true;
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
