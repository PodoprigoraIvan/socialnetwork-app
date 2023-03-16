import {
	getResultForMainPage,
    getResultForOpenProfile
} from '../server/socialNetworkRoutes';

const test_users = [
    {id:0,name:"Victor",birthDate:"2000-10-21",email:"vita@mail.ru",imgSrc:"public/images/0.png",role:"user",status:"unconfirmed",password:"123"},
    {id:1,name:"Me",birthDate:"2005-11-22",email:"sample@mail.ru",imgSrc:"public/images/1.png",role:"admin",status:"active",password:"123"},
    {id:3,name:"Human",birthDate:"1995-06-17",email:"hum@mail.ru",imgSrc:"public/images/3.png",role:"admin",status:"active",password:"tg23"},
];

const test_news = [
    {userId:0, text:"Hello everyone"},
    {userId:1, text:"Testing"},
    {userId:1, text:"some text"},
    {userId:0, text:"word"},
];

const test_friends = [
    {"id":0,"friendsId":[3]},
    {"id":3,"friendsId":[0]},
]

test('getResultForMainPage test1', () => {
    let result = getResultForMainPage(1, test_users, test_news);
    let requiered = {username: "Me", userid: 1, email: "sample@mail.ru", birthdate: "2005-11-22", imgSrc: "public/images/1.png", curNewsList: ["Testing", "some text"], isAdmin: true};
    expect(JSON.stringify(result)).toBe(JSON.stringify(requiered));
});

test('getResultForMainPage test2', () => {
    let result = getResultForMainPage(0, test_users, test_news);
    let requiered = {username: "Victor", userid: 0, email: "vita@mail.ru", birthdate: "2000-10-21", imgSrc: "public/images/0.png", curNewsList: ["Hello everyone", "word"], isAdmin: false};
    expect(JSON.stringify(result)).toBe(JSON.stringify(requiered));
});

test('getResultForOpenProfile test1', () => {
    let result = getResultForOpenProfile(0, 1, test_users, test_friends);
    let requiered = {username: "Me", imgSrc: "public/images/1.png", isFriend: false};
    expect(JSON.stringify(result)).toBe(JSON.stringify(requiered));
});

test('getResultForOpenProfile test2', () => {
    let result = getResultForOpenProfile(0, 3, test_users, test_friends);
    let requiered = {username: "Human", imgSrc: "public/images/3.png", isFriend: true};
    expect(JSON.stringify(result)).toBe(JSON.stringify(requiered));
});