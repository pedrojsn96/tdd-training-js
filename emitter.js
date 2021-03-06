module.exports = {
  create() {
    this.events = {};
    this.cancel = (event, callback) => {
      const getIndex = this.events[event].indexOf(callback);
      this.events[event].splice(getIndex, 1);
    };
    this.on = (event, callback) => {
      if (!callback) throw "Expected a function as the second argument";

      if (this.events[event]) {
        if (this.events[event].includes(callback)) {
          return () => this.cancel(event, callback);
        }
        this.events[event].push(callback);
        return () => this.cancel(event, callback);
      }
      this.events[event] = [callback];
      return () => this.cancel(event, callback);
    };
    this.off = (event, callback) => {
      if (!this.events[event]) return this;
      const getIndex = this.events[event].indexOf(callback);

      this.events[event].splice(getIndex, 1);
      return this;
    };
    this.emit = (event, data) => {
      if (!this.events[event] || this.events[event].length == 0) return this;
      this.events[event].forEach((callback) =>
        callback({ ...data, type: "loading" })
      );
      return;
    };
    this.once = (event, callback) => {
      this.events[event] = this.events[event] || [];
      const onceWrapper = () => {
        callback();
        this.off(event, onceWrapper);
      };

      this.events[event].push(onceWrapper);
      return () => this.cancel(event, callback);
    };
    this.race = () => {};

    return this;
  }
};
