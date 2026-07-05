/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- meta ----------> */


  /**
   * Utility class for creating content template-based contents with JSON/HJSON.
   * @class
   * @param {string} nameMod
   */
  const CLS_contentTemplateParser = newClass().initClass();


  CLS_contentTemplateParser.prototype.init = function(nameMod) {
    this.mod = fetchMod(nameMod);
    if(this.mod == null) return;
    nameMod.nameModParserMap.put(nameMod, this);

    this.dirCt = this.mod.root.child("scripts").child("auxFi").child("json").child("content");
    this.jsonFis = [];
    this.parsedMap = new ObjectMap();
    this.parsedCts = [];

    this.run();
  };


  const nameModParserMap = new ObjectMap();


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


  /**
   * Gets a parser by mod name.
   * @param {string} nameMod
   * @return {CLS_contentTemplateParser|null}
   */
  CLS_contentTemplateParser.get = function(nameMod) {
    return nameModParserMap.get(nameMod);
  };


  /**
   * Parses a raw field value.
   * @param {any} raw
   * @return {any}
   */
  CLS_contentTemplateParser.parseField = function(raw) {
    if(typeof raw !== "object" || raw instanceof Array || typeof raw.type !== "string") return raw;
    let type = raw.type;
    delete raw.type;
    let parser = DB_parser.db["template"].read(type);
    if(parser == null) throw new Error("Cannot find parser for type: ${1}".format(type));
    return parser(raw);
  };


  /**
   * Parses raw fields values in `obj`.
   * Modifies the original object.
   * @param {Object} obj
   * @return {Object}
   */
  CLS_contentTemplateParser.parseFields = function(obj) {
    for(let key in obj) {
      obj[key] = CLS_contentTemplateParser.parseField(obj[key]);
    };

    return obj;
  };



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
          let tmpStr = obj.template, dir1, dir2 = null;
          if(tmpStr.startsWith("EXT_")) {
            dir1 = "tempExt";
            tmpStr = tmpStr.replace("EXT_", "");
          } else {
            dir1 = "temp";
          };
          // It's fine to hard-code this I guess
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

    let nameCt = jsonFi.nameWithoutExtension();
    let ct;
    if(temp instanceof Array) {
      let objB = obj.build;
      delete obj.build;
      this.parseFields(obj);
      this.parseFields(objB);
      ct = extendBlock(temp, nameCt, temp[0].build(obj), temp[1].build(objB));
    } else if(temp.nm.startsWithAny("UNIT_", "EXT_UNIT_")) {
      this.parseFields(obj);
      ct = extendUnit(temp, nameCt, temp.build(obj));
    } else if(temp.nm.startsWithAny("PLA_", "EXT_PLA_")) {
      let sectorSize = obj.sectorSize;
      delete obj.sectorSize;
      this.parseFields(obj);
      ct = extendPlanet(temp, nameCt, sectorSize, temp.build(obj));
    } else {
      this.parseFields(obj);
      ct = extendBase(temp, nameCt, temp.build(obj));
    };
    this.parsedMap.put(nameCt, obj);
    this.parsedCts.push(ct);

    return ct;
  };


  /**
   * Variant of {@link CLS_contentTemplateParser.parseFields} for instance.
   * @param {Object} obj
   * @return {void}
   */
  CLS_contentTemplateParser.prototype.parseFields = function(obj) {
    return CLS_contentTemplateParser.parseFields(obj);
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
