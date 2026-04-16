/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.group = BlockGroup.projectors;
    blk.priority = VAR.prio_proj;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Parent for all generalized projector blocks (that do something on buildings/units in range).
     * @class BLK_baseProjector
     * @extends BLK_baseBlock
     */
    newClass().extendClass(PARENT[0], "BLK_baseProjector").initClass()
    .setParent(null)
    .setTags("blk-proj")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class B_baseProjector
     * @extends B_baseBlock
     */
    newClass().extendClass(PARENT[1], "B_baseProjector").initClass()
    .setParent(null)
    .setParam({})
    .setMethod({}),


  ];
