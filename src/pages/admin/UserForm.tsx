import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getUser, createUser, updateUser } from '../../api/users';
import type { CreateUserForm, UpdateUserForm } from '../../types';
import { ArrowLeft } from 'lucide-react';

export default function UserForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: existing } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(Number(id)),
    enabled: isEdit,
  });

  const createForm = useForm<CreateUserForm>({
    defaultValues: { role: 'athlete' },
  });

  const updateForm = useForm<UpdateUserForm>({
    defaultValues: { isActive: true, weight: 0, height: 0, role: 'athlete' },
  });

  useEffect(() => {
    if (existing && isEdit) {
      updateForm.reset({
        password: '',
        isActive: existing.isActive,
        weight: existing.weight,
        height: existing.height,
        role: existing.role,
        birthdate: existing.birthdate.split('T')[0],
      });
    }
  }, [existing, isEdit]);

  const createMutation = useMutation({
    mutationFn: (data: CreateUserForm) => createUser(data),
    onSuccess: () => navigate('/admin/users'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateUserForm) => updateUser(Number(id), data),
    onSuccess: () => navigate('/admin/users'),
  });

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  if (isEdit) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = updateForm;

    return (
      <div className="max-w-lg">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={16} /> Volver
        </button>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Editar usuario</h2>

        <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))} className="space-y-4 bg-white border border-gray-200 rounded-xl p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Rol</label>
              <select {...register('role')} className={inputClass}>
                <option value="athlete">Atleta</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Estado</label>
              <select {...register('isActive', { setValueAs: (v) => v === 'true' })} className={inputClass}>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Nueva contraseña (opcional)</label>
            <input type="password" {...register('password')} className={inputClass} placeholder="Dejar vacío para no cambiar" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Peso (kg)</label>
              <input type="number" step="0.1" {...register('weight', { valueAsNumber: true })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Altura (cm)</label>
              <input type="number" step="0.1" {...register('height', { valueAsNumber: true })} className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Fecha de nacimiento</label>
            <input type="date" {...register('birthdate', { required: 'Campo requerido' })} className={inputClass} />
            {errors.birthdate && <p className="text-red-500 text-xs mt-1">{errors.birthdate.message}</p>}
          </div>

          {updateMutation.isError && <p className="text-red-500 text-sm">Error al actualizar el usuario.</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting || updateMutation.isPending} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              Guardar
            </button>
          </div>
        </form>
      </div>
    );
  }

  const { register, handleSubmit, formState: { errors, isSubmitting } } = createForm;

  return (
    <div className="max-w-lg">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft size={16} /> Volver
      </button>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Nuevo usuario</h2>

      <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4 bg-white border border-gray-200 rounded-xl p-6">
        <div>
          <label className={labelClass}>Nombre completo</label>
          <input {...register('fullName', { required: 'Campo requerido' })} className={inputClass} />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <input type="email" {...register('email', { required: 'Campo requerido' })} className={inputClass} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Contraseña</label>
          <input type="password" {...register('password', { required: 'Campo requerido', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })} className={inputClass} />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Rol</label>
            <select {...register('role')} className={inputClass}>
              <option value="athlete">Atleta</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Fecha de nacimiento</label>
            <input type="date" {...register('birthdate', { required: 'Campo requerido' })} className={inputClass} />
            {errors.birthdate && <p className="text-red-500 text-xs mt-1">{errors.birthdate.message}</p>}
          </div>
        </div>

        {createMutation.isError && <p className="text-red-500 text-sm">Error al crear el usuario.</p>}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting || createMutation.isPending} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            Crear
          </button>
        </div>
      </form>
    </div>
  );
}
