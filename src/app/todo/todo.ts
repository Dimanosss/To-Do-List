import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from './todo.service';
import { Subscription } from 'rxjs';

/**
 * Todo Model
 * Represents a single todo item with id, title, and completion status
 */
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

/**
 * Filter type for todo list
 */
type FilterType = 'all' | 'active' | 'completed';

/**
 * Todo Component
 * Main component for managing todo list with add, edit, delete, and filter functionality
 */
@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.html',
  styleUrl: './todo.css'
})
export class TodoComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  newTodoTitle: string = '';
  currentFilter: FilterType = 'all';
  editingId: number | null = null;
  editTitle: string = '';
  private subscription: Subscription = new Subscription();

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    // Subscribe to todos observable
    const todosSub = this.todoService.getTodos().subscribe(todos => {
      this.todos = todos;
      this.applyFilter();
    });
    this.subscription.add(todosSub);
  }

  ngOnDestroy(): void {
    // Clean up subscription
    this.subscription.unsubscribe();
  }

  /**
   * Add a new todo item
   */
  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      this.todoService.addTodo(this.newTodoTitle);
      this.newTodoTitle = '';
    }
  }

  /**
   * Start editing a todo item
   */
  startEdit(todo: Todo): void {
    this.editingId = todo.id;
    this.editTitle = todo.title;
  }

  /**
   * Save edited todo item
   */
  saveEdit(id: number): void {
    if (this.editTitle.trim()) {
      this.todoService.updateTodo(id, { title: this.editTitle.trim() });
      this.cancelEdit();
    }
  }

  /**
   * Cancel editing
   */
  cancelEdit(): void {
    this.editingId = null;
    this.editTitle = '';
  }

  /**
   * Delete a todo item
   */
  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id);
  }

  /**
   * Toggle completion status of a todo
   */
  toggleTodo(id: number): void {
    this.todoService.toggleTodo(id);
  }

  /**
   * Set filter type and apply it
   */
  setFilter(filter: FilterType): void {
    this.currentFilter = filter;
    this.applyFilter();
  }

  /**
   * Apply current filter to todos
   */
  private applyFilter(): void {
    switch (this.currentFilter) {
      case 'active':
        this.filteredTodos = this.todos.filter(todo => !todo.completed);
        break;
      case 'completed':
        this.filteredTodos = this.todos.filter(todo => todo.completed);
        break;
      default:
        this.filteredTodos = this.todos;
    }
  }

  /**
   * Check if a filter is currently active
   */
  isFilterActive(filter: FilterType): boolean {
    return this.currentFilter === filter;
  }
}
