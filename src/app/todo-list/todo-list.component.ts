import { Component, inject } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatListModule} from '@angular/material/list';
import { TodosStore } from '../store/todos.store';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'todo-list',
  standalone: true,
  imports: [
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {

  store = inject(TodosStore);

  async onAddTodo(title: string){
    await this.store.addTodo(title);
  }

  async onDeleteTodo(id: string, event: MouseEvent){
    // evita che il click si propaghi agli altri elemnti html (checkbox)
    event.stopPropagation();
    await this.store.deleteTodo(id);
  }

  async onToggleTodo(id: string, completed: boolean){
    
  }

}
