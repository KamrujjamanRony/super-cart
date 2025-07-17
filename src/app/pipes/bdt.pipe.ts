import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'bdt'
})
export class BdtPipe implements PipeTransform {
    transform(bdtValue: number, ...args: unknown[]): string {
        if (isNaN(bdtValue)) return '';
        return '৳ ' + bdtValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}