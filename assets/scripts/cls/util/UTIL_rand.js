/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- meta ----------> */


  /**
   * Utility class for handling random numbers.
   * @class
   */
  const UTIL_rand = newClass().initClass();


  const rands = [
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
    new Rand(), new Rand(), new Rand(), new Rand(), new Rand(),
  ];


  MDL_event._c_onInit(() => {
    MDL_net.__packetHandler(PacketModes.BOTH, "lovec-both-rand-sync", payload => {
      let args = unpackPayload(payload);
      UTIL_rand.getByInd(args[0]).setSeed(args[1]);
    });
  });


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


  /**
   * Gets a {@link Rand} by name, the name must be mapped to an index in {@link VAR.randInd}.
   * @param {string} name
   * @return {Rand}
   */
  UTIL_rand.get = function(name) {
    if(VAR.randInd[name] == null) throw new Error("Name ${1} is not used!".format(name));
    return UTIL_rand.getByInd(VAR.randInd[name]);
  };


  /**
  * Gets a {@link Rand} by index.
  * @param {number} ind
  * @return {Rand}
  */
  UTIL_rand.getByInd = function(ind) {
    if(ind >= rands.length) ERROR_HANDLER.throw("indexOutOfBound", ind, rands.length);
    return rands[ind];
  };


  /**
   * Syncs state of a {@link Rand}.
   * @param {number} ind
   * @param {number} seed
   * @return {void}
   */
  UTIL_rand.sync = function(ind, seed) {
    if(ind >= rands.length) ERROR_HANDLER.throw("indexOutOfBound", ind, rands.length);
    if(typeof seed !== "number") ERROR_HANDLER.throw("typeMismatch", seed, "number");

    MDL_net.sendPacket(
      PacketModes.BOTH, "lovec-both-rand-sync",
      packPayload([ind, seed]),
    );
  };


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/




module.exports = UTIL_rand;
