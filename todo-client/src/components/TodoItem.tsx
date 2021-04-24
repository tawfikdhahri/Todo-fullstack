import { gql, MutationUpdaterFn, useMutation, useQuery } from "@apollo/client";
import React, { ReactElement, useCallback, useMemo, useState } from "react";
import Switch from "react-switch";

import { idText } from "typescript";
import { TodoType, TODOS } from "../views/Home";
import UsersModal from "./UsersModal";

interface Props {
  item: TodoType;
}

const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;

const ADD_COMMENT = gql`
  mutation AddComment($todoId: ID!, $content: String!) {
    addComment(todoId: $todoId, content: $content) {
      id
      content
      author {
        id
        name
      }
    }
  }
`;

const COMMENTS = gql`
  query Comments($todoId: ID!) {
    comments(todoId: $todoId) {
      id
      content
      author {
        name
      }
    }
  }
`;

const ME = gql`
  {
    me {
      id
    }
  }
`;

function TodoItem({ item }: Props): ReactElement {
  const [comment, setComment] = useState("");
  const [complete, setComplete] = useState(true);
  const [show, setShow] = useState(false);

  const [openModal, setShowModal] = useState(false);

  const handleChange = useCallback((e: any) => {
    setComment(e.target.value);
  }, []);

  const { data, error } = useQuery(COMMENTS, {
    variables: {
      todoId: item.id,
    },
  });

  const { data: me } = useQuery(ME);

  const [addComment] = useMutation(ADD_COMMENT, {
    update: (cache: any, { data: { addComment } }) => {
      const queryParams = {
        query: COMMENTS,
        variables: {
          todoId: item.id,
        },
      };

      const { comments: commentsList } = cache.readQuery(queryParams);

      cache.writeQuery({
        ...queryParams,
        data: {
          comments: [addComment, ...commentsList],
        },
      });
    },
  });

  const [deleteTodo] = useMutation(DELETE_TODO, {
    update: (cache: any) => {
      const queryParams = {
        query: TODOS,
      };
      const { todos: todosList } = cache.readQuery(queryParams);
      console.log({ todosList });

      cache.writeQuery({
        query: TODOS,
        data: {
          todos: todosList.filter((i: any) => i.id !== item.id),
        },
      });
    },
  });

  const deleteItem = useCallback(() => {
    deleteTodo &&
      deleteTodo({
        variables: { id: item.id },
      })
        .then((res) => console.log(res))
        .catch((e) => console.log(e));
  }, [item]);

  const toggle = useCallback(() => {
    setComplete(!complete);
  }, [complete]);

  const toggelComments = useCallback(() => {
    setShow(!show);
  }, [show]);

  const addCommentItem = useCallback(() => {
    addComment &&
      addComment({
        variables: {
          todoId: item.id,
          content: comment,
        },
      }).then((res) => {
        console.log(res);
        setComment("");
      });
  }, [comment, item, addComment]);

  const isOwner = useMemo(() => {
    if (me) {
      return me.me.id == item.owner.id;
    }
  }, [me, item]);

  console.log(data);

  const showModal = useCallback(() => {
    setShowModal(true);
  }, []);

  return (
    <div className="item">
      <div className="head">
        {isOwner && (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Switch
                offColor="#888c8c"
                onColor="#4fd1c5"
                uncheckedIcon={false}
                checkedIcon={false}
                width={40}
                height={20}
                onChange={toggle}
                checked={complete}
              />
              <span style={{ marginLeft: 10 }}>
                {complete ? "Completed" : "Uncompleted"}
              </span>
            </div>

            <button onClick={deleteItem} className="item__delete">
              <i className="fa fa-trash-o" aria-hidden="true"></i>
            </button>
          </>
        )}
      </div>
      {/* <img src="./share.png" /> */}
      {isOwner && (
        <i
          onClick={showModal}
          className="fa fa-share-alt share "
          aria-hidden="true"
        ></i>
      )}

      <h3>{item.title}</h3>
      <p className="desc">{item.description}</p>

      <div className="comments-wrapper">
        <button onClick={toggelComments}>
          {!show ? "Show Comments" : "Hide Comments"}
        </button>
        {show && (
          <div className="comments-list">
            <div className="comment">
              <input
                placeholder="add Comment..."
                value={comment}
                onChange={handleChange}
              />
              <button disabled={!comment} onClick={addCommentItem}>
                Add Comment
              </button>
            </div>
            {data &&
              data?.comments.map((i: any, idx: number) => {
                return (
                  <div key={idx} className="comment-item">
                    <div className="content">{i.content}</div>
                    <span className="author">{i.author.name}</span>
                  </div>
                );
              })}
          </div>
        )}
      </div>
      <UsersModal
        show={openModal}
        closeModal={() => setShowModal(false)}
        owner={me?.me.id}
        todoId={item.id}
      />
    </div>
  );
}

export default TodoItem;
