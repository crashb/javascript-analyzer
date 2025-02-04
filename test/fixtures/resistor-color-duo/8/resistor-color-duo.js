const RESISTOR_MAP = new Map([
  ["black", 0],
  ["brown", 1],
  ["red", 2],
  ["orange", 3],
  ["yellow", 4],
  ["green", 5],
  ["blue", 6],
  ["violet", 7],
  ["grey", 8],
  ["white", 9]
]);

export const value = arr => {
  let str = "";
  arr.forEach(element => {
    str += RESISTOR_MAP.get(element);
  });
  return Number.parseInt(str);
};
