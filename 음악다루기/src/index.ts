// https://developer.mozilla.org/ko/docs/Web/HTML/Element/audio

/*
    쓰인 audio 메소드
        play
        pause

    쓰인 audio 속성
        paused
        duration
        currentTime
        playbackRate
    쓰인 이벤트
        canplaythrough
        ended
*/
const file = document.querySelector<HTMLInputElement>('#file');
const audio = document.querySelector<HTMLAudioElement>('audio');
const butCon = document.querySelector<HTMLButtonElement>('#but-con');
const playButton = document.querySelector<HTMLButtonElement>('#play');
const total = document.querySelector<HTMLSpanElement>('#total');
const time = document.querySelector<HTMLSpanElement>('#time');
const inp = document.querySelector<HTMLInputElement>('#inp');
const playback = document.querySelector<HTMLSelectElement>('#playback')

for(let i = 0.25; i <= 4; i += 0.25){
    const option = document.createElement('option');
    option.innerHTML = String(i);
    option.value = String(i);
    playback.appendChild(option);
}

playback.value = '1';

playback.addEventListener('input', e => {
    audio.playbackRate = Number(playback.value)
    // 오디오 속도 바꾸기
});

file.addEventListener('input', e => {
    if(file.files[0] && file.files[0].type.includes('audio')){
        URL.revokeObjectURL(audio.src)
        audio.src = URL.createObjectURL(file.files[0])
    }
    // 그전 오디오 지우고, 다시 오디오 등록
    // 오디오만 등록
});

playButton.addEventListener('click', e => {
    if(audio.paused) audio.play()
    else audio.pause()
    // 일시정지인 상태면 재생
    // 재생상태면 일시 정지
});

audio.addEventListener('canplaythrough', e => {
    const tl = audio.duration.toFixed(2)
    total.innerHTML = tl
    inp.max = tl
    time.innerHTML = '0.00'
    inp.value = '0.00'
    playButton.classList.add('pause')
    butCon.classList.remove('ready')
    // 오디오 재생 준비 하기
    // butCon ready 클래스 없애기
});

inp.addEventListener('input', e => {
    audio.currentTime = Number(inp.value)
    // audio 시간 바꾸기
});

audio.addEventListener('ended', e => {
    audio.play()
    // 끝나면 다시 재생
});


const play = () => {
    const tl = audio.currentTime.toFixed(2)
    time.innerHTML = tl
    inp.value = tl
    if(audio.paused) playButton.classList.add('pause')
    else playButton.classList.remove('pause')
    // 실시간 시간 기록
    // time과 inp에 기록
    requestAnimationFrame(play);
};

play();