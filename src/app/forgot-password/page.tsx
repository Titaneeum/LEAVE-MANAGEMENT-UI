"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Paper, Title, TextInput, Button, Text } from "@mantine/core";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\S+@\S+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      //api forgot pass
      const res = await fetch("http://localhost:4000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(
          data.message || "Password reset link has been sent to your email.",
        );
        router.push("/");
      } else {
        alert(data.message || "Unable to process request.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen w-screen overflow-hidden">
      {/* Background gradient */}
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

      {/* Soft blue glow */}
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

      {/* Card */}
      <Paper
        p="xl"
        radius="lg"
        shadow="xl"
        className="relative z-10 w-[380px] bg-slate-800/70 border border-slate-700/60 backdrop-blur-lg text-white"
      >
        <div className="text-center mb-6">
          <Title
            order={3}
            className="text-blue-100 font-semibold tracking-wide uppercase"
          >
            Forgot Password
          </Title>
          <Text size="sm" c="gray.4" mt={4}>
            Enter your email and we’ll send you a reset link.
          </Text>
        </div>

        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            mb="md"
            styles={{
              input: {
                backgroundColor: "#0f172a",
                color: "white",
                borderColor: "#334155",
              },
              label: { color: "#CBD5E1" },
            }}
          />

          <Button
            type="submit"
            fullWidth
            radius="md"
            loading={loading}
            className="bg-blue-700 hover:bg-blue-600 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
          >
            Send Reset Link
          </Button>

          <Text
            size="sm"
            mt="md"
            className="text-blue-400 hover:text-blue-300 cursor-pointer transition-all"
            onClick={() => router.push("/login")}
          >
            Back to Login
          </Text>
        </form>
      </Paper>

      <div className="absolute bottom-4 text-gray-400 text-xs">
        © {new Date().getFullYear()} Safwa Industries
      </div>
    </div>
  );
}
