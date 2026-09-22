/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Methods related to Arc {@link Fi} class.
     * Also provides methods to read/write files.
     * <br> Note that methods here returns null if file not existent by default.
     * @module lovec/mdl/MDL_file
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ directory ------------------------------> */


    /**
     * `PATH`: `Mindustry/saves/mods` or `io.anuke.mindustry/files/mods`.
     * @type {Fi}
     */
    const mod = (function() {return fetchMod("lovec").file.parent()})();
    exports.mod = mod;


    /**
     * `PATH`: `Mindustry/saves` or `io.anuke.mindustry/files`.
     * @type {Fi}
     */
    const save = mod.parent();
    exports.save = save;


    /**
     * `PATH`: `Mindustry/saves/maps` or `io.anuke.mindustry/files/maps`.
     * @type {Fi}
     */
    const map = mod.sibling("maps");
    exports.map = map;


    /**
     * `PATH`: `Mindustry/saves/saves` or `io.anuke.mindustry/files/saves`.
     * @type {Fi}
     */
    const gameSave = mod.sibling("saves");
    exports.gameSave = gameSave;


    /**
     * `PATH`: `Mindustry/saves/schematics` or `io.anuke.mindustry/files/schematics`.
     * @type {Fi}
     */
    const schematic = mod.sibling("schematics");
    exports.schematic = schematic;


    /**
     * `PATH`: `Mindustry/saves/mods/data/sharedData` or `io.anuke.mindustry/files/mods/data/sharedData`.
     * @type {Fi}
     */
    const sharedData = mod.child("data").child("sharedData");
    exports.sharedData = sharedData;


    /**
     * `PATH`: `Mindustry/saves/mods/data/lovec` or `io.anuke.mindustry/files/mods/data/lovec`.
     * @type {Fi}
     */
    const lovecData = mod.child("data").child("lovec");
    exports.lovecData = lovecData;


    /**
     * `PATH`: `Mindustry/save/cache/common` or `io.anuke.mindustry/files/cache/common`.
     * @type {Fi}
     */
    const commonCache = save.child("cache").child("common");
    exports.commonCache = commonCache;


    /**
     * Returns the root directory of a mod.
     * @param {string} nameMod
     * @param {boolean|unset} [returnZipRoot] - If true, this method will return directory of the file instead of extracted data. Handle this carefully!
     * @return {Fi|null}
     */
    const getRootDir = function(nameMod, returnZipRoot) {
        let mod = fetchMod(nameMod, true);
        return mod == null ?
            null :
            returnZipRoot ?
                mod.file :
                mod.root;
    };
    exports.getRootDir = getRootDir;


    /**
     * `PATH`: `<nameMod>/content`.
     * @param {string} nameMod
     * @return {Fi|null}
     */
    const getContentDir = function(nameMod) {
        let dirRt = getRootDir(nameMod);
        if(dirRt == null) return null;
        let dir = dirRt.child("content");
        return !dir.exists() ?
            null :
            dir;
    };
    exports.getContentDir = getContentDir;


    /**
     * `PATH`: `<nameMod>/content/xxx`, based on given type.
     * @param {string} nameMod
     * @param {ContentType} ctType
     * @return {Fi|null}
     */
    const getSubContentDir = function(nameMod, ctType) {
        let dirCt = getContentDir(nameMod);
        if(dirCt == null) return null;
        let str = ctType.name().toLowerCase();
        let dir = dirCt.child(str + (str.endsWith("s") ? "" : "s"));
        return !dir.exists() ?
            null :
            dir;
    };
    exports.getSubContentDir = getSubContentDir;


    /**
     * `PATH`: `<nameMod>/scripts`.
     * @param {string} nameMod
     * @return {Fi|null}
     */
    const getScriptDir = function(nameMod) {
        let dirRt = getRootDir(nameMod);
        if(dirRt == null) return null;
        let dir = dirRt.child("scripts");
        return !dir.exists() ?
            null :
            dir;
    };
    exports.getScriptDir = getScriptDir;


    /**
     * `PATH`: `<nameMod>/sprites`.
     * @param {string} nameMod
     * @return {Fi|null}
     */
    const getSpriteDir = function(nameMod) {
        let dirRt = getRootDir(nameMod);
        if(dirRt == null) return null;
        let dir = dirRt.child("sprites");
        return !dir.exists() ?
            null :
            dir;
    };
    exports.getSpriteDir = getSpriteDir;


    /* <------------------------------ file ------------------------------> */


    /**
     * Gets a directory or file using relative path.
     * By default, this uses "Mindustry/saves" as root directory.
     * @param {Fi|null} dirCur
     * @param {string} path
     * @param {boolean} ignoreExist - If true, this method won't return null if file does not exist.
     * @return {Fi|null}
     */
    const parsePath = function thisFun(dirCur, path, ignoreExist) {
        if(dirCur == null) dirCur = save;

        let path_fi = String(path);
        if(!path.endsWith("/")) path_fi += "/";
        thisFun.tmpStrs.clear();

        let
            tmp = "",
            l,
            i = 0,
            iCap = path_fi.iCap();

        // Parse path string
        while(i < iCap) {
            l = path_fi[i];
            if(l === "." && tmp === "") {
                thisFun.tmpStrs.push(".");
            } else if(l === "/") {
                thisFun.tmpStrs.push(tmp);
                tmp = "";
            } else {
                tmp += l;
            };
            i++;
        };
        // Get target file
        let dir = dirCur;
        thisFun.tmpStrs.forEachFast(name => {
            dir = name === "." ?
                dir.parent() :
                dir.child(name);
        }, true);

        return ignoreExist ?
            dir :
            !dir.exists() ?
                null :
                dir;
    }
    .setProp({
        /**
         * @memberof parsePath
         * @type {Array<string>}
         */
        tmpStrs: [],
    });
    exports.parsePath = parsePath;


    /**
     * Gets the .json or .hjson file of some mod content.
     * Do not even try vanilla content!
     * @param {ContentGn} ct_gn
     * @return {Fi|null}
     */
    const getCtJson = function(ct_gn) {
        let ct = findContent(ct_gn);
        if(ct == null || ct.minfo.mod == null) return null;
        let nameMod = ct.minfo.mod.name;
        let dirSubCt = getSubContentDir(nameMod, ct.getContentType());
        if(dirSubCt == null) return null;
        let nameCt = ct.name.replace(nameMod + "-", "");
        let fiSeq = dirSubCt.findAll(fi => (fi.name() === nameCt + ".json") || (fi.name() === nameCt + ".hjson"));
        return fiSeq.size === 0 ? null : fiSeq.get(0);
    };
    exports.getCtJson = getCtJson;


    /**
     * Gets current LSAV file.
     * @param {boolean|unset} [isBackup]
     * @return {Fi|null}
     */
    const getLsav = function(isBackup) {
        if(Vars.state.isMenu()) return null;
        let saveSlotCur = Vars.control.saves.getCurrent();
        if(saveSlotCur == null) return null;
        return lovecData.child("saves").child(saveSlotCur.file.nameWithoutExtension() + (!isBackup ? "" : "_bak") + ".lsav");
    };
    exports.getLsav = getLsav;


    /**
     * Gets current PLSAV file.
     * @param {boolean|unset} [isBackup]
     * @return {Fi|null}
     */
    const getPlsav = function(isBackup) {
        let lsavFi = getLsav(isBackup);
        if(lsavFi == null) return null;
        let namePla = global.lovecUtil.fun.getPlaCur();
        let fi = namePla === "" ?
            null :
            lovecData.child("saves").child(namePla + (!isBackup ? "" : "_bak") + ".plsav");

        // In debug mode, PLSAV is accessible from outside of campaign
        return Vars.state.isCampaign() || global.lovecUtil.prop.debug ?
            fi :
            lsavFi.parent().child(lsavFi.nameWithoutExtension() + ".plsav");
    };
    exports.getPlsav = getPlsav;


    /* <------------------------------ read & write ------------------------------> */


    /**
     * Reads string in a .txt file.
     * @param {Fi|null} fi
     * @return {string}
     */
    const readTxt = function(fi) {
        if(fi == null) return "";
        return fi.readString();
    };
    exports.readTxt = readTxt;


    /**
     * Writes string to a .txt file.
     * @param {Fi|null} fi
     * @param {string} str
     * @param {boolean|unset} [append]
     * @return {void}
     */
    const writeTxt = function(fi, str, append) {
        if(fi == null) return;
        fi.writeString(str, Boolean(append));
    };
    exports.writeTxt = writeTxt;


    /**
     * Reads data in a .csv file and returns result as a string array.
     * @param {Fi|null} fi
     * @return {Array}
     */
    const readCsv = function(fi) {
        let arr = [];
        if(fi == null) return arr;

        let
            str = fi.readString(),
            tmp = "",
            l,
            ol,
            i = 0,
            iCap = str.iCap(),
            j,
            jCap,
            k,
            kCap;

        while(i < iCap) {
            l = str[i];
            if(l === ",") {
                arr.push(tmp);
                tmp = "";
            } else if(l === " ") {
                j = 0;
                jCap = i;
                while(j < jCap) {
                    ol = str[i - j];
                    if(ol === " ") {
                        // Do nothing, check previous letter
                    } else if(ol === "," || ol.charCodeAt(0) === 13 || ol.charCodeAt(0) === 10) {
                        // End of element
                        break;
                    } else {
                        k = 0;
                        kCap = j + 1;
                        while(k < kCap) {
                            tmp += " ";
                        };
                        break;
                    };
                    j++;
                };
            } else if(l.charCodeAt(0) === 13) {
                ol = str[i + 1];
                if(ol.charCodeAt(0) === 10 && tmp !== "") {
                    arr.push(tmp);
                    tmp = "";
                };
            } else if(l.charCodeAt(0) === 10) {
                // Do nothing
            } else {
                tmp += l;
            };
            i++;
        };
        if(i > 0 && tmp !== "") arr.push(tmp);

        return arr;
    };
    exports.readCsv = readCsv;


    /**
     * Writes an n-array to a .csv file.
     * @param {Fi|null} fi
     * @param {Array} arr
     * @param {number} ord
     * @param {boolean|unset} [append]
     * @return {void}
     */
    const writeCsv = function(fi, arr, ord, append) {
      if(fi == null) return;

      let
          str = "",
          i = 0,
          iCap = arr.iCap();

      while(i < iCap) {
          str += String(arr[i]);
          str += ",";
          if((i + 1) % ord === 0) {
              str += String.fromCharCode(13) + String.fromCharCode(10);
          };
          i++;
      };

      fi.writeString(str, Boolean(append));
    };
    exports.writeCsv = writeCsv;


    /**
     * Writes a JSON data to a .json file.
     * @param {Fi|null} fi
     * @param {JSONString|JSONObject} jsonData
     * @return {void}
     */
    const writeJson = function(fi, jsonData) {
        if(fi == null) return;
        try {
            let str = typeof jsonData === "string" ?
                jsonData :
                toJsonSafe(jsonData);
            fi.writeString(str);
        } catch(err) {
            console.err("[LOVEC] Failed to write ${1}:\n".format(fi) + err);
        };
    };
    exports.writeJson = writeJson;


    /* <------------------------------ misc ------------------------------> */


    /**
     * Opens a file folder in explorer or other file manager.
     * @param {Fi|null} fi
     * @return {boolean}
     */
    const openFolder = function(fi) {
        if(fi == null || !fi.exists()) return false;
        return Core.app.openFolder(fi.file().path);
    };
    exports.openFolder = openFolder;
