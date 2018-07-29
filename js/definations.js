//Canvas definitions
let canvas = document.getElementById('canvas');
let pen = canvas.getContext('2d');
//Constant definitions
const CANVAS_W = document.getElementById('canvas').width;
const CANVAS_H = document.getElementById('canvas').height;
const GRAVITY = 10 / 10000;
const PI = 3.1415926;
const ENEMY_FR = 600000; //Used as enemy fire rate
//Tool variables
let FPS = 60; //Frame per second. Also used as fire rate
let playerTimeCounter = 0;    //Frame counter
let enemyTimeCounter = 0;
let bulletCounter = 0;  //Bullet number on the screen
let enemyCounter = 0;   //Enemy number on the screen
let enemyBulletCounter = 0;
let itemCounter = 0;
let bulletArray = [];
let enemyArray = [];
let enemyBulletArray = [];
let itemArray = [];
let dispEnemyId = undefined;
//Class
class System {
    constructor(){
        this.isOpenMenu = false;
    }
    itemGen(name, x, y, xVel, yVel){
        //Generate a new item
        itemArray[itemCounter] = new Item(name, x, y, xVel, yVel);
        itemCounter ++;
    }
    EnemyStateDisp(){
        if(dispEnemyId != undefined){
            pen.beginPath();
            pen.globalAlpha = 1;
            pen.textAlign = 'start';
            pen.font = '20px Arial';
            pen.fillStyle = 'black';
            pen.fillText('Enemy\'s HP: ', 560, 30);
            pen.strokeStyle = 'black';
            pen.lineWidth = 2;
            pen.strokeRect(680, 13, 100, 20);
            if(enemyArray[dispEnemyId] != undefined){
                if(enemyArray[dispEnemyId].hp < 0)
                    return;
                if(enemyArray[dispEnemyId].hp >= 0.6 * enemyArray[dispEnemyId].maxHp)
                    pen.fillStyle = 'Lime';
                if(enemyArray[dispEnemyId].hp >= 0.3 * enemyArray[dispEnemyId].maxHp && enemyArray[dispEnemyId].hp < 0.6 * enemyArray[dispEnemyId].maxHp)
                    pen.fillStyle = 'DarkGoldenRod';
                if(enemyArray[dispEnemyId].hp < 0.3 * enemyArray[dispEnemyId].maxHp && enemyArray[dispEnemyId].hp > 0)
                    pen.fillStyle = 'Maroon';
                pen.fillRect(680, 13, enemyArray[dispEnemyId].hp*100/enemyArray[dispEnemyId].maxHp, 20);
            }
        }
    }
    hitDetect(){
        //Bullet-enemy hit detection
        for(let i = 0; i < bulletCounter; i++){
            for(let j = 0; j < enemyCounter; j++){
                if(((bulletArray[i].x-enemyArray[j].x)**2 + (bulletArray[i].y-enemyArray[j].y)**2) < bulletArray[i].hitRange){   //Hit
                    player.MPRecover();
                    //敌人死亡时执行的行为
                    if((enemyArray[j].hp - bulletArray[i].damage) <= 0){
                        //掉落物品
                        if(Math.random() <= 0.05)
                            system.itemGen('first_aid_kit', enemyArray[j].x, enemyArray[j].y, enemyArray[j].xVel*1.2, 0);
                        else if(Math.random() <= 0.05)
                            system.itemGen('mp_recover_kit', enemyArray[j].x, enemyArray[j].y, enemyArray[j].xVel*1.2, 0);
                        else if(Math.random() <= 0.05)
                            system.itemGen('basic_shot_kit', enemyArray[j].x, enemyArray[j].y, enemyArray[j].xVel*1.2, 0);
                        else if(Math.random() <= 0.02)
                            system.itemGen('machine_gun_kit', enemyArray[j].x, enemyArray[j].y, enemyArray[j].xVel*1.2, 0);
                        else if(Math.random() <= 0.015)
                            system.itemGen('energy_beam_kit', enemyArray[j].x, enemyArray[j].y, enemyArray[j].xVel*1.2, 0);
                        else if(Math.random() <= 0.018)
                            system.itemGen('energy_pulse_kit', enemyArray[j].x, enemyArray[j].y, enemyArray[j].xVel*1.2, 0);
                        bulletArray.splice(i, 1);
                        bulletCounter --;
                        enemyArray.splice(j, 1);
                        enemyCounter --;
                        player.score += 5;
                        dispEnemyId = undefined;
                        break;
                    }
                    enemyArray[j].hp -= bulletArray[i].damage;
                    bulletArray.splice(i, 1);
                    bulletCounter --;
                    dispEnemyId = j;
                    break;
                }
            }
        }
        //Player-enemy hit detection
        for(let i = 0; i < enemyCounter; i++){
            if(((player.x-enemyArray[i].x)**2 + (player.y-enemyArray[i].y)**2) <= 350){
                player.hp -= 0.02;
                enemyArray[i].hp -= 0.02;
                dispEnemyId = i;
            }
        }
        //Player-bullet hit detection
        for(let i = 0; i < enemyBulletCounter; i++){
            if(((player.x-enemyBulletArray[i].x)**2 + (player.y-enemyBulletArray[i].y)**2) <= enemyBulletArray[i].hitRange){
                player.hp -= enemyBulletArray[i].damage * 0.5;
                enemyBulletArray.splice(i, 1);
                enemyBulletCounter --;
                if((player.score-1) > 0)
                    player.score --;
            }
        }
        //Player-Item hit detection
        for(let i = 0; i < itemCounter; i++){
            if(((player.x-itemArray[i].x)**2 + (player.y-itemArray[i].y)**2) <= 350){
                itemArray[i].use();
                itemArray.splice(i, 1);
                itemCounter --;
            }
        }
    }
    enemyGen(){
        let isGenEnemy = Math.random();
        let amoutLimit = 10;
        //Generate different kinds of enemies
        if(isGenEnemy < 0.6 && !(playerTimeCounter % FPS) && amoutLimit > enemyCounter){
            enemyArray[enemyCounter] = new Enemy('enemy_0', CANVAS_W+5, CANVAS_H*Math.random(), -0.06, 0, 0.2, 'basic_shot');
            enemyCounter ++;
        }
        if(isGenEnemy < 0.4 && !(playerTimeCounter % FPS) && amoutLimit > enemyCounter){
            enemyArray[enemyCounter] = new Enemy('enemy_1', CANVAS_W+5, CANVAS_H*Math.random(), -0.02, 0, 0.4, 'tracking_shot');
            enemyCounter ++;
        }
        if(isGenEnemy < 0.2 && !(playerTimeCounter % FPS) && amoutLimit > enemyCounter){
            enemyArray[enemyCounter] = new Enemy('enemy_2', CANVAS_W+5, CANVAS_H*Math.random(), -0.7, 0, 0.1, '');
            enemyCounter ++;
        }
        if(isGenEnemy < 0.3 && !(playerTimeCounter % FPS) && amoutLimit > enemyCounter){
            enemyArray[enemyCounter] = new Enemy('enemy_4', CANVAS_W+5, CANVAS_H*Math.random(), -0.04, 0, 0.4, 'scatter_shot');
            enemyCounter ++;
        }
        if(player.score > 50 && isGenEnemy < 0.3 && !(playerTimeCounter % FPS) && amoutLimit > enemyCounter){
            enemyArray[enemyCounter] = new Enemy('enemy_5', CANVAS_W+5, CANVAS_H*Math.random(), -0.07, 0.02, 0.4, 'basic_shot');
            enemyCounter ++;
        }
    }
    SCRBoundaryInit(){
        //Draw boundary
        pen.beginPath();
        pen.globalAlpha = 1;
        pen.lineWidth = 5;
        pen.strokeStyle = 'black';
        pen.moveTo(0, 0);
        pen.lineTo(CANVAS_W, 0);
        pen.lineTo(CANVAS_W, CANVAS_H);
        pen.lineTo(0, CANVAS_H);
        pen.lineTo(0, 0);
        pen.stroke();
        //Auxiliary mesh
        /*pen.beginPath();
        pen.globalAlpha = 1;
        pen.lineWidth = 1;
        pen.strokeStyle = 'grey';
        for(let  i = 100; i < CANVAS_W; i += 100){
            pen.moveTo(i, 0);
            pen.lineTo(i, CANVAS_H);
            pen.stroke();
        }
        for(let  i = 100; i < CANVAS_H; i += 100){
            pen.moveTo(0, i);
            pen.lineTo(CANVAS_W, i);
            pen.stroke();
        }*/
    }
    SCRClear(x0, y0, w, h){
        //Clear the screen
        pen.clearRect(x0, y0, w, h);
    }
    BGInit(){
        pen.beginPath();
        pen.globalAlpha = 1;
        let  style = pen.createLinearGradient(0, 0, 0, CANVAS_H);
        style.addColorStop(0.5, 'DeepSkyBlue');
        style.addColorStop(0.7, 'LightSkyBlue');
        style.addColorStop(1, 'White');
        pen.fillStyle = style;
        pen.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }
    drawMenuBorder(x0, y0, w, h){
        pen.beginPath();
        pen.globalAlpha = 1;
        pen.moveTo(x0, y0);
        pen.lineTo(x0+w, y0);
        pen.lineTo(x0+w, y0+h);
        pen.lineTo(x0, y0+h);
        pen.lineTo(x0, y0);
        pen.lineWidth = 5;
        pen.strokeStyle = 'Black';
        pen.fillStyle = 'Gainsboro';
        pen.stroke();
        pen.fill();
    }
    openMenu(menuName){
        if(player.hp > 0){
            switch(menuName){
                case 'status':
                    if(!(this.isOpenMenu)){
                        window.clearInterval(MainLoopId);
                        //Draw menu contents
                        this.drawMenuBorder(100, 80, 600, 370);
                        pen.beginPath();
                        pen.globalAlpha = 1;
                        pen.textAlign = 'center';
                        pen.fillStyle = 'black';
                        pen.font = '20px Arial';
                        pen.fillText('Status', 400, 110);
                        this.isOpenMenu = !this.isOpenMenu;
                    }
                    else{
                        MainLoopId = window.setInterval(mainLoop, dt);
                        this.isOpenMenu = !this.isOpenMenu;
                    }
                    break;
                case 'storage':
                    if(!(this.isOpenMenu)){
                        window.clearInterval(MainLoopId);
                        //Draw menu contents
                        this.drawMenuBorder(100, 80, 600, 370);
                        pen.beginPath();
                        pen.globalAlpha = 1;
                        pen.textAlign = 'center';
                        pen.fillStyle = 'black';
                        pen.font = '20px Arial';
                        pen.fillText('Storage', 400, 110);
                        this.isOpenMenu = !this.isOpenMenu;
                    }
                    else{
                        MainLoopId = window.setInterval(mainLoop, dt);
                        this.isOpenMenu = !this.isOpenMenu;
                    }
                    break;
                case 'pause':
                    if(!(this.isOpenMenu)){
                        //Draw text
                        pen.beginPath();
                        pen.globalAlpha = 1;
                        pen.textAlign = 'center';
                        pen.fillStyle = 'red';
                        pen.font = '40px Arial';
                        pen.fillText('Game Paused', CANVAS_W/2, CANVAS_H/2);
                        window.clearInterval(MainLoopId);                        
                        this.isOpenMenu = !this.isOpenMenu;
                    }
                    else{
                        MainLoopId = window.setInterval(mainLoop, dt);
                        this.isOpenMenu = !this.isOpenMenu;
                    }
                    break;
            }
        }
    }
}
class Bullet {
    constructor(whose, x, y, xVel, yVel, style, damage, hitRange){
        this.whose = whose;
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;
        this.style = style;
        this.damage = damage;
        this.hitRange = hitRange;   //Used to do hit detection
    }
    move(){
        //Bullet movement in each frame
        this.y += this.yVel * dt;
        this.x += this.xVel * dt;          
    }
    draw(){
        //Draw bullet in each frame
        pen.beginPath();
        if(this.whose === player.name)  pen.fillStyle = 'yellow';
        else    pen.fillStyle = 'purple';
        if(this.style === 'basic_shot'){
            pen.globalAlpha = 1;
            pen.strokeStyle = 'black';
            pen.lineWidth = 3;            
            pen.arc(this.x, this.y, 5, 0, 360);
        }
        if(this.style === 'scatter_shot'){
            pen.globalAlpha = 1;
            pen.strokeStyle = 'black';
            pen.lineWidth = 3;
            pen.arc(this.x, this.y, 5, 0, 360);
        }
        if(this.style === 'machine_gun'){
            pen.globalAlpha = 1;
            pen.strokeStyle = 'black';
            pen.lineWidth = 3;
            pen.arc(this.x, this.y, 5, 0, 360);
        }
        if(this.style === 'energy_pulse'){
            pen.globalAlpha = 0.7;
            pen.fillStyle = 'violet';
            pen.strokeStyle = 'purple';
            pen.lineWidth = 3;
            pen.fillRect(this.x, this.y-12, 50, 25);
        }
        if(this.style === 'energy_beam'){
            pen.globalAlpha = 0.4;
            pen.strokeStyle = 'yellow';
            pen.lineWidth = 3;
            pen.fillRect(this.x, this.y-12, 10, 25);
        }
        pen.stroke();
        pen.fill();
    }
    stateUpdate(i){
        //Update each bullet's state
        if(this.whose === player.name){
            //For each bullet in player bullet array
            if(this.x > CANVAS_W || this.y > CANVAS_H || this.y < 0 || this.x < 0){
                bulletArray.splice(i, 1);
                bulletCounter --;
            }
        }
        else{
            //For each bullet in enemy bullet array
            if(this.x <= 0){
                enemyBulletArray.splice(i, 1);
                enemyBulletCounter --;
            }
        }   
    }
}
class Player {
    constructor(x, y, vtc, hrz, speed, hp, mp, weapon, name, score, img, state){
        //Player image
        this.img = img;
        //Initial position
        this.x = x;
        this.y = y;
        //Moving direction
        this.vtc = vtc;
        this.hrz = hrz;
        //Speed value
        this.speed = speed;
        //States
        this.name = name;
        this.score = score;
        this.hp = hp;
        this.mp = mp;
        //Weapon
        this.weapon = weapon;
        //Special state
        this.state = state;
    }
    //Player class behavior in each frame
    move(){
        //Player movement in each frame
        //Moving area restriction
        if(this.y > CANVAS_H && this.x > 0 && this.x < CANVAS_W){
            this.y = CANVAS_H;
        }
        if(this.y < 0 && this.x > 0 && this.x < CANVAS_W){
            this.y = 0;
        }
        if(this.y > 0 && this.y < CANVAS_H && this.x < 0){
            this.x = 0;
        }
        if(this.y > 0 && this.y < CANVAS_H && this.x > CANVAS_W){
            this.x = CANVAS_W;
        }
        if(this.x <= 0 && this.y <= 0){
            this.x = 0;
            this.y = 0;
        }
        if(this.x <= 0 && this.y >= CANVAS_H){
            this.x = 0;
            this.y = CANVAS_H;
        }
        if(this.x >= CANVAS_W && this.y <= 0){
            this.x = CANVAS_W;
            this.y = 0;
        }
        if(this.x >= CANVAS_W && this.y >= CANVAS_H){
            this.x = CANVAS_W;
            this.y = CANVAS_H;
        }
        this.x += this.hrz * this.speed;
        this.y += this.vtc * this.speed;
    }
    draw(){
        //Draw player in each frame
        pen.beginPath();
        pen.globalAlpha = 1;
        pen.arc(this.x, this.y, 10, 0, 360);
        pen.fillStyle = 'red';
        pen.strokeStyle = 'black';
        pen.lineWidth = 3;
        pen.stroke();
        pen.fill();
    }
    fire(){
        //Bullet generation in each frame
        if(!(playerTimeCounter % FPS)){   //Control the fire rate
            //Different weapons
            switch(this.weapon){
                case 'basic_shot':
                    FPS = 60;
                    bulletArray[bulletCounter] = new Bullet(this.name, this.x, this.y, 0.3, 0, 'basic_shot', 0.4, 200);
                    bulletCounter ++;
                    break;
                case 'scatter_shot':
                    FPS = 30;
                    bulletArray[0+bulletCounter] = new Bullet(this.name, this.x, this.y, 0.4*Math.cos(PI/9), -0.4*Math.sin(PI/9), 'scatter_shot', 0.2, 200);
                    bulletArray[1+bulletCounter] = new Bullet(this.name, this.x, this.y, 0.4*Math.cos(PI/9), +0.4*Math.sin(PI/9), 'scatter_shot', 0.2, 200);
                    bulletArray[2+bulletCounter] = new Bullet(this.name, this.x, this.y, 0.4*Math.cos(2*PI/9), -0.4*Math.sin(2*PI/9), 'scatter_shot', 0.2, 200);
                    bulletArray[3+bulletCounter] = new Bullet(this.name, this.x, this.y, 0.4*Math.cos(2*PI/9), +0.4*Math.sin(2*PI/9), 'scatter_shot', 0.2, 200);
                    bulletArray[4+bulletCounter] = new Bullet(this.name, this.x, this.y, 0.4*Math.cos(3*PI/9), -0.4*Math.sin(3*PI/9), 'scatter_shot', 0.2, 200);
                    bulletArray[5+bulletCounter] = new Bullet(this.name, this.x, this.y, 0.4*Math.cos(3*PI/9), +0.4*Math.sin(3*PI/9), 'scatter_shot', 0.2, 200);
                    bulletArray[6+bulletCounter] = new Bullet(this.name, this.x, this.y, 0.4, 0, 'scatter_shot', 0.4, 200);
                    bulletCounter += 7;
                    break;
                case 'machine_gun':
                    FPS = 5;
                    bulletArray[bulletCounter] = new Bullet(this.name, this.x, this.y, 0.6, 0, 'machine_gun', 0.1, 200);
                    bulletCounter ++;
                    break;
                case 'energy_pulse':
                    FPS = 1.5 * 60;
                    bulletArray[bulletCounter] = new Bullet(this.name, this.x, this.y, 0.1, 0, 'energy_pulse', 0.5, 200);
                    bulletCounter ++;
                    break;
                case 'energy_beam':
                    FPS = 1;
                    bulletArray[bulletCounter] = new Bullet(this.name, this.x, this.y, 0.7, 0, 'energy_beam', 0.02, 200);
                    bulletCounter ++;
                    break;
                /*case 'laser':
                    bulletArray[bulletCounter] = new Bullet(this.name, this.x, this.y, 0.2, 0, 'laser');

                    break;
                */
            }            
        }       
    }
    bomb(){
        if(this.mp >= 0.3){
            this.mp -= 0.3;
            for(let  i = 0; i < enemyCounter; i++){
                enemyArray[i].hp *= 0.5;
            }
            enemyBulletArray.splice(0);
            enemyBulletCounter = 0;
        }
    }
    MPRecover(){
        this.mp += 0.005
        if(this.mp >= 1)
            this.mp = 1;
    }
    stateUpdate(){
        //Special state display
        pen.beginPath();
        pen.globalAlpha = 1;
        pen.fillStyle = 'black';
        pen.font = '20px Arial';
        pen.textAlign = 'start';
        pen.fillText('Special state: ' + player.state.split('_').toString().toUpperCase().replace(',', ' '), 10, 50);
        //Icon display
        pen.beginPath();
        pen.globalAlpha = 1;
        pen.lineWidth = 3;
        pen.strokeStyle = 'black';
        pen.strokeRect(15, CANVAS_H-90, 75, 75);
        pen.beginPath();
        pen.globalAlpha = 0.6;
        pen.drawImage(player.img, 15, CANVAS_H-90, 75, 75);
        //Print player info in each frame
        pen.beginPath();
        pen.globalAlpha = 1;
        pen.fillStyle = 'black';
        pen.font = '20px Arial';
        pen.textAlign = 'start';
        pen.strokeStyle = 'black';
        pen.lineWidth = 2;
        pen.fillText('Stage: ' + 'test stage', 10, 25);
        pen.fillText('Score: ' + this.score, 10, 70);
        //Draw player name
        pen.beginPath();
        pen.globalAlpha = 1;
        pen.fillStyle = 'black';
        pen.font = '10px Arial';
        pen.textAlign = 'center';
        pen.fillText(this.name, this.x, this.y-15);
        //HP bar
        pen.beginPath();
        pen.globalAlpha = 1;
        pen.textAlign = 'start';
        pen.font = '20px Arial';
        pen.fillText('HP: ', 260, 30);
        pen.strokeStyle = 'black';
        pen.lineWidth = 2;
        pen.strokeRect(300, 13, 100, 20);
        if(this.hp > 1) this.hp = 1;    //Max hp restriction
        if(this.hp >= 0.6){
            pen.fillStyle = 'Lime';
            pen.fillRect(300, 13, this.hp*100, 20);
        }
        else if(this.hp >= 0.3 && this.hp < 0.6){
            pen.fillStyle = 'DarkGoldenRod';
            pen.fillRect(300, 13, this.hp*100, 20);
        }
        else if(this.hp < 0.3 && this.hp > 0){
            pen.fillStyle = 'Maroon';
            pen.fillRect(300, 13, this.hp*100, 20);
        }
        else{
            //Death scene
            pen.beginPath();
            pen.globalAlpha = 1;
            pen.textAlign = 'center';
            pen.font = '40px Arial';
            pen.fillStyle = 'red';
            pen.fillText('YOU DEAD!', CANVAS_W/2, CANVAS_H/2);
            window.clearInterval(MainLoopId);
        }
        //MP bar
        if(this.mp > 1) this.mp = 1;    //Max mp restriction
        pen.beginPath();
        pen.globalAlpha = 1;
        pen.textAlign = 'start';
        pen.font = '20px Arial';
        pen.fillStyle = 'black';
        pen.fillText('MP: ', 260, 60);
        pen.strokeStyle = 'black';
        pen.lineWidth = 2;
        pen.strokeRect(300, 43, 100, 20);
        pen.fillStyle = 'blue';
        pen.fillRect(300, 43, this.mp*100, 20);
        //Display weapon name
        pen.beginPath();
        pen.globalAlpha = 1;
        pen.fillStyle = 'black';
        pen.font = '20px Arial';
        pen.textAlign = 'start';
        pen.fillText('Weapon: ' + this.weapon.split('_').toString().toUpperCase().replace(',', ' '), 10, 90);
    }
    checkState(){
        switch(player.state){
            case 'none':
                player.speed = 3;
                //More special states
                break;
            case 'speed_x2':
                player.speed = 2 * 3;
                break;
            //case
        }
    }
}
class Enemy {
    constructor(name, x, y, xVel, yVel, hp, weapon){
        this.name = name;
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;
        this.hp = hp;
        this.weapon = weapon;
        this.maxHp = hp;
    }
    move(){
        //Enemy move
        if(this.name === 'enemy_0' || this.name === 'enemy_1' || this.name === 'enemy_2' || this.name === 'enemy_3' || this.name === 'enemy_4'){
            this.y += this.yVel * dt;
            this.x += this.xVel * dt;
        }
        else if(this.name === 'enemy_5'){
            this.x += this.xVel * dt;
            this.y += 350 * this.yVel * Math.cos(playerTimeCounter/FPS*PI*2);
        }
    }
    fire(){
        switch(this.weapon){
            case 'basic_shot':
                if(!(enemyTimeCounter % (60*1.5))){
                    enemyBulletArray[enemyBulletCounter] = new Bullet(this.name, this.x, this.y, -0.15, 0, 'basic_shot', 0.4, 200);
                    enemyBulletCounter ++;
                }
                break;
            case 'scatter_shot':
                if(!(enemyTimeCounter % (60*2))){
                    enemyBulletArray[0+enemyBulletCounter] = new Bullet(this.name, this.x, this.y, 0.15*Math.cos(5*PI/6), 0.15*Math.sin(5*PI/6), 'scatter_shot', 0.2, 200);
                    enemyBulletArray[1+enemyBulletCounter] = new Bullet(this.name, this.x, this.y, 0.15*Math.cos(5*PI/6), 0.15*Math.sin(7*PI/6), 'scatter_shot', 0.2, 200);
                    enemyBulletArray[2+enemyBulletCounter] = new Bullet(this.name, this.x, this.y, -0.15, 0, 'scatter_shot', 0.2, 200);
                    enemyBulletCounter += 3;
                }
                break;
            case 'tracking_shot':
                if(!(enemyTimeCounter % (60*1.5))){
                    enemyBulletArray[enemyBulletCounter] = new Bullet(this.name, this.x, this.y, -0.1*Math.cos(Math.acos((this.x-player.x)/(Math.sqrt((player.x-this.x)**2+(player.y-this.y)**2)))), -0.1*Math.sin(Math.asin((this.y-player.y)/(Math.sqrt((player.x-this.x)**2+(player.y-this.y)**2)))), 'basic_shot', 0.2, 200);
                    enemyBulletCounter ++;
                }
                break;
            //case
        }
    }
    draw(){
        //Draw enemies in each frame
        pen.beginPath();
        pen.globalAlpha = 1;
        pen.fillStyle = 'pink';
        pen.strokeStyle = 'black';
        pen.lineWidth = 3;            
        pen.arc(this.x, this.y, 10, 0, 360);
        pen.stroke();
        pen.fill();
    }
    stateUpdate(i){
        //Update each enemy's state
        if(this.x < -10){
            enemyArray.splice(i, 1);    //Delete the oldest enemy
            //i = 0;  //Reset loop let iable to rerender the position of each enemy
            enemyCounter --;   //Update the number of existing enemies
            //Cancel display hp bar
            dispEnemyId = undefined;
        }
    }
}
class Item {
    constructor(name, x, y, xVel, yVel){
        this.name = name;
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;
    }
    move(){
        //Move an item in each frame
        this.x += this.xVel * dt;
        this.y += this.yVel * dt;
    }
    draw(){
        //Draw items in each frame
        pen.beginPath();
        pen.globalAlpha = 1;
        pen.strokeStyle = 'black';
        pen.lineWidth = 2;
        switch(this.name){
            case 'first_aid_kit':
                pen.fillStyle = 'white';
                pen.fillRect(this.x-20, this.y-10, 40, 30);
                pen.strokeRect(this.x-20, this.y-10, 40, 30);
                pen.beginPath();
                pen.fillStyle = 'red';
                pen.fillRect(this.x-10, this.y, 20, 10);
                pen.fillRect(this.x-5, this.y-5, 10, 20);
                break;
            case 'mp_recover_kit':
                pen.fillStyle = 'white';
                pen.fillRect(this.x-20, this.y-10, 40, 30);
                pen.strokeRect(this.x-20, this.y-10, 40, 30);
                pen.beginPath();
                pen.fillStyle = 'blue';
                pen.fillRect(this.x-10, this.y, 20, 10);
                pen.fillRect(this.x-5, this.y-5, 10, 20);
                break;
            case 'basic_shot_kit':
                pen.fillStyle = 'white';
                pen.fillRect(this.x-20, this.y-10, 40, 30);
                pen.strokeRect(this.x-20, this.y-10, 40, 30);
                pen.fillStyle = 'black';
                pen.beginPath();
                pen.strokeText('BS', this.x-15, this.y+10);
                break;
            case 'machine_gun_kit':
                pen.fillStyle = 'white';
                pen.fillRect(this.x-20, this.y-10, 40, 30);
                pen.strokeRect(this.x-20, this.y-10, 40, 30);
                pen.fillStyle = 'black';
                pen.beginPath();
                pen.strokeText('MG', this.x-15, this.y+10);
                break;
            case 'energy_beam_kit':
                pen.fillStyle = 'white';
                pen.fillRect(this.x-20, this.y-10, 40, 30);
                pen.strokeRect(this.x-20, this.y-10, 40, 30);
                pen.fillStyle = 'black';
                pen.beginPath();
                pen.strokeText('EB', this.x-15, this.y+10);
                break;
            case 'energy_pulse_kit':
                pen.fillStyle = 'white';
                pen.fillRect(this.x-20, this.y-10, 40, 30);
                pen.strokeRect(this.x-20, this.y-10, 40, 30);
                pen.fillStyle = 'black';
                pen.beginPath();
                pen.strokeText('EP', this.x-15, this.y+10);
                break;
            //case '':
        }        
    }
    stateUpdate(i){
        if(this.x < -10){
            itemArray.splice(i, 1);
            itemCounter --;
        }
    }
    use(){
        switch(this.name){
            case 'first_aid_kit':
                player.hp += 0.5;
                break;
            case 'mp_recover_kit':
                player.mp += 0.3;
                break;
            case 'basic_shot_kit':
                player.weapon = 'basic_shot';
                break;
            case 'machine_gun_kit':
                player.weapon = 'machine_gun';
                break;
            case 'energy_beam_kit':
                player.weapon = 'energy_beam';
                break;
            case 'energy_pulse_kit':
                player.weapon = 'energy_pulse';
                break;
        }
    }
}
//-------------------------------------Instance initialization----------------------
let system = new System();
let player = new Player(
    10,
    0.5 * CANVAS_H,
    0,
    0,
    3,
    1,
    0,
    'basic_shot',
    window.tempName,    //Global variable of player name
    0,
    window.tempIcon,
    'none'
);