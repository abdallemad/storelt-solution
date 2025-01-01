"use client";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authFormSchema } from "@/lib/validator/form-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { createAccountAction, signinUser } from "@/lib/actions/user.action";
import OTPModal from "./otp-modal";

type FormType = "sign-in" | "sign-up";

function AuthForm({ type }: { type: FormType }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState<string | null>(null);
  const formSchema = authFormSchema(type);
  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const handleSubmit = async ({ fullname, email }: FormValues) => {
    setIsLoading(true);
    setErrorMessage("");
    const isSignUp = type === "sign-up";
    try {
      const user = isSignUp
        ? await createAccountAction({ fullname: fullname || "", email })
        : await signinUser(email);
      setAccountId(user.accountId);
    } catch (error) {
      setErrorMessage("Failed to create an account, Please try again!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          {/* full name */}
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel htmlFor="fullname" className="shad-form-label">
                      Full Name
                    </FormLabel>
                    <Input
                      {...field}
                      id="fullname"
                      placeholder="Enter Your fullname..."
                      className="shad-input"
                    />
                  </div>
                  <FormMessage {...field} className="shad-form-message" />
                </FormItem>
              )}
            />
          )}
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel htmlFor="email" className="shad-form-label">
                    Email
                  </FormLabel>
                  <Input
                    {...field}
                    id="email"
                    placeholder="Enter Your email..."
                    className="shad-input"
                  />
                </div>
                <FormMessage {...field} className="shad-form-message" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="form-submit-button"
            disabled={isLoading}
          >
            {type === "sign-in" ? "Sign In" : "Sign Up"}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}
          </Button>

          {errorMessage && (
            <>
              <p className="error-message">*{errorMessage}</p>
            </>
          )}
          <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {type === "sign-in"
                ? "Don't have an account"
                : "Already have an account"}
              <Link
                href={type === "sign-in" ? "sign-up" : "sign-in"}
                className="ml-1 font-medium text-brand"
              >
                {type === "sign-in" ? "Sign Up" : "Sign In"}
              </Link>
            </p>
          </div>
        </form>
      </Form>
      {accountId && (
        <OTPModal email={form.getValues("email")} accountId={accountId} />
      )}
    </>
  );
}

export default AuthForm;
