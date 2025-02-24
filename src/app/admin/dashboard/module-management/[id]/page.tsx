"use client";

import { Tlecture, Tmodule } from "@/types/type";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TiFilter } from "react-icons/ti";

const ModuleLectureManagement = () => {
  const [lectures, setLectures] = useState<Tlecture[]>([]);
  const [modules, setModules] = useState<Tmodule[]>([]);
  const [courseName, setCourseName] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [lectureTitle, setLectureTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfFiles, setPdfFiles] = useState<FileList | null>(null);
  const [pdfUrls, setPdfUrls] = useState<string[]>([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchAllLectures = async () => {
      try {
        const res = await axios("http://localhost:5000/api/lectures", {
          withCredentials: true,
        });
        setLectures(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllLectures();

    // get all modules by course

    const fetchModules = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/modules/${id}`, {
          withCredentials: true,
        });
        setModules(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchModules();
  }, [id]);

  const courseFilter = {
    courseName,
    moduleName,
  };

  const filteredLectures = () => {
    const fetchLecturesWithCourseModuleName = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/lectures",
          courseFilter,
          {
            withCredentials: true,
          }
        );
        setLectures(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLecturesWithCourseModuleName();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedModule || !lectureTitle || !videoUrl) {
      alert("Please fill in all required fields!");
      return;
    }
    try {
      const handleUploadpdf = async () => {
        if (pdfFiles) {
          try {
            const urls = await uploadImageToCloudinary(pdfFiles);
            setPdfUrls(urls);
          } catch (error) {
            console.error("Upload failed:", error);
          }
        }
      };
      handleUploadpdf();
    } catch (error) {
      console.log(error);
    }

    const lectureData = {
      moduleId: selectedModule,
      title: lectureTitle,
      videoUrl,
      pdfNotes: [...pdfUrls],
    };

    const addLecture = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/lectures/create",
          lectureData,
          { withCredentials: true }
        );

        const isAdded = res.data.data;
        console.log(isAdded)
        if (isAdded) {
          setSelectedModule("");
          setLectureTitle("");
          setVideoUrl("");
          setPdfFiles(null);
          alert("lectue added successfully");
        }
      } catch (error) {
        console.log(error);
      }
    };

    addLecture();
  };

  const uploadImageToCloudinary = async (
    files: FileList
  ): Promise<string[]> => {
    const formData = new FormData();
    const uploadedUrls: string[] = [];

    // Append each file to the FormData object
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
      formData.append("upload_preset", "pdf_upload");

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
        uploadedUrls.push(response.data.secure_url); // Collect the URLs
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw new Error("Image upload failed");
      }
    }

    return uploadedUrls;
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Module & Lecture Management
      </h1>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Add Module</h2>
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Module Title"
            className="p-2 border rounded mr-2"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Module
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4 text-center">Add Lecture</h2>
        <form onSubmit={handleSubmit} className="mb-8 flex justify-center">
          <select
            className="p-2 border rounded mr-2"
            onChange={(e) => setSelectedModule(e.target.value)}
            required
          >
            <option value="">Select Module</option>
            {modules.map((mod) => (
              <option key={mod._id} value={mod._id}>
                {mod.title}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Lecture Title"
            className="p-2 border rounded mr-2"
            required
            onChange={(e) => setLectureTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Video URL"
            className="p-2 border rounded mr-2"
            onChange={(e) => setVideoUrl(e.target.value)}
            required
          />
          <input
            type="file"
            multiple
            accept="application/pdf"
            className="p-2 border rounded mr-2"
            onChange={(e) => setPdfFiles(e.target.files)}
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Lecture
          </button>
        </form>

        {/* Filter lecture */}
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold mb-4">Filter Lectures</h2>
          <div className="flex gap-4 mb-4 justify-center">
            <input
              type="text"
              placeholder="Filter by Course"
              className="p-2 border rounded"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by Module"
              className="p-2 border rounded"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
            />
            <button onClick={filteredLectures}>
              <TiFilter className="text-3xl font-bold" />
            </button>
          </div>
        </div>
      </div>

      {/* Lecture Table */}
      <div className="mb-8 py-20">
        <h2 className="text-xl font-bold mb-4">Lecture List</h2>
        <table className="w-full bg-white border rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Title</th>
              <th className="p-2">Video URL</th>
              <th className="p-2">PDF Notes</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lectures.map((lec) => (
              <tr key={lec._id} className="border-b">
                <td className="p-2">{lec.title}</td>
                <td className="p-2">
                  <a
                    href={lec.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Watch Video
                  </a>
                </td>
                <td className="p-2">
                  {lec.pdfNotes.map((pdf, pdfIndex) => (
                    <a
                      key={pdfIndex}
                      href={pdf} // Assuming pdf contains the URL
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline block"
                    >
                      PDF {pdfIndex + 1}
                    </a>
                  ))}
                </td>
                <td className="p-2 flex items-center gap-5">
                  <button className="bg-red-500 text-white px-2 py-1 rounded">
                    Delete
                  </button>
                  <button className="bg-green-500 text-white px-4 py-1 rounded">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModuleLectureManagement;
