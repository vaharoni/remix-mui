import * as React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {Link} from "@remix-run/react";

export default function About() {
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Remix with TypeScript example
      </Typography>
      <Button variant="contained" component={Link} to="/">
        Go to the main page
      </Button>
    </>
  );
}
