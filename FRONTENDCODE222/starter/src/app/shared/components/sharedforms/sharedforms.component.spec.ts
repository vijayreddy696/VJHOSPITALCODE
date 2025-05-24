import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedformsComponent } from './sharedforms.component';

describe('SharedformsComponent', () => {
  let component: SharedformsComponent;
  let fixture: ComponentFixture<SharedformsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedformsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
