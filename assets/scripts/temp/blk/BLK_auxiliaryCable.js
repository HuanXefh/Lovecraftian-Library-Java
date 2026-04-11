/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_cable");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    blk.stats.remove(fetchStat("lovec", "blk0pow-safepowlvl"));
  };


  function comp_onProximityUpdate(b) {
    let safeLvl = Number.n8, tmpSafeLvl;
    b.proximity.each(
      ob => MDL_cond._isCable(ob.block),
      ob => {
        tmpSafeLvl = ob.ex_getMaxPowProdAllowed();
        if(tmpSafeLvl < safeLvl) {
          safeLvl = tmpSafeLvl;
        };
      },
    );
    b.maxPowProdAllowed = safeLvl;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Cable with dynamic safe power level, thus able to become member of other cable graphs.
     * <br> <SINGLESIZE>
     * @class BLK_auxiliaryCable
     * @extends BLK_cable
     */
    newClass().extendClass(PARENT[0], "BLK_auxiliaryCable").initClass()
    .setParent(ArmoredConveyor)
    .setTags("blk-pow", "blk-pow0trans", "blk-cable")
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof BLK_auxiliaryCable
       * @instance
       */
      maxPowProdAllowed: Number.n8,


    })
    .setMethod({


      setStats: function() {
        comp_setStats(this);
      },


    }),


    /**
     * @class B_auxiliaryCable
     * @extends B_cable
     */
    newClass().extendClass(PARENT[1], "B_auxiliaryCable").initClass()
    .setParent(ArmoredConveyor.ArmoredConveyorBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_auxiliaryCable
       * @instance
       */
      maxPowProdAllowed: Number.n8,


    })
    .setMethod({


      onProximityUpdate: function thisFun() {
        comp_onProximityUpdate(this);
        thisFun.funPrev.call(this);
      }
      .setProp({
        override: true,
      }),


      /**
       * @override
       * @memberof B_auxiliaryCable
       * @instance
       * @return {number}
       */
      ex_getMaxPowProdAllowed: function() {
        return this.maxPowProdAllowed;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
