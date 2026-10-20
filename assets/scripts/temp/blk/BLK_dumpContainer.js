/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<StorageBlock, BLK_dumpContainer>} BLKDumpContainer
     */


    /**
     * @typedef {TemplateInstance<StorageBlock.StorageBuild, B_dumpContainer>} BDumpContainer
     * @prop {BLKDumpContainer} block
     */


    const PARENT = require("lovec/temp/blk/BLK_container");
    const INTF_BLK_contentMultiSelector = require("lovec/temp/intf/INTF_BLK_contentMultiSelector");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKDumpContainer} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.update = true;
    };


    /**
     * @private
     * @param {BLKDumpContainer} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(Stat.itemsMoved, 60.0 / blk.dumpTime, StatUnit.itemsSecond);
    };


    /**
     * @private
     * @param {BDumpContainer} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(b.delegee.ctTargets.length === 0) return;

        b.delegee.dumpTimeCur += b.edelta();
        if(b.delegee.dumpTimeCur >= b.block.dumpTime) {
            b.delegee.dumpTimeCur %= b.block.dumpTime;
            b.dump(b.delegee.ctTargets.random());
        };
    };


    /**
     * @private
     * @param {BDumpContainer} b
     * @param {Building} b_f
     * @param {Item} item
     * @return {boolean}
     */
    function comp_acceptItem(b, b_f, item) {
        return b_f === b || !MDL_cond.isContainer(b_f.block);
    };


    /**
     * @private
     * @param {BDumpContainer} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        b.self.ex_drawSelected();
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Unlike vanilla container, this block can dump selected items actively.
         * The output speed is controlled by `dumpTime`.
         * @class BLK_dumpContainer
         * @extends BLK_container
         * @extends INTF_BLK_contentMultiSelector
         */
        newClass()
        .extendClass(PARENT[0], "BLK_dumpContainer")
        .implement(INTF_BLK_contentMultiSelector[0])
        .initTemplate()
        .setParent("StorageBlock")
        .setTags()
        .setParam({})
        .setMethod({


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            outputsItems: function() {
                return true;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_dumpContainer
             * @instance
             * @func
             * @return {boolean}
             */
            ex_isSwitchDisableTarget: function() {
                return true;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


        /**
         * @class B_dumpContainer
         * @extends B_container
         * @extends INTF_B_contentMultiSelector
         */
        newClass()
        .extendClass(PARENT[1], "B_dumpContainer")
        .implement(INTF_BLK_contentMultiSelector[1])
        .initTemplate()
        .setParent("StorageBlock.StorageBuild")
        .setParam({})
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            },


            acceptItem: function(b_f, item) {
                return comp_acceptItem(this, b_f, item);
            }
            .setProp({
                boolMode: "and",
            }),


            drawSelect: function() {
                comp_drawSelect(this);
            },


            write: function(wr) {
                this.self.ex_processData(wr);
            },


            read: function(rd, revi) {
                if(this.delegee.LCRevi === 5) {
                    rd.s();
                };
                this.self.ex_processData(rd);
            },


        }),


    ];
