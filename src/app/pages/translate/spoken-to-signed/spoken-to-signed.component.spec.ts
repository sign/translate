import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {SpokenToSignedComponent} from './spoken-to-signed.component';
import {SignwritingComponent} from '../signwriting/signwriting.component';
import {TextToSpeechComponent} from '../../../components/text-to-speech/text-to-speech.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('SpokenToSignedComponent', () => {
  let component: SpokenToSignedComponent;
  let fixture: ComponentFixture<SpokenToSignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SpokenToSignedComponent,
        SignwritingComponent,
        TextToSpeechComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpokenToSignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('empty text should set pose to null', fakeAsync(() => {
    component.pose = '';

    component.text.patchValue('');
    tick(500);

    expect(component.pose).toBeNull();
  }));

  it('non-empty text should set pose to a url', fakeAsync(() => {
    component.pose = null;

    component.text.patchValue('test');
    tick(500);

    expect(component.pose).toContain('http');
  }));
});
