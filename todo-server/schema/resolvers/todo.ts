import { TodoModel, CommentModel, UserModel } from "../../models";
import { ITodo } from "../../models/todo";
import { authResolve } from "./authResolve";
export default {
  Query: {
    todos: async (_, __, { user }): Promise<any> => {
      return await TodoModel.find().populate("owner");
    },
    comments: async (_, args) => {
      try {
        const todo: any = await TodoModel.findById(args.todoId);
        console.log(todo.comments, "----");

        return await todo.comments.map(async (i: any) => {
          return await CommentModel.findById(i).populate("author");
        });
      } catch (e) {
        Promise.reject(e);
      }
    },
  },
  Mutation: {
    addTodo: async (_, args, { user }): Promise<any> => {
      return authResolve(user, async () => {
        console.log(args);

        try {
          const todo = await TodoModel.create({ ...args.todo, owner: user.id });
          return Promise.resolve(todo);
        } catch (e) {
          return Promise.reject({
            message: e,
          });
        }
      });
    },

    deleteTodo: async (_, args, { user }): Promise<boolean> => {
      return authResolve(user, async () => {
        const todo = await TodoModel.findById(args.id);
        console.log({ todo, args });

        if (todo.owner == user.id) {
          return TodoModel.deleteOne({ _id: args.id })
            .catch(
              (err): Promise<never> => {
                return Promise.reject("Todo not found");
              }
            )
            .then((raw: any): boolean => {
              // return `order ${args.id} deleted succefuly`;
              return raw.deletedCount > 0;
            });
        } else {
          return Promise.reject("you are not the owner of this todo");
        }
      });
    },

    shareTodo: async (_, args, { user }) => {
      return authResolve(user, async () => {
        try {
          const todo = await TodoModel.findById(args.todoId);
          if (todo.owner == user.id) {
            const newTodo = await TodoModel.updateOne(
              { id: args.todoId },
              { $push: { viewers: args.userId } }
            );
            if (newTodo) {
              Promise.resolve(true);
            } else {
              Promise.resolve(false);
            }
          } else {
            return Promise.reject("Access denied");
          }
        } catch (e) {
          return Promise.reject(e);
        }
      });
    },

    updateTodo: async (_, args, { user }): Promise<any> => {
      authResolve(user, async () => {
        const todo: any = {};
        const { title, completed, description } = args.todo;
        todo.title = title;
        todo.description = description;
        todo.completed = completed;

        try {
          const updatedTodo = await TodoModel.findOneAndUpdate(
            {
              _id: args.id,
            },
            {
              $set: todo,
            },
            { useFindAndModify: false }
          );

          console.log(updatedTodo, "uuu");

          return Promise.resolve(updatedTodo);
        } catch (e) {
          return Promise.reject({
            message: e,
          });
        }
      });
    },

    addComment: async (_, args, { user }) => {
      return authResolve(user, async () => {
        try {
          const comment = await await CommentModel.create({
            content: args.content,
            author: user.id,
          });
          if (comment) {
            await TodoModel.updateOne({ id: args.todoId }, { $push: { comments: comment.id } });
          }
          const u = await UserModel.findById(user.id);
          comment.author = u;

          return Promise.resolve(comment);
        } catch (e) {
          return Promise.reject(e);
        }
      });
    },
  },
};
