import { Todo } from "../model/todo.model";
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { TodosService } from "../service/todos.service";
import { computed, inject } from "@angular/core";


export type TodosFilter = 'all' | 'pending' | 'completed';

type TodosState = {
    todos: Todo[];
    loading: boolean;
    filter: TodosFilter;
}

const initialState: TodosState = {
    todos: [],
    loading: false,
    filter: 'pending'
}


export const TodosStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods(
        (store, todosService = inject(TodosService)) => ({

            async loadAll(){
                // metto il loading a true con un partial dello stato iniziale modificato
                patchState(store, {loading: true});
                // prendo la lista
                const todos = await todosService.getTodos();
                // aggiorno lo store con la lista e spengo il loader
                patchState(store, {todos, loading: false})
            },

            async addTodo(title: string){

                const todo = await todosService.addTodo({title, completed: false})
                 
                // aggiorno lo store con una state update function che prende come argomento "state" lo stato corrente dello store
                patchState( store, (state) => ({
                    // ritorna un partial dello state corrente di todos (...state.todos) e aggiunge il todo all array 
                    todos: [...state.todos, todo]
                }) )

            },

            async deleteTodo(id: string){
                const todos = await todosService.deleteTodo(id);

                patchState( store, (state) => ({
                    // filtro la lista dei todos correnti e la ritorno senza il todo con l'id ricevuto in ingresso
                    todos: state.todos.filter( todo => todo.id !== id )
                }) )
            },

            async updateTodo(id: string, completed: boolean){
                // 1. chiamo il servizio
                await todosService.updateTodo(id, completed);
                // 2. aggiorno il current state dello store
                patchState(store, (state) => ({
                    // mappa i todo allo stato corrente
                    todos: state.todos.map( todo =>
                        //per ogni todo verificha l'id con quello in ingresso, 
                        //se corrisponde aggiorna lo stato 
                        //completed del todo altrimenti ritorna il todo cosi come è
                        todo.id == id ? { ...todo, completed } : todo 
                     )
                }))
            },

            updateFilter( filter: TodosFilter ){
                patchState( store, {filter} )
            }



        })
    ),
    //derived signals, prendo il current state e ritorno un oggetto
    withComputed( (state) => ({
        // proprietà filteredTodos come derived signal (computed signal)
        filteredTodos: computed( () => {
            // prendo i todos allo stato corrente
            const todos = state.todos();
            // filtro i todos per valore filter corrente e li ritorno
            switch(state.filter()){
                case 'all':
                    return todos;
                    case 'pending':
                        return todos.filter( todo => !todo.completed )
                        case 'completed':
                            return todos.filter( todo => todo.completed )
            }

        })

    }))
)


