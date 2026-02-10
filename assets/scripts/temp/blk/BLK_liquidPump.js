/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Lovec version of pump that is capable of producing pressure.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFluidBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_corrosionAcceptor");
  const INTF_A = require("lovec/temp/intf/INTF_BLK_fluidHeatAcceptor");
  const INTF_B = require("lovec/temp/intf/INTF_BLK_pressureProducer");
  const INTF_C = require("lovec/temp/intf/INTF_BLK_facilityBlock");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");


  const MOD_tmi = require("lovec/mod/MOD_tmi");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.hasConsumers = true;
    if(!blk.presProd.fEqual(0.0)) MDL_event._c_onLoad(() => {
      Core.app.post(() => {
        MDL_recipeDict.addFldProdTerm(blk, blk.presProd > 0.0 ? VARGEN.auxPres : VARGEN.auxVac, Math.abs(blk.presProd), null);
      });
    });

    MOD_tmi._r_presPump(blk, Math.abs(blk.presProd), blk.presProd < 0.0);
  };


  function comp_shouldConsume(b) {
    return b.enabled
      && !(b.block instanceof Pump) ? true : b.ex_getRsTg() != null
      && !b.block.delegee.presProd.fEqual(0.0) ? true : b.liquids.get(b.ex_getRsTg()) < (b.block.liquidCapacity - 0.01)
  };


  function comp_drawSelect(b) {
    LCDraw.contentIcon(b.x, b.y, b.ex_getRsTg(), b.block.size);
  };


  function comp_drawStatus(b) {
    if(b.block.enableDrawStatus) {
      MDL_draw._reg_blkStatus(b.x, b.y, b.block.size, b.status().color);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_liquidPump").implement(INTF[0]).implement(INTF_A[0]).implement(INTF_B[0]).implement(INTF_C[0]).initClass()
    .setParent(Pump)
    .setTags("blk-pump")
    .setParam({
      allowAux: true,
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_liquidPump").implement(INTF[1]).implement(INTF_A[1]).implement(INTF_B[1]).implement(INTF_C[1]).initClass()
    .setParent(Pump.PumpBuild)
    .setParam({})
    .setMethod({


      shouldConsume: function() {
        return comp_shouldConsume(this);
      }
      .setProp({
        noSuper: true,
      }),


      drawSelect: function() {
        comp_drawSelect(this);
      },


      drawStatus: function() {
        comp_drawStatus(this);
      }
      .setProp({
        noSuper: true,
      }),


      write: function(wr) {
        let LCRevi = processRevision(wr);
        this.ex_processData(wr, LCRevi);
      },


      read: function(rd, revi) {
        let LCRevi = processRevision(rd);
        this.ex_processData(rd, LCRevi);

        if(LCRevi < 1) {
          rd.s();
        };
      },


      ex_getRsTg: function() {
        return this.liquidDrop;
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
