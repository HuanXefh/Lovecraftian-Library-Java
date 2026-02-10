/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * A greatly nerfed power node with minimum range.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_basePowerTransmitter");
  const INTF = require("lovec/temp/intf/INTF_BLK_wireDamageInducer");


  const MDL_draw = require("lovec/mdl/MDL_draw");


  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.consumesPower = true;
      blk.conductivePower = true;
      blk.connectedPower = true;
      blk.autolink = false;
      blk.underBullets = blk.size === 1;
    };

    blk.linkFilterTup = [DB_misc.db["block"]["nodeLinkFilter"].read(blk.linkMode, Function.airTrue)];
  };


  function comp_setStats(blk) {
    if(blk.minRadFrac > 0.0) blk.stats.add(fetchStat("lovec", "blk-minr"), blk.laserRange * blk.minRadFrac, StatUnit.blocks);
  };


  function comp_linkValid(blk, b, b_t) {
    if(Mathf.dst(b.x, b.y, b_t.x, b_t.y) < blk.laserRange * Vars.tilesize * blk.minRadFrac) return false;
    if(!blk.linkFilterTup[0](b, b_t)) return false;

    return true;
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    if(blk.drawRange) {
      MDL_draw._d_circlePlace(blk, tx, ty, blk.laserRange * Vars.tilesize, valid, false);
      MDL_draw._d_circlePlace(blk, tx, ty, blk.laserRange * Vars.tilesize * blk.minRadFrac, valid, true);
    };
  };


  function comp_drawLaser(blk, x1, y1, x2, y2, size1, size2) {
    let
      ang = Angles.angle(x1, y1, x2, y2),
      offX = Mathf.cosDeg(ang),
      offY = Mathf.sinDeg(ang),
      offScl1 = size1 * Vars.tilesize * 0.5 - 0.5,
      offScl2 = size2 * Vars.tilesize * 0.5 - 0.5;

    MDL_draw._d_wire(
      x1 + offX * offScl1,
      y1 + offY * offScl1,
      x2 - offX * offScl2,
      y2 - offY * offScl2,
      blk.wireMat,
      blk.laserScale,
      blk.ex_getWireGlowAlpha(x1, y1, x2, y2),
      Layer.power + blk.size * 0.001,
    );
  };


  function comp_drawSelect(b) {
    if(!b.block.drawRange) return;

    MDL_draw._d_circleSelect(b, b.block.laserRange * Vars.tilesize * b.block.delegee.minRadFrac, true, true);
  };


  function comp_drawConfigure(b) {
    comp_drawSelect(b);
  };


  function comp_ex_findWireTarget(b) {
    let int_t = b.power.links.random();

    return int_t == null ? null : Vars.world.build(int_t);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_wireNode").implement(INTF[0]).initClass()
    .setParent(PowerNode)
    .setTags("blk-pow", "blk-pow0trans", "blk-node")
    .setParam({
      // @PARAM: Filter used for valid targets. See {DB_misc.db["block"]["nodeLinkFilter"]}.
      linkMode: "any",
      // @PARAM: Minimum radius as fraction of maximum radius.
      minRadFrac: 0.0,

      linkFilterTup: null,
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      linkValid: function(b, b_t) {
        return comp_linkValid(this, b, b_t);
      }
      .setProp({
        boolMode: "and",
      }),


      drawPlace: function(tx, ty, rot, valid) {
        comp_drawPlace(this, tx, ty, rot, valid);
      },


      drawLaser: function(x1, y1, x2, y2, size1, size2) {
        comp_drawLaser(this, x1, y1, x2, y2, size1, size2);
      }
      .setProp({
        noSuper: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_wireNode").implement(INTF[1]).initClass()
    .setParent(PowerNode.PowerNodeBuild)
    .setParam({})
    .setMethod({


      drawSelect: function() {
        comp_drawSelect(this);
      },


      drawConfigure: function() {
        comp_drawConfigure(this);
      },


      ex_findWireTarget: function() {
        return comp_ex_findWireTarget(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
