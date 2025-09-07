import React, { memo, useState, useCallback, useEffect } from 'react';
import Input from '../UI/Input';
import Select from '../UI/Select';
import Button from '../UI/Button';
import { userService } from '../../services/api';

const TaskForm = memo(({ 
  initialTask = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    title: initialTask?.title || '',
    description: initialTask?.description || '',
    priority: initialTask?.priority || 'medium',
    status: initialTask?.status || 'todo',
    dueDate: initialTask?.dueDate ? new Date(initialTask.dueDate).toISOString().split('T')[0] : '',
    assignedTo: initialTask?.assignedTo?._id || ''
  });

  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const priorityOptions = [
    { value: 'low', label: 'Basse' },
    { value: 'medium', label: 'Moyenne' },
    { value: 'high', label: 'Haute' }
  ];

  const statusOptions = [
    { value: 'todo', label: 'À faire' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'done', label: 'Terminé' }
  ];

  // Charger la liste des utilisateurs au montage du composant
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await userService.getUsers();
        setUsers(response.data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Options pour la liste déroulante d'assignation
  const userOptions = [
    { value: '', label: 'Non assigné' },
    ...users.map(user => ({
      value: user._id,
      label: `${user.name} (${user.email})`
    }))
  ];

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    }
    
    if (formData.title.length > 100) {
      newErrors.title = 'Le titre ne peut pas dépasser 100 caractères';
    }
    
    if (formData.description.length > 500) {
      newErrors.description = 'La description ne peut pas dépasser 500 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      dueDate: formData.dueDate || undefined,
      assignedTo: formData.assignedTo || undefined
    };

    try {
      await onSubmit(submitData);
    } catch (error) {
      setErrors({ submit: error.message });
    }
  }, [formData, validateForm, onSubmit]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Titre *"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="Entrez le titre de la tâche"
        maxLength={100}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`input-field resize-none ${errors.description ? 'border-danger-500 focus:ring-danger-500' : ''}`}
          rows={3}
          placeholder="Description de la tâche (optionnel)"
          maxLength={500}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-danger-600">{errors.description}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.description.length}/500 caractères
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Priorité"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          options={priorityOptions}
          error={errors.priority}
        />

        <Select
          label="Statut"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
          error={errors.status}
        />
      </div>

      <Select
        label="Assigner à"
        name="assignedTo"
        value={formData.assignedTo}
        onChange={handleChange}
        options={userOptions}
        error={errors.assignedTo}
        disabled={loadingUsers}
        placeholder={loadingUsers ? "Chargement des utilisateurs..." : "Sélectionner un utilisateur"}
      />

      <Input
        label="Date d'échéance"
        name="dueDate"
        type="date"
        value={formData.dueDate}
        onChange={handleChange}
        error={errors.dueDate}
      />

      {errors.submit && (
        <div className="bg-danger-50 border border-danger-200 rounded-md p-3">
          <p className="text-sm text-danger-600">{errors.submit}</p>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {initialTask ? 'Modifier' : 'Créer'} la tâche
        </Button>
      </div>
    </form>
  );
});

TaskForm.displayName = 'TaskForm';

export default TaskForm;
