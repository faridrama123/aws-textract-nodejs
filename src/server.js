require('dotenv').config();

const Hapi = require('@hapi/hapi');


// notes
const notes = require('./api/notes');
const RekognitionService = require('./services/aws/RekognitionService');

const init = async () => {

  const rekognitioService = new RekognitionService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,

    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
 
  await server.register([
    {
      plugin: notes,
      options: {
        service: rekognitioService,
      },
    },
    
  ]);
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};
 
 
init();