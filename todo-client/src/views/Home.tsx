import { gql, useMutation, useQuery } from "@apollo/client";
import React, { ReactElement, useCallback, useState } from "react";
import TodoItem from "../components/TodoItem";

interface Props {}

export const TODOS = gql`
  {
    todos {
      id
      title
      description
      owner {
        id
        name
      }
    }
  }
`;

const ADD_TODO = gql`
  mutation AddTodo($todo: TodoInput) {
    addTodo(todo: $todo) {
      id
      title
    }
  }
`;

export type TodoType = {
  id: string;
  title: string;
  description: string;
  owner?: any;
  viewers?: any;
  complete: boolean;
};
const Home: React.FC<Props> = ({}): JSX.Element => {
  const [values, setValues] = useState({
    title: "",
    desc: "",
  });

  const [addItem] = useMutation(ADD_TODO, {
    update: (cache: any, { data: { addTodo } }) => {
      const queryParams = {
        query: TODOS,
      };
      const { todos: todosList } = cache.readQuery(queryParams);
      delete addTodo.__typename;
      cache.writeQuery({
        query: TODOS,
        data: {
          todos: [addTodo, ...todosList],
        },
      });
    },
  });

  const handleChange = useCallback(({ target: { value, name } }) => {
    setValues((p: { title: string; desc: string }) => {
      return {
        ...p,
        [name]: value,
      };
    });
  }, []);

  const { data, loading, error } = useQuery(TODOS);

  const addTodoItem = useCallback(
    (e) => {
      // e.preventdefault();
      addItem &&
        addItem({
          variables: {
            todo: { title: values.title, description: values.desc },
          },
        })
          .then((res) => {
            console.log(res);
            setValues({ title: "", desc: "" });
          })
          .catch((e) => {
            console.log(e);
          });
    },
    [values]
  );

  return (
    <div className="home">
      <div className="form">
        <div>add Todo</div>
        <input
          placeholder="title"
          value={values.title}
          onChange={handleChange}
          name="title"
        />
        <textarea
          placeholder="description"
          value={values.desc}
          onChange={handleChange}
          name="desc"
        />
        <button disabled={!values.title || !values.desc} onClick={addTodoItem}>
          Add
        </button>
      </div>
      <div className="home__list">
        {data &&
          (data.todos.length === 0 ? (
            <div className="empty"> List is empty</div>
          ) : (
            data?.todos.map((i: TodoType, idx: number) => {
              return <TodoItem key={idx} item={i} />;
            })
          ))}
      </div>
    </div>
  );
};

export default Home;
