const COLORS = ["black","brown","red","orange","yellow","green","blue","violet","grey","white"];

const colorCode = color => COLORS.indexOf(color);

export const value = (colors) => colorCode(colors[0])*10 + colorCode(colors[1]);