import {useQuery,useMutation, useQueryClient} from "@tanstack/react-query"
import { generateRoadmap,getRoadmap } from "../services/roadmapservices"

export const useRoadmap = () => {
  return useQuery({
   queryKey : ['roadmap'],
   queryFn : () => getRoadmap()
  })
}

export const useGenerateRoadmap = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn : () => generateRoadmap(),
        onSuccess : () => qc.invalidateQueries['roadmap']
    })
} 

