/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, BLK_baseProjector>} BLKBaseProjector
     */


    /**
     * @typedef {TemplateInstance<Building, B_baseProjector>} BBaseProjector
     * @prop {BLKBaseProjector} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKBaseProjector} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.group = BlockGroup.projectors;
        blk.priority = GLB_var.priority.proj;
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Parent for all generalized projector blocks (that do something on buildings/units in range).
         * @class BLK_baseProjector
         * @extends BLK_baseBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_baseProjector")
        .initTemplate()
        .setParent(null)
        .setTags()
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
        newClass()
        .extendClass(PARENT[1], "B_baseProjector")
        .initTemplate()
        .setParent(null)
        .setParam({})
        .setMethod({}),


    ];
