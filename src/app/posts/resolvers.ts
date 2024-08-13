import { Post } from "@prisma/client";
import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../../interfaces";

interface CreatePostPayload {
    content: string
    imageURL: string
}

const mutations = {
    createPost: async (parent: any, { payload }: { payload: CreatePostPayload }, ctx: GraphqlContext) => {
        if (!ctx.user) throw new Error("not logged in!");
        const post = await prismaClient.post.create({
            data: {
                content: payload.content,
                imageURL: payload.imageURL,
                author: { connect: { id: ctx.user.id } }
            }
        })
        return post;
    }

}

const extraResolvers = {
    Post: {
        author: (parent: Post) => prismaClient.user.findUnique({ where: { id: parent.authorId } })
    }
}

const queries = {
    getAllPosts: () => prismaClient.post.findMany({ orderBy: { createdAt: 'desc' } })
}

export const resolvers = { mutations, extraResolvers, queries }