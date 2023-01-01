import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {Form, Link, useActionData, useSearchParams, useSubmit, useTransition} from "@remix-run/react";
import * as React from "react";

import { createUserSession, getUserId } from "~/server-utils/session.server";

import { createUser, getUserByEmail } from "~/models/user.server";
import { safeRedirect } from "~/utils";
import {getFormData} from "~/server-utils/request.server";
import {userAuthDefaults, userAuthSchema} from "~/models/user.schema";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Box, TextField, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await getFormData(request, ["email", "password", "redirectTo"]);
  const redirectTo = safeRedirect(formData.redirectTo, "/");
  const parsedData = userAuthSchema.safeParse(formData);
  if (!parsedData.success) return json({...parsedData.error.flatten(), fields: formData}, {status: 400})

  const existingUser = await getUserByEmail(parsedData.data.email);
  if (existingUser) {
    return json({fields: formData, formErrors: [], fieldErrors: {email: ["Email already exists"], password: []}}, {status: 400});
  }

  const user = await createUser(parsedData.data.email, parsedData.data.password);
  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const transition = useTransition();
  const {control, handleSubmit, formState: {errors}} = useForm({
    resolver: zodResolver(userAuthSchema),
    defaultValues: userAuthDefaults
  });

  return (
    <Form method="post" noValidate onSubmit={e => handleSubmit(() => submit(e.currentTarget))}>
      <input type="hidden" name="redirectTo" value={redirectTo}/>

      <Box sx={{ display: "flex", flexDirection: "column", maxWidth: "28rem", mx: "auto", mt: 8, gap: 2,}}>
        <Controller name="email" control={control} render={({field}) => (
          <TextField
            label="Email"
            fullWidth
            error={!!errors.email || !!actionData?.fieldErrors?.email}
            helperText={errors.email && "Please enter a valid email address" || actionData?.fieldErrors.email}
            {...field}
          />
        )}/>

        <Controller name="password" control={control} render={({field}) => (
          <TextField
            type="password"
            label="Password"
            fullWidth
            error={!!errors.password || !!actionData?.fieldErrors?.password}
            helperText={errors.password && "Password must be 8 characters long" || actionData?.fieldErrors.password}
            {...field}
          />
        )}/>

        <LoadingButton
          type="submit"
          variant="contained"
          loading={transition.state !== "idle"}
        >
          Create account
        </LoadingButton>

        {actionData?.formErrors?.length ? <Typography color="error">{actionData.formErrors.join(". ")}</Typography> : null }

        <Box>
          Already have an account?{" "}
          <Link
            to={{
              pathname: "/login",
              search: searchParams.toString(),
            }}
          >
            Log in
          </Link>
        </Box>
      </Box>
    </Form>
  )
}
