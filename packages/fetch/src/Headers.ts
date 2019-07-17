function isObject(value: any): value is Headers {
  return value && typeof (value as Headers).forEach === 'function';
}

function isMap(value: any): value is {[name: string]: string} {
  return value && typeof (value as Headers).forEach !== 'function';
}

export class Headers implements Headers, Iterable<[string, string]> {
  private headers: {[name: string]: string};

  public constructor(init?: Headers | string[][] | Record<string, string>) {
    this.headers = {};
    if (Array.isArray(init)) {
      init.forEach(row => {
        this.headers[row[0]] = row[1];
      });
    } else if (isObject(init)) {
      init.forEach((value, name) => {
        this.headers[name] = value;
      });
    } else if (isMap(init)) {
      this.headers = {...init};
    }
    return this;
  }

  public append(name: string, value: string): void {
    if (this.has(name)) {
      this.set(name, `${this.get(name)}, ${value}`);
    } else {
      this.set(name, value);
    }
  }

  public delete(name: string): void {
    delete this.headers[name];
  }

  public get(name: string): string | null {
    return this.has(name) ? this.headers[name] : null;
  }

  public has(name: string): boolean {
    return this.headers.hasOwnProperty(name);
  }

  public set(name: string, value: string): void {
    this.headers[name] = value;
  }

  public forEach(
    callbackfn: (value: string, key: string, parent: Headers) => void,
    thisArg?: any,
  ): void {
    Object.keys(this.headers).forEach(key =>
      callbackfn.call(thisArg, this.headers[key], key, this),
    );
  }

  public keys(): IterableIterator<string> {
    return Object.keys(this.headers)[Symbol.iterator]();
  }

  public values(): IterableIterator<string> {
    return Object.values(this.headers)[Symbol.iterator]();
  }

  public entries(): IterableIterator<[string, string]> {
    // FIXME:
    const keys = Object.keys(this.headers);
    const values = Object.values(this.headers);
    const step = 0;
    return {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        if (step + 1 === keys.length) {
          // using `as any` because https://github.com/Microsoft/TypeScript/issues/11375
          return {done: true, value: undefined} as any;
        } else {
          return {
            done: false,
            value: [keys[step], values[step]],
          };
        }
      },
    };
  }

  public [Symbol.iterator](): IterableIterator<[string, string]> {
    return this.entries();
  }
}
