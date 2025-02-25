import { TcourseProps } from "@/types/type";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import useCurrentUser from "@/utls/UsecurrentUser";

const Course = ({ course }: TcourseProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useUser();
  const userEmail = user?.emailAddresses[0].emailAddress;
  const [editedCourse, setEditedCourse] = useState({
    title: course.title,
    description: course.description,
    price: course.price,
  });

  const {
    data: currentUser,
    // isLoading,
    // refetch,
  } = useCurrentUser(userEmail || "");
  const editRef = useRef<HTMLDivElement>(null); // Ref for the editable area
console.log(currentUser)
  // Handle clicks outside the editable area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editRef.current && !editRef.current.contains(event.target as Node)) {
        setIsEditing(false); // Close edit mode
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `https://lms-task-server.onrender.com/api/courses?courseId=${course._id}`,
        editedCourse,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setIsEditing(false);
        alert("Course updated successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `https://lms-task-server.onrender.com/api/courses?courseId=${course._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        alert("Course deleted successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="border border-gray-200 rounded-lg shadow-lg bg-white overflow-hidden flex flex-col">
        {/* Course Image */}
        <div className="w-full h-48 relative">
          <Image
            src={`${course.thumbnail}`}
            alt={course.title}
            layout="fill"
            objectFit="cover"
            onError={(e) => {
              e.currentTarget.src = "/fallback-image.png"; // Local fallback image
            }}
          />
        </div>
        <div className="p-6 flex flex-col flex-grow" ref={editRef}>
          {isEditing ? (
            <>
              <input
                type="text"
                name="title"
                value={editedCourse.title}
                onChange={handleChange}
                className="text-xl font-poppins font-bold text-gray-900 mb-2 border rounded p-2"
              />
              <textarea
                name="description"
                value={editedCourse.description}
                onChange={handleChange}
                className="text-gray-600 font-inter mb-4 border rounded p-2"
              />
              <input
                type="text"
                name="price"
                value={editedCourse.price}
                onChange={handleChange}
                className="text-gray-600 font-inter mb-4 border rounded p-2"
              />
            </>
          ) : (
            <>
              <h2 className="text-xl font-poppins font-bold text-gray-900 mb-2">
                {course.title}
              </h2>
              <p className="text-gray-600 font-inter mb-4">
                {course.description}
              </p>
              <p className="text-gray-600 font-inter mb-4">
                Price: ${course.price}
              </p>
            </>
          )}

          {currentUser?.role === "admin" ? (
            <div className="space-y-2">
              {isEditing ? (
                <button
                  onClick={handleUpdate}
                  className="mt-auto bg-green-500 text-white font-poppins font-semibold py-2 px-4 rounded-lg transition duration-300 w-full"
                >
                  Update
                </button>
              ) : (
                <button
                  onClick={handleEdit}
                  className="mt-auto bg-[#2563EB] text-white font-poppins font-semibold py-2 px-4 rounded-lg transition duration-300 w-full"
                >
                  Edit
                </button>
              )}

              <button
                onClick={handleDelete}
                className="mt-auto bg-red-500 text-white font-poppins font-semibold py-2 px-4 rounded-lg transition duration-300 w-full"
              >
                Delete
              </button>

              <div>
                <Link href={`/admin/dashboard/module-management/${course._id}`}>
                  <button className="mt-auto bg-green-500 text-white font-poppins font-semibold py-2 px-4 rounded-lg transition duration-300 w-full">
                    Manage
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <Link href={`/course/${course._id}`}>
              <button className="mt-auto bg-[#2563EB] text-white font-poppins font-semibold py-2 px-4 rounded-lg transition duration-300 w-full">
                Details
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Course;
