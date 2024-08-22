import { useEffect, useState } from 'react';
import './App.css';
import clearsky from "/src/assets/clearsky.png";
import cloudy from "/src/assets/cloudy.png";
import foggy from "/src/assets/foggy.png";
import overcast from "/src/assets/overcast.png";
import partlycloudy from "/src/assets/partlycloudy.png";
import raining from "/src/assets/raining.png";
import snowing from "/src/assets/snowing.png";
import thunderandlightning from "/src/assets/thunderandlightning.png";

function App() {
  const [text,settext] = useState("puducherry");
  const [emoji,setemoji] = useState();
  const [temp,settemp] = useState();
  const [description,setdescription] = useState();
  const [city,setcity] = useState();
  const [country,setcountry] = useState();
  const [lat,setlat] = useState();
  const [lon,setlon] = useState();
  const [windspeed,setwindspeed] = useState();
  const [humidity,sethumidity] = useState();
  const [loading,setloading] = useState(false);
  const [citynotfound,setcitynotfound] = useState(false);
function cityhandler(event){
  const value = event.target.value;
  settext(value);
}

const getweatherdata = (async ()=>{
  try{
    
    setloading(true);
    const apikey = `6c43ffcd4313229ad5dd96c12f0630de`
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apikey}&units=Metric`;
    const data = await fetch(url).then((response) => response.json());
    if(data.cod == "404"){
      setcitynotfound(true);
      return;
    }
    else{
      setcitynotfound(false);
    }
    setcity(data.name);
    setcountry(data.sys.country)
    settemp(data.main.temp);
    setdescription(data.weather[0].description);
    setlon(data.coord.lon.toFixed(2));
    setlat(data.coord.lat.toFixed(2));
    sethumidity(data.main.humidity);
    setwindspeed(data.wind.speed);
    const weatherid = data.weather[0].id;
    
    switch(true){
      case weatherid >= 200 && weatherid < 300:
        setemoji(thunderandlightning);
        break;
      case weatherid >=300 && weatherid < 600:
        setemoji(raining);
        break;
      case weatherid >= 600 && weatherid <=700:
        setemoji(snowing);
        break;
      case weatherid >=701 && weatherid < 800:
        setemoji(foggy);
        break;
      case weatherid == 800:
        setemoji(clearsky);
        break;
      case weatherid == 801:
        setemoji(cloudy);
        break;
      case weatherid == 802:
        setemoji(partlycloudy);
        break;
      case weatherid == 803 || weatherid == 804:
        setemoji(overcast);
        break;
    }
    
    console.log(data.weather[0].id);
  } 
  catch(error){
    console.error(error);
    setloading(true);
    setcitynotfound(true);
  }
  finally{
    setloading(false);
  }
})
function pressenter(event){
  if(event.key === "Enter"){
    getweatherdata();
  }
}
useEffect(()=>{
    getweatherdata();
  },[])
  return (
    <>
    <div className='App-container'>
      <div className='searchbar'>
      <input onKeyDown={pressenter} value={text} onChange={cityhandler} className='cityinput' type="text"  placeholder='Enter City Name'/>
      <img onClick={getweatherdata} style={{width:"30px"}} className='searchicon' src="src/assets/searchicon.png" alt="" />
      </div>
      {loading && <p style={{color:"black"}}>please wait loading...</p>}
      {citynotfound && <h1>search city not found</h1>}
      {!loading && !citynotfound && <WeatherData emoji={emoji} city={city} temp={temp} 
      description={description} lat={lat} lon={lon} humidity={humidity}
      windspeed={windspeed} loading={loading} country={country}
      />}
    </div>
    </>
  )
};

const WeatherData = ({emoji,city,country,temp,description,lat,lon,windspeed,humidity})=>{
  return <>
  <div className='weatherdata'>
      <img style={{width:"200px"}} src={emoji} alt="" />
      <p className='description'>{description}</p>
      <p className='temp'>{Math.floor(temp)}℃</p>
      <h1 className='city'>{city}</h1>
      <h2 className='country'>{country}</h2>
      <div className='latlon'>
        <div>
        <p>latitude</p>
        <p>{lat}</p>
        </div>
        <div>
        <p>longitude</p>
        <p>{lon}</p>
        </div>
        
      </div>
      <div className='HW-data'>
        <div className='humidity'>
          <img width={"120px"} src="src/assets/humidity.png" alt="" />
          <p>{humidity} %</p>
          <p>Humidity</p>
        </div>
        <div className='windspeed'>
          <img width={"120px"} src="src/assets/windspeed.png" alt="" />
          <p>{windspeed} Km/h</p>
          <p>Wind Speed</p>
        </div>
      </div>
  </div>
  </>
}

export default App
