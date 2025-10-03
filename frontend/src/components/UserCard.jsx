
export default function UserCard({user,onPromote}){
    return(
        <div className="w-[18rem] h-[12rem] flex flex-col justify-between rounded-lg shadow-lg bg-white p-6 mb-4">
            <div>
                <span className="block text-lg font-bold text-gray-800">Name : {user.name}</span>
                <span className="block text-sm text-gray-500">Email : {user.email}</span>
            </div>
            <div>
                <span className={`inline-block px-3 py-1 rounded-full ${
                    user.role === 'admin'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-200 text-gray-700'
                }`}>
                    {user.role}
                </span>
            </div>
            {user.role !== 'admin' && (
                <button
                    onClick={() => onPromote(user._id,user.role)}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Promote to Admin
                </button>
            )}
        </div>
    )
}
