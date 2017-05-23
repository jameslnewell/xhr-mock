/**
 * An EventTarget object
 * @constructor
 */
function MockEventTarget() {
  this._eventListeners = [];
}


/**
 * Trigger an event
 * @param   {String} event
 * @param   {Object} eventDetails
 * @returns {MockEventTarget}
 */
MockEventTarget.prototype.trigger = function(event, eventDetails) {
  for (var x = 0; x < this._eventListeners.length; x++) {
    var eventListener = this._eventListeners[x];

    if (eventListener.event === event) {
      var eventListenerDetails = eventDetails || {};
      eventListenerDetails.currentTarget = this;
      eventListenerDetails.type = event;
      eventListener.listener.call(this, eventListenerDetails);
    }
  }

  return this;
};

MockEventTarget.prototype.addEventListener = function(event, listener) {
  this._eventListeners.push({
    event: event,
    listener: listener
  });
};

MockEventTarget.prototype.removeEventListener = function(event, listener) {
  var currentIndex = 0;

  while (currentIndex < this._eventListeners.length) {
    var eventListener = this._eventListeners[currentIndex];
    if (eventListener.event === event && eventListener.listener === listener) {
      this._eventListeners.splice(currentIndex, 1);
    } else {
      currentIndex++;
    }
  }
};

module.exports = MockEventTarget;
