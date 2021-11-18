
const fs = require('fs');
const path = require('path');

const textractScan = require('../../services/aws/textractUtils')
class NotesHandler {
  constructor(service) {
    this._service = service;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    
  }

  async postNoteHandler(request, h) {
    try {

      const { data} = request.payload;
      const filename = data.hapi.filename;
      const directory = path.resolve(__dirname, 'uploads');
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory); // membuat folder bila belum ada
      }

      // membuat writable stream
      const location =  `${directory}/${filename}`;
      const fileStream = fs.createWriteStream(location);

      try {
        const result = await new Promise((resolve, reject) => {
          // mengembalikan Promise.reject ketika terjadi eror
          fileStream.on('error', (error) => reject(error));

          // membaca Readable (data) dan menulis ke Writable (fileStream)
          data.pipe(fileStream);

          // setelah selesai membaca Readable (data) maka mengembalikan nama berkas.
          data.on('end', () => resolve(filename));
        });

      } catch (error) {
        return { message: `Berkas gagal diproses` };
      }

      // console.log(location)
      // console.log(fileStream)
      //  text_img 
      var text_img = fs.readFileSync(location);
      const results = await textractScan(text_img);
      //console.log(results);

      const response = h.response({
        status: 'success',
        //message: 'Catatan berhasil ditambahkan',
        data: 
          results,
        
      });
      response.code(201);
      return response;
    } catch (error) {
     
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

}

module.exports = NotesHandler;
