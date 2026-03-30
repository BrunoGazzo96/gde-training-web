import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getRoutine, createRoutine, updateRoutine } from '../../api/routines';
import type { DayOfWeek } from '../../types';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface DayForm {
  day: DayOfWeek;
  isRest: boolean;
  activityType: string;
  description: string;
  durationMinutes: number | null;
  notes: string;
  videoUrl: string;
}

interface FormData {
  name: string;
  days: DayForm[];
}

const DAY_OPTIONS = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

const emptyDay = (): DayForm => ({
  day: 1,
  isRest: false,
  activityType: '',
  description: '',
  durationMinutes: null,
  notes: '',
  videoUrl: '',
});

export default function RoutineForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: existing } = useQuery({
    queryKey: ['routine', id],
    queryFn: () => getRoutine(Number(id)),
    enabled: isEdit,
  });

  const { register, handleSubmit, control, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: { name: '', days: [emptyDay()] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'days' });

  useEffect(() => {
    if (existing) {
      reset({
        name: existing.name,
        days: existing.days.map((d) => ({
          day: d.day,
          isRest: d.isRest,
          activityType: d.activityType ?? '',
          description: d.description ?? '',
          durationMinutes: d.durationMinutes,
          notes: d.notes ?? '',
          videoUrl: d.videoUrl ?? '',
        })),
      });
    }
  }, [existing]);

  const createMutation = useMutation({
    mutationFn: createRoutine,
    onSuccess: () => navigate('/admin/routines'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => updateRoutine(Number(id), data),
    onSuccess: () => navigate('/admin/routines'),
  });

  const onSubmit = (data: FormData) => {
    const payload = {
      ...data,
      days: data.days.map((d) => ({
        ...d,
        day: Number(d.day) as DayOfWeek,
        durationMinutes: d.durationMinutes ? Number(d.durationMinutes) : null,
        activityType: d.isRest ? null : d.activityType || null,
        description: d.isRest ? null : d.description || null,
        notes: d.isRest ? null : d.notes || null,
        videoUrl: d.isRest ? null : d.videoUrl || null,
      })),
    };
    if (isEdit) updateMutation.mutate(payload as FormData);
    else createMutation.mutate(payload);
  };

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft size={16} /> Volver
      </button>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {isEdit ? 'Editar rutina' : 'Nueva rutina'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la rutina</label>
          <input
            {...register('name', { required: 'Campo requerido' })}
            className={inputClass}
            placeholder="Ej: Rutina de fuerza 3 días"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Días</h3>
            <button
              type="button"
              onClick={() => append(emptyDay())}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus size={14} /> Agregar día
            </button>
          </div>

          {fields.map((field, index) => {
            const isRest = watch(`days.${index}.isRest`);
            return (
              <div key={field.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Día {index + 1}</span>
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(index)} className="p-1 text-gray-400 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Día de la semana</label>
                    <select {...register(`days.${index}.day`, { valueAsNumber: true })} className={inputClass}>
                      {DAY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id={`rest-${index}`}
                      {...register(`days.${index}.isRest`)}
                      className="rounded"
                    />
                    <label htmlFor={`rest-${index}`} className="text-sm text-gray-700">Día de descanso</label>
                  </div>
                </div>

                {!isRest && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Tipo de actividad</label>
                        <input {...register(`days.${index}.activityType`)} className={inputClass} placeholder="Ej: Pesas, Cardio" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Duración (min)</label>
                        <input type="number" {...register(`days.${index}.durationMinutes`)} className={inputClass} placeholder="60" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
                      <textarea {...register(`days.${index}.description`)} rows={2} className={inputClass} placeholder="Descripción de los ejercicios..." />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Notas</label>
                        <input {...register(`days.${index}.notes`)} className={inputClass} placeholder="Notas adicionales" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Video URL</label>
                        <input {...register(`days.${index}.videoUrl`)} className={inputClass} placeholder="https://..." />
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {(createMutation.isError || updateMutation.isError) && (
          <p className="text-red-500 text-sm">Error al guardar la rutina.</p>
        )}

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isEdit ? 'Guardar cambios' : 'Crear rutina'}
          </button>
        </div>
      </form>
    </div>
  );
}
