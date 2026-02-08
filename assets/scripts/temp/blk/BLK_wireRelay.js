/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Just beam node.
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


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.consumesPower = true;
      blk.conductivePower = false;
      blk.connectedPower = true;
      blk.underBullets = blk.size === 1;
    };
  };


  function comp_drawLaser(blk, x1, y1, x2, y2, size1, size2) {
    let dst = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2)) / Vars.tilesize;
    if(dst < (blk.size * 0.5 + 1.0)) return;

    let offSize = (dst - (size1 + size2) * 0.5) * Vars.tilesize;
    let pon2 = Geometry.d4[Tile.relativeTo(x1, y1, x2, y2)];
    MDL_draw._d_wire(
      x1 + pon2.x * blk.size * 0.5 * Vars.tilesize,
      y1 + pon2.y * blk.size * 0.5 * Vars.tilesize,
      x1 + pon2.x * (blk.size * 0.5 * Vars.tilesize + offSize),
      y1 + pon2.y * (blk.size * 0.5 * Vars.tilesize + offSize),
      blk.wireMat,
      blk.laserWidth,
      blk.ex_getWireGlowAlpha(x1, y1, x2, y2),
      Layer.power + blk.size * 0.001,
    );
  };


  function comp_draw(b) {
    MDL_draw.comp_draw_baseBuilding(b);
    if(Vars.renderer.laserOpacity < 0.0001 || b.team === Team.derelict) return;

    let ot, ob;
    for(let i = 0; i < 4; i++) {
      ot = b.dests[i];
      ob = b.links[i];
      if(ot == null || !ob.wasVisible) continue;
      if(ob.block instanceof BeamNode) {
        if(ob.tileX() !== b.tileX() && ob.tileY() !== b.tileY()) continue;
        if(ob.id > b.id && b.block.range < ob.block.range) continue;
        if(b.block.range > ob.block.range) continue;
      };

      b.block.drawLaser(b.x, b.y, ob.x, ob.y, b.block.size, ob.block.size);
    };
  };


  function comp_ex_findWireTarget(b) {
    return b.links[(3).randInt(0)];
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).implement(INTF[0]).initClass()
    .setParent(BeamNode)
    .setTags("blk-pow", "blk-pow0trans", "blk-relay")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


      drawLaser: function(x1, y1, x2, y2, size1, size2) {
        comp_drawLaser(this, x1, y1, x2, y2, size1, size2);
      }
      .setProp({
        noSuper: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1]).implement(INTF[1]).initClass()
    .setParent(BeamNode.BeamNodeBuild)
    .setParam({})
    .setMethod({


      draw: function() {
        comp_draw(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_findWireTarget: function() {
        return comp_ex_findWireTarget(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
