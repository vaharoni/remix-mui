import * as React from 'react';
import Typography from '@mui/material/Typography';
import {Link} from "@remix-run/react";
import {MetaFunction} from "@remix-run/node";

// https://remix.run/api/conventions#meta
export const meta: MetaFunction = () => {
  return {
    title: 'Remix Starter',
    description: 'Welcome to remix!',
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Remix with TypeScript example
      </Typography>
      <Link to="/about" color="secondary">
        Go to the about page
      </Link>
    </>
  );
}
