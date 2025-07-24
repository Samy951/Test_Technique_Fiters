import { useState } from 'react'
import { Plus, Calendar, Flag, FileText } from 'lucide-react'
import { Priority } from '../types/Todo'

interface TodoFormProps {
  onSubmit: (todoData: {
    title: string
    description?: string
    priority?: Priority
    dueDate?: Date | null
  }) => Promise<void>
}

const TodoForm = ({ onSubmit }: TodoFormProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: Priority.MEDIUM,
    dueDate: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) return
    
    setIsSubmitting(true)
    
    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null
      })
      
      // Reset form après succès
      setFormData({
        title: '',
        description: '',
        priority: Priority.MEDIUM,
        dueDate: ''
      })
      setIsExpanded(false)
    } catch (error) {
      console.error('Erreur création tâche:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof typeof formData, value: string | Priority) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const priorityOptions = [
    { value: Priority.LOW, label: 'Basse', color: 'text-green-600 bg-green-50 border-green-200' },
    { value: Priority.MEDIUM, label: 'Moyenne', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
    { value: Priority.HIGH, label: 'Haute', color: 'text-red-600 bg-red-50 border-red-200' }
  ]

  const selectedPriorityStyle = priorityOptions.find(p => p.value === formData.priority)?.color || ''

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Form header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center space-x-2">
            <Plus className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-45' : ''}`} />
            <h2 className="text-lg font-semibold text-gray-900">
              {isExpanded ? 'Nouvelle tâche' : 'Ajouter une tâche'}
            </h2>
          </div>
          <span className="text-sm text-gray-500">
            {isExpanded ? 'Cliquez pour réduire' : 'Cliquez pour développer'}
          </span>
        </button>
      </div>

      {/* Form content */}
      <form onSubmit={handleSubmit} className={`transition-all duration-300 ${isExpanded ? 'block' : 'hidden'}`}>
        <div className="p-6 space-y-4">
          {/* Titre (toujours visible) */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titre de la tâche *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ex: Finaliser la présentation..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
              autoFocus={isExpanded}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <FileText className="h-4 w-4 mr-1" />
              Description (optionnelle)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Détails supplémentaires..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors"
            />
          </div>

          {/* Priorité et Date - Grid responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priorité */}
            <div>
              <label htmlFor="priority" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Flag className="h-4 w-4 mr-1" />
                Priorité
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value as Priority)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${selectedPriorityStyle}`}
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date d'échéance */}
            <div>
              <label htmlFor="dueDate" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                Échéance
              </label>
              <input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]} // Pas de date passée
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Form actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Annuler
          </button>
          
          <button
            type="submit"
            disabled={!formData.title.trim() || isSubmitting}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Création...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Créer la tâche</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick add mode quand fermé */}
      {!isExpanded && (
        <div className="p-4">
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="w-full text-left px-4 py-3 text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border-2 border-dashed border-gray-300 hover:border-gray-400"
          >
            <div className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Que voulez-vous accomplir aujourd'hui ?</span>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}

export default TodoForm 