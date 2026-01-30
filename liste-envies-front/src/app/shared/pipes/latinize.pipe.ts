import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "latinize",
  standalone: true
})
export class LatinizePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return value;
    }

    // Map des caractères accentués vers leurs équivalents latins
    const accentMap: { [key: string]: string } = {
      à: "a",
      á: "a",
      â: "a",
      ã: "a",
      ä: "a",
      å: "a",
      è: "e",
      é: "e",
      ê: "e",
      ë: "e",
      ì: "i",
      í: "i",
      î: "i",
      ï: "i",
      ò: "o",
      ó: "o",
      ô: "o",
      õ: "o",
      ö: "o",
      ø: "o",
      ù: "u",
      ú: "u",
      û: "u",
      ü: "u",
      ý: "y",
      ÿ: "y",
      ñ: "n",
      ç: "c",
      À: "A",
      Á: "A",
      Â: "A",
      Ã: "A",
      Ä: "A",
      Å: "A",
      È: "E",
      É: "E",
      Ê: "E",
      Ë: "E",
      Ì: "I",
      Í: "I",
      Î: "I",
      Ï: "I",
      Ò: "O",
      Ó: "O",
      Ô: "O",
      Õ: "O",
      Ö: "O",
      Ø: "O",
      Ù: "U",
      Ú: "U",
      Û: "U",
      Ü: "U",
      Ý: "Y",
      Ÿ: "Y",
      Ñ: "N",
      Ç: "C"
    };

    return value.replace(/[^\u0000-\u007E]/g, char => accentMap[char] || char);
  }
}
