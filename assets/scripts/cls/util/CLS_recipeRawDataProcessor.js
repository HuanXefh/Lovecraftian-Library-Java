/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * Reads raw recipe data JSON files.
     * @class
     * @param {string} nameMod
     * @param {string|unset} [path]
     */
    const CLS_recipeRawDataProcessor = newClass().initClass();


    /** @private */
    CLS_recipeRawDataProcessor.prototype.init = function(nameMod, genData, path) {


        /** @type {string} */
        this.mod = nameMod;
        /** @type {Object<string, Array|Object<string, Array>>} */
        this.genData = genData;
        /** @type {string} */
        this.path = tryVal(path, "scripts/auxFi/json/rawRc");

        /** @type {Fi|null} */
        this.targetDir = null;
        /** @type {Array<Fi>} */
        this.jsonFis = [];


        this.run();


    };


/*
  ================================================================================
  Section: Definition (Static)
  ================================================================================
*/


/*
  ================================================================================
  Section: Definition (Instance)
  ================================================================================
*/



    /**
     * @return {void}
     */
    CLS_recipeRawDataProcessor.prototype.run = function() {
        let rootDir = MDL_file.getRootDir(this.mod);
        if(rootDir == null) throw new Error("Mod not found: " + this.mod);
        this.targetDir = MDL_file.parsePath(rootDir, this.path);
        if(this.targetDir == null) throw new Error("Directory not found: " + this.mod + "/" + this.path);
        this.targetDir.findAll(fi => (fi.extension() === "json") || (fi.extension() === "hjson")).each(fi => this.jsonFis.push(fi));

        let
            rawRcObj,
            targetObj,
            lastTargetObj,
            keys,
            key,
            i,
            iCap,
            count = 0;
        this.jsonFis.forEachFast(jsonFi => {
            rawRcObj = jsonToJsObj(jsonFi);
            if(rawRcObj.type == null) throw new Error("Missing type in raw recipe data: " + jsonFi);
            if(typeof rawRcObj.type !== "string" || String.isBlank(rawRcObj.type)) throw new Error("`type` must be a string path: " + jsonFi);
            keys = rawRcObj.type.split(".");
            targetObj = this.genData;
            i = 0;
            iCap = keys.iCap();
            while(i < iCap) {
                key = keys[i];
                lastTargetObj = targetObj;
                targetObj = lastTargetObj[key];
                if(targetObj == null) {
                    lastTargetObj[key] = iCap - i <= 1 ? [] : {};
                    targetObj = lastTargetObj[key];
                };
                i++;
            };
            delete rawRcObj.type;
            if(!(targetObj instanceof Array)) throw new Error("`type` target is not an array: " + jsonFi);
            this.processObj(rawRcObj);
            targetObj.push(jsonFi.nameWithoutExtension(), rawRcObj);
            count++;
        });
        console.log("[LOVEC] Processed ${1} raw recipe data files for ${2}.".format(count.color(GLB_color.accent), this.mod.color(GLB_color.accent)));
    };


    /**
     * @param {Object} obj
     * @return {void}
     */
    CLS_recipeRawDataProcessor.prototype.processObj = function(obj) {
        if(typeof obj.hardness === "string") {
            obj.hardness = SLCDBFileHandler.read("item-hardness", obj.hardness);
        };
        if(typeof obj.tempReq === "string") {
            obj.tempReq = SLCDBFileHandler.read("item-sintering-temperature", obj.tempReq);
        };
    };



module.exports = CLS_recipeRawDataProcessor;
