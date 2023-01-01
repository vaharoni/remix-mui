import * as React from 'react';
import {MetaFunction} from "@remix-run/node";
import {useOptionalUser} from "~/utils";
import {Box, Button} from "@mui/material";
import LinkedButton from "~/mui/LinkedButton";
import {Form} from "@remix-run/react";

// https://remix.run/api/conventions#meta
export const meta: MetaFunction = () => {
  return {
    title: 'Remix Starter',
    description: 'Welcome to remix!',
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  const user = useOptionalUser();
  return (
    <Box sx={{ textAlign: "center", mt: 2 }}>
      {user ? (
        <>
          <div>
            Logged in as {user.email}
          </div>
          <div>
            <Form method="post" action="/logout">
              <Button type="submit" variant="contained">
                Logout
              </Button>
            </Form>
          </div>
        </>
      ) : (
        <div>
          <LinkedButton to={"/join"} variant="contained">Sign up</LinkedButton>
          {" "}
          <LinkedButton to={"/login"} variant="contained">Login</LinkedButton>
        </div>
      )}
    </Box>
  );
}
