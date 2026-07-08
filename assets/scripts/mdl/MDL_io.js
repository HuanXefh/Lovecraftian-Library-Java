/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Handles read/write for some objects.
   * @module lovec/mdl/MDL_io
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ base ------------------------------ */


  /**
   * Writes or reads a string-number JavaScript native object.
   * @param {Writes|Reads} wr0rd
   * @param {Object<string, number>} obj
   * @return {Object<string, number>|unset}
   */
  const __objStrNum = function(wr0rd, obj) {
    return processData(
      wr0rd,

      wr => {
        let keys = Object.keys(obj);
        let i = 0, iCap = keys.iCap();
        wr.i(iCap);
        while(i < iCap) {
          wr.str(String(keys[i]));
          wr.f(Number(obj[keys[i]]));
          i++;
        };
      },

      rd => {
        let i = 0, iCap = rd.i();
        while(i < iCap) {
          let key = rd.str();
          obj[key] = rd.f();
          i++;
        };
        return obj;
      },
    );
  };
  exports.__objStrNum = __objStrNum;


  /**
   * Writes or reads a string-string JavaScript native object.
   * @param {Writes|Reads} wr0rd
   * @param {Object<string, string>} obj
   * @return {Object<string, string>|unset}
   */
  const __objStrStr = function(wr0rd, obj) {
    return processData(
      wr0rd,

      wr => {
        let keys = Object.keys(obj);
        let i = 0, iCap = keys.iCap();
        wr.i(iCap);
        while(i < iCap) {
          wr.str(String(keys[i]));
          wr.str(String(obj[keys[i]]));
          i++;
        };
      },

      rd => {
        let i = 0, iCap = rd.i();
        while(i < iCap) {
          let key = rd.str();
          obj[key] = rd.str();
          i++;
        };
        return obj;
      },
    );
  };
  exports.__objStrStr = __objStrStr;


  /**
   * Generic method to write or read an array of data.
   * @template T
   * @param {Writes|Reads} wr0rd
   * @param {Array<T>} xxxs
   * @param {function(Writes, T): void} wrFun
   * @param {(function(Reads): T)|unset} [rdFun] - Leave empty if two in one.
   * @return {Array<T>|unset}
   */
  const __xxxs = function(wr0rd, xxxs, wrFun, rdFun) {
    if(rdFun == null) rdFun = wrFun;
    return processData(
      wr0rd,

      wr => {
        let i = 0, iCap = xxxs.iCap();
        wr.i(iCap);
        while(i < iCap) {
          wrFun(wr, xxxs[i]);
          i++;
        };
      },

      rd => {
        let i = 0, iCap = rd.i();
        while(i < iCap) {
          xxxs[i] = rdFun(rd);
          i++;
        };
        return xxxs;
      },
    );
  };
  exports.__xxxs = __xxxs;


  /**
   * Writes or reads an array of integers.
   * @param {Writes|Reads} wr0rd
   * @param {Array<number>} ints
   * @return {Array<number>|unset}
   */
  const __ints = function(wr0rd, ints) {
    return __xxxs(
      wr0rd, ints,

      (wr, int) => wr.i(int),

      rd => rd.i(),
    );
  };
  exports.__ints = __ints;


  /**
   * Writes or reads an array of floats.
   * @param {Writes|Reads} wr0rd
   * @param {Array<number>} fs
   * @return {Array<number>|unset}
   */
  const __fs = function(wr0rd, fs) {
    return __xxxs(
      wr0rd, fs,

      (wr, f) => wr.f(f),

      rd => rd.f(),
    );
  };
  exports.__fs = __fs;


  /* <------------------------------ Arc ------------------------------ */


  /**
   * Writes or reads an Arc color.
   * @param {Writes|Reads} wr0rd
   * @param {Color|unset} [color]
   * @return {Color|unset}
   */
  const __color = function(wr0rd, color) {
    return processData(
      wr0rd,

      wr => wr.i(color.rgba8888()),

      rd => new Color(rd.i()),
    );
  };
  exports.__color = __color;


  /**
   * Writes or reads an array of Arc colors.
   * @param {Writes|Reads} wr0rd
   * @param {Array<Color>} colors
   * @return {Array<Color>|unset}
   */
  const __colors = function(wr0rd, colors) {
    return __xxxs(wr0rd, colors, __color);
  };
  exports.__colors = __colors;


  /**
   * Writes or reads an Arc 2D point.
   * @param {Writes|Reads} wr0rd
   * @param {Point2|unset} [pon2]
   * @return {Point2|unset}
   */
  const __pon2 = function(wr0rd, pon2) {
    return processData(
      wr0rd,

      wr => wr.i(pon2.pack()),

      rd => Point2.unpack(rd.i()),
    );
  };
  exports.__pon2 = __pon2;


  /**
   * Writes or reads an array of Arc 2D points.
   * @param {Writes|Reads} wr0rd
   * @param {Array<Point2>} pon2s
   * @return {Array<Point2>|unset}
   */
  const __pon2s = function(wr0rd, pon2s) {
    return __xxxs(wr0rd, pon2s, __pon2);
  };
  exports.__pon2s = __pon2s;


  /**
   * Writes or reads an Arc 2D vector.
   * @param {Writes|Reads} wr0rd
   * @param {Vec2|unset} [vec2]
   * @return {Vec2|unset}
   */
  const __vec2 = function(wr0rd, vec2) {
    return processData(
      wr0rd,

      wr => {
        wr.f(vec2.x);
        wr.f(vec2.y);
      },

      rd => new Vec2(rd.f(), rd.f()),
    );
  };
  exports.__vec2 = __vec2;


  /**
   * Writes or reads an array of Arc 2D vectors.
   * @param {Writes|Reads} wr0rd
   * @param {Array<Vec2>} vec2s
   * @return {Array<Vec2>|unset}
   */
  const __vec2s = function(wr0rd, vec2s) {
    return __xxxs(wr0rd, vec2s, __vec2);
  };
  exports.__vec2s = __vec2s;


  /**
   * Writes or reads an Arc 3D vector.
   * @param {Writes|Reads} wr0rd
   * @param {Vec3|unset} [vec3]
   * @return {Vec3|unset}
   */
  const __vec3 = function(wr0rd, vec3) {
    return processData(
      wr0rd,

      wr => {
        wr.f(vec3.x);
        wr.f(vec3.y);
        wr.f(vec3.z);
      },

      rd => new Vec3(rd.f(), rd.f(), rd.f()),
    );
  };
  exports.__vec3 = __vec3;


  /**
   * Writes or reads an array of Arc 3D vectors.
   * @param {Writes|Reads} wr0rd
   * @param {Array<Vec3>} vec3s
   * @return {Array<Vec3>|unset}
   */
  const __vec3s = function(wr0rd, vec3s) {
    return __xxxs(wr0rd, vec3s, __vec3);
  };
  exports.__vec3s = __vec3s;


  /* <------------------------------ content ------------------------------ */


  /**
   * Writes or reads a content.
   * @param {Writes|Reads} wr0rd
   * @param {UnlockableContent|unset} [ct]
   * @return {UnlockableContent|unset}
   */
  const __ct = function(wr0rd, ct) {
    return processData(
      wr0rd,

      wr => wr.str(ct == null ? "null" : ct.name),

      rd => MDL_content._ct(rd.str(), null, true),
    );
  };
  exports.__ct = __ct;


  /**
   * Writes or reads an array of contents.
   * Removes null values when read.
   * @param {Writes|Reads} wr0rd
   * @param {Array<UnlockableContent>} cts
   * @return {Array<UnlockableContent>|unset}
   */
  const __cts = function(wr0rd, cts) {
    let result = __xxxs(wr0rd, cts, __ct);
    if(result instanceof Array) {
      result.compact();
    };
    return result;
  };
  exports.__cts = __cts;


  /* <------------------------------ Lovec ------------------------------ */


  /**
   * Writes or reads a Lovec math matrix.
   * @param {Writes|Reads} wr0rd
   * @param {MathMatrix|unset} [mat]
   * @return {MathMatrix|unset}
   */
  const __lcMat = function(wr0rd, mat) {
    return processData(
      wr0rd,

      wr => {
        let fs = mat.toArray().cpy();
        fs.unshift(mat.getColAmt());
        __fs(wr, fs);
      },

      rd => {
        let fs = __fs(rd, []);
        let colAmt = fs.shift();
        return new MathMatrix(fs.chunk(colAmt, 0));
      },
    );
  };
  exports.__lcMat = __lcMat;
