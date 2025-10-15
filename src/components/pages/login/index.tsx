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
  Checkbox,
  Text,
} from "@mantine/core";
import { motion } from "framer-motion";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const form = useForm({
    initialValues: { email: "", password: "", remember: false },
    validate: {
      email: (v) => (/^\S+@\S+$/.test(v) ? null : "Invalid email"),
      password: (v) => (v.length < 1 ? "Please enter your password" : null),
    },
  });

  const handleSubmit = async (vals: {
    email: string;
    password: string;
    remember: boolean;
  }) => {
    try {
      const res = await fetch("http://10.0.2.8:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: vals.email.trim(),
          password: vals.password,
        }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Simpan user info & token
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      // Kalau API ada user_id, guna ni:
      if (data.user?.user_id) {
        localStorage.setItem("user_id", data.user.user_id.toString());
      }

      // Pergi ke dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="h-screen w-screen flex text-white overflow-hidden">
      {/* LEFT SIDE */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-[#0B1220] relative">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ backgroundSize: "200% 200%", zIndex: 0 }}
        />
        <div className="relative z-10 text-center">
          <img
            src="/safwa.logo.png"
            alt="Safwa Logo"
            className="w-28 mx-auto mb-6 drop-shadow-lg"
          />
          <h1 className="text-4xl font-bold tracking-wide text-gray-100">
            LEAVE MANAGEMENT SYSTEM
          </h1>
          <Text className="text-gray-400 mt-2">Safwa Industries</Text>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 flex items-center justify-center bg-[#111827] relative">
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-[#1E293B] via-[#0F172A] to-[#1E293B] opacity-90"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ backgroundSize: "200% 200%", zIndex: 0 }}
        />
        <Paper
          p="xl"
          radius="lg"
          shadow="xl"
          className="w-[360px] bg-slate-800/70 backdrop-blur-md relative z-10 border border-slate-700"
        >
          <Title order={2} mb="lg" ta="center" className="text-gray-100">
            Sign In
          </Title>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Email"
              placeholder="Enter your email"
              {...form.getInputProps("email")}
              mb="sm"
              styles={{
                input: {
                  backgroundColor: "#0F172A",
                  color: "white",
                  borderColor: "#334155",
                },
                label: { color: "#CBD5E1" },
              }}
            />
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              {...form.getInputProps("password")}
              mb="sm"
              styles={{
                input: {
                  backgroundColor: "#0F172A",
                  color: "white",
                  borderColor: "#334155",
                },
                label: { color: "#CBD5E1" },
              }}
            />

            <Group justify="space-between" mb="md">
              <Checkbox
                label="Remember me"
                {...form.getInputProps("remember", { type: "checkbox" })}
                color="blue"
              />
              <Text
                size="sm"
                className="text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                Forgot Password?
              </Text>
            </Group>

            <Button
              type="submit"
              fullWidth
              radius="md"
              className="bg-blue-700 hover:bg-blue-600 font-semibold transition-all"
            >
              Login
            </Button>
          </form>
        </Paper>
      </div>
    </div>
  );
}
