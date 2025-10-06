"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@mantine/form";
import {
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Group,
} from "@mantine/core";

import * as React from "react";

export default function LoginPage() {
  const router = useRouter();

  const form = useForm({
    initialValues: { email: "", password: "" },
    validate: {
      email: (v) => (/^\S+@\S+$/.test(v) ? null : "Invalid email"),
      password: (v) => (v.length < 1 ? "Min 6 characters" : null),
    },
  });

  const handleSubmit = async (vals: { email: string; password: string }) => {
    // if (vals.email === "test@test.com" && vals.password === "123456") {
    //   router.push("/");
    // } else {
    //   alert("Invalid login");
    // }

    console.log(vals.email, vals.password);

    const res = await fetch("http://10.0.2.8:4000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: vals.email.trim(),
        password: vals.password,
      }),
    });

    if (!res.ok) {
      throw new Error("API request failed");
    }

    const data = await res.json();
    console.log("Response:", data);

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    localStorage.setItem("user_id", data.user.id.toString());

    router.push("/time-off/request");
  };

  return (
    <div className="h-screen w-screen bg-white flex">
      {/* LEFT SIDE */}
      <div
        className="w-1/2 flex flex-col items-center justify-center bg-cover bg-center  p-10"
        style={{
          backgroundImage: "url('')",
        }}
      >
        <img src="/safwa.logo.png" alt="Safwa Logo" className="w-32 mb-4 " />
        <h1 className="text-4xl font-bold tracking-wide text-black">
          LEAVE MANAGEMENT
        </h1>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 flex items-center justify-center bg-black">
        <Paper p="xl" shadow="md" radius="md" className="w-[360px]">
          <Title order={2} mb="lg" ta="center">
            Login
          </Title>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Username or Email"
              placeholder="Enter your username or email"
              {...form.getInputProps("email")}
              mb="sm"
            />
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              {...form.getInputProps("password")}
              mb="md"
            />
            <Group justify="center">
              <Button type="submit" fullWidth color="dark">
                Sign In
              </Button>
            </Group>
          </form>
        </Paper>
      </div>
    </div>
  );
}
