/*
    절대 이벤트를 쓰면 안된다!
    만약 이벤트를 쓴다면 addEvent Promise를 써야한다.
*/

interface Data{
    down:number;
    map?:number[];
}

function addEvent<K extends keyof HTMLElementEventMap>(target:EventTarget, type: K):Promise<HTMLElementEventMap[K]>;
function addEvent(target:EventTarget, type: string): Promise<Event>{
    return new Promise(res => {
        target.addEventListener(type, res, {once:true});
    });
}

function get4Place(_rot:number){
    const rot = _rot % 360;
    if(rot === 0) return 0;
    else if(rot < 90) return 1;
    else if(rot === 90) return 2;
    else if(rot < 180) return 3;
    else if(rot === 180) return 4;
    else if(rot < 270) return 5;
    else if(rot === 270) return 6;
    else return 7;
}

/*
    down속성은 해당 키를 눌렀는 지에 대한 여부
    map 속성은 해당 키를 눌렀을 때 어느 방향으로 돌지에 대한 get4Place의 맵이다.
*/
const keyMap = new Map<string,Data>([
    ['ArrowUp', {down:0, map:[-1, -1, 0, 1, 1, 1, 0, -1]}],
    ['ArrowDown', {down:0, map:[1, 1, 0, -1, -1, -1, 0, 1]}],
    ['ArrowLeft', {down:0, map:[0, 1, 1, 1, 0, -1, -1, -1]}],
    ['ArrowRight', {down:0, map:[0, -1, -1, -1, 0, 1, 1, 1]}],
    [' ', {down:0}]
]);

const barrel = document.querySelector<HTMLDivElement>('#barrel');
const container = document.querySelector<HTMLDivElement>('#container');
const body = document.querySelector('body');
let rot = 270

function main(){
    /*
        barrel의 현재 회전 각도를 0 ~ 360으로 표현한 값으로 받는다.
        그 후 get4Place 함수를 사용해 keyMap의 map 속성과 함께 적절한 다음 회전 각도를 구한다.
        Math.sign 함수 사용
        그 회전 각도를 barrel에 적절히 저장한다.
        barrel에 회전 계산식은 `translateY(-50%) rotate(${회전}deg)` 이다.
    */
    let key = ''
    Array.from(keyMap).forEach(v =>{
        if(v[1].down === 1) key = v[0]
    })
    if(key.includes('Arrow')) rot += keyMap.get(key).map[get4Place(rot)]
    barrel.style.transform = `translateY(-50%) rotate(${rot}deg)`
    for(let bullet of Array.from(container.children) as HTMLDivElement[]){
        /*
            bullet은 15씩 움직인다.
            만약 innerHeight, innerWidth에 100 을 더한 값보다 현재 총알이 여행한 거리가 더 크면 bullet을 지운다.
            bullet에 대한 계산식은 `translate(-50%, -50%) rotate(${현재회전}}deg) translateX(${다음거리}px)` 이다.
        */
        bullet.dataset.x = String(Number(bullet.dataset.x) + 15)
        bullet.style.transform = `translate(-50%, -50%) rotate(${bullet.dataset.deg}deg) translate(${bullet.dataset.x}px)`
        if(Number(bullet.dataset.x) > innerHeight + 100 && Number(bullet.dataset.x) > innerWidth + 100){
            bullet.remove()
        }
    }

    if(keyMap.get(' ').down === 1){
        /* 
            Space를 눌렀을 때이므로 먼저 down을 0으로 바꿔준다.
            그리고 bullet class를 가진 div를 생성 후 container에 넣어준다.
            bullet에 현재 barrel의 회전 각도를 어딘가에 저장한다.
            bullet의 transform 계산식은 `translate(-50%, -50%) rotate(${회전}}deg) translateX(${총위치}px)` 이다.
            만약 원한다면 audio 태그를 생성해서 gun.wav파일을 사용해 소리를 내게 할 수도 있다.
        */
        keyMap.get(' ').down = 0
        const bullet = document.createElement('div');
        bullet.classList.add('bullet')
        bullet.dataset.deg = `${rot}`
        bullet.dataset.x = '0'
        bullet.style.transform = `translate(-50%, -50%) rotate(${rot}deg) translateX(${bullet.dataset.x}px)`
        container.appendChild(bullet)
    }

    requestAnimationFrame(main);
}

main();

(async()=>{
    while(true){
        /*
            keyMap 객체에 있는 key 값의 키를 눌렀을 때 down 속성을 바꾼다.
            만약 keydown일 경우 1로, keyup일 경우 0으로 바꾼다.
            evt.repeat 속성은 false일 때만 실행한다.
        */
        let evt = await Promise.race([addEvent(body, 'keydown'), addEvent(body, 'keyup')])
        let key = evt.key
        if(keyMap.get(key)){
            if(evt.type === 'keydown') keyMap.get(key).down = 1
            else if(evt.type === 'keyup') keyMap.get(key).down = 0
        }
    }
})();