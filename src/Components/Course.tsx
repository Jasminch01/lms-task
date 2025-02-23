import { TcourseProps } from "@/types/type";
import useCurrentUser from "@/utls/UsecurrentUser";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Course = ({ course }: TcourseProps) => {
  const { currentUser } = useCurrentUser();
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
        <div className="p-6 flex flex-col flex-grow">
          <h2 className="text-xl font-poppins font-bold text-gray-900 mb-2">
            {course.title}
          </h2>

          <p className="text-gray-600 font-inter mb-4">{course.description}</p>

          <Link
            href={
              currentUser?.role === "admin"
                ? `/admin/dashboard/module-management/${course._id}`
                : `/course/${course._id}`
            }
          >
            <button className="mt-auto bg-[#2563EB] text-white font-poppins font-semibold py-2 px-4 rounded-lg transition duration-300 w-full">
              Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Course;
