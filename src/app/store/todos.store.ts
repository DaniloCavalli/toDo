import { Todo } from "../model/todo.model";
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { TodosService } from "../service/todos.service";
import { inject } from "@angular/core";


export type TodosFilter = 'all' | 'pending' | 'completed';

type TodosState = {
    todos: Todo[];
    loading: boolean;
    filter: TodosFilter;
}

const initialState: TodosState = {
    todos: [],
    loading: false,
    filter: 'all'
}


export const TodosStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods(
        (store, todosService = inject(TodosService)) => ({

            async loadAll(){
                // metto il loading a true
                patchState(store, {loading: true});
                // prendo la lista
                const todos = await todosService.getTodos();
                // aggiorno lo store con la lista e spengo il loader
                patchState(store, {todos, loading: false})
            },

            async addTodo(title: string){

                const todo = await todosService.addTodo({title, completed: false})
                 

                patchState( store, (state) => ({
                    todos: [...state.todos, todo]
                }) )

            }



        })
    )
)


