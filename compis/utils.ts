import type { ContentTraverser } from './types';

/* Take a (mutable) anything and traverse all objects and arrays
 * Call callback on non-empty objects when filter returns true
 * Return nothing
 */
export const contentTraverser: ContentTraverser<any> = async ({
  obj,
  callback,
  filter,
  deep = true
}) => {
  if (Array.isArray(obj)) {
    const newArr = await Promise.all(
      obj.map((item) => contentTraverser({ obj: item, filter, callback, deep }))
    );
    return newArr;
  }
  if (typeof obj === 'object' && obj !== null) {
    if (obj instanceof Date) {
      return obj;
    }

    if (filter(obj)) {
      obj = await callback(obj);
    }

    obj = await Promise.all(
      Object.entries(obj).map(async ([key, item]) => {
        const newItem = await contentTraverser({
          obj: item,
          filter,
          callback,
          deep
        });
        return [key, newItem];
      })
    );

    return Object.fromEntries(obj);
  }
  return obj;
};
