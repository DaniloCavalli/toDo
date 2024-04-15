import { Component, effect, inject, viewChild } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonToggleChange, MatButtonToggleGroup, MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatListModule} from '@angular/material/list';
import { TodosFilter, TodosStore } from '../store/todos.store';
import {MatIconModule} from '@angular/material/icon';
import { NgStyle } from '@angular/common';


@Component({
  selector: 'todo-list',
  standalone: true,
  imports: [
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatListModule,
    MatIconModule,
    NgStyle
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {

  store = inject(TodosStore);

  // creo signal con template reference #filter in html, il tipo di html tag è mat-button-toggle-group
  filter = viewChild.required(MatButtonToggleGroup)


  constructor(){

    // creo signal side-effect e vengo notificato al cambio di #filter
    effect( () => {
      // creo costante filter uguale al valore del signal ".filter()"
      const filter = this.filter()

      // setto il suo valore nello store
      filter.value = this.store.filter();
    })


  }

  async onAddTodo(title: string){
    await this.store.addTodo(title);
  }

  async onDeleteTodo(id: string, event: MouseEvent){
    // evita che il click si propaghi agli altri elemnti html (checkbox)
    event.stopPropagation();
    await this.store.deleteTodo(id);
  }

  async onToggleTodo(id: string, completed: boolean){
    await this.store.updateTodo(id, completed);
  }

  onFilterTodos(event: MatButtonToggleChange){
    const filter = event.value as TodosFilter;
    this.store.updateFilter(filter);
  }

}
