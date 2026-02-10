/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * A tiny mender that repairs the building in front of it.
   * No optional input since I don't need it.
   *
   * This can heal enemy blocks, I'm not fixing that cauz it's fun :D
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseMender");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_text = require("lovec/mdl/MDL_text");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.lightRadius = 24.0;
    };

    blk.rotate = true;

    blk.ex_addLogicGetter(LAccess.range, b => 1);
  };


  function comp_load(blk) {
    blk.sideReg1 = fetchRegion(blk, "-side1", "-side");
    blk.sideReg2 = fetchRegion(blk, "-side2", "-side");
  };


  function comp_setStats(blk) {
    blk.stats.remove(Stat.repairTime);
    blk.stats.remove(Stat.range);
    blk.stats.remove(Stat.booster);

    blk.stats.add(fetchStat("lovec", "blk0misc-repairamt"), MDL_text._healText(
      blk.bHealAmt,
      blk.bHealPerc,
    ));
    blk.stats.add(fetchStat("lovec", "blk0misc-repairr"), 1.0, StatUnit.blocks);
    blk.stats.add(fetchStat("lovec", "blk0misc-repairintv"), blk.reload / 60.0, StatUnit.seconds);
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    MDL_draw.comp_drawPlace_baseBlock(blk, tx, ty, rot, valid);

    let t = Vars.world.tile(tx, ty);
    if(t == null) return;
    let ot = t.nearby(rot);
    if(ot == null) return;

    MDL_draw._d_rect(ot.worldx(), ot.worldy(), 0, 1, Pal.heal, 1.0, true);
  };


  function comp_updateTile(b) {
    let cond = !b.checkSuppression();

    b.smoothEfficiency = Mathf.lerpDelta(b.smoothEfficiency, b.efficiency, 0.08);
    b.heat = Mathf.lerpDelta(b.heat, cond && b.efficiency > 0.0 ? 1.0 : 0.0, 0.08);
    b.charge += b.heat * b.delta();

    if(b.timer.get(b.block.timerUse, b.block.useTime) && cond) b.consume();

    if(b.charge > b.block.reload && cond) {
      b.charge = 0.0;

      let ob = b.nearby(b.rotation);
      if(ob != null && MDL_cond._canHeal(ob)) {
        FRAG_attack.heal(ob, (ob.maxHealth * b.block.delegee.bHealPerc + b.block.delegee.bHealAmt) * b.efficiency, true);
      };
    };
  };


  function comp_draw(b) {
    b.drawTeamTop();

    Draw.rect(b.block.region, b.x, b.y);
    Draw.rect(b.rotation < 2 ? b.block.delegee.sideReg1 : b.block.delegee.sideReg2, b.x, b.y, b.drawrot());
    Draw.color(b.block.baseColor);
    Draw.alpha(b.heat * Mathf.absin(Time.time, 50.0 / Mathf.PI2, 1.0) * 0.5);
    Draw.rect(b.block.topRegion, b.x, b.y, b.drawrot());
    Draw.alpha(1.0);
  };


  function comp_drawSelect(b) {
    let ot = b.tile.nearby(b.rotation);
    if(ot == null) return;

    MDL_draw._d_rect(ot.worldx(), ot.worldy(), 0, 1, Pal.heal, 1.0, true);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_directionalMender").initClass()
    .setParent(MendProjector)
    .setTags("blk-proj", "blk-mend")
    .setParam({
      // @PARAM: See {BLK_radiusMender}.
      bHealAmt: 0.0,
      // @PARAM: See {BLK_radiusMender}.
      bHealPerc: 0.0,

      sideReg1: null,
      sideReg2: null,
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      load: function() {
        comp_load(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      drawPlace: function(tx, ty, rot, valid) {
        comp_drawPlace(this, tx, ty, rot, valid);
      }
      .setProp({
        noSuper: true,
      }),


      ex_isSingleSized: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_directionalMender").initClass()
    .setParent(MendProjector.MendBuild)
    .setParam({})
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
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


      drawSelect: function() {
        comp_drawSelect(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
