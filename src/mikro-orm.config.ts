import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from 'path';

export default {
    migrations: {
        path: path.join(__dirname, "./migrations"), // path to the folder with migrations
        glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
    },
    entities: [Post],
    dbName : "kBlogs",
    user: "postgres",
    password: "Lcwboleh02!",
    debug: !__prod__,
    type: "postgresql"
} as Parameters<typeof MikroORM.init>[0]; // magic code for removing type error in init function in index.ts 