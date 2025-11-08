import { useState } from "react";
import Confetti from "react-confetti"
import {useWindowSize}  from "react-use"
import { downloadPdf } from "../../../services/QuizServices";
import { useNavigate } from "react-router-dom";
export default function CongratualtionPage({response}) {
    const nav = useNavigate();
    const {width,height} = useWindowSize();
    const userName = response.userName;
    const courseTitle = response.courseTitle;
    const percentage = response.percentage;
    const [downloading,setDownloading] = useState(false);
    const handleDownload = async () => {
    try { 
     setDownloading(true);
     const response = await downloadPdf(userName,courseTitle,percentage)
     console.log(response);
     const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${userName}_certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading certificate:", error);
    } finally {
      setDownloading(false);
      nav("/home")
    }
     }
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* 🎊 Confetti Animation */}
      <Confetti width={width} height={height} recycle={false} numberOfPieces={400} />

      <div className="bg-white shadow-2xl rounded-2xl p-10 text-center max-w-lg border border-yellow-400 mb-40">
        <h1 className="text-4xl font-extrabold text-yellow-400 mb-4 animate-bounce">
          🎉 Congratulations!
        </h1>
        <p className="text-lg text-gray-700 mb-2">
          Well done, <span className="font-semibold text-yellow-700">{userName}</span>!
        </p>
        <p className="text-base mb-6">
          You successfully completed <span className="font-semibold">{courseTitle}</span> with a score of{" "}
          <span className="font-bold text-green-600">{percentage.toFixed(2)}%</span>.
        </p>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="bg-yellow-500 hover:bg-yellow-600 text-white text-lg px-6 py-3 rounded-xl transition-all duration-300 shadow-md"
        >
          {downloading ? "Generating..." : "Download Your Certificate"}
        </button>
        <p className="mt-6 text-sm text-gray-500 italic">
          Keep learning and achieving more! 🚀
        </p>
      </div>
    </div>
  )
}
