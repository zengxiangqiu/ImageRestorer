const db = require('./config/db.config.js');
var fs = require('fs')
  , gm = require('gm')
  , path = require('path')
  ,winston = require('winston'),
  logform = require('logform');
  const { combine, timestamp, label, printf} = logform.format;
  const { Op } = require("sequelize");

const logger = winston.createLogger({
  level: 'info',
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console()
  ],
  format: combine(
    label({ label: 'ImageRestorer' }),
    timestamp(),
    printf(nfo => {
      return `${nfo.timestamp} [${nfo.label}] ${nfo.level}: ${nfo.message}`;
    })
    // simple(),
    // errors({stack:true})
  ),
});

const foldPath = `\\\\Gz-bosrv\\PIC\\LS`
const files =  fs.readdirSync(foldPath)
const smallImgs = files.filter(file=>{
  const sta =  fs.statSync(path.join(foldPath,file))
  return sta.size<20000
})

smallImgs.forEach(file=>{
  const filename = file.replace('.BMP','')
  db.images.findOne({
    where:{
      [Op.and]:[
        {item_no: filename},
        {seq: 1},
      ]
    }
  }).then(data=>{
    if(!data){
      logger.info('找不到图片'+filename);
      return
    }
    gm(data.dataValues.picture,file)
    .size({bufferStream: true}, function(err, size) {
      if(err){
        logger.info('gm 发生错误 '+filename);
        return
      }
      this.write(path.join(__dirname,'/images',file), function (err) {
        if (!err) 
          logger.info(file+' done');
        else
          logger.error(file+' 保存发生错误，如下'+ err);
      });
    });
  })
})
