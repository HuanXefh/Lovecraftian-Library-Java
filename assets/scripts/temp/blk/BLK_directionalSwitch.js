/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Enables or disables the valid building in front of it.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseLogicBlock");
  const EFF = require("lovec/glb/GLB_eff");


  const MDL_cond = require("lovec/mdl/MDL_cond");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.rotate = true;
  };


  function comp_load(blk) {
    blk.dirReg = fetchRegion(blk, "-dir");
  };


  function comp_ex_isValidTg(blk, oblk) {
    return MDL_cond._isMiner(oblk) || MDL_cond._isPump(oblk) || MDL_cond._isFactory(oblk) || MDL_cond._isProjector(oblk);
  };


  function comp_created(b) {
    Time.run(1.0, () => {
      let ob = b.nearby(b.rotation);
      b.ex_toggle(ob);
    });
  };


  function comp_onRemoved(b) {
    if(!b.enabled) return;
    let ob = b.nearby(b.rotation);
    if(ob == null || ob.team !== b.team || ob.enabled || !b.block.ex_isValidTg(ob.block)) return;

    ob.enabled = true;
    EFF.squareFadePack[ob.block.size].at(ob);
  };


  function comp_pickedUp(b) {
    comp_onRemoved(b);
  };


  function comp_dropped(b) {
    comp_created(b);
  };


  function comp_configTapped(b) {
    b.configure(!b.enabled);
    b.block.clickSound.at(b);
    b.ex_toggle(b.nearby(b.rotation));

    return false;
  };


  function comp_draw(b) {
    b.drawTeamTop();

    Draw.rect(b.block.region, b.x, b.y);
    // Drawn only when disabled... since it's meant to disable some buildings
    if(b.enabled) Draw.rect(b.block.onRegion, b.x, b.y);
    Draw.rect(b.block.delegee.dirReg, b.x, b.y, b.drawrot());
  };


  function comp_ex_toggle(b, ob) {
    if(ob == null || ob.team !== b.team || !b.block.ex_isValidTg(ob.block)) return;

    ob.enabled = !b.enabled;
    ob.enabled ?
      EFF.squareFadePack[ob.block.size].at(ob) :
      EFF.disableFadePack[ob.block.size].at(ob);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_directionalSwitch").initClass()
    .setParent(SwitchBlock)
    .setTags("blk-log", "blk-switch")
    .setParam({
      dirReg: null,
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      load: function() {
        comp_load(this);
      },


      ex_isSingleSized: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      ex_isValidTg: function(oblk) {
        return comp_ex_isValidTg(this, oblk);
      }
      .setProp({
        noSuper: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_directionalSwitch").initClass()
    .setParent(SwitchBlock.SwitchBuild)
    .setParam({})
    .setMethod({


      created: function() {
        comp_created(this);
      },


      onRemoved: function() {
        comp_onRemoved(this);
      },


      pickedUp: function() {
        comp_pickedUp(this);
      },


      dropped: function() {
        comp_dropped(this);
      },


      configTapped: function() {
        return comp_configTapped(this);
      }
      .setProp({
        noSuper: true,
      }),


      draw: function() {
        comp_draw(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_toggle: function(ob) {
        comp_ex_toggle(this, ob);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
