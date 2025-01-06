const fs = require('fs')
const path = require('path')

async function upload(ctx) {
  console.log("post upload >>>");
  console.log(ctx.request.body);

  const file = ctx.file

  if(file) {
    const { originalname, buffer } = file

    const name = path.resolve(__dirname, '../../static/upload', originalname)

    fs.writeFile(name, buffer, (err) => {
        if(err) {
            console.error(err)
            ctx.body = '500'
        }else {
            console.log('upload file success')
            ctx.body = ctx.request.body
        }
    })
  }

}

module.exports = upload;
