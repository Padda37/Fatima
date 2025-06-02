'use client';
import { useEffect, useState } from "react";
import { Navbar } from "@/app/components/Navbar";
import { db, auth } from "@/app/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

interface Project {
  id: string;
  name: string;
  supervisor: string;
  type: string;
  groupMembers: string[];
  degreeType: string;
  status: string;
}

export default function ProjectsUnderMe() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const querySnapshot = await getDocs(collection(db, 'projects'));
      const approved = querySnapshot.docs
        .map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as any))
        .filter(project =>
          project.supervisor === user.displayName &&
          project.status === "Approved"
        );

      setProjects(approved);
    };

    fetchProjects();
  }, []);

  const handleDelete = async (projectId: string) => {
    const confirm = window.confirm("Are you sure you want to delete this project?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'projects', projectId));
      setProjects(prev => prev.filter(p => p.id !== projectId));
      alert("Project deleted successfully.");
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project.");
    }
  };

  return (
    <div className="flex flex-col flex-1 md:ml-64">
      {/* Navbar */}
      <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-20">
        <Navbar />
      </header>

      {/* Main Content */}
      <div className="container mx-auto mt-9 py-8 px-4">
        <h2 className="text-xl font-bold mb-4">Projects under My Supervision</h2>
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full table-auto text-sm text-center">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-2">S/NO</th>
                <th className="px-4 py-2">Project Name</th>
                <th className="px-4 py-2">Supervisor</th>
                <th className="px-4 py-2">Project Type</th>
                <th className="px-4 py-2">Group Members</th>
                <th className="px-4 py-2">Degree Type</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, index) => (
                <tr key={p.id} className="border-b">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.supervisor}</td>
                  <td className="px-4 py-2">{p.type}</td>
                  <td className="px-4 py-2">{(p.groupMembers || []).join(', ')}</td>
                  <td className="px-4 py-2">{p.degreeType || 'N/A'}</td>
                  <td className="px-4 py-2">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-200 text-red-800 px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-4 text-gray-500">
                    No approved projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
