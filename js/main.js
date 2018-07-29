const dt = 1 / 60 * 1000;  //Delta time for animation, (ms)
//--------------------------------------Main loop-------------------------------------------
let MainLoopId = window.setInterval(mainLoop, dt);
//Button check
function ButtonDownCheck(event){
    //Up
    if(event.keyCode === 38 || event.keyCode === 87)
        player.vtc = -1;
    //Down
    if(event.keyCode === 40 || event.keyCode === 83)
        player.vtc = 1;
    //Left
    if(event.keyCode === 37 || event.keyCode === 65)
        player.hrz = -1;
    //Right
    if(event.keyCode === 39 || event.keyCode === 68)
        player.hrz = 1;
    //Key X for bomb
    if(event.keyCode === 88)
        player.bomb();
    //Status menu I
    if(event.keyCode === 73)
        system.openMenu('status');
    //Storage menu B
    if(event.keyCode === 66)
        system.openMenu('storage');
    //Pause P
    if(event.keyCode === 80)
        system.openMenu('pause');    
}
function ButtonUpCheck(event){
    //Up
    if(event.keyCode === 38 || event.keyCode === 87)
        player.vtc = 0;
    //Down
    if(event.keyCode === 40 || event.keyCode === 83)
        player.vtc = 0;
    //Left
    if(event.keyCode === 37 || event.keyCode === 65)
        player.hrz = 0;
    //Right
    if(event.keyCode === 39 || event.keyCode === 68)
        player.hrz = 0;
    //Status menu I
    if(event.keyCode === 73 || event.keyCode === 66 || event.keyCode === 80)
        system.openMenu('');
}
//Main loop
function mainLoop(){
    //TODO list in each frame
    //Clear the screen in each frame
    system.SCRClear(0, 0, CANVAS_W, CANVAS_H);
    //Update environment image
    system.BGInit();
    //Update instance state
    system.enemyGen();  //Generate new enemies
    //-------------------Object actions-----------------------
    player.fire();      //Player fire
    for(let i = 0; i < enemyCounter; i++){  //Update each enemy
        enemyArray[i].fire();
        enemyArray[i].stateUpdate(i);
    }
    for(let i = 0; i < bulletCounter; i++){ //Update each player's bullet
        bulletArray[i].stateUpdate(i);
    }
    for(let i = 0; i < enemyBulletCounter; i++){    //Update each enemy's bullet
        enemyBulletArray[i].stateUpdate(i);
    }
    for(let i = 0; i < itemCounter; i++){
        itemArray[i].stateUpdate(i);
    }
    //----------------------Move objects--------------------------------------
    player.move();      //Move the player
    for(let i = 0; i < enemyCounter; i++)   enemyArray[i].move();  //Move each enemy
    for(let i = 0; i < bulletCounter; i++)  bulletArray[i].move(); //Move each player's bullet
    for(let i = 0; i < enemyBulletCounter; i++) enemyBulletArray[i].move(); //Move each enemy's bullet
    for(let i = 0; i < itemCounter; i++) itemArray[i].move();   //Move each item
    //Update instance image
    for(let i = 0; i < itemCounter; i++) itemArray[i].draw();   //Draw each item
    for(let i = 0; i < enemyCounter; i++)   enemyArray[i].draw();   //Draw each enemy
    for(let i = 0; i < bulletCounter; i++)  bulletArray[i].draw();  //Draw each player's bullet   
    for(let i = 0; i < enemyBulletCounter; i++) enemyBulletArray[i].draw(); //Draw each enemy's bullet
    player.draw();      //Draw player
    //Hit detection
    system.hitDetect(); 
    //Update GUI
    system.SCRBoundaryInit();
    system.EnemyStateDisp();
    player.stateUpdate();
    player.checkState();
    //Auxiliary operations
    playerTimeCounter ++;
    enemyTimeCounter ++;
    if(playerTimeCounter === FPS)
        playerTimeCounter = 0;
    if(enemyTimeCounter === ENEMY_FR)
        enemyTimeCounter = 0;
}