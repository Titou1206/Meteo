// La méthode Geolocation.getCurrentPosition() fournit la position actuelle de l'appareil.
// on applique la methode sur le navigateur qui prend la fonction position comme argument
navigator.geolocation.getCurrentPosition(position => {
    // sur l'objet position on recupere la latitude et la longitude 
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // appel de la fonction fetch via la fonction url
    // asynchrone : tant que les données ne sont pas disponibles la suite n'est pas executé
    meteoLocale(latitude, longitude);
});

/** recupération des données open meteo via fonction fetch/json
* @param {number} latitude 
* @param {number} longitude 
*//*
function urlPosition(latitude, longitude) { 
    console.log(longitude)// recuperation des données au format json
fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code,temperature_2m,precipitation,is_day,snowfall,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=weather_code,temperature_2m,rain,cloud_cover,wind_speed_80m,wind_direction_80m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,snowfall_sum&timezone=auto`)
.then (response=>{
    return response.json()
})
.then (response=>{
    shwo(response);
})
}*/
/*
    let urlCommune = `https://geo.api.gouv.fr/communes?lat=${latitude}&lon=${longitude}&fields=code,nom,codesPostaux,surface,population,centre,contour`;
    fetch(urlCommune)
    .then(res=>{
      return res.json()
    })
    .then(rep=>{
      console.log(rep[0]);
      addVille(rep[0].nom,rep[0].code)
    })*/



// récupération des infos de l'API météo
//const url = "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=weather_code,temperature_2m,precipitation,is_day,snowfall,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=weather_code,temperature_2m,rain,cloud_cover,wind_speed_80m,wind_direction_80m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,snowfall_sum&timezone=auto"

//récupération des infos de l'url de l'API
function meteoLocale(latitude, longitude){
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code,temperature_2m,precipitation,is_day,snowfall,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=weather_code,temperature_2m,rain,cloud_cover,wind_speed_80m,wind_direction_80m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,snowfall_sum&timezone=auto`)
    .then(infosMeteo=>{
        console.log(infosMeteo);
        return infosMeteo.json();
    })
    .then(meteo=>{
        console.log(meteo);
        appliMeteo(meteo);
        codePostal(latitude, longitude);
    })
}

function codePostal(latitude, longitude){
    fetch(`https://geo.api.gouv.fr/communes?lat=${latitude}&lon=${longitude}&fields=code,nom,codesPostaux,surface,population,centre,contour`)
    .then(retour=>{
        return retour.json();
    })
    .then(rep=>{
        console.log(rep);
        afficheCP(rep[0]);
    })
}

// fonction affiche le code postal
function afficheCP(e){
    let lieu = document.querySelector(".lieu");
    lieu.innerHTML = `<p class="font32 mr20">${e.nom} (${e.code})</p>`;
}


//récupération des zones date et heure
let datezone = document.querySelector(".date");
let heurezone = document.querySelector(".heure");

//création limite jour/nuit
let jourDebut = new Date();
jourDebut.setHours(7,0,0);
let jourFin = new Date();
jourFin.setHours(19,0,0);

let pictoJourNuit = document.querySelector(".picto-jour-nuit");

//fonction dynamique des zones date et heure
function afficheDate(){
    //récupération de la date
    let D = new Date();
    //stockage date et heure dans 2 variables
    let date = D.toLocaleDateString();
    let time = D.toLocaleTimeString();
    //affichege des variables dates et heures dans leurs zones d'affichage respective
    datezone.innerHTML = `<p>${date}</p>`;
    heurezone.innerHTML = `<p>${time}</p>`;
    //compare l'heure aux limites jour/nuit et modifie le picto en fonction
    if(D >= jourDebut && D < jourFin){
        pictoJourNuit.classList.add("jour")
    }else{
        pictoJourNuit.classList.add("nuit")
    }
    // fonction qui rend l'affichage dynamique et change les infos en direct quand elles changent
    requestAnimationFrame(afficheDate);
}
//lancement de la fonction afficheDate
afficheDate()
/*
//récupération des infos de l'url de l'API
fetch(url)
.then(infosMeteo=>{
    console.log(infosMeteo);
    return infosMeteo.json();
})
.then(meteo=>{
    console.log(meteo);
    appliMeteo(meteo)
})*/

function appliMeteo(meteo){
    afficheTemperatureCurrent(meteo.current)
    afficheVitesseCurrent(meteo.current)
    tempsActu(meteo.current)
    affiche24h(meteo.hourly)
    affiche10j(meteo.daily)
    affichePluie(meteo.current)
}

//affiche la température
function afficheTemperatureCurrent(meteo){
    //récupère la zone où afficher la température
    let tempsTemperature = document.querySelector(".temps-temperature");
    tempsTemperature.innerText = `${meteo.temperature_2m} °C`;
}

//affiche vitesse du vent
function afficheVitesseCurrent(meteo){
    //récupère la zone où afficher la vitesse
    let vitesse = document.querySelector(".vent-vitesse");
    let arrow = document.querySelector(".arrow");
    //modifie le texte à afficher
    vitesse.innerText = `${meteo.wind_speed_10m} km/h`;
    arrow.style.transform = `rotate(${meteo.wind_direction_10m}deg)`
}

// fonction qui récupère le weather code et retourne la valeur temps correspondante
function returnTemps(weather_code){
    let tempsLue = "";
    if(weather_code === 0){
        tempsLue = "sun";
        return tempsLue;
    }else if(weather_code === 1 || weather_code === 2){
        tempsLue = "suncloud";
        return tempsLue;
    }else if(weather_code === 3 || weather_code >= 45 && weather_code <= 57){
        tempsLue = "cloud";
        return tempsLue;
    }else if(weather_code >= 61 && weather_code <= 67 || weather_code >= 80 && weather_code <= 82){
        tempsLue = "rain";
        return tempsLue;
    }else if(weather_code >= 95 && weather_code <= 99){
        tempsLue = "thunder";
        return tempsLue;
    }else if(weather_code >= 71 && weather_code <= 77 || weather_code === 85 && weather_code === 86){
        tempsLue = "snow";
        return tempsLue;
    }
}

// fonction change fond ecran
function tempsActu(meteo){
    // récupère les zone à modif : container pour le back image + .temps texte + le picto à modif
    let backImg = document.querySelector(".container");
    let tempsTexte = document.querySelector(".temps-texte");
    let tempsPicto = document.querySelector(".picto-temps");
    // j'appelle la fonction retourne temps et stock le retpour dans variable
    let tempsLue = returnTemps(meteo.weather_code);
    // j'applique le retour aux zones a modif
    backImg.classList.add("back-"+tempsLue);
    tempsPicto.classList.add(tempsLue);
    tempsTexte.innerText = `${tempsLue}`;
}

//fonction creationcarte meteo 24h
function affiche24h(meteo){
    // récupération de la date actuelle
/*    let dateTest = new Date();
    // récupération de l'heure
    let timeTest = dateTest.toLocaleTimeString();
    // decoupe l'heure dans un tableau
    let tableauTime = timeTest.split(":");
    // récupère l'heure dans une variable
    let heure = parseInt(tableauTime[0]);
    console.log(typeof heure)
*/    // récupère la div où on va mettre nos slides
    let slides24h = document.getElementById("slides24h");
    //boucles for à partir de l'heure actuelle, jusque 24H en + et  ttes les heures
    for(let i = 0; i < 24; i++){
        //j'ajoute ma carte temps pour chaque élément du tableau
        slides24h.innerHTML += `<div class="prevision24h slide glassmorph direction-column">
            <div class="prevision24h-temps flex align-center">
                <div class="micro-picto thermometre"></div>
                <p class="prevision24h-texte font14 color">${meteo.temperature_2m[i]} °C</p>
            </div>
            <div class="prevision24h-pluie flex align-center">
                <div class="micro-picto parapluie"></div>
                <p class="prevision24h-texte font14 color">${meteo.rain[i]} mm</p>
            </div>
            <p class="prevision24h-heure font14 color">${i}h00</p>
        </div>`;
    }
}

//fonction pour afficher meteo à 6 jour
function affiche10j(meteo){
    // récupère la div où on va mettre nos slides
    let slides10j = document.getElementById("slides10j");
    //boucle for à partir de j+1 jusqu'au 7e jour
    for(let i = 1; i < 7; i++){
        //récupère la valeur du temps
        let tempsLue = returnTemps(meteo.weather_code[i]);
        //j'ajoute ma carte temps pour chaque élément du tableau
        slides10j.innerHTML += `<div class="prevision10j slide glassmorph direction-column">
        <p class="prevision10j-date bold font18 color">${meteo.time[i]}.</p>
        <div class="picto10j mini-${tempsLue}"></div>
        <p class="prevision10j-t-max bold font18 color">${meteo.temperature_2m_max[i]} °C</p>
        <p class="prevision10j-t-min font14 color">${meteo.temperature_2m_min[i]} °C</p>
    </div>`;
    }
}

//récupére la précipitation en direct
function affichePluie(meteo){
    let pluieText = document.querySelector(".pluie-texte");
    pluieText.innerText = `${meteo.precipitation} mm`;
}