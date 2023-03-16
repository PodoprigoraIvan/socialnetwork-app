import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeoplesearchComponent } from './peoplesearch.component';

describe('PeoplesearchComponent', () => {
  let component: PeoplesearchComponent;
  let fixture: ComponentFixture<PeoplesearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeoplesearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeoplesearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
