"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = void 0;
exports.types = `#graphql

input CreatePostData {
    content: String!
    imageURL: String
}

type Post {
    id: ID!
    content: String!
    imageURL: String

    author: User
}`;
