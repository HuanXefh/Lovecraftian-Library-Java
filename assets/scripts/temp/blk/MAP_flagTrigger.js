/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, MAP_flagTrigger>} MAPFlagTrigger
     */


    /**
     * @typedef {TemplateInstance<Building, B_flagTrigger>} BFlagTrigger
     * @prop {MAPFlagTrigger} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseLogicBlock");
    const INTF_BLK_mapBlock = require("lovec/temp/intf/INTF_BLK_mapBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BFlagTrigger} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(b.delegee.isDormant || !MDL_flag.checkFlag(String(b.block.self.ex_getFlagStr(b)))) return;
        if(b.block.delegee.triggerOnlyOnce) {
            b.delegee.isDormant = true;
        };
        b.self.ex_onFlagTriggered();
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * This block will be triggered when a specific flag is set.
         * @class MAP_flagTrigger
         * @extends BLK_baseLogicBlock
         * @extends INTF_BLK_mapBlock
         */
        newClass()
        .extendClass(PARENT[0], "MAP_flagTrigger")
        .implement(INTF_BLK_mapBlock[0])
        .initTemplate()
        .setParent(null)
        .setTags()
        .setParam({


            /**
             * `PARAM`: If true, this block will be triggered only once and become dormant forever.
             * @memberof MAP_flagTrigger
             * @instance
             * @type {boolean}
             */
            triggerOnlyOnce: false,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof MAP_flagTrigger
             * @instance
             * @type {boolean}
             */
            isWorldBlock: true,


            /* <------------------------------ vanilla ------------------------------> */


            forceDark: true,


        })
        .setMethod({


            /**
             * If the string returned is found in map flags, this block will be triggered.
             * <br> `LATER`
             * @memberof MAP_flagTrigger
             * @instance
             * @func
             * @param {BFlagTrigger} b
             * @return {string}
             */
            ex_getFlagStr: function(b) {
                return "";
            }
            .setProp({
                noSuper: true,
            }),


        }),


        /**
         * @class B_flagTrigger
         * @extends B_baseLogicBlock
         * @extends INTF_B_mapBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_flagTrigger")
        .implement(INTF_BLK_mapBlock[1])
        .initTemplate()
        .setParent(null)
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_flagTrigger
             * @instance
             * @type {boolean}
             */
            isDormant: false,


        })
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            },


            write: function(wr) {
                wr.bool(this.delegee.isDormant);
            },


            read: function(rd, revi) {
                if(this.delegee.LCRevi === 5) {
                    rd.s();
                };
                this.delegee.isDormant = rd.bool();
            },


            /**
             * Called every frame when a flag returned by {@link MAP_flagTrigger#ex_getFlagStr} is set.
             * If the block triggers only once, this method is also called only once.
             * <br> `LATER`
             * @memberof B_flagTrigger
             * @instance
             * @func
             * @return {void}
             */
            ex_onFlagTriggered: function() {

            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
