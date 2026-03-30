let multer = require('multer')
let path = require('path')

//storage - luu o dau, luu ten gi
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname)
        let fileName = Date.now() + "-" + Math.round(Math.random() * 1000_000_000) + ext;
        cb(null, fileName)
    }
})
let filterImage = function (req, file, cb) {
    if (file.mimetype.includes("image")) {
        cb(null, true)
    } else {
        cb(new Error("file sai dinh dang"), false)
    }
}
let filterExcel = function (req, file, cb) {
    if (file.mimetype.includes("spreadsheetml")) {
        cb(null, true)
    } else {
        cb(new Error("file sai dinh dang"), false)
    }
}

let filterMessageFile = function (req, file, cb) {
    // Cách này sẽ cho phép TẤT CẢ các loại file
    cb(null, true);
    
    /* Hoặc nếu muốn an toàn hơn, hãy log mimetype ra để biết file bạn đang gửi là gì:
    console.log("File đang gửi có MimeType là:", file.mimetype);
    cb(null, true); 
    */
}
module.exports = {
    uploadImage: multer({
        storage: storage,
        limits: 5 * 1024 * 1024,
        fileFilter: filterImage
    }),
    uploadExcel: multer({
        storage: storage,
        limits: 5 * 1024 * 1024,
        fileFilter: filterExcel
    }),

    uploadMessageFile: multer({
        storage: storage,
        limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn 10MB cho file đính kèm
        fileFilter: filterMessageFile
    })
}

