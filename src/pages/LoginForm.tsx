// import React from 'react'
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button';
import { loginUser } from "../services/authService.tsx";
// import { useToast } from "@/hooks/use-toast";
import {useToast} from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";

const schema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

// type LoginFormData = {
//     email: string;
//     password: string;
// }
type LoginFormData = z.infer<typeof schema>;

export default function LoginForm() {
    const toast = useToast();
    const navigate = useNavigate();
    const { login } = useAppContext();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } =  useForm<LoginFormData>({
  resolver: zodResolver(schema),
});

    const onSubmit = async (data: LoginFormData) => {
        // console.log("data", data);
        try {
            const res = await loginUser(data)
            // localStorage.setItem("token", res.token);
            console.log("res",res)
            login(res.data, res.token);
            toast.toast({
                title: "Success",
                description: res.message
            });

            navigate("/dashboard");
        } catch (error) {
            console.error(error)
            const message = isAxiosError<{ message?: string }>(error)
                ? error.response?.data?.message || error?.message
                : "Login failed";

            toast.toast({
                title: "Error",
                description: message,
                variant: "destructive"
            });
        }

    }
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div>
                    <input type='email' placeholder='email' className='w-full border p-2 rounded'
                        {...register("email", { required: "Email is  Required" })} />
                    {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
                </div>

                <div>
                    <input type="password" placeholder='Password' className='w-full p-2 border rounded'
                        {...register('password', { required: "Password is required" })} />
                    {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
                </div>

                {/* <button type='submit' disabled={isSubmitting} className="w-full bg-black text-white p-2 rounded"
                >
                    Login1
                </button>

                <Button /> */}

                <Button variant="outline" type="submit" disabled={isSubmitting} className="w-full border">
                    {isSubmitting ? "Logging in..." : "Login"}
                </Button>

            </form>

        </div>
    )
}


