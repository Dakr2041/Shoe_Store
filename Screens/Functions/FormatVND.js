export function formatVND(number) {
    if (isNaN(number)) {
        throw new Error('Invalid input: Please provide a valid number.');
    }
    const numberAsFloat = parseFloat(number);

    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
    });

    return formatter.format(numberAsFloat);
}