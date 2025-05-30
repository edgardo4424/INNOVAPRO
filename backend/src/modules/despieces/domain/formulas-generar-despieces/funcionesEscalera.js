/**
 FUNCIONES DE APOYO
 */

function esPar(n) {
  return n % 2 === 0;
}

const apoyo2Despiece = {
  "AM.1000": {
    "GURSAM 60/TIPO 1": 5,
    "GURSAM 60/TIPO 2": 5,
    "GURSAM 60/TIPO 3": 5,
    "GURSAM 60/TIPO 4": 6,
    "GURSAM 60/TIPO 5": 6,
    
    "ALUMINIO/TIPO 1": 5,
    "ALUMINIO/TIPO 2": 5,
    "ALUMINIO/TIPO 3": 5,
    "ALUMINIO/TIPO 4": 6,
    
    "FERMIN/TIPO 1": 5,
    "FERMIN/TIPO 2": 5,
    "FERMIN/TIPO 3": 5,
    "FERMIN/TIPO 4": 6,
    "FERMIN/TIPO 5": 6,

    "EUROPEA/TIPO 1": 7,
    "EUROPEA/TIPO 2": 7,
    "EUROPEA/TIPO 3": 6,
    "EUROPEA/TIPO 4": 10,

    "GURSAM 120/TIPO 1/1572": 7,
    "GURSAM 120/TIPO 2/1572": 8,
    "GURSAM 120/TIPO 3/1572": 7,
    "GURSAM 120/TIPO 4/1572": 10,

    "GURSAM 120/TIPO 1/1090": 7,
    "GURSAM 120/TIPO 2/1090": 8,
    "GURSAM 120/TIPO 3/1090": 7,
    "GURSAM 120/TIPO 4/1090": 10,

    "GURSAM 120/TIPO 1/732": 7,
    "GURSAM 120/TIPO 2/732": 8,
    "GURSAM 120/TIPO 3/732": 7,
    "GURSAM 120/TIPO 4/732": 10,
  },
  
  "AM.1300": {
    "GURSAM 60/TIPO 1": 4,
    "GURSAM 60/TIPO 2": 2,
    "GURSAM 60/TIPO 3": 2,
    "GURSAM 60/TIPO 4": 2,
    "GURSAM 60/TIPO 5": 4,
    
    "ALUMINIO/TIPO 1": 4,
    "ALUMINIO/TIPO 2": 2,
    "ALUMINIO/TIPO 3": 2,
    "ALUMINIO/TIPO 4": 2,
    
    "FERMIN/TIPO 1": 4,
    "FERMIN/TIPO 2": 2,
    "FERMIN/TIPO 3": 2,
    "FERMIN/TIPO 4": 2,
    "FERMIN/TIPO 5": 4,

    "EUROPEA/TIPO 1": 0,
    "EUROPEA/TIPO 2": 0,
    "EUROPEA/TIPO 3": 0,
    "EUROPEA/TIPO 4": 0,

    "GURSAM 120/TIPO 1/1572": 0,
    "GURSAM 120/TIPO 2/1572": 0,
    "GURSAM 120/TIPO 3/1572": 0,
    "GURSAM 120/TIPO 4/1572": 0,

    "GURSAM 120/TIPO 1/1090": 0,
    "GURSAM 120/TIPO 2/1090": 0,
    "GURSAM 120/TIPO 3/1090": 0,
    "GURSAM 120/TIPO 4/1090": 0,

    "GURSAM 120/TIPO 1/732": 0,
    "GURSAM 120/TIPO 2/732": 0,
    "GURSAM 120/TIPO 3/732": 0,
    "GURSAM 120/TIPO 4/732": 0,
  },
  
  "AM.1400": {
    "GURSAM 60/TIPO 1": 0,
    "GURSAM 60/TIPO 2": 0,
    "GURSAM 60/TIPO 3": 0,
    "GURSAM 60/TIPO 4": 0,
    "GURSAM 60/TIPO 5": 0,
    
    "ALUMINIO/TIPO 1": 0,
    "ALUMINIO/TIPO 2": 0,
    "ALUMINIO/TIPO 3": 0,
    "ALUMINIO/TIPO 4": 0,
    
    "FERMIN/TIPO 1": 0,
    "FERMIN/TIPO 2": 0,
    "FERMIN/TIPO 3": 0,
    "FERMIN/TIPO 4": 2,
    "FERMIN/TIPO 5": 2,

    "EUROPEA/TIPO 1": 0,
    "EUROPEA/TIPO 2": 0,
    "EUROPEA/TIPO 3": 0,
    "EUROPEA/TIPO 4": 0,

    "GURSAM 120/TIPO 1/1572": 0,
    "GURSAM 120/TIPO 2/1572": 0,
    "GURSAM 120/TIPO 3/1572": 0,
    "GURSAM 120/TIPO 4/1572": 0,

    "GURSAM 120/TIPO 1/1090": 0,
    "GURSAM 120/TIPO 2/1090": 0,
    "GURSAM 120/TIPO 3/1090": 0,
    "GURSAM 120/TIPO 4/1090": 0,

    "GURSAM 120/TIPO 1/732": 0,
    "GURSAM 120/TIPO 2/732": 0,
    "GURSAM 120/TIPO 3/732": 0,
    "GURSAM 120/TIPO 4/732": 0,
  },

  "AM.1500": {
    "GURSAM 60/TIPO 1": 0,
    "GURSAM 60/TIPO 2": 2,
    "GURSAM 60/TIPO 3": 2,
    "GURSAM 60/TIPO 4": 4,
    "GURSAM 60/TIPO 5": 2,
    
    "ALUMINIO/TIPO 1": 0,
    "ALUMINIO/TIPO 2": 2,
    "ALUMINIO/TIPO 3": 2,
    "ALUMINIO/TIPO 4": 4,
    
    "FERMIN/TIPO 1": 0,
    "FERMIN/TIPO 2": 2,
    "FERMIN/TIPO 3": 2,
    "FERMIN/TIPO 4": 2,
    "FERMIN/TIPO 5": 0,

    "EUROPEA/TIPO 1": 4,
    "EUROPEA/TIPO 2": 4,
    "EUROPEA/TIPO 3": 4,
    "EUROPEA/TIPO 4": 6,

    "GURSAM 120/TIPO 1/1572": 4,
    "GURSAM 120/TIPO 2/1572": 4,
    "GURSAM 120/TIPO 3/1572": 4,
    "GURSAM 120/TIPO 4/1572": 6,

    "GURSAM 120/TIPO 1/1090": 4,
    "GURSAM 120/TIPO 2/1090": 4,
    "GURSAM 120/TIPO 3/1090": 4,
    "GURSAM 120/TIPO 4/1090": 6,

    "GURSAM 120/TIPO 1/732": 4,
    "GURSAM 120/TIPO 2/732": 4,
    "GURSAM 120/TIPO 3/732": 4,
    "GURSAM 120/TIPO 4/732": 6,
  },

  "AM.1600": {
    "GURSAM 60/TIPO 1": 0,
    "GURSAM 60/TIPO 2": 0,
    "GURSAM 60/TIPO 3": 0,
    "GURSAM 60/TIPO 4": 0,
    "GURSAM 60/TIPO 5": 0,
    
    "ALUMINIO/TIPO 1": 0,
    "ALUMINIO/TIPO 2": 0,
    "ALUMINIO/TIPO 3": 0,
    "ALUMINIO/TIPO 4": 0,
    
    "FERMIN/TIPO 1": 0,
    "FERMIN/TIPO 2": 0,
    "FERMIN/TIPO 3": 0,
    "FERMIN/TIPO 4": 0,
    "FERMIN/TIPO 5": 0,

    "EUROPEA/TIPO 1": 0,
    "EUROPEA/TIPO 2": 0,
    "EUROPEA/TIPO 3": 0,
    "EUROPEA/TIPO 4": 0,

    "GURSAM 120/TIPO 1/1572": 7,
    "GURSAM 120/TIPO 2/1572": 9,
    "GURSAM 120/TIPO 3/1572": 7,
    "GURSAM 120/TIPO 4/1572": 10,

    "GURSAM 120/TIPO 1/1090": 3,
    "GURSAM 120/TIPO 2/1090": 3,
    "GURSAM 120/TIPO 3/1090": 3,
    "GURSAM 120/TIPO 4/1090": 2,

    "GURSAM 120/TIPO 1/732": 3,
    "GURSAM 120/TIPO 2/732": 3,
    "GURSAM 120/TIPO 3/732": 3,
    "GURSAM 120/TIPO 4/732": 2,
  },

  "AM.1800": {
    "GURSAM 60/TIPO 1": 2,
    "GURSAM 60/TIPO 2": 0,
    "GURSAM 60/TIPO 3": 2,
    "GURSAM 60/TIPO 4": 0,
    "GURSAM 60/TIPO 5": 0,
    
    "ALUMINIO/TIPO 1": 2,
    "ALUMINIO/TIPO 2": 0,
    "ALUMINIO/TIPO 3": 2,
    "ALUMINIO/TIPO 4": 0,
    
    "FERMIN/TIPO 1": 1,
    "FERMIN/TIPO 2": 3,
    "FERMIN/TIPO 3": 1,
    "FERMIN/TIPO 4": 0,
    "FERMIN/TIPO 5": 0,

    "EUROPEA/TIPO 1": 0,
    "EUROPEA/TIPO 2": 0,
    "EUROPEA/TIPO 3": 0,
    "EUROPEA/TIPO 4": 2,

    "GURSAM 120/TIPO 1/1572": 0,
    "GURSAM 120/TIPO 2/1572": 0,
    "GURSAM 120/TIPO 3/1572": 0,
    "GURSAM 120/TIPO 4/1572": 0,

    "GURSAM 120/TIPO 1/1090": 4,
    "GURSAM 120/TIPO 2/1090": 6,
    "GURSAM 120/TIPO 3/1090": 4,
    "GURSAM 120/TIPO 4/1090": 8,

    "GURSAM 120/TIPO 1/732": 0,
    "GURSAM 120/TIPO 2/732": 0,
    "GURSAM 120/TIPO 3/732": 0,
    "GURSAM 120/TIPO 4/732": 0,
  },

  "AM.2000": {
    "GURSAM 60/TIPO 1": 1,
    "GURSAM 60/TIPO 2": 3,
    "GURSAM 60/TIPO 3": 1,
    "GURSAM 60/TIPO 4": 2,
    "GURSAM 60/TIPO 5": 2,
    
    "ALUMINIO/TIPO 1": 1,
    "ALUMINIO/TIPO 2": 3,
    "ALUMINIO/TIPO 3": 1,
    "ALUMINIO/TIPO 4": 2,
    
    "FERMIN/TIPO 1": 2,
    "FERMIN/TIPO 2": 0,
    "FERMIN/TIPO 3": 2,
    "FERMIN/TIPO 4": 2,
    "FERMIN/TIPO 5": 2,

    "EUROPEA/TIPO 1": 7,
    "EUROPEA/TIPO 2": 7,
    "EUROPEA/TIPO 3": 5,
    "EUROPEA/TIPO 4": 8,

    "GURSAM 120/TIPO 1/1572": 0,
    "GURSAM 120/TIPO 2/1572": 0,
    "GURSAM 120/TIPO 3/1572": 0,
    "GURSAM 120/TIPO 4/1572": 0,

    "GURSAM 120/TIPO 1/1090": 0,
    "GURSAM 120/TIPO 2/1090": 0,
    "GURSAM 120/TIPO 3/1090": 0,
    "GURSAM 120/TIPO 4/1090": 0,

    "GURSAM 120/TIPO 1/732": 4,
    "GURSAM 120/TIPO 2/732": 6,
    "GURSAM 120/TIPO 3/732": 4,
    "GURSAM 120/TIPO 4/732": 8,
  },

  "AM.5100": {
    "GURSAM 60/TIPO 1": 0,
    "GURSAM 60/TIPO 2": 0,
    "GURSAM 60/TIPO 3": 0,
    "GURSAM 60/TIPO 4": 1,
    "GURSAM 60/TIPO 5": 1,
    
    "ALUMINIO/TIPO 1": 0,
    "ALUMINIO/TIPO 2": 0,
    "ALUMINIO/TIPO 3": 0,
    "ALUMINIO/TIPO 4": 1,
    
    "FERMIN/TIPO 1": 0,
    "FERMIN/TIPO 2": 0,
    "FERMIN/TIPO 3": 0,
    "FERMIN/TIPO 4": 1,
    "FERMIN/TIPO 5": 1,

    "EUROPEA/TIPO 1": 0,
    "EUROPEA/TIPO 2": 0,
    "EUROPEA/TIPO 3": 0,
    "EUROPEA/TIPO 4": 0,

    "GURSAM 120/TIPO 1/1572": 0,
    "GURSAM 120/TIPO 2/1572": 0,
    "GURSAM 120/TIPO 3/1572": 0,
    "GURSAM 120/TIPO 4/1572": 0,

    "GURSAM 120/TIPO 1/1090": 0,
    "GURSAM 120/TIPO 2/1090": 0,
    "GURSAM 120/TIPO 3/1090": 0,
    "GURSAM 120/TIPO 4/1090": 0,

    "GURSAM 120/TIPO 1/732": 0,
    "GURSAM 120/TIPO 2/732": 0,
    "GURSAM 120/TIPO 3/732": 0,
    "GURSAM 120/TIPO 4/732": 0,
  },

  "AM.6600": {
    "GURSAM 60/TIPO 1": 0,
    "GURSAM 60/TIPO 2": 0,
    "GURSAM 60/TIPO 3": 0,
    "GURSAM 60/TIPO 4": 2,
    "GURSAM 60/TIPO 5": 2,
    
    "ALUMINIO/TIPO 1": 0,
    "ALUMINIO/TIPO 2": 0,
    "ALUMINIO/TIPO 3": 0,
    "ALUMINIO/TIPO 4": 2,
    
    "FERMIN/TIPO 1": 0,
    "FERMIN/TIPO 2": 0,
    "FERMIN/TIPO 3": 0,
    "FERMIN/TIPO 4": 2,
    "FERMIN/TIPO 5": 2,

    "EUROPEA/TIPO 1": 0,
    "EUROPEA/TIPO 2": 0,
    "EUROPEA/TIPO 3": 0,
    "EUROPEA/TIPO 4": 0,

    "GURSAM 120/TIPO 1/1572": 0,
    "GURSAM 120/TIPO 2/1572": 0,
    "GURSAM 120/TIPO 3/1572": 0,
    "GURSAM 120/TIPO 4/1572": 0,

    "GURSAM 120/TIPO 1/1090": 0,
    "GURSAM 120/TIPO 2/1090": 0,
    "GURSAM 120/TIPO 3/1090": 0,
    "GURSAM 120/TIPO 4/1090": 0,

    "GURSAM 120/TIPO 1/732": 0,
    "GURSAM 120/TIPO 2/732": 0,
    "GURSAM 120/TIPO 3/732": 0,
    "GURSAM 120/TIPO 4/732": 0,
  },

  "AM.6700": {
    "GURSAM 60/TIPO 1": 0,
    "GURSAM 60/TIPO 2": 0,
    "GURSAM 60/TIPO 3": 0,
    "GURSAM 60/TIPO 4": 0,
    "GURSAM 60/TIPO 5": 0,
    
    "ALUMINIO/TIPO 1": 0,
    "ALUMINIO/TIPO 2": 0,
    "ALUMINIO/TIPO 3": 0,
    "ALUMINIO/TIPO 4": 0,
    
    "FERMIN/TIPO 1": 0,
    "FERMIN/TIPO 2": 0,
    "FERMIN/TIPO 3": 0,
    "FERMIN/TIPO 4": 0,
    "FERMIN/TIPO 5": 0,

    "EUROPEA/TIPO 1": 0,
    "EUROPEA/TIPO 2": 0,
    "EUROPEA/TIPO 3": 0,
    "EUROPEA/TIPO 4": 0,

    "GURSAM 120/TIPO 1/1572": 0,
    "GURSAM 120/TIPO 2/1572": 0,
    "GURSAM 120/TIPO 3/1572": 0,
    "GURSAM 120/TIPO 4/1572": 3,

    "GURSAM 120/TIPO 1/1090": 0,
    "GURSAM 120/TIPO 2/1090": 0,
    "GURSAM 120/TIPO 3/1090": 0,
    "GURSAM 120/TIPO 4/1090": 3,

    "GURSAM 120/TIPO 1/732": 0,
    "GURSAM 120/TIPO 2/732": 0,
    "GURSAM 120/TIPO 3/732": 0,
    "GURSAM 120/TIPO 4/732": 3,
  },

  "AM.6800": {
    "GURSAM 60/TIPO 1": 0,
    "GURSAM 60/TIPO 2": 0,
    "GURSAM 60/TIPO 3": 0,
    "GURSAM 60/TIPO 4": 0,
    "GURSAM 60/TIPO 5": 0,
    
    "ALUMINIO/TIPO 1": 0,
    "ALUMINIO/TIPO 2": 0,
    "ALUMINIO/TIPO 3": 0,
    "ALUMINIO/TIPO 4": 0,
    
    "FERMIN/TIPO 1": 0,
    "FERMIN/TIPO 2": 0,
    "FERMIN/TIPO 3": 0,
    "FERMIN/TIPO 4": 0,
    "FERMIN/TIPO 5": 0,

    "EUROPEA/TIPO 1": 0,
    "EUROPEA/TIPO 2": 0,
    "EUROPEA/TIPO 3": 0,
    "EUROPEA/TIPO 4": 2,

    "GURSAM 120/TIPO 1/1572": 0,
    "GURSAM 120/TIPO 2/1572": 0,
    "GURSAM 120/TIPO 3/1572": 0,
    "GURSAM 120/TIPO 4/1572": 3,

    "GURSAM 120/TIPO 1/1090": 0,
    "GURSAM 120/TIPO 2/1090": 0,
    "GURSAM 120/TIPO 3/1090": 0,
    "GURSAM 120/TIPO 4/1090": 3,

    "GURSAM 120/TIPO 1/732": 0,
    "GURSAM 120/TIPO 2/732": 0,
    "GURSAM 120/TIPO 3/732": 0,
    "GURSAM 120/TIPO 4/732": 3,
  },

  "AM.6900": {
    "GURSAM 60/TIPO 1": 0,
    "GURSAM 60/TIPO 2": 0,
    "GURSAM 60/TIPO 3": 0,
    "GURSAM 60/TIPO 4": 0,
    "GURSAM 60/TIPO 5": 0,
    
    "ALUMINIO/TIPO 1": 0,
    "ALUMINIO/TIPO 2": 0,
    "ALUMINIO/TIPO 3": 0,
    "ALUMINIO/TIPO 4": 0,
    
    "FERMIN/TIPO 1": 0,
    "FERMIN/TIPO 2": 0,
    "FERMIN/TIPO 3": 0,
    "FERMIN/TIPO 4": 0,
    "FERMIN/TIPO 5": 0,

    "EUROPEA/TIPO 1": 0,
    "EUROPEA/TIPO 2": 0,
    "EUROPEA/TIPO 3": 0,
    "EUROPEA/TIPO 4": 2,

    "GURSAM 120/TIPO 1/1572": 0,
    "GURSAM 120/TIPO 2/1572": 0,
    "GURSAM 120/TIPO 3/1572": 0,
    "GURSAM 120/TIPO 4/1572": 0,

    "GURSAM 120/TIPO 1/1090": 0,
    "GURSAM 120/TIPO 2/1090": 0,
    "GURSAM 120/TIPO 3/1090": 0,
    "GURSAM 120/TIPO 4/1090": 0,

    "GURSAM 120/TIPO 1/732": 0,
    "GURSAM 120/TIPO 2/732": 0,
    "GURSAM 120/TIPO 3/732": 0,
    "GURSAM 120/TIPO 4/732": 0,
  },

  "AM.8800": {
    "GURSAM 60/TIPO 1": 4,
    "GURSAM 60/TIPO 2": 0,
    "GURSAM 60/TIPO 3": 4,
    "GURSAM 60/TIPO 4": 2,
    "GURSAM 60/TIPO 5": 2,
    
    "ALUMINIO/TIPO 1": 4,
    "ALUMINIO/TIPO 2": 0,
    "ALUMINIO/TIPO 3": 4,
    "ALUMINIO/TIPO 4": 2,
    
    "FERMIN/TIPO 1": 2,
    "FERMIN/TIPO 2": 6,
    "FERMIN/TIPO 3": 2,
    "FERMIN/TIPO 4": 2,
    "FERMIN/TIPO 5": 2,

    "EUROPEA/TIPO 1": 0,
    "EUROPEA/TIPO 2": 0,
    "EUROPEA/TIPO 3": 0,
    "EUROPEA/TIPO 4": 4,

    "GURSAM 120/TIPO 1/1572": 0,
    "GURSAM 120/TIPO 2/1572": 0,
    "GURSAM 120/TIPO 3/1572": 0,
    "GURSAM 120/TIPO 4/1572": 0,

    "GURSAM 120/TIPO 1/1090": 0,
    "GURSAM 120/TIPO 2/1090": 0,
    "GURSAM 120/TIPO 3/1090": 0,
    "GURSAM 120/TIPO 4/1090": 0,

    "GURSAM 120/TIPO 1/732": 0,
    "GURSAM 120/TIPO 2/732": 0,
    "GURSAM 120/TIPO 3/732": 0,
    "GURSAM 120/TIPO 4/732": 0,
  },

  "AM.8900": {
    "GURSAM 60/TIPO 1": 0,
    "GURSAM 60/TIPO 2": 0,
    "GURSAM 60/TIPO 3": 0,
    "GURSAM 60/TIPO 4": 2,
    "GURSAM 60/TIPO 5": 2,
    
    "ALUMINIO/TIPO 1": 0,
    "ALUMINIO/TIPO 2": 0,
    "ALUMINIO/TIPO 3": 0,
    "ALUMINIO/TIPO 4": 2,
    
    "FERMIN/TIPO 1": 0,
    "FERMIN/TIPO 2": 0,
    "FERMIN/TIPO 3": 0,
    "FERMIN/TIPO 4": 2,
    "FERMIN/TIPO 5": 2,

    "EUROPEA/TIPO 1": 0,
    "EUROPEA/TIPO 2": 0,
    "EUROPEA/TIPO 3": 0,
    "EUROPEA/TIPO 4": 4,

    "GURSAM 120/TIPO 1/1572": 0,
    "GURSAM 120/TIPO 2/1572": 0,
    "GURSAM 120/TIPO 3/1572": 0,
    "GURSAM 120/TIPO 4/1572": 0,

    "GURSAM 120/TIPO 1/1090": 0,
    "GURSAM 120/TIPO 2/1090": 0,
    "GURSAM 120/TIPO 3/1090": 0,
    "GURSAM 120/TIPO 4/1090": 0,

    "GURSAM 120/TIPO 1/732": 0,
    "GURSAM 120/TIPO 2/732": 0,
    "GURSAM 120/TIPO 3/732": 0,
    "GURSAM 120/TIPO 4/732": 0,
  },

  "AM.9000": {
    "GURSAM 60/TIPO 1": 2,
    "GURSAM 60/TIPO 2": 3,
    "GURSAM 60/TIPO 3": 3,
    "GURSAM 60/TIPO 4": 3,
    "GURSAM 60/TIPO 5": 2,
    
    "ALUMINIO/TIPO 1": 2,
    "ALUMINIO/TIPO 2": 3,
    "ALUMINIO/TIPO 3": 3,
    "ALUMINIO/TIPO 4": 3,
    
    "FERMIN/TIPO 1": 2,
    "FERMIN/TIPO 2": 3,
    "FERMIN/TIPO 3": 3,
    "FERMIN/TIPO 4": 3,
    "FERMIN/TIPO 5": 2,

    "EUROPEA/TIPO 1": 3,
    "EUROPEA/TIPO 2": 3,
    "EUROPEA/TIPO 3": 3,
    "EUROPEA/TIPO 4": 2,

    "GURSAM 120/TIPO 1/1572": 3,
    "GURSAM 120/TIPO 2/1572": 3,
    "GURSAM 120/TIPO 3/1572": 3,
    "GURSAM 120/TIPO 4/1572": 2,

    "GURSAM 120/TIPO 1/1090": 3,
    "GURSAM 120/TIPO 2/1090": 3,
    "GURSAM 120/TIPO 3/1090": 3,
    "GURSAM 120/TIPO 4/1090": 2,

    "GURSAM 120/TIPO 1/732": 3,
    "GURSAM 120/TIPO 2/732": 3,
    "GURSAM 120/TIPO 3/732": 3,
    "GURSAM 120/TIPO 4/732": 2,
  },

  "AM.9200": {
    "GURSAM 60/TIPO 1": 5,
    "GURSAM 60/TIPO 2": 5,
    "GURSAM 60/TIPO 3": 5,
    "GURSAM 60/TIPO 4": 6,
    "GURSAM 60/TIPO 5": 6,
    
    "ALUMINIO/TIPO 1": 5,
    "ALUMINIO/TIPO 2": 5,
    "ALUMINIO/TIPO 3": 5,
    "ALUMINIO/TIPO 4": 6,
    
    "FERMIN/TIPO 1": 5,
    "FERMIN/TIPO 2": 5,
    "FERMIN/TIPO 3": 5,
    "FERMIN/TIPO 4": 6,
    "FERMIN/TIPO 5": 6,

    "EUROPEA/TIPO 1": 7,
    "EUROPEA/TIPO 2": 7,
    "EUROPEA/TIPO 3": 6,
    "EUROPEA/TIPO 4": 10,

    "GURSAM 120/TIPO 1/1572": 7,
    "GURSAM 120/TIPO 2/1572": 8,
    "GURSAM 120/TIPO 3/1572": 7,
    "GURSAM 120/TIPO 4/1572": 10,

    "GURSAM 120/TIPO 1/1090": 7,
    "GURSAM 120/TIPO 2/1090": 8,
    "GURSAM 120/TIPO 3/1090": 7,
    "GURSAM 120/TIPO 4/1090": 10,

    "GURSAM 120/TIPO 1/732": 7,
    "GURSAM 120/TIPO 2/732": 8,
    "GURSAM 120/TIPO 3/732": 7,
    "GURSAM 120/TIPO 4/732": 10,
  },

};

/**
 FUNCIONES PARA DESPIECE
 */

// 1. Pieza: AM.0100 - HUSILLO DE NIVELACION
function calcularAM0100({ alturaEscaleraObra, tipoEscalera }) {
  if (alturaEscaleraObra > 0) return 0;
  if (["FERMIN", "ALUMINIO", "GURSAM 60"].includes(tipoEscalera)) return 4;
  if (["EUROPEA", "GURSAM 120"].includes(tipoEscalera)) return 8;
  return 0;
}

// 2. Pieza: AM.0300 - PIEZA DE INICIO
function calcularAM0300(valorCalcularAM0100) {
  return valorCalcularAM0100; 
}

// 3. Pieza: AM.0400 - PERFIL METALICO UPN DE 3.00m
function calcularAM0400() {
  return 0;
}

// 4. Pieza: AM.0600 - VERTICAL 3.00m
function calcularAM0600() {
  return 0;
}

// 5. Pieza: AM.0700 - VERTICAL 2.00m
function calcularAM0700({ alturaTotal, alturaEscaleraObra, tipoEscalera }) {
  const diff = alturaTotal - alturaEscaleraObra;
  if (["FERMIN", "ALUMINIO", "GURSAM 60"].includes(tipoEscalera)) {
    return esPar(diff) ? 2 * diff : 2 * diff - 2;
  }
  if (["EUROPEA", "GURSAM 120"].includes(tipoEscalera)) {
    return esPar(diff) ? 4 * diff : "NE";
  }
  return 0;
}

// 6. AM.0900 - VERTICAL 1.50m
function calcularAM0900() {
  return 0;
}

// 7. AM.1000 - VERTICAL 1.00m
function calcularAM1000({
  alturaTotal,
  alturaEscaleraObra,
  tipoEscalera,
  tipoIngreso
}) {
  const diff = alturaTotal - alturaEscaleraObra;
  const esImpar = (x) => x % 2 !== 0;

  let parte1 = 0;
  if (
    (alturaEscaleraObra === 0 && alturaTotal > 0) ||
    (alturaEscaleraObra > 0 && alturaTotal > 0)
  ) {
    if (
      esImpar(diff) &&
      ["FERMIN", "ALUMINIO", "GURSAM 60"].includes(tipoEscalera)
    ) {
      parte1 = 4;
    }
  }

  const clave = `${tipoEscalera}/${tipoIngreso}`;
  const valorMatriz = apoyo2Despiece?.["AM.1000"]?.[clave] ?? 0;

  return parte1 + valorMatriz;
}

// 8. AM.1100 - VERTICAL 0.50m
function calcularAM1100() {
  return 0;
}


// 9. Pieza: AM.1150 - ESPIGA
function calcularAM1150(valorCalcularAM0700, valorCalcularAM1000, valorCalcularAM9000) {

  return valorCalcularAM0700 + valorCalcularAM1000 + valorCalcularAM9000; // F17 + F19 + F93
}

// 10. AM.1300 - HORIZONTAL MULTI DE 3072mm
function calcularAM1300({
  alturaTotal,
  alturaEscaleraObra,
  tipoEscalera,
  tipoIngreso
}) {
  const diff = alturaTotal - alturaEscaleraObra;
  const esPar = (x) => x % 2 === 0;
  const clave = "AM.1300";
  const fila = apoyo2Despiece[clave];
  let parte1 = 0;
  let parte2 = 0;

  // Parte 1: lógica según tipo de escalera
  if (["FERMIN", "ALUMINIO", "GURSAM 60"].includes(tipoEscalera)) {
    if (alturaEscaleraObra === 0 && alturaTotal > 0) {
      parte1 = esPar(diff) ? 2 * diff + 2 : 2 * diff + 4;
    } else if (alturaEscaleraObra > 0 && alturaTotal > 0) {
      parte1 = esPar(diff) ? 2 * diff : 2 * diff + 2;
    }
  }

  // Parte 2: búsqueda en matriz apoyo2Despiece
  if (
    tipoEscalera === "" ||
    tipoIngreso === "" ||
    alturaEscaleraObra > 0 ||
    tipoEscalera === "GURSAM 120"
  ) {
    parte2 = 0;
  } else {
    const colKey = `${tipoEscalera}/${tipoIngreso}`;
    parte2 = fila?.[colKey] ?? 0;
  }

  return parte1 + parte2;
}

// 11. AM.1400 - HORIZONTAL MULTI DE 2572mm
function calcularAM1400({
  alturaTotal,
  alturaEscaleraObra,
  tipoEscalera,
  tipoIngreso
}) {
  const diff = alturaTotal - alturaEscaleraObra;
  const esPar = (x) => x % 2 === 0;
  const clave = "AM.1400";
  const fila = apoyo2Despiece[clave];

  let parte1 = 0;
  let parte2 = 0;

  // Parte 1: lógica basada en GURSAM 120
  if (tipoEscalera === "GURSAM 120") {
    if (alturaEscaleraObra === 0 && alturaTotal > 0) {
      parte1 = esPar(diff) ? 3 * diff + 4 : 0;
    } else if (alturaEscaleraObra > 0 && alturaTotal > 0) {
      parte1 = esPar(diff) ? 3 * diff : 0;
    }
  }

  // Parte 2: búsqueda en Apoyo2Despiece si tipoEscalera o tipoIngreso no están vacíos
  if (tipoEscalera !== "" && tipoIngreso !== "") {
    const colKey = `${tipoEscalera}/${tipoIngreso}`;
    parte2 = fila?.[colKey] ?? 0;
  }

  return parte1 + parte2;
}


// 12. AM.1500 - HORIZONTAL MULTI DE 2072mm
function calcularAM1500({
  alturaTotal,
  alturaEscaleraObra,
  tipoEscalera,
  tipoIngreso,
  anchoDescanso
}) {
  const diff = alturaTotal - alturaEscaleraObra;
  const esPar = (x) => x % 2 === 0;
  const clave = "AM.1500";
  const fila = apoyo2Despiece[clave];

  let parte1 = 0;
  let parte2 = 0;
  let parte3 = 0;

  // Parte 1: lógica condicional con GURSAM 120 o EUROPEA
  if (["EUROPEA", "GURSAM 120"].includes(tipoEscalera)) {
    if (alturaEscaleraObra === 0 && alturaTotal > 0) {
      parte1 = esPar(diff) ? diff + 2 : 0;
    } else if (alturaEscaleraObra > 0 && alturaTotal > 0) {
      parte1 = esPar(diff) ? diff : 0;
    }
  }

  // Parte 2: búsqueda por tipoEscalera + tipoIngreso
  if (
    tipoEscalera !== "" &&
    tipoIngreso !== "" &&
    !(alturaEscaleraObra > 0 || tipoEscalera === "GURSAM 120")
  ) {
    const colKey = `${tipoEscalera}/${tipoIngreso}`;
    parte2 = fila?.[colKey] ?? 0;
  }

  // Parte 3: búsqueda por tipoEscalera + tipoIngreso + anchoDescanso
  if (
    tipoEscalera !== "" &&
    tipoIngreso !== "" &&
    !(alturaEscaleraObra > 0 || ["GURSAM 60", "EUROPEA", "FERMIN", "ALUMINIO"].includes(tipoEscalera))
  ) {
    const colKey = `${tipoEscalera}/${tipoIngreso}/${anchoDescanso}`;
    parte3 = fila?.[colKey] ?? 0;
  }

  return parte1 + parte2 + parte3;
}

// 13. AM.1600 - HORIZONTAL MULTI DE 1572mm
function calcularAM1600({
  alturaTotal,
  alturaEscaleraObra,
  tipoEscalera,
  tipoIngreso,
  anchoDescanso
}) {
  const diff = alturaTotal - alturaEscaleraObra;
  const esPar = (x) => x % 2 === 0;
  const clave = "AM.1600";
  const fila = apoyo2Despiece?.[clave] || {};
  const colKeySimple = `${tipoEscalera}/${tipoIngreso}`;
  const colKeyCompuesta = `${tipoEscalera}/${tipoIngreso}/${anchoDescanso}`;

  let parte1 = 0;

  // Parte 1: Por tipo de escalera
  if (["FERMIN", "ALUMINIO", "GURSAM 60"].includes(tipoEscalera)) {
    if ((alturaEscaleraObra === 0 && alturaTotal > 0) || (alturaEscaleraObra > 0 && alturaTotal > 0)) {
      parte1 = esPar(diff) ? 2 * diff : 2 * diff + 2;
    }
  } else if (tipoEscalera === "EUROPEA") {
    if ((alturaEscaleraObra === 0 && alturaTotal > 0)) {
      parte1 = esPar(diff) ? 3 * diff + 4 : 0;
    } else if ((alturaEscaleraObra > 0 && alturaTotal > 0)) {
      parte1 = esPar(diff) ? 3 * diff : 0;
    }
  }

  // Parte 2: GURSAM 120 con coincidencia en descanso
  let parte2 = 0;
  if (tipoEscalera === "GURSAM 120" && anchoDescanso && anchoDescanso.toString() === "1572") {
    if ((alturaEscaleraObra === 0 && alturaTotal > 0)) {
      parte2 = esPar(diff) ? 4 * diff + 2 : 0;
    } else if ((alturaEscaleraObra > 0 && alturaTotal > 0)) {
      parte2 = esPar(diff) ? 4 * diff : 0;
    }
  }

  // Parte 3: Lookup simple
  let parte3 = 0;
  if (
    tipoEscalera !== "" &&
    tipoIngreso !== "" &&
    alturaEscaleraObra <= 0 &&
    tipoEscalera !== "GURSAM 120"
  ) {
    parte3 = fila[colKeySimple] || 0;
  }

  // Parte 4: Lookup compuesta (con anchoDescanso)
  let parte4 = 0;
  if (
    tipoEscalera !== "" &&
    tipoIngreso !== "" &&
    alturaEscaleraObra <= 0 &&
    !["GURSAM 60", "EUROPEA", "FERMIN", "ALUMINIO"].includes(tipoEscalera)
  ) {
    parte4 = fila[colKeyCompuesta] || 0;
  }

  return parte1 + parte2 + parte3 + parte4;
}


// 14. AM.1800 - HORIZONTAL MULTI DE 1090mm
function calcularAM1800({
  alturaTotal,
  alturaEscaleraObra,
  tipoEscalera,
  tipoIngreso,
  anchoDescanso
}) {
  const diff = alturaTotal - alturaEscaleraObra;
  const esPar = (x) => x % 2 === 0;
  const clave = "AM.1800";
  const fila = apoyo2Despiece?.[clave] || {};
  const colKeySimple = `${tipoEscalera}/${tipoIngreso}`;
  const colKeyCompuesta = `${tipoEscalera}/${tipoIngreso}/${anchoDescanso}`;

  let parte1 = 0;
  if (
    tipoEscalera === "GURSAM 120" &&
    anchoDescanso?.toString() === "1090"
  ) {
    if (alturaEscaleraObra === 0 && alturaTotal > 0) {
      parte1 = esPar(diff) ? 4 * diff + 2 : 0;
    } else if (alturaEscaleraObra > 0 && alturaTotal > 0) {
      parte1 = esPar(diff) ? 4 * diff : 0;
    }
  }

  let parte2 = 0;
  if (
    tipoEscalera !== "" &&
    tipoIngreso !== "" &&
    alturaEscaleraObra <= 0 &&
    tipoEscalera !== "GURSAM 120"
  ) {
    parte2 = fila[colKeySimple] || 0;
  }

  let parte3 = 0;
  if (
    tipoEscalera !== "" &&
    tipoIngreso !== "" &&
    alturaEscaleraObra <= 0 &&
    !["GURSAM 60", "EUROPEA", "FERMIN", "ALUMINIO"].includes(tipoEscalera)
  ) {
    parte3 = fila[colKeyCompuesta] || 0;
  }

  return parte1 + parte2 + parte3;
}


// 15. AM.1900 - HORIZONTAL MULTI DE 1020mm
function calcularAM1900() {
  return 0;
}

// 16. AM.2000 - HORIZONTAL MULTI DE 0732mm
function calcularAM2000({
  alturaTotal,
  alturaEscaleraObra,
  tipoEscalera,
  tipoIngreso,
  anchoDescanso
}) {
  const diff = alturaTotal - alturaEscaleraObra;
  const esPar = (x) => x % 2 === 0;
  const clave = "AM.2000";
  const fila = apoyo2Despiece?.[clave] || {};
  const colKeySimple = `${tipoEscalera}/${tipoIngreso}`;
  const colKeyCompuesta = `${tipoEscalera}/${tipoIngreso}/${anchoDescanso}`;

  let parte1 = 0;
  if (tipoEscalera === "EUROPEA") {
    if (alturaEscaleraObra === 0 && alturaTotal > 0) {
      parte1 = esPar(diff) ? 4 * diff + 2 : 0;
    } else if (alturaEscaleraObra > 0 && alturaTotal > 0) {
      parte1 = esPar(diff) ? 4 * diff : 0;
    }
  }

  let parte2 = 0;
  if (tipoEscalera === "GURSAM 120" && anchoDescanso?.toString() === "732") {
    if (alturaEscaleraObra === 0 && alturaTotal > 0) {
      parte2 = esPar(diff) ? 4 * diff + 2 : 0;
    } else if (alturaEscaleraObra > 0 && alturaTotal > 0) {
      parte2 = esPar(diff) ? 4 * diff : 0;
    }
  }

  let parte3 = 0;
  if (
    tipoEscalera !== "" &&
    tipoIngreso !== "" &&
    alturaEscaleraObra <= 0 &&
    tipoEscalera !== "GURSAM 120"
  ) {
    parte3 = fila[colKeySimple] || 0;
  }

  let parte4 = 0;
  if (
    tipoEscalera !== "" &&
    tipoIngreso !== "" &&
    alturaEscaleraObra <= 0 &&
    !["GURSAM 60", "EUROPEA", "FERMIN", "ALUMINIO"].includes(tipoEscalera)
  ) {
    parte4 = fila[colKeyCompuesta] || 0;
  }

  return parte1 + parte2 + parte3 + parte4;
}


// 17. AM.2020 - HORIZONTAL MULTI DE 0432mm PARA MENSULA - N
function calcularAM2020() {
  return 0;
}

// 18. AM.2050 - HORIZONTAL MULTI DE 0432mm PARA MENSULA - E
function calcularAM2050() {
  return 0;
}

// 19. AM.2100 - DOBLE LARGUERO 3072mm
function calcularAM2100() {
  return 0;
}

// 20. AM.2200 - DOBLE LARGUERO 2572mm
function calcularAM2200({ alturaTotal, alturaEscaleraObra, tipoEscalera }) {
  const diff = alturaTotal - alturaEscaleraObra;
  const esPar = x => x % 2 === 0;

  if (tipoEscalera === "GURSAM 120") {
    if (alturaEscaleraObra === 0 && alturaTotal > 0) {
      return esPar(diff) ? 0.5 * diff + 1 : 0;
    } else if (alturaEscaleraObra > 0 && alturaTotal > 0) {
      return esPar(diff) ? 0.5 * diff : 0;
    }
  }
  return 0;
}

// 21. AM.2250 - DOBLE LARGUERO 2572mm PARA ESCALERA GURSAM DE 120
function calcularAM2250() {
  return 0;
}

// 22. AM.2300 - VIGA PÓRTICO 7710mm
function calcularAM2300() {
  return 0;
}

// 23. AM.2400 - VIGA PÓRTICO 6140mm
function calcularAM2400() {
  return 0;
}

// 24. AM.2500 - VIGA PÓRTICO 5140mm
function calcularAM2500() {
  return 0;
}

// 25. AM.2600 - VIGA PÓRTICO 3072mm
function calcularAM2600() {
  return 0;
}

// 26. AM.2700 - VIGA PÓRTICO 1572mm
function calcularAM2700() {
  return 0;
}

// 27. AM.3100 - MENSULA 1090mm
function calcularAM3100() {
  return 0;
}

// 28. AM.3200 - MENSULA 700mm
function calcularAM3200() {
  return 0;
}

// 29. AM.3300 - MENSULA 300mm
function calcularAM3300() {
  return 0;
}

// 30. AM.3400 - RODAPIÉ 3072mm - E
function calcularAM3400() {
  return 0;
}

// 31. AM.3500 - RODAPIÉ 2572mm - E
function calcularAM3500() {
  return 0;
}

// 32. AM.3600 - RODAPIÉ 2072mm - E
function calcularAM3600() {
  return 0;
}

// 33. AM.3700 - RODAPIÉ 1020mm - E
function calcularAM3700() {
  return 0;
}

// 34. AM.3800 - RODAPIÉ 0732mm - E
function calcularAM3800() {
  return 0;
}

// 35. AM.3900 - RODAPIÉ 3072mm - C
function calcularAM3900() {
  return 0;
}

// 36. AM.4000 - RODAPIÉ 2572mm - C
function calcularAM4000() {
  return 0;
}

// 37. AM.4100 - RODAPIÉ 2072mm - C
function calcularAM4100() {
  return 0;
}

// 38. AM.4200 - RODAPIÉ 1572mm - C
function calcularAM4200() {
  return 0;
}

// 39. AM.4300 - RODAPIÉ 1090mm - C
function calcularAM4300() {
  return 0;
}

// 40. AM.4400 - RODAPIÉ 0732mm - C
function calcularAM4400() {
  return 0;
}

// 41. AM.4500 - RODAPIÉ 3072mm - N
function calcularAM4500() {
  return 0;
}

// 42. AM.4600 - RODAPIÉ 2572mm - N
function calcularAM4600() {
  return 0;
}

// 43. AM.4700 - RODAPIÉ 2072mm - N
function calcularAM4700() {
  return 0;
}

// 44. AM.4800 - RODAPIÉ 1572mm - N
function calcularAM4800() {
  return 0;
}

// 45. AM.4900 - RODAPIÉ 1090mm - N
function calcularAM4900() {
  return 0;
}

// 46. AM.5000 - RODAPIÉ 0732mm - N
function calcularAM5000() {
  return 0;
}

// 47. AM.5100 - DIAGONAL DE 3072mm
function calcularAM5100({
  alturaTotal,
  alturaEscaleraObra,
  tipoEscalera,
  tipoIngreso
}) {
  const diff = alturaTotal - alturaEscaleraObra;
  const esPar = (x) => x % 2 === 0;
  const clave = "AM.5100";
  const fila = apoyo2Despiece[clave];

  let parte1 = 0;
  let parte2 = 0;

  // Parte 1: Cálculo para FERMIN, ALUMINIO, GURSAM 60
  if (["FERMIN", "ALUMINIO", "GURSAM 60"].includes(tipoEscalera)) {
    if (
      (alturaEscaleraObra === 0 && alturaTotal > 0) ||
      (alturaEscaleraObra > 0 && alturaTotal > 0)
    ) {
      parte1 = esPar(diff) ? 0.5 * diff : 0.5 * diff + 0.5;
    }
  }

  // Parte 2: Búsqueda en matriz (INDICE+COINCIDIR) si no es GURSAM 120 y hay datos válidos
  if (
    tipoEscalera !== "" &&
    tipoIngreso !== "" &&
    !(alturaEscaleraObra > 0 || tipoEscalera === "GURSAM 120")
  ) {
    const colKey = `${tipoEscalera}/${tipoIngreso}`;
    parte2 = fila?.[colKey] ?? 0;
  }

  return parte1 + parte2;
}


// 48. AM.5200 - DIAGONAL DE 2572mm
function calcularAM5200({ alturaTotal, alturaEscaleraObra, tipoEscalera }) {
  const diff = alturaTotal - alturaEscaleraObra;

  if (tipoEscalera === "GURSAM 120") {
    if ((alturaEscaleraObra === 0 && alturaTotal > 0)) {
      return esPar(diff) ? 2 * diff - 1 : 0;
    } else if ((alturaEscaleraObra > 0 && alturaTotal > 0)) {
      return 2 * diff;
    }
  }

  return 0;
}

// 49. AM.5300 - DIAGONAL DE 2072mm
function calcularAM5300({ alturaTotal, alturaEscaleraObra, tipoEscalera }) {
  const diff = alturaTotal - alturaEscaleraObra;

  if (["EUROPEA", "GURSAM 120"].includes(tipoEscalera)) {
    if ((alturaEscaleraObra === 0 && alturaTotal > 0) || (alturaEscaleraObra > 0 && alturaTotal > 0)) {
      return esPar(diff) ? 0.5 * diff : 0;
    }
  }

  return 0;
}

// 50. AM.5400 - DIAGONAL DE 1572mm
function calcularAM5400({ alturaTotal, alturaEscaleraObra, tipoEscalera }) {

  const diff = alturaTotal - alturaEscaleraObra;

  if (["FERMIN", "ALUMINIO", "GURSAM 60"].includes(tipoEscalera)) {
    if (alturaEscaleraObra === 0 && alturaTotal > 0) {
      return esPar(diff) ? diff - 1 : diff;
    } else if (alturaEscaleraObra > 0 && alturaTotal > 0) {
      return esPar(diff) ? diff : diff + 1;
    }
  }

  if (tipoEscalera === "EUROPEA") {
    if (alturaTotal > 0 && alturaEscaleraObra >= 0) {
      return esPar(diff) ? 1.5 * diff : 0;
    }
  }

  return 0;
}

// 51. AM.5500 - DIAGONAL DE 1090mm
function calcularAM5500() {
  return 0;
}

// 52. AM.5600 - DIAGONAL DE 1020mm
function calcularAM5600() {
  return 0;
}

// 53. AM.6000 - PLATAFORMA METÁLICA DE 290x3072mm - E
function calcularAM6000() {
  return 0;
}

// 54. AM.6100 - PLATAFORMA METÁLICA DE 290x2572mm - E
function calcularAM6100() {
  return 0;
}

// 55. AM.6200 - PLATAFORMA METÁLICA DE 290x2072mm - E
function calcularAM6200() {
  return 0;
}

// 56. AM.6300 - PLATAFORMA METÁLICA DE 290x1572mm - E
function calcularAM6300() {
  return 0;
}

// 57. AM.6400 - PLATAFORMA METÁLICA DE 290x1020mm - E
function calcularAM6400() {
  return 0;
}

// 58. AM.6500 - PLATAFORMA METÁLICA DE 290x0732mm - E
function calcularAM6500() {
  return 0;
}

// 59. AM.6600 - PLATAFORMA METÁLICA DE 320x3072mm - C
function calcularAM6600({
  tipoEscalera,
  tipoIngreso,
  alturaEscaleraObra
}) {
  const clave = "AM.6600";
  const fila = apoyo2Despiece?.[clave] || {};
  const colKey = `${tipoEscalera}/${tipoIngreso}`;

  // Condiciones que invalidan el cálculo
  const condicionesInvalidas =
    tipoEscalera === "" ||
    tipoIngreso === "" ||
    alturaEscaleraObra > 0 ||
    tipoEscalera === "GURSAM 120";

  if (condicionesInvalidas) return 0;

  return fila[colKey] || 0;
}


// 60. AM.6700 - PLATAFORMA METÁLICA DE 320x2572mm - C
function calcularAM6700({
  alturaTotal,
  alturaEscaleraObra,
  tipoEscalera,
  tipoIngreso,
  anchoDescanso
}) {
  const clave = "AM.6700";
  const fila = apoyo2Despiece?.[clave] || {};
  const colKey = `${tipoEscalera}/${tipoIngreso}`;
  const diff = alturaTotal - alturaEscaleraObra;
  const esPar = (x) => x % 2 === 0;

  let parte1 = 0;

  if (tipoEscalera === "GURSAM 120") {
    if (alturaEscaleraObra === 0 && alturaTotal > 0 && esPar(diff)) {
      const factor = anchoDescanso === 732 ? 2 : anchoDescanso === 1090 ? 3 : anchoDescanso === 1572 ? 4 : 0;
      parte1 = factor * (0.5 * diff + 1);
    } else if (alturaEscaleraObra > 0 && alturaTotal > 0 && esPar(diff)) {
      const factor = anchoDescanso === 732 ? 2 : anchoDescanso === 1090 ? 3 : anchoDescanso === 1572 ? 4 : 0;
      parte1 = factor * (0.5 * diff);
    }
  }

  const condicionesInvalidas1 =
    tipoEscalera === "" || tipoIngreso === "" || alturaEscaleraObra > 0 || tipoEscalera === "GURSAM 120";
  const parte2 = condicionesInvalidas1 ? 0 : fila[colKey] || 0;

  const condicionesInvalidas2 =
    tipoEscalera === "" ||
    tipoIngreso === "" ||
    alturaEscaleraObra > 0 ||
    ["GURSAM 60", "EUROPEA", "FERMIN", "ALUMINIO"].includes(tipoEscalera);
  const colKey2 = `${tipoEscalera}/${tipoIngreso}/${anchoDescanso}`;
  const parte3 = condicionesInvalidas2 ? 0 : fila[colKey2] || 0;

  return parte1 + parte2 + parte3;
}

// 61. AM.6800 - PLATAFORMA METÁLICA DE 320x2072mm - C
function calcularAM6800({
  tipoEscalera,
  tipoIngreso,
  alturaEscaleraObra,
  anchoDescanso
}) {
  const clave = "AM.6800";
  const fila = apoyo2Despiece?.[clave] || {};

  // Parte 1: columna según tipoEscalera + tipoIngreso
  const condicionesInvalidas1 =
    tipoEscalera === "" || tipoIngreso === "" || alturaEscaleraObra > 0 || tipoEscalera === "GURSAM 120";
  const colKey1 = `${tipoEscalera}/${tipoIngreso}`;
  const parte1 = condicionesInvalidas1 ? 0 : fila[colKey1] || 0;

  // Parte 2: columna según tipoEscalera + tipoIngreso + anchoDescanso
  const condicionesInvalidas2 =
    tipoEscalera === "" ||
    tipoIngreso === "" ||
    alturaEscaleraObra > 0 ||
    ["GURSAM 60", "EUROPEA", "FERMIN", "ALUMINIO"].includes(tipoEscalera);
  const colKey2 = `${tipoEscalera}/${tipoIngreso}/${anchoDescanso}`;
  const parte2 = condicionesInvalidas2 ? 0 : fila[colKey2] || 0;

  return parte1 + parte2;
}


// 62. AM.6900 - PLATAFORMA METÁLICA DE 320x1572mm - C
function calcularAM6900({
  tipoEscalera,
  tipoIngreso,
  alturaTotal,
  alturaEscaleraObra,
  anchoDescanso
}) {
  const clave = "AM.6900";
  const fila = apoyo2Despiece?.[clave] || {};
  const esPar = (x) => x % 2 === 0;

  const diff = alturaTotal - alturaEscaleraObra;

  let parte1 = 0;

  if (tipoEscalera === "EUROPEA") {
    if (alturaEscaleraObra === 0 && alturaTotal > 0) {
      if (esPar(diff)) {
        parte1 = (anchoDescanso === 1572 ? 4 : 0) * (0.5 * diff + 1);
      }
    } else if (alturaEscaleraObra > 0 && alturaTotal > 0) {
      if (esPar(diff)) {
        parte1 = (anchoDescanso === 1572 ? 4 : 0) * 0.5 * diff;
      }
    }
  }

  const condicionesInvalidas =
    tipoEscalera === "" ||
    tipoIngreso === "" ||
    alturaEscaleraObra > 0 ||
    tipoEscalera === "GURSAM 120";

  const colKey = `${tipoEscalera}/${tipoIngreso}`;
  const parte2 = condicionesInvalidas ? 0 : fila[colKey] || 0;

  return parte1 + parte2;
}


// 63. AM.7000 - PLATAFORMA METÁLICA DE 320x1090mm - C
function calcularAM7000() {
  return 0;
}

// 64. AM.7100 - PLATAFORMA METÁLICA DE 320x0732mm - C
function calcularAM7100() {
  return 0;
}

// 65. AM.7200 - PLATAFORMA METÁLICA DE 190x3072mm - C
function calcularAM7200({ alturaTotal, alturaEscaleraObra, tipoEscalera }) {
  const diff = alturaTotal - alturaEscaleraObra;
  if (["GURSAM 60", "ALUMINIO"].includes(tipoEscalera)) {
    if (alturaEscaleraObra === 0 && alturaTotal > 0) {
      return esPar(diff) ? 0.5 * diff - 1 : 0.5 * diff - 0.5;
    } else if (alturaEscaleraObra > 0 && alturaTotal > 0) {
      return esPar(diff) ? 0.5 * diff : 0.5 * diff + 0.5;
    }
  }
  return 0;
}

// 66. AM.7300 - PLATAFORMA METÁLICA DE 190x2572mm - C
function calcularAM7300({ alturaTotal, alturaEscaleraObra, tipoEscalera }) {
  const diff = alturaTotal - alturaEscaleraObra;
  if (tipoEscalera === "GURSAM 120") {
    if (alturaEscaleraObra === 0 && alturaTotal > 0 && esPar(diff)) {
      return 0.5 * diff + 1;
    } else if (alturaEscaleraObra > 0 && alturaTotal > 0 && esPar(diff)) {
      return 0.5 * diff;
    }
  }
  return 0;
}

// 67. AM.7400 - PLATAFORMA METÁLICA DE 190x2072mm - C
function calcularAM7400() {
  return 0;
}

// 68. AM.7410 - PLATAFORMA METÁLICA DE 190x1572mm - C
function calcularAM7410({ alturaTotal, alturaEscaleraObra, tipoEscalera, anchoDescanso }) {
  const diff = alturaTotal - alturaEscaleraObra;
  if (tipoEscalera === "EUROPEA") {
    const factor = anchoDescanso === 1572 ? 1 : 0;
    if (alturaEscaleraObra === 0 && alturaTotal > 0 && esPar(diff)) {
      return factor * (0.5 * diff + 1);
    } else if (alturaEscaleraObra > 0 && alturaTotal > 0 && esPar(diff)) {
      return factor * 0.5 * diff;
    }
  }
  return 0;
}

// 69. AM.7420 - PLATAFORMA METÁLICA DE 190x1090mm - C
function calcularAM7420() {
  return 0;
}

// 70. AM.7430 - PLATAFORMA METÁLICA DE 190x1020mm - C
function calcularAM7430() {
  return 0;
}

// 71. AM.7440 - PLATAFORMA METÁLICA DE 190x0732mm - C
function calcularAM7440() {
  return 0;
}

// 72. AM.8100 - ESCALERA DE ACERO 3.00m
function calcularAM8100() {
  return 0;
}

// 73. AM.8200 - ESCALERA DE ACERO 1.50m
function calcularAM8200() {
  return 0;
}

// 74. AM.8300 - ESCALERA DE ACERO 1.00m
function calcularAM8300() {
  return 0;
}

// 75. AM.8400 - ENGANCHE PARA ESCALERA DE ACERO
function calcularAM8400() {
  return 0;
}

// 76. AM.8500 - TUBO CON GANCHO 1.00m
function calcularAM8500({ tipoAnclaje, tipoEscalera, alturaTotal, alturaEscaleraObra }) {
  const diff = alturaTotal - alturaEscaleraObra;
  if (tipoAnclaje !== "TUBO 1.0") return 0;

  if (["FERMIN", "ALUMINIO", "GURSAM 60", "EUROPEA"].includes(tipoEscalera)) {
    return alturaEscaleraObra === 0
      ? 2 * Math.ceil(diff / 2)
      : 2 * (Math.ceil(alturaTotal / 2) - Math.ceil(alturaEscaleraObra / 2));
  }

  if (tipoEscalera === "GURSAM 120") {
    return 2 * Math.ceil(diff / 6);
  }

  return 0;
}

// 77. AM.8600 - TUBO CON GANCHO 0.50m
function calcularAM8600({ tipoAnclaje, tipoEscalera, alturaTotal, alturaEscaleraObra }) {
  const diff = alturaTotal - alturaEscaleraObra;
  if (tipoAnclaje !== "TUBO 0.5") return 0;

  if (["FERMIN", "ALUMINIO", "GURSAM 60", "EUROPEA"].includes(tipoEscalera)) {
    return alturaEscaleraObra === 0
      ? 2 * Math.ceil(diff / 2)
      : 2 * (Math.ceil(alturaTotal / 2) - Math.ceil(alturaEscaleraObra / 2));
  }

  if (tipoEscalera === "GURSAM 120") {
    return 2 * Math.ceil(diff / 6);
  }

  return 0;
}

// 78. AM.8700 - TUBO DE ANCLAJE FERMIN
function calcularAM8700({ tipoAnclaje, tipoEscalera, alturaTotal, alturaEscaleraObra }) {
  const diff = alturaTotal - alturaEscaleraObra;
  if (tipoAnclaje !== "FERMIN") return 0;

  if (["FERMIN", "ALUMINIO", "GURSAM 60"].includes(tipoEscalera)) {
    if (alturaEscaleraObra === 0 && alturaTotal > 0) {
      return esPar(diff) ? diff + 2 : diff + 3;
    }
    if (alturaEscaleraObra > 0 && alturaTotal > 0) {
      return esPar(diff) ? diff : diff + 1;
    }
  }

  if (["GURSAM 120", "EUROPEA"].includes(tipoEscalera)) {
    if (alturaEscaleraObra === 0 && alturaTotal > 0) {
      return esPar(diff) ? 2 * diff + 2 : 0;
    }
    if (alturaEscaleraObra > 0 && alturaTotal > 0) {
      return esPar(diff) ? 2 * diff : 0;
    }
  }

  return 0;
}

// 79. AM.8800 - BRIDA GIRATORIA tipoAnclaje, tipoEscalera, alturaTotal, alturaEscaleraObra
function calcularAM8800({
  alturaEscaleraObra,
  tipoEscalera,
  tipoIngreso,
  tipoAnclaje,
  valorCalcularAM8500 = 0,
  valorCalcularAM8600 = 0
}) {

  const clave = "AM.8800"; // Fila buscada en la tabla
  const fila = apoyo2Despiece[clave] || {};
  const esCampoVacio = (val) => val === "" || val === null || val === undefined;

  // 1. Si F5 > 0 → F88 + F89

  if (alturaEscaleraObra > 0) {
    return valorCalcularAM8500 + valorCalcularAM8600;
  }

  // 2. Si tipoAnclaje = "FERMIN" → 0
  if (tipoAnclaje === "FERMIN") {
    return 0;
  }

  // 3. Si tipoAnclaje = "TUBO 0.5" o "TUBO 1.0" → F88 + F89
  if (["TUBO 0.5", "TUBO 1.0"].includes(tipoAnclaje)) {
    return valorCalcularAM8500 + valorCalcularAM8600;
  }

  // 4. Si tipoEscalera o tipoIngreso están vacíos → 0
  if (esCampoVacio(tipoEscalera) || esCampoVacio(tipoIngreso)) {
    return 0;
  }

  // 5. Buscar en la tabla Apoyo2Despiece
  const colKey = `${tipoEscalera}/${tipoIngreso}`; 
  const valor = fila[colKey] || 0;

  return valor;
}


// 80. AM.8900 - BRIDA FIJA
function calcularAM8900({
  alturaEscaleraObra,
  tipoAnclaje,
  tipoEscalera,
  tipoIngreso,
  valorCalcularAM8700 = 0, // Corresponde a F90
}) {
  const clave = "AM.8900";
  const fila = apoyo2Despiece?.[clave] || {};
  const esCampoVacio = (val) => val === "" || val === null || val === undefined;

  // Parte 1: si hay altura de escalera en obra, devolver valor fijo
  if (alturaEscaleraObra > 0) {
    return valorCalcularAM8700;
  }

  // Parte 2: tipo de anclaje
  if (tipoAnclaje === "FERMIN") {
    return valorCalcularAM8700;
  }

  if (["TUBO 0.5", "TUBO 1.0"].includes(tipoAnclaje)) {
    return 0;
  }

  // Parte 3: búsqueda en la matriz Apoyo2Despiece si hay datos suficientes
  if (!esCampoVacio(tipoEscalera) && !esCampoVacio(tipoIngreso)) {
    const colKey = `${tipoEscalera}/${tipoIngreso}`;
    return fila[colKey] || 0;
  }

  return 0;
}


// 81. AM.9000 - ACOPLADOR MULTI
function calcularAM9000({
  tipoEscalera,
  tipoIngreso,
  alturaEscaleraObra,
  anchoDescanso
}) {
  const clave = "AM.9000";
  const fila = apoyo2Despiece[clave];
  if (!fila) return 0;

  let parte1 = 0;
  let parte2 = 0;

  // Primer bloque: si tipoEscalera o tipoIngreso está vacío, o alturaEscaleraObra > 0, o tipoEscalera es "GURSAM 120"
  if (
    tipoEscalera === "" ||
    tipoIngreso === "" ||
    alturaEscaleraObra > 0 ||
    tipoEscalera === "GURSAM 120"
  ) {
    parte1 = 0;
  } else {
    const colKey1 = `${tipoEscalera}/${tipoIngreso}`;
    parte1 = fila[colKey1] ?? 0;
  }

  // Segundo bloque: condiciones adicionales
  if (
    tipoEscalera === "" ||
    tipoIngreso === "" ||
    alturaEscaleraObra > 0 ||
    ["GURSAM 60", "EUROPEA", "FERMIN", "ALUMINIO"].includes(tipoEscalera)
  ) {
    parte2 = 0;
  } else {
    const colKey2 = `${tipoEscalera}/${tipoIngreso}/${anchoDescanso}`;
    parte2 = fila[colKey2] ?? 0;
  }

  return parte1 + parte2;
}

// 82. AM.9100 - CONECTOR PARA SUSPENSIÓN
function calcularAM9100() {
  return 0;
}

// 83. AM.9200 - PIN GRAVEDAD 12mm
function calcularAM9200({
  alturaEscaleraObra,
  tipoEscalera,
  tipoIngreso,
  anchoDescanso
}) {
  const clave = "AM.9200";
  const fila = apoyo2Despiece[clave] || {};
  const esCampoVacio = (val) => val === "" || val === null || val === undefined;

  // Primera condición general: si faltan datos o escalera en obra > 0 o tipo es GURSAM 120
  if (
    esCampoVacio(tipoEscalera) ||
    esCampoVacio(tipoIngreso) ||
    alturaEscaleraObra > 0 ||
    tipoEscalera === "GURSAM 120"
  ) {
    return 0;
  }

  // Parte 1: búsqueda por combinación tipoEscalera + tipoIngreso
  const colKey1 = `${tipoEscalera}/${tipoIngreso}`;
  const valor1 = fila[colKey1] || 0;

  // Parte 2: si el tipoEscalera es de los listados especiales, se ignora
  if (
    ["GURSAM 60", "EUROPEA", "FERMIN", "ALUMINIO"].includes(tipoEscalera)
  ) {
    return valor1;
  }

  // Parte 3: búsqueda por combinación tipoEscalera + tipoIngreso + anchoDescanso
  const colKey2 = `${tipoEscalera}/${tipoIngreso}/${anchoDescanso}`;
  const valor2 = fila[colKey2] || 0;

  return valor1 + valor2;
}


// 84. AM.9300 - PIN GRAVEDAD 9mm
function calcularAM9300({ tipoEscalera, tipoAnclaje, alturaTotal, alturaEscaleraObra }) {
  const diff = alturaTotal - alturaEscaleraObra;

  if (tipoAnclaje === "FERMIN") {
    if (["FERMIN", "ALUMINIO", "GURSAM 60"].includes(tipoEscalera)) {
      if (alturaEscaleraObra === 0 && alturaTotal > 0) {
        return esPar(diff) ? 2 * diff - 4 : 2 * diff - 2;
      }
      if (alturaEscaleraObra > 0 && alturaTotal > 0) {
        return esPar(diff) ? 2 * diff : 2 * diff + 2;
      }
    }

    if (["GURSAM 120", "EUROPEA"].includes(tipoEscalera)) {
      if (alturaEscaleraObra === 0 && alturaTotal > 0) {
        return esPar(diff) ? 4 * diff - 8 : 0;
      }
      if (alturaEscaleraObra > 0 && alturaTotal > 0) {
        return esPar(diff) ? 4 * diff : 0;
      }
    }
  }

  return 0;
}

// 85. AM.9400 - PIN GRAVEDAD 8mm
function calcularAM9400() {
  return 0;
}

// 86. EA.0100 - ALUMINIO - ESCALERA DE ACCESO
function calcularEA0100({ tipoEscalera, alturaTotal, alturaEscaleraObra }) {
  const diff = alturaTotal - alturaEscaleraObra;
  if (tipoEscalera !== "ALUMINIO") return 0;

  return esPar(diff) ? diff * 0.5 : (diff - 1) * 0.5;
}

// 87. EA.0200 - ALUMINIO - BARANDA EXTERNA
function calcularEA0200(valorCalcularEA0100 = 0) {
  return valorCalcularEA0100;
}

// 88. EA.0300 - ALUMINIO - BARANDA INTERNA
function calcularEA0300(valorCalcularEA0100 = 0) {
  return valorCalcularEA0100;
}

// 89. EA.0400 - EUROPEA - ESCALERA DE ACCESO
function calcularEA0400({ tipoEscalera, alturaTotal, alturaEscaleraObra }) {
  const diff = alturaTotal - alturaEscaleraObra;
  if (tipoEscalera !== "EUROPEA") return 0;

  return esPar(diff) ? diff * 0.5 : 0;
}

// 90. EA.0500 - EUROPEA - BARANDA INTERMEDIA
function calcularEA0500(valorCalcularEA0400 = 0) {
  return valorCalcularEA0400 * 2;
}

// 91. EA.0600 - FERMIN - ESCALERA DE ACCESO 2M
function calcularEA0600({ tipoEscalera, alturaTotal, alturaEscaleraObra }) {
  const diff = alturaTotal - alturaEscaleraObra;
  
  if (tipoEscalera === "FERMIN") {
    return esPar(diff) ? diff * 0.5 : (diff - 1) * 0.5;
  }
  return 0;
}

// 92. EA.0700 - FERMIN - ESCALERA DE ACCESO 1M
function calcularEA0700({ tipoEscalera, alturaTotal, alturaEscaleraObra }) {
  const diff = alturaTotal - alturaEscaleraObra;
  if (["FERMIN", "ALUMINIO", "GURSAM 60"].includes(tipoEscalera)) {
    return esPar(diff) ? 0 : 1;
  }
  return 0;
}

// 93. EA.0800 - FERMIN - BARANDA INTERMEDIA 2M
function calcularEA0800(valorCalcularEA0600 = 0) {
  return valorCalcularEA0600 * 2;
}

// 94. EA.0900 - FERMIN - BARANDA INTERMEDIA 1M
function calcularEA0900(valorCalcularEA0700 = 0) {
  return valorCalcularEA0700 * 2;
}

// 95. EA.1000 - FERMIN - BARANDA SUPERIOR 2M
function calcularEA1000() {
  return 0;
}

// 96. EA.1100 - FERMIN - BARANDA SUPERIOR 1M
function calcularEA1100({ tipoEscalera, alturaTotal, alturaEscaleraObra }) {
  const diff = alturaTotal - alturaEscaleraObra;
  if (["FERMIN", "ALUMINIO", "GURSAM 60"].includes(tipoEscalera)) {
    if (alturaTotal > 0 && alturaEscaleraObra === 0) {
      return esPar(diff) ? 0 : 2;
    }
    if (alturaTotal > 0 && alturaEscaleraObra > 0) {
      return esPar(diff) ? 0 : 2;
    }
  }
  return 0;
}

// 97. EA.1200 - FERMIN - BARANDA CENTRAL 2M
function calcularEA1200() {
  return 0;
}

// 98. EA.1300 - FERMIN - BARANDA INFERIOR
function calcularEA1300({ tipoEscalera, alturaTotal, alturaEscaleraObra }) {
  if (tipoEscalera === "FERMIN" && alturaTotal > 0 && alturaEscaleraObra === 0) {
    return 2;
  }
  return 0;
}

// 99. EA.1400 - GURSAM 60 - ESCALERA DE ACCESO
function calcularEA1400({ tipoEscalera, alturaTotal, alturaEscaleraObra }) {
  const diff = alturaTotal - alturaEscaleraObra;
  if (tipoEscalera === "GURSAM 60") {
    return esPar(diff) ? diff * 0.5 : (diff - 1) * 0.5;
  }
  return 0;
}

// 100. EA.1500 - GURSAM 60 - BARANDILLA INTERMEDIA
function calcularEA1500(valorCalcularEA1400 = 0) {
  return valorCalcularEA1400 * 2;
}

// 101. EA.1600 - GURSAM - ZANCA DERECHA
function calcularEA1600({ tipoEscalera, alturaTotal, alturaEscaleraObra }) {
  const diff = alturaTotal - alturaEscaleraObra;
  if (tipoEscalera === "GURSAM 120") {
    if ((alturaEscaleraObra === 0 && alturaTotal > 0) || (alturaEscaleraObra > 0 && alturaTotal > 0)) {
      return esPar(diff) ? 0.5 * diff : 0;
    }
  }
  return 0;
}

// 102. EA.1650 - GURSAM - ZANCA DERECHA 1M
function calcularEA1650() {
  return 0;
}

// 103. EA.1700 - GURSAM - ZANCA IZQUIERDA
function calcularEA1700({ tipoEscalera, alturaTotal, alturaEscaleraObra }) {
  const diff = alturaTotal - alturaEscaleraObra;
  if (tipoEscalera === "GURSAM 120") {
    if ((alturaEscaleraObra === 0 && alturaTotal > 0) || (alturaEscaleraObra > 0 && alturaTotal > 0)) {
      return esPar(diff) ? 0.5 * diff : 0;
    }
  }
  return 0;
}

// 104. EA.1750 - GURSAM - ZANCA IZQUIERDA 1M
function calcularEA1750() {
  return 0;
}

// 105. EA.1800 - GURSAM 120 - PELDAÑOS
function calcularEA1800({ tipoEscalera, alturaTotal, alturaEscaleraObra }) {
  const diff = alturaTotal - alturaEscaleraObra;
  if (tipoEscalera === "GURSAM 120") {
    if ((alturaEscaleraObra === 0 && alturaTotal > 0) || (alturaEscaleraObra > 0 && alturaTotal > 0)) {
      return esPar(diff) ? 4 * diff : 0;
    }
  }
  return 0;
}

// 106. EA.1850 - GURSAM 60 - PELDAÑOS
function calcularEA1850() {
  return 0;
}

// 107. EA.1900 - GURSAM - BARANDILLA INTERMEDIA DE ZANCA
function calcularEA1900({ tipoEscalera, alturaTotal, alturaEscaleraObra }) {
  const diff = alturaTotal - alturaEscaleraObra;
  if (tipoEscalera === "GURSAM 120") {
    if ((alturaEscaleraObra === 0 && alturaTotal > 0) || (alturaEscaleraObra > 0 && alturaTotal > 0)) {
      return esPar(diff) ? diff : 0;
    }
  }
  return 0;
}

// 108. EA.1950 - GURSAM - BARANDILLA INTERMEDIA DE ZANCA 1M
function calcularEA1950() {
  return 0;
}

// 109. EA.2000 - PERNO COCHE - M10 x 70
function calcularEA2000(valorCalcularEA1500 = 0, valorCalcularEA1900 = 0) {
  return valorCalcularEA1500 * 2 + valorCalcularEA1900 * 2;
}

// 110. CON.0100 - PERNOS DE EXPANSION C/ ARGOLLA - M12 x 80
function calcularCON0100(valorCalcularAM8500 = 0, valorCalcularAM8600 = 0) {
  return valorCalcularAM8500 + valorCalcularAM8600;
}

// 111. CON.0200 - PERNOS DE EXPANSION - M16 x 145
function calcularCON0200(valorCalcularAM8700 = 0) {
  return valorCalcularAM8700 * 2;
}

// 112. AE.11400 - PERNO HEXAGONAL G.5.8 - M8 x 70
function calcularAE11400({ alturaEscaleraObra, tipoAnclaje }) {
  if (alturaEscaleraObra > 0) return 0;

  if (tipoAnclaje === "FERMIN") return 4;

  if (["TUBO 0.5", "TUBO 1.0"].includes(tipoAnclaje)) return 0;

  return 0;
}


module.exports = {
    calcularAM0100,
    calcularAM0300,
    calcularAM0400,
    calcularAM0600,
    calcularAM0700,
    calcularAM0900,
    calcularAM0900,
    calcularAM1000,
    calcularAM1100,
    calcularAM1150,
    calcularAM1300,
    calcularAM1400,
    calcularAM1500,
    calcularAM1600,
    calcularAM1800,
    calcularAM1900,
    calcularAM2000,
    calcularAM2020,
    calcularAM2050,
    calcularAM2100,
    calcularAM2200,
    calcularAM2250,
    calcularAM2300,
    calcularAM2400,
    calcularAM2500,
    calcularAM2600,
    calcularAM2700,
    calcularAM3100,
    calcularAM3200,
    calcularAM3300,
    calcularAM3400,
    calcularAM3500,
    calcularAM3600,
    calcularAM3700,
    calcularAM3800,
    calcularAM3900,
    calcularAM4000,
    calcularAM4100,
    calcularAM4200,
    calcularAM4300,
    calcularAM4400,
    calcularAM4500,
    calcularAM4600,
    calcularAM4700,
    calcularAM4800,
    calcularAM4900,
    calcularAM5000,
    calcularAM5100,
    calcularAM5200,
    calcularAM5300,
    calcularAM5400,
    calcularAM5500,
    calcularAM5600,
    calcularAM6000,
    calcularAM6100,
    calcularAM6200,
    calcularAM6300,
    calcularAM6400,
    calcularAM6500,
    calcularAM6600,
    calcularAM6700,
    calcularAM6800,
    calcularAM6800,
    calcularAM6900,
    calcularAM7000,
    calcularAM7100,
    calcularAM7200,
    calcularAM7300,
    calcularAM7300,
    calcularAM7400,
    calcularAM7410,
    calcularAM7420,
    calcularAM7430,
    calcularAM7440,
    calcularAM8100,
    calcularAM8200,
    calcularAM8300,
    calcularAM8400,
    calcularAM8500,
    calcularAM8600,
    calcularAM8700,
    calcularAM8800,
    calcularAM8900,
    calcularAM9000,
    calcularAM9100,
    calcularAM9200,
    calcularAM9300,
    calcularAM9400,

    calcularEA0100,
    calcularEA0200,
    calcularEA0300,
    calcularEA0400,
    calcularEA0500,
    calcularEA0600,
    calcularEA0700,
    calcularEA0800,
    calcularEA0900,
    calcularEA1000,
    calcularEA1100,
    calcularEA1200,
    calcularEA1300,
    calcularEA1400,
    calcularEA1500,
    calcularEA1600,
    calcularEA1650,
    calcularEA1700,
    calcularEA1750,
    calcularEA1800,
    calcularEA1850,
    calcularEA1900,
    calcularEA1950,
    calcularEA2000,

    calcularCON0100,
    calcularCON0200,

    calcularAE11400
}