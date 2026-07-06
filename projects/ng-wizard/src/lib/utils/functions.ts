// https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6
// Merge a `source` object to a `target` recursively
export function merge<T extends object>(target: T, source: object): T {
    const src = source as Record<string, unknown>;
    const tgt = target as Record<string, unknown>;

    // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
    for (const key of Object.keys(source)) {
        if (src[key] instanceof Object && key in target) {
            Object.assign(src[key] as object, merge(tgt[key] as object, src[key] as object));
        }
    }

    // Join `target` and modified `source`
    Object.assign(target || {}, source);

    return target;
}