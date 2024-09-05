
console.log('welcome to js');

let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


// function how to get all songs from fetch api
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let lis = div.getElementsByTagName("li");
    songs = [];
    for (let index = 0; index < lis.length; index++) {
        let link = lis[index].getElementsByTagName("a")[0];
        if (link && link.href.endsWith("mp3")) {
            songs.push(link.href.split(`/${folder}/`)[1]);
        }
    }

    // show all the songs in playlist
    let songsUL = document.querySelector(".songsLists").getElementsByTagName("ul")[0];
    songsUL.innerHTML = ""
    for (const song of songs) {
        songsUL.innerHTML = songsUL.innerHTML + `<li>
      <img class="invert" src="Svgs/music.svg" alt="">
      <div class="info">
      <div>${decodeURIComponent(song)}</div>
      <div>Achal Rana</div>
      </div>
      <div class="playnow">
      <span>Play Now</span>
      <img class="invert"src="Svgs/playbtn.svg" alt="">
      </div>
                          </li>`
    }
    // attach an event listner to each song
    Array.from(document.querySelector(".songsLists").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());

        })


    })

return songs;


}
const playMusic = (track, pause = false) => {
    currentSong.src = (`/${currFolder}/` + track);
    if (!pause) {
        currentSong.play();
        play.src = "svgs/pause.svg";
     
        


    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track);
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
    document.querySelector(".songInfo-2").innerHTML = decodeURI(track);
  
}


  // get the only folder name from songs album
async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("li");
         
    
     let cardContainer = document.querySelector(".cardContainer")
     let array =Array.from(anchors)
     for (let index = 0; index < array.length; index++) {
        let e = array[index].getElementsByTagName("a")[0]; 
        if (e.href.includes("/songs")) {
             let folder = (e.href.split("/").slice(-2)[1].replaceAll("%20"," "));
             console.log(folder);
             
            
            // get the meta data of each folder from json
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            let response = await a.json();
            cardContainer.innerHTML =  cardContainer.innerHTML + `<div data-folder=${folder} class="card" id="card-1">
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <div class="play-button">
                            <div class="play-icon"></div>
                        </div>
                        <span>${response.title}</span>
                        <p>${response.description}</p>
                    </div>`
            
        }
     
    }





   // Load the playlist whenever card is clicked
   Array.from(document.getElementsByClassName("card")).forEach(e => { 
    e.addEventListener("click", async item => {
        console.log("Fetching Songs")
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
        playMusic(songs[0])

    })
})

}


async function main() {
    //get the all songs from list
    await getSongs("songs/nocrsongs");
    playMusic(songs[0], true);

    //display all the album on the page dynamically

    await displayAlbums()

    // add an event listner to play button
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "svgs/pause.svg"
             
        }
        else {
            currentSong.pause();
            play.src = "svgs/playbtn.svg"
        }
    })



    // add an event listener to mobile in play1
    play1.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play1.src = "svgs/pause.svg"
        }
        else {
            currentSong.pause();
            play1.src = "svgs/playbtn.svg"
        }
    })


    //listen to time update event listener
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

    })

    // add an event listener to seekbar

    document.querySelector('.seekbar').addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100

    })
    // add  an event listener to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })


    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-140%";
    })

    // add an event listener to previous button

    previous.addEventListener("click", () => {
        console.log('previous clicked');
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        if ((index - 1) > 0) {
            playMusic(songs[index - 1]);

        }

    })


    // add an event listener to next button

    next.addEventListener("click", () => {
        currentSong.pause();
        console.log('next clicked');



        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);

        }




    })
    // add an event listener to next button

    next1.addEventListener("click", () => {
        currentSong.pause();
        console.log('next clicked');



        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);

        }

    })
    // add  event to volume
    document.querySelector('.range').getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("seeting volume to", e.target.value, "/100");

        currentSong.volume = parseInt(e.target.value) / 100;

    })
      // add an event listener to volume svg
        document.querySelector(".volume img").addEventListener("click",e=>{
          
          if(e.target.src.includes("volume.svg")){
              e.target.src = e.target.src.replace("volume.svg","mute.svg")
              currentSong.volume = 0;
              document.querySelector('.range').getElementsByTagName("input")[0].value =0;
          }
          else {
            e.target.src = e.target.src.replace("mute.svg","volume.svg")
                currentSong.volume =.10;
                document.querySelector('.range').getElementsByTagName("input")[0].value = 10;
          }
          
        })

      // add event listener for search button
        document.querySelector(".search-1").addEventListener("click" ,(e)=>{
            console.log('search btn is clicked');
               document.querySelector(".search-2").style.top =0;
          
        })

        


}
main();




