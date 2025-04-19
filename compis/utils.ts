import type { ContentTraverser } from './types';

/* Take an anything and traverse all objects and arrays.
 * Call callback on non-empty objects when filter returns true.
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

/* Return the longest common path in a list of paths
 */
export const inferCommonPath = (pathList: string[]) => {
  // If no component, return empty string
  if (pathList.length === 0) {
    return '';
  }

  // If only one component, let its path be root
  if (pathList.length === 1) {
    const str = pathList[0];
    return str.slice(0, str.lastIndexOf('/') + 1);
  }

  // If two or more components, reduce to their longest common path
  const componentRoot = pathList.reduce((prefix, path) => {
    const prefixArr = prefix.split('/');
    const pathArr = path.split('/');
    const length = Math.min(prefixArr.length, pathArr.length);

    let i = 0;
    while (i < length && prefixArr[i] === pathArr[i]) i++;

    if (i === 0) {
      return '';
    }

    const slice = prefixArr.slice(0, i).join('/').length;

    return prefix.slice(0, slice + 1);
  });
  return componentRoot;
};

/* Trim a string from both ends.
 */
export const trimKey = (
  obj: Record<string, any>,
  start: number,
  end: number
) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [
      key.slice(start, key.length - end),
      val
    ])
  );
};
