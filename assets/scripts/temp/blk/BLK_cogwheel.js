/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseTorqueBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.size % 2 === 0) ERROR_HANDLER.throw("evenSizedCogwheel", blk.name);

    blk.group = BlockGroup.none;
    blk.priority = TargetPriority.transport;
    blk.update = true;
    blk.configurable = true;
    blk.drawDisabled = true;

    if(blk.overwriteVanillaProp) {
      blk.solid = false;
      blk.underBullets = true;
    };

    blk.config(JAVA.boolean, (b, bool) => {
      b.onProximityUpdate();
      b.delegee.isInv = bool;
      b.delegee.rpmCur = b.ex_calcRpmTg();
      MDL_effect._e_click(b.x, b.y, b.team.color);
      Sounds.click.at(b);
    });
  };


  function comp_load(blk) {
    blk.invReg = fetchRegion(blk, "-inv", "");
    blk.cogDrawW = blk.region.width * 2.0 * 1.06 / Vars.tilesize;
    blk.cogInvOffAng = 22.5 / (blk.size + 1) * 2.0;
  };


  function comp_unitOn(b, unit) {
    let dst = Mathf.dst(b.x, b.y, unit.x, unit.y);
    (dst > 3.0 || unit.hitSize > (b.block.size + 0.5) * Vars.tilesize) ?
      unit.impulse(Tmp.v1.set(unit).sub(b).rotate90(Mathf.sign(!b.isInv)).nor().scl(b.rpmCur * 3.0 * b.block.size / Math.max(dst * 0.7, 1.0))) :
      MDL_call.rotateUnit(unit, b.rpmCur * 0.2 * Mathf.sign(!b.isInv));

    if(TIMER.sec && b.rpmCur > 1.0) {
      TRIGGER.cogwheelUnitSpin.fire(b, unit);
    };
  };


  function comp_configTapped(b) {
    b.configure(!b.isInv);
    return false;
  };


  function comp_draw(b) {
    b.drawTeamTop();

    b.ex_drawCog();
  };


  function comp_ex_updateTorTransTgs(b) {
    b.torTransTgs.clear();
    let size = b.block.size, rot;
    while(size > 0) {
      rot = 0;
      while(rot < 4) {
        let ob = b.ex_findCog(size, rot);
        if(ob != null) b.torTransTgs.push(ob);
        rot++;
      };
      size -= 2;
    };
  };


  function comp_ex_findCog(b, size, rot) {
    let pon2, dstT = (size + 1) / 2;
    switch(rot) {
      case 0 :
        pon2 = Tmp.p1.set(-dstT, 0);
        break;
      case 1 :
        pon2 = Tmp.p1.set(0, -dstT);
        break;
      case 2 :
        pon2 = Tmp.p1.set(dstT, 0);
        break;
      case 3 :
        pon2 = Tmp.p1.set(0, dstT);
        break;
    };
    let ot = b.tile.nearby(pon2);
    if(ot == null) return null;
    let ob = ot.build;
    if(
      ob == null
        || ob === b
        || (ob.tileX() !== b.tileX() && ob.tileY() !== b.tileY())
        || !b.ex_checkCogTransValid(ob)
    ) {
      return null;
    };

    return ob;
  };


  function comp_ex_drawCog(b) {
    let ang = Mathf.mod(b.torProg, 90.0);

    processZ(Layer.block + b.block.size * 0.001 + 0.72, 1);

    if(b.isInv) {
      Draw.rect(b.block.delegee.invReg, b.x, b.y, b.block.delegee.cogDrawW, b.block.delegee.cogDrawW, -ang + 90.0 + b.block.delegee.cogInvOffAng);
      Draw.alpha(1.0 - ang / 90.0);
      Draw.rect(b.block.delegee.invReg, b.x, b.y, b.block.delegee.cogDrawW, b.block.delegee.cogDrawW, -ang + b.block.delegee.cogInvOffAng);
    } else {
      Draw.rect(b.block.region, b.x, b.y, b.block.delegee.cogDrawW, b.block.delegee.cogDrawW, ang);
      Draw.alpha(ang / 90.0);
      Draw.rect(b.block.region, b.x, b.y, b.block.delegee.cogDrawW, b.block.delegee.cogDrawW, ang - 90.0);
    };
    Draw.color();

    processZ(null, 1);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Simply cogwheels.
     * @class BLK_cogwheel
     * @extends BLK_baseTorqueBlock
     */
    newClass().extendClass(PARENT[0], "BLK_cogwheel").initClass()
    .setParent(Wall)
    .setTags("blk-cog")
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof BLK_cogwheel
       * @instance
       */
      skipTorFetch: true,
      /**
       * <INTERNAL>
       * @memberof BLK_cogwheel
       * @instance
       */
      skipTorSupply: true,
      /**
       * <INTERNAL>
       * @memberof BLK_cogwheel
       * @instance
       */
      invReg: null,
      /**
       * <INTERNAL>
       * @memberof BLK_cogwheel
       * @instance
       */
      cogDrawW: 0.0,
      /**
       * <INTERNAL>
       * @memberof BLK_cogwheel
       * @instance
       */
      cogInvOffAng: 0.0,


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      load: function() {
        comp_load(this);
      },


    }),


    /**
     * @class B_cogwheel
     * @extends B_baseTorqueBlock
     */
    newClass().extendClass(PARENT[1], "B_cogwheel").initClass()
    .setParent(Wall.WallBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_cogwheel
       * @instance
       */
      isInv: false,


    })
    .setMethod({


      unitOn: function(unit) {
        comp_unitOn(this, unit);
      },


      configTapped: function() {
        return comp_configTapped(this);
      }
      .setProp({
        noSuper: true,
      }),


      config: function() {
        return this.isInv;
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
       * @override
       * @memberof B_cogwheel
       * @instance
       * @return {void}
       */
      ex_updateTorTransTgs: function() {
        comp_ex_updateTorTransTgs(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @override
       * @memberof B_cogwheel
       * @instance
       * @param {Building} b_t
       * @return {number}
       */
      ex_calcRpmTrans: function(b_t) {
        return this.rpmCur * this.block.size;
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


      /**
       * @override
       * @memberof B_cogwheel
       * @instance
       * @param {Building} b_f
       * @return {number}
       */
      ex_calcRpmTransScl: function(b_f) {
        return 1.0 / this.block.size;
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


      /**
       * @override
       * @memberof B_cogwheel
       * @instance
       * @param {Building} ob
       * @return {boolean}
       */
      ex_checkTorTransValid: function(ob) {
        return tryJsProp(ob, "isInv", false) !== this.isInv;
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


      /**
       * @memberof B_cogwheel
       * @instance
       * @param {Building} ob
       * @return {boolean}
       */
      ex_checkCogTransValid: function(ob) {
        return MDL_cond._isCogwheel(ob.block);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * @memberof B_cogwheel
       * @instance
       * @param {number} size
       * @param {number} rot
       * @return {Building|null}
       */
      ex_findCog: function(size, rot) {
        return comp_ex_findCog(this, size, rot);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


      /**
       * @memberof B_cogwheel
       * @instance
       * @return {void}
       */
      ex_drawCog: function() {
        comp_ex_drawCog(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof B_cogwheel
       * @instance
       * @param {Writes|Reads} wr0rd
       * @return {void}
       */
      ex_processData: function(wr0rd) {
        processData(
          wr0rd, this.LCRevi,
          (wr, revi) => {
            wr.bool(this.isInv);
          },

          (rd, revi) => {
            this.isInv = rd.bool();
          },
        );
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
