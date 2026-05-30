/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- meta ----------> */


  /**
   * Utility class for creating content template-based contents with JSON/HJSON.
   * @class
   * @param {string} nmMod
   */
  const CLS_contentTemplateParser = newClass().initClass();


  CLS_contentTemplateParser.prototype.init = function(nmMod) {
    this.mod = fetchMod(nmMod);
    if(this.mod == null) return;
    VARGEN.nmModTempParserMap.put(nmMod, this);

    this.dirCt = this.mod.root.child("scripts").child("auxFi").child("json").child("content");
    this.jsonFis = [];
    this.parsedMap = new ObjectMap();
    this.parsedCts = [];

    this.run();
  };


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


  /**
   * Stores parser functions that map raw data to result.
   */
  CLS_contentTemplateParser.rawParserMap = ObjectMap.of(

    "LayerPreset", raw => VAR.layer[raw.name] + tryVal(raw.offset, 0.0),

    "ColorHex", raw => Color.valueOf(raw.value),
    "ColorPreset", raw => Color[raw.name],

    "EffectFx", raw => Fx[raw.name],
    "EffectPreset", raw => typeof raw.index !== "number" ? EFF[raw.name] : EFF[raw.name][raw.index],
    "EffectTP", raw => TP_effect[raw.name](raw.param),

    "Seq", raw => new Seq(raw.array),
    "ObjectMap", raw => {
      let map = new ObjectMap();
      Object._it(raw.object, (key, val) => {
        map.put(key, val);
      });
      return map;
    },

  );



/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/


  /* <------------------------------ util ------------------------------ */


  /**
   * Finds JSON/HJSON files to be parsed.
   * @return {Array<Fi>}
   */
  CLS_contentTemplateParser.prototype.findJsonFis = function() {
    if(this.dirCt.exists()) {
      this.dirCt.findAll(fi => (fi.extension() === "json") || (fi.extension() === "hjson")).each(fi => this.jsonFis.push(fi));
    };

    return this.jsonFis;
  };


  /**
   * Parses a JSON file and creates a content.
   * @param {Fi} jsonFi
   * @return {UnlockableContent}
   */
  CLS_contentTemplateParser.prototype.parse = function(jsonFi) {
    let obj = jsonToJsObj(jsonFi);

    let temp = null;
    if(obj.template != null) {
      if(LCTemp[obj.template] != null) {
        temp = LCTemp[obj.template];
      } else {
        // Try `require` from Lovec
        // Templates from other mods won't be considered here
        // If someone can write their own template, they shouldn't use JSON for contents anyway
        try {
          let tmpStr = obj.template, dir1 = null, dir2 = null;
          if(tmpStr.startsWith("EXT_")) {
            dir1 = "tempExt";
            tmpStr.replace("EXT_", "");
          } else {
            dir1 = "temp";
          };
          if(tmpStr.startsWith("BLK_")) {
            dir2 = "blk";
          } else if(tmpStr.startsWith("ENV_")) {
            dir2 = "env";
          } else if(tmpStr.startsWith("UNIT_")) {
            dir2 = "unit";
          } else if(tmpStr.startsWith("RS_")) {
            dir2 = "rs";
          } else if(tmpStr.startsWith("STA_")) {
            dir2 = "sta";
          } else if(tmpStr.startsWith("PLA_")) {
            dir2 = "pla";
          } else if(tmpStr.startsWith("WEA_")) {
            dir2 = "wea";
          };
          temp = dir2 == null ? null : require("lovec/" + dir1 + "/" + dir2 + "/" + (dir1 === "tempExt" ? "EXT_" : "") + tmpStr);
          if(dir2 === "blk") {
            temp = temp[0];
          };
        } catch(err) {
          temp = null;
        };
      };
    };
    if(temp == null) {
      console.warn("[LOVEC] Failed to parse JSON for content: template ${1} is not found.".format(obj.template));
      return null;
    };
    delete obj.template;

    let nmCt = jsonFi.nameWithoutExtension();
    let ct;
    if(temp.nm.startsWith("BLK_")) {
      let tempB = LCTemp[temp.nm.replace("BLK_", "B_")];
      let objB = obj.build;
      delete obj.build;
      this.convertType(obj);
      this.convertType(objB);
      ct = extendBlock([temp, tempB], nmCt, obj, objB);
    } else if(temp.nm.startsWith("UNIT_")) {
      this.convertType(obj);
      ct = extendUnit(temp, nmCt, obj);
    } else if(temp.nm.startsWith("PLA_")) {
      let sectorSize = obj.sectorSize;
      delete obj.sectorSize;
      this.convertType(obj);
      ct = extendPlanet(temp, nmCt, sectorSize, obj);
    } else {
      this.convertType(obj);
      ct = extendBase(temp, nmCt, obj);
    };
    this.parsedMap.put(nmCt, obj);
    this.parsedCts.push(ct);

    return ct;
  };


  /**
   * Converts raw data for some fields.
   * @param {Object} obj
   * @return {void}
   */
  CLS_contentTemplateParser.prototype.convertType = function(obj) {
    let raw, type, result;
    for(let key in obj) {
      raw = obj[key];
      if(typeof raw !== "object" || raw instanceof Array || typeof raw.type !== "string") continue;
      type = raw.type;
      delete raw.type;
      result = CLS_contentTemplateParser.rawParserMap.get(type, Function.air)(raw);
      if(result !== undefined) {
        obj[key] = result;
      };
    };
  };


  /**
   * Parses found JSON/HJSON files and creates contents.
   * @return {void}
   */
  CLS_contentTemplateParser.prototype.run = function() {
    this.findJsonFis().forEachFast(jsonFi => this.parse(jsonFi));
    console.log("[LOVEC] Parsed ${1} JSON files and created ${2} contents for ${3} through content template.".format(this.jsonFis.length, this.parsedCts.length, this.mod.name.color(Pal.accent)));
  };




module.exports = CLS_contentTemplateParser;
