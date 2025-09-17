import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'youtube',
})
export class YouTubePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url: string) {
    const code = url.split('v=')[1];
    const link = 'https://www.youtube.com/embed/' + code;
    return this.sanitizer.bypassSecurityTrustResourceUrl(link);
  }
}
