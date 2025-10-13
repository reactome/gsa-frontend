import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'species',
    standalone: false
})
export class SpeciesPipe implements PipeTransform {

  transform(value: string): unknown {
    const words = value.split(' ');
    return words[0].charAt(0).toUpperCase() + '. ' + words.slice(1).join(' ');
  }

}
