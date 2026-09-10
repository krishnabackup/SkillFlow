import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProfile, updateProfile } from "../services/userservices"

export const useProfie = () => {
    return useQuery({
        queryKey : ['profile'],
        queryFn : getProfile
    })
}

export const useUpdateProfile = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn : updateProfile,
        onSuccess :  () => qc.invalidateQueries({
            queryKey : ['profile']
        })
    })
}