const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose = require('mongoose');
const Employee = require('./models/person');

const app = express();

app.use(bodyParser.json());

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
        return Employee.find().then(employees => {
            return employees.map(employee => {
                return {...employee._doc}
            });
        } ).catch(err=> {
            throw err;
        })
    },
    createEmployee: (args) => {
        const employee = new Employee({
            name: args.person.name,
            age: args.person.age,
            balance: args.person.balance
        });
        return employee
            .save()
            .then(result=> {
                console.log(result);
                return { ...result._doc };
            })
            .catch(err=>console.log(err));
    }
};

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.p2j0r.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(() => app.listen(3333)).catch(err => console.log(err))

