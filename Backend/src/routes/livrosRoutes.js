const express = require('express');
const livrosController = require('../controllers/livrosController.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// USAR O MESMO CAMINHO DO SERVER.JS
const uploadsDir = path.join(process.cwd(), 'uploads');

// Garantir que a pasta existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Pasta uploads criada em:', uploadsDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas!'), false);
    }
  }
});


const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Arquivo muito grande. Tamanho máximo: 5MB'
      });
    }
  }
  res.status(400).json({
    success: false,
    message: error.message
  });
};

// Rotas públicas
router.get('/', livrosController.getAll);
router.get('/options', livrosController.getOptions);
router.get('/:id', livrosController.getById);
router.get('/generos', livrosController.getGeneros);

// Rotas protegidas
router.post('/', authenticate, authorize('admin', 'bibliotecario'), upload.single('imagem'), handleMulterError, livrosController.create);
router.put('/:id', authenticate, authorize('admin', 'bibliotecario'), upload.single('imagem'), handleMulterError, livrosController.update);
router.delete('/:id', authenticate, authorize('admin','bibliotecario'), livrosController.delete);

module.exports = router;