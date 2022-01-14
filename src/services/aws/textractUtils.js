const _ = require("lodash");
const aws = require("aws-sdk");


aws.config.update({
  accessKeyId: 'AKIATPZL3VIPFSRUX2F70201',
  secretAccessKey: 'gfo6xiy0d3NVUmX5OaAaD4TC6IFJcBjmpWbU64jG',
  region: 'ap-southeast-1'
});

const textract = new aws.Textract();

const getText = (result, blocksMap) => {
  let text = "";

  if (_.has(result, "Relationships")) {
    result.Relationships.forEach(relationship => {
      if (relationship.Type === "CHILD") {
        relationship.Ids.forEach(childId => {
          const word = blocksMap[childId];
          if (word.BlockType === "WORD") {
            text += `${word.Text} `;
          }
          if (word.BlockType === "SELECTION_ELEMENT") {
            if (word.SelectionStatus === "SELECTED") {
              text += `X `;
            }
          }
        });
      }
    });
  }

  return text.trim();
};

const findValueBlock = (keyBlock, valueMap) => {
  let valueBlock;
  keyBlock.Relationships.forEach(relationship => {
    if (relationship.Type === "VALUE") {
      // eslint-disable-next-line array-callback-return
      relationship.Ids.every(valueId => {
        if (_.has(valueMap, valueId)) {
          valueBlock = valueMap[valueId];
          return false;
        }
      });
    }
  });

  return valueBlock;
};

const getKeyValueRelationship = (keyMap, valueMap, blockMap) => {
  const keyValues = {};

  const keyMapValues = _.values(keyMap);

  keyMapValues.forEach(keyMapValue => {
    const valueBlock = findValueBlock(keyMapValue, valueMap);
    const key = getText(keyMapValue, blockMap);
    const value = getText(valueBlock, blockMap);
    keyValues[key] = value;
  });

  return keyValues;
};

const getKeyValueMap = blocks => {
  const keyMap = {};
  const valueMap = {};
  const blockMap = {};

  let blockId;
  blocks.forEach(block => {
    blockId = block.Id;
    blockMap[blockId] = block;

    if (block.BlockType === "KEY_VALUE_SET") {
      if (_.includes(block.EntityTypes, "KEY")) {
        keyMap[blockId] = block;
      } else {
        valueMap[blockId] = block;
      }
    }
  });

  return { keyMap, valueMap, blockMap };
};


/// AWS Analyze Document
// module.exports = async buffer => {
//   const params = {
//     Document: {
//       /* required */
//       Bytes: buffer
//     },
//     FeatureTypes: ["FORMS"]
//   };

//   const request = textract.analyzeDocument(params);
//   const data = await request.promise();

//   if (data && data.Blocks) {
//     const { keyMap, valueMap, blockMap } = getKeyValueMap(data.Blocks);
//     const keyValues = getKeyValueRelationship(keyMap, valueMap, blockMap);

//     return keyValues;
//   }

//   // in case no blocks are found return undefined
//   return undefined;
// };

/// AWS Read Document
module.exports = async buffer => {
  const params = {
    Document: {
      /* required */
      Bytes: buffer
      
    },
      //  FeatureTypes: ["string"]

  };

  const request = textract.detectDocumentText(params);
  const data = await request.promise();

  const mappingData = ({
    BlockType,
    Confidence,
    Text,
    TextType,
    Id
  
  }) => ({
    Id,
    Confidence,
    BlockType ,
    Text,
    TextType
  });

  var response = data.Blocks.map (mappingData);

  let nik = "";
  let nikIndx = -1;
  let nama = "";
  let namaIndx = -1;
  let date = "";
  let dateIndx = -1;

  let jenis = "";
  let jenisIndx = -1;
  let gol = "";
  let golIndx = -1;
  let alamat = "";
  let alamatIndx = -1;
  let rtrw = "";
  let rtrwIndx = -1;
  let kel = "";
  let kelIndx = -1;
  let kec = "";
  let kecIndx = -1;
  let agama = "";
  let agamaIndx = -1;
  let status = "";
  let statusIndx = -1;
  let pekerjaan = "";
  let pekerjaanIndx = -1;



  function removeForbiddenCharacters(input) {
    let forbiddenChars = [':', '?', '&','=','.','"']
    
    for (let char of forbiddenChars){
        input = input.split(char).join('');
    }
    return input
  }

  function getItem(data){
    data.forEach(function(item, index, array) {

      if( item.Text.indexOf('Nam') >= 0){
        console.log(item.Text, index)
        namaIndx=index+1;
      }
      if( namaIndx == index){
        nama = item.Text;
        nama = removeForbiddenCharacters(item.Text);
      }

      if( item.Text.indexOf('NIK') >= 0){
        console.log(item.Text, index)
        nikIndx=index+1;
      }
      if( nikIndx == index){
        nik = removeForbiddenCharacters(item.Text);
        nik = nik.replace(/ /g, '');

      }

      if( item.Text.indexOf('Tempat/') >= 0){
        console.log(item.Text, index)
        dateIndx=index+1;
      }
      if( dateIndx == index){
        console.log(item.Text)

        date = item.Text;
        date = removeForbiddenCharacters(item.Text);
      }

      if( item.Text.indexOf('Jenis') >= 0){
        console.log(item.Text, index)
        jenisIndx=index+1;
      }
      if( jenisIndx == index){
        jenis = item.Text;
        jenis = removeForbiddenCharacters(item.Text);
        jenis = jenis.replace(/ /g, '');    
      }


      if( item.Text.indexOf('Gol') >= 0){
        console.log(item.Text, index)
        golIndx=index+1;
      }
      if( golIndx == index){
        gol = item.Text;

        if( gol.indexOf('Alamat') >= 0){
          gol= "-"
        }
      }

      if( item.Text.indexOf('Alamat') >= 0){
        console.log(item.Text, index)
        alamatIndx=index+1;
      }
      if( alamatIndx == index){
        alamat = item.Text;
        alamat = removeForbiddenCharacters(item.Text);
      }

      if( item.Text.indexOf('RT/') >= 0){
        console.log(item.Text, index)
        rtrwIndx=index+1;
      }
      if( rtrwIndx == index){
        rtrw = item.Text;
        rtrw = removeForbiddenCharacters(item.Text);
        rtrw = rtrw.replace(/ /g, '');
      }

      if( item.Text.indexOf('Kel/') >= 0){
        console.log(item.Text, index)
        kelIndx=index+1;
      }
      if( kelIndx == index){
        kel = item.Text;
        kel = removeForbiddenCharacters(item.Text);
        kel = kel.replace(/ /g, '');
      }


      if( item.Text.indexOf('Kecama') >= 0){
        console.log(item.Text, index)
        kecIndx=index+1;
      }
      if( kecIndx == index){
        kec = item.Text;
        kec = removeForbiddenCharacters(item.Text);
        kec = kec.replace(/ /g, '');
      }


      if( item.Text.indexOf('Agama') >= 0){
        console.log(item.Text, index)
        agamaIndx=index+1;
      }
      if( agamaIndx == index){
        agama = item.Text;

        agama = removeForbiddenCharacters(item.Text);
        agama = agama.replace(/ /g, '');
      }

      if( item.Text.indexOf('Perkawinan') >= 0 &&  item.Text.length < 21 ){
        console.log(item.Text, index)
        statusIndx=index+1;
      }
      if( statusIndx == index){
        status = item.Text;
        status = removeForbiddenCharacters(item.Text);
        status = status.replace(/ /g, '');
      }

      if( item.Text.indexOf('Pekerja') >= 0){
        console.log(item.Text, index)
        pekerjaanIndx=index+1;
      }
      if( pekerjaanIndx == index){
        pekerjaan = item.Text;
      }

    })
  }

  function filterByID(item) {
    if ( item.BlockType == 'LINE') {
      return true
    }
    return false;
  }


  function filterByConfidence(item) {
    if ( item.Confidence > 80) {
      return true
    }
    return false;
  }


  
  if (data ) {
    let arrByID = response.filter(filterByID)
    let filterConfidence = arrByID.filter(filterByConfidence);
    console.log(filterConfidence);
    let hasil = getItem(filterConfidence)

    var ektp = {
      nik : nik,
      nama : nama,
       tanggal_lahir : date,
       jenis_kelamin : jenis,
       gol : gol,
       alamat : alamat,
       rt_rw : rtrw,
       kelurahan : kel,
       kecamatan : kec,
       agama : agama,
       status : status,
       pekerjaan : pekerjaan,

    }
    return ektp
  }

  // in case no blocks are found return undefined
   return undefined;
};

