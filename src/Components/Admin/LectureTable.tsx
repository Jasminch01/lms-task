import { Tlecture } from "@/types/type";

interface LectureTableProps {
  lectures: Tlecture[];
  handleDeleteLecture: (lectureId: string) => void;
  handleEditLecture: (lecture: Tlecture) => void;
}

const LectureTable = ({
  lectures,
  handleDeleteLecture,
  handleEditLecture,
}: LectureTableProps) => {
  return (
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
                      href={pdf}
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
  );
};

export default LectureTable;
