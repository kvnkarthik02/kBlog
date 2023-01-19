import { Box, Button, Flex, Link } from "@chakra-ui/core";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../gql/graphql";

interface NavBarProps {}

export const Navbar: React.FC<NavBarProps> = ({}) => {
  const [{fetching:logoutFetching}, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();
  let body = null;

  // data is loading
  if (fetching) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    );
    // user is logged in
  } else {
    body = (
      <Flex>
        <Box mr={3}>{data.me.username}</Box>
        <Button
          onClick={() => {
            logout();
            //can simply update cache using graphcache in _app.tsx instead of just reloading the window. 
            //but reloading just for visual effects lol
            window.location.reload();            
          }}
          isLoading={logoutFetching}
          variant="link"
          
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg='#319795' p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};