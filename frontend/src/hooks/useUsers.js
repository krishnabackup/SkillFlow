import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
import { createUserByAdmin, getProfileAdmin,updateProfileAdmin,deleteUserByAdmin } from "../services/userservices";


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
        mutationFn : (payload) => createUserByAdmin({...payload,role : "admin"}),
        onSuccess : () => qc.invalidateQueries(['users'])
    }
)
} 

export function useDeleteUserByAdmin() {
    const qc = useQueryClient();
    return useMutation(
        {
            mutationFn : (id) => deleteUserByAdmin(id),
            onMutate : async(id) => {
                await qc.cancelQueries(['users'])
                const prev = qc.getQueryData(['users']);
                qc.setQueryData(['users'],old => {
                    if(!old) return old
                 return { ...old,items : old.items.filter(u => u._id !== id),total : old.total - 1};
                })
                return {prev}
            },
            onError : (err,id,ctx) => qc.setQueryData(['users'],ctx.prev),
            onSuccess : () => qc.invalidateQueries(['users']),
        }
    )
}