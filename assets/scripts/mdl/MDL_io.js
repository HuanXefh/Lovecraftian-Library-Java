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
  const objStrNum = function(wr0rd, obj) {
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
  exports.objStrNum = objStrNum;


  /**
   * Writes or reads a string-string JavaScript native object.
   * @param {Writes|Reads} wr0rd
   * @param {Object<string, string>} obj
   * @return {Object<string, string>|unset}
   */
  const objStrStr = function(wr0rd, obj) {
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
  exports.objStrStr = objStrStr;


  /**
   * Generic method to write or read an array of data.
   * @template T
   * @param {Writes|Reads} wr0rd
   * @param {Array<T>} xxxs
   * @param {function(Writes, T): void} wrFun
   * @param {(function(Reads): T)|unset} [rdFun] - Leave empty if two in one.
   * @return {Array<T>|unset}
   */
  const xxxs = function(wr0rd, xxxs, wrFun, rdFun) {
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
  exports.xxxs = xxxs;


  /**
   * Writes or reads an array of integers.
   * @param {Writes|Reads} wr0rd
   * @param {Array<number>} ints
   * @return {Array<number>|unset}
   */
  const ints = function(wr0rd, ints) {
    return xxxs(
      wr0rd, ints,

      (wr, int) => wr.i(int),

      rd => rd.i(),
    );
  };
  exports.ints = ints;


  /**
   * Writes or reads an array of floats.
   * @param {Writes|Reads} wr0rd
   * @param {Array<number>} fs
   * @return {Array<number>|unset}
   */
  const fs = function(wr0rd, fs) {
    return xxxs(
      wr0rd, fs,

      (wr, f) => wr.f(f),

      rd => rd.f(),
    );
  };
  exports.fs = fs;


  /* <------------------------------ Arc ------------------------------ */


  /**
   * Writes or reads an Arc color.
   * @param {Writes|Reads} wr0rd
   * @param {Color|unset} [color]
   * @return {Color|unset}
   */
  const color = function(wr0rd, color) {
    return processData(
      wr0rd,

      wr => wr.i(color.rgba8888()),

      rd => new Color(rd.i()),
    );
  };
  exports.color = color;


  /**
   * Writes or reads an array of Arc colors.
   * @param {Writes|Reads} wr0rd
   * @param {Array<Color>} colors
   * @return {Array<Color>|unset}
   */
  const colors = function(wr0rd, colors) {
    return xxxs(wr0rd, colors, color);
  };
  exports.colors = colors;


  /**
   * Writes or reads an Arc 2D point.
   * @param {Writes|Reads} wr0rd
   * @param {Point2|unset} [pon2]
   * @return {Point2|unset}
   */
  const pon2 = function(wr0rd, pon2) {
    return processData(
      wr0rd,

      wr => wr.i(pon2.pack()),

      rd => Point2.unpack(rd.i()),
    );
  };
  exports.pon2 = pon2;


  /**
   * Writes or reads an array of Arc 2D points.
   * @param {Writes|Reads} wr0rd
   * @param {Array<Point2>} pon2s
   * @return {Array<Point2>|unset}
   */
  const pon2s = function(wr0rd, pon2s) {
    return xxxs(wr0rd, pon2s, pon2);
  };
  exports.pon2s = pon2s;


  /**
   * Writes or reads an Arc 2D vector.
   * @param {Writes|Reads} wr0rd
   * @param {Vec2|unset} [vec2]
   * @return {Vec2|unset}
   */
  const vec2 = function(wr0rd, vec2) {
    return processData(
      wr0rd,

      wr => {
        wr.f(vec2.x);
        wr.f(vec2.y);
      },

      rd => new Vec2(rd.f(), rd.f()),
    );
  };
  exports.vec2 = vec2;


  /**
   * Writes or reads an array of Arc 2D vectors.
   * @param {Writes|Reads} wr0rd
   * @param {Array<Vec2>} vec2s
   * @return {Array<Vec2>|unset}
   */
  const vec2s = function(wr0rd, vec2s) {
    return xxxs(wr0rd, vec2s, vec2);
  };
  exports.vec2s = vec2s;


  /**
   * Writes or reads an Arc 3D vector.
   * @param {Writes|Reads} wr0rd
   * @param {Vec3|unset} [vec3]
   * @return {Vec3|unset}
   */
  const vec3 = function(wr0rd, vec3) {
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
  exports.vec3 = vec3;


  /**
   * Writes or reads an array of Arc 3D vectors.
   * @param {Writes|Reads} wr0rd
   * @param {Array<Vec3>} vec3s
   * @return {Array<Vec3>|unset}
   */
  const vec3s = function(wr0rd, vec3s) {
    return xxxs(wr0rd, vec3s, vec3);
  };
  exports.vec3s = vec3s;


  /* <------------------------------ content ------------------------------ */


  /**
   * Writes or reads a content.
   * @param {Writes|Reads} wr0rd
   * @param {UnlockableContent|unset} [ct]
   * @return {UnlockableContent|unset}
   */
  const ct = function(wr0rd, ct) {
    return processData(
      wr0rd,

      wr => wr.str(ct == null ? "null" : ct.name),

      rd => MDL_content.getCt(rd.str(), null, true),
    );
  };
  exports.ct = ct;


  /**
   * Writes or reads an array of contents.
   * Removes null values when read.
   * @param {Writes|Reads} wr0rd
   * @param {Array<UnlockableContent>} cts
   * @return {Array<UnlockableContent>|unset}
   */
  const cts = function(wr0rd, cts) {
    let result = xxxs(wr0rd, cts, ct);
    if(result instanceof Array) {
      result.compact();
    };
    return result;
  };
  exports.cts = cts;


  /* <------------------------------ Lovec ------------------------------ */


  /**
   * Writes or reads a Lovec math matrix.
   * @param {Writes|Reads} wr0rd
   * @param {MathMatrix|unset} [mat]
   * @return {MathMatrix|unset}
   */
  const lcMat = function(wr0rd, mat) {
    return processData(
      wr0rd,

      wr => {
        let fs = mat.toArray().cpy();
        fs.unshift(mat.getColAmt());
        fs(wr, fs);
      },

      rd => {
        let fs = fs(rd, []);
        let colAmt = fs.shift();
        return new MathMatrix(fs.chunk(colAmt, 0));
      },
    );
  };
  exports.lcMat = lcMat;
