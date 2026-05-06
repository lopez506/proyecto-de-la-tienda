import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CobroPage } from './cobro.page';

describe('CobroPage', () => {
  let component: CobroPage;
  let fixture: ComponentFixture<CobroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CobroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
