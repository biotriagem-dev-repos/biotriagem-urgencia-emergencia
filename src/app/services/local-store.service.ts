import { isPlatformBrowser } from '@angular/common'
import { Inject, Injectable, PLATFORM_ID } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class LocalStoreService {
  private ls: Storage | null = null

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.ls = window.localStorage
    }
  }

  public setItem(key: string, value: string) {
    if (this.ls) {
      value = JSON.stringify(value)
      this.ls.setItem(key, value)
      return true
    }
    return false // Ou lance um erro, se preferir
  }

  public getItem(key: string) {
    if (this.ls) {
      const value = this.ls.getItem(key) || ''
      try {
        return JSON.parse(value)
      } catch (e) {
        return null
      }
    }
    return null // Ou lance um erro, se preferir
  }

  public clear() {
    this.ls?.clear()
  }
}
