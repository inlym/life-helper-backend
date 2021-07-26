import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class AddressInfo {
  /** 国家 */
  @Expose()
  nation: string

  /** 省 */
  @Expose()
  province: string

  /** 市 */
  @Expose()
  city?: string

  /** 区 */
  @Expose()
  district?: string

  /** 行政区划代码 */
  @Expose()
  adcode: string
}
