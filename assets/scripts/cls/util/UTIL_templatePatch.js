/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * Parses content JSON files and modifies corresponding contents.
     * Works just like JSON files before v9. Does not support `type`.
     * @class
     */
    const UTIL_templatePatch = newClass().initClass();


    /** @type {OrderedMap<string, Tup2<C2Function<Object, Jval>, F2Function<Object, Jval, boolean>|null>>} */
    const callbacks = new OrderedMap();


/*
  ================================================================================
  Section: Definition (Static)
  ================================================================================
*/


    /* <------------------------------ modification ------------------------------> */


    /**
     * Adds a callback for a specific field name.
     * @param {string} name
     * @param {C2Function<Object, Jval>} callback
     * @param {F2Function<Object, Jval, boolean>|unset} [filter]
     * @return {this}
     */
    UTIL_templatePatch.addCallback = function(name, callback, filter) {
        callbacks.put(name, [callback, tryVal(filter, null)]);
        return this;
    };


    /* <------------------------------ internal ------------------------------> */


    /**
     * Gets the target JSON/HJSON file to parse.
     * @param {UnlockableContent} ct
     * @param {string|unset} [folderNameOverwrite]
     * @return {Fi|null}
     */
    UTIL_templatePatch.findFile = function(ct, folderNameOverwrite) {
        let dir = MDL_file.getScriptDir(ct.minfo.mod.name).child("auxFi").child("json").child(tryVal(folderNameOverwrite, ct.getContentType().folderName));
        let seq = dir.findAll(ofi => ofi.name() === (MDL_content.getCtNameNoPrefix(ct) + ".json") || ofi.name() === (MDL_content.getCtNameNoPrefix(ct) + ".hjson"));
        return seq.size === 0 ?
            null :
            seq.get(0);
    };


    /**
     * Gets a boolean value.
     * @param {Jval} jval
     * @param {string} name
     * @param {boolean|unset} [def]
     * @return {boolean}
     */
    UTIL_templatePatch.getBool = function(jval, name, def) {
        return SLCVersionResolver.isV8 ?
            jval.getBoolean(name, Boolean(def)) :
            jval.getBool(name, Boolean(def));
    };


    /**
     * Finds a content by name.
     * @param {ContentType} ctType
     * @param {string} name
     * @return {UnlockableContent}
     */
    UTIL_templatePatch.locate = function(ctType, name) {
        return Reflect.invoke(ContentParser, GLB_var.ctParser, "locate", [ctType, name], ContentType, JAVA.string);
    };


    /**
     * Posts a read request.
     * @param {java.lang.Runnable} run
     * @return {void}
     */
    UTIL_templatePatch.postRead = function(run) {
        Reflect.invoke(ContentParser, GLB_var.ctParser, "read", [run], JAVA.runnable);
    };


    /**
     * Reads bundle fields for a content.
     * It's recommended to set them in `bundle.properties` though.
     * @param {UnlockableContent} ct
     * @param {Jval} jval
     * @return {void}
     */
    UTIL_templatePatch.readBundle = function(ct, jval) {
        let entryName = ct.getContentType() + "." + ct.minfo.mod.name + "-" + ct.name + ".";
        let bundle = Core.bundle;
        if(bundle == null) return;
        while(bundle.getParent() != null) {
            bundle = bundle.getParent();
        };
        if(jval.has("name")) {
            if(!Core.bundle.has(entryName + "name")) {
                bundle.getProperties().put(entryName + "name", jval.getString("name"));
            };
            ct.localizedName = jval.getString("name");
            jval.remove("name");
        };
        if(jval.has("description")) {
            if(!Core.bundle.has(entryName + "description")) {
                bundle.getProperties().put(entryName + "description", jval.getString("description"));
            };
            ct.description = jval.getString("description");
            jval.remove("description");
        };
        if(jval.has("details")) {
            if(!Core.bundle.has(entryName + "details")) {
                bundle.getProperties().put(entryName + "details", jval.getString("details"));
            };
            ct.details = jval.getString("details");
            jval.remove("details");
        };
        if(jval.has("credit")) {
            if(!Core.bundle.has(entryName + "credit")) {
                bundle.getProperties().put(entryName + "credit", jval.getString("credit"));
            };
            ct.credit = jval.getString("credit");
            jval.remove("credit");
        };
    };


    /**
     * Reads class fields for a content.
     * Should be posted.
     * @param {UnlockableContent} ct
     * @param {Jval} jval
     * @return {void}
     */
    UTIL_templatePatch.readFields = function(ct, jval) {
        let
            callback,
            filter;
        callbacks.each((name, tup) => {
            callback = tup[0];
            filter = tup[1];
            if((filter == null || filter(ct, jval)) && jval.has(name)) {
                callback(ct, jval.remove(name));
            };
        });
        Reflect.invoke(ContentParser, GLB_var.ctParser, "readFields", [ct, jval], JAVA.object, SLCVersionResolver.isV8 ? eval("JsonValue") : Jval);
    };


    /**
     * Reads env bitset.
     * @param {Jval} jval
     * @return {number|Environments}
     */
    UTIL_templatePatch.readEnv = function(jval) {
        if(jval.isNumber()) {
            console.warn("[LOVEC] Lovec template patch does not support legacy env integer, use names instead:\n" + jval);
        };
        if(jval.isString()) {
            return getEnvSet(jval.asString());
        };
        if(jval.isArray()) {
            let names = [];
            SLCVersionResolver.isV8 ?
                jval.asStringArray().forEach(str => names.push(str)) :
                jval.asArray().each(ojval => names.push(ojval.asString()));
            return getEnvSet.apply(null, names);
        };
        return getEnvSet("none");
    };


    /* <------------------------------ parse ------------------------------> */


    /**
     * Parses all class fields for a content.
     * @param {UnlockableContent} ct
     * @param {Jval} jval
     * @return {void}
     */
    UTIL_templatePatch.parseFields = function(ct, jval) {
        Reflect.set(ContentParser, GLB_var.ctParser, "currentContent", ct);
        Reflect.set(ContentParser, GLB_var.ctParser, "currentMod", ct.minfo.mod);
        UTIL_templatePatch.postRead(run(() => {
            UTIL_templatePatch.readBundle(ct, jval);
            UTIL_templatePatch.readFields(ct, jval);
        }));
    };


    /**
     * Parses `research` field for a content.
     * @param {UnlockableContent} ct
     * @param {Jval} jval
     * @return {void}
     */
    UTIL_templatePatch.parseResearch = function(ct, jval) {
        let research = jval.remove("research");
        if(research == null) return;
        let name, reqs;
        if(research.isString()) {
            name = research.asString();
            reqs = null;
        } else {
            name = research.getString("parent", null);
            reqs = research.has("requirements") ?
                GLB_var.ctJsonParser.readValue(JAVA.itemStack_arr, research.get("requirements")) :
                null;
        };
        let lastNode = TechTree.all.find(onode => onode.content === ct);
        if(lastNode != null) {
            lastNode.remove();
        };
        let node = new TechTree.TechNode(null, ct, tryVal(reqs, ItemStack.empty));
        let lastFiCur = Reflect.get(ContentParser, GLB_var.ctParser, "currentFile");
        Reflect.get(ContentParser, GLB_var.ctParser, "postreads").add(run(() => {
            Reflect.set(ContentParser, GLB_var.ctParser, "currentContent", ct);
            Reflect.set(ContentParser, GLB_var.ctParser, "currentMod", ct.minfo.mod);
            Reflect.set(ContentParser, GLB_var.ctParser, "currentFile", lastFiCur);
            let isObject = research.isObject();
            // Objectives
            if(isObject && research.has("objectives")) {
                node.objectives.addAll(GLB_var.ctJsonParser.readValue(JAVA.unlockCondition_arr, research.get("objectives")));
            };
            // Resource
            if((ct instanceof Item || ct instanceof Liquid) && !node.objectives.contains(objective => objective instanceof Produce && objective.content === ct)) {
                node.objectives.add(new Produce(ct));
            };
            // Remove old node from parent
            if(node.parent != null) {
                node.parent.children.remove(node);
            };
            // Default requirements
            if(reqs == null) {
                node.setupRequirements(ct.researchRequirements());
            };
            // Node planet
            if(isObject && research.has("planet")) {
                node.planet = Reflect.invoke(ContentParser, GLB_var.ctParser, "find", [ContentType.planet, research.getString("planet")], ContentType, JAVA.string);
            };
            // Node root
            if(isObject && UTIL_templatePatch.getBool(research, "root", false)) {
                node.name = research.getString("name", ct.name);
                node.requiresUnlock = UTIL_templatePatch.getBool(research, "requiresUnlock", false);
                TechTree.roots.add(node);
            } else {
                if(name != null) {
                    let parent = TechTree.all.find(onode => onode.content.name === name || onode.content.name === ct.minfo.mod.name + "-" + name || onode.content.name === SaveVersion.mapFallback(name));
                    if(parent == null) {
                        console.warn("[LOVEC] Node ${1} is required by ${2}, but not added to any tech tree!".format(name.color(GLB_color.remove), ct.name.color(GLB_color.accent)));
                    } else {
                        if(name === ct.name) {
                            console.warn("[LOVEC] Node ${1} is required by itself!".format(name.color(GLB_color.accent)));
                        };
                        if(!parent.children.contains(node)) {
                            parent.children.add(node);
                        };
                        node.parent = parent;
                        node.planet = parent.planet;
                    };
                } else {
                    console.warn("[LOVEC] No parent found for a non-root tech node: " + ct.name.color(GLB_color.accent));
                };
            };
        }));
    };


    /**
     * Parses a block.
     * @param {Block} blk
     * @param {Jval} jval
     * @return {void}
     */
    UTIL_templatePatch.parseBlock = function(blk, jval) {
        UTIL_templatePatch.postRead(run(() => {
            UTIL_templatePatch.parseConsumer(blk, jval);
            // Set up visibility
            if(jval.has("requirements") && blk.buildVisibility === BuildVisibility.hidden) {
                blk.buildVisibility = BuildVisibility.shown;
            };
            // turret
            if(blk instanceof Turret) {
                if(SLCVersionResolver.isV8) {
                    if(jval.has("maxAmmo") && instanceOfAny(blk, ItemTurret, LiquidTurret)) {
                        console.warn("[LOVEC] Do not use `maxAmmo` for item turret and liquid turret! Set capacity instead.");
                        jval.remove("maxAmmo");
                    };
                    if(jval.has("ammoPerShot")) {
                        console.warn("[LOVEC] Do not use `ammoPerShot`!");
                        jval.remove("ammoPerShot");
                    };
                    if(jval.has("ammoUsed")) {
                        let frac = Number(jval.remove("ammoUsed").asString());
                        blk.ammoMultiplier = 1.0 / frac;
                    };
                    if(jval.has("displayAmmoUsed")) {
                        blk.displayAmmoMultiplier = UTIL_templatePatch.getBool(jval, "displayAmmoUsed", true);
                        jval.remove("displayAmmoUsed");
                    };
                    Core.app.post(() => {
                        if(blk instanceof ItemTurret) {
                            blk.maxAmmo = blk.itemCapacity;
                        } else if(blk instanceof LiquidTurret) {
                            blk.maxAmmo = blk.liquidCapacity;
                        };
                    });
                };
            };
        }));
    };


    /**
     * Parses consumers for a block.
     * @param {Block} blk
     * @param {Jval} jval
     * @return {void}
     */
    UTIL_templatePatch.parseConsumer = function(blk, jval) {
        let consumes = jval.remove("consumes");
        if(consumes == null) return;
        if(!consumes.isObject()) throw new Error("`consumes` must be an object: " + blk.name);
        Reflect.invoke(ContentParser, GLB_var.ctParser, "readBlockConsumers", [blk, consumes], Block, SLCVersionResolver.isV8 ? eval("JsonValue") : Jval);
    };


    /**
     * Parses AI controller for a unit type.
     * @param {UnitType} utp
     * @param {Jval} jval
     * @return {void}
     */
    UTIL_templatePatch.parseController = function(utp, jval) {
        if(jval.has("controller") || jval.has("aiController")) {
            utp.aiController = Reflect.invoke(ContentParser, GLB_var.ctParser, "resolveController", [jval.getString("controller", jval.getString("aiController", ""))], JAVA.string);
            jval.remove("controller");
            jval.remove("aiController");
        };
        if(jval.has("defaultController")) {
            let ctrlProv = Reflect.invoke(ContentParser, GLB_var.ctParser, "resolveController", [jval.getString("defaultController")], JAVA.string);
            utp.controller = func(unit => ctrlProv.get());
            jval.remove("defaultController");
        };
    };


    /**
     * Parses a planet.
     * @param {Planet} pla
     * @param {Jval} jval
     * @return {void}
     */
    UTIL_templatePatch.parsePlanet = function(pla, jval) {
        UTIL_templatePatch.postRead(run(() => {
            // Mesh
            if(jval.has("mesh") && !pla.delegee.skipMeshParse) {
                let mesh = jval.get("mesh");
                if(!mesh.isObject() && !mesh.isArray()) throw new Error("Failed to parse base mesh: " + pla);
                jval.remove("mesh");
                pla.meshLoader = prov(() => {
                    let mesh_fi;
                    try {
                        mesh_fi = Reflect.invoke(ContentParser, GLB_var.ctParser, "parseMesh", [pla, mesh], Planet, SLCVersionResolver.isV8 ? eval("JsonValue") : Jval);
                    } catch(err) {
                        console.err(err);
                        mesh_fi = new ShaderSphereMesh(pla, Shaders.unlit, 2);
                    };
                    return mesh_fi;
                });
            } else {
                jval.remove("mesh");
                pla.meshLoader = prov(() => pla.self.ex_getMesh());
            };

            // Cloud mesh
            if(jval.has("cloudMesh") && !pla.skipCloudMeshParse) {
                let mesh = jval.get("cloudMesh");
                if(!mesh.isObject() && !mesh.isArray()) throw new Error("Failed to parse cloud mesh: " + pla);
                jval.remove("cloudMesh");
                pla.cloudMeshLoader = prov(() => {
                    let mesh_fi;
                    try {
                        mesh_fi = Reflect.invoke(ContentParser, GLB_var.ctParser, "parseMesh", [pla, mesh], Planet, SLCVersionResolver.isV8 ? eval("JsonValue") : Jval);
                    } catch(err) {
                        console.err(err);
                        mesh_fi = null;
                    };
                    return mesh_fi;
                });
            } else {
                jval.remove("cloudMesh");
                pla.cloudMeshLoader = prov(() => pla.self.ex_getCloudMesh());
            };

            // Generator
            if(jval.has("generator") && !pla.skipGeneratorParse) {
                // TODO: Generator things, maybe for years.
            } else {
                jval.remove("generator");
            };
        }));
    };


    /**
     * Parses a sector preset.
     * @param {SectorPreset} sec
     * @param {Jval} jval
     * @return {void}
     */
    UTIL_templatePatch.parseSector = function(sec, jval) {
        if(!jval.has("sector") || !jval.get("sector").isNumber()) throw new Error("`sector` must be a number: " + sec.name);
        UTIL_templatePatch.postRead(run(() => {
            let pla = tryVal(sec.planet, Planets.serpulo);
            UTIL_templatePatch.parseDifficulty(sec, jval);
            if(jval.has("planet")) {
                pla = UTIL_templatePatch.locate(ContentType.planet, jval.getString("planet", "serpulo"));
                if(pla == null) throw new LCError.NullArgumentError(sec.name + ".planet");
                jval.remove("planet");
            };
            if(jval.has("sector")) {
                let prevSector = sec.sector;
                if(prevSector != null && prevSector.preset === sec) {
                    prevSector.preset = null;
                };
                let secId = jval.getInt("sector", 0) % pla.sectors.size;
                sec.initialize(pla, secId, true);
                jval.remove("sector");
            };
            if(jval.has("rules")) {
                let rules = jval.remove("rules");
                if(!rules.isObject()) throw new Error("`rules` must be an object: " + sec.name);
                sec.rules = rules0 => {
                    try {
                        JsonIO.json.readFiles(rules0, rules);
                    } catch(err) {
                        console.err("[LOVEC] Failed to load rules from sector preset:\n" + err);
                    };
                };
            };
        }));
    };


    /**
     * Parses difficulty for a sector preset.
     * @param {SectorPreset} sec
     * @param {Jval} jval
     * @return {void}
     */
    UTIL_templatePatch.parseDifficulty = function(sec, jval) {
        let difficulty = jval.remove("difficulty");
        if(difficulty == null) return;
        let difficulty_fi;
        if(SLCVersionResolver.isV8) {
            if(difficulty.isNumber()) {
                difficulty_fi = difficulty.asInt();
            } else {
                difficulty_fi = difficulty.asString();
                switch(difficulty_fi) {
                    case "low" :
                        difficulty_fi = 0;
                        break;
                    case "medium" :
                        difficulty_fi = 3;
                        break;
                    case "high" :
                        difficulty_fi = 5;
                        break;
                    case "extreme" :
                        difficulty_fi = 8;
                        break;
                    case "eradication" :
                        difficulty_fi = 10;
                        break;
                    case "unreasonable" :
                        difficulty_fi = 13;
                        break;
                    default :
                        difficulty_fi = 0;
                };
            };
            sec.difficulty = difficulty_fi;
        } else {
            if(difficulty.isNumber()) {
                difficulty_fi = difficulty.asFloat();
                if(difficulty_fi < 3) {
                    difficulty_fi = "low";
                } else if(difficulty_fi < 5) {
                    difficulty_fi = "medium";
                } else if(difficulty_fi < 8) {
                    difficulty_fi = "high";
                } else if(difficulty_fi < 10) {
                    difficulty_fi = "extreme";
                } else if(difficulty_fi < 13) {
                    difficulty_fi = "eradication";
                } else {
                    difficulty_fi = "unreasonable";
                };
            } else {
                difficulty_fi = difficulty.asString();
            };
            difficulty_fi = eval("SectorThreat['" + difficulty_fi + "']");
            sec.threat = difficulty_fi;
        };
    };


    /* <------------------------------ util ------------------------------> */


    /**
     * Gets JSON value of a content from its JSON/HJSON file in `scripts/auxFi/json/xxx`.
     * Used to bypass vanilla JSON parsing, which is overhauled in v9 and causes compatibility issues.
     * @param {UnlockableContent} ct
     * @param {string|unset} [folderNameOverwrite]
     * @return {Jval|null}
     */
    UTIL_templatePatch.getJval = function(ct, folderNameOverwrite) {
        if(ct.minfo.mod == null) return null;
        GLB_var.ctParser.checkInit();
        let fi = UTIL_templatePatch.findFile(ct, folderNameOverwrite);
        if(fi == null) return null;
        let jval = jsonToJval(fi);
        // Convert `Jval` to `JsonValue` in v8
        if(SLCVersionResolver.isV8) {
            jval = eval("GLB_var.jsonParser.fromJson(null, jval.toString(Jval.Jformat.plain))");
        };
        if(jval.isString()) {
            jval = null;
        };
        if(jval != null) {
            Reflect.set(ContentParser, GLB_var.ctParser, "currentFile", fi);
            Reflect.set(ContentParser, GLB_var.ctParser, "currentMod", ct.minfo.mod);
        };
        return jval;
    };


    /**
     * Patches a regular block.
     * @param {Block} blk
     * @return {void}
     */
    UTIL_templatePatch.handleBlock = function(blk) {
        let jval = UTIL_templatePatch.getJval(blk);
        if(jval != null) {
            UTIL_templatePatch.parseResearch(blk, jval);
            UTIL_templatePatch.parseBlock(blk, jval);
            UTIL_templatePatch.parseFields(blk, jval);
        };
    };


    /**
     * Patches an environmental block.
     * @param {Block} blk
     * @return {void}
     */
    UTIL_templatePatch.handleEnvBlock = function(blk) {
        let jval = UTIL_templatePatch.getJval(blk);
        if(jval != null) {
            UTIL_templatePatch.parseBlock(blk, jval);
            UTIL_templatePatch.parseFields(blk, jval);
        };
    };


    /**
     * Patches a unit type.
     * @param {UnitType} utp
     * @return {void}
     */
    UTIL_templatePatch.handleUnitType = function(utp) {
        let jval = UTIL_templatePatch.getJval(utp);
        if(jval != null) {
            UTIL_templatePatch.parseResearch(utp, jval);
            UTIL_templatePatch.parseController(utp, jval);
            UTIL_templatePatch.parseFields(utp, jval);
        };
    };


    /**
     * Patches an item.
     * @param {Item} item
     * @return {void}
     */
    UTIL_templatePatch.handleItem = function(item) {
        let jval = UTIL_templatePatch.getJval(item);
        if(jval != null) {
            UTIL_templatePatch.parseResearch(item, jval);
            UTIL_templatePatch.parseFields(item, jval);
        };
    };


    /**
     * Patches a liquid.
     * @param {Liquid} liq
     * @return {void}
     */
    UTIL_templatePatch.handleLiquid = function(liq) {
        let jval = UTIL_templatePatch.getJval(liq);
        if(jval != null) {
            UTIL_templatePatch.parseResearch(liq, jval);
            UTIL_templatePatch.parseFields(liq, jval);
        };
    };


    /**
     * Patches a status effect.
     * @param {StatusEffect} sta
     * @param {boolean|unset} [hasResearch]
     * @return {void}
     */
    UTIL_templatePatch.handleStatusEffect = function(sta, hasResearch) {
        let jval = UTIL_templatePatch.getJval(sta);
        if(jval != null) {
            if(hasResearch) {
                UTIL_templatePatch.parseResearch(sta, jval);
            };
            UTIL_templatePatch.parseFields(sta, jval);
        };
    };


    /**
     * Patches a planet.
     * @param {Planet} pla
     * @return {void}
     */
    UTIL_templatePatch.handlePlanet = function(pla) {
        let jval = UTIL_templatePatch.getJval(pla);
        if(jval != null) {
            UTIL_templatePatch.parsePlanet(pla, jval);
            UTIL_templatePatch.parseFields(pla, jval);

            MDL_event.onDelayRun(0.0, () => {
                pla.orbitTime = Mathf.pow(pla.orbitRadius, 1.5) * 1000.0;
                if(pla.parent != null) {
                    pla.parent.children.add(pla);
                    pla.parent.updateTotalRadius();
                };
            });
        };
    };


    /**
     * Patches a sector preset.
     * @param {SectorPreset} sec
     * @return {void}
     */
    UTIL_templatePatch.handleSector = function(sec) {
        let jval = UTIL_templatePatch.getJval(sec);
        if(jval != null) {
            UTIL_templatePatch.parseResearch(sec, jval);
            UTIL_templatePatch.parseSector(sec, jval);
            UTIL_templatePatch.parseFields(sec, jval);
        };
    };


    /**
     * Patches a weather.
     * @param {Weather} wea
     * @return {void}
     */
    UTIL_templatePatch.handleWeather = function(wea) {
        let jval = UTIL_templatePatch.getJval(wea);
        if(jval != null) {
            UTIL_templatePatch.parseFields(wea, jval);
        };
    };




module.exports = UTIL_templatePatch;
