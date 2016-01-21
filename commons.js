module.exports = {
    zeroPaddingGenerator: conditionalPaddingNumberWithZeroGenerator
};

function conditionalPaddingNumberWithZeroGenerator(condition) {
    return function pad(number) {
        return number < condition ? '0' + number : number;
    }
}
