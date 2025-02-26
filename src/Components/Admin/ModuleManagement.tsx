import { useState } from "react";
import axios from "axios";
import { Tmodule } from "@/types/type";
import toast from "react-hot-toast";

interface ModuleManagementProps {
  courseId: string | undefined;
  modules: Tmodule[];
  setModules: (modules: Tmodule[]) => void;
}

const ModuleManagement = ({
  courseId,
  modules,
  setModules,
}: ModuleManagementProps) => {
  const [moduleTitle, setModuleTitle] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedModuleId, setEditedModuleId] = useState("");

  const handleAddModule = async () => {
    try {
      const res = await axios.post(
        `https://lms-task-server.onrender.com/api/modules/create`,
        { courseId, title: moduleTitle },
        { withCredentials: true }
      );
      if (res.data.data) {
        setModules([...modules, res.data.data]);
        toast.success("Added a new module");
        setModuleTitle("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = () => {
    const moduleToEdit = modules.find((mod) => mod._id === selectedModule);
    if (moduleToEdit) {
      setEditedTitle(moduleToEdit.title);
      setEditedModuleId(moduleToEdit._id);
      setEditMode(true);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `https://lms-task-server.onrender.com/api/modules/${editedModuleId}`,
        { editedTitle },
        { withCredentials: true }
      );
      if (res.data.data) {
        setModules(
          modules.map((mod) =>
            mod._id === editedModuleId ? res.data.data : mod
          )
        );
        toast.success("module updated successfully");
        setEditMode(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `https://lms-task-server.onrender.com/api/modules/${selectedModule}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.data) {
        setModules(modules.filter((mod) => mod._id !== selectedModule));
        toast.success("Module Deleted successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mb-8 flex flex-col md:flex-row justify-center gap-2">
      <div className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          placeholder="Module Title"
          value={moduleTitle}
          className="p-2 border rounded w-full md:w-auto"
          onChange={(e) => setModuleTitle(e.target.value)}
        />
        <button
          onClick={handleAddModule}
          className="bg-green-500 text-white px-4 py-2 rounded w-full md:w-auto"
        >
          Add Module
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-2 items-center">
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
        <div className="flex flex-col md:flex-row gap-2 w-full">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded w-full md:w-auto"
            onClick={handleDelete}
          >
            Delete Module
          </button>
          {editMode ? (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto"
              onClick={handleUpdate}
            >
              Update
            </button>
          ) : (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded w-full md:w-auto"
              onClick={handleEdit}
            >
              Edit
            </button>
          )}
        </div>
        {editMode && (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="p-2 border rounded w-full md:w-auto"
          />
        )}
      </div>
    </div>
  );
};

export default ModuleManagement;
