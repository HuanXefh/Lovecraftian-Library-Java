/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Drill, BLK_terrainDynamicDrill>} BLKTerrainDynamicDrill
     */


    /**
     * @typedef {TemplateInstance<Drill.DrillBuild, B_terrainDynamicDrill>} BTerrainDynamicDrill
     * @prop {BLKTerrainDynamicDrill} block
     */


    const PARENT = require("lovec/temp/blk/BLK_groundDrill");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKTerrainDynamicDrill} blk
     * @return {void}
     */
    function comp_init(blk) {
        MDL_event.onLoadPost(() => {
            blk.delegee.terOutputData.each((nameItem, terItemMap) => {
                terItemMap.each((ter, nameRs) => {
                    let rs = MDL_content.getCt(nameRs, ContentGetModes.RS);
                    if(rs == null) return;
                    MDL_recipeDict.addItemProdTerm(blk, rs, Math.pow(blk.size, 2) * blk.drillTime / blk.getDrillTime(rs), 1.0, {icon: "lovec-icon-mining"});
                });
            });
        });

        MOD_tmi.regisRc_terrainDynamicDrill(blk, blk.delegee.terOutputData);
    };


    /**
     * @private
     * @param {BLKTerrainDynamicDrill} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        if(blk.delegee.terOutputData.size > 0) {
            stats.add(Stat.output, newStatValue(tb => {
                tb.row();
                blk.self.ex_buildTerrainDynamicOutput(tb);
            }));
        };
    };


    /**
     * @private
     * @param {BLKTerrainDynamicDrill} blk
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @param {boolean} valid
     * @return {void}
     */
    function comp_drawPlace(blk, tx, ty, rot, valid) {
        MDL_terrain.drawTerPlace(blk, tx, ty, rot, valid, 1);
    };


    /**
     * @private
     * @param {BLKTerrainDynamicDrill} blk
     * @param {number} tx
     * @param {number} ty
     * @param {Item} item
     * @return {TextureRegion}
     */
    const comp_ex_findPlaceRsIcon = function thisFun(blk, tx, ty, item) {
        let t = GLB_var.world.tile(tx, ty);
        if(t == null) return GLB_varGen.iconRegs.ohno;

        if(LCNativeArray.checkTupChange(thisFun.tmpTup, blk, t, item)) {
            if(blk.self.ex_isMiningDpore(tx, ty, item) && !blk.self.ex_anyDporeRevealed(tx, ty, item)) {
                thisFun.tmpIcon = GLB_varGen.iconRegs.questionMark;
            } else {
                let ter = MDL_terrain.getTer(t, blk.size);
                let terItemMap = blk.delegee.terOutputData.get(item == null ? "null" : item.name);
                if(terItemMap == null) {
                    thisFun.tmpIcon = item.uiIcon;
                } else {
                    let rs = MDL_content.getCt(terItemMap.get(tryVal(ter, "transition")), ContentGetModes.RS);
                    thisFun.tmpIcon = rs == null ?
                        item.uiIcon :
                        rs.uiIcon;
                };
            };
        };

        return thisFun.tmpIcon;
    }
    .setProp({
        /**
         * @memberof comp_ex_findPlaceRsIcon
         * @type {Tup3<Block, Tile, Item>}
         */
        tmpTup: [],
        /**
         * @memberof comp_ex_findPlaceRsIcon
         * @type {TextureRegion}
         */
        tmpIcon: null,
    });


    /**
     * @private
     * @param {BLKTerrainDynamicDrill} blk
     * @param {Table} tb
     * @return {void}
     */
    function comp_ex_buildTerrainDynamicOutput(blk, tb) {
        let contCell = tb.table(Styles.none, tb1 => {}).growX();
        let cont = contCell.get();

        let
            item,
            itemCell,
            itemTb,
            matArr,
            rsTarget;
        blk.delegee.terOutputData.each((nameItem, terItemMap) => {
            item = MDL_content.getCt(nameItem, ContentGetModes.RS);
            if(item == null) return;
            itemCell = cont.table(Styles.none, tb1 => {}).growX();
            itemTb = itemCell.get();
            itemCell.row();

            itemTb.add(item.localizedName).row();
            itemTb.table(Styles.none, tb1 => {
                matArr = [
                    [
                        "",
                        MDL_bundle.getTerm("lovec", "resource"),
                        fetchStat("lovec", "blk-terreq").localized(),
                    ],
                    [
                        item,
                        item.localizedName,
                        "-",
                    ],
                ];
                terItemMap.each((ter, nameRs) => {
                    rsTarget = MDL_content.getCt(nameRs, ContentGetModes.RS);
                    if(rsTarget == null) return;
                    matArr.push([rsTarget, rsTarget.localizedName, MDL_terrain.getTerBundle(ter)]);
                });
                MDL_table.setTable(tb1, matArr);
            })
            .growX()
            .row();
        });
    };


    /**
     * @private
     * @param {BTerrainDynamicDrill} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        b.delegee.terCur = MDL_terrain.getTer(b.tile, b.block.size);

        let terItemMap = b.block.delegee.terOutputData.get(b.dominantItem == null ? "null" : b.dominantItem.name);
        if(terItemMap == null) return;
        let item = MDL_content.getCt(terItemMap.get(tryVal(b.delegee.terCur, "transition")), ContentGetModes.RS);
        if(item == null) return;

        b.dominantItem = item;
    };


    /**
     * @private
     * @param {BTerrainDynamicDrill} b
     * @return {void}
     */
    function comp_pickedUp(b) {
        b.delegee.terCur = null;
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Drill that outputs variants of some item based on current terrain type.
         * @class BLK_terrainDynamicDrill
         * @extends BLK_groundDrill
         */
        newClass()
        .extendClass(PARENT[0], "BLK_terrainDynamicDrill")
        .initTemplate()
        .setParent("Drill")
        .setTags()
        .setParam({


            /**
             * `PARAM`: Maps some item (as string) to an object map that maps terrain type to final output.
             * @memberof BLK_terrainDynamicDrill
             * @instance
             * @type {TDynamic<ObjectMap<string, ObjectMap<string, string>>>}
             * @example
             * ObjectMap.of(
             *     "sand", ObjectMap.of(
             *         "dirt", "copper",
             *         "rock", "lead",
             *     ),
             * );
             */
            terOutputData: tprov(() => new ObjectMap()),


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            drawPlace: function(tx, ty, rot, valid) {
                comp_drawPlace(this, tx, ty, rot, valid);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @override
             * @memberof BLK_terrainDynamicDrill
             * @instance
             * @func
             * @param {number} tx
             * @param {number} ty
             * @param {Item} item
             * @return {TextureRegion}
             */
            ex_findPlaceRsIcon: function(tx, ty, item) {
                return comp_ex_findPlaceRsIcon(this, tx, ty, item);
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 3,
            }),


            /**
             * @memberof BLK_terrainDynamicDrill
             * @instance
             * @func
             * @param {Table} tb
             * @return {void}
             */
            ex_buildTerrainDynamicOutput: function(tb) {
                comp_ex_buildTerrainDynamicOutput(this, tb);
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


        }),


        /**
         * @class B_terrainDynamicDrill
         * @extends B_groundDrill
         */
        newClass()
        .extendClass(PARENT[1], "B_terrainDynamicDrill")
        .initTemplate()
        .setParent("Drill.DrillBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_terrainDynamicDrill
             * @instance
             * @type {String|null}
             */
            terCur: null,


        })
        .setMethod({


            onProximityUpdate: function() {
                comp_onProximityUpdate(this);
            },


            pickedUp: function() {
                comp_pickedUp(this);
            },


        }),


    ];
