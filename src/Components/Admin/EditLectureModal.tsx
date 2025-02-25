import { Tlecture } from "@/types/type";

interface EditLectureModalProps {
  editingLecture: Tlecture | null;
  setEditingLecture: (lecture: Tlecture | null) => void;
  handleUpdateLecture: (e: React.FormEvent) => void;
  lectureTitle: string;
  setLectureTitle: (title: string) => void;
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  setPdfFiles: (files: FileList | null) => void;
}

const EditLectureModal = ({
  editingLecture,
  setEditingLecture,
  handleUpdateLecture,
  lectureTitle,
  setLectureTitle,
  videoUrl,
  setVideoUrl,
  setPdfFiles,
}: EditLectureModalProps) => {
  if (!editingLecture) return null;

  return (
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
  );
};

export default EditLectureModal;
