import express from 'express';
const router = express.Router();
import * as fs from 'fs';
import jwt from 'jsonwebtoken';

const secretKey = "uigoperfsadeffmi";

function auth(req, res, next) {
    let token = req.cookies.token;
    if (!token) return res.status(403).json({ error: 'Authentification error' });
    try {
        let decoded = jwt.verify(token, secretKey);
        req.id = decoded.userid;
        req.username = decoded.username;
        next();
    } catch (e) {
        res.status(403).json({ error: 'Token not valid' });
    }
};

export const getResultForMainPage = (userid, users, newsList) => {
    let user = users.find((user) => user.id === userid);
    let curNewsList = [];
    for (let post of newsList){
        if (post.userId == user.id) curNewsList.push(post.text);
    }
    let isAdmin = (user.role === "admin")
    return {username: user.name, userid: user.id, email: user.email, birthdate: user.birthDate, imgSrc: user.imgSrc, curNewsList: curNewsList, isAdmin: isAdmin};
}

router.get("/mainpage", auth, (req, res)=>{
    let decoded = jwt.verify(req.cookies.token, secretKey);
    let users = JSON.parse(fs.readFileSync('public/userData/userInfo.json'));
    let newsList = JSON.parse(fs.readFileSync('public/userData/userNews.json'));
    // let user = users.find((user) => user.id === +decoded.userid);
    // let curNewsList = [];
    // for (let post of newsList){
    //     if (post.userId == user.id) curNewsList.push(post.text);
    // }
    // let isAdmin = (user.role === "admin")
    // let result = {username: user.name, userid: user.id, email: user.email, birthdate: user.birthDate, imgSrc: user.imgSrc, curNewsList: curNewsList, isAdmin: isAdmin};
    let result = getResultForMainPage(+decoded.userid, users, newsList);
    res.send(JSON.stringify(result));
});

export const getResultForOpenProfile = (userid, friendid, users, friends) => {
    let openedUser = users.find((user) => user.id === friendid);
    let curFriendsList = friends.find((item)=>item.id == userid);
    let isFriend = false;
    if (curFriendsList != undefined && curFriendsList.friendsId.includes(friendid)) isFriend = true;
    return {username: openedUser.name, imgSrc: openedUser.imgSrc, isFriend: isFriend};
}

router.get("/openprofile/:id", auth, (req, res)=>{
    let decoded = jwt.verify(req.cookies.token, secretKey);
    let users = JSON.parse(fs.readFileSync('public/userData/userInfo.json'));
    let friends = JSON.parse(fs.readFileSync('public/userData/userFriends.json'));
    // let openedUser = users.find((user) => user.id === +req.params.id);
    // let curFriendsList = friends.find((item)=>item.id == +decoded.userid);
    // let isFriend = false;
    // if (curFriendsList != undefined && curFriendsList.friendsId.includes(+req.params.id)) isFriend = true;
    // let result = {username: openedUser.name, imgSrc: openedUser.imgSrc, isFriend: isFriend};
    let result = getResultForOpenProfile(+decoded.userid, +req.params.id, users, friends);
    res.send(JSON.stringify(result));
});

router.get("/addfriend/:id", auth, (req, res)=>{
    let decoded = jwt.verify(req.cookies.token, secretKey);
    let friends = JSON.parse(fs.readFileSync('public/userData/userFriends.json'));
    let curFriendsList = friends.find((item)=>item.id == +decoded.userid);
    if (curFriendsList != undefined && curFriendsList.friendsId.includes(+req.params.id) == false) curFriendsList.friendsId.push(+req.params.id);
    fs.writeFileSync('public/userData/userFriends.json', JSON.stringify(friends));
    res.send();
});

router.get("/deletefriend/:id", auth, (req, res)=>{
    let decoded = jwt.verify(req.cookies.token, secretKey);
    let friends = JSON.parse(fs.readFileSync('public/userData/userFriends.json'));
    let curFriendsList = friends.find((item)=>item.id == +decoded.userid);
    if (curFriendsList != undefined && curFriendsList.friendsId.includes(+req.params.id) == true) 
        curFriendsList.friendsId = curFriendsList.friendsId.filter(id=>id != +req.params.id);
    fs.writeFileSync('public/userData/userFriends.json', JSON.stringify(friends));
    res.send();
});

router.get('/friendsnews', (req, res) => {
    let decoded = jwt.verify(req.cookies.token, secretKey);
    let userNews = JSON.parse(fs.readFileSync('public/userData/userNews.json'));
	let userFriends = JSON.parse(fs.readFileSync('public/userData/userFriends.json'));
    let users = JSON.parse(fs.readFileSync('public/userData/userInfo.json'));
    let friendsId = userFriends.find((user) => user.id === +decoded.userid).friendsId;
    let news = [];
    for (let post of userNews){
        if (!friendsId.includes(post.userId)) continue;
        let name = users.find((user) => user.id === post.userId).name;
        let sendPost = {author: name, text: post.text};
        news.push(sendPost);
    }
	res.send(JSON.stringify({newsList: news, friendsList: friendsId}));
});

router.get('/friends', (req, res) => {
    let decoded = jwt.verify(req.cookies.token, secretKey);
	let userFriends = JSON.parse(fs.readFileSync('public/userData/userFriends.json'));
    let users = JSON.parse(fs.readFileSync('public/userData/userInfo.json'));
    let friendsId = userFriends.find((user) => user.id === +decoded.userid).friendsId;
    let friendsList = [];
    for (let id of friendsId){
        let name = users.find((user) => user.id === id).name;
        friendsList.push({name: name, id: id});
    }
	res.send(JSON.stringify({friendsList: friendsList, id: +decoded.userid}));
});

router.get("/dialogmessages/:id", auth, (req, res)=>{
    let decoded = jwt.verify(req.cookies.token, secretKey);
    let dialogs = JSON.parse(fs.readFileSync('public/userData/messages.json'));

    let requiredMessages = dialogs.find((item)=>item.usersId.includes(+decoded.userid) && item.usersId.includes(+req.params.id));
    if(requiredMessages == undefined || requiredMessages == null){
        dialogs.push({usersId: [+decoded.userid, +req.params.id], messages:[]});
        fs.writeFileSync('public/userData/messages.json', JSON.stringify(dialogs));
        res.send(JSON.stringify([]));
        return;
    }
    res.send(JSON.stringify(requiredMessages.messages));
});

router.get("/login", (req, res)=>{
    let username = req.query.username;
    let password = req.query.password;

    let users = JSON.parse(fs.readFileSync('public/userData/userInfo.json'));
    let requieredUser = users.find((user) => user.name === username);
    if (requieredUser === undefined || requieredUser === null) {res.send({"result":false}); return}
    if (password != requieredUser.password) {res.send({"result":false}); return}

    let token = jwt.sign({ userid: requieredUser.id, username: requieredUser.name }, secretKey);
    res.cookie('token', token);
    res.send({"result":true});
});

router.get("/logout", (req, res)=>{
    res.clearCookie('token');
    res.send();
});

router.get("/find", auth, (req, res)=>{
    let decoded = jwt.verify(req.cookies.token, secretKey);
    let foundedUsersList = [];
    let substr = req.query.substr;
    let users = JSON.parse(fs.readFileSync('public/userData/userInfo.json'));
    for (let user of users){
        if (user.id != decoded.userid && user.name.toLowerCase().includes(substr.toLowerCase())) 
            foundedUsersList.push({id: user.id, name: user.name});
    }
    res.send(JSON.stringify(foundedUsersList));
});

router.post("/signup", (req, res)=>{
    let username = req.query.username;
    let password = req.query.password;
    let email = req.query.email;
    let birthdate = req.query.birthdate;

    let users = JSON.parse(fs.readFileSync('public/userData/userInfo.json'));
    let alreadyExistingUser = users.find((user) => user.name === username);
    if (alreadyExistingUser !== undefined && alreadyExistingUser !== null) {res.send({"result":false}); return;} // пользователь с таким именем уже есть
    let curId = users[users.length-1].id + 1;

    let newUser = {id: curId, name: username, birthDate: birthdate, email: email, role: "user", status: "active", password: password};
    if(!req.files) {
        newUser.imgSrc = "public/images/noavatar.png";
    } else {
        let avatar = req.files.image;
        avatar.mv('public/images/' + curId+'.png');
        newUser.imgSrc = 'public/images/' + curId+'.png';
    }
    users.push(newUser);
    fs.writeFileSync('public/userData/userInfo.json', JSON.stringify(users));

    let friends = JSON.parse(fs.readFileSync('public/userData/userFriends.json'));
    friends.push({id: curId, friendsId: []});
    fs.writeFileSync('public/userData/userFriends.json', JSON.stringify(friends));

    let token = jwt.sign({ userid: curId, username: username }, secretKey);
    res.cookie('token', token);

    res.send({"result":true});
});

router.post("/editinfo", auth, (req, res)=>{
    let decoded = jwt.verify(req.cookies.token, secretKey);
    let email = req.query.email;
    let birthDate = req.query.birthDate;
    let users = JSON.parse(fs.readFileSync('public/userData/userInfo.json'));
    let requieredUser = users.find((user) => user.id == decoded.userid);
    requieredUser.email = email;
    requieredUser.birthDate = birthDate;
    fs.writeFileSync('public/userData/userInfo.json', JSON.stringify(users));
    res.send();
});

router.post("/newpost", auth, (req, res)=>{
    let newPostText = req.query.text;
    if (newPostText == "") return;
    let decoded = jwt.verify(req.cookies.token, secretKey);
    let news = JSON.parse(fs.readFileSync('public/userData/userNews.json'));
    news.push({userId: decoded.userid, text: newPostText});
    fs.writeFileSync('public/userData/userNews.json', JSON.stringify(news));
});

router.post("/sendmessage", auth, (req, res)=>{
    let decoded = jwt.verify(req.cookies.token, secretKey);
    let message = req.query.message;
    let friendId = +req.query.friendId;
    
    let dialogs = JSON.parse(fs.readFileSync('public/userData/messages.json'));
    let requiredDialog = dialogs.find((item)=>item.usersId.includes(+decoded.userid) && item.usersId.includes(friendId));
    requiredDialog.messages.push({id: +decoded.userid, text: message});

    fs.writeFileSync('public/userData/messages.json', JSON.stringify(dialogs));
    res.send();
});

export default router;