/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods related to Arc {@link Fi} class.
   * Also provides methods to read/write files.
   * For JSON-related methods, see {@link MDL_json}.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- directory ----------> */


  /**
   * <PATH>: "Mindustry/saves/mods" or "io.anuke.mindustry/files/mods".
   */
  const mod = (function() {return fetchMod("lovec").file.parent()})();
  exports.mod = mod;


  /**
   * <PATH>: "Mindustry/saves" or "io.anuke.mindustry/files".
   */
  const save = mod.parent();
  exports.save = save;


  /**
   * <PATH>: "Mindustry/saves/maps" or "io.anuke.mindustry/files/maps".
   */
  const map = mod.sibling("maps");
  exports.map = map;


  /**
   * <PATH>: "Mindustry/saves/saves" or "io.anuke.mindustry/files/saves".
   */
  const gameSave = mod.sibling("saves");
  exports.gameSave = gameSave;


  /**
   * <PATH>: "Mindustry/saves/schematics" or "io.anuke.mindustry/files/schematics".
   */
  const schematic = mod.sibling("schematics");
  exports.schematic = schematic;


  /**
   * <PATH>: "Mindustry/saves/mods/data/sharedData" or "io.anuke.mindustry/files/mods/data/sharedData".
   */
  const sharedData = mod.child("data").child("sharedData");
  exports.sharedData = sharedData;


  /**
   * <PATH>: "Mindustry/saves/mods/data/lovec" or "io.anuke.mindustry/files/mods/data/lovec".
   */
  const lovecData = mod.child("data").child("lovec");
  exports.lovecData = lovecData;


  /**
   * <PATH>: "Mindustry/cache/lovec" or "io.anuke.mindustry/cache/lovec".
   */
  const lovecCache = Core.files.cache("lovec");
  exports.lovecCache = lovecCache;


  /**
   * Returns the root directory of a mod.
   * @param {string} nmMod
   * @param {boolean|unset} [returnZipRoot] - If true, this method will return directory of the file instead of extracted data. Handle this carefully!
   * @return {Fi|null}
   */
  const _root = function(nmMod, returnZipRoot) {
    let mod = fetchMod(nmMod, true);
    return mod == null ? null : (returnZipRoot ? mod.file : mod.root);
  };
  exports._root = _root;


  /**
   * <PATH>: "<nmMod>/content".
   * @param {string} nmMod
   * @return {Fi|null}
   */
  const _content = function(nmMod) {
    let dirRt = _root(nmMod);
    if(dirRt == null) return null;
    let dir = dirRt.child("content");

    return !dir.exists() ? null : dir;
  };
  exports._content = _content;


  /**
   * <PATH>: "<nmMod>/content/xxx", based on given type.
   * @param {string} nmMod
   * @param {ContentType} ctType
   * @return {Fi|null}
   */
  const _subContent = function(nmMod, ctType) {
    let dirCt = _content(nmMod);
    if(dirCt == null) return null;
    let str = ctType.name().toLowerCase();
    let dir = dirCt.child(str + (str.endsWith("s") ? "" : "s"));

    return !dir.exists() ? null : dir;
  };
  exports._subContent = _subContent;


  /**
   * <PATH>: "<nmMod>/scripts".
   * @param {string} nmMod
   * @return {Fi|null}
   */
  const _script = function(nmMod) {
    let dirRt = _root(nmMod);
    if(dirRt == null) return null;
    let dir = dirRt.child("scripts");

    return !dir.exists() ? null : dir;
  };
  exports._script = _script;


  /**
   * <PATH>: "<nmMod>/sprites".
   * @param {string} nmMod
   * @return {Fi|null}
   */
  const _sprite = function(nmMod) {
    let dirRt = _root(nmMod);
    if(dirRt == null) return null;
    let dir = dirRt.child("sprites");

    return !dir.exists() ? null : dir;
  };
  exports._sprite = _sprite;


  /* <---------- file ----------> */


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

    let path_fi = path;
    if(!path.endsWith("/")) path_fi += "/";
    thisFun.tmpStrs.clear();

    let tmp = "", l;
    let i = 0, iCap = path_fi.iCap();
    while(i < iCap) {
      l = path_fi[i];
      if(l === "." && tmp === "") {
        thisFun.tmpStrs.push(".");
      } else if(l === "/") {
        thisFun.tmpStrs.push(String(tmp));
        tmp = "";
      } else {
        tmp += l;
      };
      i++;
    };

    let dir = dirCur;
    thisFun.tmpStrs.forEachFast(nm => {
      dir = nm === "." ?
        dir.parent() :
        dir.child(nm);
    });

    return ignoreExist ? dir : (!dir.exists() ? null : dir);
  }
  .setProp({
    tmpStrs: [],
  });
  exports.parsePath = parsePath;


  /**
   * Gets the .json or .hjson file of some mod content.
   * Do not even try vanilla content!
   * @param {ContentGn} ct_gn
   * @return {Fi|null}
   */
  const _jsonCt = function(ct_gn) {
    let ct = findContent(ct_gn);
    if(ct == null || ct.minfo.mod == null) return null;
    let nmMod = ct.minfo.mod.name;
    let dirSubCt = _subContent(nmMod, ct.getContentType());
    if(dirSubCt == null) return null;
    let nmCt = ct.name.replace(nmMod + "-", "");
    let fiSeq = dirSubCt.findAll(fi => (fi.name() === nmCt + ".json") || (fi.name() === nmCt + ".hjson"));

    return fiSeq.size === 0 ? null : fiSeq.get(0);
  };
  exports._jsonCt = _jsonCt;


  /**
   * Gets current LSAV file.
   * @param {boolean|unset} [isBackup] - If true, return {@link Fi} of the backup.
   * @return {Fi|null}
   */
  const _lsav = function(isBackup) {
    if(Vars.state.isMenu()) return null;
    let saveSlotCur = Vars.control.saves.getCurrent();
    if(saveSlotCur == null) return null;

    return lovecData.child("saves").child(saveSlotCur.file.nameWithoutExtension() + (!isBackup ? "" : "_bak") + ".lsav");
  };
  exports._lsav = _lsav;


  /* <---------- read & write ----------> */


  /**
   * Reads string in a .txt file.
   * @param {Fi|null} fi
   * @param {boolean|unset} [bypassExt]
   * @return {string}
   */
  const _r_txt = function(fi, bypassExt) {
    if(fi == null || (!bypassExt && fi.extension() !== "txt")) return "";

    return fi.readString();
  };
  exports._r_txt = _r_txt;


  /**
   * Writes string to a .txt file.
   * @param {Fi|null} fi
   * @param {string} str
   * @param {boolean|unset} [shouldAppend]
   * @param {boolean|unset} [bypassExt]
   * @return {void}
   */
  const _w_txt = function(fi, str, shouldAppend, bypassExt) {
    if(fi == null || (!bypassExt && fi.extension() !== "txt")) return;

    fi.writeString(str, Boolean(shouldAppend));
  };
  exports._w_txt = _w_txt;


  /**
   * Reads data in a .csv file and returns result as a string array.
   * @param {Fi|null} fi
   * @param {boolean|unset} [bypassExt]
   * @return {Array}
   */
  const _r_csv = function(fi, bypassExt) {
    const arr = [];

    if(fi == null || (!bypassExt && fi.extension() !== "csv")) return arr;

    let str = fi.readString();
    let tmp = "", l, ol, i = 0, iCap = str.iCap(), j, jCap, k, kCap;
    while(i < iCap) {
      l = str[i];
      if(l === ",") {
        arr.push(String(tmp));
        tmp = "";
      } else if(l === " ") {
        j = 0;
        jCap = i;
        while(j < jCap) {
          ol = str[i - j];
          if(ol === " ") {
            // Do nothing, check previous letter
          } else if(ol === "," || ol.charCodeAt(0) === 13 || ol.charCodeAt(0) === 10) {
            // Do nothing
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
          arr.push(String(tmp));
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
  exports._r_csv = _r_csv;


  /**
   * Writes an n-array to a .csv file.
   * @param {Fi|null} fi
   * @param {Array} arr
   * @param {number|unset} [ord]
   * @param {boolean|unset} [shouldAppend]
   * @param {boolean|unset} [bypassExt]
   * @return {void}
   */
  const _w_csv = function(fi, arr, ord, shouldAppend, bypassExt) {
    if(fi == null || (!bypassExt && fi.extension() !== "csv")) return;
    if(ord == null) ord = 2;

    let str = "";
    let i = 0, iCap = arr.iCap();
    while(i < iCap) {
      str += String(arr[i]);
      str += ",";
      if((i + 1) % ord === 0) {
        str += String.fromCharCode(13) + String.fromCharCode(10);
      };
      i++;
    };

    fi.writeString(str, Boolean(shouldAppend));
  };
  exports._w_csv = _w_csv;


  /* <---------- misc ----------> */


  /**
   * Opens a file in explorer or other file manager based on OS.
   * @param {Fi|null} fi
   * @return {boolean}
   */
  const openFi = function(fi) {
    if(fi == null || !fi.exists()) return false;

    return Core.app.openFolder(fi.file().path);
  };
  exports.openFi = openFi;
