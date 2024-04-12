import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodosStore } from './store/todos.store';
import { JsonPipe } from '@angular/common';
import { TodoListComponent } from './todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, TodoListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  store = inject(TodosStore);

  constructor(){
    
    this.loadTodos()
      .then( () => console.log('todos loaded!') )

  }

  async loadTodos(){
    await this.store.loadAll();
  }

}
