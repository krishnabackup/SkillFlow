import { useEffect, useState } from "react"
 
import { useUsers,useUpdateUsers, useDeleteUserByAdmin } from "../../../hooks/useUsers"
import Pagination from "../../../components/Pagination"
import UserCard from "../../../components/UserCard"
import CreateModel from "../componenets/CreateAdminModel"
 import { ToastContainer , Bounce, toast } from "react-toastify"
export default function ManageUsers(){
    const [page,setPage] = useState(1);
    const [query,setQuery] = useState("");
    const [isModelOpen,setModelOpen] = useState(false);
    
    const [deleteUserSuccesfully,setDeleteUserSucessfully] = useState(false)
    const {data,isError,isLoading,isFetching,error} = useUsers({
      page,
      q : query
    });
    useEffect(()=> {
      if(deleteUserSuccesfully) {
        toast.success("User removed successfully")
        setDeleteUserSucessfully(false)
      }
    },[deleteUserSuccesfully])

    const useUpdateMutate = useUpdateUsers();
    const deleteUserByAdminMutate = useDeleteUserByAdmin();
    const openModal = () => {
      setModelOpen(true);
    }
    const handlePromote = async (user_id) => {
      await useUpdateMutate.mutateAsync({id : user_id , payload : {role : "admin"} })
    }
    const handleRemove = async (user_id) => {
       try{
         await deleteUserByAdminMutate.mutateAsync(user_id);
         setDeleteUserSucessfully(true);
       }
       catch(err){
         console.error('Delete user failed', err);
         toast.error(err?.response?.data?.message || 'Failed to delete user');
       }
    }
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading courses.</div>;
  const users = data?.items || [];
  const closeModel = () => {
    setModelOpen(false);
  }
    return(
  <>
      <ToastContainer
        position="top-center"
        className="px-4 py-4 mt-4"
        autoClose={5000}
        closeOnClick={false}
        theme = "dark"
        pauseOnHover
        transition = {Bounce}
    />
         <main className="max-w-6xl mx-auto p-6">
                  <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-white">Manage Users</h1>
            
                    <div className="flex gap-3">
                      <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search Users..."
                        className="px-3 py-2 rounded bg-white/5 text-white placeholder-gray-400"
                        aria-label="Search courses"
                      />
                    </div>
                    <button className='bg-green-400 text-black rounded-full p-1 font-bold' onClick={openModal}>Add Admin user</button>
                  </header>
            
                  {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-gray-800 animate-pulse rounded" />)}
                    </div>
                  )}
            
                  {isError && <div className="text-red-400">{isError}</div>}
            
                  {!isLoading && users.length === 0 && (
                    <div className="text-gray-300">No courses found. Try different search or filters.</div>
                  )}
            
                  <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map(user => <UserCard key={user._id || user.id} user={user} onPromote={handlePromote} onRemove={handleRemove}/>)}
                  </section>
            
                  <Pagination page={data.page} total={data.total} limit={data.limit} onPage={(p) => setPage(p)} />
                <div>
                    {
                        isFetching && <p className="text-sm text-gray-400">Refreshing</p>
                    }
                </div>  
             {
                   isModelOpen && <CreateModel onClose={closeModel} /> 
           }    
                </main>
        </>
    )
}