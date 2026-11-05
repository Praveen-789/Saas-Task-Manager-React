import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { registerUser } from "../services/authService.tsx"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

type RegisterForm = {
    email: string;
    name: string;
    password: string;
}

function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<RegisterForm>(); // call useForm

    const toast = useToast();
    const navigate = useNavigate();
    const onSubmit = async (data: RegisterForm) => {
        // console.log("data", data);
        try {
            const res = await registerUser(data);
            toast.toast({
                title: "Success",
                description: res.message
            })
        navigate('/login')

        } catch (error:any) {
            console.error(error)
            toast.toast({
                title: "Error",
                description: error?.message || "Something went wrong",
                variant: "destructive"
            });

        }
    }

    return (
        <div className="flex items-center justify-center h-screen" >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    type="email"
                    placeholder="Enter your Email"
                    {...register("email", { required: "Email is required" })}
                />

                {errors.email && (
                    <p className="text-sm text-red-500">
                        {errors.email.message}
                    </p>
                )}

                <Input type="text"
                    placeholder="Enter your Name"
                    {...register("name", { required: "Name is required" })} />
                {errors.name && (<p className="text-sm text-red-500">{errors.name.message}</p>)}

                <Input
                    type="password"
                    placeholder="Password"
                    {...register("password", { required: "Password is required" })}
                />
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                )}

                <Button variant="outline" type="submit" disabled={isSubmitting} className="w-full border">
                    {isSubmitting ? "Registering..." : "Register"}
                </Button>

            </form>

        </div>
    )
}

export default Register
