import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import { prismaClient } from '../clients/db';

import { User } from './user';
import { GraphqlContext } from '../interfaces';
import JWTService from '../services/jwt';

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
    
    const graphqlServer = new ApolloServer<GraphqlContext>({ typeDefs, resolvers });

    try {
      await graphqlServer.start();
      app.use('/graphql', expressMiddleware(graphqlServer, {context: async ({req, res}) => {
        return {
          user: req.headers.authorization ? JWTService.decodeToken(req.headers.authorization.split("Bearer ")[1]) : undefined,};
      }}));
    } catch (error) {
      console.error('Failed to start the GraphQL server:', error);
    }

    return app;
}
