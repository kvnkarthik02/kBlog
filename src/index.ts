import {MikroORM, RequestContext} from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    // const post  = orm.em.create(Post, {
    //     title: "first post",
    //     createdAt: "",
    //     updatedAt: ""
    // });

    // await orm.em.persistAndFlush(post);

    await RequestContext.createAsync(orm.em, async ()=> {
        // const post = orm.em.create(Post, {
        //     title: "second post",
        //     createdAt: "",
        //     updatedAt: ""
        // });
        // await orm.em.persistAndFlush(post);
        const posts = await orm.em.find(Post,{});
        console.log(posts); 
    });

}

main().catch((err)=>{
    console.error(err);
});
console.log("hello world!");