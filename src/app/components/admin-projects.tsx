import { Edit, MessageCircle, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: number
  groupNumber: number
  name: string
  supervisor: string
  numberOfStudents: number
  area: string
  status: "Accepted" | "Rejected" | string
}

interface ProjectTableProps {
  projects: Project[]
  onDelete: (id: number) => void
  onEdit: (project: Project) => void
  onMessage: (projectId: number) => void
}

export default function ProjectTable({ projects, onDelete, onEdit, onMessage }: ProjectTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[rgb(21,21,21)] text-white font-bold">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Group #</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Project Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Supervisor</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">No of Students</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Project Area</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">{project.groupNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap text-md text-gray-900">{project.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">{project.supervisor}</td>
              <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500 hidden sm:table-cell">{project.numberOfStudents}</td>
              <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">
                {project.area === "Web Development Projects" ? (
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 hidden sm:table-cell">
                    {project.area}
                  </Badge>
                ) : (
                  <Badge className="bg-gray-50 text-gray-700 border-gray-200">
                    {project.area}
                  </Badge>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge
                  className={`${
                    project.status === "Accepted"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-red-100 text-red-800 border-red-200"
                  }`}
                >
                  {project.status === "Accepted" ? "• Accepted" : "• Rejected"}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex space-x-2">
                  {/* <button
                    onClick={() => onEdit(project)}
                    className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                    aria-label="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => onMessage(project.id)}
                    className="p-1 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                    aria-label="Message"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </button> */}

                  <button
                    onClick={() => onDelete(project.id)}
                    className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
