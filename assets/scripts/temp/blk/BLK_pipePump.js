/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_pressurePump");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.drawArrow = false;
  };


  function comp_setBars(blk) {
    blk.removeBar("liquid");
    blk.addLiquidBar(b => b.delegee.pumpLiqCur);
  };


  function comp_ex_createLinkVals(blk) {
    let arr = [];
    let i = 1;
    while(i < blk.pumpSize) {
      arr.push(i, 0, 1);
      i++;
    };

    return arr.toJavaArr(JAVA.int.TYPE);
  };



  function comp_onProximityUpdate(b) {
    b.pumpFrontB = b.presDumpTgs[0] == null ? null : b.presDumpTgs[0];
    b.pumpBackB = b.nearby((b.rotation + 2) % 4);
    if(b.pumpBackB != null && b.pumpBackB.team !== b.team) {
      b.pumpBackB = null;
    };
  };


  function comp_updateTile(b) {
    if(TIMER.sec) {
      b.onProximityUpdate();
      b.pumpPresCur = 0.0;
      if(b.pumpBackB != null) {
        if(b.pumpBackB.block instanceof MultiBlockLinkBlock) {
          b.pumpBackB = b.pumpBackB.linkedBuild;
        };
        if(b.pumpBackB.ex_getPres != null) {
          b.pumpPresCur = b.pumpBackB.ex_getPres();
        };
        if(checkCreatedByTemp(b.pumpBackB.block) && b.pumpBackB.block.ex_isSubInsOf("BLK_pipePump")) {
          b.pumpPresCur = b.delegee.presBase;
        };
      };
    };

    if(b.pumpLiqCur != null && b.liquids.get(b.pumpLiqCur) < 0.1) {
      b.pumpLiqCur = null;
    };

    b.presBase -= b.presBase.fEqual(0.0, 0.005) ? b.presBase : (b.presBase / 60.0 * Time.delta);
  };


  function comp_dumpOutputs(b) {
    if(b.pumpLiqCur != null) {
      b.dumpLiquid(b.pumpLiqCur, 2.0);
    };
  };


  function comp_acceptLiquid(b, b_f, liq) {
    if(b.liquids.get(liq) / b.block.liquidCapacity >= 0.98) return false;
    if(b.block.consumesLiquid(liq)) return true;
    if(MDL_cond.isAuxiliaryFluid(liq)) return false;
    if(LCPos.getRotation(b_f, b) !== b.rotation) return false;
    if(b.pumpLiqCur != null && liq !== b.pumpLiqCur) return false;

    b.pumpLiqCur = liq;

    return true;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * A Nx1 pressure pump that should be placed between pipes.
     * @class BLK_pipePump
     * @extends BLK_pressurePump
     */
    newClass().extendClass(PARENT[0], "BLK_pipePump").initClass()
    .setParent(MultiBlockCrafter)
    .setTags("blk-non-fac")
    .setParam({


      /**
       * `PARAM`: Width of the block. Replaces vanilla block size.
       * @memberof BLK_pipePump
       * @instance
       */
      pumpSize: 2,


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @override
       * @memberof BLK_pipePump
       * @instance
       */
      presDumpPons: tprov(() => []),


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


      /**
       * @memberof BLK_pipePump
       * @instance
       * @return {JavaArray<java.lang.Integer>}
       */
      ex_createLinkVals: function() {
        return comp_ex_createLinkVals(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


    /**
     * @class B_pipePump
     * @extends B_pressurePump
     */
    newClass().extendClass(PARENT[1], "B_pipePump").initClass()
    .setParent(MultiBlockCrafterBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @memberof B_pipePump
       * @instance
       */
      pumpFrontB: null,
      /**
       * `INTERNAL`
       * @memberof B_pipePump
       * @instance
       */
      pumpBackB: null,
      /**
       * `INTERNAL`
       * @memberof B_pipePump
       * @instance
       */
      pumpLiqCur: null,
      /**
       * `INTERNAL`
       * @memberof B_pipePump
       * @instance
       */
      pumpPresCur: 0.0,
      /**
       * `INTERNAL`
       * @memberof B_pipePump
       * @instance
       */
      presBase: 0.0,


    })
    .setMethod({


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      dumpOutputs: function() {
        comp_dumpOutputs(this);
      },


      acceptLiquid: function(b_f, liq) {
        return comp_acceptLiquid(this, b_f, liq);
      }
      .setProp({
        noSuper: true,
        boolMode: "and",
      }),


      canDumpLiquid: function(b_t, liq) {
        return this.pumpFrontB != null && this.pumpLiqCur != null && this.pumpFrontB.id === b_t.id;
      }
      .setProp({
        boolMode: "and",
      }),


      write: function(wr) {
        MDL_io.ct(wr, this.pumpLiqCur);
      },


      read: function(rd, revi) {
        this.pumpLiqCur = MDL_io.ct(rd);
      },


      /**
       * @memberof B_pipePump
       * @instance
       * @return {number}
       */
      ex_calcPresDumpRate: function() {
        return this.pumpFrontB == null || this.pumpBackB == null || this.pumpLiqCur == null || this.pumpFrontB.liquids.get(this.pumpLiqCur) < 0.01 ?
          -1.0 :
          this.pumpPresCur / 60.0;
      }
      .setProp({
        noSuper: true,
        mergeMode: function(valPrev, val) {
          return val < 0.0 ? 0.0 : (valPrev + val);
        },
      })


    }),


  ];


  /**
   * @override
   * @memberof BLK_pipePump
   * @param {Block} blk
   * @return {void}
   */
  module.exports[0].initContent = function(blk) {
    this.super("initContent", blk);

    blk.size = 1;
    blk.linkValues = blk.ex_createLinkVals();
    blk.presDumpPons.push(new Point2(blk.pumpSize, 0));
  };
