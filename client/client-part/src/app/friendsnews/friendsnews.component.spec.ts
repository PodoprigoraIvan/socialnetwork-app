import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsnewsComponent } from './friendsnews.component';

describe('FriendsnewsComponent', () => {
  let component: FriendsnewsComponent;
  let fixture: ComponentFixture<FriendsnewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendsnewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendsnewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
