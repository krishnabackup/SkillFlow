import { useState,useEffect,useRef } from "react"
import { motion } from "framer-motion";

export default function EmbededBrowser(
    {
    url,
    title = "Embeded",
    height = "600px",
    allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen",
    sandbox = "allow-scripts allow-same-origin allow-popups allow-forms",
    onMessage, // optional callback for postMessage data
    }
){

    const iframRef = useRef(null);
    const containerRef = useRef(null);
    const [isVisible,setIsVisible] = useState(false)
    const [isLoading,setIsLoading] = useState(false)
    useEffect(()=>{
        const observer = new IntersectionObserver(
            (entries) => {
                if(entries[0].isIntersecting){
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {threshold : 0.1}
        );
        if(containerRef.current) observer.observe(containerRef.current)
        return () => observer.disconnect();
    },[]);

    useEffect(()=> {
        const handleMessage = (event) => {
        if(!url) return
        const orgin = new URL(url).origin;
        if(event.orgin !== orgin) return;
        if(onMessage) onMessage(event.data);
        };
        window.addEventListener("message",handleMessage);
        return () => window.removeEventListener("message",handleMessage);
    },[url,onMessage]);
    return(
        <>
            <div ref={containerRef} className="w-full my-4 flex justify-center">
      {isVisible ? (
        <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-lg">
          {!isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full"
              />
            </div>
          )}
          <iframe
            ref={iframRef}
            src={url}
            title={title}
            style={{ width: "100%", height, border: "none" }}
            loading="lazy"
            allow={allow}
            sandbox={sandbox}
            onLoad={() => setIsLoading(true)}
          />
        </div>
      ) : (
        <div className="w-full max-w-5xl h-[400px] bg-gray-800 rounded-xl animate-pulse"></div>
      )}
      </div>
        </>
    )
}