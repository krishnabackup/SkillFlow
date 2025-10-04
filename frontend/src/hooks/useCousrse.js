import { useQuery } from "@tanstack/react-query";
import { fetchcourse } from "../services/courseservices";

export default function useCourse({page,limit=12,query,skill,difficulty}){
   return useQuery({
    queryKey : ["courses",page,limit,query,skill,difficulty],
    queryFn:() => fetchcourse({page,limit,query,skill,difficulty}),
    keepPreviousData : true,
    staleTime : 1000 * 60,
   });
}