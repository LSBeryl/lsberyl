interface iBlob{
    name:string
    blob:Blob;
    thum:Blob;
}

interface iList{
    id:string;
    index:string;
    name:string
    blob:string;
    thum:string;
}

interface iMusicList{
    [key:string]:{blob:Blob, thum:Blob}
}

interface iMusicPlayer{
    list:HTMLTableSectionElement;
    range:HTMLInputElement;
    time:HTMLElement;
    thum:HTMLElement;
    button:HTMLElement;
}

let nowNum:number

class MusicPlayer implements iMusicPlayer{
    arr:iList[] = [];
    list:HTMLTableSectionElement;
    range:HTMLInputElement; 
    time:HTMLElement;
    thum:HTMLElement;
    button: HTMLElement;
    audio = document.createElement('audio');
    cur:iList;
    constructor({list, range, time, button, thum}:iMusicPlayer){
        const audio = this.audio;
        this.list = list
        this.range = range
        this.time = time
        this.button = button
        this.thum = thum
        // list는 tbody 태그
        // range는 시간 조절
        // time은 시간
        // button은 음악 추가 버튼

        // 아래 코드 작성을 위해서 해당 링크를 찾아볼 것!!!
        // https://developer.mozilla.org/ko/docs/Web/HTML/Element/audio
            

        audio.addEventListener('canplaythrough', e => {
            range.max = String(audio.duration)
            audio.play()
            // 이 때는 audio.duration 을 사용해서 range의 max 값을 바꾼다.
        });

        audio.addEventListener('ended', e => {
            const nowTr = document.querySelector('.sel')

            nowTr.classList.remove('sel')
            nowTr.children[0].innerHTML = String(nowNum)
            if(nowNum >= this.arr.length){
                this.list.children[1].classList.add('sel')
                this.list.children[1].children[0].innerHTML = '⏩'
                nowNum = 1
            } else{
                nowTr.nextElementSibling.classList.add('sel')
                nowTr.nextElementSibling.children[0].innerHTML = '⏩'
                nowNum++
            }
            audio.src = this.arr[nowNum-1].blob
            this.thum.style.backgroundImage = `url(${this.arr[nowNum-1].thum})`
            audio.play()
            // 이 때는 다음 오디오를 적절하게 찾아서 재생한다.
        });

        button.addEventListener('click', e => {
            const arr:iMusicList = {};
            const file = document.createElement('input');
            file.type = 'file';
            file.multiple = true;
            file.addEventListener('input', e => {
                for(let v of file.files){
                    const test = v.name.slice(0, -4)
                    if(!arr[test]) arr[test] = {blob: null, thum: null}
                    if(v.type.includes('audio')){ 
                        arr[test].blob = v
                    } else if(v.type.includes('image')){
                        arr[test].thum = v
                    }
                    if(arr[test].blob && arr[test].thum || arr[test].blob){
                        const blobObj:iBlob = {
                            name: test,
                            blob: arr[test].blob,
                            thum: arr[test].thum
                        }
                        musics.push(blobObj)
                    }
                    // if(!arr[test].blob && arr[test].thum){
                    //     console.error('사진만 있음', arr[test], arr[test].thum)
                    // }
                }
                // files의 값들을 받아와서 arr에 적절하게 등록한다.
                // arr은 key가 음악 이름, value는 blob(음악)과 thum(이미지)인 객체이다.
                // key 값은 확장자명을 제외한 값이다. (예 music.mp3 X, music O)
                // type을 잘 판단하여 blob과 thum에 적절하게 넣어준다.
                // 잘 분류된 arr을 갖고, musics.push 메소드를 호출한다.
                // 만약 thum만 있는 경우에는 setThum을 호출한다.
            }, {once:true});
            file.click();
        });

        list.addEventListener('click', e =>{
            const tar = e.target as HTMLTableCellElement;
            if(tar.parentElement.nodeName == 'TR'){
                const tr = tar.parentElement as HTMLTableRowElement;
                this.select(tr)
            }
            // 적절한 tr 태그를 찾은 후 this.select를 호출한다.
        });

        range.addEventListener('input', e => {
            audio.currentTime = Number(range.value)
            // 음악 시간을 range.value로 맞춘다.
            // currentTime을 잘 사용
        });

        const play = () => {
            time.innerHTML = String(audio.currentTime.toFixed(2))
            range.value = String(audio.currentTime.toFixed(2))
            // 시간과 range.value를 음악 시간에 맞춘다.
            requestAnimationFrame(play);
        };

        play();
    }
    push(obj:iBlob){
        const index = String(this.list.children.length);
        const id = String(Math.random());
        const newObj:iList = {
            id,
            index,
            name: obj.name,
            blob: '',
            thum:'',
        };

        const tr = document.createElement('tr')
        const numtd = document.createElement('td')
        const maintd = document.createElement('td')
        const thumdiv = document.createElement('div')
        const nametd = document.createElement('td')
        newObj.blob = URL.createObjectURL(obj.blob)
        if(obj.thum){
            newObj.thum = URL.createObjectURL(obj.thum)
            thumdiv.style.backgroundImage = `url('${newObj.thum}')`
        } else{
            thumdiv.style.backgroundImage = '../img/Question_Mark.svg'
        }

        numtd.innerHTML = newObj.index
        numtd.dataset.num = newObj.index
        maintd.appendChild(thumdiv)
        nametd.innerHTML = newObj.name
        tr.dataset.id = newObj.id

        tr.appendChild(numtd)
        maintd.appendChild(thumdiv)
        tr.appendChild(maintd)
        tr.appendChild(nametd)
        this.list.appendChild(tr);
        this.arr.push(newObj)
        // blob과 thum은 URL.createObjectURL을 호출하거나 한다.
        // 이미지는 있는 경우 넣고 있지 않는 경우에는 넣지 않는다.

        // 적절하게 tr을 생성 후 list에 넣는다.

        // newObj도 this.arr에 넣는다.
    }
    select(tar:HTMLTableRowElement){
        const data = this.get(tar.dataset.id)
        const tr = document.querySelector(`tr[data-id="${data.id}"]`)

        if(tr.classList.contains('sel')){
            const pTr = document.querySelector('.sel')
            if(pTr.children[0].innerHTML == '⏸️'){
                pTr.children[0].innerHTML = '⏩'
                this.audio.play()
            } else{
                pTr.children[0].innerHTML = '⏸️'
                this.audio.pause()
            }
        } else{
            const pTr = document.querySelector('.sel')
            if(pTr){
                pTr.classList.remove('sel')
                Array.from(pTr.children).forEach((v:HTMLTableSectionElement, idx:number) =>{
                    if(idx == 0) v.innerHTML = String(v.dataset.num)
                })
            }
            tr.classList.add('sel')
            this.thum.style.backgroundImage = `url(${this.arr[Number(tr.children[0].innerHTML)-1].thum})`
            this.audio.src = `${this.arr[Number(tr.children[0].innerHTML)-1].blob}`
            nowNum = Number(tr.children[0].innerHTML)
            console.log(nowNum, this.arr[nowNum-1]);
            
            tr.children[0].innerHTML = '⏩'
        }
        // this.get을 호출하여 data를 얻는다
        // 선택한 tr태그를 이미 선택했었다면
            // 이미 재생중인 (audio.puased) 찾아보기 경우 pause 하고, 테이블의 맨 앞쪽을 ⏸️로 바꾼다.
            // 그렇지 않은 경우 play 하고, ⏩로 바꾼다.
        // 이미 선택하지 않았더라면
            // 그 전 선택한 tr을 찾아서 선택을 지운다.
            // 현재 선택한 tr을 sel을 추가하고, thum을 tr의 thum으로 바꾼다
            // 맨 앞쪽 테이블을 ⏩로 바꾸고 play한다.
    }
    get(id:string){
        let val:iList
        this.arr.forEach(v =>{
            if(v.id == id) val = v
        })
        return val
        // 해당 id를 갖고 있는 iList를 this.arr에서 찾는다.
    }
    setThum(name:string, thum:Blob){
        // 해당 name에 해당하는 data를 찾아서 thum을 바꾼다.
    }
}

const musics = new MusicPlayer({
    list: document.querySelector<HTMLTableSectionElement>('#list'), 
    range: document.querySelector<HTMLInputElement>('#range'), 
    time:document.querySelector<HTMLDivElement>('#time'),
    button: document.querySelector<HTMLButtonElement>('#file'),
    thum: document.querySelector<HTMLDivElement>('#thum')
});