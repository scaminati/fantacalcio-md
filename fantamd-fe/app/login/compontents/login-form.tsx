"use client";

import { useState } from "react";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { Form } from "@heroui/form";

import { login } from "@/app/actions/auth";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      const result = await login(username, password);

      if (result?.error) {
        setIsLoading(false);
        addToast({
          title: result?.error,
          color: "danger",
        });
      } else {
        router.push("/");
      }
    } catch (_: any) {
      setIsLoading(false);
      addToast({
        title: "Errore nella comunicazione",
        color: "danger",
      });
    }
  };

  return (
    <Card className="min-w-sm p-5 w-full">
      <CardBody>
        <LockClosedIcon className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tigh">
          Accedi
        </h2>
        <Form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            required
            autoComplete="username"
            id="username"
            isDisabled={isLoading}
            label="Username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            required
            autoComplete="current-password"
            id="password"
            isDisabled={isLoading}
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className="w-full"
            color="primary"
            isLoading={isLoading}
            size="lg"
            type="submit"
          >
            Accedi
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
}
