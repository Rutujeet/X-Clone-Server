import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import { prismaClient } from '../clients/db';

import { User } from './user';

const typeDefs = `
${User.types}
  type Query {
   ${User.queries}
  }
`;

const resolvers = {
  Query: {
    ...User.resolvers.queries
  }
};

export async function initServer() {
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());
    
    const graphqlServer = new ApolloServer({ typeDefs, resolvers });

    try {
      await graphqlServer.start();
      app.use('/graphql', expressMiddleware(graphqlServer));
    } catch (error) {
      console.error('Failed to start the GraphQL server:', error);
    }

    return app;
}
