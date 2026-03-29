import { useQuery } from '@tanstack/react-query';
import { getUserRoutines } from '../../api/routines';
import { useAuth } from '../../context/AuthContext';
import type { Routine } from '../../types';

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function MyRoutines() {
  const { userId } = useAuth();

  const { data: routines = [], isLoading } = useQuery({
    queryKey: ['my-routines', userId],
    queryFn: () => getUserRoutines(userId!),
    enabled: !!userId,
  });

  if (isLoading) return <div className="text-gray-500">Cargando...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Mis rutinas</h2>

      {routines.length === 0 && (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-200">
          Todavía no tenés rutinas asignadas.
        </div>
      )}

      <div className="space-y-6">
        {routines.map((routine) => (
          <RoutineCard key={routine.id} routine={routine} />
        ))}
      </div>
    </div>
  );
}

function RoutineCard({ routine }: { routine: Routine }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">{routine.name}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{routine.days.length} días</p>
      </div>

      <div className="divide-y divide-gray-100">
        {routine.days
          .slice()
          .sort((a, b) => a.day - b.day)
          .map((day) => (
            <div key={day.id} className="px-6 py-4 flex gap-4">
              <div className="w-24 shrink-0">
                <span className="text-sm font-medium text-gray-700">{DAY_NAMES[day.day]}</span>
              </div>
              {day.isRest ? (
                <span className="text-sm text-gray-400 italic">Descanso</span>
              ) : (
                <div className="flex-1 space-y-1">
                  {day.activityType && (
                    <p className="text-sm font-medium text-blue-700">{day.activityType}</p>
                  )}
                  {day.description && (
                    <p className="text-sm text-gray-600">{day.description}</p>
                  )}
                  <div className="flex gap-4 text-xs text-gray-400">
                    {day.durationMinutes && <span>{day.durationMinutes} min</span>}
                    {day.notes && <span>{day.notes}</span>}
                  </div>
                  {day.videoUrl && (
                    <a
                      href={day.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Ver video
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
