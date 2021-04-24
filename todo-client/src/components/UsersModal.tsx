import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useCallback } from "react";
import { Modal } from "react-bootstrap";

interface Props {
  show: boolean;
  closeModal: () => void;
  owner?: string;
  todoId: string;
}

const USERS = gql`
  {
    users {
      id
      name
    }
  }
`;

const SHARE_TODO = gql`
  mutation ShareTodo($todoId: ID!, $userId: ID!) {
    shareTodo(todoId: $todoId, userId: $userId)
  }
`;

const UsersModal = ({
  show,
  closeModal,
  owner,
  todoId,
}: Props): JSX.Element => {
  const { data } = useQuery(USERS);
  const [shareTodo] = useMutation(SHARE_TODO);

  const share = useCallback((id: string) => {
    shareTodo &&
      shareTodo({
        variables: {
          todoId,
          userId: id,
        },
      })
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
  }, []);

  return (
    <Modal show={show} centered className="users" size="lg">
      <Modal.Header>
        <i
          onClick={closeModal}
          className="fa fa-times-circle-o fa-lg"
          aria-hidden="true"
        ></i>
      </Modal.Header>
      <Modal.Body>
        {data &&
          data?.users
            .filter((u: any) => u.id !== owner)
            .map((i: any, idx: number) => {
              return (
                <div key={idx} className="user">
                  <div>{i.name}</div>
                  <button onClick={() => share(i.id)}>Share</button>
                </div>
              );
            })}
      </Modal.Body>
    </Modal>
  );
};

export default UsersModal;
