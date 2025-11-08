// utils/generateCertificateBuffer.js
const PDFDocument = require("pdfkit");
const path = require("path");

async function generateCertificateBuffer(userName, courseTitle, percentage) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      doc.image(path.join(__dirname, "../../assets/logo.png"), 50, 30, { width: 80 });

      doc.moveDown(3);
      doc.fontSize(28).fillColor("#2E86C1").text("Certificate of Achievement", { align: "center" });
      doc.moveDown();
      doc.fontSize(16).fillColor("black").text("This certifies that", { align: "center" });
      doc.moveDown();
      doc.font("Helvetica-Bold").fontSize(22).text(userName.toUpperCase(), { align: "center" });
      doc.moveDown();
      doc.font("Helvetica").fontSize(16).text(`has successfully completed the course "${courseTitle}"`, { align: "center" });
      doc.text(`with a score of ${percentage.toFixed(2)}%.`, { align: "center" });

      doc.image(path.join(__dirname, "../../assets/sign.png"), 400, 400, { width: 100 });
      doc.fontSize(12).text("Authorized by:", 400, 410);
      doc.fontSize(14).text("Krishna Darsh", 400, 420, { align: "left" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = generateCertificateBuffer;
