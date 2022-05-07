const inp = document.querySelector<HTMLInputElement>('#inp');
const but = document.querySelector<HTMLButtonElement>('#but');
const con = document.querySelector<HTMLDivElement>('#con');

const makeEvent = (num:number, tag:HTMLElement) => {
    con.appendChild(tag)
    tag.addEventListener('click', e =>{
        alert(num)
        num--
        if(num < 1) tag.remove()
    })
    
    // num 횟수에 따라서 fun을 실행하는 이벤트 생성
    // num 횟수만큼의 이벤트 실행후 tag 제거
    // num을 다른 곳에 할당하거나 기록하지 않는다!!!
};

but.addEventListener('click', e => {
    if(inp.validity.valid){
        const eBtn = document.createElement('button')
        eBtn.innerHTML = '버튼'
        makeEvent(Number(inp.value), eBtn)
        // inp.value을 makeEvent에 인자로
        // 버튼을 makeEvent의 생성 후 con에 할당
    }
});