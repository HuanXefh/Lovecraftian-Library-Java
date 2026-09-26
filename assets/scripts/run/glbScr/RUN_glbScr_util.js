/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Utility global methods.
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ dependency ------------------------------> */


    /**
     * 1. Checks whether a version string is newer or equal to given version string.
     * <br> 2. Whether all version requirements are met.
     * <br> `ARGS`: verStrReq, verStrCur.
     * <br> `ARGS`: nameMod, minVerArr
     * <br> <ROW-minVerArr>: nameMod, verStrReq
     * @global
     * @return {boolean}
     * @example
     * // Check version requirement
     * checkVersion("154", "146");                // Returns false
     *
     * // Check dependency
     * checkVersion("test-mod", [
     *     "lovec", "101",
     * ]);
     */
    checkVersion = newMultiFunction(
        ["string", "string"], function(verStrReq, verStrCur) {
            let
                ints1 = checkVersion.verStrToInts(verStrReq),
                ints2 = checkVersion.verStrToInts(verStrCur),
                int1,
                int2,
                i = 0,
                iCap = Math.max(ints1.length, ints2.length);

            while(i < iCap) {
                int1 = tryVal(ints1[i], 0);
                int2 = tryVal(ints2[i], 0);
                if(int1 < int2) {
                    return true;
                } else if(int1 > int2) {
                    return false;
                };
                i++;
            };

            return true;
        },
        ["string", Array], function(nameMod, minVerArr) {
            let str = "[gray]Unmet dependency for [accent]" + nameMod + "[]!\n";
            let errored = false;

            let i = 0, iCap = minVerArr.length;
            let nameDepend, minVer, ver, mod;
            str += "\n----------------------------------------------------";
            while(i < iCap) {
                nameDepend = minVerArr[i];
                minVer = minVerArr[i + 1];
                ver = TmpStateTag.pending;
                mod = Vars.mods.locateMod(nameDepend);
                if(mod != null) {
                    ver = String(mod.meta.version);
                };
                if(ver !== TmpStateTag.pending && !checkVersion(minVer, ver)) {
                    printAll(minVer, ver);
                    errored = true;
                    str += "\n" + nameDepend + "        " + minVer + "        (outdated)";
                };
                i += 2;
            };
            str += "\n----------------------------------------------------";
            str += "\n[]";

            if(errored) {
                Events.run(ClientLoadEvent, () => Vars.ui.showErrorMessage(str));
            };

            return !errored;
        },
        // In case that someone forgot version is a string
        ["number", "number"], function(num1, num2) {return checkVersion(String(num1), String(num2))},
        ["number", "string"], function(num, str) {return checkVersion(String(num), str)},
        ["string", "number"], function(str, num) {return checkVersion(str, String(num))},
    );
    /**
     * Converts a version string to an array of numbers.
     * No letter allowed.
     * @param {string} verStr
     * @return {Array<number>}
     * @example
     * verStrToInts("1.12.1");                // Returns [1, 12, 1]
     */
    checkVersion.verStrToInts = function(verStr) {
        let i, iCap;
        /** @type {Array<number|string>} */
        let arr = verStr.split(".");

        i = 0;
        iCap = arr.length;
        while(i < iCap) {
            arr[i] = parseInt(arr[i], 10);
            if(isNaN(arr[i])) {
                arr[i] = 0;
            };
            i++;
        };

        return arr;
    };


    /**
     * Runs `scr` only when all required mods are found.
     * Used to load something optionally.
     * @global
     * @param {string} nameModCur
     * @param {Plural<string>} nameMods_p
     * @param {C0Function} scr
     * @param {boolean|unset} [suppressWarning] - If true, error message about missing mods won't be shown.
     * @return {void}
     */
    runWithDependency = function(nameModCur, nameMods_p, scr, suppressWarning) {
        let
            arr1 = (nameMods_p instanceof Array ? nameMods_p : [nameMods_p]),
            arr2 = arr1.map(nameMod => Vars.mods.locateMod(nameMod));

        if(!arr2.includes(null)) {
            scr();
        } else if(!suppressWarning) {
            let str = "[gray]Missing dependencies for [accent]" + nameModCur + "[]:\n";
            str += "\n----------------------------------------------------";
            for(let i = 0; i < arr1.length; i++) {
                if(arr2[i] != null) continue;
                str += "\n" + arr1[i];
            };
            str += "\n----------------------------------------------------";
            str += "\n\nThe mod may not have full contents.\n[]";
            Events.run(ClientLoadEvent, () => Vars.ui.showErrorMessage(str));
        };
    };


    /* <------------------------------ error ------------------------------> */


    /**
     * Registers new error types under {@link LCError}.
     * @param {string} name
     * @param {boolean|unset} [exposeToGlobal] - If true, the error type will be also exposed to the global scope. Use with care.
     * @return {Class<Error>}
     */
    registerNewError = function(name, exposeToGlobal) {
        let scrStr = "";
        scrStr += "function " + name + "(message) {";
        scrStr += "    let err = new Error(message);";
        scrStr += "    this.message = err.message;";
        scrStr += "    this.name = " + "'" + name + "'" + ";";
        scrStr += "    Error.captureStackTrace(this, " + name + ");";
        scrStr += "};";
        scrStr += "Object.assign(" + name + ", Error);";
        scrStr += name + ".prototype = Object.create(Error.prototype);";
        scrStr += name + ".constructor = " + name + ";";
        scrStr += name + ";";
        globalize(eval(scrStr), name, "LCError");
        if(exposeToGlobal) {
            globalize(LCError[name], name);
        };
        return LCError[name];
    };


    /* <------------------------------ format array ------------------------------> */


    /**
     * Checks if the given name has already been registered in `names`.
     * @global
     * @param {string} name
     * @param {Array<string>} names
     * @param {string|unset} [tag]
     * @return {string}
     */
    registerUniqueName = function(name, names, tag) {
        if(name == null || names.includes(name)) throw new Error("Name ${1} (for ${2}) has already been used!".format(name, tryVal(tag, "Unknown")));
        names.push(name);
        return name;
    };


    /**
     * Used to read 2-arrays that map classes (or template names) to values.
     * @global
     * @template T
     * @param {F2Array<ContentTypeGn, T>} arr - `ROW`: type, fun.
     * @param {Object} ins
     * @param {T|unset} [def]
     * @return {T}
     */
    readTypeValArr = function(arr, ins, def) {
        let fun = tryVal(def, Function.air);
        let i = 0, iCap = arr.iCap();
        while(i < iCap) {
            if(checkInstance(ins, arr[i])) {
                fun = arr[i + 1];
            };
            i += 2;
        };
        return fun;
    };


    /* <------------------------------ object ------------------------------> */


    /**
     * Merges a series of objects.
     * Properties defined later will overwrite the ones defined before.
     * <br> `ARGS`: obj1, obj2, obj3, ...
     * @global
     * @return {Object}
     * @lovecTypeSensitive
     */
    mergeObj = function() {
        let obj0 = {};
        for(let obj of arguments) {
            if(typeof obj !== "object") continue;
            for(let key in obj) {
                obj0[key] = obj[key];
            };
        };
        return obj0;
    };


    /**
     * Variant of {@link mergeObj} that mixes methods.
     * `addSuper` is used to call `super$xxx` if `override` is true.
     * <br> `ARGS`: obj1, obj2, obj3, ...
     * @global
     * @return {Object}
     * @lovecTypeSensitive
     */
    mergeObjWithMixin = function() {
        let obj0 = {};
        let superFun, fun;
        for(let obj of arguments) {
            if(typeof obj !== "object") continue;
            for(let key in obj) {
                if(typeof obj[key] !== "function" || typeof obj0[key] !== "function") {
                    obj0[key] = obj[key];
                } else {
                    superFun = obj0[key];
                    fun = obj[key];
                    fun.argLen = Math.max(tryVal(superFun.argLen, -1), tryVal(fun.argLen, -1));
                    obj0[key] = !fun.override ?
                        mixTempMethods(superFun, fun, MethodMixModes.NORMAL).wrapLen(fun.argLen) :
                        !fun.addSuper ?
                            fun.wrapLen(fun.argLen) :
                            mixTempMethods(null, fun, MethodMixModes.BUILD, key);
                    initTempMethod(obj0[key]).setProp({
                        override: false,
                        funPrev: superFun,
                        funCur: fun,
                    });
                };
            };
        };
        return obj0;
    };


    /**
     * Merges all found DB files with the same name in "scripts/db" folder.
     * Cross-mod.
     * @global
     * @param {Object} dbObj
     * @param {string} nameFi
     * @param {string|unset} [nameModCur]
     * @return {void}
     */
    mergeDB = function(dbObj, nameFi, nameModCur) {
        if(nameModCur == null) nameModCur = "lovec";

        let i = 0;
        Vars.mods.eachEnabled(mod => {
            if(mod.name === nameModCur) return;

            let path = mod.name + "/db/" + nameFi;
            let dbMdl;
            try {
                dbMdl = require(path);
            } catch(err) {
                dbMdl = null;
                if(!err.message.startsWith("Module ")) {
                    console.err("[LOVEC] Error loading DB file from ${1}:\n".format(mod.name.color(Pal.accent)) + err);
                };
            };

            if(dbMdl != null) {
                mergeDB.mergeDBObj(dbObj, dbMdl.db);
                i++;
            };
        });

        console.log("[LOVEC] Merged ${1} DB file(s) for ${2} in ${3} from other mods.".format(i, nameFi, nameModCur.color(Pal.accent)));
    };
    /**
     * @param {Object} obj0
     * @param {Object} obj
     * @return {Object}
     */
    mergeDB.mergeDBObj = function(obj0, obj) {
        Object.eachPair(obj0, (key1, val1) => {
            // Depth: 0
            val1 instanceof Array ?
                mergeDB.applyMerge(key1, obj, val1) :
                Object.eachPair(obj0[key1], (key2, val2) => {
                    // Depth: 1
                    val2 instanceof Array ?
                        mergeDB.applyMerge(key2, Object.searchByKeys(obj, [key1], Object.air), val2) :
                        Object.eachPair(obj0[key1][key2], (key3, val3) => {
                            // Depth: 2
                            val3 instanceof Array ?
                                mergeDB.applyMerge(key3, Object.searchByKeys(obj, [key1, key2], Object.air), val3) :
                                Object.eachPair(obj0[key1][key2][key3], (key4, val4) => {
                                    // Depth: 3
                                    val4 instanceof Array ?
                                        mergeDB.applyMerge(key4, Object.searchByKeys(obj, [key1, key2, key3], Object.air), val4) :
                                        Object.eachPair(obj0[key1][key2][key3][key4], (key5, val5) => {
                                            // Depth: 4
                                            val5 instanceof Array ?
                                                mergeDB.applyMerge(key5, Object.searchByKeys(obj, [key1, key2, key3, key4], Object.air), val5) :
                                                console.err("[LOVEC] Cannot fully merge an object due to " + "too many layers".color(Pal.remove) + ".");
                                        });
                                });
                        });
                });
        });
        return obj0;
    };
    /**
     * @param {string} key
     * @param {Object} objTarget
     * @param {Array} arrTarget
     * @return {void}
     */
    mergeDB.applyMerge = function(key, objTarget, arrTarget) {
        let tmp = objTarget[key];
        if(tmp == null || !(tmp instanceof Array)) return;
        arrTarget.pushAll(tmp);
    };


    /* <------------------------------ content template ------------------------------> */


    /**
     * Whether a content is created with {@link CLS_contentTemplate}.
     * @global
     * @param {UnlockableContent} ct
     * @return {boolean}
     */
    checkCreatedByTemp = function(ct) {
        return ct.ex_isSubInsOf != null;
    };


    /**
     * Whether a content is an instance of some content template.
     * @global
     * @param {UnlockableContent} ct
     * @param {string} tempName
     * @return {boolean}
     */
    checkSubInsOfTemp = function(ct, tempName) {
        return ct.ex_isSubInsOf != null && ct.ex_isSubInsOf(tempName);
    };


    /**
     * Whether 'ins' is an instance of a class or content template.
     * Returns false if `type` is null.
     * Returns true if `type` is exactly `ins`.
     * @global
     * @param {Object} ins
     * @param {ContentTypeGn} type
     * @return {boolean}
     * @lovecTypeSensitive
     */
    checkInstance = function(ins, type) {
        if(type == null) {
            return false;
        } else if(ins === type) {
            return true;
        } else if(typeof type === "function") {
            return ins instanceof type;
        } else if(typeof type === "string") {
            return checkSubInsOfTemp(ins, type) || (ins instanceof UnlockableContent && ins.name === type);
        } else if(type instanceof Array) {
            return type.some(type1 => checkInstance(ins, type1));
        };
        return false;
    };


    /**
     * Whether `ct_gn` is created by content template, and has matching tag.
     * @global
     * @param {ContentGn} ct_gn
     * @param {string} tag
     * @return {boolean}
     */
    checkTempTag = function(ct_gn, tag) {
        let ct = MDL_content.getCt(ct_gn, null, true);
        return ct == null || !checkCreatedByTemp(ct) ?
            false :
            ct.delegee.tempTags.includes(tag);
    };


    /**
     * Gets all parent templates and implemented interfaces of some template as string.
     * @global
     * @param {Array|unset} contArr
     * @param {string} nameTemp
     * @return {Array<string>}
     */
    fetchTempParents = function(contArr, nameTemp) {
        let arr = contArr != null ? contArr.clear() : [];
        return CLS_contentTemplate.get(nameTemp) == null ?
            arr :
            arr.pushAll(CLS_contentTemplate.getTempParents(nameTemp));
    };


    /**
     * Sets up default values in a content template method.
     * @global
     * @param {Function} fun
     * @param {boolean|unset} [isFromIntf]
     * @return {Function}
     */
    initTempMethod = function(fun, isFromIntf) {
        return fun.setProp({
            noSuper: tryVal(fun.noSuper, false),
            override: tryVal(fun.override, false),
            final: tryVal(fun.final, false),
            boolMode: tryVal(fun.boolMode, null),
            superBoolMode: tryVal(fun.superBoolMode, fun.boolMode),
            mergeMode: tryVal(fun.mergeMode, null),
            argLen: tryVal(fun.argLen, -1),
            funPrev: !isFromIntf ? null : tryVal(fun.funPrev, null),
            funCur: !isFromIntf ? null : tryVal(fun.funCur, null),
        });
    };


    /**
     * Mixes methods, used mostly in content templates.
     * @global
     * @param {Function|null} superFun
     * @param {Function} fun
     * @param {ENumber|unset} [mode] - See {@link MethodMixModes}.
     * @param {string|unset} [nameFun] - Required if used in mode BUILD.
     * @return {Function}
     */
    mixTempMethods = function(superFun, fun, mode, nameFun) {
        if(mode == null) mode = MethodMixModes.NORMAL;
        if(mode === MethodMixModes.BUILD) {
            if(fun.noSuper) return fun.wrapLen(fun.argLen);
            superFun = null;
        } else {
            if(superFun == null) return fun;
            if(superFun.final) return superFun;
        };

        let fun_fi;
        switch(mode) {

            case MethodMixModes.NORMAL :
                if(fun.boolMode != null) {
                    if(fun.boolMode === "and") {
                        fun_fi = function() {
                            return superFun.apply(this, arguments) && fun.apply(this, arguments);
                        };
                    } else if(fun.boolMode === "or") {
                        fun_fi = function() {
                            return superFun.apply(this, arguments) || fun.apply(this, arguments);
                        };
                    };
                } else if(fun.mergeMode != null) {
                    if(fun.mergeMode === "object") {
                        fun_fi = function() {
                            return mergeObj(superFun.apply(this, arguments), fun.apply(this, arguments));
                        };
                    } else if(fun.mergeMode === "array") {
                        fun_fi = function() {
                            return superFun.apply(this, arguments).pushAll(fun.apply(this, arguments));
                        };
                    } else if(fun.mergeMode === "add") {
                        fun_fi = function() {
                            return superFun.apply(this, arguments) + fun.apply(this, arguments);
                        };
                    } else if(fun.mergeMode === "sub") {
                        fun_fi = function() {
                            return superFun.apply(this, arguments) - fun.apply(this, arguments);
                        };
                    } else if(fun.mergeMode === "mul") {
                        fun_fi = function() {
                            return superFun.apply(this, arguments) * fun.apply(this, arguments);
                        };
                    } else if(fun.mergeMode === "div") {
                        fun_fi = function() {
                            return superFun.apply(this, arguments) / fun.apply(this, arguments);
                        };
                    } else if(typeof fun.mergeMode === "function") {
                        fun_fi = function() {
                            mixTempMethods.tmpArgs.with(superFun.apply(this, arguments), fun.apply(this, arguments));
                            return fun.mergeMode.apply(this, mixTempMethods.tmpArgs);
                        };
                    };
                } else {
                    fun_fi = function() {
                        superFun.apply(this, arguments);
                        return fun.apply(this, arguments);
                    };
                };
                break;

            case MethodMixModes.BUILD :
                let nameSuperFun = "super$" + CLS_contentTemplate.resolveMethodName(nameFun);
                if(fun.superBoolMode != null) {
                    if(fun.superBoolMode === "and") {
                        fun_fi = function() {
                            return this[nameSuperFun].apply(this, arguments) && fun.apply(this, arguments);
                        };
                    } else if(fun.superBoolMode === "or") {
                        fun_fi = function() {
                            return this[nameSuperFun].apply(this, arguments) || fun.apply(this, arguments);
                        };
                    };
                } else if(fun.mergeMode != null) {
                    if(fun.mergeMode === "object") {
                        fun_fi = function() {
                            return mergeObj(this[nameSuperFun].apply(this, arguments), fun.apply(this, arguments));
                        };
                    } else if(fun.mergeMode === "array") {
                        fun_fi = function() {
                            return this[nameSuperFun].apply(this, arguments).pushAll(fun.apply(this, arguments));
                        };
                    } else if(fun.mergeMode === "add") {
                        fun_fi = function() {
                            return this[nameSuperFun].apply(this, arguments) + fun.apply(this, arguments);
                        };
                    } else if(fun.mergeMode === "sub") {
                        fun_fi = function() {
                            return this[nameSuperFun].apply(this, arguments) - fun.apply(this, arguments);
                        };
                    } else if(fun.mergeMode === "mul") {
                        fun_fi = function() {
                            return this[nameSuperFun].apply(this, arguments) * fun.apply(this, arguments);
                        };
                    } else if(fun.mergeMode === "div") {
                        fun_fi = function() {
                            return this[nameSuperFun].apply(this, arguments) / fun.apply(this, arguments);
                        };
                    } else if(typeof fun.mergeMode === "function") {
                        fun_fi = function() {
                            mixTempMethods.tmpArgs.with(this[nameSuperFun].apply(this, arguments), fun.apply(this, arguments));
                            return fun.mergeMode.apply(this, mixTempMethods.tmpArgs);
                        };
                    };
                } else {
                    fun_fi = function() {
                        this[nameSuperFun].apply(this, arguments);
                        return fun.apply(this, arguments);
                    };
                };
                break;

        };

        if(typeof fun_fi !== "function") {
            printAll(superFun, fun, mode, fun_fi);
            throw new Error("Error mixing methods!");
        };
        if(mode === MethodMixModes.BUILD) {
            fun_fi = fun_fi.wrapLen(fun.argLen);
        };
        fun_fi.setProp({
            noSuper: fun.noSuper,
            override: false,
            final: fun.final,
            boolMode: fun.boolMode,
            superBoolMode: fun.superBoolMode,
            mergeMode: fun.mergeMode,
            argLen: superFun == null ? fun.argLen : Math.max(superFun.argLen, fun.argLen),
            funPrev: superFun == null ? "!JAVASUPER" : superFun,
            funCur: fun,
        });

        return fun_fi;
    };
    /** @type {Arguments} */
    mixTempMethods.tmpArgs = [];


    /**
     * Handles content JSON parsing.
     * @global
     */
    LCContentParser = {


        /**
         * Gets JSON value of a content from its JSON/HJSON file in `scripts/auxFi/json/xxx`.
         * Used to replace vanilla JSON parsing, which no longer supports modification of existing contents in v9.
         * <br> Don't use `jval.getBool` or `jval.getBoolean` directly.
         * @param {UnlockableContent} ct
         * @param {string|unset} [folderNameOverwrite]
         * @return {Jval|null}
         */
        getJval(ct, folderNameOverwrite) {
            if(ct.minfo.mod == null) return null;
            VAR.ctParser.checkInit();
            let dir = MDL_file.getScriptDir(ct.minfo.mod.name).child("auxFi").child("json").child(tryVal(folderNameOverwrite, ct.getContentType().folderName));
            let fi = (function() {
                let seq = dir.findAll(ofi => ofi.name() === (MDL_content.getCtNameNoPrefix(ct) + ".json") || ofi.name() === (MDL_content.getCtNameNoPrefix(ct) + ".hjson"));
                return seq.size === 0 ?
                    null :
                    seq.get(0);
            })();
            if(fi == null) return null;
            let jval = jsonToJval(fi);
            // Convert `Jval` to `JsonValue` in v8
            if(LCCompatibilityHandler.isV8) {
                jval = eval("VAR.jsonParser.fromJson(null, jval.toString(Jval.Jformat.plain))");
            };
            if(jval.isString()) {
                jval = null;
            };
            if(jval != null) {
                Reflect.set(ContentParser, VAR.ctParser, "currentFile", fi);
                Reflect.set(ContentParser, VAR.ctParser, "currentMod", ct.minfo.mod);
            };
            return jval;
        },


        /**
         * @param {Jval} jval
         * @param {string} name
         * @param {boolean|unset} [def]
         */
        getBool(jval, name, def) {
            return LCCompatibilityHandler.isV8 ?
                jval.getBoolean(name, Boolean(def)) :
                jval.getBool(name, Boolean(def));
        },


        /**
         * @internal
         * @param {ContentType} ctType
         * @param {string} name
         * @param {UnlockableContent}
         */
        locate(ctType, name) {
            return Reflect.invoke(ContentParser, VAR.ctParser, "locate", [ctType, name], ContentType, JAVA.string);
        },


        /**
         * @internal
         * @param {java.lang.Runnable} run
         * @return {void}
         */
        read(run) {
            Reflect.invoke(ContentParser, VAR.ctParser, "read", [run], JAVA.runnable);
        },


        /**
         * @internal
         * @param {Object} obj
         * @param {Jval} jval
         * @return {void}
         */
        readFields(obj, jval) {
            Reflect.invoke(ContentParser, VAR.ctParser, "readFields", [obj, jval], JAVA.object, LCCompatibilityHandler.isV8 ? eval("JsonValue") : Jval);
        },


        /**
         * @internal
         * @param {UnlockableContent} ct
         * @param {Jval} jval
         * @return {void}
         */
        readBundle(ct, jval) {
            let entryName = ct.getContentType() + "." + ct.minfo.mod.name + "-" + ct.name + ".";
            let bundle = Core.bundle;
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
        },


        /**
         * @param {UnlockableContent} ct
         * @param {Jval} jval
         * @return {void}
         */
        parseResearch(ct, jval) {
            let research = jval.remove("research");
            if(research == null) return;
            let name, reqs;
            if(research.isString()) {
                name = research.asString();
                reqs = null;
            } else {
                name = research.getString("parent", null);
                reqs = research.has("requirements") ?
                    VAR.ctJsonParser.readValue(JAVA.itemStack_arr, research.get("requirements")) :
                    null;
            };
            let lastNode = TechTree.all.find(onode => onode.content === ct);
            if(lastNode != null) {
                lastNode.remove();
            };
            let node = new TechTree.TechNode(null, ct, tryVal(reqs, ItemStack.empty));
            let lastFiCur = Reflect.get(ContentParser, VAR.ctParser, "currentFile");
            Reflect.get(ContentParser, VAR.ctParser, "postreads").add(run(() => {
                Reflect.set(ContentParser, VAR.ctParser, "currentContent", ct);
                Reflect.set(ContentParser, VAR.ctParser, "currentMod", ct.minfo.mod);
                Reflect.set(ContentParser, VAR.ctParser, "currentFile", lastFiCur);
                let isObject = research.isObject();
                // Objectives
                if(isObject && research.has("objectives")) {
                    node.objectives.addAll(VAR.ctJsonParser.readValue(JAVA.objective_arr, research.get("objectives")));
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
                    node.planet = Reflect.invoke(ContentParser, VAR.ctParser, "find", [ContentType.planet, research.getString("planet")], ContentType, JAVA.string);
                };
                // Node root
                if(isObject && LCContentParser.getBool(research, "root", false)) {
                    node.name = research.getString("name", ct.name);
                    node.requiresUnlock = LCContentParser.getBool(research, "requiresUnlock", false);
                    TechTree.roots.add(node);
                } else {
                    if(name != null) {
                        let parent = TechTree.all.find(onode => onode.content.name === name || onode.content.name === ct.minfo.mod.name + "-" + name || onode.content.name === SaveVersion.mapFallback(name));
                        if(parent == null) {
                            console.warn("[LOVEC] Node ${1} is required by ${2}, but not added to any tech tree!".format(name.color(Pal.remove), ct.name.color(Pal.accent)));
                        } else {
                            if(!parent.children.contains(node)) {
                                parent.children.add(node);
                            };
                            node.parent = parent;
                            node.planet = parent.planet;
                        };
                    } else {
                        console.warn("[LOVEC] No parent found for a non-root tech node: " + ct.name.color(Pal.accent));
                    };
                };
            }));
        },


        /**
         * @param {Block} blk
         * @param {Jval} jval
         * @return {void}
         */
        parseBlock(blk, jval) {
            LCContentParser.read(run(() => {
                if(jval.has("consumes") && jval.get("consumes").isObject()) {
                    Reflect.invoke(ContentParser, VAR.ctParser, "readBlockConsumers", [blk, jval.get("consumes")], Block, LCCompatibilityHandler.isV8 ? eval("JsonValue") : Jval);
                    jval.remove("consumes");
                };
                if(jval.has("requirements") && blk.buildVisibility === BuildVisibility.hidden) {
                    blk.buildVisibility = BuildVisibility.shown;
                };
            }));
        },


        /**
         * @param {UnitType} utp
         * @param {Jval} jval
         * @return {void}
         */
        parseController(utp, jval) {
            if(jval.has("controller") || jval.has("aiController")) {
                utp.aiController = Reflect.invoke(ContentParser, VAR.ctParser, "resolveController", [jval.getString("controller", jval.getString("aiController", ""))], JAVA.string);
                jval.remove("controller");
                jval.remove("aiController");
            };
            if(jval.has("defaultController")) {
                let ctrlProv = Reflect.invoke(ContentParser, VAR.ctParser, "resolveController", [jval.getString("defaultController")], JAVA.string);
                utp.controller = func(unit => ctrlProv.get());
                jval.remove("defaultController");
            };
        },


        /**
         * @param {Planet} pla
         * @param {Jval} jval
         * @return {void}
         */
        parsePlanet(pla, jval) {
            LCContentParser.read(run(() => {
                // Mesh
                if(jval.has("mesh") && !pla.delegee.skipMeshParse) {
                    let mesh = jval.get("mesh");
                    if(!mesh.isObject() && !mesh.isArray()) throw new Error("Failed to parse base mesh: " + pla);
                    jval.remove("mesh");
                    pla.meshLoader = prov(() => {
                        let mesh_fi;
                        try {
                            mesh_fi = Reflect.invoke(ContentParser, VAR.ctParser, "parseMesh", [pla, mesh], Planet, LCCompatibilityHandler.isV8 ? eval("JsonValue") : Jval);
                        } catch(err) {
                            console.err(err);
                            mesh_fi = new ShaderSphereMesh(pla, Shaders.unlit, 2);
                        };
                        return mesh_fi;
                    });
                } else {
                    jval.remove("mesh");
                    pla.meshLoader = prov(() => pla.ex_getMesh());
                };

                // Cloud mesh
                if(jval.has("cloudMesh") && !pla.skipCloudMeshParse) {
                    let mesh = jval.get("cloudMesh");
                    if(!mesh.isObject() && !mesh.isArray()) throw new Error("Failed to parse cloud mesh: " + pla);
                    jval.remove("cloudMesh");
                    pla.cloudMeshLoader = prov(() => {
                        let mesh_fi;
                        try {
                            mesh_fi = Reflect.invoke(ContentParser, VAR.ctParser, "parseMesh", [pla, mesh], Planet, LCCompatibilityHandler.isV8 ? eval("JsonValue") : Jval);
                        } catch(err) {
                            console.err(err);
                            mesh_fi = null;
                        };
                        return mesh_fi;
                    });
                } else {
                    jval.remove("cloudMesh");
                    pla.cloudMeshLoader = prov(() => pla.ex_getCloudMesh());
                };

                // Generator
                if(jval.has("generator") && !pla.skipGeneratorParse) {
                    // TODO: Generator things, maybe for years.
                } else {
                    jval.remove("generator");
                };
            }));
        },


        /**
         * @param {SectorPreset} sec
         * @param {Jval} jval
         * @return {void}
         */
        parseSector(sec, jval) {
            if(!jval.has("sector") || !jval.get("sector").isNumber()) throw new Error("`sector` in a sector preset must be a number!");
            LCContentParser.read(run(() => {
                let pla = tryVal(sec.planet, Planets.serpulo);
                if(jval.has("planet")) {
                    pla = LCContentParser.locate(ContentType.planet, jval.getString("planet", "serpulo"));
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
                    rules = jval.remove("rules");
                    if(!rules.isObject()) throw new Error("`rules` in a sector preset must be an object!");
                    sec.rules = rules0 => {
                        try {
                            JsonIO.json.readFiles(rules0, rules);
                        } catch(err) {
                            console.err("[LOVEC] Failed to load rules from sector preset:\n" + err);
                        };
                    };
                };
            }));
        },


        /**
         * @param {UnlockableContent} ct
         * @param {Jval} jval
         * @param {string} name
         * @return {void}
         */
        setField(ct, jval, name) {
            ct[name] = LCContentParser.locate(ct.getContentType(), jval.getString(name, ""));
            jval.remove(name);
        },


        /**
         * @param {UnlockableContent} ct
         * @param {Jval} jval
         * @return {void}
         */
        setupFields(ct, jval) {
            Reflect.set(ContentParser, VAR.ctParser, "currentContent", ct);
            Reflect.set(ContentParser, VAR.ctParser, "currentMod", ct.minfo.mod);
            LCContentParser.read(run(() => {
                LCContentParser.readBundle(ct, jval);
                LCContentParser.readFields(ct, jval);
            }));
        },


    };


    /* <------------------------------ game ------------------------------> */


    /**
     * `Mathf.chance(float trueChance)` but using fixed rand.
     * @global
     * @param {string} name
     * @param {number} trueChance
     * @return {boolean}
     */
    syncChance = function(name, trueChance) {
        return LCRand.chance(UTIL_rand.get(name), trueChance);
    };


    /**
     * Variant of {@link syncChance} involving delta.
     * @global
     * @param {string} name
     * @param {number} trueChance
     * @return {boolean}
     */
    syncChanceDelta = function(name, trueChance) {
        return LCRand.chanceDelta(UTIL_rand.get(name), trueChance);
    };


    /**
     * Used for blocks with dynamic building info layout for their buildings, e.g. multi-crafters.
     * @global
     * @return {void}
     */
    forceUpdateBlockFrag = function() {
        Reflect.set(PlacementFragment, Vars.ui.hudfrag.blockfrag, "lastDisplayState", null);
    };


    /* <------------------------------ debug ------------------------------> */


    /**
     * Collection of log types.
     * @global
     */
    LCLogHandler = {


        /** @type {ObjectMap<string, F0Function<string>>} */
        __infoMap__: new ObjectMap(),
        /** @type {ObjectMap<string, F0Function<string>>} */
        __warnMap__: new ObjectMap(),
        /** @type {ObjectMap<string, F0Function<string>>} */
        __errMap__: new ObjectMap(),
        /** @type {ObjectMap<string, F0Function<string>>} */
        __debugMap__: new ObjectMap(),


        /**
         * Registers a new log type.
         * @param {ENumber} mode - See {@link LogModes}.
         * @param {string} name
         * @param {F0Function<string>} strF
         * @return {void}
         */
        add(mode, name, strF) {
            switch(mode) {
                case 0 :
                    this.__infoMap__.put(name, strF);
                    break;
                case 1 :
                    this.__warnMap__.put(name, strF);
                    break;
                case 2 :
                    this.__errMap__.put(name, strF);
                    break;
                case 3 :
                    this.__debugMap__.put(name, strF);
                    break;
                default :
                    throw new Error("Unknown log type: " + mode);
            };
        },


        /**
         * Finds log type and string getter for given name.
         * @param {string} name
         * @return {[ENumber, F0Function<string>]|null}
         */
        find(name) {
            let strF;
            strF = this.__infoMap__.get(name);
            if(strF != null) return [LogModes.I, strF];
            strF = this.__warnMap__.get(name);
            if(strF != null) return [LogModes.W, strF];
            strF = this.__errMap__.get(name);
            if(strF != null) return [LogModes.E, strF];
            strF = this.__debugMap__.get(name);
            if(strF != null) return [LogModes.D, strF];
            return null;
        },


        /**
         * Prints something in the console.
         * <br> `ARGS`: name, arg1, arg2, arg3, ...
         * @param {string} name
         * @return {void}
         */
        log(name) {
            let tup = this.find(name);
            if(tup == null) console.err("[LOVEC] Unregistered log name: " + name);
            let text = tup[1].apply(null, Array.from(arguments).splice(1));
            if(text == null) return;
            console.log(text, tup[0]);
        },


    };
