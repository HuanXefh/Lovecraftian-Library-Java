/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_cable");


  /* <---------- component ----------> */


  function comp_conductsTo(b, ob) {
    return !MDL_cond._isArmoredCable(ob.block) ?
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
    .setParam({})
    .setMethod({


      blends: function() {
        return BLKFragArmoredCable.setThis(this).blends.apply(BLKFragArmoredCable, arguments);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      blendsArmored: function(t, rot, otx, oty, orot, oblk) {
        return BLKFragArmoredCable.setThis(this).blendsArmored.apply(BLKFragArmoredCable, arguments);
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
    .setParam({})
    .setMethod({


      conductsTo: function(ob) {
        return comp_conductsTo(this, ob);
      }
      .setProp({
        boolMode: "and",
      }),


    }),


  ];
