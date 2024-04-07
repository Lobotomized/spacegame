import './styles/index.css'
import { Application, Assets, Graphics, TilingSprite } from 'pixi.js';
import { GameElement, Player } from './gameLogic/characters';
import { counters, interactions, spawnBadGuys, spawnBadGuysConst } from './gameLogic/helperFunctions';
import { bigGun, bigSplashWeapon, splashWeapon } from './gameLogic/weapons';
import { ProgressBar } from '@pixi/ui';

const activeKeys:string[] = []  
const elements:GameElement[] = []
let app: Application | null = null;
let player: Player | null = null;
let tilingSprite: TilingSprite |  null = null;
const onKeyDown = function(e:KeyboardEvent){
    if(activeKeys.indexOf(e.key) === -1){
        activeKeys.push(e.key);
    }
}
const onKeyUp = function(e:KeyboardEvent){
    activeKeys.splice(activeKeys.indexOf(e.key), 1);
}
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
const body: HTMLElement | null = document.querySelector('body');

export let progress:ProgressBar | null = null;


const tickerHandler = () =>
{
    if(!app || !player || !tilingSprite){
        return;
    }
    interactions(elements, app,player)
    spawnBadGuys(app, elements);
    activeKeys.forEach((key:string) => {
        if(!player){
            return
        }
        player.controls(key,app,elements);
    })
    tilingSprite.tilePosition.x -= 1;
}
export const endGame = async(app:Application, finishCondition:'lost' | 'won') => { 
    elements.length = 0;
    app.ticker.remove(tickerHandler)

    counters.currentBadGuy = 0;
    counters.spawnBadGuysCounter = spawnBadGuysConst;   

    if(!body){
        return;
    }
    if(finishCondition === 'lost'){
        body.innerHTML = `
            <div class="menuContainer">
                <h1>Game Lost</h1>
                <button class="button" id="restart">Restart</button>
                <div class="smallCol">
                    <span>Select Weapon</span>
                    <div class="row">
                        <label for="">Default Weapon : </label>
                        <input type="radio" name="weapon" value="default">
                    </div>
        
                    <div class="row">
                        <label  for="">Splash Weapon : </label>
                        <input type="radio" name="weapon" value="splash">
                    </div>
                    <div class="row">
                        <label  for="">Big Gun: </label>
                        <input type="radio" name="weapon" value="bigGun">
                    </div>
                    <div class="row">
                        <label  for="">Big Splash Gun: </label>
                        <input type="radio" name="weapon" value="bigSplash">
                    </div>
                </div>
        
                </div>
            </div>
        `
    }
    else if(finishCondition ==='won'){
        body.innerHTML = `
            <div class="menuContainer">
                <h1>Game Won</h1>
                <button class="button" id="restart">Play next level</button>
                <div class="smallCol">
                    <span>Select Weapon</span>
                    <div class="row">
                        <label for="">Default Weapon : </label>
                        <input type="radio" name="weapon" value="default">
                    </div>
        
                    <div class="row">
                        <label  for="">Splash Weapon : </label>
                        <input type="radio" name="weapon" value="splash">
                    </div>
                    <div class="row">
                        <label  for="">Big Gun: </label>
                        <input type="radio" name="weapon" value="bigGun">
                    </div>
                    <div class="row">
                        <label  for="">Big Splash Gun: </label>
                        <input type="radio" name="weapon" value="bigSplash">
                    </div>
                </div>
        
                </div>
            </div>
        `

        let levelCode:string | number | null = localStorage.getItem('currentLevel');
        if(levelCode){
            levelCode = parseInt(levelCode) + 1;
        }
        else{
            levelCode = 2;
        }
        localStorage.setItem('currentLevel',levelCode.toString());
    }

    
    const theStartButton = document.querySelector('#restart')
    theStartButton?.addEventListener("click", function(){
        startGame();
    })
}


const startGame = async () =>
{
    const checkbox: unknown = document.body.querySelector('input[name="weapon"]:checked');

    app = new Application();
    if(!body){
        return
    }
    body.innerHTML = ``

    await app.init({ resizeTo: body });
    document.body.appendChild(app.canvas);


    const texture = await Assets.load('assets/space.jpg');
    
    if(checkbox && checkbox instanceof Object && 'value' in checkbox){
        switch(checkbox.value){
            case 'splash':
                player = new Player(50,60, app, splashWeapon);  
                break;
            case 'bigGun':
                player = new Player(50,60, app, bigGun);  
                break;
            case 'bigSplash':
                player = new Player(50,60, app, bigSplashWeapon);  
                break;
            default:
                    player = new Player(50,60, app);  
                break;
        }
    }
    else{
        player = new Player(50,60, app);  
    }
    tilingSprite = new TilingSprite({
        texture,
        width: app.screen.width,
        height: app.screen.height,
    });

    app.stage.addChild(tilingSprite);
    app.stage.addChild(player);

    app.ticker.add(tickerHandler);

    
    const lineOne = new Graphics()
    .rect(0, 0, app.stage.width,10)
    .fill('#160915');

    const lineTwo = new Graphics()
    .rect(0, 0, app.stage.width,10)
    .fill('#846684');

    // Create a new ProgressBar instance
    progress = new ProgressBar({
        bg: lineOne, 
        fill: lineTwo, 
        progress: 0, 
    });

    app.stage.addChild(progress);
}

const theStartButton = document.querySelector('#start')
theStartButton?.addEventListener("click", function(){
    startGame();
})


