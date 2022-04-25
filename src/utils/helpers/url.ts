/**
 *
 * @param val value to be checked
 * @returns boolean validated URL
 */
export const isURL = (val: string) => {
  const expression = /^(http:\/\/|https:\/\/)(?=.*[a-z0-9])/i;
  return expression.test(val);
};

/**
 *
 * @param url url to be parsed
 * @returns object parsed url
 */
export const parseQuery = (url: string): Record<string, string> => {
  const query = url.split('?')[1];
  return query ? query.split('&').reduce((acc, item) => {
    const [key, value] = item.split('=');
    acc[key] = value;
    return acc;
  }, {} as any) : {};
};
