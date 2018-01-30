import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WishEditComponent } from './wish-edit.component';

describe('WishEditComponent', () => {
  let component: WishEditComponent;
  let fixture: ComponentFixture<WishEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
