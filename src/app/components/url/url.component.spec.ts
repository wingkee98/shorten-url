import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';

import { UrlComponent } from './url.component';

describe('UrlComponent', () => {
  let component: UrlComponent;
  let fixture: ComponentFixture<UrlComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlComponent ],
      imports: [ HttpClientTestingModule, HttpClientModule,
        BrowserModule, FormsModule, ReactiveFormsModule ]
    })
    .compileComponents().then(() => {
      fixture = TestBed.createComponent(UrlComponent);
      component = fixture.componentInstance;  
      de = fixture.debugElement.query(By.css('form'));
      el = de.nativeElement;
    });
  }));

  beforeEach(() => {
    inject([HttpClient, HttpTestingController ],
      (http: HttpClient, backend: HttpTestingController) => {
      fixture = TestBed.createComponent(UrlComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  });

  it('should create Url Component', () => {
    expect(component).toBeTruthy();
  });

  it('should create Url Form Group', () => {
    expect(component.urlFormGroup).toBeTruthy();
  });

  it('should create Url Form Field', () => {
    expect(component.formFields).toBeTruthy();
  });

  it('form should be invalided', async(() => {
    component.urlFormGroup.controls['url'].setValue('');
    expect(component.urlFormGroup.valid).toBeFalsy();
  }));

  it('form should be valided', async(() => {
    component.urlFormGroup.controls['url'].setValue('Apple.com');
    expect(component.urlFormGroup.valid).toBeTruthy();
  }));
});
