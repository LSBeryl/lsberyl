const inp = document.querySelector<HTMLInputElement>('#inp');
const con = document.querySelector<HTMLDivElement>('#con');
const time = document.querySelector<HTMLSpanElement>('#time');
const bomb = document.querySelector<HTMLSpanElement>('#bomb');
const button = document.querySelector<HTMLSpanElement>('#stop');

const set = () => new Promise(res => {
    setTimeout(res, 10);
});

function addEvent<K extends keyof HTMLElementEventMap>(target:HTMLElement, type: K):Promise<HTMLElementEventMap[K]>;
function addEvent(target:HTMLElement, type: string): Promise<Event>{
    return new Promise(res => {
        target.addEventListener(type, res, {once:true});
    });
};

(async()=>{
    while(true){
        const val = Number(inp.value)
        const evt = await addEvent(inp, 'keyup')
        if(inp.validity.valid && evt.key === 'Enter'){
            con.classList.remove('noshow')
            inp.classList.add('noshow')
            bomb.innerHTML = '💣'
            time.innerHTML = String(val)
            let click = addEvent(button, 'click');
            while(true){
                const data = await Promise.race([set(), click]);
                if(data instanceof Event){
                    time.innerHTML = '폭탄 제거 완료!!!'
                    button.classList.add('end')
                    break;
                } else{
                    if(Number(time.innerHTML) > 0){
                        time.innerHTML = String((Number(time.innerHTML) - 0.01).toFixed(2))
                    } else{
                        time.innerHTML = '폭탄 제거 실패;;;'
                        bomb.innerHTML = '💥'
                        button.classList.add('end')
                        break;
                    }
                }
            }
            await addEvent(button, 'click')
            inp.value = ''
            button.classList.remove('end')
            con.classList.add('noshow')
            inp.classList.remove('noshow')
        }
    }
})();