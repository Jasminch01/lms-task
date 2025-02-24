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

  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [moduleTitle, setModuleTitle] = useState("");
  const [editedModuleId, setEditedModuleId] = useState("");
  const [editingLecture, setEditingLecture] = useState<Tlecture | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchAllLectures = async () => {
      try {
        const res = await axios("https://lms-task-server.onrender.com/api/lectures", {
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
        const res = await axios.get(`https://lms-task-server.onrender.com/api/modules/${id}`, {
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
          "https://lms-task-server.onrender.com/api/lectures",
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
          "https://lms-task-server.onrender.com/api/lectures/create",
          lectureData,
          { withCredentials: true }
        );

        const isAdded = res.data.data;
        console.log(isAdded);
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

  const handleEdit = () => {
    if (selectedModule) {
      const moduleToEdit = modules.find((mod) => mod._id === selectedModule);
      if (moduleToEdit) {
        setEditedTitle(moduleToEdit.title);
        setEditedModuleId(moduleToEdit._id);
        setEditMode(true);
      } else {
        console.error("Module not found");
      }
    }
  };

  const handleUpdate = () => {
    // update operation

    const updateModule = async () => {
      try {
        const res = await axios.put(
          `https://lms-task-server.onrender.com/api/modules/${editedModuleId}`,
          { editedTitle },
          {
            withCredentials: true,
          }
        );
        const update = res.data.data;

        if (update) {
          alert("module updated success");
        }
      } catch (error) {
        console.log(error);
      }
    };
    updateModule();

    setEditMode(false);
  };

  const handleDelete = () => {
    const updateModule = async () => {
      try {
        const res = await axios.delete(
          `https://lms-task-server.onrender.com/api/modules/${selectedModule}`,
          {
            withCredentials: true,
          }
        );
        const update = res.data.data;

        if (update) {
          alert("module deleted success");
        }
      } catch (error) {
        console.log(error);
      }
    };
    updateModule();
  };

  const handleAddModule = () => {
    const updateModule = async () => {
      try {
        const res = await axios.post(
          `https://lms-task-server.onrender.com/api/modules/create`,
          { courseId: id, title: moduleTitle },
          {
            withCredentials: true,
          }
        );
        const update = res.data.data;

        if (update) {
          alert("module added success");
          setModuleTitle("");
        }
      } catch (error) {
        console.log(error);
      }
    };
    updateModule();
  };

  const handleDeleteLecture = async (lectureId: string) => {
    try {
      const res = await axios.delete(
        `https://lms-task-server.onrender.com/api/lectures?id=${lectureId}`,
        {
          withCredentials: true,
        }
      );
      const isDeleted = res.data.data;
      if (isDeleted) {
        setLectures(lectures.filter((lec) => lec._id !== lectureId));
        alert("Lecture deleted successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditLecture = (lecture: Tlecture) => {
    setEditingLecture(lecture);
    setLectureTitle(lecture.title);
    setVideoUrl(lecture.videoUrl);
    setPdfUrls(lecture.pdfNotes);
  };

  const handleUpdateLecture = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingLecture) return;

    const updatedLectureData = {
      title: lectureTitle,
      videoUrl,
      pdfNotes: pdfUrls,
    };

    try {
      const res = await axios.put(
        `https://lms-task-server.onrender.com/api/lectures?id=${editingLecture._id}`,
        updatedLectureData,
        { withCredentials: true }
      );
      const isUpdated = res.data.data;
      if (isUpdated) {
        setLectures(
          lectures.map((lec) =>
            lec._id === editingLecture._id ? { ...lec, ...updatedLectureData } : lec
          )
        );
        setEditingLecture(null);
        setLectureTitle("");
        setVideoUrl("");
        setPdfUrls([]);
        alert("Lecture updated successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">
        Module & Lecture Management
      </h1>
      <hr />

      <div className="max-w-7xl mx-auto mt-10">
        <h2 className="text-xl font-bold mb-4 text-center">Add Module</h2>
        <div className="mb-8 flex flex-col md:flex-row justify-center gap-2">
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Module Title"
              value={moduleTitle}
              className="p-2 border rounded w-full md:w-auto"
              onChange={(e) => setModuleTitle(e.target.value)}
            />
            <button
              onClick={handleAddModule}
              className="bg-green-500 text-white px-4 py-2 rounded w-full md:w-auto"
            >
              Add Module
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-2 items-center">
            <select
              className="p-2 border rounded w-full md:w-auto"
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
            <div className="flex flex-col md:flex-row gap-2 w-full">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded w-full md:w-auto"
                onClick={handleDelete}
              >
                Delete Module
              </button>
              {editMode ? (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto"
                  onClick={() => handleUpdate()}
                >
                  Update
                </button>
              ) : (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded w-full md:w-auto"
                  onClick={handleEdit}
                >
                  Edit
                </button>
              )}
            </div>
            {editMode && (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="p-2 border rounded w-full md:w-auto"
              />
            )}
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4 text-center">Add Lecture</h2>
        <form
          onSubmit={handleSubmit}
          className="mb-8 flex flex-col md:flex-row md:justify-center gap-3"
        >
          <select
            className="p-2 border rounded w-full md:w-auto"
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
            className="p-2 border rounded w-full md:w-auto"
            required
            onChange={(e) => setLectureTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Video URL"
            className="p-2 border rounded w-full md:w-auto"
            onChange={(e) => setVideoUrl(e.target.value)}
            required
          />

          <input
            type="file"
            multiple
            accept="application/pdf"
            className="p-2 border rounded w-full md:w-auto"
            onChange={(e) => setPdfFiles(e.target.files)}
          />

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded w-full md:w-auto"
          >
            Add Lecture
          </button>
        </form>

        {/* Filter lecture */}
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold mb-4">Filter Lectures</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-4 justify-center">
            <input
              type="text"
              placeholder="Filter by Course"
              className="p-2 border rounded w-full md:w-auto"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by Module"
              className="p-2 border rounded w-full md:w-auto"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
            />
            <button onClick={filteredLectures} className="w-full md:w-auto">
              <TiFilter className="text-3xl font-bold mx-auto" />
            </button>
          </div>
        </div>
      </div>

      {/* Lecture Table */}
      <div className="mb-8 py-10">
        <h2 className="text-xl font-bold mb-4">Lecture List</h2>
        <div className="overflow-x-auto">
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
                  <td className="p-2 flex items-center gap-2 md:gap-5">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm md:text-base"
                      onClick={() => handleDeleteLecture(lec._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded text-sm md:text-base"
                      onClick={() => handleEditLecture(lec)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Lecture Modal */}
      {editingLecture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Lecture</h2>
            <form onSubmit={handleUpdateLecture}>
              <input
                type="text"
                placeholder="Lecture Title"
                value={lectureTitle}
                onChange={(e) => setLectureTitle(e.target.value)}
                className="p-2 border rounded w-full mb-4"
                required
              />
              <input
                type="text"
                placeholder="Video URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="p-2 border rounded w-full mb-4"
                required
              />
              <input
                type="file"
                multiple
                accept="application/pdf"
                onChange={(e) => setPdfFiles(e.target.files)}
                className="p-2 border rounded w-full mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLecture(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleLectureManagement;