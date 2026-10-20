/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Sorter, BLK_multiFilterGate>} BLKMultiFilterGate
     */


    /**
     * @typedef {TemplateInstance<Sorter.SorterBuild, B_multiFilterGate>} BMultiFilterGate
     * @prop {BLKMultiFilterGate} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseItemGate");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKMultiFilterGate} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.update = true;

        blk.saveConfig = false;
        blk.clearOnDoubleTap = false;

        blk.config(JAVA.string, (b, str) => {
            b.self.ex_accRsTargets(str, false);
            GLB_eff.fadePlacePack[b.block.size].at(b);
            b.sortItem = b.self.ex_accRsTargets("SPEC: read", false).first();
        });

        blk.config(JAVA.boolean, (b, bool) => {
            if(bool !== b.delegee.isInv) {
                b.delegee.isInv = bool;
                GLB_eff.fadePlacePack[b.block.size].at(b);
                BOX_trigger.invertSelection.fire();
            };
        });

        blk.config(JAVA.object_arr, (b, cfgArr) => {
            switch(cfgArr[0]) {
                case "SPEC: selector chunk" :
                    let
                        i = 2,
                        iCap = cfgArr.iCap(),
                        rs;
                    while(i < iCap) {
                        rs = MDL_content.getCt(cfgArr[i], ContentGetModes.RS);
                        if(rs != null) {
                            b.self.ex_accRsTargets(rs, true);
                        };
                        i++;
                    };
                    GLB_eff.fadePlacePack[b.block.size].at(b);
                    b.delegee.isInv = cfgArr[1];
                    b.sortItem = b.self.ex_accRsTargets("SPEC: read", false).first();
                    break;

                case "SPEC: selector" :
                    b.self.ex_accRsTargets(cfgArr[1], cfgArr[2]);
                    GLB_eff.fadePlacePack[b.block.size].at(b);
                    b.sortItem = b.self.ex_accRsTargets("SPEC: read", false).first();
            };
        });
    };


    /**
     * @private
     * @param {BLKMultiFilterGate} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.invReg = fetchRegion(blk, "-inv");
    };


    /**
     * @private
     * @param {BLKMultiFilterGate} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        blk.removeBar("items");
    };


    /**
     * @private
     * @param {BMultiFilterGate} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(Vars.headless) return;
        b.delegee.displayedRsTarget = b.delegee.rsTargets.length === 0 ?
            null :
            b.delegee.rsTargets[Math.floor((Time.globalTime / GLB_param.ICON_TAG_FLICKERING_INTERVAL) % b.delegee.rsTargets.length)];
    };


    /**
     * @private
     * @param {BMultiFilterGate} b
     * @param {Item} item
     * @param {Building} b_f
     * @param {boolean} isFlip
     * @return {Building|null}
     */
    function comp_getTileTarget(b, item, b_f, isFlip) {
        let
            rot = b_f.relativeTo(b),
            b_t = b.nearby(rot),
            target = null;

        if((b.block.delegee.filterScr.get(b, b_f, item, b.delegee.rsTargets) !== b.delegee.isInv) === b.enabled) {
            if(b.isSame(b_f) && b.isSame(b_t)) return target;
            target = b_t;
        } else {
            let
                b_s1 = b.nearby(Mathf.mod(rot - 1, 4)),
                b_s2 = b.nearby(Mathf.mod(rot + 1, 4)),
                cond1 = b_s1 != null && b_s1.team === b.team && !(b_s1.block.instantTransfer && b_f.block.instantTransfer) && b_s1.acceptItem(b, item),
                cond2 = b_s2 != null && b_s2.team === b.team && !(b_s2.block.instantTransfer && b_f.block.instantTransfer) && b_s2.acceptItem(b, item);

            if(cond1 && !cond2) {
                target = b_s1;
            } else if(!cond1 && cond2) {
                target = b_s2;
            } else if(!cond2) {
                return target;
            } else {
                target = (b.rotation & (1 << rot)) === 0 ? b_s1 : b_s2;
                if(isFlip) {
                    b.rotation ^= (1 << rot);
                };
            };
        };

        return target;
    };


    /**
     * @private
     * @param {BMultiFilterGate} b
     * @param {Table} tb
     * @return {void}
     */
    function comp_buildConfiguration(b, tb) {
        MDL_table.setCtSelectMulti(
            tb, b.block, GLB_varGen.allItems,
            () => b.delegee.rsTargets, val => b.configure(val),
            null,
            {rowAmt: b.block.selectionRows, colAmt: b.block.selectionColumns, closeSelect: false},
        );

        tb.row();
        tb.table(Styles.none, tb1 => {
            MDL_table.btnCfgToggle(tb1, b, GLB_varGen.icons.swap, GLB_varGen.icons.swap, b.delegee.isInv)
            .tooltip(MDL_bundle.getInfo("lovec", "tt-invert-selection"), true);
            MDL_table.btnCfg(tb1, b, b => {
                b.configure("SPEC: clear");
                b.deselect();
            }, GLB_varGen.icons.cross)
            .tooltip(MDL_bundle.getInfo("lovec", "tt-clear-selection"), true);
        });
    };


    /**
     * @private
     * @param {BMultiFilterGate} b
     * @return {void}
     */
    function comp_draw(b) {
        if(b.delegee.isInv) {
            Draw.rect(b.block.delegee.invReg, b.x, b.y);
        };
    };


    /**
     * @private
     * @param {BMultiFilterGate} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        LCDraw.contentIcon(b.x, b.y, b.delegee.displayedRsTarget, b.block.size, 0.75);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Like {@link BLK_filterGate} but for multi-item selection.
         * <br> `SINGLESIZE`
         * @class BLK_multiFilterGate
         * @extends BLK_baseItemGate
         */
        newClass()
        .extendClass(PARENT[0], "BLK_multiFilterGate")
        .initTemplate()
        .setParent(Sorter)
        .setTags()
        .setParam({


            /**
             * `PARAM`: See {@link BLK_filterGate}.
             * <br> `ARGS`: b, b_f, item, rsTargets.
             * @memberof BLK_multiFilterGate
             * @instance
             * @type {Boolf4<Building, Building, Item, Array<Item>>}
             */
            filterScr: boolf4(function(b, b_f, item, rsTargets) {return rsTargets.includes(item)}),


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_multiFilterGate
             * @instance
             * @type {TextureRegion}
             */
            invReg: null,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            load: function() {
                comp_load(this);
            },


            setBars: function() {
                comp_setBars(this);
            },


        }),


        /**
         * @class B_multiFilterGate
         * @extends B_baseItemGate
         */
        newClass()
        .extendClass(PARENT[1], "B_multiFilterGate")
        .initTemplate()
        .setParent(Sorter.SorterBuild)
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_multiFilterGate
             * @instance
             * @type {boolean}
             */
            isInv: false,
            /**
             * `INTERNAL`
             * @memberof B_multiFilterGate
             * @instance
             * @type {TDynamic<Array<Item>>}
             */
            rsTargets: tprov(() => []),
            /**
             * `INTERNAL`
             * @memberof B_multiFilterGate
             * @instance
             * @type {Item|null}
             */
            displayedRsTarget: null,


        })
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            },


            getTileTarget: function(item, b_f, isFlip) {
                return comp_getTileTarget(this, item, b_f, isFlip);
            }
            .setProp({
                noSuper: true,
            }),


            buildConfiguration: function(tb) {
                comp_buildConfiguration(this, tb)
            }
            .setProp({
                noSuper: true,
            }),


            config: function() {
                return ["SPEC: selector chunk", this.isInv]
                .pushAll(this.delegee.rsTargets.map(rs => rs == null ? "null" : rs.name))
                .toJavaArr(JAVA.object);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            draw: function() {
                comp_draw(this);
            },


            drawSelect: function() {
                comp_drawSelect(this);
            }
            .setProp({
                noSuper: true,
            }),


            write: function(wr) {
                MDL_io.cts(wr, this.delegee.rsTargets);
                wr.bool(this.delegee.isInv);
            },


            read: function(rd, revi) {
                if(this.delegee.LCRevi === 5) {
                    rd.s();
                };
                MDL_io.cts(rd, this.delegee.rsTargets);
                this.sortItem = this.delegee.rsTargets.first();
                this.delegee.isInv = rd.bool();
            },


            /**
             * @memberof B_multiFilterGate
             * @instance
             * @func
             * @param {string|Item} param
             * @param {boolean} isAdd
             * @return {Array<Item>}
             */
            ex_accRsTargets: function(param, isAdd) {
                switch(param) {
                    case "SPEC: read" :
                        return this.delegee.rsTargets;
                    case "SPEC: clear" :
                        this.block.lastConfig = "SPEC: clear";
                        return this.delegee.rsTargets.clear();
                };
                return isAdd ?
                    this.delegee.rsTargets.pushUnique(param) :
                    this.delegee.rsTargets.remove(param);
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
