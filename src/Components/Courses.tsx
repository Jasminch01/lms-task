import Course from "./Course";

const courses = [
  {
    id: 1,
    image: "/course1.jpg",
    name: "Introduction to Python",
    duration: "6 Weeks",
    batch: "Batch Starts: Oct 15, 2023",
  },
  {
    id: 2,
    image: "/course2.jpg",
    name: "Advanced AI Concepts",
    duration: "8 Weeks",
    batch: "Batch Starts: Nov 1, 2023",
  },
  {
    id: 3,
    image: "/course3.jpg",
    name: "Cloud Computing with AWS",
    duration: "10 Weeks",
    batch: "Batch Starts: Nov 10, 2023",
  },
  {
    id: 4,
    image: "/course1.jpg",
    name: "Introduction to Python",
    duration: "6 Weeks",
    batch: "Batch Starts: Oct 15, 2023",
  },
  {
    id: 5,
    image: "/course2.jpg",
    name: "Advanced AI Concepts",
    duration: "8 Weeks",
    batch: "Batch Starts: Nov 1, 2023",
  },
  {
    id: 6,
    image: "/course3.jpg",
    name: "Cloud Computing with AWS",
    duration: "10 Weeks",
    batch: "Batch Starts: Nov 10, 2023",
  },
];

export default function Courses() {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-10">
          <p className="font-bold text-4xl text-center">Courses</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Course key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
