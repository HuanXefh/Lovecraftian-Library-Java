/*
  ================================================================================
  Section: Introduction
  ================================================================================
*/


    /**
     * Most generated parameters, some are only populated after CLIENT LOAD.
     * @module lovec/glb/GLB_varGen
     */


/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ sprite ------------------------------> */


    MDL_event.onLoad(() => {


        /**
         * Extra texture regions registered in {@link DB_misc.db.texture.icon}.
         * @type {Object<string, TextureRegion>}
         */
        exports.iconRegs = (function() {
            let obj = {};
            DB_misc.db["texture"]["icon"].forEachRow(2, (name, nameReg) => {
                obj[name] = findRegion(nameReg);
            }, true);
            return obj;
        })();


        /**
         * Extra drawable texture regions registered in {@link DB_misc.db.texture.icon}.
         * @type {Object<string, TextureRegionDrawable>}
         */
        exports.icons = (function() {
            let obj = {};
            Object.eachPair(module.exports.iconRegs, (name, reg) => {
                obj[name] = new TextureRegionDrawable(reg);
            });
            return obj;
        })();


        /**
         * Extra noise textures registered in {@link DB_misc.db.texture.noise}.
         * @type {Object<string, Texture>}
         */
        exports.noiseTexs = (function() {
            let obj = {};
            let load = path => {
                if(Vars.headless) return new Texture();
                Core.assets.load(path, Texture);
                return Core.assets.get(path, Texture);
            };
            DB_misc.db["texture"]["noise"].forEachRow(2, (name, path) => {
                try {
                    obj[name] = load(path);
                    obj[name].setFilter(TextureFilter.linear);
                    obj[name].setWrap(TextureWrap.repeat);
                } catch(err) {
                    console.warn("[LOVEC] Cannot load noise texture for: " + path);
                };
            });
            return obj;
        })();


    });


    /* <------------------------------ list ------------------------------> */


    MDL_event.onLoad(() => {


        /**
         * Teams for major iteration.
         * @type {Array<Team>}
         */
        exports.mainTeams = [
            Team.sharded,
            Team.crux,
            Team.malis,
            Team.green,
            Team.blue,
            Team.neoplastic,
        ]
        .pushAll(DB_env.db["extraMainTeam"]);


        /**
         * Maps faction to contents under it.
         * @type {ObjectMap<string, Array<UnlockableContent>>}
         */
        exports.factionBlksMap = (function() {
            let map = new ObjectMap();
            DB_block.db["grpParam"]["factionColor"].forEachRow(2, (faction, colorStr) => {
                if(faction == "none") return;
                map.put(faction, MDL_content.getFactionCts(faction));
            }, true);
            return map;
        })();


        /**
         * Maps factory family to blocks under it.
         * @type {ObjectMap<string, Array<Block>>}
         */
        exports.famiBlksMap = (function() {
            let map = new ObjectMap();
            MDL_content.getFacFamisDefined().forEachFast(fami => map.put(fami, MDL_content.getFacFamiBlks(fami)), true);
            return map;
        })();


        /**
         * All contents that are registered in recipe dictionary.
         * @type {Array<UnlockableContent>}
         */
        exports.rcDictCts = [];


        /* <------------------------------ resource ------------------------------> */


        /**
         * All items.
         * @type {Array<Item>}
         */
        exports.allItems = Vars.content.items().toArray().cpy();


        /**
         * All fluids.
         * @type {Array<Item>}
         */
        exports.allFlds = Vars.content.liquids().toArray().cpy();


        /**
         * All items and liquids.
         * @type {Array<Resource>}
         */
        exports.allRss = module.exports.allItems.concat(module.exports.allFlds);


        /**
         * Items in the sand group, see {@link DB_item.db.group.sand}.
         * @type {Array<Item>}
         */
        exports.sandItems = DB_item.db["group"]["sand"].map(name => MDL_content.getCt(name, ContentGetModes.RS)).compact();


        /**
         * Fluids with fluid heat.
         * @type {Array<Liquid>}
         */
        exports.hotFlds = module.exports.allFlds.filter(liq => LCDBFileHandler.read("liquid-fluid-heat", liq, 0.0) >= 50.0);


        /**
         * Items that can be used as fuel.
         * @type {Array<Item>}
         */
        exports.fuelItems = DB_item.db["param"]["fuel"]["item"].readCol(2, 0).inSituMap(name => MDL_content.getCt(name, ContentGetModes.RS)).compact();


        /**
         * Liquids (no gases) that can be used as fuel.
         * @type {Array<Liquid>}
         */
        exports.fuelLiqs = DB_item.db["param"]["fuel"]["fluid"].readCol(2, 0).inSituMap(name => MDL_content.getCt(name, ContentGetModes.RS)).compact().inSituFilter(liq => !liq.gas);


        /**
         * Gases that can be used as fuel.
         * @type {Array<Liquid>}
         */
        exports.fuelGases = DB_item.db["param"]["fuel"]["fluid"].readCol(2, 0).inSituMap(name => MDL_content.getCt(name, ContentGetModes.RS)).compact().inSituFilter(liq => liq.gas);


        /**
         * Maps intermediate tags to intermediate resources under it.
         * @type {ObjectMap<string, Array<Resource>>}
         */
        exports.tagIntmdsMap = (function() {
            let map = new ObjectMap();
            DB_item.db["intmd"]["tag"].forEachFast(tag => map.put(tag, []), true);
            Vars.content.items().each(item => tryFun(item.ex_getIntmdTags, item, Array.air).forEachFast(tag => map.get(tag).push(item), true));
            Vars.content.liquids().each(liq => tryFun(liq.ex_getIntmdTags, liq, Array.air).forEachFast(tag => map.get(tag).push(liq), true));
            return map;
        })();


        /**
         * All waste items.
         * @type {Array<Item>}
         */
        exports.wasItems = module.exports.allItems.filter(item => MDL_cond.isWaste(item));


        /**
         * All waste fluids.
         * @type {Array<Liquid>}
         */
        exports.wasFlds = module.exports.allFlds.filter(liq => MDL_cond.isWaste(liq));


        /**
         * Items that are considered explosive.
         * @type {Array<Item>}
         */
        exports.exploItems = module.exports.allItems.filter(item => item.explosiveness >= 0.3 && item.flammability >= 0.3);


        /**
         * Fluids that are considered explosive.
         * @type {Array<Liquid>}
         */
        exports.exploFlds = module.exports.allFlds.filter(liq => (liq.explosiveness >= 0.3 || liq.flammability >= 0.3) && !MDL_cond.isAuxiliaryFluid(liq));


        /**
         * All abstract fluids.
         * @type {Array<RSAbstractFluid>}
         */
        exports.auxs = module.exports.allFlds.filter(liq => MDL_cond.isAuxiliaryFluid(liq));


        /**
         * All non-abstract fluids.
         * @type {Array<Liquid>}
         */
        exports.nonAuxs = module.exports.allFlds.filter(liq => !MDL_cond.isAuxiliaryFluid(liq));


        /* <------------------------------ block ------------------------------> */


        /**
         * All blocks.
         * @type {Array<Block>}
         */
        exports.allBlks = Vars.content.blocks().toArray().cpy();


        /**
         * All non-environmental blocks.
         * @type {Array<Block>}
         */
        exports.nonEnvBlks = module.exports.allBlks.filter(blk => blk.synthetic());


        /**
         * See {@link BLK_rawOreBlock}.
         * @type {Array<BLKRawOreBlock>}
         */
        exports.rawOreBlks = module.exports.allBlks.filter(blk => checkSubInsOfTemp(blk, "BLK_rawOreBlock"));


        MDL_event.onDelayRun(0.0, () => {
            /**
             * Blocks that can be payload input or output.
             * @type {Array<Block>}
             */
            exports.payMatBlks = module.exports.nonEnvBlks.filter(blk => MDL_recipeDict.rcDict.cons.block[blk.id].some(tmp => isNativeObject(tmp) && !tmp.hidden) || MDL_recipeDict.rcDict.prod.block[blk.id].some(tmp => isNativeObject(tmp) && !tmp.hidden));
        });


        /* unit type */


        /**
         * All unit types.
         * @type {Array<UnitType>}
         */
        exports.allUtps = Vars.content.units().toArray().cpy();


        MDL_event.onDelayRun(0.0, () => {
            /**
             * Unit types that can be crafted.
             * @type {Array<UnitType>}
             */
            exports.buildableUtps = module.exports.allUtps.filter(utp => !utp.internal && (MDL_recipeDict.rcDict.cons.unit[utp.id].length > 0 || MDL_recipeDict.rcDict.prod.unit[utp.id].length > 0));
        });


        /**
         * All vanilla unit types.
         * @type {Array<UnitType>}
         */
        exports.vanillaUtps = module.exports.allUtps.filter(utp => MDL_content.getMod(utp) === "vanilla");


        /**
         * Non-robot unit types.
         * @type {Array<UnitType>}
         */
        exports.bioticUtps = module.exports.allUtps.filter(utp => MDL_cond.isNonRobot(utp));


        /**
         * Naval unit types.
         * @type {Array<UnitType>}
         */
        exports.navalUtps = module.exports.allUtps.filter(utp => utp.naval);


        /**
         * Missile unit types.
         * @type {Array<UnitType>}
         */
        exports.missileUtps = module.exports.allUtps.filter(utp => utp instanceof MissileUnitType);


        /* <------------------------------ status effect ------------------------------> */


        /**
         * All status effects.
         * @type {Array<statusEffect>}
         */
        exports.allStas = Vars.content.statusEffects().toArray().cpy();


        /**
         * Fading status effect.
         * @type {Array<STAFadeStatus>}
         */
        exports.fadeStas = module.exports.allStas.filter(sta => MDL_cond.isFadeStatus(sta));


        /**
         * On-death status effect.
         * @type {Array<STADeathStatus>}
         */
        exports.deathStas = module.exports.allStas.filter(sta => MDL_cond.isDeathStatus(sta));


        /**
         * Stackable status effect.
         * @type {Array<INTFSTABurstStatus>}
         */
        exports.stackStas = module.exports.allStas.filter(sta => MDL_cond.isStackStatus(sta));


        /* <------------------------------ planet ------------------------------> */


        /**
         * All planets.
         * @type {Array<Planet>}
         */
        exports.allPlas = Vars.content.planets().toArray().cpy();


        /**
         * Planets added by LovecLab.
         * @type {Array<PLABasePlanet>}
         */
        exports.lovecPlas = module.exports.allPlas.filter(pla => pla.accessible && (pla.minfo.mod == null ? "" : pla.minfo.mod.name) === "loveclab");


        /* <------------------------------ weather ------------------------------> */


        /**
         * All weathers.
         * @type {Array<Weather>}
         */
        exports.allWeas = Vars.content.weathers().toArray().cpy();


        /**
         * Permanent weather entries for all weathers.
         * @type {ObjectMap<string, Weather.WeatherEntry>}
         */
        exports.nameWeaEnsMap = (function() {
            let map = new ObjectMap();
            let weaEn;
            Vars.content.weathers().each(wea => {
                weaEn = new Weather.WeatherEntry(wea);
                weaEn.always = true;
                map.put(wea.name, weaEn);
            });
            return map;
        })();


    });


    /* <------------------------------ misc ------------------------------> */


    MDL_event.onLoad(() => {


        exports.auxPres = Vars.content.liquid("loveclab-aux0aux-pressure");
        exports.auxVac = Vars.content.liquid("loveclab-aux0aux-vacuum");
        exports.auxHeat = Vars.content.liquid("loveclab-aux0aux-heat");
        exports.auxTor = Vars.content.liquid("loveclab-aux0aux-torque");
        exports.auxRpm = Vars.content.liquid("loveclab-aux0aux-rpm");


        exports.utpLoot = Vars.content.unit("loveclab-unit0misc-loot");


        exports.staNoConstruction = Vars.content.statusEffect("loveclab-sta-no-construction");
        exports.staHiddenWell = Vars.content.statusEffect("loveclab-sta-hidden-well");
        exports.staStunned = Vars.content.statusEffect("loveclab-sta-stunned");
        exports.staSlightlyInjured = Vars.content.statusEffect("loveclab-sta-slightly-injured");
        exports.staInjured = Vars.content.statusEffect("loveclab-sta-injured");
        exports.staHeavilyInjured = Vars.content.statusEffect("loveclab-sta-heavily-injured");
        exports.staDamaged = Vars.content.statusEffect("loveclab-sta-damaged");
        exports.staSeverelyDamaged = Vars.content.statusEffect("loveclab-sta-severely-damaged");
        exports.staOverheated = Vars.content.statusEffect("loveclab-sta0bur-overheated");


    });
