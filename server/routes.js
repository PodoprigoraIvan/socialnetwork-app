import express from 'express';
const router = express.Router();
import * as fs from 'fs';

router.get("/", (req, res)=>{
    let users = JSON.parse(fs.readFileSync('public/userData/userInfo.json'));
    res.render('index', {title: "Администрирование социальной сети", users: users});
});

router.get('/friends/:id', (req, res) => {
	let userFriends = JSON.parse(fs.readFileSync('public/userData/userFriends.json'));
    let users = JSON.parse(fs.readFileSync('public/userData/userInfo.json'));

	let requiredUser = users.find((user) => user.id === +req.params.id);
    let friendsId = userFriends.find((user) => user.id === +req.params.id).friendsId;
	let friends = [];
    
    for (let user of users){
        if (friendsId.includes(user.id))
            friends.push(user);
    }
	res.render('index', {title: "Друзья пользователя "+requiredUser.name, users: friends});
});

router.get('/news', (req, res) => {
	let userNews = JSON.parse(fs.readFileSync('public/userData/userNews.json'));
    let users = JSON.parse(fs.readFileSync('public/userData/userInfo.json'));
    let news = [];
    for (let post of userNews){
        let name = users.find((user) => user.id === post.userId).name;
        let sendPost = {userName: name, text: post.text};
        news.push(sendPost);
    }
	res.render('news', {title: "Новости пользователей", news: news});
});

router.get('/friendsnews/:id', (req, res) => {
    let userNews = JSON.parse(fs.readFileSync('public/userData/userNews.json'));
	let userFriends = JSON.parse(fs.readFileSync('public/userData/userFriends.json'));
    let users = JSON.parse(fs.readFileSync('public/userData/userInfo.json'));

	let requiredUser = users.find((user) => user.id === +req.params.id);
    let friendsId = userFriends.find((user) => user.id === +req.params.id).friendsId;

    let news = [];
    for (let post of userNews){
        if (!friendsId.includes(post.userId)) continue;
        let name = users.find((user) => user.id === post.userId).name;
        let sendPost = {userName: name, text: post.text};
        news.push(sendPost);
    }
	res.render('news', {title: "Новости друзей пользователя " + requiredUser.name, news: news});
});

router.get('/user/:id', (req, res) => {
    let users = JSON.parse(fs.readFileSync('public/userData/userInfo.json'));
    let requieredUser = users.find((user) => user.id === +req.params.id);
	res.json(requieredUser);
});

router.post("/edit/:id", (req, res)=>{
    let users = JSON.parse(fs.readFileSync('public/userData/userInfo.json'));
    users.forEach((user, i, users) => {
        if (user.id == (+req.params.id)) {
            users[i].name = req.body.name;
            users[i].email = req.body.email;
            users[i].role = req.body.role;
            users[i].status = req.body.status;
            users[i].birthDate = req.body.birthDate;
        }
    });
    fs.writeFileSync('public/userData/userInfo.json', JSON.stringify(users));
    res.redirect('/');
});

router.post("/upload/image/:id", (req, res)=>{
    if(!req.files) res.redirect("/");
    let avatar = req.files.image;
    avatar.mv('public/images/' + req.params.id+'.png');
    let users = JSON.parse(fs.readFileSync('public/userData/userInfo.json'));
    let requieredUser = users.find((user) => user.id === +req.params.id);
    requieredUser.imgSrc = 'public/images/' + req.params.id+'.png';
    fs.writeFileSync('public/userData/userInfo.json', JSON.stringify(users));
    res.redirect("/");
});

export default router;