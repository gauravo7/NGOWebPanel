
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: true
})
export class SafeUrlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(url: string): SafeResourceUrl {

    if (url.includes('youtu.be')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      url = 'https://www.youtube.com/embed/' + videoId;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
