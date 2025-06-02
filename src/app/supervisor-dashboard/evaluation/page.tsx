'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '@/firebase/config';
import { getDocs, collection, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

interface Project {
  id: string;
  name: string; // ✅ added title field
  description: string;
  createdBy: string;
  supervisor: string;
  evaluator?: string;
  evaluationStatus?: string;
  evaluationRemarks?: string;
}

export default function SupervisorEvaluationPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    if (auth.currentUser) {
      const displayName = auth.currentUser.displayName || '';
      setUserName(displayName);
      fetchProjects(displayName);
    }
  }, []);

  const fetchProjects = async (displayName: string) => {
    const snapshot = await getDocs(collection(db, 'projects'));
    const data: Project[] = snapshot.docs
      .map((docSnap) => {
        const raw = docSnap.data();
        return {
          id: docSnap.id,
          name: raw.name || '', // ✅ fetch project title
          description: raw.description || '',
          createdBy: raw.createdBy || '',
          supervisor: raw.supervisor || '',
          evaluator: raw.evaluator || '',
          evaluationStatus: raw.evaluationStatus || '',
          evaluationRemarks: raw.evaluationRemarks || '',
        };
      })
      .filter((p) => p.evaluator === displayName);
    setProjects(data);
  };

  const submitEvaluation = async (projectId: string) => {
    const remark = remarks[projectId];
    if (!remark) return toast.error('Please enter remarks');
    try {
      await updateDoc(doc(db, 'projects', projectId), {
        evaluationStatus: 'Evaluated',
        evaluationRemarks: remark,
      });
      toast.success('Evaluation submitted');
      fetchProjects(userName);
    } catch (err) {
      toast.error('Error submitting evaluation');
    }
  };

  return (
    <div className="pt-24 pl-[270px] pr-6">
      <div className="bg-black text-white px-6 py-4 rounded-md mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Evaluate Assigned Projects</h2>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Created By</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Remarks</th>
              <th className="text-left px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((proj) => (
              <tr key={proj.id} className="border-t">
                <td className="px-4 py-2">{proj.name || <i className="text-red-500">No Title</i>}</td>
                <td className="px-4 py-2">{proj.createdBy}</td>
                <td className="px-4 py-2">{proj.evaluationStatus || 'Pending'}</td>
                <td className="px-4 py-2">
                  {proj.evaluationStatus === 'Evaluated' ? (
                    <span className="text-green-600">{proj.evaluationRemarks}</span>
                  ) : (
                    <input
                      type="text"
                      placeholder="Enter remarks"
                      className="border rounded p-1 w-full"
                      value={remarks[proj.id] || ''}
                      onChange={(e) =>
                        setRemarks((prev) => ({
                          ...prev,
                          [proj.id]: e.target.value,
                        }))
                      }
                    />
                  )}
                </td>
                <td className="px-4 py-2">
                  {proj.evaluationStatus === 'Pending' && (
                    <button
                      onClick={() => submitEvaluation(proj.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                    >
                      Evaluate Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
