/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_oreScanner>} BLKOreScanner
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_oreScanner>} BOreScanner
     * @prop {BLKOreScanner} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseMiner");
    const INTF_BLK_radiusDisplay = require("lovec/temp/intf/INTF_BLK_radiusDisplay");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKOreScanner} blk
     * @return {void}
     */
    function comp_init(blk) {
        resetBlockFlag(blk, []);

        blk.clipSize += blk.blkRad;
        blk.configurable = true;
        blk.allowedInPayloads = false;

        blk.config(JAVA.boolean, (b, bool) => {
            if(b.team !== Vars.player.team()) return;
            Core.settings.put("lovec-draw0aux-scanner", bool);
            GLB_param.forceLoadParam();
        });

        blk.self.ex_addLogicF(LogicProp.range, b => blk.blkRad / Vars.tilesize);
    };


    /**
     * @private
     * @param {BLKOreScanner} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.craftSe = fetchSound(blk.delegee.craftSe);
    };


    /**
     * @private
     * @param {BLKOreScanner} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(Stat.range, blk.delegee.blkRad / Vars.tilesize, StatUnit.blocks);
        stats.add(fetchStat("lovec", "blk0min-scantier"), FRAG_faci.getDepthLvlBundle(blk.delegee.scanTier));
    };


    /**
     * @private
     * @param {BLKOreScanner} blk
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @return {Array<Tile>}
     */
    function comp_ex_getRevealTargets(blk, tx, ty, rot) {
        return SLCPos
        .getTilesCircle(blk.delegee.tmpRevealedTargets, GLB_var.world.tile(tx, ty), blk.delegee.blkRad / Vars.tilesize, blk.size)
        .inSituFilter(ot => MDL_cond.isScannerTarget(ot.overlay()) && blk.delegee.scanTier >= ot.overlay().delegee.depthLvl);
    };


    /**
     * @private
     * @param {BOreScanner} b
     * @return {void}
     */
    function comp_created(b) {
        b.delegee.offConeAng = Mathf.range(180.0);
        b.delegee.revealTargets.withAll(b.block.self.ex_getRevealTargets(b.tileX(), b.tileY(), b.rotation));
        MDL_event.onDelayRun(0.0, () => {
            b.delegee.revealQueue.withAll(b.delegee.revealTargets);
            let ot;
            b.delegee.revealedInts.forEachFast(int => {
                ot = GLB_var.world.tile(int);
                if(ot != null) {
                    b.delegee.revealQueue.pull(ot);
                };
            }, true);
            b.self.ex_setRevealed(true);
        });
    };


    /**
     * @private
     * @param {BOreScanner} b
     * @return {void}
     */
    function comp_onRemoved(b) {
        if(b.team !== Vars.player.team()) return;
        b.self.ex_setRevealed(false);
        // Update other scanners in range
        SLCEntity.eachBuild(b.x, b.y, b.team, b.block.delegee.blkRad * 2.2, ob => MDL_cond.isOreScanner(ob.block), ob => ob.self.ex_setRevealed(true));
    };


    /**
     * @private
     * @param {BOreScanner} b
     * @return {void}
     */
    function comp_craft(b) {
        let ot = b.delegee.revealQueue.random();
        if(ot != null) {
            b.delegee.revealQueue.pull(ot);
            b.delegee.revealedInts.push(ot.pos());

            if(b.team === Vars.player.team()) {
                MDL_effect.click(ot.worldx(), ot.worldy(), b.block.delegee.scanColor);
                MDL_effect.line(ot.worldx(), ot.worldy(), null, b, b.block.delegee.scanColor);
                ot.overlay().self.ex_accRevealed(ot, true);
            };
        };

        MDL_sound.playAt(b.x, b.y, b.block.delegee.craftSe, Math.min(b.block.ambientSoundVolume * 2.0, 1.0), 1.0, 0.1);
        if(Mathf.chance(0.2)) {
            b.self.ex_setRevealed(true);
        };
    };


    /**
     * @private
     * @param {BOreScanner} b
     * @param {Table} tb
     * @return {void}
     */
    function comp_buildConfiguration(b, tb) {
        MDL_table.btnCfgToggle(tb, b, Icon.eyeOffSmall, Icon.eyeSmall, Core.settings.getBool("lovec-draw0aux-scanner", true)).tooltip(MDL_bundle.getTerm("lovec", "toggle-display"), true);
    };


    /**
     * @private
     * @param {BOreScanner} b
     * @return {void}
     */
    function comp_draw(b) {
        processZ(GLB_var.layer.effFlr + 0.01);
        Draw.color(GLB_color.accent, b.warmup * 0.2);
        Fill.arc(b.x, b.y, b.block.delegee.blkRad, 0.125, b.delegee.offConeAng + b.totalProgress * 2.0);
        Draw.color();
        processZ(null);
    };


    /**
     * @private
     * @param {BOreScanner} b
     * @param {boolean} bool
     * @return {void}
     */
    function comp_ex_setRevealed(b, bool) {
        if(b.team !== Vars.player.team()) return;
        let ot;
        b.delegee.revealedInts.forEachFast(int => {
            ot = GLB_var.world.tile(int);
            ot.overlay().self.ex_accRevealed(ot, bool);
        }, true);
    };


    /**
     * @private
     * @param {BOreScanner} b
     * @return {number}
     */
    function comp_ex_getScanFrac(b) {
        return b.efficiency * (
            b.delegee.revealTargets.length === 0 || b.delegee.revealQueue.length === 0 ?
                1.0 :
                (b.delegee.revealedInts.length / b.delegee.revealTargets.length)
        );
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * A block that reveals depth ores in range.
         * @class BLK_oreScanner
         * @extends BLK_baseMiner
         * @extends INTF_BLK_radiusDisplay
         */
        newClass()
        .extendClass(PARENT[0], "BLK_oreScanner")
        .implement(INTF_BLK_radiusDisplay[0])
        .initTemplate()
        .setParent("GenericCrafter")
        .setTags("blk-scan", "blk-non-fac")
        .setParam({


            /**
             * `PARAM`: How deep the scanner is possible to scan. See {@link INTF_ENV_depthOverlay#depthLvl}.
             * @memberof BLK_oreScanner
             * @instance
             * @type {number}
             */
            scanTier: 0,
            /**
             * `PARAM`: Color used for scan effect.
             * @memberof BLK_oreScanner
             * @instance
             * @type {Color}
             */
            scanColor: GLB_color.techBlue,
            /**
             * `PARAM`: Sounds played when this scanner crafts.
             * @memberof BLK_oreScanner
             * @instance
             * @type {SoundGn}
             */
            craftSe: Sounds.unset,
            /**
             * @inheritdoc
             * @memberof BLK_oreScanner
             * @instance
             * @type {boolean}
             */
            useP3dRange: true,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_oreScanner
             * @instance
             * @type {TDynamic<Array<Tile>>}
             */
            tmpRevealedTargets: tprov(() => []),


        })
        .setParamAlias([
            /**
             * `PARAM`: Radius parameter of the scanner.
             * <br> `ALIAS`: `blkRad`.
             * @memberof BLK_oreScanner
             * @instance
             * @name scanRad
             * @type {number}
             */
            "scanRad", "blkRad", 40.0,
            /**
             * `ALIAS`: `craftEffect`.
             * @memberof BLK_oreScanner
             * @instance
             * @name craftEff
             * @type {Effect}
             */
            "craftEff", "craftEffect", Fx.none,
            /**
             * `ALIAS`: `updateEffect`.
             * @memberof BLK_oreScanner
             * @instance
             * @name updateEff
             * @type {Effect}
             */
            "updateEff", "updateEffect", Fx.none,
            /**
             * `ALIAS`: `updateEffectChance`.
             * @memberof BLK_oreScanner
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


            load: function() {
                comp_load(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            /**
             * @memberof BLK_oreScanner
             * @instance
             * @func
             * @param {number} tx
             * @param {number} ty
             * @param {number} rot
             * @return {Array<Tile>}
             */
            ex_getRevealTargets: function(tx, ty, rot) {
                return comp_ex_getRevealTargets(this, tx, ty, rot);
            }
            .setProp({
                noSuper: true,
                argLen: 3,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_oreScanner
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
         * @class B_oreScanner
         * @extends B_baseMiner
         * @extends INTF_B_radiusDisplay
         */
        newClass()
        .extendClass(PARENT[1], "B_oreScanner")
        .implement(INTF_BLK_radiusDisplay[1])
        .initTemplate()
        .setParent("GenericCrafter.GenericCrafterBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_oreScanner
             * @instance
             * @type {number}
             */
            offConeAng: 0.0,
            /**
             * `INTERNAL`: All ores to be revealed.
             * @memberof B_oreScanner
             * @instance
             * @type {TDynamic<Array<Tile>>}
             */
            revealTargets: tprov(() => []),
            /**
             * `INTERNAL`: Ores that are not revealed yet.
             * @memberof B_oreScanner
             * @instance
             * @type {TDynamic<Array<Tile>>}
             */
            revealQueue: tprov(() => []),
            /**
             * `INTERNAL`: Ores revealed as integers of position.
             * @memberof B_oreScanner
             * @instance
             * @type {TDynamic<Array<number>>}
             */
            revealedInts: tprov(() => []),


        })
        .setMethod({


            created: function() {
                comp_created(this);
            },


            onRemoved: function() {
                comp_onRemoved(this);
            },


            craft: function() {
                comp_craft(this);
            },


            buildConfiguration: function(tb) {
                comp_buildConfiguration(this, tb);
            }
            .setProp({
                noSuper: true,
            }),


            draw: function() {
                comp_draw(this);
            },


            write: function(wr) {
                MDL_io.ints(wr, this.delegee.revealedInts);
            },


            read: function(rd, revi) {
                if(this.delegee.LCRevi === 5) {
                    rd.s();
                };
                MDL_io.ints(rd, this.delegee.revealedInts);
            },


            /**
             * `REALIZED`
             * @memberof B_oreScanner
             * @instance
             * @func
             * @return {number}
             * @lovecAttached
             */
            ex_getReloadFrac: function() {
                return this.progress;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @memberof B_oreScanner
             * @instance
             * @func
             * @return {number}
             * @lovecAttached
             */
            ex_getWarmupFrac: function() {
                return this.self.ex_getScanFrac();
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Sets revealed status of all ores in range.
             * <br> Usually it's necessary to update other scanners in range.
             * @memberof B_oreScanner
             * @instance
             * @func
             * @param {boolean} bool
             * @return {void}
             */
            ex_setRevealed: function(bool) {
                comp_ex_setRevealed(this, bool);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Scanning progress, affects efficiency of other buildings.
             * @memberof B_oreScanner
             * @instance
             * @func
             * @return {number}
             */
            ex_getScanFrac: function() {
                return comp_ex_getScanFrac(this);
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
