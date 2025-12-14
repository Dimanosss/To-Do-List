import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoComponent } from './todo';
import { TodoService } from './todo.service';
import { of } from 'rxjs';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let todoService: jasmine.SpyObj<TodoService>;

  beforeEach(async () => {
    const todoServiceSpy = jasmine.createSpyObj('TodoService', [
      'getTodos',
      'addTodo',
      'updateTodo',
      'deleteTodo',
      'toggleTodo'
    ]);

    await TestBed.configureTestingModule({
      imports: [TodoComponent],
      providers: [
        { provide: TodoService, useValue: todoServiceSpy }
      ]
    }).compileComponents();

    todoService = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
    todoService.getTodos.and.returnValue(of([]));

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a todo', () => {
    component.newTodoTitle = 'Test Todo';
    component.addTodo();
    expect(todoService.addTodo).toHaveBeenCalledWith('Test Todo');
  });

  it('should toggle a todo', () => {
    component.toggleTodo(1);
    expect(todoService.toggleTodo).toHaveBeenCalledWith(1);
  });

  it('should delete a todo', () => {
    component.deleteTodo(1);
    expect(todoService.deleteTodo).toHaveBeenCalledWith(1);
  });
});

