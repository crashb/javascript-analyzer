
const COLORS = ["black","brown","red","orange","yellow","green","blue","violet","grey","white"];

module.exports = {
    value(input) {
        const numbers = input.map(color => COLORS.indexOf(color));
        return parseInt(numbers.join(""));
    }
}
