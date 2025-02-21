"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Course from "./Course";
export default function Courses() {
  const [courses, setcourses] = useState([]);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await axios.get("http://localhost:5000/api/courses", {
          withCredentials: true,
        });
        setcourses(courses.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourses();
  }, []);

  console.log(courses);
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-10">
          <p className="font-bold text-4xl text-center">All Courses</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, idx) => (
            <Course key={idx} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
