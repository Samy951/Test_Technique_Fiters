import { CheckSquare, Clock, Trophy } from 'lucide-react'

interface HeaderProps {
  totalTodos: number
  completedTodos: number
}

const Header = ({ totalTodos, completedTodos }: HeaderProps) => {
  const activeTodos = totalTodos - completedTodos
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Titre et branding */}
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Kanban Todo
            </h1>
            <p className="text-gray-600">
              Application de gestion de tâches - 
              <span className="text-blue-600 font-medium ml-1">Fiters</span>
            </p>
          </div>

          {/* Statistiques */}
          <div className="flex items-center space-x-6">
            {/* Total des tâches */}
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <CheckSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-gray-900">{totalTodos}</p>
                <p className="text-gray-500">Total</p>
              </div>
            </div>

            {/* Tâches actives */}
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-gray-900">{activeTodos}</p>
                <p className="text-gray-500">Actives</p>
              </div>
            </div>

            {/* Tâches terminées */}
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <Trophy className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-gray-900">{completedTodos}</p>
                <p className="text-gray-500">Terminées</p>
              </div>
            </div>

            {/* Pourcentage de completion */}
            {totalTodos > 0 && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 relative">
                    {/* Cercle de progression */}
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-green-600"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${completionRate}, 100`}
                        strokeLinecap="round"
                        fill="transparent"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-900">
                        {completionRate}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 