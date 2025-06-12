export const initialStore = () => {
  return {
    user: null,
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "get_user_info":
      return {
        ...store,
        user: action.payload,
      };
    case "login_register":
      return {
        ...store,
        user: action.payload.user,
      };
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };
    case "add_task":
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };
    default:
      throw Error("Unknown action.");
  }
}
