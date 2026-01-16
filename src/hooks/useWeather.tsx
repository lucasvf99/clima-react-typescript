import axios from "axios"
// z objeto principal
import {z} from 'zod'
import type { SearchType } from "../types"
import { useMemo, useState } from "react"


// Zod, armamos nuestro schema, tenemos que armar tal cual la respuesta que esperamos de la api 
const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_max: z.number(),
    temp_min: z.number()
  })
})

//armamos nuestro type 
export type Weather = z.infer<typeof Weather>

// type  Weather = InferOutput<typeof WeatherSchema>
const initialState = {
        name: '',
        main: {
          temp: 0,
          temp_min: 0,
          temp_max: 0
        }
    }

export default function useWeather() {
    const [weather, setWeather] = useState<Weather>(initialState)
    const [loading, setLoading] = useState(false)
    const [notFound, setNotFound] = useState(false)

    
    const fetchWeather = async (search: SearchType) => {
        const appId = import.meta.env.VITE_API_KEY
        try {
          
          const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=
          ${search.city},${search.country}&appid=${appId}`
          setLoading(true)
          setWeather(initialState)

          const {data} = await axios(geoUrl)

          //Comprobar si existe 
          if(!data[0]){
            setNotFound(true)
          }
          const lat = data[0].lat
          const lon = data[0].lon

          const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`
         
          //ZOD
         
          const {data: weatherResult} = await axios(weatherUrl)
          const result = Weather.safeParse(weatherResult) // toma el resultado y la revisa, sus propiedades si es asi retorna true 
          if(result.success ) {
            setWeather(result.data)
          }else{
            console.log(result.error)
          }


        } catch (error) {
            console.log(error)  
        }finally{ // se ejecuta cuando termina la peticion 
          setLoading(false)
        }
    }

    const hasWeatherData = useMemo(() => weather.name ,[weather])

  return{
    weather,
    loading,
    notFound,
    fetchWeather,
    hasWeatherData
  }
}
