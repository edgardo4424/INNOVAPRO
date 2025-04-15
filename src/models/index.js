const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Función recursiva que encuentra todos los archivos `.model.js` dentro de /modules
const getModelFiles = (dirPath, files = []) => {
  fs.readdirSync(dirPath).forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getModelFiles(fullPath, files);
    } else if (file.endsWith('.model.js')) {
      files.push(fullPath);
    }
  });
  return files;
};

const modelFiles = getModelFiles(path.resolve(__dirname, '../modules'));

modelFiles.forEach(file => {
  const model = require(file)(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
  console.log('✅ Modelo cargado:', model.name);
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
