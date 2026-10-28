import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuncionariosList } from './funcionarios-list';

describe('FuncionariosList', () => {
  let component: FuncionariosList;
  let fixture: ComponentFixture<FuncionariosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionariosList],
    }).compileComponents();

    fixture = TestBed.createComponent(FuncionariosList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
