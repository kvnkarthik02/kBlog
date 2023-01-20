import {
  Box,
  Button
} from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useRegisterMutation } from "../gql/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { createUrqlClient } from "../utils/urqlClient";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register(values);
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            // if no errors, redirect to home page
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
              color= "black"
              background= "white"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
                color= "black"
                background= "white"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              variantColor="teal"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Register);  //all pages need access to the client (createUrqlClient) inorder to work


//because codegen and urql is so annoying, keeping this here everytime i run yarn gen

// export function useLoginMutation() {
//   return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
// };

// export function useRegisterMutation() {
//   return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
// };

// export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
//   return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
// };

// export function useLogoutMutation(){
//   return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
// };

// export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
//   return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
// };