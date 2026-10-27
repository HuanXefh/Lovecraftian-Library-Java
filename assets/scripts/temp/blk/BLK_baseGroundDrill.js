/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, BLK_baseGroundDrill>} BLKBaseGroundDrill
     */


    /**
     * @typedef {TemplateInstance<Building, B_baseGroundDrill>} BBaseGroundDrill
     * @prop {BLKBaseGroundDrill} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseDrill");
    const INTF_BLK_depthOreHandler = require("lovec/temp/intf/INTF_BLK_depthOreHandler");
    const INTF_BLK_oreScannerHandler = require("lovec/temp/intf/INTF_BLK_oreScannerHandler");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKBaseGroundDrill} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.delegee.skipDepthOreMethod = !blk.delegee.canMineDepthOre;
    };


    /**
     * @private
     * @param {BLKBaseGroundDrill} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        if(blk.delegee.canMineDepthOre) {
            stats.add(fetchStat("lovec", "blk0min-depthmtp"), blk.delegee.depthTierMtp.perc(2));
            stats.add(fetchStat("lovec", "blk0min-maxdepthlvl"), FRAG_faci.getDepthLvlBundle(blk.delegee.maxDepthLvl));
        };
    };


    /**
     * @private
     * @param {BLKBaseGroundDrill} blk
     * @param {Tile|null} t
     * @return {boolean}
     */
    function comp_canMine(blk, t) {
        if(t == null || t.block().isStatic()) return false;
        let item = null, isFloorDrop = false;
        if(t.overlay().itemDrop != null) {
            item = t.overlay().itemDrop;
        } else if(t.floor().itemDrop != null) {
            item = t.floor().itemDrop;
            isFloorDrop = true;
        };
        if(item == null) return false;

        return (isFloorDrop ? false : MDL_cond.isDepthOre(t.overlay())) ?
            blk.delegee.canMineDepthOre && blk.self.ex_canMine(t.overlay(), item, blk.delegee.depthTierMtp) && blk.self.ex_calcDpLvlReq(t.x, t.y, item) <= blk.delegee.maxDepthLvl :
            blk.self.ex_canMine(isFloorDrop ? t.floor() : t.overlay(), item, 1.0);
    };


    /**
     * @private
     * @param {BLKBaseGroundDrill} blk
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @param {boolean} valid
     * @return {void}
     */
    function comp_drawPlace(blk, tx, ty, rot, valid) {
        SLCDrawf.baseBlockDrawPlace(blk, tx, ty, rot, valid);

        let t = GLB_var.world.tile(tx, ty);
        if(t == null) return;

        Reflect.invoke(Drill, blk, "countOre", [t], Tile);
        let returnItem = Reflect.get(Drill, blk, "returnItem");
        let returnAmt = Reflect.get(Drill, blk, "returnCount");
        if(returnItem != null) {
            let w = blk.drawPlaceText(Core.bundle.formatFloat("bar.drillspeed", 60.0 / blk.getDrillTime(returnItem) * blk.delegee.drillAmtMtp * returnAmt, 2), tx, ty, valid);
            let x = tx.toFCoord(blk.size) - w * 0.5 - 4.0;
            let y = ty.toFCoord(blk.size) + blk.size * Vars.tilesize * 0.5 + 5.0;

            SLCDraw.regionIcon(x, y, blk.self.ex_findPlaceRsIcon(tx, ty, returnItem), 0, 0.75);

            if(blk.drawMineItem) {
                Draw.color(returnItem.color);
                Draw.rect(blk.itemRegion, tx.toFCoord(blk.size), ty.toFCoord(blk.size));
                Draw.color();
            };
        } else {
            let ot = t.getLinkedTilesAs(blk, Reflect.get(Block, "tempTiles"))
            .find(ot1 => ot1.drop() != null && (
                ot1.drop().hardness > blk.tier * (blk.self.ex_isMiningDpore(tx, ty, ot1.drop()) ? blk.delegee.depthTierMtp : 1.0)
                    || (blk.blockedItems != null && blk.blockedItems.contains(ot1.drop()))
                    || ((blk.blockedItems == null || blk.blockedItems.size === 0) && blk.delegee.itemWhitelist.length > 0 && !blk.delegee.itemWhitelist.includes(ot1.drop()))
            ));
            let item = ot == null ? null : ot.drop();
            if(item != null) {
                blk.drawPlaceText(MDL_bundle.getInfo("lovec", "text-cannot-mine"), tx, ty, valid);
            };
        };
    };


    /**
     * @private
     * @param {BBaseGroundDrill} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        b.dominantItems = Math.round(b.dominantItems * b.block.delegee.drillAmtMtp);
        b.delegee.requiresScanner = b.block.self.ex_isMiningDpore(b.tileX(), b.tileY(), b.dominantItem);
        b.delegee.depthLvlReqCur = b.block.self.ex_calcDpLvlReq(b.tileX(), b.tileY(), b.dominantItem);
    };


    /**
     * @private
     * @param {BBaseGroundDrill} b
     * @return {void}
     */
    function comp_pickedUp(b) {
        b.delegee.requiresScanner = false;
    };


    /**
     * @private
     * @param {BBaseGroundDrill} b
     * @return {void}
     */
    function comp_updateEfficiencyMultiplier(b) {
        if(b.delegee.maxDepthLvl < b.delegee.depthLvlReqCur) {
            b.efficiency = 0.0;
        };
    };


    /**
     * @private
     * @param {BBaseGroundDrill} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        if(b.dominantItem == null) return;
        SLCDraw.regionIcon(b.x, b.y, b.block.self.ex_findPlaceRsIcon(b.tileX(), b.tileY(), b.dominantItem), b.block.size, 0.75);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Parent for all ground drills.
         * Ore scanner is required when a drill is mining depth ore.
         * @class BLK_baseGroundDrill
         * @extends BLK_baseDrill
         * @extends INTF_BLK_depthOreHandler
         * @extends INTF_BLK_oreScannerHandler
         */
        newClass()
        .extendClass(PARENT[0], "BLK_baseGroundDrill")
        .implement(INTF_BLK_depthOreHandler[0])
        .implement(INTF_BLK_oreScannerHandler[0])
        .initTemplate()
        .setParent(null)
        .setTags()
        .setParam({


            /**
             * `PARAM`: Whether this drill is capable of mining depth ore.
             * @memberof BLK_baseGroundDrill
             * @instance
             * @type {boolean}
             */
            canMineDepthOre: false,
            /**
             * `PARAM`: Multiplier on drill tier when mining depth ore.
             * @memberof BLK_baseGroundDrill
             * @instance
             * @type {number}
             */
            depthTierMtp: 0.5,
            /**
             * `PARAM`: Maximum depth level of depth ores that this drill can mine.
             * @memberof BLK_baseGroundDrill
             * @instance
             * @type {number}
             */
            maxDepthLvl: 0,


        })
        .setParamAlias([
            /**
             * `ALIAS`: `drillEffect`.
             * @memberof BLK_baseGroundDrill
             * @instance
             * @name drillEff
             * @type {Effect}
             */
            "drillEff", "drillEffect", Fx.none,
            /**
             * `ALIAS`: `drillEffectChance`.
             * @memberof BLK_baseGroundDrill
             * @instance
             * @name drillEffP
             * @type {number}
             */
            "drillEffP", "drillEffectChance", 1.0,
            /**
             * `ALIAS`: `drillEffectRnd`.
             * @memberof BLK_baseGroundDrill
             * @instance
             * @name drillEffRad
             * @type {number}
             */
            "drillEffRad", "drillEffectRnd", 0.0,
            /**
             * `ALIAS`: `updateEffect`.
             * @memberof BLK_baseGroundDrill
             * @instance
             * @name updateEff
             * @type {Effect}
             */
            "updateEff", "updateEffect", Fx.none,
            /**
             * `ALIAS`: `updateEffectChance`.
             * @memberof BLK_baseGroundDrill
             * @instance
             * @name updateEffP
             * @type {number}
             */
            "updateEffP", "updateEffectChance", 0.02,
        ])
        .setMethod({


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            canMine: function(t) {
                return comp_canMine(this, t);
            }
            .setProp({
                noSuper: true,
            }),


            drawPlace: function(tx, ty, rot, valid) {
                comp_drawPlace(this, tx, ty, rot, valid);
            }
            .setProp({
                noSuper: true,
            }),


        }),


        /**
         * @class B_baseGroundDrill
         * @extends B_baseDrill
         * @extends INTF_B_depthOreHandler
         * @extends INTF_B_oreScannerHandler
         */
        newClass()
        .extendClass(PARENT[1], "B_baseGroundDrill")
        .implement(INTF_BLK_depthOreHandler[1])
        .implement(INTF_BLK_oreScannerHandler[1])
        .initTemplate()
        .setParent(null)
        .setParam({})
        .setMethod({


            onProximityUpdate: function() {
                comp_onProximityUpdate(this);
            },


            pickedUp: function() {
                comp_pickedUp(this);
            },


            updateEfficiencyMultiplier: function() {
                comp_updateEfficiencyMultiplier(this);
            },


            drawSelect: function() {
                comp_drawSelect(this);
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
