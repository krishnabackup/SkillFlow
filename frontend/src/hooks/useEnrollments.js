import { useMutation,useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserEnrolledCourses,deleteEnrolledCourses,updateEnrolledCourses,addUserEnrolledCourses } from "../services/user_course_services";


export const useEnrollments = () => {
  return useQuery({
    queryKey : ['enrollments'],
    queryFn : () => getUserEnrolledCourses(),
    staleTime : 1000 * 60
  })
}
export const useUnEnroll = () => {
    const qc = useQueryClient();
    return useMutation(
        {
            mutationFn : (courseId) => deleteEnrolledCourses(courseId),
            onMutate : async (courseId) => {
              await qc.cancelQueries['enrollments']
              const prev = qc.getQueryData(['enrollments']);
              qc.setQueryData(['enrollments'], old => old.filter(e => String(e.course._id) !== String(courseId)))
              return {prev};
            },
            onError : (err,courseId,ctx) => qc.setQueryData(['enrollments'],ctx.prev),
            onSettled : () => qc.invalidateQueries(['enrollments'])
        }
    )
}

export const useEnrollCourse = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn : (courseId) => addUserEnrolledCourses(courseId),
        onSuccess : () => qc.invalidateQueries(['enrollments'])
    })
}