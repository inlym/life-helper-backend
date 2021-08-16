export interface AllDiaryListItem {
  content: string

  list: Array<{ type: 'video' | 'image'; url: string }>

  date: {
    year: string
    month: string
    day: string
  }
}
