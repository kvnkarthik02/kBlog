import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput{
    @Field() username:string;
    @Field() password:string;
}

@ObjectType()
class FieldError{
    @Field() 
    field: string;

    @Field()
    message : string;
}

@ObjectType()
class UserResponse{         //way to handle errors in graphql
    @Field(() => [FieldError], {nullable: true}) 
    errors?: FieldError[];

    @Field(() => User, {nullable: true})
    user? : User;
}

const containsUpperCase = (str: string): boolean => str !== str.toLowerCase();
function containsNumber(str: string) {
    return /\d/.test(str);
}

@Resolver()
export class UserResolver{

    @Query(() =>User, {nullable: true})
    async me(
        @Ctx() {req, em} : MyContext
    ){
        // console.log("session:", req.session);
        if(!req.session.userId){ //not logged in
            return null;
        }
        const user = await em.findOne(User, {id: req.session.userId});
        return user;
    }

    @Query(()=> [User])  //get all users
    users(
        @Ctx() {em}: MyContext): Promise<User[]>{
        return em.find(User, {});
    }

    @Mutation(()=>Boolean) // Mutation is to update, insert and delete data, function to delete existing user
    async delUser(
        @Arg("id") id: number, 
        @Ctx() {em}: MyContext
    ): Promise<Boolean>{
        em.nativeDelete(User, {id});
        return true;
    }

    @Mutation(()=> UserResponse)
    async register(
        @Arg('input', () => UsernamePasswordInput) input: UsernamePasswordInput,
        @Ctx() {em, req}: MyContext
    ): Promise<UserResponse>{
        if(input.username.length<=2){
            return {
                errors:[
                    {
                        field: 'username',
                        message: 'Username must be at least 2 characters.',
                    },
                ],
            };
        }
        if(input.password.length<6){
            return {
                errors:[
                    {
                        field: 'password',
                        message: 'Password must be at least 6 characters.',
                    },
                ],
            };
        }

        const hashedPass = await argon2.hash(input.password);   //hashing the password using argon2 library
        const user = em.create(User, {
            username: input.username, password: hashedPass,
            createdAt: "",
            updatedAt: ""
        });
        try{
            await em.persistAndFlush(user);
        }catch(err){
            if(err.code === '23505'){
                //duplicate username
                return{
                    errors: [
                        {
                            field:"username",
                            message: "Username already exists",
                        },
                    ],
                };
            }
        }
        //login the user after registering and save their cookie
        req.session!.userId = user.id;

        return {
            user
        };
    }

    @Mutation(()=> UserResponse) //not sure why the login function is a mutator function
    async login(
        @Arg("input", () => UsernamePasswordInput) input: UsernamePasswordInput,
        @Ctx() {em,req}: MyContext
    ): Promise<UserResponse>{
        const user = await em.findOne(User, {username: input.username});
        if(!user){
            return {
                errors: [
                    {
                        field: "username",
                        message:" that username does not exist",
                    },
                ],
            };
        } 
        const valid = await argon2.verify(user.password, input.password);
        if(!valid){
            return {
                errors: [
                    {
                        field: "password",
                        message:"incorrect password",
                    },
                ],
            };
        }
        req.session!.userId = user.id;
        

        return {
            user,
        };
    }

}

