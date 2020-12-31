import axios from 'axios'
import {Feature} from '@/types'

export function getFeatures() {
  //Feature[] 类型数组 即该泛型是由Feature类型构成的数组
  return axios.get<Feature[]>('/api/list')
}