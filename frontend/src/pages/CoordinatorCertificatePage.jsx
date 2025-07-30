// // // src/pages/CoordinatorCertificatePage.jsx
// // import React, { useState } from 'react';
// // import api from '../utils/axiosInstance';
// // import { toast } from 'react-toastify';

// // function CoordinatorCertificatePage() {
// //   const [template, setTemplate] = useState(null);
// //   const [dataFile, setDataFile] = useState(null);
// //   const [trainingCode, setTrainingCode] = useState('');
// //   const [message, setMessage] = useState('');

// //   const handleUpload = async () => {
// //     if (!template || !dataFile || !trainingCode) {
// //       toast.error("All fields are required.");
// //       return;
// //     }

// //     const formData = new FormData();
// //     formData.append('file', dataFile);       // 👈 Excel/CSV file with trainee data
// //     formData.append('template', template);   // 👈 .docx template

// //     try {
// //       const response = await api.post(
// //         `/certificate/generate/${trainingCode}/`,
// //         formData,
// //         {
// //           headers: {
// //             'Content-Type': 'multipart/form-data'
// //           }
// //         }
// //       );
// //       setMessage(response.data.message);
// //       toast.success("Certificates generated successfully!");
// //     } catch (err) {
// //       const errorMsg = err.response?.data?.error || "Upload failed.";
// //       setMessage(errorMsg);
// //       toast.error(errorMsg);
// //     }
// //   };

// //   return (
// //     <div className="container mt-5">
// //       <h3>📄 Generate Certificates</h3>
// //       <div className="mb-3">
// //         <label className="form-label">Training Code (e.g., IRDT3)</label>
// //         <input
// //           type="text"
// //           className="form-control"
// //           placeholder="Enter training code"
// //           value={trainingCode}
// //           onChange={(e) => setTrainingCode(e.target.value)}
// //         />
// //       </div>

// //       <div className="mb-3">
// //         <label className="form-label">Upload Certificate Template (.docx)</label>
// //         <input
// //           type="file"
// //           className="form-control"
// //           accept=".docx"
// //           onChange={(e) => setTemplate(e.target.files[0])}
// //         />
// //       </div>

// //       <div className="mb-3">
// //         <label className="form-label">Upload Trainee Data (.xlsx/.csv)</label>
// //         <input
// //           type="file"
// //           className="form-control"
// //           accept=".xlsx,.csv"
// //           onChange={(e) => setDataFile(e.target.files[0])}
// //         />
// //       </div>

// //       <button className="btn btn-success" onClick={handleUpload}>
// //         🚀 Generate Certificates
// //       </button>

// //       {message && <p className="mt-3 text-info">{message}</p>}
// //     </div>
// //   );
// // }

// // export default CoordinatorCertificatePage;





// // src/pages/CoordinatorCertificatePage.jsx
// import React, { useState } from 'react';
// import api from '../utils/axiosInstance';
// import { toast } from 'react-toastify';

// function CoordinatorCertificatePage() {
//   const [template, setTemplate] = useState(null);
//   const [dataFile, setDataFile] = useState(null);
//   const [trainingCode, setTrainingCode] = useState('');
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false); // ✅ New

//   const handleUpload = async () => {
//     if (!template || !dataFile || !trainingCode) {
//       toast.error("All fields are required.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', dataFile);       // Excel/CSV file
//     formData.append('template', template);   // .docx file

//     try {
//       setLoading(true); // ✅ Start loading
//       setMessage("Generating certificates...");

//       const response = await api.post(
//         `/certificate/generate/${trainingCode}/`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         }
//       );

//       setMessage(response.data.message || "Certificates generated successfully.");
//       toast.success("✅ Certificates generated successfully!");
//     } catch (err) {
//       const errorMsg = err.response?.data?.error || "❌ Upload failed.";
//       setMessage(errorMsg);
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false); // ✅ End loading
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h3>📄 Generate Certificates</h3>

//       <div className="mb-3">
//         <label className="form-label">Training Code (e.g., IRDT3)</label>
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Enter training code"
//           value={trainingCode}
//           onChange={(e) => setTrainingCode(e.target.value)}
//         />
//       </div>

//       <div className="mb-3">
//         <label className="form-label">Upload Certificate Template (.docx)</label>
//         <input
//           type="file"
//           className="form-control"
//           accept=".docx"
//           onChange={(e) => setTemplate(e.target.files[0])}
//         />
//       </div>

//       <div className="mb-3">
//         <label className="form-label">Upload Trainee Data (.xlsx/.csv)</label>
//         <input
//           type="file"
//           className="form-control"
//           accept=".xlsx,.csv"
//           onChange={(e) => setDataFile(e.target.files[0])}
//         />
//       </div>

//       <button className="btn btn-success" onClick={handleUpload} disabled={loading}>
//         {loading ? (
//           <>
//             <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//             Generating...
//           </>
//         ) : (
//           <>🚀 Generate Certificates</>
//         )}
//       </button>

//       {message && (
//         <div className={`mt-3 ${loading ? 'text-primary' : 'text-info'}`}>
//           {message}
//         </div>
//       )}
//     </div>
//   );
// }

// export default CoordinatorCertificatePage;







// import React, { useState } from 'react';
// import api from '../utils/axiosInstance';
// import { toast } from 'react-toastify';

// function CoordinatorCertificatePage() {
//   const [template, setTemplate] = useState(null);
//   const [dataFile, setDataFile] = useState(null);
//   const [trainingCode, setTrainingCode] = useState('');
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState(null); // ✅ For preview

//   const handleUpload = async () => {
//     if (!template || !dataFile || !trainingCode) {
//       toast.error("All fields are required.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', dataFile);       // Excel/CSV file
//     formData.append('template', template);   // .docx file

//     try {
//       setLoading(true);
//       setMessage("Generating certificates...");
//       setPreviewUrl(null); // Reset previous preview

//       const response = await api.post(
//         `/certificate/generate/${trainingCode}/`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         }
//       );

//       setMessage(response.data.message || "Certificates generated successfully.");
//       toast.success("✅ Certificates generated successfully!");

//       // ✅ Set preview URL (first one from preview_urls)
//       if (response.data.preview_urls && response.data.preview_urls.length > 0) {
//         console.log("✅ Preview URL:", response.data.preview_urls[0]);
//         setPreviewUrl(response.data.preview_urls[0]);
//       }

//     } catch (err) {
//       const errorMsg = err.response?.data?.error || "❌ Upload failed.";
//       setMessage(errorMsg);
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h3>📄 Generate Certificates</h3>

//       <div className="mb-3">
//         <label className="form-label">Training Code (e.g., IRDT3)</label>
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Enter training code"
//           value={trainingCode}
//           onChange={(e) => setTrainingCode(e.target.value)}
//         />
//       </div>

//       <div className="mb-3">
//         <label className="form-label">Upload Certificate Template (.docx)</label>
//         <input
//           type="file"
//           className="form-control"
//           accept=".docx"
//           onChange={(e) => setTemplate(e.target.files[0])}
//         />
//       </div>

//       <div className="mb-3">
//         <label className="form-label">Upload Trainee Data (.xlsx/.csv)</label>
//         <input
//           type="file"
//           className="form-control"
//           accept=".xlsx,.csv"
//           onChange={(e) => setDataFile(e.target.files[0])}
//         />
//       </div>

//       <button className="btn btn-success" onClick={handleUpload} disabled={loading}>
//         {loading ? (
//           <>
//             <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//             Generating...
//           </>
//         ) : (
//           <>🚀 Generate Certificates</>
//         )}
//       </button>

//       {message && (
//         <div className={`mt-3 ${loading ? 'text-primary' : 'text-info'}`}>
//           {message}
//         </div>
//       )}

//       {/* ✅ Preview Section */}
//       {previewUrl && (
//         <div className="mt-4">
//           <h5>🖼️ Certificate Preview</h5>
//           <iframe
//             src={previewUrl}
//             width="100%"
//             height="600px"
//             title="Certificate Preview"
//             style={{ border: '1px solid #ccc', borderRadius: '4px' }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// export default CoordinatorCertificatePage;    






// import React, { useState } from 'react';
// import api from '../utils/axiosInstance';
// import { toast } from 'react-toastify';

// function CoordinatorCertificatePage() {
//   const [template, setTemplate] = useState(null);
//   const [dataFile, setDataFile] = useState(null);
//   const [trainingCode, setTrainingCode] = useState('');
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState(null);

//   const handleUpload = async () => {
//     if (!template || !dataFile || !trainingCode) {
//       toast.error("All fields are required.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', dataFile);
//     formData.append('template', template);

//     try {
//       setLoading(true);
//       setMessage("Generating certificates...");
//       setPreviewUrl(null);

//       const response = await api.post(
//         `/certificate/generate/${trainingCode}/`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       setMessage(response.data.message || "Certificates generated successfully.");
//       toast.success("✅ Certificates generated successfully!");

//       if (response.data.preview_urls && response.data.preview_urls.length > 0) {
//         const preview = response.data.preview_urls[0];
//         console.log("✅ Preview URL:", preview);
//         setPreviewUrl(preview);
//       } else {
//         toast.info("No preview available.");
//       }
//     } catch (err) {
//       console.error("❌ Upload failed:", err);
//       const errorMsg = err.response?.data?.error || "❌ Upload failed.";
//       setMessage(errorMsg);
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h3>📄 Generate Certificates</h3>

//       {/* Training Code Input */}
//       <div className="mb-3">
//         <label className="form-label">Training Code (e.g., IRDT3)</label>
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Enter training code"
//           value={trainingCode}
//           onChange={(e) => setTrainingCode(e.target.value)}
//         />
//       </div>

//       {/* Template Upload */}
//       <div className="mb-3">
//         <label className="form-label">Upload Certificate Template (.docx)</label>
//         <input
//           type="file"
//           className="form-control"
//           accept=".docx"
//           onChange={(e) => setTemplate(e.target.files[0])}
//         />
//       </div>

//       {/* Data Upload */}
//       <div className="mb-3">
//         <label className="form-label">Upload Trainee Data (.xlsx/.csv)</label>
//         <input
//           type="file"
//           className="form-control"
//           accept=".xlsx,.csv"
//           onChange={(e) => setDataFile(e.target.files[0])}
//         />
//       </div>

//       {/* Generate Button */}
//       <button className="btn btn-success" onClick={handleUpload} disabled={loading}>
//         {loading ? (
//           <>
//             <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//             Generating...
//           </>
//         ) : (
//           <>🚀 Generate Certificates</>
//         )}
//       </button>

//       {/* Message */}
//       {message && (
//         <div className={`mt-3 ${loading ? 'text-primary' : 'text-info'}`}>
//           {message}
//         </div>
//       )}

//       {/* Download or Open Certificate */}
//       {previewUrl && (
//         <div className="mt-4">
//           <h5>🎓 Certificate Preview Link</h5>
//           <div className="d-flex gap-2">
//             <a
//               href={previewUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="btn btn-outline-primary"
//             >
//               🔍 Open in New Tab
//             </a>
//             <a
//               href={previewUrl}
//               download
//               className="btn btn-outline-success"
//             >
//               ⬇️ Download Certificate
//             </a>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CoordinatorCertificatePage;







// import React, { useState } from 'react';
// import api from '../utils/axiosInstance';
// import { toast } from 'react-toastify';

// function CoordinatorCertificatePage() {
//   const [template, setTemplate] = useState(null);
//   const [dataFile, setDataFile] = useState(null);
//   const [trainingCode, setTrainingCode] = useState('');
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState(null);

//   const handleUpload = async () => {
//     if (!template || !dataFile || !trainingCode) {
//       toast.error("All fields are required.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', dataFile);
//     formData.append('template', template);

//     try {
//       setLoading(true);
//       setMessage("Generating certificates...");
//       setPreviewUrl(null);

//       const response = await api.post(
//         `/certificate/generate/${trainingCode}/`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       setMessage(response.data.message || "Certificates generated successfully.");
//       toast.success("✅ Certificates generated successfully!");

//       if (response.data.preview_urls && response.data.preview_urls.length > 0) {
//         const preview = response.data.preview_urls[0];
//         console.log("✅ Preview URL:", preview);
//         setPreviewUrl(preview);
//       } else {
//         toast.info("No preview available.");
//       }
//     } catch (err) {
//       console.error("❌ Upload failed:", err);
//       const errorMsg = err.response?.data?.error || "❌ Upload failed.";
//       setMessage(errorMsg);
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleZipDownload = async () => {
//     if (!trainingCode) {
//       toast.error("Training code is required to download ZIP.");
//       return;
//     }

//     try {
//       const response = await api.get(`/certificate/download-zip/${trainingCode}/`, {
//         responseType: 'blob',
//       });

//       const blob = new Blob([response.data], { type: 'application/zip' });
//       const url = window.URL.createObjectURL(blob);

//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `certificates_${trainingCode}.zip`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();

//       toast.success("📦 ZIP file downloaded successfully.");
//     } catch (err) {
//       console.error("❌ ZIP download failed:", err);
//       toast.error("Failed to download ZIP file.");
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h3>📄 Generate Certificates</h3>

//       {/* Training Code Input */}
//       <div className="mb-3">
//         <label className="form-label">Training Code (e.g., IRDT3)</label>
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Enter training code"
//           value={trainingCode}
//           onChange={(e) => setTrainingCode(e.target.value)}
//         />
//       </div>

//       {/* Template Upload */}
//       <div className="mb-3">
//         <label className="form-label">Upload Certificate Template (.docx)</label>
//         <input
//           type="file"
//           className="form-control"
//           accept=".docx"
//           onChange={(e) => setTemplate(e.target.files[0])}
//         />
//       </div>

//       {/* Data Upload */}
//       <div className="mb-3">
//         <label className="form-label">Upload Trainee Data (.xlsx/.csv)</label>
//         <input
//           type="file"
//           className="form-control"
//           accept=".xlsx,.csv"
//           onChange={(e) => setDataFile(e.target.files[0])}
//         />
//       </div>

//       {/* Generate Button */}
//       <button className="btn btn-success" onClick={handleUpload} disabled={loading}>
//         {loading ? (
//           <>
//             <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//             Generating...
//           </>
//         ) : (
//           <>🚀 Generate Certificates</>
//         )}
//       </button>

//       {/* Message */}
//       {message && (
//         <div className={`mt-3 ${loading ? 'text-primary' : 'text-info'}`}>
//           {message}
//         </div>
//       )}

//       {/* Preview + Download ZIP */}
//       {previewUrl && (
//         <div className="mt-4">
//           <h5>🎓 Certificate Preview</h5>
//           <div className="d-flex gap-3 mb-2">
//             <a
//               href={previewUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="btn btn-outline-primary"
//             >
//               🔍 Open Preview
//             </a>

//             <button className="btn btn-outline-warning" onClick={handleZipDownload}>
//               📥 Download All Certificates (ZIP)
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CoordinatorCertificatePage;    



import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { toast } from 'react-toastify';

function CoordinatorCertificatePage() {
  const { code: trainingCode } = useParams(); // ✅ Get training code from URL
  const [template, setTemplate] = useState(null);
  const [dataFile, setDataFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleUpload = async () => {
    if (!template || !dataFile) {
      toast.error("Both template and data file are required.");
      return;
    }

    const formData = new FormData();
    formData.append('file', dataFile);
    formData.append('template', template);

    try {
      setLoading(true);
      setMessage("Generating certificates...");
      setPreviewUrl(null);

      const response = await api.post(
        `/certificate/generate/${trainingCode}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage(response.data.message || "Certificates generated successfully.");
      toast.success("✅ Certificates generated successfully!");

      if (response.data.preview_urls && response.data.preview_urls.length > 0) {
        const preview = response.data.preview_urls[0];
        console.log("✅ Preview URL:", preview);
        setPreviewUrl(preview);
      } else {
        toast.info("No preview available.");
      }
    } catch (err) {
      console.error("❌ Upload failed:", err);
      const errorMsg = err.response?.data?.error || "❌ Upload failed.";
      setMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleZipDownload = async () => {
    try {
      const response = await api.get(`/certificate/download-zip/${trainingCode}/`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificates_${trainingCode}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("📦 ZIP file downloaded successfully.");
    } catch (err) {
      console.error("❌ ZIP download failed:", err);
      toast.error("Failed to download ZIP file.");
    }
  };

  return (
    <div className="container mt-5">
      <h3>📄 Generate Certificates for <span className="text-primary">{trainingCode}</span></h3>

      {/* Template Upload */}
      <div className="mb-3">
        <label className="form-label">Upload Certificate Template (.docx)</label>
        <input
          type="file"
          className="form-control"
          accept=".docx"
          onChange={(e) => setTemplate(e.target.files[0])}
        />
      </div>

      {/* Data Upload */}
      <div className="mb-3">
        <label className="form-label">Upload Trainee Data (.xlsx/.csv)</label>
        <input
          type="file"
          className="form-control"
          accept=".xlsx,.csv"
          onChange={(e) => setDataFile(e.target.files[0])}
        />
      </div>

      {/* Generate Button */}
      <button className="btn btn-success" onClick={handleUpload} disabled={loading}>
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Generating...
          </>
        ) : (
          <>🚀 Generate Certificates</>
        )}
      </button>

      {/* Message */}
      {message && (
        <div className={`mt-3 ${loading ? 'text-primary' : 'text-info'}`}>
          {message}
        </div>
      )}

      {/* Preview + Download ZIP */}
      {previewUrl && (
        <div className="mt-4">
          <h5>🎓 Certificate Preview</h5>
          <div className="d-flex gap-3 mb-2">
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary"
            >
              🔍 Open Preview
            </a>

            <button className="btn btn-outline-warning" onClick={handleZipDownload}>
              📥 Download All Certificates (ZIP)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CoordinatorCertificatePage;

