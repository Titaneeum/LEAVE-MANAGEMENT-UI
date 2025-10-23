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

      localStorage.setItem("username", data.name);
      localStorage.setItem("email", data.email);
      localStorage.setItem("userId", data.userId);

      if (data.user_id)
        localStorage.setItem("user_id", data.user_id.toString());
      if (data.userlevel_id)
        localStorage.setItem("userlevel_id", data.userlevel_id.toString());

      const role = data.userlevel_id;
      if (role === 0) router.push("/admin/AdminTeamReq");
      else if (role === 1) router.push("/STAFF/StaffDashboard");
      else router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen w-screen overflow-hidden">
      {/* 🔹 Gradient background (same as AdminTeamReq) */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* 🔹 Subtle moving blue glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-blue-700/10 blur-3xl"
        animate={{
          x: ["-15%", "15%", "-15%"],
          y: ["-10%", "10%", "-10%"],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 🔹 Login Card */}
      <Paper
        p="xl"
        radius="lg"
        shadow="xl"
        className="relative z-10 w-[380px] bg-slate-800/70 border border-slate-700/60 backdrop-blur-lg text-white"
      >
        <div className="text-center mb-6">
          <img
            src="/safwa.logo.png"
            alt="Safwa Logo"
            className="w-20 mx-auto mb-3 drop-shadow-md"
          />
          <Title
            order={3}
            className="text-blue-100 font-semibold tracking-wide uppercase"
          >
            Leave Management System
          </Title>
        </div>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="Enter your email"
            {...form.getInputProps("email")}
            mb="sm"
            styles={{
              input: {
                backgroundColor: "#0f172a",
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
                backgroundColor: "#0f172a",
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
              className="text-blue-400 hover:text-blue-300 cursor-pointer transition-all"
            >
              Forgot Password?
            </Text>
          </Group>

          <Button
            type="submit"
            fullWidth
            radius="md"
            className="bg-blue-700 hover:bg-blue-600 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
          >
            Login
          </Button>
        </form>
      </Paper>

      {/* Footer */}
      <div className="absolute bottom-4 text-gray-400 text-xs">
        © {new Date().getFullYear()} Safwa Industries
      </div>
    </div>
  );
}
