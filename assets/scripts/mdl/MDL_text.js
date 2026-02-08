/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods to process texts.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const LIB_pinyin = require("lovec/lib/LIB_pinyin");


  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- text ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a space character or empty string, based on current locale.
   * ---------------------------------------- */
  const _space = function thisFun() {
    return thisFun.noSpaceLocales.includes(global.lovecUtil.prop.locale) ? "" : " ";
  }
  .setProp({
    noSpaceLocales: [
      "zh_CN", "zh_TW",
      "ja",
      "ko",
    ],
  });
  exports._space = _space;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a colon character based on current locale.
   * ---------------------------------------- */
  const _colon = function() {
    switch(global.lovecUtil.prop.locale) {
      case "zh_CN" : return "：";
      case "zh_TW" : return "：";
      case "ja" : return "：";
      case "ko" : return "：";
      default : return ": ";
    };
  };
  exports._colon = _colon;


  /* <---------- format (stat) ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns what you have seen a lot in the database, but in string.
   * Mostly used in {addStats(tb)} in abilities. It kinda sucks to write the format every time.
   *
   * Example:
   * _statText(Stat.range.localized(), 8, StatUnit.blocks.localized());    // Returns {"Range: 8 blocks"} with proper color
   * ---------------------------------------- */
  const _statText = function(strStat, strVal, strUnit) {
    let
      str1 = (strStat == null) ? "" : ("[lightgray]" + strStat + ": []"),
      str2 = (strVal == null) ? "" : strVal,
      str3 = (strUnit == null) ? "" : (" " + strUnit);

    return str1 + str2 + str3;
  };
  exports._statText = _statText;


  /* ----------------------------------------
   * NOTE:
   *
   * Used for multipliers with color.
   * By default, it's red for less than 100%, green for the other case.
   * Use {isRev} to invert that.
   * ---------------------------------------- */
  const _statText_mtp = function(strStat, mtp, isRev) {
    return _statText(
      strStat,
      (mtp < 1.0 ? (isRev ? "[green]" : "[red]") : (isRev ? "[red]" : "[green]")) + Strings.autoFixed(mtp * 100.0, 2) + "%[]",
    );
  };
  exports._statText_mtp = _statText_mtp;


  /* <---------- format ----------> */


  const _dmgText = function(dmg, dmgPerc) {
    let
      str1 = dmg == null || dmg < 0.0001 ? null : String(dmg.roundFixed(2)).color(Pal.remove),
      str2 = dmgPerc == null || dmgPerc < 0.0001 ? null : dmgPerc.perc().color(Pal.remove);

    if(str1 == null && str2 == null) {
      return "!ERR";
    } else {
      if(str1 == null) return str2;
      if(str2 == null) return str1;
      return str1 + " + ".color(Pal.remove) + str2;
    };
  };
  exports._dmgText = _dmgText;


  const _healText = function(healAmt, healPerc) {
    let
      str1 = healAmt == null || healAmt < 0.0001 ? null : String(healAmt.roundFixed(2)).color(Pal.heal),
      str2 = healPerc == null || healPerc < 0.0001 ? null : healPerc.perc().color(Pal.heal);

    if(str1 == null && str2 == null) {
      return "!ERR";
    } else {
      if(str1 == null) return str2;
      if(str2 == null) return str1;
      return str1 + " + ".color(Pal.heal) + str2;
    };
  };
  exports._healText = _healText;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts a list of strings to a tag string.
   *
   * Example:
   * _tagText(["chloric", "fluoric", "oxidative"]);    // Returns {"chloric; fluoric; oxidative; "}
   * ---------------------------------------- */
  const _tagText = function(strs, ignoreEmpty) {
    let str_fi = "";
    strs.forEachFast(str => str_fi += str + "; ");

    return (str_fi === "" && !ignoreEmpty) ? "!NOTAG" : str_fi;
  };
  exports._tagText = _tagText;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts a tag text back to an array of tags.
   * ---------------------------------------- */
  const tagTextToArr = function(text, contArr) {
    const arr = contArr != null ? contArr.clear() : [];
    if(text === "" || text === "!NOTAG") return arr;

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


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a list of keywords for search.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a list of content filter functions from the keywords.
   * Tags can be defined in {DB_misc.db["search"]["tag"]}.
   * ---------------------------------------- */
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
          if(tmpStr !== "") arr.push(ct => li[i + 1](ct, tmpStr));
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


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this content matches the search formula.
   * ---------------------------------------- */
  const _searchValid = function(ct, str) {
    return _searchBoolFs(_keywords(str)).every(boolF => boolF(ct));
  };
  exports._searchValid = _searchValid;
