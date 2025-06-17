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
    restaurantes: [],
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
    case "get_usuarios":
      return {
        ...store,
        user: action.payload.user,
      };
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };
    case "set_restaurante":
      return {
        ...store,
        restaurantes: action.payload,
      };
    case "add_restaurante":
      return {
        ...store,
        restaurantes: [...store.restaurantes, action.payload],
      };
    case "actualizar_restaurante":
      return {
        ...store,
        restaurantes: store.restaurantes.map((r) =>
          r.id === action.payload.id ? action.payload : r
        ),
      };
    case "remove_restaurante":
      return {
        ...store,
        restaurantes: store.restaurantes.filter((r) => r.id !== action.payload),
      };
    case "get_restaurantes":
      return {
        ...store,
        restaurantes: action.payload,
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
