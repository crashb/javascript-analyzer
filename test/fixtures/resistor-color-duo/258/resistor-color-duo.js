const COLORS = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'grey', 'white'];

export const value = colors => {
  return parseInt(`${COLORS.indexOf(colors[0])}${COLORS.indexOf(colors[1])}`, 10);
}