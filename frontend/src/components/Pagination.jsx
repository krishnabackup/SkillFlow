import React from "react";

export default function Pagination({page,total,limit,onPage}){
    const totalPages = Math.max(1,Math.ceil(total / limit));
    const pages = [];
    const start = Math.max(1,page-2);
    const end = Math.min(totalPages,start + 4);

    for(let p = start; p<=end;p++) pages.push(p);

    return(
        <>
        <div className="flex items-center gap-2 justify-center mt-6">
            <button
            className="px-3 py-1 rounded bg-violet-500 text-black disabled:opacity-50"
            onClick={() => onPage(page-1)}
            disabled={page <= 1}
            >
             Prev   
            </button>
            {
                pages.map( p => (
                    <button
                    key={p}
                    onClick={() => onPage(p)}
                    className={`px-3 py-1 rounded ${p == page ? "bg-indigo-500 text-white" : "bg-gray-800 text-grey-200"} `}
                    >
                        {
                            p
                        }
                    </button>
                ))
            }
            <button
            className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
            onClick={() => onPage(page +1 )}
            disabled = {page >= totalPages}
            >
                Next
            </button>
        </div>
        </>
    )
}