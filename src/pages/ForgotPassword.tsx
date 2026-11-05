import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { forgotPassword } from "@/services/authService";
import { useToast } from "@/hooks/use-toast"
// import { useEffect, useState } from "react";
// import { getMembersOfOrg } from "@/services/org";

type ForgotForm = {
    email: string;
}

// type User = {
//     _id:string,
//     user: {
//         name:string,
//         email:string,
//         _id:string
//     },
//     role:string,
//     status:string
// }

export default function ForgotPassword() {
    
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotForm>();
    const { toast } = useToast();
 
    const onSubmit = async (data: ForgotForm) => {
        console.log("data", data);
        // TODO: Implement password reset logic
        try {
            const res = await forgotPassword(data);
            toast({
                title: "Email Sent",
                description: res.message
            })


        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Something went wrong",
                variant: "destructive"
            })

        }
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", { required: "Email is required" })}
                />

                {errors.email && (
                    <p className="text-sm text-red-500">
                        {errors.email.message}
                    </p>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                    variant="outline"
                >
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
            </form>
        </div>
    )
}