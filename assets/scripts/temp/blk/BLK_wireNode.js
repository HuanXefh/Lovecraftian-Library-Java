/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_basePowerTransmitter");
  const INTF = require("lovec/temp/intf/INTF_BLK_wireDamageInducer");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.consumesPower = true;
    blk.conductivePower = true;
    blk.connectedPower = true;
    if(blk.overwriteVanillaProp) {
      blk.underBullets = blk.size === 1;
    };

    blk.linkFilter = boolf2(DB_misc.db["block"]["nodeLinkFilter"].read(blk.linkMode, Function.airTrue));
  };


  function comp_setStats(blk) {
    if(blk.minRadFrac > 0.0) blk.stats.add(fetchStat("lovec", "blk-minr"), blk.laserRange * blk.minRadFrac, StatUnit.blocks);
  };


  function comp_linkValid(blk, b, b_t) {
    return Mathf.dst(b.x, b.y, b_t.x, b_t.y) >= blk.laserRange * Vars.tilesize * blk.minRadFrac && blk.linkFilter.get(b, b_t);
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    if(blk.drawRange) {
      Draw.color(valid ? Pal.accent : Pal.remove, 0.3);
      LCDraw.ring(tx.toFCoord(blk.size), ty.toFCoord(blk.size), blk.laserRange * Vars.tilesize * blk.minRadFrac, blk.laserRange * Vars.tilesize);
      Draw.color();
    };
    if(blk.autolink) {
      let t = Vars.world.tile(tx, ty);
      if(t != null) {
        blk.getPotentialLinks(t, Vars.player.team(), ob => {
          Draw.color(blk.laserColor1, Renderer.laserOpacity * 0.5);
          blk.drawLaser(tx.toFCoord(blk.size), ty.toFCoord(blk.size), ob.x, ob.y, blk.size, ob.block.size);
          Drawf.square(ob.x, ob.y, ob.block.size * Vars.tilesize * 0.5 + 2.0, Pal.place);
        });
        Draw.color();
      };
    };
  };


  function comp_drawLaser(blk, x1, y1, x2, y2, size1, size2) {
    let
      ang = Angles.angle(x1, y1, x2, y2),
      offX = Mathf.cosDeg(ang),
      offY = Mathf.sinDeg(ang),
      offScl1 = size1 * Vars.tilesize * 0.5 - 0.5,
      offScl2 = size2 * Vars.tilesize * 0.5 - 0.5;

    LCDrawf.wire(
      x1 + offX * offScl1,
      y1 + offY * offScl1,
      x2 - offX * offScl2,
      y2 - offY * offScl2,
      blk.wireMat,
      blk.ex_getWireStrokeScl(),
      blk.ex_getWireGlowAlpha(x1, y1, x2, y2),
      Layer.power + blk.size * 0.001,
    );
  };


  function comp_drawSelect(b) {
    if(b.block.drawRange) {
      Draw.color(Pal.accent, 0.3);
      LCDraw.ring(b.x, b.y, b.block.laserRange * Vars.tilesize * b.block.delegee.minRadFrac, b.block.laserRange * Vars.tilesize);
      Draw.color();
    };
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


    /**
     * A greatly nerfed power node with minimum range.
     * @class BLK_wireNode
     * @extends BLK_basePowerTransmitter
     * @extends INTF_BLK_wireDamageInducer
     */
    newClass().extendClass(PARENT[0], "BLK_wireNode").implement(INTF[0]).initClass()
    .setParent(PowerNode)
    .setTags()
    .setParam({


      /**
       * `PARAM`: Determines filter for valid targets. See {@link DB_misc}.
       * @memberof BLK_wireNode
       * @instance
       */
      linkMode: "any",
      /**
       * `PARAM`: Minimum radius as fraction of maximum radius.
       * @memberof BLK_wireNode
       * @instance
       */
      minRadFrac: 0.0,


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @memberof BLK_wireNode
       * @instance
       */
      linkFilter: null,


      /* <------------------------------ vanilla ------------------------------ */


      autolink: false,


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
      }
      .setProp({
        noSuper: true,
      }),


      drawLaser: function(x1, y1, x2, y2, size1, size2) {
        comp_drawLaser(this, x1, y1, x2, y2, size1, size2);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @override
       * @memberof BLK_wireNode
       * @instance
       * @return {number}
       */
      ex_getWireStrokeScl: function() {
        return this.laserScale;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    /**
     * @class B_wireNode
     * @extends B_basePowerTransmitter
     * @extends INTF_B_wireDamageInducer
     */
    newClass().extendClass(PARENT[1], "B_wireNode").implement(INTF[1]).initClass()
    .setParent(PowerNode.PowerNodeBuild)
    .setParam({})
    .setMethod({


      drawSelect: function() {
        comp_drawSelect(this);
      }
      .setProp({
        noSuper: true,
      }),


      drawConfigure: function() {
        comp_drawConfigure(this);
      },


      /**
       * See {@link B_wireRelay#ex_findWireTarget}.
       * @override
       * @memberof B_wireNode
       * @instance
       * @return {Building|null}
       */
      ex_findWireTarget: function() {
        return comp_ex_findWireTarget(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
