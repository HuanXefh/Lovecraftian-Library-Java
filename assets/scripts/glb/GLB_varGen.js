/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Most generated parameters, some are only populated after CLIENT LOAD.
     * @module lovec/glb/GLB_varGen
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ sprite ------------------------------ */


    MDL_event.onLoad(() => {


        /**
         * Extra texture regions registered in {@link DB_misc}.
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
         * Extra drawable texture regions registered in {@link DB_misc}.
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
         * Extra noise textures registered in {@link DB_misc}.
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
                    obj[name].setFilter(Texture.TextureFilter.linear);
                    obj[name].setWrap(Texture.TextureWrap.repeat);
                } catch(err) {
                    console.warn("[LOVEC] Cannot load noise texture for: " + path);
                };
            });
            return obj;
        })();


    });


    /* <------------------------------ list ------------------------------ */


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


        /* <------------------------------ resource ------------------------------ */


        /**
         * All shown items and liquids.
         * @type {Array<Resource>}
         */
        exports.allRss = Vars.content.items().toArray().concat(Vars.content.liquids().toArray()).inSituFilter(rs => !rs.hidden);


        /**
         * Items in the sand group, see {@link DB_item}.
         * @type {Array<Item>}
         */
        exports.sandItems = DB_item.db["group"]["sand"].map(name => MDL_content.getCt(name, ContentGetModes.RS)).compact();


        /**
         * Fluids with fluid heat.
         * @type {Array<Liquid>}
         */
        exports.hotFlds = Vars.content.liquids().select(liq => LCDBFileHandler.read("liquid-fluid-heat", liq, 0.0) >= 50.0).toArray();


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
        exports.wasItems = Vars.content.items().select(item => MDL_cond.isWaste(item)).toArray();


        /**
         * All waste fluids.
         * @type {Array<Liquid>}
         */
        exports.wasFlds = Vars.content.liquids().select(liq => MDL_cond.isWaste(liq)).toArray();


        /**
         * Items that are considered explosive.
         * @type {Array<Item>}
         */
        exports.exploItems = Vars.content.items().select(item => item.explosiveness >= 0.3 && item.flammability >= 0.3).toArray();


        /**
         * Fluids that are considered explosive.
         * @type {Array<Liquid>}
         */
        exports.exploFlds = Vars.content.liquids().select(liq => (liq.explosiveness >= 0.3 || liq.flammability >= 0.3) && !MDL_cond.isAuxiliaryFluid(liq)).toArray();


        /**
         * All abstract fluids.
         * @type {Array<Liquid>}
         */
        exports.auxs = Vars.content.liquids().select(liq => MDL_cond.isAuxiliaryFluid(liq)).toArray();


        /**
         * All non-abstract fluids.
         * @type {Array<Liquid>}
         */
        exports.nonAuxs = Vars.content.liquids().select(liq => !MDL_cond.isAuxiliaryFluid(liq)).toArray();


        /* <------------------------------ block ------------------------------ */


        /**
         * All non-environmental blocks.
         * @type {Array<Block>}
         */
        exports.nonEnvBlks = Vars.content.blocks().select(blk => blk.synthetic()).toArray();


        /**
         * See {@link BLK_rawOreBlock}.
         * @type {Array<Block>}
         */
        exports.rawOreBlks = Vars.content.blocks().select(blk => checkSubInsOfTemp(blk, "BLK_rawOreBlock")).toArray();


        Time.run(0.0, () => {
            /**
             * Blocks that can be payload input or output.
             * @type {Array<Block>}
             */
            exports.payMatBlks = module.exports.nonEnvBlks.filter(blk => MDL_recipeDict.rcDict.cons.block[blk.id].some(tmp => isNativeObject(tmp) && !tmp.hidden) || MDL_recipeDict.rcDict.prod.block[blk.id].some(tmp => isNativeObject(tmp) && !tmp.hidden));
        });


        /* unit type */


        Time.run(0.0, () => {
            /**
             * Unit types that can be crafted.
             * @type {Array<UnitType>}
             */
            exports.buildableUtps = Vars.content.units().select(utp => !utp.internal && (MDL_recipeDict.rcDict.cons.unit[utp.id].length > 0 || MDL_recipeDict.rcDict.prod.unit[utp.id].length > 0)).toArray();
        });


        /**
         * All vanilla unit types.
         * @type {Array<UnitType>}
         */
        exports.vanillaUtps = Vars.content.units().select(utp => MDL_content.getMod(utp) === "vanilla").toArray();


        /**
         * Non-robot unit types.
         * @type {Array<UnitType>}
         */
        exports.bioticUtps = Vars.content.units().select(utp => MDL_cond.isNonRobot(utp)).toArray();


        /**
         * Naval unit types.
         * @type {Array<UnitType>}
         */
        exports.navalUtps = Vars.content.units().select(utp => utp.naval).toArray();


        /**
         * Missile unit types.
         * @type {Array<UnitType>}
         */
        exports.missileUtps = Vars.content.units().select(utp => utp instanceof MissileUnitType).toArray();


        /* <------------------------------ status effect ------------------------------ */


        /**
         * Fading status effect.
         * @type {Array<STAFadeStatus>}
         */
        exports.fadeStas = Vars.content.statusEffects().select(sta => MDL_cond.isFadeStatus(sta)).toArray();


        /**
         * On-death status effect.
         * @type {Array<STADeathStatus>}
         */
        exports.deathStas = Vars.content.statusEffects().select(sta => MDL_cond.isDeathStatus(sta)).toArray();


        /**
         * Stackable status effect.
         * @type {Array<StatusEffect>}
         */
        exports.stackStas = Vars.content.statusEffects().select(sta => MDL_cond.isStackStatus(sta)).toArray();


        /* <------------------------------ planet ------------------------------ */


        /**
         * Planets added by LovecLab.
         * @type {Array<Planet>}
         */
        exports.lovecPlas = Vars.content.planets().select(pla => pla.accessible && (pla.minfo.mod == null ? "" : pla.minfo.mod.name) === "loveclab").toArray();


        /* <------------------------------ weather ------------------------------ */


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


    /* <------------------------------ misc ------------------------------ */


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
