import { MODE } from "@/util/global.constants";

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
    if (MODE === "development") {
      this.initialize();
    }
  }

  private initialize() {
    this.assert = console.assert.bind(this);
    this.clear = console.clear.bind(this);
    this.count = console.count.bind(this, this.context);
    this.countReset = console.countReset.bind(this, this.context);
    this.debug = console.debug.bind(this, this.context);
    this.dir = console.dir.bind(this, this.context);
    this.dirxml = console.dirxml.bind(this, this.context);
    this.error = console.error.bind(this, this.context);
    this.group = console.group.bind(this, this.context);
    this.groupCollapsed = console.groupCollapsed.bind(this, this.context);
    this.groupEnd = console.groupEnd.bind(this);
    this.info = console.info.bind(this, this.context);
    this.log = console.log.bind(this, this.context);
    this.table = console.table.bind(this, this.context);
    this.time = console.time.bind(this, this.context);
    this.timeEnd = console.timeEnd.bind(this, this.context);
    this.timeLog = console.timeLog.bind(this, this.context);
    this.timeStamp = console.timeStamp.bind(this, this.context);
    this.trace = console.trace.bind(this, this.context);
    this.warn = console.warn.bind(this, this.context);
  }

  setContext(context: string) {
    this.context = context;
    this.initialize();
  }
}
