import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from './todo';

/**
 * Todo Service
 * Manages todo items using LocalStorage for persistence
 * Simulates backend behavior using RxJS Observables
 */
@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly STORAGE_KEY = 'angular-todos';
  private todosSubject: BehaviorSubject<Todo[]>;
  public todos$: Observable<Todo[]>;

  constructor() {
    // Load todos from LocalStorage on initialization
    const savedTodos = this.loadFromStorage();
    this.todosSubject = new BehaviorSubject<Todo[]>(savedTodos);
    this.todos$ = this.todosSubject.asObservable();
  }

  /**
   * Get all todos
   */
  getTodos(): Observable<Todo[]> {
    return this.todos$;
  }

  /**
   * Add a new todo item
   */
  addTodo(title: string): void {
    const todos = this.todosSubject.value;
    const newTodo: Todo = {
      id: this.generateId(),
      title: title.trim(),
      completed: false
    };
    const updatedTodos = [...todos, newTodo];
    this.updateTodos(updatedTodos);
  }

  /**
   * Update an existing todo item
   */
  updateTodo(id: number, updates: Partial<Todo>): void {
    const todos = this.todosSubject.value;
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, ...updates } : todo
    );
    this.updateTodos(updatedTodos);
  }

  /**
   * Delete a todo item
   */
  deleteTodo(id: number): void {
    const todos = this.todosSubject.value;
    const updatedTodos = todos.filter(todo => todo.id !== id);
    this.updateTodos(updatedTodos);
  }

  /**
   * Toggle completion status of a todo
   */
  toggleTodo(id: number): void {
    const todos = this.todosSubject.value;
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.updateTodos(updatedTodos);
  }

  /**
   * Update todos and persist to LocalStorage
   */
  private updateTodos(todos: Todo[]): void {
    this.todosSubject.next(todos);
    this.saveToStorage(todos);
  }

  /**
   * Load todos from LocalStorage
   */
  private loadFromStorage(): Todo[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading todos from storage:', error);
      return [];
    }
  }

  /**
   * Save todos to LocalStorage
   */
  private saveToStorage(todos: Todo[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos to storage:', error);
    }
  }

  /**
   * Generate a unique ID for new todos
   */
  private generateId(): number {
    const todos = this.todosSubject.value;
    return todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
  }
}

