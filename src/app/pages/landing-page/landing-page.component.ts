import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '../shared/translate.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  songName: string;
  artist: string;

  constructor(private router: Router, private http: HttpClient, private translateService: TranslateService) {}

  navigateToPlayground(): void {
    const payload = {
      songName: this.songName,
      artist: this.artist,
    };

    console.log('Song name:', this.songName);
    console.log('Artist:', this.artist);

    this.http.post('http://127.0.0.1:5000/get-lyrics', payload).subscribe({
      next: (response: any) => {
        console.log('Lyrics:', response.lyrics); // Adjust 'lyrics' if the key is different
        this.translateService.setSpokenLanguageText(response.lyrics);
        this.router.navigate(['/translate']);
      },
      error: error => {
        console.error('Error fetching lyrics:', error);
        this.router.navigate(['/translate']);
      },
    });
  }
}
