/* <---------- import ----------> */


/* <---------- meta ----------> */


/**
 * Lovec version of {@link EventType}.
 * @class
 * @param {string} nm
 */
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
      TRIGGER.mapChange.fire(this.tmpMap);
    };
  }, "eventTrigger: [$1]".format(nm));
};


const insNms = [];


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_eventTrigger.prototype;


/**
 * Adds a listener to the trigger.
 * These listeners will be cleared on map change.
 * @param {Function} listener
 * @param {number|string|unset} [id]
 * @param {boolean|unset} [shouldOverwrite]
 * @return {this}
 */
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


/**
 * Adds a global listener which won't be removed on map change.
 * @param {Function} listener
 * @return {this}
 */
ptp.addGlobalListener = function(listener) {
  this.glbListeners.push(listener);

  return this;
};


/**
 * Adds a one-time listener.
 * @param {Function} listener
 * @return {this}
 */
ptp.addOnceListener = function(listener) {
  this.onceListeners.push(listener);

  return this;
};


/**
 * Removes a listener by ID.
 * Only regular listeners can be removed.
 * @param {number|string} id
 * @return {this}
 */
ptp.removeListener = function(id) {
  this.listeners.remove(this.idListenerMap.remove(id));

  return this;
};


/**
 * Removes all regular listeners from the trigger.
 * @return {this}
 */
ptp.clearListener = function() {
  this.listeners.clear();
  this.idListenerMap.clear();

  return this;
};


/**
 * Removes all one-time listeners from the trigger.
 * @return {this}
 */
ptp.clearOnceListener = function() {
  this.onceListeners.clear();

  return this;
};


/**
 * Calls all listeners of the trigger with the arguments passed down.
 * @return {void}
 */
ptp.fire = function() {
  this.listeners.forEachFast(listener =>listener.apply(null, arguments));
  this.glbListeners.forEachFast(listener => listener.apply(null, arguments));
  this.onceListeners.forEachFast(listener => listener.apply(null, arguments));

  this.clearOnceListener();
};


module.exports = CLS_eventTrigger;
