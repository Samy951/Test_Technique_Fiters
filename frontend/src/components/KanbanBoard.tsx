import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Todo, TodoStatus, Priority } from '../types/Todo'
import TodoCard from './TodoCard'
import { Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface KanbanBoardProps {
  groupedTodos: Record<TodoStatus, Todo[]>
  onUpdateTodo: (id: string, updateData: Partial<Todo>) => Promise<void>
  onDeleteTodo: (id: string) => Promise<void>
  draggedTodo: Todo | null
}

// Configuration des colonnes
const COLUMNS = [
  {
    id: 'todo' as TodoStatus,
    title: 'À faire',
    icon: AlertCircle,
    color: 'bg-gray-50 border-gray-200',
    headerColor: 'text-gray-700 bg-gray-100',
    emptyMessage: 'Aucune tâche en attente'
  },
  {
    id: 'progress' as TodoStatus,
    title: 'En cours',
    icon: Clock,
    color: 'bg-blue-50 border-blue-200',
    headerColor: 'text-blue-700 bg-blue-100',
    emptyMessage: 'Aucune tâche en cours'
  },
  {
    id: 'done' as TodoStatus,
    title: 'Terminé',
    icon: CheckCircle,
    color: 'bg-green-50 border-green-200',
    headerColor: 'text-green-700 bg-green-100',
    emptyMessage: 'Aucune tâche terminée'
  }
] as const

interface KanbanColumnProps {
  column: typeof COLUMNS[0]
  todos: Todo[]
  onUpdateTodo: (id: string, updateData: Partial<Todo>) => Promise<void>
  onDeleteTodo: (id: string) => Promise<void>
  isDraggedOver: boolean
}

const KanbanColumn = ({ column, todos, onUpdateTodo, onDeleteTodo, isDraggedOver }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  const Icon = column.icon
  const urgentTodos = todos.filter(todo => todo.priority === Priority.HIGH)
  
  return (
    <div className="flex flex-col h-full">
      {/* Column header */}
      <div className={`px-4 py-3 rounded-t-lg border-b ${column.headerColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5" />
            <h3 className="font-semibold">{column.title}</h3>
            <span className="bg-white bg-opacity-50 text-xs font-medium px-2 py-1 rounded-full">
              {todos.length}
            </span>
          </div>
          
          {urgentTodos.length > 0 && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">{urgentTodos.length} urgent{urgentTodos.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-4 rounded-b-lg border-2 transition-all duration-200 ${
          column.color
        } ${
          isOver || isDraggedOver 
            ? 'border-blue-400 bg-blue-50 shadow-lg' 
            : 'border-transparent'
        }`}
        style={{ minHeight: '400px' }}
      >
        {todos.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center h-full text-gray-500 py-8">
            <Icon className="h-8 w-8 mb-3 opacity-50" />
            <p className="text-sm font-medium">{column.emptyMessage}</p>
            <p className="text-xs mt-1">Glissez une tâche ici</p>
          </div>
        ) : (
          // Tasks list
          <SortableContext items={todos.map(todo => todo.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {todos.map(todo => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onUpdate={onUpdateTodo}
                  onDelete={onDeleteTodo}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  )
}

const KanbanBoard = ({ groupedTodos, onUpdateTodo, onDeleteTodo, draggedTodo }: KanbanBoardProps) => {
  return (
    <div className="w-full">
      {/* Board header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tableau Kanban</h2>
        <p className="text-gray-600">
          Glissez-déposez vos tâches entre les colonnes pour changer leur statut
        </p>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {COLUMNS.map(column => (
          <KanbanColumn
            key={column.id}
            column={column}
            todos={groupedTodos[column.id]}
            onUpdateTodo={onUpdateTodo}
            onDeleteTodo={onDeleteTodo}
            isDraggedOver={false} // TODO: implement based on drag state
          />
        ))}
      </div>

      {/* Drag overlay info */}
      {draggedTodo && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-3 border-l-4 border-blue-500 z-50">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              Déplacement de "{draggedTodo.title.substring(0, 30)}..."
            </span>
          </div>
        </div>
      )}

      {/* Statistics footer */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        {COLUMNS.map(column => {
          const todos = groupedTodos[column.id]
          const urgentCount = todos.filter(todo => todo.priority === Priority.HIGH).length
          
          return (
            <div key={column.id} className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <column.icon className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">{column.title}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {todos.length}
              </div>
              {urgentCount > 0 && (
                <div className="text-xs text-red-600 font-medium">
                  {urgentCount} priorité haute
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default KanbanBoard 