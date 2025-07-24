import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { todoModel } from '../models/TodoModel';
import { CreateTodoData, UpdateTodoData, Priority, TodoStatus, ErrorResponse } from '../types/Todo';

const router = Router();

// Validation middleware pour la création
const validateCreateTodo = [
  body('title')
    .notEmpty()
    .withMessage('Le titre est obligatoire')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Le titre doit faire entre 1 et 100 caractères'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La description ne peut pas dépasser 500 caractères'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('La priorité doit être low, medium ou high'),
  body('status')
    .optional()
    .isIn(['todo', 'progress', 'done'])
    .withMessage('Le statut doit être todo, progress ou done'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('La date doit être au format ISO8601')
];

// Validation middleware pour la mise à jour
const validateUpdateTodo = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Le titre doit faire entre 1 et 100 caractères'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La description ne peut pas dépasser 500 caractères'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('La priorité doit être low, medium ou high'),
  body('status')
    .optional()
    .isIn(['todo', 'progress', 'done'])
    .withMessage('Le statut doit être todo, progress ou done'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('La date doit être au format ISO8601')
];

// Helper pour gérer les erreurs de validation
const handleValidationErrors = (req: Request, res: Response<ErrorResponse>, next: Function) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Données invalides',
      details: errors.array().map(err => err.msg).join(', ')
    });
  }
  next();
};

// GET /api/todos - Récupérer toutes les tâches
router.get('/', (req: Request, res: Response) => {
  try {
    const todos = todoModel.getAll();
    res.json(todos);
  } catch (error) {
    console.error('Erreur GET /todos:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération' });
  }
});

// GET /api/todos/stats - Statistiques
router.get('/stats', (req: Request, res: Response) => {
  try {
    const stats = todoModel.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Erreur GET /todos/stats:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des stats' });
  }
});

// GET /api/todos/:id - Récupérer une tâche
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const todo = todoModel.getById(id);
    
    if (!todo) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }
    
    res.json(todo);
  } catch (error) {
    console.error('Erreur GET /todos/:id:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération' });
  }
});

// POST /api/todos - Créer une nouvelle tâche
router.post('/', validateCreateTodo, handleValidationErrors, (req: Request, res: Response) => {
  try {
            const todoData: CreateTodoData = {
          title: req.body.title,
          description: req.body.description,
          priority: req.body.priority,
          status: req.body.status,
          dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null
        };
    
    const newTodo = todoModel.create(todoData);
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Erreur POST /todos:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la tâche' });
  }
});

// PUT /api/todos/:id - Mettre à jour une tâche
router.put('/:id', validateUpdateTodo, handleValidationErrors, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
            const updateData: UpdateTodoData = {
          ...(req.body.title !== undefined && { title: req.body.title }),
          ...(req.body.description !== undefined && { description: req.body.description }),
          ...(req.body.priority !== undefined && { priority: req.body.priority }),
          ...(req.body.status !== undefined && { status: req.body.status }),
          ...(req.body.dueDate !== undefined && { dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null })
        };
    
    const updatedTodo = todoModel.update(id, updateData);
    
    if (!updatedTodo) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }
    
    res.json(updatedTodo);
  } catch (error) {
    console.error('Erreur PUT /todos/:id:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// PATCH /api/todos/:id/status - Changer le statut d'une tâche
router.patch('/:id/status', [
  body('status')
    .notEmpty()
    .isIn(['todo', 'progress', 'done'])
    .withMessage('Le statut doit être todo, progress ou done')
], (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Données invalides',
        details: errors.array().map(err => err.msg).join(', ')
      });
    }

    const { id } = req.params;
    const { status } = req.body;
    const updatedTodo = todoModel.changeStatus(id, status);
    
    if (!updatedTodo) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }
    
    res.json(updatedTodo);
  } catch (error) {
    console.error('Erreur PATCH /todos/:id/status:', error);
    res.status(500).json({ error: 'Erreur lors du changement de statut' });
  }
});

// DELETE /api/todos/:id - Supprimer une tâche
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = todoModel.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }
    
    res.status(204).send(); // 204 No Content pour une suppression réussie
  } catch (error) {
    console.error('Erreur DELETE /todos/:id:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

export default router; 