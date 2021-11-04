const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');

const app = express();

app.use(bodyParser.json());

var employees = [];

var schema = buildSchema(`
    type Query {
        employees: [Person!]!
    }
    
    type Mutation {
        createEmployee(person: PersonInput): Person
    }
    
    type Person {
        _id: ID
        name: String!
        age: Int
        balance: Float
    }
    
    input PersonInput {
        name: String!
        age: Int
        balance: Float
    }

`);

var root = {
    employees: () => {
        return employees;
    },
    createEmployee: (args) => {
        var employee = {
            _id: employees.length + 1,
            name: args.person.name,
            age: args.person.age,
            balance: args.person.balance
        }
        employees.push(employee);
        return employee;
    }
};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(3333);