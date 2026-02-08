/* ----------------------------------------
 * NOTE:
 *
 * The Lovec version of {EventType}.
 * ---------------------------------------- */


/* <---------- import ----------> */


const MDL_event = require("lovec/mdl/MDL_event");


/* <---------- meta ----------> */


const CLS_eventTrigger = newClass().initClass();


CLS_eventTrigger.prototype.init = function(nm) {
  this.name = registerUniqueName(nm, insNms, "event trigger");
  this.listeners = [];
  this.glbListeners = [];
  this.onceListeners = [];
  this.idListenerMap = new ObjectMap();

  this.tmpMap = "";

  MDL_event._c_onUpdate(() => {
    if(this.tmpMap !== global.lovecUtil.fun._mapCur()) {
      this.tmpMap = global.lovecUtil.fun._mapCur();
      this.clearListener();
      this.clearOnceListener();
      global.lovec.trigger.mapChange.fire(this.tmpMap);
    };
  }, "eventTrigger: [$1]".format(nm));
};


const insNms = [];


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_eventTrigger.prototype;


/* ----------------------------------------
 * NOTE:
 *
 * Adds a listener to the trigger.
 * Will be cleared on map change.
 * ---------------------------------------- */
ptp.addListener = function(listener, id, shouldOverwrite) {
  if(id == null) {
    this.listeners.push(listener);
  } else {
    if(this.idListenerMap.containsKey(id)) {
      if(shouldOverwrite) {
        this.listeners.remove(this.idListenerMap.get(id));
        this.listeners.push(listener);
        this.idListenerMap.put(id, listener);
      };
    } else {
      this.listeners.push(listener);
      this.idListenerMap.put(id, listener);
    };
  };

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Adds a global listener which cannot be removed by ID.
 * ---------------------------------------- */
ptp.addGlobalListener = function(listener) {
  this.glbListeners.push(listener);

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Adds a one-time listener which cannot be removed by ID.
 * ---------------------------------------- */
ptp.addOnceListener = function(listener) {
  this.onceListeners.push(listener);

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Removes a listener from the trigger, which should be added with id given beforehand.
 * ---------------------------------------- */
ptp.removeListener = function(id) {
  this.listeners.remove(this.idListenerMap.remove(id));

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Removes all listeners from the trigger.
 * ---------------------------------------- */
ptp.clearListener = function() {
  this.listeners.clear();
  this.idListenerMap.clear();

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Removes all one-time listeners from the trigger.
 * ---------------------------------------- */
ptp.clearOnceListener = function() {
  this.onceListeners.clear();

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Calls all listeners of the trigger with the arguments passed down.
 * ---------------------------------------- */
ptp.fire = function() {
  this.listeners.forEachFast(listener =>listener.apply(null, arguments));
  this.glbListeners.forEachFast(listener => listener.apply(null, arguments));
  this.onceListeners.forEachFast(listener => listener.apply(null, arguments));

  this.clearOnceListener();
};


module.exports = CLS_eventTrigger;
