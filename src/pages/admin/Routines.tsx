import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoutines, deleteRoutine, assignRoutine } from '../../api/routines';
import { getUsers } from '../../api/users';
import type { Routine } from '../../types';
import { Plus, Pencil, Trash2, UserPlus } from 'lucide-react';

export default function Routines() {
  const qc = useQueryClient();
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [assignRoutineId, setAssignRoutineId] = useState<number | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  const { data: routines = [], isLoading } = useQuery({ queryKey: ['routines'], queryFn: getRoutines });
  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: getUsers });

  const deleteMutation = useMutation({
    mutationFn: deleteRoutine,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['routines'] }); setConfirmId(null); },
  });

  const assignMutation = useMutation({
    mutationFn: ({ id, userIds }: { id: number; userIds: number[] }) => assignRoutine(id, userIds),
    onSuccess: () => { setAssignRoutineId(null); setSelectedUserIds([]); },
  });

  const toggleUser = (userId: number) =>
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );

  if (isLoading) return <div className="text-gray-500">Cargando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Rutinas</h2>
        <Link
          to="/admin/routines/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Nueva rutina
        </Link>
      </div>

      <div className="space-y-3">
        {routines.map((routine) => (
          <RoutineCard
            key={routine.id}
            routine={routine}
            onDelete={() => setConfirmId(routine.id)}
            onAssign={() => { setAssignRoutineId(routine.id); setSelectedUserIds([]); }}
          />
        ))}
        {routines.length === 0 && (
          <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200">
            No hay rutinas registradas.
          </div>
        )}
      </div>

      {/* Confirm delete */}
      {confirmId !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Eliminar rutina</h3>
            <p className="text-sm text-gray-600 mb-4">¿Estás seguro? Esta acción no se puede deshacer.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmId(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancelar
              </button>
              <button
                onClick={() => deleteMutation.mutate(confirmId)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign modal */}
      {assignRoutineId !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
            <h3 className="font-semibold text-gray-900 mb-1">Asignar rutina</h3>
            <p className="text-sm text-gray-500 mb-4">Seleccioná los usuarios a asignar</p>
            <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
              {users.filter((u) => u.role === 'athlete').map((u) => (
                <label key={u.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(u.id)}
                    onChange={() => toggleUser(u.id)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-800">{u.fullName}</span>
                  <span className="text-xs text-gray-400 ml-auto">{u.email}</span>
                </label>
              ))}
              {users.filter((u) => u.role === 'athlete').length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No hay atletas registrados.</p>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setAssignRoutineId(null); setSelectedUserIds([]); }} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancelar
              </button>
              <button
                onClick={() => assignMutation.mutate({ id: assignRoutineId, userIds: selectedUserIds })}
                disabled={selectedUserIds.length === 0 || assignMutation.isPending}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RoutineCard({ routine, onDelete, onAssign }: { routine: Routine; onDelete: () => void; onAssign: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{routine.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{routine.days.length} días</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onAssign} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Asignar">
            <UserPlus size={15} />
          </button>
          <Link to={`/admin/routines/${routine.id}/edit`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
            <Pencil size={15} />
          </Link>
          <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 mt-3 flex-wrap">
        {routine.days.map((day) => (
          <span
            key={day.id}
            className={`px-2 py-1 rounded text-xs font-medium ${
              day.isRest ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-700'
            }`}
          >
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][day.day]}
            {!day.isRest && day.activityType && ` · ${day.activityType}`}
          </span>
        ))}
      </div>
    </div>
  );
}
