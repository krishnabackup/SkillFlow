import { useEffect, useState } from "react";
import { downloadPdf } from "../../../services/QuizServices";

export default function CertificatePreview({ courseId , setPreview }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCertificate = async () => {
      setLoading(true);
      try {
        const response = await downloadPdf(courseId);
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        console.error("Error fetching certificate:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [courseId]);
  const handleClose = () => {
    setPreview(false);
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">Certificate Preview</h1>

      {loading ? (
        <p className="text-gray-400">Generating certificate...</p>
      ) : pdfUrl ? (
        <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-4">
            <div className="flex justify-end mb-2">
                <button onClick={handleClose}>❌</button>
            </div>
          <iframe
            src={pdfUrl}
            title="Certificate Preview"
            width="100%"
            height="600px"
            className="rounded-lg"
          ></iframe>

          <div className="text-center mt-6">
            <a
              href={pdfUrl}
              download="certificate.pdf"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-lg transition"
            >
              Download Certificate
            </a>
          </div>
        </div>
      ) : (
        <p className="text-gray-400">No certificate found.</p>
      )}
    </div>
  );
}
