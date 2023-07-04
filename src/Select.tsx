import { FC } from "react"


interface SelectProps {
  className?: string,
  state: any,
  setState: React.Dispatch<React.SetStateAction<SelectProps["state"]>>,
  options: SelectProps["state"][]
}

const Select: FC<SelectProps> = ({ className, state, setState, options }) => {
  return (
    <select 
      className={className} 
      onChange={e => {
        setState(options.find(option => option.name === e.target.value))
      }}
      value={state.name}
    >
    {options.map(option => (
      <option key={option.name}>{option.name}</option>
    ))}
  </select>
  )
}

export default Select