"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@swardify/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@swardify/ui/form";
import { Input } from "@swardify/ui/input";

import { createClient } from "~/supabase/client";

const signInSchema = z.object({
  email: z.string().email().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function SignIn() {
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });
  const supabase = createClient();

  return (
    <div className="container max-w-sm px-4">
      <div className="space-y-4 py-20">
        <h2 className="text-xl font-semibold">Sign in</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (values) => {
              if (values.email !== "swardify@gmail.com") {
                form.setError("email", {
                  message: "Invalid email or password.",
                });

                return;
              }
              const { data } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password,
              });

              if (data.session) router.push("/dashboard");
            })}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Sign in</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
