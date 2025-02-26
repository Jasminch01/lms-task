"use client";
import EditLectureModal from "@/Components/Admin/EditLectureModal";
import LectureForm from "@/Components/Admin/LectureFrom";
import LectureTable from "@/Components/Admin/LectureTable";
import ModuleManagement from "@/Components/Admin/ModuleManagement";
import { Tcourse, Tlecture, Tmodule } from "@/types/type";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdFilterListAlt } from "react-icons/md";

const ModuleLectureManagement = () => {
  const [lectures, setLectures] = useState<Tlecture[]>([]);
  const [modules, setModules] = useState<Tmodule[]>([]); // Modules for the selected course
  const [allModules, setAllModules] = useState<Tmodule[]>([]); // All modules
  const [courses, setCourses] = useState<Tcourse[]>([]); // All courses for filtering
  const [course, setCourse] = useState<Tcourse | null>(null); // Selected course
  const [selectedModule, setSelectedModule] = useState(""); // Selected module for adding lectures
  const [lectureTitle, setLectureTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfFiles, setPdfFiles] = useState<FileList | null>(null);
  const [pdfUrls, setPdfUrls] = useState<string[]>([]);
  const [editingLecture, setEditingLecture] = useState<Tlecture | null>(null);
  console.log(lectures);
  // Filter state
  const [filterCourseId, setFilterCourseId] = useState<string>(""); // Selected course for filtering
  const [filterModuleId, setFilterModuleId] = useState<string>(""); // Selected module for filtering

  const { id } = useParams();
  const courseId = Array.isArray(id) ? id[0] : id;

  // Fetch all lectures (without filters initially)
  const fetchAllLectures = async () => {
    try {
      const res = await axios(
        "https://lms-task-server.onrender.com/api/lectures",
        { withCredentials: true }
      );
      setLectures(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch filtered lectures based on course and module
  const fetchFilteredLectures = async (courseId: string, moduleId: string) => {
    try {
      const res = await axios.get(
        `https://lms-task-server.onrender.com/api/lectures/filter?courseId=${courseId}&moduleId=${moduleId}`,
        {
          withCredentials: true,
        }
      );
      setLectures(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch all modules for the selected course
  const fetchModules = async () => {
    try {
      const res = await axios.get(
        `https://lms-task-server.onrender.com/api/modules/${courseId}`,
        { withCredentials: true }
      );
      setModules(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch all modules
  const fetchAllModules = async () => {
    try {
      const res = await axios.get(
        `https://lms-task-server.onrender.com/api/modules`,
        { withCredentials: true }
      );
      setAllModules(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch the current course details
  const fetchCourse = async () => {
    try {
      const res = await axios.get(
        `https://lms-task-server.onrender.com/api/course?courseId=${courseId}`,
        { withCredentials: true }
      );
      setCourse(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch all courses for the filter dropdown
  const fetchAllCourses = async () => {
    try {
      const res = await axios.get(
        "https://lms-task-server.onrender.com/api/courses",
        { withCredentials: true }
      );
      setCourses(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAllLectures();
    fetchModules();
    fetchCourse();
    fetchAllCourses();
    fetchAllModules();
  }, [courseId]);

  // Update modules dropdown when filterCourseId changes
  useEffect(() => {
    if (filterCourseId) {
      const filteredModules = allModules.filter(
        (module) => module.courseId === filterCourseId
      );
      setModules(filteredModules);
    } else {
      setModules(allModules); // Reset to all modules if no course is selected
    }
  }, [filterCourseId, allModules]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedModule || !lectureTitle || !videoUrl) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      if (pdfFiles) {
        const urls = await uploadImageToCloudinary(pdfFiles);
        setPdfUrls(urls);

        const lectureData = {
          moduleId: selectedModule,
          title: lectureTitle,
          videoUrl,
          pdfNotes: urls,
        };

        const res = await axios.post(
          "https://lms-task-server.onrender.com/api/lectures/create",
          lectureData,
          { withCredentials: true }
        );

        if (res.data.data) {
          setSelectedModule("");
          setLectureTitle("");
          setVideoUrl("");
          setPdfFiles(null);
          alert("Lecture added successfully");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImageToCloudinary = async (
    files: FileList
  ): Promise<string[]> => {
    const formData = new FormData();
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
      formData.append("upload_preset", "pdf_upload");

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
        uploadedUrls.push(response.data.secure_url);
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw new Error("Image upload failed");
      }
    }

    return uploadedUrls;
  };

  const handleDeleteLecture = async (lectureId: string) => {
    try {
      const res = await axios.delete(
        `https://lms-task-server.onrender.com/api/lectures?id=${lectureId}`,
        { withCredentials: true }
      );
      if (res.data.data) {
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
      if (res.data.data) {
        setLectures(
          lectures.map((lec) =>
            lec._id === editingLecture._id
              ? { ...lec, ...updatedLectureData }
              : lec
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
        <div className="mb-8">
          <p className="text-xl text-center font-bold">{course?.title}</p>
        </div>

        <ModuleManagement
          courseId={courseId}
          modules={modules}
          setModules={setModules}
        />

        <LectureForm
          modules={modules}
          selectedModule={selectedModule}
          setSelectedModule={setSelectedModule}
          handleSubmit={handleSubmit}
          lectureTitle={lectureTitle}
          setLectureTitle={setLectureTitle}
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          setPdfFiles={setPdfFiles}
        />

        <EditLectureModal
          editingLecture={editingLecture}
          setEditingLecture={setEditingLecture}
          handleUpdateLecture={handleUpdateLecture}
          lectureTitle={lectureTitle}
          setLectureTitle={setLectureTitle}
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          setPdfFiles={setPdfFiles}
        />
      </div>
      <div>
        {/* Filter Section */}
        <h2 className="text-xl font-bold mb-4">All Lectures</h2>
        <form
          className="flex flex-col md:flex-row gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            fetchFilteredLectures(filterCourseId, filterModuleId);
          }}
        >
          <select
            className="p-2 border rounded w-full md:w-auto"
            value={filterCourseId}
            onChange={(e) => setFilterCourseId(e.target.value)}
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>

          <select
            className="p-2 border rounded w-full md:w-auto"
            value={filterModuleId}
            onChange={(e) => setFilterModuleId(e.target.value)}
          >
            <option value="">Select Module</option>
            {modules.map((module) => (
              <option key={module._id} value={module._id}>
                {module.title}
              </option>
            ))}
          </select>
          <button type="submit">
            <MdFilterListAlt className="text-2xl" />
          </button>
        </form>
        <LectureTable
          lectures={lectures}
          handleDeleteLecture={handleDeleteLecture}
          handleEditLecture={handleEditLecture}
        />
      </div>
    </div>
  );
};

export default ModuleLectureManagement;
