import { useQuery,useMutation,useQueryClient, QueryClient } from "@tanstack/react-query";
import { createCourse,deleteCourses,updateCourses,fetchcourseAdmin } from "../services/courseservices";

export  function useCourses({page,query,limit=12}){
    return useQuery({
        queryKey : ["courses",page,query,limit],
        queryFn : () => fetchcourseAdmin({page,query,limit}),
        keepPreviousData : true,
        staleTime : 1000 * 60
    })
}

export function useUpdateCourses(){
    const qc = useQueryClient();
    return useMutation({
        mutationFn : ({id,payload}) => updateCourses(id,payload),
        onSuccess : () => qc.invalidateQueries(['courses'])
    })
}

export function useDeleteCourses(){
    const qc =  useQueryClient();
    return useMutation(
        {
        mutationFn : (id) => deleteCourses(id),
        onMutate : async (id) => {
            await qc.cancelQueries(['courses']);
            const prev = qc.getQueryData(['courses']);
            qc.setQueryData(['courses'],old => {
                if(!old) return old
                return { ...old,items : old.items.filter(c => c._id !== id),total : old.total - 1};
            });
            return {prev}
        },
        onError : (err,id,ctx) => { qc.setQueryData(['courses'],ctx.prev);},
        onSettled : () => { qc.invalidateQueries(['courses']);}  
    });
}

export function useCreateCourses() {
    const qc =  useQueryClient();
    return useMutation({
        mutationFn : (payload) => createCourse(payload),
        onSuccess : () => qc.invalidateQueries(['courses'])
    })
}

