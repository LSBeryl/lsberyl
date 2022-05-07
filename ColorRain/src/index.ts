class RainManage{
    // Rain의 인스턴스들을 묶음으로 관리해주는 클래스
    par:HTMLElement
    rain:Rain[] = []
    constructor(par:HTMLElement){
        // par는 기록
        this.par = par
    }
    add(rain:Rain){
        rain.i.classList.add(`c${Math.floor(Math.random() * 4)}`)
        this.rain.push(rain)
        // rain을 arr에 추가하는 코드
        // par에도 추가해야됨
        // class를 c0 ~ c3을 count에 따라 추가함
        // count를 사용
    }
    nextAll(){
        this.rain.forEach(r =>{
            r.next()
            if(r.posY >= 100){
                this.par.innerHTML = ''
                this.rain.splice(this.rain.indexOf(r), 1)
            }
            this.par.appendChild(r.i)
        })
        // arr에서 next를 모두 실행해줌
        // 만약 posY가 넘은 것이 있다면 제거
    }
}

class Rain{
    // Rain과 관련된 document와 각종 값들 기록
    i:HTMLElement = document.createElement('i')
    size:number
    posX:number
    posY:number = 0
    duration:number
    constructor(size:number, posX:number, duration:number){
        this.size = size + 0.2
        this.posX = posX
        this.duration = duration
        this.i.style.width = `${this.size}px`
        this.i.style.left = `${this.posX}px`
        // size는 받은 값에 0.2를 더한 값을 width로 해줌
        // left에 posX 값만큼
        // duration은 기록
    }
    next(){
        this.posY += this.duration
        this.i.style.transform = `translateY(calc(${this.posY}vh + ${2 * this.posY}px))`
        // posY 값이 계속 증가 (duration 개수만큼 증가해서 0 ~ 100까지 증가)
        // 그 값을 transform에 반영함 0 ~ 100vh + 200px
    }
}

const arr = new RainManage(document.querySelector('body'));

function rain() {
    const amount = 5;
    for(let i = 0; i < 3; i++){
        arr.add(new Rain(Math.random() * 5 + 1, Math.floor(Math.random() * innerWidth), innerHeight / 400))
    }
    arr.nextAll()
    // 매번 3개씩 rain을 arr에 추가
    // 매번 nextAll을 실행
    requestAnimationFrame(rain);
}

rain();