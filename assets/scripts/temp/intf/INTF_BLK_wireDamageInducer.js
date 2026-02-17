/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles wire damage.
   * This does not draw wire.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const TRIGGER = require("lovec/glb/BOX_trigger");
  const TIMER = require("lovec/glb/GLB_timer");


  const FRAG_attack = require("lovec/frag/FRAG_attack");
  const FRAG_faci = require("lovec/frag/FRAG_faci");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.update = true;
  };


  function comp_ex_getWireGlowAlpha(blk, x1, y1, x2, y2) {
    let b = Vars.world.buildWorld(x1, y1);
    let b_t = Vars.world.buildWorld(x2, y2);
    if(b == null || b_t == null || b.power == null || b_t.power == null) return 0.0;

    return Math.max(b.power.status, b_t.power.status);
  };


  function comp_updateTile(b) {
    if(!TIMER.secQuarter) return;
    let dmg = b.block.delegee.wireTouchDmg * b.power.status;
    if(dmg < 0.0001) return;
    let b_t = b.ex_findWireTarget();
    if(b_t == null || b_t.power == null || b_t.power < 0.01) return;
    let unit = MDL_pos._rayFind_unit(b.x, b.y, b_t.x, b_t.y, ounit => MDL_cond._isBoosting(ounit));
    if(unit == null) return;

    TRIGGER.wireTouch.fire(b, unit);
    FRAG_attack._a_lightning(unit.x, unit.y, null, dmg, 3, 7, 8, b.block.delegee.wireArcColor, "air");
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
        // @PARAM: Wire material. See {DB_block.db["grpParam"]["wireMatReg"]}.
        wireMat: "copper",
        // @PARAM: Damage dealt when a boosting unit touches the wire.
        wireTouchDmg: 0.0,
        // @PARAM: Color of the lightning created.
        wireArcColor: Pal.accent,
      }),


      init: function() {
        comp_init(this);
      },


      ex_getWireGlowAlpha: function(x1, y1, x2, y2) {
        return comp_ex_getWireGlowAlpha(this, x1, y1, x2, y2);
      }
      .setProp({
        noSuper: true,
      }),


    }),


    // Building
    new CLS_interface({


      updateTile: function() {
        comp_updateTile(this);
      },


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Finds a random target building to check whether a boosting unit is on the way.
       * Normally a target building is a building connected to this wire block.
       * ---------------------------------------- */
      ex_findWireTarget: function() {
        return null;
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
