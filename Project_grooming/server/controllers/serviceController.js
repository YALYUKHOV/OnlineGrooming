const {Service} = require('../models/models');
const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

class ServiceController {
  async create(req, res, next) {
    try {
      const { name, description, price, duration, category } = req.body;
      
      if (!name || !description || !price || !duration) {
        return next(ApiError.badRequest('Не все поля заполнены'));
      }

      console.log('Request body:', req.body);
      console.log('Files received:', req.files);
      console.log('Files type:', typeof req.files);
      console.log('Files keys:', Object.keys(req.files));
      
      let images = [];
      if (req.files) {
        if (req.files.images) {
          const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
          console.log('Processing files:', files);
          console.log('Number of files:', files.length);
          
          for (const file of files) {
            console.log('Processing file:', file.name);
            const fileName = uuid.v4() + ".jpg";
            const filePath = path.resolve(__dirname, '..', 'static', fileName);
            console.log('Saving to:', filePath);
            
            try {
              await file.mv(filePath);
              console.log('File saved successfully');
              images.push(fileName);
            } catch (err) {
              console.error('Error saving file:', err);
            }
          }
        } else {
          console.log('No images field in files');
        }
      } else {
        console.log('No files in request');
      }
      
      console.log('Final images array:', images);

      const service = await Service.create({ 
        name, 
        description, 
        price, 
        duration,
        category,
        images: images
      });

      console.log('Created service:', service);
      return res.json(service);
    } catch (e) {
      console.error('Error creating service:', e);
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      console.log('Getting all services...');
      const services = await Service.findAll({
        order: [['name', 'ASC']]
      });
      console.log('Found services:', services);
      return res.json(services);
    } catch (e) {
      console.error('Error in getAll services:', e);
      next(ApiError.badRequest(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const service = await Service.findOne({
        where: { id }
      });
      if (!service) {
        return next(ApiError.notFound('Услуга не найдена'));
      }
      return res.json(service);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const service = await Service.findOne({
        where: { id }
      });

      if (!service) {
        return next(ApiError.notFound('Услуга не найдена'));
      }

      // Удаляем все изображения
      const images = service.images || [];
      for (const image of images) {
        const imagePath = path.resolve(__dirname, '..', 'static', image);
        try {
          await fs.unlink(imagePath);
        } catch (e) {
          console.error('Ошибка при удалении изображения:', e);
        }
      }

      await service.destroy();
      return res.json({ message: 'Услуга успешно удалена' });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, price, duration, category } = req.body;
      
      const service = await Service.findOne({
        where: { id }
      });

      if (!service) {
        return next(ApiError.notFound('Услуга не найдена'));
      }

      let images = service.images || [];
      if (req.files) {
        if (req.files.images) {
          const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
          for (const file of files) {
            const fileName = uuid.v4() + ".jpg";
            await file.mv(path.resolve(__dirname, '..', 'static', fileName));
            images.push(fileName);
          }
        }
      }

      await service.update({
        name,
        description,
        price,
        duration,
        category,
        images: images
      });

      return res.json(service);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async uploadImage(req, res, next) {
    try {
      if (!req.files || !req.files.images) {
        return next(ApiError.badRequest('Файл не загружен'));
      }

      const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      const fileNames = [];

      for (const file of files) {
        const fileName = uuid.v4() + ".jpg";
        await file.mv(path.resolve(__dirname, '..', 'static', fileName));
        fileNames.push(fileName);
      }

      return res.json({ fileNames });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new ServiceController();