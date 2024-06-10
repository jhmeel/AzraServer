import { EventEmitter } from "events";

class Emitter extends EventEmitter {
  static instance;

  constructor() {
    super();
  }
  static getInstance() {
    if (!Emitter.instance) {
      Emitter.instance = new EventEmitter();
    }
    return Emitter.instance;
  }
}

export default Emitter;
