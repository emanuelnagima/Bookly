const express = require('express');
const livrosController = require('../controllers/livrosController.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
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

router.get('/', livrosController.getAll);
router.get('/options', livrosController.getOptions);
router.get('/:id', livrosController.getById);
router.get('/generos', livrosController.getGeneros);
router.post('/', upload.single('imagem'), handleMulterError, livrosController.create);
router.put('/:id', upload.single('imagem'), handleMulterError, livrosController.update);
router.delete('/:id', livrosController.delete);

module.exports = router;