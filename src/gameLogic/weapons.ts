import { Application } from "pixi.js";
import { BadGuy, BadGuyBullet, BadGuyShooter, BigBullet, Bullet, GameElement, Player } from "./characters";

export const defaultWeapon = (app:Application | undefined, elements:GameElement[],player:Player) =>{
    const attackDelayConst = 30;
    if(!app){
        return
    }
    if(player.attackDelayCounter === 0){
        const bullet = new Bullet(player.x+50,player.y);
        app.stage.addChild(bullet);
        elements.push(bullet);
        player.attackDelayCounter = attackDelayConst
    }
}

export const defaultWeaponBad = (app:Application | undefined, elements:GameElement[],player:BadGuyShooter) =>{
    const attackDelayConst = 70;
    if(!app){
        return
    }
    if(player?.attackDelayCounter === 0){
        const bullet = new BadGuyBullet(player.x-50,player.y);
        app.stage.addChild(bullet);
        elements.push(bullet);

        player.attackDelayCounter = attackDelayConst
    }
}

export const bigGun = (app:Application | undefined, elements:GameElement[],player:Player) =>{
    const attackDelayConst = 80;
    if(!app){
        return
    }
    if(player.attackDelayCounter === 0){
        const bullet = new BigBullet(player.x+50,player.y);
        app.stage.addChild(bullet);
        elements.push(bullet);
        player.attackDelayCounter = attackDelayConst
    }
}


export const bigSplashWeapon = (app:Application | undefined, elements:GameElement[],player:Player) =>{
    const attackDelayConst = 180;
    if(!app){
        return
    }
    if(player.attackDelayCounter === 0){
        const bullet = new BigBullet(player.x+50,player.y);
        const bullet2 = new BigBullet(player.x+50,player.y,1,1);

        const bullet3 = new BigBullet(player.x+50,player.y,1,-1);

        app.stage.addChild(bullet);
        elements.push(bullet);
        
        app.stage.addChild(bullet2);
        elements.push(bullet2);
        
        app.stage.addChild(bullet3);
        elements.push(bullet3);

        player.attackDelayCounter = attackDelayConst
    }
}


export const splashWeapon = (app:Application | undefined, elements:GameElement[],player:Player) =>{
    const attackDelayConst = 60;
    if(!app){
        return
    }
    if(player.attackDelayCounter === 0){
        const bullet = new Bullet(player.x+50,player.y);
        const bullet2 = new Bullet(player.x+50,player.y,1,1);

        const bullet3 = new Bullet(player.x+50,player.y,1,-1);

        app.stage.addChild(bullet);
        elements.push(bullet);
        
        app.stage.addChild(bullet2);
        elements.push(bullet2);
        
        app.stage.addChild(bullet3);
        elements.push(bullet3);

        player.attackDelayCounter = attackDelayConst
    }
}
