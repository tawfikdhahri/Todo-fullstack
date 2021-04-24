import parser from "body-parser";
import cors from "cors";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import { connect } from "mongoose";

import path from "path";
import typeDefs from "./schema/types";
import resolvers from "./schema/resolvers";
import { addUserToReq } from "./middlwares/addUserToReq";
import user from "./models/user";

dotenv.config();

// DB CONNECTION

console.log(process.env.DATABASE_URL, "------");

connect(process.env.DATABASE_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((con) => {
  console.log(`MongoDB Database connected with HOST: ${con.connection.host}`);
});

// CREATE EXPRESS CUSTOMER APP
const app: express.Express = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(parser.urlencoded({ extended: false }));
app.use(addUserToReq);

const server: ApolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }: { req: any }) => ({
    user: req.locals ? req.locals.user : undefined,
  }),
});

server.applyMiddleware({
  app,
  path: "/graphql",
});

app.listen(process.env.HTTP_PORT, (): void => {
  console.log(`🚀 Customer APP is listening at port ${process.env.HTTP_PORT}`);
});

// ADMIN
