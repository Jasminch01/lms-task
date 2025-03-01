"use client";
import { Tmodule } from "@/types/type";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaChevronDown,
  FaChevronRight,
  FaDownload,
} from "react-icons/fa";

const LecturePage = () => {
  const [modules, setModules] = useState<Tmodule[]>([]);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
  const [selectedLectureIndex, setSelectedLectureIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { id } = useParams();

  const selectedModule = modules[selectedModuleIndex];
  const selectedLecture = selectedModule?.lectures[selectedLectureIndex];

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await axios.get(`https://lms-task-server.vercel.app/api/modules/${id}`, {
          withCredentials: true,
        });
        const modulesWithDefaults = res.data.data.map(
          (mod: Tmodule, modIndex: number) => ({
            ...mod,
            lectures: mod.lectures.map((lec, lecIndex) => ({
              ...lec,
              completed: lec.completed || false,
              unlocked:
                (modIndex === 0 && lecIndex === 0) || lec.unlocked || false, // Unlock the first lecture of the first module
            })),
          })
        );
        setModules(modulesWithDefaults);
      } catch (error) {
        console.log(error);
      }
    };
    fetchModules();
  }, [id]);

  // Calculate progress
  const totalLectures = modules.reduce(
    (acc, mod) => acc + mod.lectures.length,
    0
  );
  const completedLectures = modules.reduce(
    (acc, mod) => acc + mod.lectures.filter((lec) => lec.completed).length,
    0
  );
  const progress = (completedLectures / totalLectures) * 100;

  // Filter lectures based on search query
  const filteredModules = modules.map((mod) => ({
    ...mod,
    lectures: mod.lectures.filter((lec) =>
      lec.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const selectLecture = (modIndex: number, lecIndex: number) => {
    const lecture = modules[modIndex].lectures[lecIndex];
    if (!lecture.unlocked) return; // Prevent selecting locked lectures
    setSelectedModuleIndex(modIndex);
    setSelectedLectureIndex(lecIndex);
  };

  const goToNextLecture = () => {
    const updatedModules = [...modules];

    updatedModules[selectedModuleIndex].lectures[
      selectedLectureIndex
    ].completed = true;

    if (selectedLectureIndex < selectedModule.lectures.length - 1) {
      updatedModules[selectedModuleIndex].lectures[
        selectedLectureIndex + 1
      ].unlocked = true;
      setSelectedLectureIndex(selectedLectureIndex + 1);
    } else if (selectedModuleIndex < modules.length - 1) {
      updatedModules[selectedModuleIndex + 1].lectures[0].unlocked = true;
      setSelectedModuleIndex(selectedModuleIndex + 1);
      setSelectedLectureIndex(0);
    }

    // Update the state with the modified modules
    setModules(updatedModules);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            {selectedLecture ? (
              <>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {selectedLecture.title}
                </h3>

                {/* Video Player */}
                <div className="relative w-full aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                  <iframe
                    key={selectedLecture.videoUrl}
                    src={selectedLecture.videoUrl}
                    title="Lecture Video"
                    className="w-full h-64 md:h-96"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* PDF Notes */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">
                    PDF Notes
                  </h4>
                  <ul className="space-y-2">
                    {selectedLecture.pdfNotes.map((pdf, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-all"
                      >
                        <a
                          href={pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 underline"
                        >
                          View PDF {index + 1}
                        </a>
                        <a
                          href={pdf}
                          download
                          className="text-green-600 hover:text-green-700 flex items-center"
                        >
                          <FaDownload className="mr-2" /> Download
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Next Button */}
                <button
                  onClick={goToNextLecture}
                  className="mt-6 w-full px-6 py-3 rounded-lg text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg transition-all"
                >
                  Next Lecture
                </button>
              </>
            ) : (
              <p className="text-gray-600 text-center">
                Select a lecture to start learning.
              </p>
            )}
          </div>

          {/* Sidebar with Modules & Expandable Lectures */}
          <div className="md:col-span-1">
            {/* Progress Bar */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Course Progress: {completedLectures}/{totalLectures} Lectures
              </h2>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search lectures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="p-5 overflow-y-scroll relative h-[32rem]">
              {filteredModules.map((mod, modIndex) => (
                <div
                  key={mod._id}
                  className="mb-6 bg-white p-4 rounded-xl shadow-lg"
                >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleModule(mod._id)}
                  >
                    <h3 className="text-xl font-bold text-gray-800">
                      {mod.title}
                    </h3>
                    {expandedModule === mod._id ? (
                      <FaChevronDown className="text-gray-600" />
                    ) : (
                      <FaChevronRight className="text-gray-600" />
                    )}
                  </div>

                  {expandedModule === mod._id && (
                    <ul className="mt-4 space-y-2">
                      {mod.lectures.map((lec, lecIndex) => (
                        <li
                          key={lec._id}
                          onClick={() => selectLecture(modIndex, lecIndex)}
                          className={`p-3 rounded-lg flex justify-between items-center transition-all ${
                            lec.unlocked
                              ? "cursor-pointer hover:bg-blue-50"
                              : "opacity-50 cursor-not-allowed"
                          } ${
                            selectedModuleIndex === modIndex &&
                            selectedLectureIndex === lecIndex
                              ? "bg-blue-100 border-l-4 border-blue-500"
                              : "bg-gray-50"
                          }`}
                        >
                          <span className="text-gray-700">{lec.title}</span>
                          {lec.completed && (
                            <FaCheckCircle className="text-green-500" />
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturePage;
