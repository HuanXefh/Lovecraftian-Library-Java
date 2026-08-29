/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_cable");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.armoredCableUpdater = new BLKArmoredCableUpdater(blk);
  };


  function comp_created(b) {
    b.armoredCableUpdater = new BArmoredCableUpdater(b.block.delegee.armoredCableUpdater, b);
  };


  function comp_conductsTo(b, ob) {
    return !MDL_cond.isArmoredCable(ob.block) ?
      (b.front() === ob || b.back() === ob) :
      (b.front() === ob || ob.front() === b);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * {@link BLK_cable} but no side conductivity.
     * <br> `SINGLESIZE`
     * @class BLK_armoredCable
     * @extends BLK_cable
     */
    newClass().extendClass(PARENT[0], "BLK_armoredCable").initClass()
    .setParent(ArmoredConveyor)
    .setTags()
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @memberof BLK_armoredCable
       * @instance
       */
      armoredCableUpdater: null,


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      blends: function() {
        return this.armoredCableUpdater.blends.apply(this.armoredCableUpdater, arguments);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      blendsArmored: function(t, rot, otx, oty, orot, oblk) {
        return this.armoredCableUpdater.blendsArmored.apply(this.armoredCableUpdater, arguments);
      }
      .setProp({
        noSuper: true,
      }),


    }),


    /**
     * @class B_armoredCable
     * @extends B_cable
     */
    newClass().extendClass(PARENT[1], "B_armoredCable").initClass()
    .setParent(ArmoredConveyor.ArmoredConveyorBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @memberof B_armoredCable
       * @instance
       */
      armoredCableUpdater: null,


    })
    .setMethod({


      created: function() {
        comp_created(this);
      },


      conductsTo: function(ob) {
        return comp_conductsTo(this, ob);
      }
      .setProp({
        boolMode: "and",
      }),


    }),


  ];
