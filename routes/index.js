'use strict'

const express = require('express')
const config = require('../config.js')
const router = express.Router({ mergeParams: true });
const fileUpload = require('express-fileupload');
const fs = require('fs')
var imgmgk = require('imagemagick')
var imgServer = config.fileServer


var nano = require('nano')(config.db);

// Set up names for the different databases
var images_db = nano.use('star_media')


//================================================================
// Uploads routing area
//================================================================

    router.get('/', function(req, res){
      console.log('Requesting Media home page')
      res.render('media')
    })

    router.get('/image/list', function(req, res){

        fs.readdir( imgServer + '/image/thumbs', function (err, files) {
          if (err) {
            console.log(err);
            res.json(err)
            return;
          }

          files.shift()

          res.send(files)

        });
    })

    router.get('/image/find', function(req, res){
        images_db.fetch({}, function(err, files){
            if(err){
                res.json("No images can be found.")
                console.log(" No images can be found.")
            }
            else{
                files = files.rows.mapp(function(d){
                        return d.doc
                })

                //console.log("Found these images for this powder", files)

                res.json(files)

            }

        })


    })



    router.get('/video/list', function(req, res){

        fs.readdir( imgServer + '/video/thumbs', function (err, files) {
            console.log(files)
          if (err) {
            console.log(err);

            res.json(err)
            return;
          }
          console.log(files);

          var files = files.map(function(file, i){
              console.log(file)
              if(file[0] != "."){

                  return file
              }
          })

          files.shift()
          res.send(files)

        });
    })




    router.get('/image/:id', function(req, res){

        fs.readFile( imgServer + '/image/full' + req.params.id, function (err, file) {
          if (err) {
            console.log(err);
            return;
          }
          console.log(file);
          res.send(file)

        });



    })

    router.get('/video/:id', function(req, res){

        fs.readFile( imgServer + '/video/full' + req.params.id, function (err, file) {
          if (err) {
            console.log(err);
            return;
          }
          console.log(file);
          res.send(file)

        });



    })



    router.post('/upload', function(req, res, next){
        //console.log("Files:", req.files)
        console.log("Request body: ", req.body)

        if (!req.files){
            console.log("No file to upload")
            return res.status(400).send('No files were uploaded.');
        }
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        let inputFile = req.files.file;
        console.log(inputFile)
        images_db.get( inputFile.name , function(err, file){
            if(err) {
                //console.log(inputFile)
                var type = inputFile.mimetype.split("/")[0]
                // Use the mv() method to place the file somewhere on your server
                inputFile.mv( imgServer  + '/'+  type + '/full/' + inputFile.name , function(err) {
                        if (err){
                            console.log(err)
                            return res.status(500).send(err);
                        }
                        else{


                            console.log("Moved image and now resizing to add to thumbnails")
                            imgmgk.resize({
                                  srcPath: imgServer  + '/'+  type + '/full/' + inputFile.name ,
                                  dstPath: imgServer  + '/'+  type + '/thumbs/' + inputFile.name,
                                  width:   800
                                }, function(err, stdout, stderr){
                                  if (err) throw err;
                                  //console.log(req.body)
                                  if(req.body.powder_id && req.body.type){

                                      var img_data = {
                                          'powder_id': req.body.powder_id,
                                          'type': req.body.type,
                                          'description': req.body.description,
                                          'magnification': req.body.magnification,
                                          'scale': "",
                                          '_id': inputFile.name,
                                          'name': inputFile.name,
                                          'thumbnail': '/public/'+  type + '/thumbs/' + inputFile.name,
                                          'fullsize':  '/public/'+  type + '/full/' + inputFile.name
                                      }
                                      images_db.insert(img_data, function(err, body){
                                          if(err) {console.log(err)}
                                          console.log(body)
                                          res.json({msg: 'File uploaded successfully' });
                                      })

                                  }


                                  console.log('resized image to fit within 200x200px');
                                });

                        }
                    });










            }
            else{
                console.log('File already exists. Not saving.');
                res.json('File already exists');
                return;

            }

        })








});










module.exports = router;
