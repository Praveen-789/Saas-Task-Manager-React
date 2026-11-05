import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "@/services/authService";

type ResetForm = {
    password: string;
    confirmPassword: string;
}

export default function ResetPassword() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetForm>();
    const { toast } = useToast();
    const navigate = useNavigate();
    // const [searchParams] = useSearchParams();   // to be used with query params
    // const token = searchParams.get('token');
    const {token} = useParams();


    const onSubmit = async (data: ResetForm) => {
        if (!token) {
            toast({
                title: "Error",
                description: "Invalid reset token",
                variant: "destructive"
            });
            return;
        }

        if (data.password !== data.confirmPassword) {
            toast({
                title: "Error", 
                description: "Passwords do not match",
                variant: "destructive"
            });
            return;
        }

        try {
            
            // console.log("Reset password data:", { ...data, token });
            const res = await resetPassword(token, data);
            toast({
                title: "Success",
                description: res.message
            });
            navigate('/login');
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Something went wrong",
                variant: "destructive"
            });
        }
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold">Reset Password</h2>
                    <p className="text-gray-600">Enter your new password</p>
                </div>

                <Input
                    type="text"
                    placeholder="New Password"
                    {...register("password", { 
                        required: "Password is required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters"
                        }
                    })}
                />

                {errors.password && (
                    <p className="text-sm text-red-500">
                        {errors.password.message}
                    </p>
                )}

                <Input
                    type="text"
                    placeholder="Confirm New Password"
                    {...register("confirmPassword", { 
                        required: "Please confirm your password"
                    })}
                />

                {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                        {errors.confirmPassword.message}
                    </p>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                    variant="outline"
                >
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                </Button>
            </form>
        </div>
    )
}