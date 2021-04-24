export default `

    type User {
        id:ID!
        name:String
        email:String!
        password:String!
    }
    type Todo {
            id:ID!
            title:String!
            description:String
            owner:User
            viewers:[User]
            completed:Boolean
            comments :[Comment]
    }
    type Comment {
        id:ID!
        content:String!
        author:User

    }

    type Response {
      accessToken :String
    }

   

    input UserInput {
        name:String
        email:String!
        password:String!
    }
    input TodoInput {
        title:String!
        description:String
        completed:Boolean
    }
    input TodoInputUpdate {
        id:ID!
        title:String
        description:String
        completed:Boolean
    }

    type Query {
        todos:[Todo]
        comments(todoId:ID!):[Comment]
        me :User
        users:[User]
     }
    type Mutation {
        signUp(user:UserInput):User
        signIn(email:String,password:String):Response
        addTodo(todo:TodoInput):Todo
        deleteTodo(id:ID!):Boolean
        updateTodo(todo:TodoInputUpdate):Todo
        shareTodo(todoId:ID!,userId:ID!):Boolean
        addComment(todoId:ID!, content:String!):Comment

    }
`;
