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


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.hasConsumers = true;
    if(!blk.presProd.fEqual(0.0)) MDL_event._c_onLoad(() => {
      Core.app.post(() => {
        MDL_recipeDict.addFldProdTerm(blk, blk.presProd > 0.0 ? VARGEN.auxPres : VARGEN.auxVac, Math.abs(blk.presProd), null);
      });
    });
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


    /**
     * Lovec version of pump that is capable of producing pressure.
     * @class BLK_liquidPump
     * @extends BLK_baseFluidBlock
     * @extends INTF_BLK_corrosionAcceptor
     * @extends INTF_BLK_fluidHeatAcceptor
     * @extends INTF_BLK_pressureProducer
     * @extends INTF_BLK_facilityBlock
     */
    newClass().extendClass(PARENT[0], "BLK_liquidPump").implement(INTF[0]).implement(INTF_A[0]).implement(INTF_B[0]).implement(INTF_C[0]).initClass()
    .setParent(Pump)
    .setTags("blk-pump")
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>: Pressure and vacuum are abstract fluids, this field must be true.
       * @memberof BLK_liquidPump
       * @instance
       */
      allowAux: true,


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class B_liquidPump
     * @extends B_baseFluidBlock
     * @extends INTF_B_corrosionAcceptor
     * @extends INTF_B_fluidHeatAcceptor
     * @extends INTF_B_pressureProducer
     * @extends INTF_B_facilityBlock
     */
    newClass().extendClass(PARENT[1], "B_liquidPump").implement(INTF[1]).implement(INTF_A[1]).implement(INTF_B[1]).implement(INTF_C[1]).initClass()
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
        this.ex_processData(wr);
      },


      read: function(rd, revi) {
        if(this.LCRevi === 5) rd.s();

        this.ex_processData(rd);
      },


      /**
       * @memberof B_liquidPump
       * @instance
       * @return {Liquid|null}
       */
      ex_getRsTg: function() {
        return tryVal(this.liquidDrop, null);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
