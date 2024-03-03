import { api } from "../../trpc/server";
import Todo from "./todo";

export default async function Todos() {
    const todos = await api.todo.all.query();

    return (
        <>{
            todos.map(todo => {
                return <Todo key={todo.id} todo={todo}/>;
            })
        }</>
    );
}