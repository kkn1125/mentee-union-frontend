import { MODE } from "@/util/global.constants";
import { timeFormat } from "@/util/tool";

export default class Logger implements Console {
  private context: string = "system";

  assert: (condition?: boolean | undefined, ...data: any[]) => void = () => {};

  clear: () => void = () => {};

  count: (label?: string | undefined) => void = () => {};

  countReset: (label?: string | undefined) => void = () => {};

  debug: (message: string | unknown, ...data: any[]) => void = () => {};

  dir: (item?: any, options?: any) => void = () => {};

  dirxml: (...data: any[]) => void = () => {};

  error: (message: string | unknown, ...data: any[]) => void = () => {};

  group: (message: string | unknown, ...data: any[]) => void = () => {};

  groupCollapsed: (message: string | unknown, ...data: any[]) => void =
    () => {};

  groupEnd: () => void = () => {};

  info: (message: string | unknown, ...data: any[]) => void = () => {};

  log: (message: string | unknown, ...data: any[]) => void = () => {};

  table: (tabularData?: any, properties?: string[] | undefined) => void =
    () => {};

  time: (label?: string | undefined) => void = () => {};

  timeEnd: (label?: string | undefined) => void = () => {};

  timeLog: (label?: string | undefined, ...data: any[]) => void = () => {};

  timeStamp: (label?: string | undefined) => void = () => {};

  trace: (message: string | unknown, ...data: any[]) => void = () => {};

  warn: (message: string | unknown, ...data: any[]) => void = () => {};

  constructor(context?: string) {
    if (context) {
      this.context = context;
    }
    if (MODE !== "production") {
      this.initialize();
    }
  }

  now() {
    const timestamp = timeFormat(new Date(), "HH:mm:ss.SSS");
    return "[ " + timestamp + " ]";
  }

  private initialize() {
    Object.defineProperties(this, {
      log: {
        get() {
          return console.log.bind(this, "🌱", this.now(), this.context);
        },
      },
      debug: {
        get() {
          return console.debug.bind(this, "🐛", this.now(), this.context);
        },
      },
      assert: {
        get() {
          return console.assert.bind(this);
        },
      },
      clear: {
        get() {
          return console.clear.bind(this);
        },
      },
      count: {
        get() {
          return console.count.bind(this, this.context);
        },
      },
      countReset: {
        get() {
          return console.countReset.bind(this, this.context);
        },
      },
      dir: {
        get() {
          return console.dir.bind(this, this.context);
        },
      },
      dirxml: {
        get() {
          return console.dirxml.bind(this, this.context);
        },
      },
      error: {
        get() {
          return console.error.bind(this, "🚨", this.now(), this.context);
        },
      },
      group: {
        get() {
          return console.group.bind(this, this.context);
        },
      },
      groupCollapsed: {
        get() {
          return console.groupCollapsed.bind(this, this.context);
        },
      },
      groupEnd: {
        get() {
          return console.groupEnd.bind(this);
        },
      },
      info: {
        get() {
          return console.info.bind(this, "📝", this.now(), this.context);
        },
      },
      table: {
        get() {
          return console.table.bind(this, this.context);
        },
      },
      time: {
        get() {
          return console.time.bind(this, this.context);
        },
      },
      timeEnd: {
        get() {
          return console.timeEnd.bind(this, this.context);
        },
      },
      timeLog: {
        get() {
          return console.timeLog.bind(this, this.context);
        },
      },
      timeStamp: {
        get() {
          return console.timeStamp.bind(this, this.context);
        },
      },
      trace: {
        get() {
          return console.trace.bind(this, this.context);
        },
      },
      warn: {
        get() {
          return console.warn.bind(this, "⚠️", this.now(), this.context);
        },
      },
    });
  }

  setContext(context: string) {
    if (MODE !== "production") {
      this.context = context;
      this.initialize();
    }
  }
}
