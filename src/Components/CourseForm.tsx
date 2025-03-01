"use client";
import useCurrentUser from "@/utls/UsecurrentUser";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useState } from "react";
const CourseUpload = () => {
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { user } = useUser();
  const userEmail = user?.emailAddresses[0].emailAddress;
  const {
    data: currentUser,
    // isLoading,
    // refetch,
  } = useCurrentUser(userEmail || "");

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const uploadImageToCloudinary = async (image: File) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "course_thumb");
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      return response.data.secure_url; // Return the image URL
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw new Error("Image upload failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!thumbnail) {
      setError("Please upload a thumbnail image.");
      setIsLoading(false);
      return;
    }

    try {
      // Upload image to ImageBB
      const imageUrl = await uploadImageToCloudinary(thumbnail);

      // Send course details to the server
      const response = await axios.post(
        "https://lms-task-server.vercel.app/api/course/create",
        {
          title,
          price,
          description,
          thumbnail: imageUrl, // Send the ImageBB URL instead of the file
          authorId: currentUser?._id,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.data) {
        // Reset form
        setTitle("");
        setPrice("");
        setDescription("");
        setThumbnail(null);
        alert("Course uploaded successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error uploading course:", error);
      setError("Failed to upload course. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Upload a New Course
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thumbnail Upload */}
          <div>
            <label
              htmlFor="thumbnail"
              className="block text-sm font-medium text-gray-700"
            >
              Thumbnail
            </label>
            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter course title"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter course price"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter course description"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "Uploading..." : "Upload Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseUpload;
