import {MikroORM} from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const post  = orm.em.create(Post, {
        title: 'first post',
        createdAt: "",
        updatedAt: ""
    });

    await orm.em.persistAndFlush(post);

    await orm.em.nativeInsert(Post, {title: 'first post'});
}

console.log("hello world!");