const electron = require('electron');
const {shell} = require('electron');
const ipc = electron.ipcRenderer;
const axios = require('axios');

global.pageNow = 1;
async function getFilms(page,query, type) {
    
    var req = axios.get('https://videocdn.tv/api/'+type+'?api_token=jvbY6usny3y4hgcEvc51TPNunRRsPMms&ordering=created&direction=asc&page='+page + '&query=' + query).then((response)=>{
        var json = response.data;
        document.querySelector('.films-block').innerHTML = "";
        document.querySelector('.tally-wrapper').style.display = 'block';
        json.data.forEach((entry) => {
            var filmdiv = document.createElement('div');
            filmdiv.id = "filmdiv";
            filmdiv.className = 'col-sm-12 p-2 box';
            var image = document.createElement('img');
            var filmname = document.createElement('b');
            var filmwatch = document.createElement('button');
            filmwatch.classList.add('btn');
            filmwatch.classList.add('btn-filmery');
            filmwatch.innerHTML = '<i class="bi bi-play"></i>';
            filmwatch.setAttribute('onclick', 'OpenFilm(this)');
            let src = entry.iframe_src;
            filmwatch.dataset.frame =  src.replace("//", "https://");
            filmwatch.dataset.name =  entry.ru_title;
            filmwatch.dataset.bsToggle =  "modal";
            filmwatch.dataset.bsTarget =  "#exampleModal";
            filmname.innerText = entry.ru_title  ;
            filmname.className = 'text-white';
            image.setAttribute('src', 'https://st.kp.yandex.net/images/sm_film/'+entry.kinopoisk_id+'.jpg')
            image.className = 'image-filmery'
            filmdiv.append(image);
            filmdiv.append(filmname);
            filmdiv.append(filmwatch);
            
            document.querySelector('.films-block').append(filmdiv);

        });
    }).then( ()=>{
        document.querySelector('.tally-wrapper').style.display = 'none';
    });
  }

  function prev(){
      
      if (global.pageNow > 1){
        global.pageNow -= 1;
        if (document.location.href.includes('series.html')){
            getFilms(global.pageNow, '', 'tv-series')
        }
        if (document.location.href.includes('index.html')){
        getFilms(global.pageNow, '', 'movies')
        }
        if (document.location.href.includes('anime.html')){
        getFilms(global.pageNow, '', 'animes')
        }
        document.querySelector('#nowpage').innerText = global.pageNow;
      }
      
      
  }

  function next(){
    global.pageNow += 1;
    if (document.location.href.includes('series.html')){
      getFilms(global.pageNow, '', 'tv-series')
    }
    if (document.location.href.includes('index.html')){
      getFilms(global.pageNow, '', 'movies')
    }
    if (document.location.href.includes('anime.html')){
      getFilms(global.pageNow, '', 'animes')
    }
    document.querySelector('#nowpage').innerText = global.pageNow;
}

  function openBrowser(url, ev){
    ev.preventDefault();
    shell.openExternal(url);
  }

function OpenFilm(e){

    document.querySelector('#exampleModal .modal-body').innerHTML = "<iframe src=\""+e.dataset.frame+"\" width=\"100%\" height=\"100%\" frameborder=\"0\" allowfullscreen></iframe>";
    document.querySelector('#exampleModal .modal-title').innerHTML = '<b>'+e.dataset.name + '</b>';
}



document.addEventListener('DOMContentLoaded', () => {
    
    document.querySelector('.close').addEventListener('click', ()=>{
        ipc.send('close-btn', true);
    })
    document.querySelector('.minimize').addEventListener('click', ()=>{
        ipc.send('minimize-btn', true);
    })
    document.querySelector('.maximize').addEventListener('click', ()=>{
        ipc.send('maximize-btn', true);
    })
    if (document.location.href.includes('index.html')){
        getFilms(1, '', 'movies');
        document.querySelector('#search').addEventListener('input', (event)=>{
            getFilms(1, event.target.value, 'movies');
        });
    }
    

    if (document.location.href.includes('series.html')){
        getFilms(1, '', 'tv-series');
        document.querySelector('#search').addEventListener('input', (event)=>{
            getFilms(1, event.target.value, 'tv-series');
        });
    }
    if (document.location.href.includes('anime.html')){
        getFilms(1, '', 'animes');
        document.querySelector('#search').addEventListener('input', (event)=>{
            getFilms(1, event.target.value, 'animes');
        });
    }
    
    var myModal = document.getElementById('exampleModal')
    myModal.addEventListener('hide.bs.modal', function () {
        document.querySelector('#exampleModal .modal-body').innerHTML = ""
    }) 
});