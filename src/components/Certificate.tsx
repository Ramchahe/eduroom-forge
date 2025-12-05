import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Award } from "lucide-react";

interface CertificateProps {
  studentName: string;
  courseName: string;
  completionDate: string;
  score: number;
  instructorName?: string;
}

export const Certificate = ({
  studentName,
  courseName,
  completionDate,
  score,
  instructorName = "Course Instructor",
}: CertificateProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!certificateRef.current) return;

    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const certificateContent = certificateRef.current.innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate - ${studentName}</title>
          <style>
            @page {
              size: landscape;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 20px;
              font-family: 'Georgia', serif;
              background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .certificate {
              background: linear-gradient(135deg, #fffef7 0%, #fff9e6 100%);
              padding: 60px;
              border: 8px double #c9a227;
              box-shadow: 0 0 30px rgba(0,0,0,0.3);
              max-width: 900px;
              width: 100%;
              text-align: center;
              position: relative;
            }
            .certificate::before {
              content: '';
              position: absolute;
              top: 20px;
              left: 20px;
              right: 20px;
              bottom: 20px;
              border: 2px solid #c9a227;
              pointer-events: none;
            }
            .header {
              color: #1e3a5f;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 4px;
              margin-bottom: 10px;
            }
            .title {
              color: #c9a227;
              font-size: 48px;
              font-weight: bold;
              margin: 20px 0;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            }
            .subtitle {
              color: #555;
              font-size: 16px;
              margin-bottom: 30px;
            }
            .student-name {
              color: #1e3a5f;
              font-size: 36px;
              font-style: italic;
              margin: 20px 0;
              border-bottom: 2px solid #c9a227;
              padding-bottom: 10px;
              display: inline-block;
            }
            .course-name {
              color: #333;
              font-size: 24px;
              margin: 20px 0;
            }
            .score {
              color: #1e3a5f;
              font-size: 20px;
              font-weight: bold;
              margin: 20px 0;
            }
            .details {
              display: flex;
              justify-content: space-between;
              margin-top: 40px;
              padding-top: 20px;
            }
            .detail-item {
              text-align: center;
            }
            .detail-label {
              color: #777;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .detail-value {
              color: #333;
              font-size: 16px;
              margin-top: 5px;
              font-weight: bold;
            }
            .signature-line {
              border-top: 1px solid #333;
              width: 200px;
              margin: 0 auto;
              margin-top: 10px;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          ${certificateContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="space-y-4">
      {/* Preview */}
      <div 
        ref={certificateRef}
        className="certificate bg-gradient-to-br from-amber-50 to-amber-100 p-8 md:p-12 border-8 border-double border-amber-600 relative mx-auto max-w-4xl shadow-2xl"
        style={{ aspectRatio: "1.414/1" }}
      >
        {/* Inner border */}
        <div className="absolute inset-4 border-2 border-amber-600 pointer-events-none" />
        
        <div className="text-center relative z-10">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <Award className="h-8 w-8 text-primary" />
          </div>
          <p className="header text-primary text-xs tracking-[0.3em] uppercase">
            Certificate of Completion
          </p>
          
          {/* Title */}
          <h1 className="title text-amber-700 text-3xl md:text-5xl font-bold my-6 drop-shadow-sm font-serif">
            Certificate
          </h1>
          
          <p className="subtitle text-muted-foreground text-sm">
            This is to certify that
          </p>
          
          {/* Student Name */}
          <h2 className="student-name text-primary text-2xl md:text-4xl italic my-4 border-b-2 border-amber-600 pb-2 inline-block px-8 font-serif">
            {studentName}
          </h2>
          
          <p className="text-muted-foreground text-sm mt-4">
            has successfully completed the course
          </p>
          
          {/* Course Name */}
          <h3 className="course-name text-foreground text-lg md:text-2xl my-4 font-semibold">
            {courseName}
          </h3>
          
          {/* Score */}
          <p className="score text-primary text-lg font-bold">
            with a score of {score}%
          </p>
          
          {/* Details */}
          <div className="details flex justify-between mt-8 pt-4 border-t border-amber-300">
            <div className="detail-item text-center flex-1">
              <p className="detail-label text-muted-foreground text-xs uppercase tracking-wider">Date</p>
              <p className="detail-value text-foreground font-semibold mt-1">{completionDate}</p>
            </div>
            <div className="detail-item text-center flex-1">
              <p className="detail-label text-muted-foreground text-xs uppercase tracking-wider">Instructor</p>
              <p className="detail-value text-foreground font-semibold mt-1">{instructorName}</p>
              <div className="signature-line border-t border-foreground w-32 mx-auto mt-2" />
            </div>
            <div className="detail-item text-center flex-1">
              <p className="detail-label text-muted-foreground text-xs uppercase tracking-wider">Certificate ID</p>
              <p className="detail-value text-foreground font-semibold mt-1 text-xs">
                {`CERT-${Date.now().toString(36).toUpperCase()}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="flex justify-center">
        <Button onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          Download Certificate
        </Button>
      </div>
    </div>
  );
};

export default Certificate;