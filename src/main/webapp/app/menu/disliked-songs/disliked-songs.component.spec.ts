import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DislikedSongsComponent } from './disliked-songs.component';


describe('DislikedSongsComponent', () => {
  let component: DislikedSongsComponent;
  let fixture: ComponentFixture<DislikedSongsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DislikedSongsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DislikedSongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // @ts-ignore
    expect(component).toBeTruthy();
  });
});
