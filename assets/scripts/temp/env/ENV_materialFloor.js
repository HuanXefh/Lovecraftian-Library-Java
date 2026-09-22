/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<Floor, ENV_baseFloor>} ENVBaseFloor
     */


    const PARENT = require("lovec/temp/env/ENV_baseFloor");


    /* <------------------------------ component ------------------------------ */


    /**
     * @private
     * @param {ENVBaseFloor} blk
     * @return {void}
     */
    function comp_init(blk) {
        if(blk.matGrp === "SPEC: use parent") {
            blk.matGrp = tryJsProp(blk.parent, "matGrp", "none");
        };

        if(blk.setupVanillaProp) {
            if(!Vars.headless && blk.matGrp !== "none" && blk.walkSound === Sounds.unset) {
                blk.walkSound = fetchSound("se-step-" + blk.matGrp);
            };
            blk.walkSoundVolume = blk.defStepVol;
            blk.walkSoundPitchMin = blk.defStepPitchMin;
            blk.walkSoundPitchMax = blk.defStepPitchMax;
            if(blk.status !== StatusEffects.none) {
                blk.statusDuration = blk.defStaDur;
            };
            if(blk.speedMultiplier.fEqual(1.0)) {
                blk.speedMultiplier = DB_env.db["grpParam"]["floor"]["speed"].read(blk.matGrp, 1.0);
            };
        };
        DB_env.db["grpParam"]["floor"]["extraSetter"].read(blk.matGrp, Function.air)(blk, blk.setupVanillaProp);

        // Get random overlay regions by tags
        let randRegs = [];
        blk.randRegs.forEachFast(tag => {
            randRegs.pushNonNull((
                Vars.headless ?
                    Function.air :
                    DB_env.db["map"]["randRegTag"].read(tag, Function.air)
            )());
        }, true);
        blk.randRegs = randRegs;
    };


    /**
     * @private
     * @param {ENVBaseFloor} blk
     * @param {Floor} t
     * @return {void}
     */
    function comp_drawBase(blk, t) {
        if(t.overlay() !== Blocks.air) return;
        blk.randOvDrawnMap.clear();
        let i = 0, iCap = blk.randRegs.iCap();
        while(i < iCap) {
            if(!blk.randOvDrawnMap.get(t, false) && LCDrawf.randomOverlay(t, blk.randRegs[i], blk.randRegDenoms[i], blk.randRegOffs[0], blk.randRegOffs[1])) {
                blk.randOvDrawnMap.put(t, true);
            };
            i++;
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Parent of all floors with a specific material.
     * Random overlay is supported.
     * Unlike {@link ENV_liquidMaterialFloor} there's no name generation, it's intended to avoid bugs.
     * @class ENV_materialFloor
     * @extends ENV_baseFloor
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_materialFloor")
    .initTemplate()
    .setParent(Floor)
    .setTags("env-mat-flr")
    .setParam({


        /**
         * `PARAM`: Material of the floor. Affects step sound ("se-step-xxx") and terrain type.
         * @memberof ENV_materialFloor
         * @instance
         * @type {string}
         */
        matGrp: "none",
        /**
         * `PARAM`: A list of random overlay tags, will be replaced with texture regions on INIT. See {@link DB_env.db.map.randRegTag}.
         * @memberof ENV_materialFloor
         * @instance
         * @type {TDynamic<Array<string>|D2Array<TextureRegion>>}
         */
        randRegs: tprov(() => []),
        /**
         * `PARAM`: Larger value leads to fewer overlays drawn.
         * @memberof ENV_materialFloor
         * @instance
         * @type {TDynamic<Array<number>>}
         */
        randRegDenoms: tprov(() => [80]),
        /**
         * `PARAM`: Random overlay offsets as a 2-tuple.
         * @memberof ENV_materialFloor
         * @instance
         * @type {TDynamic<[number, number]>}
         */
        randRegOffs: tprov(() => [0, 0]),


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`: Whether random overlay is already drawn. Used to avoid multiple overlay drawn in one tile.
         * @memberof ENV_materialFloor
         * @instance
         * @type {TDynamic<ObjectMap<Tile, boolean>>}
         */
        randOvDrawnMap: tprov(() => new ObjectMap()),
        /**
         * `INTERNAL`: Default status duration.
         * @memberof ENV_materialFloor
         * @instance
         * @type {number}
         */
        defStaDur: 40.0,
        /**
         * `INTERNAL`: Defalt walk sound volume.
         * @memberof ENV_materialFloor
         * @instance
         * @type {number}
         */
        defStepVol: 0.25,
        /**
         * `INTERNAL`: Defalt walk sound min pitch.
         * @memberof ENV_materialFloor
         * @instance
         * @type {number}
         */
        defStepPitchMin: 0.8,
        /**
         * `INTERNAL`: Defalt walk sound max pitch.
         * @memberof ENV_materialFloor
         * @instance
         * @type {number}
         */
        defStepPitchMax: 1.1,


        /* <------------------------------ vanilla ------------------------------ */


        walkSound: Sounds.unset,


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


        drawBase: function(t) {
            comp_drawBase(this, t);
        },


    });
