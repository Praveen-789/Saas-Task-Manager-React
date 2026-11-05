import {useForm} from "react-hook-form";
import { createOrganization } from "@/services/org";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FormData ={
    name:string;
    description:string;
}

interface CreateOrgProps {
    onSuccess?: () => void;
}

const CreateOrg = ({ onSuccess }: CreateOrgProps)=>{ 
    const toast = useToast();
    const { register, handleSubmit, formState:{errors, isSubmitting}, reset} = useForm<FormData>();

    const onSubmit = async(data:FormData) =>{
        try{
            await(createOrganization(data))
            reset();
            toast.toast({
                title:"Organization Created",
                description:"Your organization has been created successfully"
            })
            onSuccess?.();
        }catch{
            toast.toast({ title:"Error", description:"Failed to create organization", variant:"destructive" })
        }
    }
    return (
          <form onSubmit={handleSubmit(onSubmit)}>
      {/* <h3>Create Organization</h3> */}

      <Input
        placeholder="Organization Name"
        {...register("name", { required: "Name is required" })}
      />
      {errors.name && <p>{errors.name.message}</p>}

      <Textarea className="p-2 mt-4"
        placeholder="Description"
        {...register("description")}
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create"}
      </button>
    </form>
    
)

};

export default CreateOrg;
