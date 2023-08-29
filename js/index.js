// * ===========> Html Elements
const carsInHtml = document.querySelector(".forecast-cards")
const searchBox = document.getElementById("searchBox")
const allBars = document.querySelectorAll(".clock")
const cityInHtml = document.querySelector(".city-items")
const clearAll = document.getElementById('clearAll')
const moodSwitch = document.querySelector(".mood-switch")
const img =  moodSwitch.querySelector("img")
const descMood =  moodSwitch.querySelector("p")
const root = document.documentElement;
let activeCard = document.querySelector('.forecast-cards .card.active')



// * ===========> App Variables
const apiKey = `cc6f55aa9ac3469ba8a131502232608`
let recentCities = JSON.parse(localStorage.getItem('cities')) ||[]

// * ===========> Functions 
// todo:get weather From Api
async function getWeather(city){
const res =  await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`)
if(res.status !=200 && searchBox.value !=''){
searchBox.value=""
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Invalid input. Please check and try again'
      })
      return
    } 
const data = await res.json()
displayWeather(data)
searchBox.value=""
}
//todo:get location from geolocation
function getCurrentLocation(){
    navigator.geolocation.getCurrentPosition(sussess,error)
}
function sussess(position){
    const CurrentLocation=`${position.coords.latitude},${position.coords.longitude}`  ;
    getWeather(CurrentLocation)
    }
function error(){
    const defaultLocation = "cairo"
    getWeather(defaultLocation)
    }
//todo:display Weather
function displayWeather(data){
    const days = data.forecast.forecastday
    let weatherHtml=""
    let now = new Date()
    for(let [index,day] of days.entries()){
        let date = new Date(day.date)
    weatherHtml+=`
    <div class="card ${index==0 ?"active" : ""}" data-index=${index}>
    <div class="card-header">
      <div  class="day">${date.toLocaleDateString('en-us',{weekday:'long'})}</div>
      <div class="time">${now.getHours()>12 ? now.getHours()-12 :now.getHours()}:${now.getMinutes()} ${now.getHours() > 12?"PM":"AM"}</div>
    </div>
    <div class="locationDesc">
    <i class="fa-solid fa-location-dot"></i>
    <p class="country"><span class="fw-bold">${data.location.name}</span>,${data.location.country}</p>
    </div>
    <div class="card-body">
      <img src="../images/conditions/${day.hour[now.getHours()].condition.text}.svg"/>
      <div class="degree">${day.hour[now.getHours()].temp_c}C°</div>
    </div>
    <div class="card-data">
      <ul class="left-column">
        <li>Real Feel: <span class="real-feel">${day.hour[now.getHours()].feelslike_c}C°</span></li>
        <li>Wind: <span class="wind">${day.hour[now.getHours()].wind_mph}Mph</span></li>
        <li>Pressure: <span class="pressure">${day.hour[now.getHours()].pressure_mb}Mb</span></li>
        <li>Humidity: <span class="humidity">${day.hour[now.getHours()].humidity}%</span></li>
      </ul>
      <ul class="right-column">
        <li>Sunrise: <span class="sunrise">${day.astro.sunrise}</span></li>
        <li>Sunset: <span class="sunset">${day.astro.sunset}</span></li>
      </ul>
    </div>
  </div>
    `
    }
    carsInHtml.innerHTML = weatherHtml
    //todo:set and remove active card
    const cards = document.querySelectorAll('.card')
    for(let card of cards){(
        card.addEventListener('click',(e)=>{
            const activeCard =document.querySelector('.card.active')
            activeCard.classList.remove('active')
            e.currentTarget.classList.add('active')
            displayRainInfo(days[e.currentTarget.dataset.index])
           
        }))
    }

    let exist = recentCities.find((city)=>{
        return city.city == data.location.name
    })
    if(exist != undefined) return
    // Add cities in local storage
    recentCities.push({city:data.location.name,country:data.location.country})
    localStorage.setItem("cities",JSON.stringify(recentCities))

    getCityImg(data.location.name,data.location.country)
}
// todo:display Rain info
function displayRainInfo(targetDay){
    for(let bar of allBars){
        const height =targetDay.hour[bar.dataset.clock].chance_of_rain
        bar.querySelector(".percent").style.height =`${height}%`
    }
    




}

//todo:get imges for countries from api
async function getCityImg(city,country){
const res = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${city}&client_id=maVgNo3IKVd7Pw7-_q4fywxtQCACntlNXKBBsFdrBzI&per_page=5&orientation=landscape`)
const data = await res.json()
displayCityImg(data.results,city,country)
}

//todo:display cities imges
function displayCityImg(data,city,country){
const randomNumber =Math.trunc(Math.random()*data.length)
let  imgSrc = data[randomNumber].urls.regular
let imgesHtml=`
<div class="item">
<div class="city-image">
  <img src="${imgSrc}" alt="Image for ${city} city" />
</div>
<div class="city-name"><span class="city-name">${city}</span>, ${country}</div>
</div>
`
cityInHtml.innerHTML +=imgesHtml

}

// todo:delete all cities with button
function clearAllCities(){
localStorage.removeItem("cities");
recentCities.splice(0)
    cityInHtml.innerHTML = ""; // Clear the city elements in the DOM
}


//todo:Chang moode to light and dark
let  savedMood = localStorage.getItem("moodPreference");
function switchMood(){
if(descMood.innerHTML== "Light Mood"){
      img.setAttribute('src',"images/darkMood.png")
        descMood.innerHTML= "Dark Mood"
        root.style.setProperty("--light-black", "#6187b8");
        root.style.setProperty("--dark-black", "#a7a7ff");
        root.style.setProperty("--light-yellow", "#3d6faf");
        root.style.setProperty("--dark-yellow", "#254978");
        root.style.setProperty("--light-white", "#f1f1f1");
        root.style.setProperty("--mid-gray", "#737377");
        root.style.setProperty("--color-card-active", "#fff");
        root.style.setProperty("--color-input", "#6187b8");
        root.style.setProperty("--scroll-bar", "#6187b8");
        root.style.setProperty("--btn-clear-color", "#fff");
        localStorage.setItem("moodPreference", "dark");

}else{
    img.setAttribute('src',"images/lightMood.png")
    descMood.innerHTML= "Light Mood"
    root.style.setProperty("--light-black", "#2a2a2a");
    root.style.setProperty("--dark-black", "#101014");
    root.style.setProperty("--light-yellow", "#f6d58e");
    root.style.setProperty("--dark-yellow", "#e3bb62");
    root.style.setProperty("--light-white", "#f1f1f1");
    root.style.setProperty("--mid-gray", "#737377");
    root.style.setProperty("--color-card-active", "#000");
    root.style.setProperty("--color-input", "#2a2a2a");
    root.style.setProperty("--scroll-bar", "#222");
    root.style.setProperty("--btn-clear-color", "#000");
    localStorage.setItem("moodPreference", "light");

}
}
function checkMoode(){
    if(savedMood == "dark"){
        img.setAttribute('src',"images/darkMood.png")
        descMood.innerHTML= "Dark Mood"
        root.style.setProperty("--light-black", "#6187b8");
        root.style.setProperty("--dark-black", "#a7a7ff");
        root.style.setProperty("--light-yellow", "#3d6faf");
        root.style.setProperty("--dark-yellow", "#254978");
        root.style.setProperty("--light-white", "#f1f1f1");
        root.style.setProperty("--mid-gray", "#737377");
        root.style.setProperty("--color-card-active", "#fff");
        root.style.setProperty("--color-input", "#6187b8");
        root.style.setProperty("--scroll-bar", "#6187b8");
        root.style.setProperty("--btn-clear-color", "#fff");

    }else{
        img.setAttribute('src',"images/lightMood.png")
        descMood.innerHTML= "Light Mood"
        root.style.setProperty("--light-black", "#2a2a2a");
        root.style.setProperty("--dark-black", "#101014");
        root.style.setProperty("--light-yellow", "#f6d58e");
        root.style.setProperty("--dark-yellow", "#e3bb62");
        root.style.setProperty("--light-white", "#f1f1f1");
        root.style.setProperty("--mid-gray", "#737377");
        root.style.setProperty("--color-card-active", "#000");
        root.style.setProperty("--color-input", "#2a2a2a");
        root.style.setProperty("--scroll-bar", "#222");
    root.style.setProperty("--btn-clear-color", "#000");

    }
}
checkMoode()



// * ===================================> Events
window.addEventListener('load',()=>{
    getCurrentLocation()
    for (let i = 0; i < recentCities.length; i++) {
        getCityImg(recentCities[i].city,recentCities[i].country)
    }
})
// todo:Events to display country with searchbox
document.addEventListener('keydown',(e)=>{
    if(e.key == "Enter" ){
        getWeather(searchBox.value)
    }
})
searchBox.addEventListener("blur",()=>{
    if(searchBox.value !=""){
        getWeather(searchBox.value)
    }
    return
})

// todo:delete all cities with button
clearAll.addEventListener('click',clearAllCities)
// todo:chang mood to dark and light
moodSwitch.addEventListener('click',switchMood)