import { useContext, useEffect } from "react";

import { observer } from "mobx-react-lite";
import { store, storeContext } from "./store";

import Select from "./Select";
import { testLocationsStoreContext, Location as TestLocation } from "./testLocationsStore";
import formStyles from './TestLocationForm.module.css'
import formListStyles from './TestLocationsList.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faTrashCan, faVial, faPlus, faTerminal, faServer, faQuestion, faLeaf, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { runInAction } from "mobx";


export default function App() {
  return (
    <div className="App">
      <TestLocationsList />
    </div>
  );
}

interface TestLocationFormProps {
  id: number,
  options: typeof store,
  localStore: TestLocation,
  deleteLocation: () => void,
}

const TestLocationForm = observer(function TestLocationForm({
  id,
  options,
  localStore, 
  deleteLocation
}: TestLocationFormProps) {
  if (!options.isLoaded) {
    return <div>Данные не загружены</div>;
  }

  return (
    <form className={formStyles.form}>
      <div className={formStyles.topRow}>
        <FontAwesomeIcon icon={faVial} size="2x"/>
        <h2>Тестовая локация {id}</h2>
        <button 
          className={formStyles.deleteButton}
          onClick={(e) => {
            e.preventDefault()
            deleteLocation()
          }}
        >
          <FontAwesomeIcon icon={faTrashCan} color="red" size="lg"/>
        </button>
      </div>
      <div className={formStyles.gridContainer}>
        <div className={formStyles.gridCell}>
          <label className={formStyles.label}>Локация</label>
          <div className={formStyles.controlElementWithIconContainer}>
            <Select
              className={`
                ${formStyles.locationField} 
                ${formStyles.select} 
                ${formStyles.withIcon}
              `}
              state={localStore.locationID}
              setState={value => runInAction(() => localStore.locationID = value.locationID)}
              options={options.locations}
            />
            <FontAwesomeIcon icon={faLocationDot} className={formStyles.faIcon} />
            <FontAwesomeIcon icon={faCaretDown} className={formStyles.faDropdownIcon}/>
          </div>
        </div>
        <div className={formStyles.gridCell}>
          <label className={formStyles.label}>Среда</label>
          <div className={formStyles.controlElementWithIconContainer}>
            <Select
              className={`
                ${formStyles.locationField} 
                ${formStyles.select} 
                ${formStyles.withIcon}
              `}
              state={localStore.envID}
              setState={value => runInAction(() => localStore.envID = value.envID)}
              options={options.envs}
            />
            <FontAwesomeIcon icon={faLeaf} className={formStyles.faIcon}/>
            <FontAwesomeIcon icon={faCaretDown} className={formStyles.faDropdownIcon}/>
          </div>
        </div>
        <div className={formStyles.gridCell}>
          <label className={formStyles.label}>Серверы</label>
          <div className={`${formStyles.locationField} ${formStyles.displayedField}`}>
            <FontAwesomeIcon icon={faServer}/>
            <p className={formStyles.serversParagraph}> 
              {options.servers
                .filter(server => server.locationID === localStore.locationID && server.envID === localStore.envID)
                .map(server => server.name)
                .join(", ")
              }
            </p>
          </div>
        </div>
        <div className={`${formStyles.hint} ${formStyles.gridCell}`}>
          <label className={formStyles.label}>Подсказка</label>
          <div className={formStyles.controlElementWithIconContainer}>
            <input 
              className={`
                ${formStyles.locationField} 
                ${formStyles.input} 
                ${formStyles.withIcon}
              `}
              placeholder="Комментарий по локации"
              value={localStore.hint}
              onChange={e => runInAction(() => localStore.hint = e.target.value)}
            ></input>
            <FontAwesomeIcon icon={faQuestion} className={formStyles.faIcon}/>
          </div>
        </div>
      </div>
    </form>
  );
});

const TestLocationsList = observer(() => {
  const { locations, addLocation, deleteLocation, initializeStore } = useContext(testLocationsStoreContext)
  const optionsStore = useContext(storeContext)

  useEffect(() => {
    (async () => {
      await optionsStore.fetchData()
    })()
  }, [optionsStore])
  
  useEffect(() => {
    initializeStore()
  }, [initializeStore])
  
  return (
    <div className={formListStyles.formContainer}>
      {locations.filter(location => location.isActive).map(location => (
        <TestLocationForm 
          key={location.id} 
          id={location.id}
          options={optionsStore}
          localStore={location}
          deleteLocation={() => deleteLocation(location.id)}
        />
      ))}
      <button
        className={`${formListStyles.button} ${formListStyles.addLocationButton}`}
        onClick={() => {
          addLocation();
        }}
      >
        <FontAwesomeIcon icon={faPlus} size="2x"></FontAwesomeIcon>
        <span>Добавить тестовую локацию</span>
      </button>
      <button
        className={`${formListStyles.button} ${formListStyles.printToConsoleButton}`}
        onClick={() => {
          console.log(
            locations
              .filter(location => location.isActive)
              .map(location => ({
                locationID: location.locationID,
                envID: location.envID,
                hint: location.hint
              }))
          );
        }}
      >
        <FontAwesomeIcon icon={faTerminal} size="lg"></FontAwesomeIcon>
        <span>Вывести результат в консоль</span>
      </button>
    </div>
  );
});
