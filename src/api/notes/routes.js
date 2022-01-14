const routes = (handler) => [
  {
    method: 'POST',
    path: '/imageToText',
    handler: handler.postNoteHandler,
        options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 5000000, // 500KB
      },
    },

  },
 
];

module.exports = routes;
