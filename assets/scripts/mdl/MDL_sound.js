/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Handles sound effect.
   * @module lovec/mdl/MDL_sound
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ base ------------------------------ */


  /**
   * Plays a sound.
   * @param {SoundGn} se_gn
   * @return {void}
   */
  const play = function(se_gn) {
    if(se_gn == null) return;

    fetchSound(se_gn).play();
  }
  .setAnno("non-headless");
  exports.play = play;


  /**
   * Variant of {@link play} for server side.
   * @param {SoundGn} se_gn
   * @param {number|unset} [vol]
   * @param {number|unset} [pitch]
   * @param {number|unset} [offPitch]
   * @return {void}
   */
  const play_server = function(se_gn, vol, pitch, offPitch) {
    if(se_gn == null) return;
    if(vol == null) vol = 1.0;
    if(pitch == null) pitch = 1.0;
    let pitch_fi = (offPitch == null) ? pitch : (pitch + Mathf.range(offPitch));

    Call.sound(fetchSound(se_gn), vol, pitch_fi, 1.0);
  }
  .setAnno("non-headless")
  .setAnno("server");
  exports.play_server = play_server;


  /**
   * Plays a sound at (x, y).
   * @param {number} x
   * @param {number} y
   * @param {SoundGn} se_gn
   * @param {number|unset} [vol]
   * @param {number|unset} [pitch]
   * @param {number|unset} [offPitch]
   * @return {void}
   */
  const playAt = function(x, y, se_gn, vol, pitch, offPitch) {
    if(se_gn == null) return;
    if(vol == null) vol = 1.0;
    if(pitch == null) pitch = 1.0;
    let pitch_fi = (offPitch == null) ? pitch : (pitch + Mathf.range(offPitch));

    fetchSound(se_gn).at(x, y, pitch_fi, vol);
  }
  .setAnno("non-headless");
  exports.playAt = playAt;


  /* <------------------------------ sound ------------------------------ */


  /**
   * Payload drop sound.
   * @param {number} x
   * @param {number} y
   * @param {string|Block|UnitType|null} ct_gn
   * @return {void}
   */
  const payloadDrop = function(x, y, ct_gn) {
    let ct = MDL_content.getCt(ct_gn, null, true);
    if(ct == null) return;

    playAt(
      x, y,
      ct instanceof Block ?
        ct.placeSound :
        ct.hitSize <= 12.0 ?
          Sounds.payloadDrop1 :
          ct.hitSize <= 20.0 ?
            Sounds.payloadDrop2 :
            Sounds.payloadDrop3,
      1.0, 1.0, 0.1,
    );
  }
  .setAnno("non-headless");
  exports.payloadDrop = payloadDrop;
