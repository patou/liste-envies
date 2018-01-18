import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlipCardComponent } from './flip-card.component';
import {TestingModule} from "../testing/testing.module";

describe('FlipCardComponent', () => {
  let component: FlipCardComponent;
  let fixture: ComponentFixture<FlipCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlipCardComponent ],
      imports: [TestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlipCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
