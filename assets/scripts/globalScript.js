// noinspection JSUndeclaredVariable


/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * globalScript.js is run BEFORE Lovec is loaded, and NOT in STRICT MODE. Don't explicitly `require` anything!
     * This is mostly intended for console and some generic methods.
     * For your own mod, simply create another globalScript.js in your "scripts" folder, it will be automatically loaded.
     * Beware of naming conflict!
     */


/*
  ========================================
  Section: Pre-load
  ========================================
*/


    /**
     * `IMPORTANT`: {@link RUN_methodExt} has not been run yet!
     */


    /* <------------------------------ base ------------------------------> */


    /**
     * @global
     * @type {rhino.Context}
     */
    CONTEXT = Packages.rhino.Context.getContext();
    /**
     * @global
     * @type {rhino.Scriptable}
     */
    SCOPE = Vars.mods.scripts.scope;


    /**
     * Internal scope for Java methods. Do not use in JS!
     * @private
     * @type {Object<string, Object>}
     */
    __javaInternal__ = {};


    /**
     * Evaluates given string in global scope.
     * @global
     * @param {string} scrStr
     * @param {string|unset} [nameFi]
     * @return {void}
     */
    globalEval = function(scrStr, nameFi) {
        if(typeof nameFi === "string") {
            Vars.mods.scripts.context.evaluateString(SCOPE, scrStr, nameFi + ".js", 0);
        } else {
            Vars.mods.scripts.context.evaluateString(SCOPE, scrStr, "globalEval_" + globalEval.ind + ".js", 0);
            globalEval.ind++;
        };
    };
    globalEval.ind = 0;


    /**
     * Requires a JS file (as {@link Fi}), which will be run in global scope.
     * @global
     * @param {string} nameMod
     * @param {Fi|FFunction<Fi, Fi>} fi_fn - `ARGS`: modRootDir.
     * @return {void}
     * @lovecTypeSensitive
     */
    globalRequire = function(nameMod, fi_fn) {
        let fi = fi_fn instanceof Fi ? fi_fn : fi_fn(Vars.mods.locateMod(nameMod).root);
        if(fi == null || !fi.exists() || fi.extension() !== "js") throw new Error("Failed to require a script in global script for ${1}, ${2} is not a valid .js file".format(nameMod, fi));
        Vars.mods.scripts.context.evaluateString(SCOPE, fi.readString(), fi.name(), 0);
    };


    /* <------------------------------ class & package ------------------------------> */


    /**
     * @global
     * @internal
     */
    const __lovecClassLoader__ = new java.net.URLClassLoader(
        [Vars.mods.getMod("lovec").file.file().toURI().toURL()],
        Vars.mods.mainLoader(),
    );


    /**
     * Gets a Java class by path, e.g. "aquarion.AquaItems" from Aquarion.
     * Returns null if class is not found.
     * @global
     * @param {string} clsPath
     * @param {boolean|unset} [suppressWarning]
     * @return {Class}
     * @lovecTryBlock
     */
    fetchClass = function(clsPath, suppressWarning) {
        let cls;
        try {
            cls = new Packages.rhino.NativeJavaClass(
                Vars.mods.scripts.scope,
                __lovecClassLoader__.loadClass(clsPath),
            );
        } catch(err) {
            cls = null;
            if(!suppressWarning) {
                console.warn("[LOVEC] Failed to fetch class:\n" + err);
            };
        };

        return cls;
    };


    /**
     * Gets Java classes in a package.
     * Unlike {@link fetchClass}, this one cannot be called early, i.e. in global scripts.
     * @global
     * @param {string} packagePath
     * @return {Array<Class>}
     */
    fetchClasses = function(packagePath) {
        packagePath = String(packagePath);

        let clss = [];
        let nameMod = packagePath.split(".")[0];
        if(nameMod == null) return clss;
        let path = packagePath.replace(/\./g, "/");
        let dir = MDL_file.parsePath(MDL_file.getRootDir(nameMod), path);
        if(dir == null) return clss;

        let cls, innerCls;
        dir.list().forEach(fi => {
            if(fi.isDirectory()) {
                fetchClasses(packagePath + "." + fi.name()).forEach(cls1 => clss.push(cls1));
            } else if(fi.extEquals("class") && !fi.nameWithoutExtension().includes("$")) {
                cls = fetchClass(packagePath + "." + fi.nameWithoutExtension());
                clss.push(cls);
                cls.__javaObject__.getDeclaredClasses().forEach(innerClsObj => {
                    innerCls = fetchClass(packagePath + "." + fi.nameWithoutExtension() + "$" + innerClsObj.getSimpleName());
                    clss.push(innerCls);
                });
            };
        });

        return clss;
    };


    /**
     * Exposes a Java class to all scripts.
     * @global
     * @param {Class} javaCls
     * @return {void}
     */
    exposeClass = function(javaCls) {
        if(javaCls.__javaObject__ == null) throw new TypeError("Not Java class constructor: " + javaCls);
        let name = javaCls.__javaObject__.getSimpleName();
        globalize(javaCls, name);
        exposeClass.exposedClasses[name] = javaCls;
    };
    /** @type {Object<string, Class>} */
    exposeClass.exposedClasses = {};


    /**
     * Variant of {@link exposeClass} that targets all classes in a package.
     * @global
     * @param {string} packagePath
     * @return {void}
     */
    exposeClasses = function(packagePath) {
        fetchClasses(packagePath).forEach(cls => exposeClass(cls));
        console.log("[LOVEC] Exposed Java classes in ${1} to JavaScript environment.".format(packagePath.color(Pal.accent)));
    };


    /* <------------------------------ common classes ------------------------------> */


    /** @global */
    com = Packages.com;
    /** @global */
    net = Packages.net;
    /** @global */
    org = Packages.org;
    /** @global */
    arc = Packages.arc;
    /** @global */
    mdt = Packages.mindustry;
    /** @global */
    rhino = Packages.rhino;


    globalRequire("lovec", dir => dir.child("scripts").child("run").child("glbScr").child("RUN_glbScr_compatibility.js"));


    /**
     * Container of commonly used Java classes.
     * @global
     */
    JAVA = {


        /**
         * More classes will be populated here later.
         * You can push more classes in your global script.
         * @return {void}
         */
        init() {
            function convertName(javaCls) {
                let str;
                if(javaCls === Objective) {
                    str = "Objective";
                } else {
                    str = tryVal(javaCls.__javaObject__, javaCls).getSimpleName();
                };
                return str.charAt(0).toLowerCase() + str.slice(1) + "_arr";
            };
            function getArrayClass(javaCls) {
                return java.lang.reflect.Array.newInstance(javaCls, 1).getClass();
            };

            let arr = [];
            for(let key in JAVA) {
                if(key === "init" || key === "arrayTargets") continue;
                arr.push(key);
            };
            arr.forEach(key => {
                JAVA[key + "_arr"] = getArrayClass(JAVA[key]);
            });

            JAVA.arrayTargets.forEach(javaCls => {
                JAVA[convertName(javaCls)] = getArrayClass(javaCls);
            });
        },


        /**
         * `SomeClass[]` will be created for these classes as "someClass_arr".
         * For example, you can use `JAVA.point2_arr` to access `Point2[]`.
         * @type {Array<Class>}
         */
        arrayTargets: [
            Boolc, Boolf, Boolf2, Boolf3, Boolp, Cons, Cons2, Cons3, Cons4, ConsT, FloatFloatf, Floatc, Floatc2, Floatc4, Floatf, Floatp, Func, Func2, Func3, IntIntf, Intc, Intc4, Intf, Intp, Longf, Prov,
            ArrayMap, BinaryHeap, Bits, BoolSeq, ByteSeq, ComparableTimSort, DelayedRemovalSeq, EnumSet, FloatSeq, GridBits, GridMap, IntFloatMap, IntIntMap, IntMap, IntQueue, IntSeq, IntSeq, LongMap, LongQueue, LongSeq, ObjectFloatMap, ObjectIntMap, ObjectMap, ObjectSet, OrderedMap, OrderedSet, PQueue, Queue, Seq, ShortSeq, SnapshotSeq, Sort, StringMap, TimSort,
            Color, Fi, ZipFi,
            Texture, TextureFilter, TextureWrap, TextureRegion, PixmapRegion,
            Point2, Point3, Vec2, Vec3,
            Element, Group, Action,
            EditorSpriteCache,
            Mesh, FloorRenderer.ChunkMesh,
            Pathfinder.Flowfield, ControlPathfinder.Cluster,
            ItemSeq, PayloadSeq, ItemStack, LiquidStack, PayloadStack,
            Content, ContentType, MappableContent, UnlockableContent,
            Block, UnitType, Item, Liquid, StatusEffect, Planet, SectorPreset, Weather, Weapon,
            Building, Unit, StatusEntry, Sector, WeatherState, WeaponMount,
            Objective,
        ],


        int: java.lang.Integer,
        byte: java.lang.Byte,
        short: java.lang.Short,
        long: java.lang.Long,
        float: java.lang.Float,
        double: java.lang.Double,
        boolean: java.lang.Boolean,
        char: java.lang.Character,
        string: java.lang.String,
        object: java.lang.Object,
        class: java.lang.Class,
        classLoader: java.lang.ClassLoader,
        runnable: java.lang.Runnable,
        thread: java.lang.Thread,
        file: java.io.File,


    };


    /* <------------------------------ load ------------------------------> */


    /**
     * For other mods, add names here for new arrays in DB files.
     * @global
     */
    LCModDBRegister = {


        /** Target: {@link DB_item.db.map.attr}. */
        attrRsMap: [],
        /** Target: {@link DB_fluid.db.group.elementary}. */
        eleFldGrp: [],
        /** Target: {@link DB_fluid.db.group.fTag}. */
        fTag: [],
        /** Target: {@link DB_fluid.db.grpParam.matEleScl}. */
        matEleCorScl: [],
        /** Target: {@link DB_fluid.db.grpParam.matFTagScl}. */
        matFTagCorScl: [],
        /** Target: {@link DB_block.db.group.material}. */
        blkMat: [],
        /** Target: {@link DB_recipe.db.genData}. */
        rcGenData: [],
        /** Target: {@link DB_recipe.db.genData.assembly}. */
        rcGenAssemblyData: [],
        /** Target: {@link DB_reaction.db.solvationTarget}. */
        reacSolvTarget: [],

        /**
         * Creates new arrays for an object in DB objects.
         * @param {string} name - Determines the name array to be used.
         * @param {Object} obj
         * @return {this}
         */
        apply(name, obj) {
            if(!(LCModDBRegister[name] instanceof Array)) throw new Error("Error registering DB list: ${1} cannot be extended".format(name));
            LCModDBRegister[name].forEachFast(key => {
                obj[key] = [];
            }, true);
            return LCModDBRegister;
        },


    };


    // Run other global script fragments
    [
        "RUN_glbScr_lovecJava",
        "RUN_glbScr_base",
        "RUN_glbScr_data",
        "RUN_glbScr_draw",
        "RUN_glbScr_content",
        "RUN_glbScr_extend",
        "RUN_glbScr_net",
        "RUN_glbScr_util",
        "RUN_glbScr_module",
    ]
    .forEach(name => {
        globalRequire("lovec", dir => dir.child("scripts").child("run").child("glbScr").child(name + ".js"));
    });


    /**
     * Debug settings and methods.
     * @global
     */
    DEBUG = {


        shouldLogDelta: false,
        skipFacilityUpdate: false,
        skipFurnUpdate: false,
        skipHeatUpdate: false,
        skipRcUpdate: false,
        skipTorUpdate: false,

        shouldLogServerPacket: false,
        shouldLogClientPacket: false,
        lastHttpUrl: null,
        lastHttpRes: null,
        lastHttpExc: null,

        windMtp: 1.0,


        /**
         * Prints matching blocks.
         * @param {FFunction<Block, boolean>} filter
         * @return {void}
         */
        bft(filter) {
            Vars.content.blocks().each(
                filter,
                oblk => print(oblk),
            );
        },


    };


/*
  ========================================
  Section: Client Load
  ========================================
*/


    /**
     * Methods defined here are only intended for console.
     * DO NOT use these in regular codes!
     */


    Events.run(ClientLoadEvent, () => Core.app.post(() => {


        /* <------------------------------ debug ------------------------------> */


        /**
         * Used to test some draw function in game quickly.
         * @global
         */
        LCDrawTest = {


            /** @type {boolean} */
            enabled: false,
            /** @type {boolean} */
            safe: false,
            /** @type {F0Function<number>} */
            xF: Function.airZero,
            /** @type {F0Function<number>} */
            yF: Function.airZero,
            /** @type {F0Function<number>} */
            radF: Function.airZero,
            /** @type {F0Function<Color>} */
            colorF: Function.airWhite,
            /** @type {C4Function<number, number, number, Color>} */
            drawF: Function.air,


            /**
             * @return {void}
             */
            reset() {
                LCDrawTest.enabled = false;
                LCDrawTest.safe = false;
                LCDrawTest.xF = Function.airZero;
                LCDrawTest.yF = Function.airZero;
                LCDrawTest.radF = Function.airZero;
                LCDrawTest.colorF = Function.airWhite;
                LCDrawTest.drawF = Function.air;
            },


            /**
             * @param {boolean|unset} [bool]
             * @return {void}
             */
            toggle(bool) {
                if(bool == null) {
                    LCDrawTest.enabled = !LCDrawTest.enabled;
                } else {
                    LCDrawTest.enabled = Boolean(bool);
                };
            },


            /**
             * @param {F0Function<number>|unset} [xF]
             * @param {F0Function<number>|unset} [yF]
             * @param {F0Function<number>|unset} [radF]
             * @param {F0Function<Color>|unset} [colorF]
             * @return {void}
             * @lovecTypeSensitive
             */
            setGetter(xF, yF, radF, colorF) {
                LCDrawTest.safe = false;
                if(xF != null && typeof xF === "function") LCDrawTest.xF = xF;
                if(yF != null && typeof yF === "function") LCDrawTest.yF = yF;
                if(radF != null && typeof radF === "function") LCDrawTest.radF = radF;
                if(colorF != null && typeof colorF === "function") LCDrawTest.colorF = colorF;
            },


            /**
             * @param {F0Function<number>|unset} [radF]
             * @param {F0Function<Color>|unset} [colorF]
             * @return {void}
             * @lovecTypeSensitive
             */
            setPlayerGetter(radF, colorF) {
                LCDrawTest.setGetter(
                    () => Vars.player.unit() == null ? -9999.0 : Vars.player.unit().x,
                    () => Vars.player.unit() == null ? -9999.0 : Vars.player.unit().y,
                    radF,
                    colorF,
                );
            },


            /**
             * @param {C4Function<number, number, number, Color>|unset} [drawF] - `ARGS`: x, y, rad, color.
             * @return {void}
             * @lovecTypeSensitive
             */
            setDrawF(drawF) {
                if(drawF == null || typeof drawF !== "function") return;
                LCDrawTest.safe = false;
                LCDrawTest.drawF = drawF;
            },


            /**
             * @return {void}
             */
            draw() {
                if(LCDrawTest.safe) {
                    LCDrawTest.drawF(LCDrawTest.xF(), LCDrawTest.yF(), LCDrawTest.radF(), LCDrawTest.colorF());
                } else {
                    // Try only once to save memory
                    try {
                        LCDrawTest.drawF(LCDrawTest.xF(), LCDrawTest.yF(), LCDrawTest.radF(), LCDrawTest.colorF());
                    } catch(err) {
                        LCDrawTest.reset();
                        console.err("[LOVEC] Failed to implement the draw function: \n" + err);
                        return;
                    };
                    LCDrawTest.safe = true;
                };
            },


        };


        /**
         * Gets a building.
         * <br> `ARGS`: .
         * <br> `ARGS`: tx, ty.
         * @global
         * @return {Building|null}
         */
        _b = newMultiFunction(
            function() {
                let t = LCPos.getTileMouse();
                return t == null ? null : t.build;
            },
            function(tx, ty) {
                return Vars.world.build(tx, ty);
            },
        )
        .setAnno("console");


        /**
         * Gets a unit.
         * <br> `ARGS`: .
         * <br> `ARGS`: tx, ty.
         * @global
         * @return {Unit|null}
         */
        _unit = newMultiFunction(
            function() {
                return Vars.player.unit();
            },
            function(tx, ty) {
                return LCEntity.getUnit((tx + 0.5) * Vars.tilesize, (ty + 0.5) * Vars.tilesize);
            },
        )
        .setAnno("console");


        /* <------------------------------ cheat ------------------------------> */


        /**
         * @global
         * @return {boolean}
         */
        __checkCheatState__ = function() {
            return Vars.player.admin || (Groups.player.size() === 1 && !Vars.net.client());
        };


        /**
         * Kills some unit.
         * <br> `ARGS`: .
         * <br> `ARGS`: name.
         * @global
         * @return {void}
         */
        __k = newMultiFunction(
            function() {
                if(!__checkCheatState__()) return;
                if(Vars.player.unit() != null) Vars.player.unit().kill();
            },
            function(name) {
                if(!__checkCheatState__()) return;
                let unit = LCEntity.getPlayerUnitByName(name);
                if(unit == null) {
                    console.err("[LOVEC] No player found with name ${1}!".format(String(name).color(Pal.accent)));
                    return;
                };
                unit.kill();
            },
        )
        .setAnno("console");


        /**
         * Changes player team.
         * @global
         * @param {string|Team} team
         * @return {void}
         * @lovecTypeSensitive
         */
        __team = function(team) {
            if(!__checkCheatState__()) return;
            if(typeof team === "string") {
                try {
                    team = Team[team];
                } catch(err) {
                    team = null;
                };
            };
            if(!(team instanceof Team)) return;
            Vars.player.team(team);
        }
        .setAnno("console");


        /**
         * Sets item amount in some building.
         * @global
         * @param {number} tx
         * @param {number} ty
         * @param {ItemGn} item_gn
         * @param {number} amt
         * @return {void}
         */
        __item = function(tx, ty, item_gn, amt) {
            if(!__checkCheatState__()) return;
            let b = Vars.world.build(tx, ty);
            if(b == null) {
                console.err("[LOVEC] No building found at (${1}, ${2})!".format(tx, ty));
                return;
            };
            let item = MDL_content.getCt(item_gn, ContentGetModes.RS);
            if(item == null) return;
            FRAG_item.setItem(b, item, amt);
        }
        .setAnno("console");


        /**
         * Toggles cheat production.
         * @global
         * @return {void}
         */
        __inf = function() {
            if(!__checkCheatState__()) return;
            let unit = Vars.player.unit();
            if(unit == null) return;
            Vars.state.rules.teams.get(unit.team).cheat = !Vars.state.rules.teams.get(unit.team).cheat;
            Time.run(2.0, () => {
                console.log("[LOVEC] Cheat production: " + (Vars.state.rules.teams.get(unit.team).cheat ? "ON" : "OFF").color(Pal.accent));
            });
        }
        .setAnno("console");


        /**
         * Toggles player invincibility.
         * @global
         * @return {void}
         */
        __pinv = function() {
            if(!__checkCheatState__()) return;
            let unit = Vars.player.unit();
            if(unit == null) return;
            unit.hasEffect(StatusEffects.invincible) ?
                unit.unapply(StatusEffects.invincible) :
                unit.apply(StatusEffects.invincible, Number.fMax);
            Time.run(2.0, () => {
                console.log("[LOVEC] Player invincibility: " + (unit.hasEffect(StatusEffects.invincible) ? "ON" : "OFF").color(Pal.accent));
            });
        }
        .setAnno("console");


        /**
         * Toggles core invincibility.
         * @global
         * @return {void}
         */
        __cinv = function thisFun() {
            if(!__checkCheatState__()) return;
            thisFun.isOn = !thisFun.isOn;
            Time.run(2.0, () => {
                console.log("[LOVEC] Core invincibility: " + (thisFun.isOn ? "ON" : "OFF").color(Pal.accent));
            });
        }
        .setProp({
            /**
             * @memberof __cinv
             * @type {boolean}
             */
            isOn: (function() {
                Events.run(Trigger.update, () => {
                    if(__cinv.isOn) Vars.player.team().data().cores.each(ob => ob.iframes = Math.max(ob.iframes, 60.0));
                });
                return false;
            })(),
        })
        .setAnno("console");


    }));
