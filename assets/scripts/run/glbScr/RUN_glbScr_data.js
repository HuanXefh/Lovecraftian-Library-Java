/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Handles data processing.
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ JSON ------------------------------ */


    /**
     * Variant of {@link JSON.stringify} that can be safely called on object containing Java strings.
     * @global
     * @param {JSONObject} obj
     * @return {JSONString}
     * @lovecTypeSensitive
     */
    toJsonSafe = function(obj) {
        Object.clear(toJsonSafe.tmpObj);
        Object.assign(toJsonSafe.tmpObj, obj);
        let val;
        for(let key in toJsonSafe.tmpObj) {
            val = toJsonSafe.tmpObj[key];
            if(typeof val === "object") {
                if(val instanceof String) {toJsonSafe.tmpObj[key] = String(val)};
                // I don't know why but this is required somehow
                if(val instanceof Jval) {
                    if(val.isNumber()) {toJsonSafe.tmpObj[key] = Number(val.asDouble())};
                    if(val.isBoolean()) {toJsonSafe.tmpObj[key] = Boolean(val.asBoolean())};
                    if(val.isString()) {toJsonSafe.tmpObj[key] = String(val.asString())};
                    if(val.isNull()) {toJsonSafe.tmpObj[key] = null};
                };
            };
        };

        return JSON.stringify(toJsonSafe.tmpObj);
    };
    /** @type {JSONObject} */
    toJsonSafe.tmpObj = {};


    /**
     * Converts JSON into {@link Jval}.
     * @global
     * @param {Fi|JSONString} fi0str
     * @return {Jval}
     */
    jsonToJval = function(fi0str) {
        let str;
        if(typeof fi0str === "string") {
            str = fi0str;
        } else {
            str = fi0str.readString("UTF-8");
            if(fi0str.extension() === "json") {
                str = str.replace(/#/g, "\\#");
            };
        };
        return Jval.read(str);
    };


    /**
     * Converts JSON into JavaScript object.
     * @global
     * @param {Fi|JSONString} fi0str
     * @return {Object}
     */
    jsonToJsObj = function(fi0str) {
        return JSON.parse(jsonToJval(fi0str).toString(Jval.Jformat.formatted));
    };


    /* <------------------------------ read & write ------------------------------ */


    /**
     * For quick definition of `ex_processData`.
     * @global
     * @param {Writes|Reads} wr0rd
     * @param {C2Function<Writes, number>} wrFun - `ARGS`: wr, revi.
     * @param {F2Function<Reads, number, Object|unset>} rdFun - `ARGS`: rd, revi.
     * @return {Object|unset}
     */
    processData = function(wr0rd, wrFun, rdFun) {
        return wr0rd instanceof Writes ?
            wrFun(wr0rd) :
            rdFun(wr0rd);
    };


    /* <------------------------------ config ------------------------------ */


    /**
     * Converts config object into JSON string.
     * @global
     * @param {JSONConfigObject} obj
     * @return {JSONConfigString}
     */
    packConfig = function(obj) {
        return "CONFIG: " + toJsonSafe(obj);
    };


    /**
     * Converts config JSON string into object.
     * @global
     * @param {JSONConfigString} cfgStr
     * @return {JSONConfigObject}
     */
    unpackConfig = function(cfgStr) {
        return JSON.parse(cfgStr.replace("CONFIG: ", ""));
    };


    /* <------------------------------ DB file ------------------------------ */


    /**
     * Reads `<nameMod>/scripts/auxFi/data/<nameFi>.json` of every enabled mod and writes values into `contObj`.
     * Also supports .hjson files.
     * @global
     * @param {Object} contObj
     * @param {string} nameFi
     * @return {Object}
     */
    readAuxJsonData = function(contObj, nameFi) {
        let dir, fi, obj;
        Vars.mods.eachEnabled(mod => {
            dir = mod.root.child("scripts").child("auxFi").child("json").child("data");
            fi = dir.child(nameFi + ".json");
            if(!fi.exists()) {
                fi = dir.child(nameFi + ".hjson");
            };
            if(!fi.exists()) return;

            obj = jsonToJsObj(fi);
            for(let key in obj) {
                contObj[key] = obj[key];
            };
        });

        return contObj;
    };


    /**
     * Handles DB JSON file objects.
     * @global
     */
    LCDBFileHandler = {


        /** @type {ObjectMap<string, [Object, (dbFiObj: Object, ...args: Array<Object>) => Object]>} */
        __keyTupMap__: new ObjectMap(),
        /** @type {Arguments} */
        __tmpArgs__: [],


        /**
         * Gets the data object built from all `<key>.json`.
         * Returns empty object if file not found.
         * <br> Do not modify this object!
         * @param {string} key
         * @return {Object}
         */
        getDataObj(key) {
            let tup = LCDBFileHandler.__keyTupMap__.get(key);
            return tup == null ?
                Object.air :
                tup[0];
        },


        /**
         * Adds a reader for `<key>.json`, see {@link readAuxJsonData}.
         * @param {string} key
         * @param {(dbFiObj: Object, ...args: Array<Object>) => Object} fun - Arguments will be passed down from {@link LCDBFileHandler.read}.
         * @return {void}
         */
        addReader(key, fun) {
            LCDBFileHandler.__keyTupMap__.put(key, [readAuxJsonData({}, key), fun]);
        },


        /**
         * Adds a reader specifically meant for reading properties for contents.
         * @param {string} key
         * @return {void}
         */
        addContentReader(key) {
            LCDBFileHandler.addReader(key, (dbFiObj, ct_gn, def) => tryVal(dbFiObj[typeof ct_gn === "string" ? ct_gn : ct_gn.name], def));
        },


        /**
         * Reads a registered DB object.
         * <br> `ARGS`: key, arg1, arg2, arg3, ...
         * @param {string} key
         * @return {Object}
         */
        read(key) {
            let tup = LCDBFileHandler.__keyTupMap__.get(key);
            if(tup == null) throw new Error("Database key ${1} is not registered!".format(key));

            let args = LCDBFileHandler.__tmpArgs__.clear();
            args.push(tup[0]);
            if(arguments.length > 1) {
                let i = 1, iCap = arguments.length;
                while(i < iCap) {
                    args.push(arguments[i]);
                    i++;
                };
            };
            return tup[1].apply(null, args);
        },


    };
