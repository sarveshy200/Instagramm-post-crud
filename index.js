const express = require("express");
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;

var methodOverride = require('method-override')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets/uploads'); 
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname)); 
    }
});


const upload = multer({ storage: storage });
app.use(methodOverride('_method'))

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

let posts = [
    {
        id: uuidv4(),
        username: "sarveshy200",
        postimage: "/assets/uploads/sarvesh.jpg",
        content: "Loving this coding project! 🚀 #CodingLife #HTML #CSS #MERN"
    },
    {
        id: uuidv4(),
        username: "amaan2000",
        postimage: "/assets/uploads/amaan.JPG",
        content: "Loving this front end! 🚀 #CodingLife #HTML #CSS #React"
    },
    {
        id: uuidv4(),
        username: "satyacheetah123",
        postimage: "/assets/uploads/satya.JPG",
        content: "Loving this devops project! 🚀 #CodingLife #Devops"
    },
    {
        id: uuidv4(),
        username: "amitabh",
        postimage: "/assets/uploads/amitabh.jpg",
        content: "Loving this banking works! 🚀 #Banking #loa #credit"
    }
];

app.get("/", (req, res) => {
    res.render("main.ejs", { posts });
});

app.get("/add-post", (req, res) => {
    res.render("new.ejs");
});

app.post('/', upload.single('postimage'), (req, res) => {
    const { username, content } = req.body;
    const postimage = `/assets/uploads/${req.file.filename}`; 
    const id = uuidv4();
    posts.push({ id, username, postimage, content });
    res.redirect("/");
});

app.get("/show/:id", (req, res)=>{
   let { id } = req.params;
   let post = posts.find((p) => id === p.id);
   res.render("show.ejs", {post});

});


app.patch("/:id", (req, res)=>{
    let { id } = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => id === p.id);
    post.content = newContent;
    res.redirect("/");
});

app.get("/:id/edit", (req, res)=>{
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    res.render("edit.ejs", {post});
});

app.delete("/:id", (req, res)=>{
    let { id } = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect("/")
});




app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
