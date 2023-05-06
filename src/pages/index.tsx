import ReactSelectCreatable from 'react-select/creatable'
import Map from './map'
import Table from './table'
import { useEffect, useState } from "react"

type CsvRow = {
  "Asset Name": string
  Lat: string
  Long: string
  "Business Category": string
  "Risk Rating": string
  "Risk Factors": string
  Year: string
}

const decadeOptions = Array.from({ length: 6 }, (_, i) => ({ value: 2020 + (i * 10), label: `${2020 + (i * 10)}` }));

export default function Home() {
  const [data, setData] = useState<Array<CsvRow>>([])
  const [selectedDecade, setSelectedDecade] = useState<number>(0)

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/data')
      const csvData = await response.json()
      setData(csvData)
    }
    fetchData()
  }, [])

  const handleChange = (option: { value: number; label: string; } | null) => {
    if (option) {
      setSelectedDecade(option?.value)
    } else {
      setSelectedDecade(0)
    }
  }

  return <>
    <div className="grid gap-4 ">
      <div className='grid justify-items-start'>
        <h1 className="font-semibold text-slate-900">Choose which decade</h1>
        <ReactSelectCreatable
          isClearable
          options={decadeOptions}
          value={selectedDecade ? { value: selectedDecade, label: selectedDecade.toString() } : null}
          onChange={handleChange}
        />
      </div>
      <Map year={selectedDecade.toString()} data={data} />
      <Table year={selectedDecade.toString()} data={data}/>
    </div>
  </>
}
