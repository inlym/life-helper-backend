import { EntityRepository, Repository } from 'typeorm'

import { WeatherCity } from './weather-city.entity'

@EntityRepository(WeatherCity)
export class WeatherCityRepository extends Repository<WeatherCity> {}
