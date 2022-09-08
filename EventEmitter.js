class EventEmitter {
  static emitter = null;
  constructor() {
    this.subs = this.subs ?? new Map();
    window.addEventListener("message", this.handleMessage.bind(this));
  }

  subscribe(type, cb) {
    if (!this.subs.has(type)) {
      this.subs.set(type, [cb]);
    } else {
      this.subs.get(type).push(cb);
    }
  }

  emit(type) {
    window.parent.postMessage({ type }); // 这里的 emit 跟通常的 emit 不太一样，需要通知主工程进行消息分发
  }

  remove(type, cb) {
    if (this.subs.has(type)) {
      const index = this.subs.get(type).indexOf(cb);
      if (~index) {
        this.subs.get(type).splice(index, 1);
      }
      if (!this.subs.get(type).length) {
        this.subs.delete(type);
      }
    }
  }

  once(type, cb) {
    // 只触发一次的发布订阅
    const that = this;
    function callback() {
      cb(...arguments);
      that.remove(type, callback);
    }
    this.subscribe(type, callback);
  }

  handleMessage(event) {
    const {data: {type}} = event;
    if (this.subs.has(type)) {
      this.subs.get(type).forEach(sub => {
        sub([...arguments].slice(1));
      });
    }
  }

  static getEmitter() {
    if (!EventEmitter.emitter) {
      EventEmitter.emitter = new EventEmitter();
    }
    return EventEmitter.emitter;
  }
}
export default EventEmitter.getEmitter();