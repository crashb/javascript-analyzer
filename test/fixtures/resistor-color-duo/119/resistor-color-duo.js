const COLORS = ["black","brown","red","orange","yellow","green","blue","violet","grey","white"];

export const value = (colors) => parseInt(COLORS.indexOf(colors[0]).toString() + COLORS.indexOf(colors[1]).toString());