module.exports = {
  create() {
    this.events = {};
    this.on = (event, callback) => {
      if (!callback) throw "Expected a function as the second argument";

      if (this.events[event]) {
        if (this.events[event].includes(callback)) {
          return;
        }
        this.events[event].push(callback);
        return this.events;
      }
      return (this.events[event] = [callback]);
    };
    this.off = (event, callback) => {
      if (!this.events[event]) return;
      const getIndex = this.events[event].indexOf(callback);

      return this.events[event].splice(getIndex, 1);
    };
    this.emit = (event, data) => {
      if (!this.events[event] || this.events[event].length == 0) return;
      this.events[event].forEach((callback) =>
        callback({ ...data, type: "loading" })
      );
      return;
    };
    this.once = () => {};
    this.race = () => {};

    return this;
  }
};
