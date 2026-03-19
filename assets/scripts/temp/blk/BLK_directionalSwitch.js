/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseLogicBlock");


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


    /**
     * Enables or disables the valid building in front of it.
     * <br> <SINGLESIZE>
     * @class BLK_directionalSwitch
     * @extends BLK_baseLogicBlock
     */
    newClass().extendClass(PARENT[0], "BLK_directionalSwitch").initClass()
    .setParent(SwitchBlock)
    .setTags("blk-log", "blk-switch")
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof BLK_directionalSwitch
       * @instance
       */
      dirReg: null,


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      load: function() {
        comp_load(this);
      },


      /**
       * @override
       * @memberof BLK_directionalSwitch
       * @instance
       * @return {boolean}
       */
      ex_isSingleSized: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @memberof BLK_directionalSwitch
       * @instance
       * @param {Block} oblk
       * @return {boolean}
       */
      ex_isValidTg: function(oblk) {
        return comp_ex_isValidTg(this, oblk);
      }
      .setProp({
        noSuper: true,
      }),


    }),


    /**
     * @class B_directionalSwitch
     * @extends B_baseLogicBlock
     */
    newClass().extendClass(PARENT[1], "B_directionalSwitch").initClass()
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


      /**
       * @memberof B_directionalSwitch
       * @instance
       * @param {Building|null} ob
       * @return {void}
       */
      ex_toggle: function(ob) {
        comp_ex_toggle(this, ob);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
