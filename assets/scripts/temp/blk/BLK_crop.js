/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Wall, BLK_crop>} BLKCrop
     */


    /**
     * @typedef {TemplateInstance<Wall.WallBuild, B_crop>} BCrop
     * @prop {BLKCrop} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseMiner");
    const INTF_BLK_terrainHandler = require("lovec/temp/intf/INTF_BLK_terrainHandler");
    const INTF_BLK_sameBlockRestrictionHandler = require("lovec/temp/intf/INTF_BLK_sameBlockRestrictionHandler");
    const INTF_ENV_unitHider = require("lovec/temp/intf/INTF_ENV_unitHider");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKCrop} blk
     * @return {void}
     */
    function comp_init(blk) {
        if(blk.delegee.cropData == null || blk.delegee.cropData.length === 0) throw new LCError.NullArgumentError(blk.name + ".cropData");

        blk.group = BlockGroup.none;
        blk.update = true;
        blk.configurable = true;
        blk.enableDrawStatus = false;
        blk.drawDynamic = true;
        blk.drawCached = false;
        blk.drawCracks = false;
        blk.createRubble = false;
        blk.allowedInPayloads = false;

        blk.config(JAVA.string, (b, str) => {
            if(str === "SPEC: harvest") {
                b.self.ex_harvest();
                BOX_trigger.cropHarvest.fire(b, b.delegee.stageItem);
            };
        });

        blk.delegee.cropParent = MDL_content.getCt(blk.delegee.cropParent, ContentGetModes.RS);
        if(blk.delegee.cropParent != null) {
            if(!Vars.headless) {
                MDL_event.onLoad(() => {
                    blk.uiIcon = blk.delegee.cropParent.uiIcon;
                    blk.fullIcon = blk.delegee.cropParent.fullIcon;
                });
            };
            MDL_content.rename(blk, () => blk.delegee.cropParent.localizedName);
        };

        blk.self.ex_setupCropData();

        MDL_event.onLoadPost(() => {
            let
                i = 0,
                iCap = blk.delegee.cropData.iCap(),
                item,
                amt,
                p;
            while(i < iCap) {
                item = blk.delegee.cropData[i].item;
                amt = blk.delegee.cropData[i].amt;
                p = blk.delegee.cropData[i].p;
                if(item != null && amt * p > 0.0) {
                    MDL_recipeDict.addItemProdTerm(blk, item, amt, p, {time: blk.self.ex_calcStageTotalTime(i) - blk.self.ex_calcStageTotalTime(blk.delegee.cropData[i].stageTo)});
                };
                i++;
            };
        });

        MOD_tmi.regisRc_crop(blk);
    };


    /**
     * @private
     * @param {BLKCrop} blk
     * @return {void}
     */
    function comp_load(blk) {
        let iCap = blk.delegee.cropData.iCap();
        blk.delegee.cropRegs = fetchRegions(blk, "", iCap);
        blk.delegee.cropShaRegs = fetchRegions(blk, "-shadow", iCap);
    };


    /**
     * @private
     * @param {BLKCrop} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(fetchStat("lovec", "blk0min-cropstage"), newStatValue(tb => {
            tb.row();
            tb.table(Styles.none, tb1 => {
                let matArr = [[
                    MDL_bundle.getTerm("lovec", "growth-stage"),
                    MDL_bundle.getTerm("lovec", "time-required"),
                    MDL_bundle.getTerm("lovec", "resource"),
                ]];
                let i = 0;
                let iCap = blk.delegee.cropData.iCap();
                while(i < iCap) {
                    let stage = i;
                    matArr.push([
                        stage,
                        blk.delegee.cropData[stage].dur < 0.0001 ? "-" : blk.delegee.cropData[stage].dur.time(2),
                        tb2 => {
                            tb2.center();
                            MDL_table.rcCtIcon(tb2, blk.delegee.cropData[stage].item, blk.delegee.cropData[stage].amt, blk.delegee.cropData[stage].p, false, {marginRight: 0.0});
                        },
                    ]);
                    i++;
                };
                MDL_table.setTable(tb1, matArr);
            })
            .left()
            .padLeft(28.0);
        }));
        stats.add(fetchStat("lovec", "blk0min-croptotaltime"), blk.delegee.growTotalTime.time(2));
    };


    /**
     * @private
     * @param {BLKCrop} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        blk.addBar("lovec-grow-prog", b => new Bar(
            prov(() => Core.bundle.format("bar.lovec-bar-grow-prog-amt", Strings.fixed(b.delegee.stageCur, 0) + " (" + b.delegee.growFrac.perc(2) + ")")),
            prov(() => GLB_color.ammo),
            () => Mathf.clamp(b.delegee.growFrac, 0.0, 1.0),
        ));
    };


    /**
     * @private
     * @param {BLKCrop} blk
     * @return {void}
     */
    function comp_ex_setupCropData(blk) {
        let
            i = 0,
            iCap = blk.delegee.cropData.iCap(),
            obj;
        while(i < iCap) {
            obj = blk.delegee.cropData[i];
            processNullParam(
                obj,
                "amt", 1,
                "p", 1.0,
                "stageTo", 0,
                "rad", 0.0,
                "hidable", false,
                "static", false,
                "scl", 1.0,
                "mag", 1.0,
                "wob", 1.0,
                "z", GLB_var.layer.cropLow,
                "offSha", -4.0,
                "drawF", function(b) {b.block.self.ex_drawCropDef(b)},
            );
            if(obj.dur == null) throw new LCError.NullArgumentError(blk.name + ".cropData.dur");
            blk.delegee.growTotalTime += obj.dur;
            obj.item = MDL_content.getCt(obj.item, ContentGetModes.RS);
            i++;
        };
    };


    /**
     * @private
     * @param {BCrop} b
     * @return {void}
     */
    function comp_onDestroyed(b) {
        if(b.delegee.stageDestroyScr != null) {
            b.delegee.stageDestroyScr(b);
        };
    };


    /**
     * @private
     * @param {BCrop} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        b.delegee.growEffc = b.block.self.ex_calcGrowEffc(b.tileX(), b.tileY());
        b.self.ex_onStageUpdate();
    };


    /**
     * @private
     * @param {BCrop} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(GLB_timer.secQuarter) {
            b.delegee.growFrac = b.delegee.growTime / b.block.delegee.growTotalTime;
        };
        if(!b.delegee.isFinalStage) {
            b.delegee.growTime += b.efficiency * Time.delta;
        };
        if(b.delegee.nextStageTime >= 0.0 && b.delegee.growTime >= b.delegee.nextStageTime) {
            b.self.ex_changeStage(b.delegee.stageCur + 1, false);
        };
        if(b.delegee.stageUpdateScr != null) {
            b.delegee.stageUpdateScr(b);
        };
    };


    /**
     * @private
     * @param {BCrop} b
     * @return {void}
     */
    function comp_updateEfficiencyMultiplier(b) {
        b.efficiency *= b.delegee.growEffc;
    };


    /**
     * @private
     * @param {BCrop} b
     * @return {boolean}
     */
    function comp_configTapped(b) {
        if(b.self.ex_checkCanHarvest()) {
            b.configure("SPEC: harvest");
        } else {
            MDL_ui.showFadeInfo("lovec", "crop-harvest-fail");
        };
        return false;
    };


    /**
     * @private
     * @param {BCrop} b
     * @param {number} stageTo
     * @param {boolean} resetTime
     * @return {void}
     */
    function comp_ex_changeStage(b, stageTo, resetTime) {
        if(stageTo < 0 || stageTo >= b.block.delegee.cropData.iCap()) return;
        b.delegee.stageCur = stageTo;
        if(resetTime) {
            b.delegee.growTime = b.block.self.ex_calcStageTotalTime(b.delegee.stageCur);
        };
        b.self.ex_onStageUpdate();
    };


    /**
     * @private
     * @param {BCrop} b
     * @return {void}
     */
    function comp_ex_onStageUpdate(b) {
        b.delegee.isFinalStage = Mathf.equal(b.delegee.stageCur, b.block.delegee.cropData.iCap() - 1);
        b.delegee.nextStageTime = b.delegee.isFinalStage ?
            -1.0 :
            b.block.self.ex_calcStageTotalTime(b.delegee.stageCur + 1);

        b.delegee.stageItem = b.block.delegee.cropData[b.delegee.stageCur].item;
        b.delegee.stageItemAmt = b.block.delegee.cropData[b.delegee.stageCur].amt;
        b.delegee.stageItemP = b.block.delegee.cropData[b.delegee.stageCur].p;
        b.delegee.stageBackTo = b.block.delegee.cropData[b.delegee.stageCur].stageTo;
        b.delegee.stageReg = Vars.state.isEditor() ? b.block.delegee.cropRegs.last() : b.block.delegee.cropRegs[b.delegee.stageCur];
        b.delegee.stageShaReg = Vars.state.isEditor() ? b.block.delegee.cropShaRegs.last() : b.block.delegee.cropShaRegs[b.delegee.stageCur];
        b.delegee.stageCropRad = Vars.state.isEditor() ? b.block.delegee.cropData.last().rad : b.block.delegee.cropData[b.delegee.stageCur].rad;
        b.delegee.stageHidable = Vars.state.isEditor() ? b.block.delegee.cropData.last().hidable : b.block.delegee.cropData[b.delegee.stageCur].hidable;
        b.delegee.stageStatic = Vars.state.isEditor() ? b.block.delegee.cropData.last().static : b.block.delegee.cropData[b.delegee.stageCur].static;
        b.delegee.stageCropScl = Vars.state.isEditor() ? b.block.delegee.cropData.last().scl : b.block.delegee.cropData[b.delegee.stageCur].scl;
        b.delegee.stageCropMag = Vars.state.isEditor() ? b.block.delegee.cropData.last().mag : b.block.delegee.cropData[b.delegee.stageCur].mag;
        b.delegee.stageCropWob = Vars.state.isEditor() ? b.block.delegee.cropData.last().wob : b.block.delegee.cropData[b.delegee.stageCur].wob;
        b.delegee.stageCropZ = Vars.state.isEditor() ? b.block.delegee.cropData.last().z : b.block.delegee.cropData[b.delegee.stageCur].z;
        b.delegee.stageOffSha = Vars.state.isEditor() ? b.block.delegee.cropData.last().offSha : b.block.delegee.cropData[b.delegee.stageCur].offSha;
        b.delegee.stageDrawF = Vars.state.isEditor() ? b.block.delegee.cropData.last().drawF : b.block.delegee.cropData[b.delegee.stageCur].drawF;
        b.delegee.stageUpdateScr = b.block.delegee.cropData[b.delegee.stageCur].updateScr;
        b.delegee.stageHarvestScr = b.block.delegee.cropData[b.delegee.stageCur].harvestScr;
        b.delegee.stageDestroyScr = b.block.delegee.cropData[b.delegee.stageCur].destroyScr;
    };


    /**
     * @private
     * @param {BCrop} b
     * @return {void}
     */
    function comp_ex_harvest(b) {
        if(!b.self.ex_checkCanHarvest()) return;
        MDL_call.spawnLoots_server(b.x, b.y, b.delegee.stageItem, b.delegee.stageItemAmt.randFreq(b.delegee.stageItemP), GLB_var.range.cropLootRad);
        b.self.ex_changeStage(b.delegee.stageBackTo, true);
        MDL_effect.showAt(b.x, b.y, b.block.destroyEffect, 0.0);
        MDL_sound.playAt(b.x, b.y, b.block.destroySound);
        if(b.delegee.stageHarvestScr != null) {
            b.delegee.stageHarvestScr(b);
        };
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * A block that grows and can be harvested for items.
         * <br> `NAMEGEN`
         * @class BLK_crop
         * @extends BLK_baseMiner
         * @extends INTF_BLK_terrainHandler
         * @extends INTF_BLK_sameBlockRestrictionHandler
         * @extends INTF_ENV_unitHider
         */
        newClass()
        .extendClass(PARENT[0], "BLK_crop")
        .implement(INTF_BLK_terrainHandler[0])
        .implement(INTF_BLK_sameBlockRestrictionHandler[0])
        .implement(INTF_ENV_unitHider)
        .initTemplate()
        .setParent("Wall")
        .setTags("blk-crop")
        .setParam({


            /**
            * `PARAM`: The main item that this crop produces. Used for icon and name generation.
            * @memberof BLK_crop
            * @instance
            * @type {ItemGn}
            */
            cropParent: null,
            /**
             * `PARAM`: Crop stage data as an array.
             * @memberof BLK_crop
             * @instance
             * @type {TDynamic<Array<CropData>>|null}
             */
            cropData: null,
            /**
             * @inheritdoc
             * @memberof BLK_crop
             * @instance
             * @type {number}
             */
            placeRestrictR: 1,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_crop
             * @instance
             * @type {number}
             */
            growTotalTime: 0.0,
            /**
             * `INTERNAL`
             * @memberof BLK_crop
             * @instance
             * @type {Array<TextureRegion>}
             */
            cropRegs: null,
            /**
             * `INTERNAL`
             * @memberof BLK_crop
             * @instance
             * @type {Array<TextureRegion>}
             */
            cropShaRegs: null,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_crop
             * @instance
             * @type {boolean}
             */
            hidable: true,


            /* <------------------------------ vanilla ------------------------------> */


            solid: false,
            underBullets: true,
            hasShadow: false,
            destroyEffect: GLB_eff.crackPlant,
            placeSound: fetchSound("se-step-grass"),
            breakSound: fetchSound("se-step-grass"),
            destroySound: fetchSound("se-step-grass"),


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            load: function() {
                comp_load(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            setBars: function() {
                comp_setBars(this);
            },


            icons: function thisFun() {
                let reg = this.delegee.cropRegs.last();
                return reg != null && reg.found() ?
                    [reg] :
                    thisFun.funPrev.call(this);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * Initializes crop data.
             * @memberof BLK_crop
             * @instance
             * @func
             * @return {void}
             */
            ex_setupCropData: function() {
                comp_ex_setupCropData(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Calculates growth efficiency at some tile.
             * @memberof BLK_crop
             * @instance
             * @func
             * @param {number} tx
             * @param {number} ty
             * @return {number}
             */
            ex_calcGrowEffc: function thisFun(tx, ty) {
                if(SLCNativeArray.checkTupChange(thisFun.tmpTup, tx, ty)) {
                    thisFun.tmpVal = MDL_attr.calcSumRect(GLB_var.world.tile(tx, ty), this.delegee.placeRestrictR, this.size, TP_attr.attr0env_growth, AttrModes.FLOOR | AttrModes.OVERLAY) / Mathf.pow(this.size + this.delegee.placeRestrictR * 2, 2);
                };
                return thisFun.tmpVal;
            }
            .setProp({
                noSuper: true,
                /**
                 * @memberof BLK_crop#ex_calcGrowEffc
                 * @type {Tup2<number, number>}
                 */
                tmpTup: [],
                /**
                 * @memberof BLK_crop#ex_calcGrowEffc
                 * @type {number}
                 */
                tmpVal: 1.0,
            }),


            /**
             * Calculates time required to reach a stage.
             * @memberof BLK_crop
             * @instance
             * @func
             * @param {number} stage
             * @return {number}
             */
            ex_calcStageTotalTime: function(stage) {
                let
                    i = 0,
                    iCap = this.delegee.cropData.iCap(),
                    time = 0.0;
                while(i < iCap && i < stage) {
                    time += this.delegee.cropData[i].dur;
                    i++;
                };
                return time;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @override
             * @memberof BLK_crop
             * @instance
             * @func
             * @param {number} tx
             * @param {number} ty
             * @return {boolean}
             */
            ex_checkHidable: function(tx, ty) {
                let ob = GLB_var.world.build(tx, ty);
                return ob != null && ob.block === this && ob.delegee.stageHidable;
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 2,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_crop
             * @instance
             * @func
             * @param {number} tx
             * @param {number} ty
             * @return {number}
             */
            ex_getHideRad: function(tx, ty) {
                let ob = GLB_var.world.build(tx, ty);
                return ob == null || ob.block !== this ?
                    0.0 :
                    ob.delegee.stageCropRad;
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 2,
            }),


            /**
             * Default way to draw a crop.
             * @memberof BLK_crop
             * @instance
             * @func
             * @param {BCrop} b
             * @return {void}
             */
            ex_drawCropDef: function(b) {
                SLCDrawf.tree(
                    b.delegee.stageReg, b.delegee.stageShaReg,
                    b.tile, b.delegee.stageCropRad, b.delegee.stageOffSha,
                    b.delegee.stageCropScl, b.delegee.stageCropMag, b.delegee.stageCropWob,
                    GLB_param.TREE_ALPHA, b.delegee.stageCropZ,
                    GLB_param.SHOULD_DRAW_WOBBLE && !b.delegee.stageStatic, GLB_param.SHOULD_CHECK_TREE_DISTANCE,
                );
            }
            .setProp({
                noSuper: true,
            }),


        }),


        /**
         * @class B_crop
         * @extends B_baseMiner
         * @extends INTF_B_terrainHandler
         * @extends INTF_B_sameBlockRestrictionHandler
         */
        newClass()
        .extendClass(PARENT[1], "B_crop")
        .implement(INTF_BLK_terrainHandler[1])
        .implement(INTF_BLK_sameBlockRestrictionHandler[1])
        .initTemplate()
        .setParent("Wall.WallBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`: Growth efficiency, determined by growth attribute.
             * @memberof B_crop
             * @instance
             * @type {number}
             */
            growEffc: 1.0,
            /**
             * `INTERNAL`: Time since planted.
             * @memberof B_crop
             * @instance
             * @type {number}
             */
            growTime: 0.0,
            /**
             * `INTERNAL`: 1.0 for fully mature.
             * @memberof B_crop
             * @instance
             * @type {number}
             */
            growFrac: 0.0,
            /**
             * `INTERNAL`: `growTime` required for next stage.
             * @memberof B_crop
             * @instance
             * @type {number}
             */
            nextStageTime: -1.0,
            /**
             * `INTERNAL`: Current stage. Do not set manually.
             * @memberof B_crop
             * @instance
             * @type {number}
             */
            stageCur: 0,
            /**
             * `INTERNAL`
             * @memberof B_crop
             * @instance
             * @type {boolean}
             */
            isFinalStage: false,
            /**
             * `INTERNAL`: Item to drop, null if not harvestable right now.
             * @memberof B_crop
             * @instance
             * @type {Item|null}
             */
            stageItem: null,
            /**
             * `INTERNAL`: Amount of items to drop.
             * @memberof B_crop
             * @instance
             * @type {number}
             */
            stageItemAmt: 1,
            /**
             * `INTERNAL`: Chance to drop each item.
             * @memberof B_crop
             * @instance
             * @type {number}
             */
            stageItemP: 1.0,
            /**
             * `INTERNAL`: Stage to decrease to when harvested.
             * @memberof B_crop
             * @instance
             * @type {number}
             */
            stageBackTo: 0,
            /**
             * `INTERNAL`
             * @memberof B_crop
             * @instance
             * @type {TextureRegion}
             */
            stageReg: null,
            /**
             * `INTERNAL`
             * @memberof B_crop
             * @instance
             * @type {TextureRegion}
             */
            stageShaReg: null,
            /**
             * `INTERNAL`: Visual radius of the sprite.
             * @memberof B_crop
             * @instance
             */
            stageCropRad: 0.0,
            /**
             * `INTERNAL`
             * @memberof B_crop
             * @instance
             * @type {boolean}
             */
            stageHidable: false,
            /**
             * `INTERNAL`: If true, crop sprite does not wobble.
             * @memberof B_crop
             * @instance
             * @type {boolean}
             */
            stageStatic: false,
            /**
             * `INTERNAL`
             * @memberof B_crop
             * @instance
             * @type {number}
             */
            stageCropScl: 1.0,
            /**
             * `INTERNAL`
             * @memberof B_crop
             * @instance
             * @type {number}
             */
            stageCropMag: 1.0,
            /**
             * `INTERNAL`
             * @memberof B_crop
             * @instance
             * @type {number}
             */
            stageCropWob: 1.0,
            /**
             * `INTERNAL`
             * @memberof B_crop
             * @instance
             * @type {number}
             */
            stageCropZ: 60.0,
            /**
             * `INTERNAL`
             * @memberof B_crop
             * @instance
             * @type {number}
             */
            stageOffSha: 0.0,
            /**
             * `INTERNAL`
             * @memberof B_crop
             * @instance
             * @type {CFunction<BCrop>}
             */
            stageDrawF: null,
            /**
             * `INTERNAL`
             * @memberof B_crop
             * @instance
             * @type {CFunction<BCrop>}
             */
            stageUpdateScr: null,
            /**
             * `INTERNAL`
             * @memberof B_crop
             * @instance
             * @type {CFunction<BCrop>}
             */
            stageHarvestScr: null,
            /**
             * `INTERNAL`
             * @memberof B_crop
             * @instance
             * @type {CFunction<BCrop>}
             */
            stageDestroyScr: null,


        })
        .setMethod({


            onDestroyed: function() {
                comp_onDestroyed(this);
            },


            onProximityUpdate: function() {
                comp_onProximityUpdate(this);
            },


            updateTile: function() {
                comp_updateTile(this);
            },


            updateEfficiencyMultiplier: function() {
                comp_updateEfficiencyMultiplier(this);
            },


            getCursor: function() {
                return this.self.ex_checkCanHarvest() ?
                    Vars.ui.drillCursor :
                    this.super$getCursor();
            }
            .setProp({
                noSuper: true,
            }),


            configTapped: function() {
                return comp_configTapped(this);
            }
            .setProp({
                noSuper: true,
            }),


            draw: function() {
                if(this.delegee.stageDrawF != null) {
                    this.delegee.stageDrawF(this);
                } else {
                    this.block.self.ex_drawCropDef(this);
                };
            }
            .setProp({
                noSuper: true,
            }),


            write: function(wr) {
                wr.i(this.delegee.stageCur);
                wr.f(this.delegee.growTime);
            },


            read: function(rd, revi) {
                this.delegee.stageCur = rd.i();
                this.delegee.growTime = rd.f();
            },


            /**
             * Call this method to change stage.
             * Do not set {@link BCrop#stageCur} manually!
             * @memberof B_crop
             * @instance
             * @func
             * @param {number} stageTo
             * @param {boolean} resetTime
             * @return {void}
             */
            ex_changeStage: function(stageTo, resetTime) {
                comp_ex_changeStage(this, stageTo, resetTime);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof B_crop
             * @instance
             * @func
             * @return {void}
             */
            ex_onStageUpdate: function() {
                comp_ex_onStageUpdate(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Whether this crop is harvestable right now.
             * @memberof B_crop
             * @instance
             * @func
             * @return {boolean}
             */
            ex_checkCanHarvest: function() {
                return !Vars.state.isEditor() && this.delegee.stageItem != null && this.delegee.stageItemAmt * this.delegee.stageItemP > 0.0;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Call this method to harvest this crop.
             * Does nothing if crop is not harvestable.
             * @memberof B_crop
             * @instance
             * @func
             * @return {void}
             */
            ex_harvest: function() {
                comp_ex_harvest(this);
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
