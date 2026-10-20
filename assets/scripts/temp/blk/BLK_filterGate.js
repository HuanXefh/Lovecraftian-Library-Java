/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Sorter, BLK_filterGate>} BLKFilterGate
     */


    /**
     * @typedef {TemplateInstance<Sorter.SorterBuild, B_filterGate>} BFilterGate
     * @prop {BLKFilterGate} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseItemGate");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKFilterGate} blk
     * @return {void}
     */
    function comp_init(blk) {
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
                    b.sortItem = MDL_content.getCt(cfgArr[1], ContentGetModes.RS);
                    b.delegee.isInv = cfgArr[2];
                    GLB_eff.fadePlacePack[b.block.size].at(b);
                    break;
            };
        });
    };


    /**
     * @private
     * @param {BLKFilterGate} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.invReg = fetchRegion(blk, "-inv");
    };


    /**
     * @private
     * @param {BLKFilterGate} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        blk.removeBar("items");
    };


    /**
     * @private
     * @param {BFilterGate} b
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

        if((b.block.delegee.filterScr.get(b, b_f, item) !== b.delegee.isInv) === b.enabled) {
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
     * @param {BFilterGate} b
     * @param {Table} tb
     * @return {void}
     */
    function comp_buildConfiguration(b, tb) {
        if(!b.block.delegee.hideSelection) {
            MDL_table.setCtSelect(
                tb, b.block, GLB_varGen.allItems,
                () => b.sortItem, val => b.configure(val),
                null,
                {rowAmt: b.block.selectionRows, colAmt: b.block.selectionColumns, closeSelect: false},
            );
        };

        tb.row();
        MDL_table.btnCfgToggle(tb, b, GLB_varGen.icons.swap, GLB_varGen.icons.swap, b.delegee.isInv)
        .tooltip(MDL_bundle.getInfo("lovec", "tt-invert-selection"), true);
    };


    /**
     * @private
     * @param {BFilterGate} b
     * @return {void}
     */
    function comp_draw(b) {
        if(b.delegee.isInv) {
            Draw.rect(b.block.delegee.invReg, b.x, b.y);
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Sorter with `blk.invert` being useless.
         * <br> `SINGLESIZE`
         * @class BLK_filterGate
         * @extends BLK_baseItemGate
         */
        newClass()
        .extendClass(PARENT[0], "BLK_filterGate")
        .initTemplate()
        .setParent("Sorter")
        .setTags()
        .setParam({


            /**
             * `PARAM`: Item is selected when this returns true.
             * `ARGS`: b, b_f, item.
             * @memberof BLK_filterGate
             * @instance
             * @type {Boolf3<BFilterGate, Building, Item>}
             */
            filterScr: boolf3(function(b, b_f, item) {return item === b.sortItem}),
            /**
             * `PARAM`: If true, item selector will be hidden.
             * @memberof BLK_filterGate
             * @instance
             * @type {boolean}
             */
            hideSelection: false,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_filterGate
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
         * @class B_filterGate
         * @extends B_baseItemGate
         */
        newClass()
        .extendClass(PARENT[1], "B_filterGate")
        .initTemplate()
        .setParent("Sorter.SorterBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_filterGate
             * @instance
             * @type {boolean}
             */
            isInv: false,


        })
        .setMethod({


            getTileTarget: function(item, b_f, isFlip) {
                return comp_getTileTarget(this, item, b_f, isFlip);
            }
            .setProp({
                noSuper: true,
            }),


            buildConfiguration: function(tb) {
                comp_buildConfiguration(this, tb);
            }
            .setProp({
                noSuper: true,
            }),


            config: function() {
                return [
                    "SPEC: selector chunk",
                    this.sortItem == null ? "null" : this.sortItem.name,
                    this.delegee.isInv,
                ].toJavaArr(JAVA.object);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            draw: function() {
                comp_draw(this);
            },


            write: function(wr) {
                MDL_io.ct(wr, this.sortItem);
                wr.bool(this.delegee.isInv);
            },


            read: function(rd, revi) {
                if(this.delegee.LCRevi === 5) {
                    rd.s();
                };
                this.sortItem = MDL_io.ct(rd);
                this.delegee.isInv = rd.bool();
            },


        }),


    ];
