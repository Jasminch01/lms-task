import { Tmodule } from "@/types/type";

interface LectureFormProps {
  modules: Tmodule[];
  selectedModule: string;
  setSelectedModule: (moduleId: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  lectureTitle: string;
  setLectureTitle: (title: string) => void;
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  setPdfFiles: (files: FileList | null) => void;
}

const LectureForm = ({
  modules,
  setSelectedModule,
  handleSubmit,
  lectureTitle,
  setLectureTitle,
  videoUrl,
  setVideoUrl,
  setPdfFiles,
}: LectureFormProps) => {
  return (
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
        value={lectureTitle}
        onChange={(e) => setLectureTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Video URL"
        className="p-2 border rounded w-full md:w-auto"
        value={videoUrl}
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
  );
};

export default LectureForm;
