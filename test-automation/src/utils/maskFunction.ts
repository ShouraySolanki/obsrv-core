import { maskEmail2 } from 'maskdata';
import { convertToObject } from 'typescript';

function mask(value: string, firstDigitCount: number, lastDigitCount: number): string {
    if (value.length <= firstDigitCount + lastDigitCount) {
        return '*'.repeat(value.length);
    } else {
        const maskedValue = (value.slice(0, firstDigitCount) + '*'.repeat(value.length - firstDigitCount - lastDigitCount) + value.slice(-lastDigitCount)).replace(/"/g, '');
        return maskedValue;
    }
}

const maskRatio = 0.35;
const emailPattern = /^(.+)@(\S+)$/;

export function maskField(value: string): string {
    if (value.length === 0) return value;

    if (emailPattern.test(value)) {
        return maskEmail2(value);
    } else {
        const openDigits = Math.ceil(value.length * maskRatio);
        const firstDigitCount = Math.floor(openDigits / 2);
        const lastDigitCount = openDigits - firstDigitCount;
        return mask(value, firstDigitCount, lastDigitCount);
    }
}