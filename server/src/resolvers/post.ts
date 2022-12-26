import { Post } from "../entities/Post";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "src/types";

@Resolver()
export class PostResolver{
    @Query(()=> [Post])  //get all posts 
    posts(
        @Ctx() {em}: MyContext): Promise<Post[]>{
        return em.find(Post, {});
    }

    @Query(()=> Post, {nullable: true}) //get post by id
    post(
        @Arg('id', ()=> Int) id: number, 
        @Ctx() {em}: MyContext
    ): Promise<Post | null>{
        return em.findOne(Post, {id});
    }

    @Mutation(()=> Post) // Mutation is to update, insert and delete data. function to create post
    async createPost(
        @Arg("title") title: string, 
        @Ctx() {em}: MyContext
    ): Promise<Post>{
        const post = em.create(Post, {
            title,
            createdAt: "",
            updatedAt: ""
        });
        await em.persistAndFlush(post)
        return post;
    }

    @Mutation(()=> Post, {nullable:true}) // Mutation is to update, insert and delete data, function to update existing post
    async updatePost(
        @Arg("id") id: number, 
        @Arg("title", ()=> String, {nullable:true}) title: string, 
        @Ctx() {em}: MyContext
    ): Promise<Post | null>{
        const post = await em.findOne(Post, {id});  //use multiple SQL queries to update a post. use findOne function to look for post with given ID. 
        if(!post){
            return null
        }
        if(post!== undefined){  //if post found, and a valid new title is provided, update title
            post.title = title;
            await em.persistAndFlush(post);
        }        
        return post;
    }


    @Mutation(()=>Boolean) // Mutation is to update, insert and delete data, function to delete existing post
    async delPost(
        @Arg("id") id: number, 
        @Ctx() {em}: MyContext
    ): Promise<Boolean>{
        em.nativeDelete(Post, {id});
        return true;
    }
}

