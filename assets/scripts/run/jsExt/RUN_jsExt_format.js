/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods mostly used for formatting.
   */


/*
  ========================================
  Section: Definition (Number)
  ========================================
*/


  /**
   * To percentage string.
   * @param {number|unset} [deciAmt]
   * @return {string}
   */
  Number.prototype.perc = function(deciAmt) {
    return Strings.fixed((this * 100.0).roundFixed(tryVal(deciAmt, 2)), tryVal(deciAmt, 2)) + "%";
  };


  /**
   * To colored string.
   * @param {Color} color
   * @param {number|unset} [deciAmt]
   * @return {string}
   */
  Number.prototype.color = function(color, deciAmt) {
    return String(this.roundFixed(deciAmt)).color(color);
  };


  /**
   * Variant of {@link Number#perc} with color.
   * @param {number|unset} deciAmt
   * @param {Color|unset} overColor
   * @param {Color|unset} lessColor
   * @param {Color|unset} midColor
   * @param {number|unset} midTol
   * @return {string}
   */
  Number.prototype.percColor = function(deciAmt, overColor, lessColor, midColor, midTol) {
    return this.perc(deciAmt).color(
      this.fEqual(1.0, tryVal(midTol, 0.025)) ?
        tryVal(midColor, Pal.accent) :
        this > 1.0 ?
          tryVal(overColor, Pal.heal) :
          tryVal(lessColor, Pal.remove),
    );
  };


  /**
   * To scientific notation string.
   * @param {number} pow
   * @param {number|unset} [deciAmt]
   * @return {string}
   */
  Number.prototype.sci = function(pow, deciAmt) {
    return Strings.fixed(this * Math.pow(10, -pow), tryVal(deciAmt, 2)) + " × 10^" + pow;
  };


  /**
   * To UI format.
   * @return {string}
   */
  Number.prototype.ui = function() {
    let intNum = Math.round(this);
    let abs = Math.abs(Math.round(this));

    if(abs < 1000.0) {
      return String(this);
    } else if(abs < 1000000.0) {
      return intNum / 1000.0 + "k";
    } else if(abs < 1000000000.0) {
      return intNum / 1000000.0 + "m";
    } else if(abs < 1000000000000.0) {
      return intNum / 1000000000.0 + "b";
    } else if(abs < 1000000000000000.0) {
      return intNum / 1000000000000.0 + "t";
    };

    return "!LARGE";
  };


/*
  ========================================
  Section: Definition (String)
  ========================================
*/


  /**
   * Builds a multiline string with given strings, null will be ignored and array will be flattened.
   * <br> <ARGS> str1, str2, str3, ...
   * @return {string}
   */
  String.multiline = function() {
    let str_fi = "";
    let args = Array.from(arguments).flatten().filter(tmp => tmp != null);
    let i = 0, iCap = args.length;
    while(i < iCap) {
      str_fi += args[i];
      if(i !== iCap - 1) str_fi += "\n";
      i++;
    };

    return str_fi;
  };


  /**
   * Truncates this string if its length is larger than `len`.
   * @param {number} len
   * @param {string|unset} [suffix]
   * @return {string}
   * @example
   * // Returns "A test sentence..."
   * "A test sentence with six words.".truncate(15);
   */
  String.prototype.truncate = function(len, suffix) {
    let str = this.trim();
    return len >= str.length ?
      str :
      str.slice(0, len) + tryVal(suffix, "...");
  };


  /**
   * Replaces `"${1}"` or `"${1:someName}"` in the string with `str1`, and so on.
   * <br> <ARGS>: str1, str2, str3, ...
   * @return {string}
   */
  String.prototype.format = function() {
    let str = this, strTg;
    let i = 0, iCap = arguments.length;
    while(i < iCap) {
      strTg = "\\$\\{" + (i + 1) +"(\\:(\\w|\\d|\\s)+|)\\}";
      str = str.replace(new RegExp(strTg, "g"), arguments[i]);
      i++;
    };

    return str;
  };


  /**
   * Removes color markup.
   * @return {string}
   */
  String.prototype.plain = function() {
    // WTF why should it be strictly Java string
    return Strings.stripColors(new java.lang.String(this));
  };


  /**
   * Adds color markup.
   * @param {Color} color
   * @return {string}
   */
  String.prototype.color = function(color) {
    return "[#" + color.toString() + "]" + this + "[]";
  };


  /**
   * Colorful string made with markup abuse.
   * @param {Array<Color>|unset} [colors]
   * @param {number|unset} [scl]
   * @param {number|unset} [off]
   * @return {string}
   */
  String.prototype.rainbow = function(colors, scl, off) {
    let str = "";
    if(colors == null) colors = String.prototype.rainbow.defColors;
    if(scl == null) scl = 1.0;
    if(off == null) off = 0.0;

    let scl_fi = Mathf.clamp(scl, 0.0, 0.9999);
    let color, color_f, color_t;
    let frac, indBase, indCap;
    let i = 0, iCap = this.iCap();
    let jCap = colors.iCap();
    while(i < iCap) {
      frac = Mathf.mod(i / scl_fi / iCap + off, 1.0);
      indBase = Math.max(Math.floor(frac * jCap - 0.0001), 0);
      indCap = Math.max(Math.ceil(frac * jCap - 0.0001), 1);
      color_f = colors[indBase];
      color_t = colors[indCap >= jCap ? 0 : indCap];

      color = String.prototype.rainbow.tmpColor.set(color_f).lerp(color_t, frac * jCap - indBase);
      str += this[i].color(color);
      i++;
    };

    return str;
  };
  String.prototype.rainbow.tmpColor = new Color();
  String.prototype.rainbow.defColors = [Color.red, Color.orange, Color.yellow, Color.green, Color.cyan, Color.blue, Color.purple];


  /**
   * Makes first letter capitalized.
   * @return {string}
   */
  String.prototype.firstUpperCase = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };


  /**
   * Converts this string to camel case.
   * @return {string}
   */
  String.prototype.toCamelCase = function() {
    return this.replace(/^\w|[A-Z]|\b\w/g, (l, ind) => ind === 0 ? l.toLowerCase() : l.toUpperCase()).replace(/\s+/g, "").replace(/-/g, "");
  };


  /**
   * Converts this string to kebab case.
   * @return {string}
   */
  String.prototype.toKebabCase = function() {
    return this.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s+_]/g, "-").toLowerCase();
  };


  /**
   * Converts this string to snake case.
   * @return {string}
   */
  String.prototype.toSnakeCase = function() {
    return this.replace(/([a-zA-Z])(?=[A-Z])/g, "$1_").replace(/-/g, "_").toLowerCase();
  };
