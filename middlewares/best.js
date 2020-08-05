const multer = require('multer');

//set your desired file destination and the name you wanna give your files

const multerStorage = multer.diskStorage(

    {
        destination : (req , file , cb) =>

        {
            cb(null , './public/banners')
        },

        filename : (req , file , cb) =>

        {
            const ext = file.mimetype.split('/')[1];

            cb(null , `banner-${req.banner.id}-${Date.now()}.${ext}`);

        }
    }
)

//for imgages this filter will check if the files set for uploads are all images

const multerFilter = (req , file , cb) =>

{
    if(file.mimetype.startsWith('image'))

    {
        cb(null , true)
    }

    else

    {
        cb(new AppError('Not An Image ! Please Upload Only Images' , 400) , false);
    }
}

//Pass your configurations into the multer function

 
exports.upload = multer(

    {
        storage : multerStorage,

        fileFilter : multerFilter
    }
)


//in the below line of code image is the name of the form and 5 is the max number of files you wanna upload

exports.uploadUserData = upload.array('image' , 5);


// in your routes add this code below to your middleware stack

// router.post('/users , test.uploadUserData , test.upload)

