import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialTrainingComponent } from './initial-training.component';

describe('InitialTrainingComponent', () => {
  let component: InitialTrainingComponent;
  let fixture: ComponentFixture<InitialTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InitialTrainingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InitialTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
