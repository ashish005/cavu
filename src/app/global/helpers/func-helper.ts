export class FuncHelper {
    public static stringify(value: unknown, depth = 3): string {
        const worker = (value: unknown, depth: number, padding = ''): string => {
            if (value === null || value === undefined) {
                return '';
            }

            if (typeof value === 'object') {
                const objectobject = '[object Object]';

                const result = value.toString();
                if (result !== objectobject)
                    return result;

                const keyValuePairs = [];
                let tab = `\n${padding}`;

                for (const key in value) {
                    if (Object.prototype.hasOwnProperty.call(value, key)) {
                        const keyEntry = value[key as keyof object];

                        if (typeof keyEntry !== 'function') {
                            const keyValue = depth > 0 ? worker(keyEntry, depth - 1, padding + ' ') : String(keyEntry);
                            keyValuePairs.push(`${tab}${key}: ${keyValue === objectobject ? '...' : keyValue}`);
                            tab = padding;
                        }
                    }
                }

                return keyValuePairs.join('\n');
            }

            return String(value);
        }

        return worker(value, depth); //.replace(/^\s+/, '');
    }

    public static JsonTryParse(value: string) {
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }

    public static GetObjectWithLoweredPropertyNames<T extends { [key: string]: unknown }>(obj: T) {
        return Object.keys(obj).reduce((newObj, k) => {
            newObj[k.toLowerCase()] = obj[k];
            return newObj;
        }, {} as { [key: string]: unknown }) as T;
    }

    public static TestIsObjectEmpty(obj: object) {
        for (const prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                return false;
            }
        }

        return true;
    }

    public static TestIsUndefined(value: unknown) {
        return typeof value === 'undefined';
    }

    public static TestIsString(value: unknown) {
        return typeof value === 'string';
    }

    public static uniqueId() {
        return this.randomNumber(1000000, 9000000).toString();
    }

    public static randomNumber(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public static searchArray(searchTerm: string, caseSensitive: boolean, ...values: unknown[]) {
        if (!searchTerm) {
            return true;
        }

        let filter = searchTerm.trim();
        let data = values.join();

        if (!caseSensitive) {
            filter = filter.toLowerCase();
            data = data.toLowerCase();
        }

        return data.indexOf(filter) !== -1;
    }

    public static moveArrayItem(array: unknown[], oldIndex: number, newIndex: number) {
        if (oldIndex < 0) {
            return;
        }

        if (newIndex < 0) {
            newIndex += array.length;
        }

        if (newIndex >= array.length) {
            let k = newIndex - array.length;
            while ((k--) + 1) {
                array.push(undefined);
            }
        }

        array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
    }

    public static removeNulls<T extends object | unknown[]>(item: T) {
        const isArray = Array.isArray(item);

        for (const k in item) {
            if (Object.prototype.hasOwnProperty.call(item, k)) {
                const propertyValue = item[k as keyof typeof item];

                if (propertyValue === null) {
                    isArray ? item.splice(+k, 1) : delete item[k as keyof typeof item];
                } else if (typeof propertyValue === 'object') {
                    FuncHelper.removeNulls(propertyValue);
                }

                if (isArray && item.length === +k) {
                    FuncHelper.removeNulls(item);
                }
            }
        }

        return item;
    }

    public static debounce(fn: (...params: unknown[]) => unknown, delay: number, immediate?: boolean) {
        let timer: ReturnType<typeof setTimeout> | undefined;

        return function (this: unknown, ...args: unknown[]) {
            if (timer === undefined && immediate) {
                fn.apply(this, args);
            }

            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
            return timer;
        }
    }

    public static groupBy(xs, key) {
        return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

    public static flatTreeStructure (members) {
        let children = [];
        const flattenMembers = members.map(m => {
            if (m.children && m.children.length) {
                children = [...children, ...m.children];
            }
            return m;
        });

        return flattenMembers.concat(children.length ? FuncHelper.flatTreeStructure(children) : children);
    };
}
