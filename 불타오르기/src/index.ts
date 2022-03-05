const makeFire = (x:number, y:number) => {
    const fire = document.createElement('div')
    document.body.appendChild(fire)
    fire.style.left = `${x}px`
    fire.style.top = `${y}px`
    fire.classList.add('fire')
    // fire의 객체는 strong, life, way, fire의 속성으로 이루어져 있다.
    // life는 불이 성장 주기이다. 처음은 0이었다가 way에 따라서 strong까지 커지고, 다시 0까지 작아진다.
    // way는 life가 성장하는 방향이다. (1)
    // strong은 life의 최대값이다. (100으로 설정)
    // fire는 실제 div 태그이다.
    // fire 태그는 body 태그에 추가되며, fire라는 class를 추가해야한다.
    return {
        strong: 100,
        life: 0,
        way: 1,
        fire: fire
    }
}

const fires = new Set([makeFire(innerWidth / 2, innerHeight / 2)]);

// box-shadow의 값들
// size, color
// 참고 : https://developer.mozilla.org/ko/docs/Web/CSS/box-shadow
const arr:[number, string][] = [
    [2, 'yellow'],
    [10, 'orange'],
    [20, 'orangered']
];

document.body.onclick = e => {
    fires.add(makeFire(e.clientX, e.clientY));
};

const main = () => {
    for(let fire of Array.from(fires)){
        fire.life += fire.way
        if(fire.strong < fire.life){
            fire.way = -1
        } else if(fire.life <= 0){
            fires.delete(fire)
            fire.fire.remove()
            continue;
        }
        fire.fire.style.width = `${30 * fire.life / fire.strong}px`
        fire.fire.style.height = `${30 * fire.life / fire.strong}px`
        fire.fire.style.transform = `translate(-50%, -50%) rotate(calc(${10 * Math.random() - 5}deg - 45deg))`
        fire.fire.style.boxShadow = arr.map(v => `${v[0] / 2 * fire.life / fire.strong}px -${v[0] / 2 * fire.life / fire.strong}px 0px ${(v[0] + 6 * Math.random() - 3) * fire.life / fire.strong}px ${v[1]}`).join(',')
        // fires는 항상 반대로 순회한다.
        // fire.life는 fire.way 만큼 증가한다.
        // fire.way는 fire.strong보다 fire.life가 커질 때 바뀐다.
        // fire.life가 다시 0이 되면 fires에서와 태그에서 fire를 삭제한다.
        // fire는 fire.life에 따라 크기가 0 ~ 30 만큼 커졌다가 다시 작아진다.
        // fire는 매번 -45deg 돌아간 상태에서 -5 ~ 5 만큼의 추가 오차로 돌아간다.
        // fire의 shadow의 모든 값은 fire.life에 따라 크기가 0퍼에서 100퍼까지 바뀐다.
        // 위의 퍼센트는 CSS의 값이 아님
        // box-shadow의 x, y위치는 v[0] / 2 * fire.life / fire.strong. (주의 위치는 적절히 선정)
        // size는 (v[0] + 6 * Math.random() - 3) * fire.life / fire.strong.
    }
    requestAnimationFrame(main);
};

main();