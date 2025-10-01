import { useQuery } from "@tanstack/react-query";
import { fetchcourse } from "../services/courseservices";

export default function useCourse({page,query,skill,difficulty}){
   return useQuery({
    queryKey : ["courses",page,query,skill,difficulty],
    queryFn:() => fetchcourse({page,query,skill,difficulty}),
    keepPreviousData : true,
    staleTime : 1000 * 60,
   });
}