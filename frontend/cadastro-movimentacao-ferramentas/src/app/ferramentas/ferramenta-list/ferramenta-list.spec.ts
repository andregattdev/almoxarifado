import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FerramentaLisst } from './ferramenta-list';

describe('FerramentaLisst', () => {
  let component: FerramentaLisst;
  let fixture: ComponentFixture<FerramentaLisst>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FerramentaLisst],
    }).compileComponents();

    fixture = TestBed.createComponent(FerramentaLisst);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
