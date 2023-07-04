import { makeAutoObservable } from "mobx"
import { createContext } from "react"
import { Location as StoreLocation } from "./store"

export interface Location {
  envID?: number,
  locationID?: number,
  hint?: string,
  isActive: boolean,
  id: number
}

export class TestLocationsStore {
  locations: Location[] = []

  setLocations = (newLocations: Location[]) => {
    this.locations = newLocations
  }

  initializeStore = () => {
    this.addLocation()
  }

  addLocation = () => {
    this.locations.push({
      isActive: true,
      id: this.locations.length,
      hint: "",
      locationID: 1,
      envID: 1
    })
  }

  deleteLocation = (id: Location['id']) => {
    this.locations.filter(location => location.id === id)[0].isActive = false
  }

  // useLocationIDState = (storeLocation: StoreLocation | null): [StoreLocation | null, (arg: StoreLocation) => void] => {
  //   if (storeLocation) {
  //     const location = this.locations.filter(location => location.id === storeLocation.locationID)[0]
  //     return [
  //       location,
  //       (newLocation: StoreLocation) => {
  //         location.locationID = newLocation.locationID
  //       }
  //     ]
  //   }
  //   return [
  //     null,
  //     (newLocation: StoreLocation) => {}
  //   ]
  // }

  constructor() {
    makeAutoObservable(this)
  }
}

export const testLocationsStore = new TestLocationsStore()
export const testLocationsStoreContext = createContext(testLocationsStore)
export type TestLocationsStoreType = typeof testLocationsStore
