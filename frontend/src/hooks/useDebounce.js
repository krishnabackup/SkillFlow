import { useEffect,useState } from "react";

export default function useDebounce(value,delay = 1000){
    const [debounce,setDebounce] = useState(value);
    useEffect(()=>{
        const t = setTimeout(() => setDebounce(value),delay);
        return () => clearTimeout(t);
    },[value,delay]);
    return debounce;
}