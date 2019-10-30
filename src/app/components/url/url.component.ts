import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  urlFormGroup: FormGroup;
  formFields: IFormFields;
  resInfo: IResInfo;

  constructor(private http: HttpClient) {
    this.formFields = { url: '' };
    this.resInfo = { shortUrl: '', longUrl: '' };
    this.createFormGroup();
  }

  ngOnInit() {}

  onKeyPress(event: KeyboardEvent): void {
    this.resInfo.shortUrl = '';
  }

  go(): void {
    console.log('clicking on go ' + this.formFields.url);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    this.http.post('/api', JSON.stringify({ url: this.formFields.url }), httpOptions).
    subscribe((responses:any) => {
      console.log(responses);

      this.resInfo.shortUrl = responses.shortUrl;
    });
  }

  private createFormGroup(): void {
    this.urlFormGroup = new FormGroup({
      'url': new FormControl(this.formFields.url, [Validators.required])
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
