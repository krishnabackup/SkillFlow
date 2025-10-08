import { useQuery} from "@tanstack/react-query";
import {fetchRecomendations} from "../services/recomendatioonservices"

export const useRecommendation = ({page,limit=12}) => {
    return useQuery({
        queryKey : ['req',page,limit],
        queryFn: () => fetchRecomendations({page,limit}),
        keepPreviousData : true,
        staleTime : 1000 * 60,
    })
}