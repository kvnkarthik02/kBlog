import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User{
    @Field()
    @PrimaryKey()
    id! : number;

    //good practice to have createdAt and updatedAt field for all entities
    @Field(() => String)
    @Property({type: 'date'})
    createdAt = new Date();

    @Field(()=> String)
    @Property({type: 'date',onUpdate: () => new DataTransfer()})
    updatedAt = new Date();

    @Field()
    @Property({type: 'text', unique:true})
    username! : string;

    //password field will be hidden from the database table for safety, and will not be able to be selected.
    @Property({type: 'text', unique:true})
    password! : string;
}


