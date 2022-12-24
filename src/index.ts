import "reflect-metadata";
import {MikroORM, RequestContext} from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from 'express';
import {ApolloServer} from 'apollo-server-express'
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();
    await RequestContext.createAsync(orm.em, async () => {
        
    })
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: () => ({em: orm.em})
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({app});

    app.listen(5000, () => {
        console.log("server started on port 5000");
    });
}

main().catch((err)=>{
    console.error(err);
});
