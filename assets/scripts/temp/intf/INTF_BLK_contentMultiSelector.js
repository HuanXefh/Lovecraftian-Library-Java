/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_contentMultiSelector>} INTFBLKContentMultiSelector
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_contentMultiSelector>} INTFBContentMultiSelector
     * @prop {INTFBLKContentMultiSelector} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKContentMultiSelector} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.delegee.selectionQueue.pushAll(blk.self.ex_findSelectionTargets());

        blk.configurable = true;
        blk.saveConfig = false;
        blk.clearOnDoubleTap = false;

        blk.config(JAVA.string, (b, str) => {
            b.self.ex_accCtTargets(str, false);
            b.self.ex_onSelectorUpdate();
            GLB_eff.fadePlacePack[blk.size].at(b);
        });
        blk.config(JAVA.object_arr, (b, cfgArr) => {
            switch(cfgArr[0]) {
                case "selectorBlock" :
                    let
                        i = 1,
                        iCap = cfgArr.iCap(),
                        ct;
                    while(i < iCap) {
                        ct = MDL_content.getCt(cfgArr[i], null, true);
                        if(ct != null) {
                            b.self.ex_accCtTargets(ct, true);
                        };
                        i++;
                    };
                    b.self.ex_onSelectorConfigLoad(cfgArr);
                    GLB_eff.fadePlacePack[blk.size].at(b);
                    break;

                case "selector" :
                    b.self.ex_accCtTargets(cfgArr[1], cfgArr[2]);
                    b.self.ex_onSelectorUpdate();
                    GLB_eff.fadePlacePack[blk.size].at(b);
                    break;
            };
        });
    };


    /**
     * @private
     * @param {INTFBContentMultiSelector} b
     * @return {void}
     */
    function comp_updateTile(b) {
        b.self.ex_updateDisplayedCtTarget();
    };


    /**
     * @private
     * @param {INTFBContentMultiSelector} b
     * @param {Table} tb
     * @return {void}
     */
    function comp_buildConfiguration(b, tb) {
        b.self.ex_buildSelector(tb);
        tb.row();
        MDL_table.btnCfg(
            tb, b,
            b => {
                b.configure("clear");
                b.deselect();
            },
            GLB_varGen.icons.cross,
        ).tooltip(MDL_bundle.getInfo("lovec", "tt-clear-selection"), true)
    };


    /**
     * @private
     * @param {INTFBContentMultiSelector} b
     * @return {void}
     */
    function comp_ex_updateDisplayedCtTarget(b) {
        if(Vars.headless) return;

        b.delegee.displayedCtTarget = b.delegee.ctTargets.length === 0 ?
            null :
            b.delegee.ctTargets[Math.floor((Time.globalTime / GLB_param.ICON_TAG_FLICKERING_INTERVAL) % b.delegee.ctTargets.length)];
    };


    /**
     * @private
     * @param {INTFBContentMultiSelector} b
     * @param {Table} tb
     * @return {void}
     */
    function comp_ex_buildSelector(b, tb) {
        MDL_table.setCtSelectMulti(
            tb, b.block, b.block.delegee.selectionQueue,
            () => b.self.ex_accCtTargets("read", false), val => b.configure(val),
            null,
            {rowAmt: b.block.selectionRows, colAmt: b.block.selectionColumns, closeSelect: false},
        );
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Handles content multi-selection.
         * @class INTF_BLK_contentMultiSelector
         */
        new CLS_interface("INTF_BLK_contentMultiSelector", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`: See {@link INTF_BLK_contentSelector#selectionQueue}.
                     * @memberof INTF_BLK_contentMultiSelector
                     * @instance
                     * @type {TDynamic<Array<UnlockableContent>>}
                     */
                    selectionQueue: tprov(() => []),


                };
            },


            init: function() {
                comp_init(this);
            },


            /**
             * See {@link INTF_BLK_contentSelector#ex_findSelectionTargets}.
             * @memberof INTF_BLK_contentMultiSelector
             * @instance
             * @func
             * @return {Array<UnlockableContent>}
             */
            ex_findSelectionTargets: function() {
                return Vars.content.items().toArray();
            }
            .setProp({
                noSuper: true,
            }),


        }),


        /**
         * @class INTF_B_contentMultiSelector
         */
        new CLS_interface("INTF_B_contentMultiSelector", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`: Contents selected.
                     * @memberof INTF_B_contentMultiSelector
                     * @instance
                     * @type {TDynamic<Array<UnlockableContent>>}
                     */
                    ctTargets: tprov(() => []),
                    /**
                     * `INTERNAL`: Content displayed in {@link INTF_B_contentMultiSelector#ex_drawSelected}.
                     * @memberof INTF_B_contentMultiSelector
                     * @instance
                     * @type {UnlockableContent|null}
                     */
                    displayedCtTarget: null,


                };
            },


            updateTile: function() {
                comp_updateTile(this);
            },


            buildConfiguration: function(tb) {
                comp_buildConfiguration(this, tb);
            }
            .setProp({
                noSuper: true,
            }),


            config: function() {
                return ["selectorBlock"]
                .pushAll(this.delegee.ctTargets.map(ct => ct == null ? "null" : ct.name))
                .toJavaArr(JAVA.object);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * Use this method to add/remove a content from selected list.
             * @memberof INTF_B_contentMultiSelector
             * @instance
             * @func
             * @param {string|UnlockableContent} param
             * @param {boolean} isAdd
             * @return {Array<UnlockableContent>}
             */
            ex_accCtTargets: function(param, isAdd) {
                switch(param) {
                    case "read" :
                        return this.delegee.ctTargets;
                    case "clear" :
                        this.block.lastConfig = "clear";
                        return this.delegee.ctTargets.clear();
                };

                return isAdd ?
                    this.delegee.ctTargets.pushUnique(param) :
                    this.delegee.ctTargets.removeAll(param);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_contentMultiSelector
             * @instance
             * @func
             * @param {Table} tb
             * @return {void}
             */
            ex_buildSelector: function(tb) {
                comp_ex_buildSelector(this, tb);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Called just after config from multi-selector is loaded.
             * <br> `LATER`
             * @memberof INTF_B_contentMultiSelector
             * @instance
             * @func
             * @param {Array} cfgArr
             * @return {void}
             */
            ex_onSelectorConfigLoad: function(cfgArr) {

            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * See {@link INTF_B_contentSelector}.
             * @memberof INTF_B_contentMultiSelector
             * @instance
             * @func
             * @return {void}
             */
            ex_onSelectorUpdate: function() {
                if(!Vars.headless && this.block.drawCached) this.recache();
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_contentMultiSelector
             * @instance
             * @func
             * @return {void}
             */
            ex_updateDisplayedCtTarget: function() {
                comp_ex_updateDisplayedCtTarget(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Use this method to draw icon of selected contents alternately.
             * @memberof INTF_B_contentMultiSelector
             * @instance
             * @func
             * @return {void}
             */
            ex_drawSelected: function() {
                LCDraw.contentIcon(this.x, this.y, this.delegee.displayedCtTarget, this.block.size, 0.75);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof INTF_B_contentMultiSelector
             * @instance
             * @func
             * @return {TextureRegion|null}
             */
            ex_getRcIcon: function() {
                return this.delegee.displayedCtTarget == null ?
                    null :
                    this.delegee.displayedCtTarget.uiIcon;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * @memberof INTF_B_contentMultiSelector
             * @instance
             * @func
             * @param {Writes|Reads} wr0rd
             * @return {void}
             */
            ex_processData: function(wr0rd) {
                processData(
                    wr0rd,
                    wr => {
                        MDL_io.cts(wr, this.delegee.ctTargets);
                    },
                    rd => {
                        MDL_io.cts(rd, this.delegee.ctTargets);
                    },
                );
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


        }),


    ];
