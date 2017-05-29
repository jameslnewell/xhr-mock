class MockEvent {
  constructor(type) {
    this.type = type;
  }
}

export default class MockEventTarget {
  _listeners = {};

  addEventListener(type, listener) {
    //TODO: support once

    if (!this._listeners[type]) {
      this._listeners[type] = [];
    }

    if (this._listeners[type].indexOf(listener) === -1) {
      this._listeners[type].push(listener);
    }
  }

  removeEventListener(type, listener) {
    if (!this._listeners[type]) {
      return;
    }

    const index = this._listeners[type].indexOf(listener);
    if (index !== -1) {
      this._listeners[type].splice(index, 1);
    }
  }

  dispatchEvent(event) {
    if (typeof event === 'string') {
      event = {type: event};
    }

    //set the event target
    event.target = this;
    event.currentTarget = this;

    //call any built-in listeners
    if (this[`on${event.type}`]) {
      this[`on${event.type}`](event);
    }

    if (!this._listeners[event.type]) {
      return;
    }

    this._listeners[event.type].forEach(listener => listener.call(this, event));
  }
}
