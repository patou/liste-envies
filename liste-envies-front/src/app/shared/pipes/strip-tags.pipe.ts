import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "stripTags",
  standalone: true
})
export class StripTagsPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return "";
    return value.replace(/<[^>]*>/g, "");
  }
}
