import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

interface IFormFields {
  url: string
};

interface IResInfo {
  shortUrl: string,
  longUrl: string
};

@Component({
  selector: 'app-url',
  templateUrl: './url.component.html',
  styleUrls: ['./url.component.scss']
})
export class UrlComponent implements OnInit {
  private form: IFormFields;
  private resInfo: IResInfo;

  constructor(private http: HttpClient) {
    this.form = { url: '' };
    this.resInfo = { shortUrl: '', longUrl: '' };
  }

  ngOnInit() {}

  onKeyPress(event: KeyboardEvent): void {
    this.resInfo.shortUrl = '';
  }

  go(): void {
    console.log('clicking on go ' + this.form.url);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    this.http.post('/api', JSON.stringify({ url: this.form.url }), httpOptions).
    subscribe((responses:any) => {
      console.log(responses);

      if (responses.isInputLongUrl) {
        this.resInfo.shortUrl = responses.shortUrl;
      } else {
        this.resInfo.shortUrl = '';
        this.resInfo.longUrl = responses.longUrl;

        this.redirect();
      }
    });
  }

  private redirect(): void {
    setTimeout(() => {
      window.location.href = this.makeFullUrl(this.resInfo.longUrl);
    }, 2000);
  }

  private makeFullUrl(url: string): string {
    let pattern = /^((http|https):\/\/)/;
    let newUrl = url;

    if (!pattern.test(url)) {
      newUrl = 'http://' + url;
    }

    return newUrl;
  }
}
