import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
import { createUserByAdmin, getProfileAdmin,updateProfileAdmin } from "../services/userservices";


export const useUsers =  ({page,query,limit=12}) => {
   return useQuery({
    queryKey : ["users",page,query,limit],
    queryFn : () => getProfileAdmin(),
    keepPreviousData : true,
    staleTime : 1000 * 60
   })
}

export const useUpdateUsers =  () => {
    const qc = useQueryClient();
    return useMutation(
        {
            mutationFn : ({id,payload}) => updateProfileAdmin(id,payload),
            onSuccess : () => qc.invalidateQueries({ queryKey: ["users"] })
        }
    )
}

export function useCreateUserByAdmin() {
const qc = useQueryClient();
return useMutation(
    {
        mutationFn : (payload) => createUserByAdmin(payload),
        onSuccess : () => qc.invalidateQueries(['users'])
    }
)
} 