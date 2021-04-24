import userResolver from "./user";
import todoResolver from "./todo";

export default {
  Mutation: {
    ...userResolver.Mutation,
    ...todoResolver.Mutation,
  },
  Query: {
    ...userResolver.Query,
    ...todoResolver.Query,
  },
};
