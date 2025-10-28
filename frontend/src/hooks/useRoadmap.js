import {useQuery,useMutation, useQueryClient} from "@tanstack/react-query"
import { generateRoadmap,getRoadmap ,deleteRoadmap } from "../services/roadmapservices"

export const useRoadmap = () => {
  return useQuery({
   queryKey : ['roadmap'],
   queryFn : () => getRoadmap()
  })
}

export const useDeleteRoadmap = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn : (id) => deleteRoadmap(id),
    onMutate : async (id) => {
      await qc.cancelQueries(['roadmap']);
      const prev = qc.getQueryData(['roadmap']);
      qc.setQueryData(['roadmap'], old => {
  if (!old || !Array.isArray(old.roadmaps)) return old;
  return {
    ...old,
    roadmaps: old.roadmaps.filter(r => String(r._id) !== String(id))
  };
});
return {prev}
},
    onError : (err,id,ctx) => {
      if(ctx && ctx.prev) qc.setQueryData(['roadmap'],ctx.prev);
      },
    onSuccess : () => qc.invalidateQueries(['roadmap']) 
  });
}
export const useGenerateRoadmap = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn : (goal) => generateRoadmap(goal),
        onSuccess : () => qc.invalidateQueries['roadmap']
    })
} 

