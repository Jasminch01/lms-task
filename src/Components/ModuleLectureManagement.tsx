import { useState, useEffect } from "react";
import axios from "axios";

type Module = {
  title: string;
  lectures: Lecture[];
};

type Lecture = {
  id: number;
  title: string;
  videoUrl: string;
  pdfs: File[];
};

const ModuleLectureManagement = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newLectureTitle, setNewLectureTitle] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);

  // Fetch modules from API (Replace with your API)
  useEffect(() => {
    axios.get("/api/modules").then((res) => setModules(res.data));
  }, []);

  // Add Module
  const handleAddModule = async () => {
    if (!newModuleTitle) return;
    const newModule: Module = {
      title: newModuleTitle,
      lectures: [],
    };

    setModules([...modules, newModule]);
    setNewModuleTitle("");

    // API call to save module
    await axios.post("/api/modules", newModule);
  };

  // Add Lecture
  const handleAddLecture = async () => {
    if (!selectedModuleId || !newLectureTitle || !newVideoUrl) return;

    const newLecture: Lecture = {
      id: Date.now(),
      title: newLectureTitle,
      videoUrl: newVideoUrl,
      pdfs: pdfFiles,
    };

    const updatedModules = modules.map((mod) =>
      mod.id === selectedModuleId
        ? { ...mod, lectures: [...mod.lectures, newLecture] }
        : mod
    );
    setModules(updatedModules);
    setNewLectureTitle("");
    setNewVideoUrl("");
    setPdfFiles([]);

    // API call to save lecture
    await axios.post(`/api/modules/${selectedModuleId}/lectures`, newLecture);
  };

  // Delete Module
//   const handleDeleteModule = async (moduleId: number) => {
//     setModules(modules.filter((mod) => mod.id !== moduleId));
//     await axios.delete(`/api/modules/${moduleId}`);
//   };

  // Delete Lecture
  const handleDeleteLecture = async (moduleId: number, lectureId: number) => {
    const updatedModules = modules.map((mod) =>
      mod.id === moduleId
        ? {
            ...mod,
            lectures: mod.lectures.filter((lec) => lec.id !== lectureId),
          }
        : mod
    );
    setModules(updatedModules);
    await axios.delete(`/api/modules/${moduleId}/lectures/${lectureId}`);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">
        Module & Lecture Management
      </h2>

      {/* Module Creation */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Module Title"
          value={newModuleTitle}
          onChange={(e) => setNewModuleTitle(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={handleAddModule}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Module
        </button>
      </div>

      {/* Lecture Creation */}
      <div className="mb-4">
        <select
          onChange={(e) => setSelectedModuleId(Number(e.target.value))}
          className="border p-2 rounded mr-2"
        >
          <option value="">Select Module</option>
          {modules.map((mod) => (
            <option key={mod.id} value={mod.id}>
              {mod.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Lecture Title"
          value={newLectureTitle}
          onChange={(e) => setNewLectureTitle(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="YouTube Video URL"
          value={newVideoUrl}
          onChange={(e) => setNewVideoUrl(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <input
          type="file"
          multiple
          onChange={(e) => setPdfFiles([...Array.from(e.target.files || [])])}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={handleAddLecture}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Lecture
        </button>
      </div>

      {/* Lecture List View */}
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Module</th>
            <th className="border p-2">Lecture Title</th>
            <th className="border p-2">Video</th>
            <th className="border p-2">PDFs</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((mod) =>
            mod.lectures.map((lec) => (
              <tr key={lec.id} className="border">
                <td className="border p-2">{mod.title}</td>
                <td className="border p-2">{lec.title}</td>
                <td className="border p-2">
                  <a
                    href={lec.videoUrl}
                    target="_blank"
                    className="text-blue-500 underline"
                  >
                    Watch Video
                  </a>
                </td>
                <td className="border p-2">
                  {lec.pdfs.map((pdf, index) => (
                    <a
                      key={index}
                      href={URL.createObjectURL(pdf)}
                      target="_blank"
                      className="text-blue-500 block"
                    >
                      PDF {index + 1}
                    </a>
                  ))}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDeleteLecture(mod.id, lec.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ModuleLectureManagement;
