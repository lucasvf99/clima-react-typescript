import styles from './Form.module.css'
import { countries } from '../../data/countries'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { SearchType } from '../../types'
import Alert from '../Alert/Alert'

type FormProps = {
  fetchWeather: (search: SearchType) => Promise<void>;
}

export default function Form({fetchWeather}: FormProps) {

  const [search, setSearch] = useState<SearchType>({
    city: '',
    country: ''
  })

  const [alert, setAlert] = useState('')

  const handelChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
     //escribimos sobre el estado
      setSearch({
        //tomamos una copia 
        ...search,
        [e.target.name] : e.target.value
      })
  }

  const handelSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      //validamos que los campos no esten vacios
      if(Object.values(search).includes('')){
          setAlert('Todos los campos son obligatorios')
      }  

      fetchWeather(search)
  }   

  return (
    <form  
      className={styles.form}
      onSubmit={handelSubmit}
    >
      {/* si hay alguna alerte   renderizamos el componente Alert */}
      {alert && <Alert>{alert}</Alert>}
      
        <div className={styles.field}>
            <label htmlFor="city">Ciudad</label>
            <input 
              type="text" 
              name="city" 
              id="city" 
              placeholder='Ciudad'
              value={search.city}
              onChange={handelChange}
              />
        </div>
 
        <div className={styles.field}>
            <label htmlFor="country">Pais</label>
            <select
              id="country"
              value={search.country}
              name='country'
              onChange={handelChange}
              >
                <option value="">-- Seleccione un Pais --</option>
                {countries.map(country => (
                <option 
                  value={country.code}
                  key={country.code}
                >{country.name}</option>
            ))}
            </select>
        </div>

          <input className={styles.submit} type="submit" value={'Consultar Clima'} />
    </form>
  )
}
