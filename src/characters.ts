import { Application, Assets, Graphics, Renderer, Sprite, Texture } from "pixi.js";
import { defaultWeapon, defaultWeaponBad } from "./weapons";

let bulletTexture : Texture;
let evilAlien : Texture;
let playerTexture: Texture;
let enemyShip: Texture;

Assets.load('assets/bullet.png').then((res:Texture) => {
    bulletTexture = res;
})


Assets.load('assets/evilAlien.png').then((res:Texture) => {
    evilAlien = res;
})

Assets.load('assets/spaceShip.png').then((res:Texture) => {
    playerTexture = res;
})

Assets.load('assets/enemyShip.png').then((res:Texture) => {
    enemyShip = res;
})


export class Player extends Sprite {
    speed = 5;
    attackDelayCounter = 0;
    elements: GameElement[] = [];
    app:Application | undefined = undefined;
    currentWeapon = defaultWeapon
    constructor(x:number,y:number, app: Application<Renderer> | undefined, weapon?: (app: Application | undefined, 
        elements: GameElement[], player: Player) => void){
        super({
            x:x,
            y:y,
            texture:playerTexture,
            anchor:0.5,
            width:60,
            height:60,
            rotation:1.558
        });
        this.app = app;
        if(weapon){
            this.currentWeapon = weapon;
        }
        const parentCenterX = this.width / 2;
        const parentCenterY = this.height / 2;
        const hitBox = new Graphics()
        .rect(0, 0, 1024,1024)
        .fill('#ffffff22');
        
        hitBox.position.set(parentCenterX - hitBox.width / 2, parentCenterY - hitBox.height / 2);

        this.addChild(hitBox)
    }
    controls(key:string, app:Application | null, elements:GameElement[]){
        if(!app){
            return
        }
        if(this.attackDelayCounter > 0){
            this.attackDelayCounter -=1;
        }
        switch(key){
            case ' ':
                this.currentWeapon(app,elements,this);

                break;
            case 'a':
                    if(this.x - this.speed * app.ticker.deltaTime <= 30){
                        this.x = 30;
                    }
                    else{
                        this.x -= this.speed * app.ticker.deltaTime;
                    }
                break;
            case 'd':
                    if(this.x + this.speed * app.ticker.deltaTime >= app.screen.width-25){
                        this.x = app.screen.width-25;
                    }
                    else{
                        this.x += this.speed * app.ticker.deltaTime;
                    }                        
                break;
            case 'w':
                    if(this.y - this.speed * app.ticker.deltaTime <= 30){
                        this.y = 30;
                    }
                    else{
                        this.y -= this.speed * app.ticker.deltaTime;
                    }                    
                break;
            case 's':
                    if(this.y + this.speed * app.ticker.deltaTime >= app.screen.height-30){
                        this.y = app.screen.height-30;
                    }
                    else{
                        this.y += this.speed * app.ticker.deltaTime;
                    }    
                break;
        }
    }
}

export abstract class GameElement extends Sprite {
    hp:number=5
    damage:number=1
    hitAnimationCounter:number=0
    originalTint= 0xFFFFFF
    constructor(x:number,y:number){
        super();
 
        this.x = x;
        this.y = y;
        this.anchor = 0.5;
    }
    abstract move(app?:Application, elements?:GameElement[]): void;

    hitAnimation(){
        if(this.hitAnimationCounter > 0){
            this.tint = 'yellow'
            this.hitAnimationCounter -=1;
        }else{
            this.tint =  this.originalTint;
        }
    }

    hit(otherElement:GameElement,elements:GameElement[], app:Application){
        
        otherElement.hp -= this.damage;
        otherElement.hitAnimationCounter = 1;
        if(otherElement.hp <= 0){
            otherElement.die(elements,app);
        }
    }
    die(elements:GameElement[], app:Application){
        elements.splice(elements.indexOf(this),1);
        app.stage.removeChild(this);
    }
}

export class BadGuy extends GameElement {
    speed = 1;
    constructor(x:number,y:number){
        super(x,y);
 
        this.x = x;
        this.y = y;
    }
    move(){
        this.x -= this.speed;
    }    
    die(elements:GameElement[], app:Application){
        elements.splice(elements.indexOf(this),1);
        app.stage.removeChild(this);
    }
}

export class Bullet extends GameElement {
    directionX: number = 1
    directionY: number = 0
    speed:number = 5
    constructor(x:number,y:number, directionX?:number, directionY?:number){
        super(x,y);
        this.texture = bulletTexture;
        this.width = 10;
        this.height = 15;
        this.rotation = 1.5;
        this.hp = 1;

        if(directionX){
            this.directionX = directionX
        }
        if(directionY){
            this.directionY = directionY;
        }
    }
    move(){
        this.x += this.speed * this.directionX;
        this.y += this.speed * this.directionY;
    }
}

export class BigBullet extends Bullet {
    constructor(x:number,y:number, directionX?:number, directionY?:number){
        super(x,y);
        this.texture = bulletTexture;
        this.width = 20;
        this.height = 30;
        this.rotation = 1.5;
        this.hp = 5;
        if(directionX){
            this.directionX = directionX;
        }
        if(directionY){
            this.directionY = directionY
        }
    }
    move(){
        this.x += this.speed * this.directionX;
        this.y += this.speed * this.directionY;    
    }
}


export class EvilAlien extends BadGuy {
    speed = 5
    constructor(x:number,y:number){
        super(x,y);
        this.texture = evilAlien;

        this.width = 50;
        this.height = 50;
        this.rotation = -1.555;

        const hitBox = new Graphics()
        .rect(0, 0, 782,810)
        .fill('#ffffff55');


        const parentCenterX = this.width / 2;
        const parentCenterY = this.height / 2;

        hitBox.position.set(parentCenterX - hitBox.width / 2, parentCenterY - hitBox.height / 2);

        this.addChild(hitBox);
    }
}


export class EvilShip extends BadGuy {
    speed = 3
    hp=50
    verticalDirection = 'top'
    horizontalDirection = 'left'
    constructor(x:number,y:number){
        super(x,y);
        this.texture = enemyShip;

        this.width = 80;
        this.height = 80;
        // this.rotation = -1.555;

        const hitBox = new Graphics()
        .rect(0, 0, 782,810)
        .fill('#ffffff55');


        const parentCenterX = this.width / 2;
        const parentCenterY = this.height / 2;

        hitBox.position.set(parentCenterX - hitBox.width / 2, parentCenterY - hitBox.height / 2);

        this.addChild(hitBox);
    }

    move(app?:Application){
        if(!app){
            return;
        }
        if(this.x <= 20){
            this.horizontalDirection = 'right'
        }
        else if(this.x >= app.screen.width - 20){
            this.horizontalDirection = 'left'
        }

        if(this.y <= 10){
            this.verticalDirection = 'up'
        }
        else if(this.y >= app.screen.height - 20){
            this.verticalDirection = 'down'
        }

        if(this.horizontalDirection === 'left'){
            this.x -= this.speed;
        }
        else {
            this.x += this.speed;
        }

        if(this.verticalDirection === 'up'){
            this.y +=this.speed
        }
        else{
            this.y -= this.speed;
        }


    }
}


export class MoreEvilAlien extends BadGuy {
    speed = 3
    originalTint = 0x0000FF
    hp = 10
    constructor(x:number,y:number){
        super(x,y);
        this.texture = evilAlien;
        this.tint= this.originalTint
        this.width = 50;
        this.height = 50;
        this.rotation = -1.555;

        const hitBox = new Graphics()
        .rect(0, 0, 782,810)
        .fill('#ffffff55');


        const parentCenterX = this.width / 2;
        const parentCenterY = this.height / 2;

        hitBox.position.set(parentCenterX - hitBox.width / 2, parentCenterY - hitBox.height / 2);

        this.addChild(hitBox);
    }
}

export class HauntingEvilAlien extends BadGuy {
    speed = 3
    originalTint = 0xFF00FF
    hp = 5
    constructor(x:number,y:number){
        super(x,y);
        this.texture = evilAlien;
        this.tint= this.originalTint
        this.width = 50;
        this.height = 50;
        this.rotation = -1.555;

        const hitBox = new Graphics()
        .rect(0, 0, 782,810)
        .fill('#ffffff55');


        const parentCenterX = this.width / 2;
        const parentCenterY = this.height / 2;

        hitBox.position.set(parentCenterX - hitBox.width / 2, parentCenterY - hitBox.height / 2);

        this.addChild(hitBox);
    }

    move(){
        const findGuy = this.parent.children.find((el) => {
            return el instanceof Player
        })
        if(findGuy){
            if(findGuy.y > this.y){
                this.y += this.speed/2;
            }
            else{
                this.y -=this.speed/2;
            }
        }
        this.x-=this.speed;
    }
}

export class BadGuyShooter extends BadGuy {
    attackDelayCounter = 0;
    constructor(x:number,y:number){
        super(x,y);
 
        this.x = x;
        this.y = y;
    }
}

export class TinyEvilShip extends BadGuyShooter {
    speed = 3
    hp=10
    verticalDirection = 'top'
    horizontalDirection = 'left'
    attackDelayCounter = 0;

    constructor(x:number,y:number){
        super(x,y);
        this.texture = enemyShip;

        this.width = 40;
        this.height = 40;
        // this.rotation = -1.555;

        const hitBox = new Graphics()
        .rect(0, 0, 782,810)
        .fill('#ffffff55');


        const parentCenterX = this.width / 2;
        const parentCenterY = this.height / 2;

        hitBox.position.set(parentCenterX - hitBox.width / 2, parentCenterY - hitBox.height / 2);

        this.addChild(hitBox);
    }

    move(app?:Application, elements?:GameElement[]){
        if(!app){
            return;
        }
        if(this.attackDelayCounter > 0){
            this.attackDelayCounter -=1;
        }
        if(elements){
            defaultWeaponBad(app,elements,this)
        }
        if(this.x <= app.screen.width - 100){
            this.horizontalDirection = 'right'
        }

        if(this.y <= 10){
            this.verticalDirection = 'up'
        }
        else if(this.y >= app.screen.height - 20){
            this.verticalDirection = 'down'
        }

        if(this.horizontalDirection === 'left'){
            this.x -= this.speed;
        }

        if(this.verticalDirection === 'up'){
            this.y +=this.speed
        }
        else{
            this.y -= this.speed;
        }


    }
}

export class BadGuyBullet extends BadGuy {
    directionX: number = 1
    directionY: number = 0
    speed:number = -5
    constructor(x:number,y:number, directionX?:number, directionY?:number){
        super(x,y);
        this.texture = bulletTexture;
        this.width = 10;
        this.height = 15;
        this.rotation = 1.5;
        this.hp = 1;

        if(directionX){
            this.directionX = directionX
        }
        if(directionY){
            this.directionY = directionY;
        }
    }
    move(){
        this.x += this.speed * this.directionX;
        this.y += this.speed * this.directionY;
    }
}