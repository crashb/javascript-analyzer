const RESISTOR_VALUES = { 'black': '0', 'brown': '1', 'red': '2', 'orange': '3', 'yellow': '4', 'green': '5', 'blue': '6', 'violet':'7', 'grey':'8', 'white':'9' }

const value = (colors) => {
  return Number(RESISTOR_VALUES[colors[0]] + RESISTOR_VALUES[colors[1]]);
}

export { RESISTOR_VALUES, value};
