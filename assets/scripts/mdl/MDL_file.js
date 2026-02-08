/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods related to Arc {Fi} class.
   * Also provides methods to read/write files.
   *
   * For Json-related methods, see {MDL_json}.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- directory ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * "Mindustry/saves/mods", or "io.anuke.mindustry/files/mods".
   *
   * Don't use {root} here, or {arc.util.ArcRuntimeException} is thrown.
   * ---------------------------------------- */
  const mod = (function() {return fetchMod("lovec").file.parent()})();
  exports.mod = mod;


  /* ----------------------------------------
   * NOTE:
   *
   * "Mindustry/saves", or "io.anuke.mindustry/files" on Android.
   * ---------------------------------------- */
  const save = mod.parent();
  exports.save = save;


  /* ----------------------------------------
   * NOTE:
   *
   * "Mindustry/saves/maps", or "io.anuke.mindustry/files/maps" on Android.
   * ---------------------------------------- */
  const map = mod.sibling("maps");
  exports.map = map;


  /* ----------------------------------------
   * NOTE:
   *
   * "Mindustry/saves/saves", or "io.anuke.mindustry/files/saves" on Android.
   * ---------------------------------------- */
  const gameSave = mod.sibling("saves");
  exports.gameSave = gameSave;


  /* ----------------------------------------
   * NOTE:
   *
   * "Mindustry/saves/schematics", or "io.anuke.mindustry/files/schematics" on Android.
   * ---------------------------------------- */
  const schematic = mod.sibling("schematics");
  exports.schematic = schematic;


  /* ----------------------------------------
   * NOTE:
   *
   * "Mindustry/saves/mods/data/sharedData", or "io.anuke.mindustry/files/mods/data/sharedData" on Android.
   * ---------------------------------------- */
  const sharedData = mod.child("data").child("sharedData");
  exports.sharedData = sharedData;


  /* ----------------------------------------
   * NOTE:
   *
   * "Mindustry/saves/mods/data/lovec", or "io.anuke.mindustry/files/mods/data/lovec" on Android.
   * ---------------------------------------- */
  const lovecData = mod.child("data").child("lovec");
  exports.lovecData = lovecData;


  /* ----------------------------------------
   * NOTE:
   *
   * "Mindustry/cache/lovec", or "io.anuke.mindustry/cache/lovec" on Android.
   * ---------------------------------------- */
  const lovecCache = Core.files.cache("lovec");
  exports.lovecCache = lovecCache;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the root directory of a mod.
   * {mod.file} and {mod.root} can be different if the mod file is a zip file, handle it carefully!
   * ---------------------------------------- */
  const _root = function(nmMod, returnZipRoot) {
    let mod = fetchMod(nmMod, true);
    return mod == null ? null : (returnZipRoot ? mod.file : mod.root);
  };
  exports._root = _root;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the "content" folder of a mod.
   * ---------------------------------------- */
  const _content = function(nmMod) {
    let dirRt = _root(nmMod);
    if(dirRt == null) return null;
    let dir = dirRt.child("content");

    return !dir.exists() ? null : dir;
  };
  exports._content = _content;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the "content/xxx" folder of a mod according to {ctType}.
   * ---------------------------------------- */
  const _subContent = function(nmMod, ctType) {
    if(ctType == null) return null;
    let dirCt = _content(nmMod);
    if(dirCt == null) return null;
    let str = ctType.name().toLowerCase();
    let dir = dirCt.child(str + (str.endsWith("s") ? "" : "s"));

    return !dir.exists() ? null : dir;
  };
  exports._subContent = _subContent;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the "scripts" folder of a mod.
   * ---------------------------------------- */
  const _script = function(nmMod) {
    let dirRt = _root(nmMod);
    if(dirRt == null) return null;
    let dir = dirRt.child("scripts");

    return !dir.exists() ? null : dir;
  };
  exports._script = _script;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the "sprites" folder of a mod.
   * ---------------------------------------- */
  const _sprite = function(nmMod) {
    let dirRt = _root(nmMod);
    if(dirRt == null) return null;
    let dir = dirRt.child("sprites");

    return !dir.exists() ? null : dir;
  };
  exports._sprite = _sprite;


  /* <---------- file ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns a directory or file using relative path.
   * By default uses "Mindustry/saves" as the root directory.
   * ---------------------------------------- */
  const parsePath = function thisFun(dirCur, path, ignoreExist) {
    if(dirCur == null) dirCur = save;
    if(path == null) path = "";

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


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the .json or .hjson file of a mod content.
   * ---------------------------------------- */
  const _jsonCt = function(ct_gn) {
    let ct = global.lovecUtil.fun._ct(ct_gn);
    if(ct == null || ct.minfo.mod == null) return null;
    let nmMod = ct.minfo.mod.name;
    let dirSubCt = _subContent(nmMod, ct.getContentType());
    if(dirSubCt == null) return null;
    let nmCt = ct.name.replace(nmMod + "-", "");
    let fiSeq = dirSubCt.findAll(fi => (fi.name() === nmCt + ".json") || (fi.name() === nmCt + ".hjson"));

    return fiSeq.size === 0 ? null : fiSeq.get(0);
  };
  exports._jsonCt = _jsonCt;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the current Lovec data file.
   * ---------------------------------------- */
  const _lsav = function(isBackup) {
    if(Vars.state.isMenu()) return null;
    let saveSlotCur = Vars.control.saves.getCurrent();
    if(saveSlotCur == null) return null;

    return lovecData.child("saves").child(saveSlotCur.file.nameWithoutExtension() + (!isBackup ? "" : "_bak") + ".lsav");
  };
  exports._lsav = _lsav;


  /* <---------- read & write ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the string in a text file.
   * ---------------------------------------- */
  const _r_txt = function(fi, bypassExt) {
    if(fi == null || (!bypassExt && fi.extension() !== "txt")) return "";

    return fi.readString();
  };
  exports._r_txt = _r_txt;


  /* ----------------------------------------
   * NOTE:
   *
   * Writes {str} in a text file.
   * ---------------------------------------- */
  const _w_txt = function(fi, str, shouldAppend, bypassExt) {
    if(fi == null || (!bypassExt && fi.extension() !== "txt") || str == null) return;

    fi.writeString(str, Boolean(shouldAppend));
  };
  exports._w_txt = _w_txt;


  /* ----------------------------------------
   * NOTE:
   *
   * Reads a .csv file and returns the result as an array.
   * ---------------------------------------- */
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
        if((ol.charCodeAt(0) === 10 || ol == null) && tmp !== "") {
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


  /* ----------------------------------------
   * NOTE:
   *
   * Writes a .csv file with given n-array.
   * ---------------------------------------- */
  const _w_csv = function(fi, arr, ord, shouldAppend, bypassExt) {
    if(fi == null || (!bypassExt && fi.extension() !== "csv") || arr == null) return;
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


  /* ----------------------------------------
   * NOTE:
   *
   * Tries opening the file in explorer, or other file managers.
   * Open the file directly? Nope, that's a rabbit hole.
   * ---------------------------------------- */
  const openFi = function(fi) {
    if(fi == null || !fi.exists()) return false;

    return Core.app.openFolder(fi.file().path);
  };
  exports.openFi = openFi;
