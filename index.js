const API_KEY="ae4055a7ba28a97b2bf312397179e1b4"
// async function showweather(){
//     let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=${API_KEY}`)
//     const data=await response.json()
    
//     let newelem=document.createElement('p')
//     newelem.textContent=`${data?.main?.temp.toFixed(2)}deg c`
//     document.body.appendChild(newelem)
// }


//now making weather app
const userloc=document.querySelector('.tab1')
const searchloc=document.querySelector('.tab2')
const weatherinfo=document.querySelector('.weather-info')
let grantloc=document.querySelector('.grant-location-container')
let searchweather=document.querySelector('.search-weather')
let loadingscreen=document.querySelector('.loading-screen')
let showweather=document.querySelector('.show-weather')
let currentTab=userloc
currentTab.classList.add('current-tab')
getStoredData()
function changeTab(getTab){
    if(currentTab!==getTab){
        currentTab.classList.remove('current-tab')
        currentTab=getTab
        currentTab.classList.add('current-tab')
        if(!searchweather.classList.contains('active')){
            grantloc.classList.remove('active')
            showweather.classList.remove('active')
            searchweather.classList.add('active')
        }
        else{
            searchweather.classList.remove('active')
            showweather.classList.remove('active')
            getStoredData()
        }
    }
}

userloc.addEventListener('click',()=>{
    changeTab(userloc)
})
searchloc.addEventListener('click',()=>{
    changeTab(searchloc)
})

function getStoredData(){
    const stored=sessionStorage.getItem('saved-coord')
    if(!stored){
        grantloc.classList.add('active')
    }
    else{
        let storage=JSON.parse(stored)
        assignweather(storage)
    }
}

async function assignweather(coords){
    // const {lat,lon}=coords    this is also a way to define multiple variables 
    const lat=coords.lat
    const lon=coords.lon
    grantloc.classList.remove('active')
    loadingscreen.classList.add('active')
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        const data=await response.json()
        loadingscreen.classList.remove('active')
        showweather.classList.add('active')
        renderweatherinfo(data)
    }
    catch(err){
        //hw
    }
}

function renderweatherinfo(info){
    const cityName=document.querySelector('[city-name]')
    const cFlag=document.querySelector('[country-icon]')
    const cTemp=document.querySelector('[temp-desc]')
    const iWeather=document.querySelector('[weather-icon]')
    const temp=document.querySelector('[data-temperature]')
    const windspeed=document.querySelector('[data-windSpeed]')
    const cloud=document.querySelector('[data-clouds]')
    const humidity=document.querySelector('[data-humidity]')

    //assigning them
    cityName.innerText=info?.name
    cFlag.src=`https://flagcdn.com/144x108/${info?.sys?.country.toLowerCase()}.png`
    cTemp.innerText=info?.weather?.[0]?.description
    iWeather.src=`http://openweathermap.org/img/w/${info?.weather?.[0]?.icon}.png`;
    let tempo=info?.main?.temp
    temp.innerText=`${(tempo-273).toFixed(2)} °C`
    windspeed.innerText=`${info?.wind?.speed}m/s`
    cloud.innerText=`${info?.clouds?.all}%`
    humidity.innerText=`${info?.main?.humidity}%`
}

function showposition(coordinate){
    const userCoordinates={
        lat: coordinate.coords.latitude,
        lon: coordinate.coords.longitude,
    }
    sessionStorage.setItem('saved-coord',JSON.stringify(userCoordinates))
    assignweather(userCoordinates)
}
function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition)
    }
    else{
        alert('Location Support Not Found')
    }
}
const grantAccess=document.querySelector('[data-grant]')
grantAccess.addEventListener('click',getlocation)

async function fetchWeather(){
    let city_name=searchTerm.value
    loadingscreen.classList.add('active')
    showweather.classList.remove('active')
    let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_KEY}`)    
    let data=await response.json()
    loadingscreen.classList.remove('active')
    showweather.classList.add('active')
    renderweatherinfo(data)
}
let searchTerm=document.querySelector('[search-tab]')
let searchButton=document.querySelector('.search-button')
searchButton.addEventListener('click',fetchWeather)