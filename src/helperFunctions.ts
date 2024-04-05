import { Application, Sprite } from "pixi.js";
import { BadGuy, Bullet, GameElement, Player } from "./characters";
import { endGame, progress } from ".";
import { levelOne, levelThree, levelTwo } from "./levels";

export const spawnBadGuysConst = 100;

export const counters = {
    spawnBadGuysCounter: spawnBadGuysConst,
    currentBadGuy: 0
}


export function collisionCheck(object1:Sprite, object2:Sprite)
{
    const bounds1 = object1.getBounds();
    const bounds2 = object2.getBounds();

    return (
        bounds1.x < bounds2.x + bounds2.width
        && bounds1.x + bounds1.width > bounds2.x
        && bounds1.y < bounds2.y + bounds2.height
        && bounds1.y + bounds1.height > bounds2.y
    );

    
}
export function getRandomNumber(min:number, max:number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const spawnBadGuys = function(app:Application, elements:GameElement[]){
    let levelCode:string | number | null = localStorage.getItem('currentLevel');
    if(levelCode){
        levelCode = parseInt(levelCode)
    }
    else{
        levelCode = 1;
    }
    let currentLevel:(typeof BadGuy)[] = [];
    
    switch(levelCode){
        case 1:
            currentLevel = levelOne;
            break;
        case 2:
            currentLevel = levelTwo;
            break;
        case 3: 
            currentLevel =levelThree;
            break;  
        default:
            currentLevel = levelThree;
            break;
    }

    if(!currentLevel[counters['currentBadGuy']]){
        const onlyBadGuys = app.stage.children.filter((el) => {
            return el instanceof BadGuy
        })
        if(onlyBadGuys.length === 0){
            endGame(app, 'won')
        }
        return
    }

    if(counters['spawnBadGuysCounter']){
        counters['spawnBadGuysCounter']-=1;
    }
    else{

        const evilAlien = new currentLevel[counters['currentBadGuy']](app.screen.width,getRandomNumber(50,app.screen.height));
        app.stage.addChild(evilAlien);

        elements.push(evilAlien);
        if(progress && (progress.progress || progress.progress == 0)){  
            progress.progress = (counters['currentBadGuy']/ currentLevel.length) * 100;
        }
        counters['spawnBadGuysCounter'] = spawnBadGuysConst;
        counters['currentBadGuy']++;
    }
}

export function interactions(elements:GameElement[], app:Application, player:Player){
    elements.forEach((el:GameElement) =>{
        el.move(app,elements)
        elements.forEach((innerEl: GameElement) => {
            if(collisionCheck(el,innerEl)){
                if(innerEl instanceof BadGuy && el instanceof Bullet || 
                    innerEl instanceof Bullet && el instanceof BadGuy
                ){
                    innerEl.hit(el,elements , app);
                    el.hit(innerEl, elements,app);
                }
            }
        })
        
        if(collisionCheck(el,player) && el instanceof BadGuy){
            endGame(app, 'lost')
        }
        el.hitAnimation();
        
        if(el instanceof GameElement && el.x  < -20 || el instanceof GameElement && el.x > app.screen.width
            || el instanceof GameElement && el.y > app.screen.height || el instanceof GameElement && el.y < 0

        ){
            el.die(elements, app);
        }
    })
}