export const truncate = (str: string, n: number) => {
  str = str || "";
  return str.length > n ? str.substr(0, n) + "..." : str;
};
