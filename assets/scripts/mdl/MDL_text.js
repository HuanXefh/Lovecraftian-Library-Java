/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods to process texts.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- text ----------> */


  /**
   * Gets a space character or empty string, based on current locale.
   * @return {string}
   */
  const _space = function() {
    switch(global.lovecUtil.prop.locale) {
      case "zh_CN" : return "";
      case "zh_TW" : return "";
      case "ja" : return "";
      case "ko" : return "";
    };
    return " ";
  };
  exports._space = _space;


  /**
   * Gets a colon character based on current locale.
   * @return {string}
   */
  const _colon = function() {
    switch(global.lovecUtil.prop.locale) {
      case "zh_CN" : return "：";
      case "zh_TW" : return "：";
      case "ja" : return "：";
      case "ko" : return "：";
    };
    return ": ";
  };
  exports._colon = _colon;


  /* <---------- format (stat) ----------> */


  /**
   * Constructs database stat string.
   * Mostly used in `addStats(tb)` of abilities.
   * @param {string|unset} [strStat]
   * @param {string|unset} [strVal]
   * @param {string|unset} [strUnit]
   * @return {string}
   * @example
   * _statText(Stat.range.localized(), 8, StatUnit.blocks.localized());                // Returns "Range: 8 blocks" with proper colors
   */
  const _statText = function(strStat, strVal, strUnit) {
    let
      str1 = (strStat == null) ? "" : ("[lightgray]" + strStat + ": []"),
      str2 = (strVal == null) ? "" : strVal,
      str3 = (strUnit == null) ? "" : (" " + strUnit);

    return str1 + str2 + str3;
  };
  exports._statText = _statText;


  /**
   * Constructs multiplier stat string with dynamic color.
   * By default, it's red for less than 100%, green for more than 100%, white for exactly 100%.
   * @param {string} strStat
   * @param {number} mtp
   * @param {boolean|unset} [isRev] - If true, it's red for more than 100% and vice versa.
   */
  const _statText_mtp = function(strStat, mtp, isRev) {
    return _statText(
      strStat,
      (mtp < 1.0 ? (isRev ? "[green]" : "[red]") : (isRev ? "[red]" : "[green]")) + Strings.autoFixed(mtp * 100.0, 2) + "%[]",
    );
  };
  exports._statText_mtp = _statText_mtp;


  /* <---------- format ----------> */


  /**
   * Gets generic damage text.
   * @param {number|unset} [dmg]
   * @param {number|unset} [dmgPerc]
   * @return {string}
   */
  const _dmgText = function(dmg, dmgPerc) {
    let
      str1 = dmg == null || dmg < 0.0001 ? null : String(dmg.roundFixed(2)).color(Pal.remove),
      str2 = dmgPerc == null || dmgPerc < 0.0001 ? null : dmgPerc.perc().color(Pal.remove);

    if(str1 == null && str2 == null) return "!ERR";
    if(str1 == null) return str2;
    if(str2 == null) return str1;

    return str1 + " + ".color(Pal.remove) + str2;
  };
  exports._dmgText = _dmgText;


  /**
   * Gets generic heal amount text.
   * @param {number|unset} [healAmt]
   * @param {number|unset} [healPerc]
   * @return {string}
   */
  const _healText = function(healAmt, healPerc) {
    let
      str1 = healAmt == null || healAmt < 0.0001 ? null : String(healAmt.roundFixed(2)).color(Pal.heal),
      str2 = healPerc == null || healPerc < 0.0001 ? null : healPerc.perc().color(Pal.heal);

    if(str1 == null && str2 == null) return "!ERR";
    if(str1 == null) return str2;
    if(str2 == null) return str1;
    return str1 + " + ".color(Pal.heal) + str2;
  };
  exports._healText = _healText;


  /**
   * Gets tag string from a list of tags.
   * @param {Array<string>} strs - Tags as string, should be translated beforehand.
   * @param {boolean|unset} [ignoreEmpty] - If true, returns empty string when no tags.
   * @example
   * _tagText(["chloric", "fluoric", "oxidative"]);                // Returns "chloric; fluoric; oxidative"
   */
  const _tagText = function(strs, ignoreEmpty) {
    let str_fi = "";
    strs.forEachFast(str => str_fi += str + "; ");

    return (String.isEmpty(str_fi) && !ignoreEmpty) ? "!NOTAG" : str_fi;
  };
  exports._tagText = _tagText;


  /**
   * Converts tag text back to a list of tags.
   * @param {string} text
   * @param {Array|unset} [contArr]
   * @return {Array<string>}
   */
  const tagTextToArr = function(text, contArr) {
    const arr = contArr != null ? contArr.clear() : [];
    if(String.isEmpty(text) || text === "!NOTAG") return arr;

    let tmp = "", l;
    let i = 0, iCap = text.iCap();
    while(i < iCap) {
      l = text[i];
      if(l === ";") {
        arr.push(String(tmp));
        tmp = "";
        i += 2;
        continue;
      } else {
        tmp += l;
      };
      i++;
    };

    return arr;
  };
  exports.tagTextToArr = tagTextToArr;


  /* <---------- search ----------> */


  /**
   * Parses logical operators in a string, splits the string into a 2D-array of strings for further processing.
   * In the result array, the first layer is for "OR", and the second layer is for "AND".
   * @param {string} str
   * @return {Array<Array<string>>}
   */
  const parseLogicOp = function(str) {
    const matArr = [];

    str.split(/\s*((or)|(OR)|(\|)|(\|\|))\s*/).forEachFast(str1 => {
      matArr.push(str1.split(/\s*((and)|(AND)|&|(&&))\s*/));
    });

    return matArr;
  };
  exports.parseLogicOp = parseLogicOp;


  /**
   * Finds keywords in given string for search.
   * @param {string} str
   * @return {Array<string>}
   * @example
   * _keywords("copper;lead;graphite");                // Returns ["copper", "lead", "graphite"]
   */
  const _keywords = function thisFun(str) {
    const arr = [];

    let tmp = "", l;
    let i = 0, iCap = str.iCap();
    while(i < iCap) {
      l = str[i];
      if(!thisFun.splitters.includes(l)) {
        tmp += l;
      } else {
        arr.push(String(tmp));
        tmp = "";
      };
      i++;
    };
    arr.push(tmp);

    return arr;
  }
  .setProp({
    splitters: [
      ",", ";",
      "，", "。", "、",
    ],
  });
  exports._keywords = _keywords;


  /**
   * Gets a list of filters from given keywords, see {@link DB_misc} for tag definition.
   * @param {Array<string>} keywords
   * @return {(function(UnlockableContent): boolean)[]}
   */
  const _searchBoolFs = function(keywords) {
    const arr = [];
    const li = DB_misc.db["search"]["tag"];

    let isTag = false, tmpTag, tmpStr, i, iCap = li.iCap();
    keywords.forEachFast(str => {
      str = str.trim().toLowerCase();
      tmpStr = "";
      i = 0;
      while(i < iCap) {
        tmpTag = li[i];
        if(str.startsWith(tmpTag)) {
          // This keyword is treated as a tag
          isTag = true;
          tmpStr = str.replace(tmpTag, "").trim();
          if(!String.isEmpty(tmpStr)) arr.push(ct => li[i + 1](ct, tmpStr));
          break;
        };
        i += 2;
      };
      if(!isTag) {
        // Not tag, use regular search
        arr.push(
          ct => ct.name.toLowerCase().includes(str)
            || Strings.stripColors(ct.localizedName).toLowerCase().includes(str)
            || (global.lovecUtil.prop.locale === "zh_CN" && LIB_pinyin.fetchPinyin(Strings.stripColors(ct.localizedName)).toLowerCase().includes(str))
        );
      };
      isTag = false;
    });

    return arr;
  };
  exports._searchBoolFs = _searchBoolFs;


  /**
   * Whether some content matches given search string.
   * @param {UnlockableContent} ct
   * @param {string} str
   * @return {boolean}
   */
  const _searchValid = function(ct, str) {
    return parseLogicOp(str).some(strs => strs.every(str1 => _searchBoolFs(_keywords(str1)).every(boolF => boolF(ct))));
  };
  exports._searchValid = _searchValid;
