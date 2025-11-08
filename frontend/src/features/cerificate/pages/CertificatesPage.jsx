import { downloadPdf, getAllCertificates } from "../../../services/QuizServices"
import useCertificate from "../../../hooks/useCertificate";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CertificatePreview from "./CertificatePreviewPage";

export default function CertificatesPage() {
    const nav = useNavigate();
    const {data : certificates, isLoading , isError} = useCertificate();
    const [downloading,setDownloading] = useState(false);
    const [preview,setPreview] = useState(false);
    const [certId,setCertId] = useState(null);
    const handlePreview = async(id) => {
      setPreview(true);
      setCertId(id)
    }
    const handleDownload = async(id,userName,courseTitle) => {
        try{
     setDownloading(true);
    const response = await downloadPdf(id)
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${userName}_${courseTitle}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    } catch (error) {
      console.error("Error downloading certificate:", error);
    } finally {
      setDownloading(false);
    }
    }
  if(isLoading) return <div className='text-white text-4xl'>Loading....</div>
  if(isError)  return <div className='text-red text-4xl'>Erorr Fetching.....</div>
 if(certificates.found === false ) return         <div className="p-6 text-center text-white  text-xl">You have no certificated to show. Complete the quiz to earn certificate . Go to <Link className="text-blue-500" to="/mycourses">myCourse</Link></div>
 return (
    <>
    <div className="min-h-screen  p-6 ">
        {
            preview ? <CertificatePreview courseId={certId} setPreview={setPreview}/> : 
            certificates.map((c,index) => (
            <div key={c._id} className=" flex max-w-full  max-h-lg rounded-2xl   shadow-2xl p-6 bg-gray-400 justify-between items-center ">
          <div className="flex gap-4">
            <p>{index+1}</p>
            <h2>{c.courseTitle}</h2>
          </div>
          <div className="flex gap-4">
            <button className="bg-blue-400 rounded-full px-6 py-2 hover:bg-blue-800" onClick={() => handlePreview(c._id)}>
                Preview
            </button>
            <button className="bg-red-500 rounded-full shadow-2xl px-6 py-2 hover:bg-red-800" onClick={() => handleDownload(c._id,c.userName,c.courseTitle)}>{downloading ? "Downloading..." : "Download"}</button>
          </div>
       </div>
            ))
            }
    </div>
    </>
  )
}
