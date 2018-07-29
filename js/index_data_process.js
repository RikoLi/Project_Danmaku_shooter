window.tempName = '';   //Global variable for player name passing
function startGame(playerName){
    if(playerName === ''){
        alert('姓名不能为空！');
        return;
    }
    else{
        if(document.getElementById('choose-icon').value === ''){
            alert('未定义头像，将使用默认值！');
            window.tempIcon = new Image();
            window.tempIcon.src = './assets/player_icon/default_icon.jpg';
        }
        else{
            window.tempIcon = document.getElementById('player-icon');
        }
        window.tempName = playerName;
        document.getElementById('info-area').remove();
        let DOM_playArea = document.body.appendChild(document.createElement('div'));
        DOM_playArea.id = 'play-area';
        let DOM_canvas = DOM_playArea.appendChild(document.createElement('canvas'));
        DOM_canvas.id = 'canvas';
        DOM_canvas.tabIndex = '0';
        DOM_canvas.width = '800';
        DOM_canvas.height = '500';
        document.body.setAttribute('onkeyup', 'ButtonUpCheck(event)');
        document.body.setAttribute('onkeydown', 'ButtonDownCheck(event)');
        let DOM_script_def = document.body.appendChild(document.createElement('script')),
            DOM_script_main = document.body.appendChild(document.createElement('script'));
        DOM_script_def.src = './js/definations.js';
        DOM_script_main.src = './js/main.js';
    }
}

function uploadIcon(){
    //Upload pics using FileReader
    let reader = new FileReader();
    let file = document.getElementById('choose-icon').files[0];
    reader.readAsDataURL(file);
    reader.onloadend = function(reader){
        let src = reader.target.result;
        document.getElementById('player-icon').setAttribute('src', src);
    }
}

/**
 * 开发者模式入口函数
 */
function startDev(){
    window.tempName = 'test';
    window.tempIcon = new Image();
    document.getElementById('info-area').remove();
    let DOM_playArea = document.body.appendChild(document.createElement('div'));
    DOM_playArea.id = 'play-area';
    let DOM_canvas = DOM_playArea.appendChild(document.createElement('canvas'));
    DOM_canvas.id = 'canvas';
    DOM_canvas.tabIndex = '0';
    DOM_canvas.width = '800';
    DOM_canvas.height = '500';
    document.body.setAttribute('onkeyup', 'ButtonUpCheck(event)');
    document.body.setAttribute('onkeydown', 'ButtonDownCheck(event)');
    let DOM_script_def = document.body.appendChild(document.createElement('script')),
        DOM_script_main = document.body.appendChild(document.createElement('script'));
    DOM_script_def.src = './js/definations.js';
    DOM_script_main.src = './js/main.js';
}