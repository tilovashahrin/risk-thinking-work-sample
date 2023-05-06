import React, { useEffect } from 'react'
import { useState } from "react"
import ReactSelectCreatable from 'react-select/creatable'

type DecadeProps = {
    year: string
    data: Array<CsvRow>
}

type CsvRow = {
    "Asset Name": string
    Lat: string
    Long: string
    "Business Category": string
    "Risk Rating": string
    "Risk Factors": string
    Year: string
}

const riskFactorOptions = [
    { value: 'Earthquake', label: 'Earthquake' },
    { value: 'Extreme heat', label: 'Extreme heat' },
    { value: 'Hurricane', label: 'Hurricane' },
    { value: 'Wildfire', label: 'Wildfire' },
    { value: 'Volcano', label: 'Volcano' },
    { value: 'Drought', label: 'Drought' },
    { value: 'Extreme cold', label: 'Extreme cold' },
    { value: 'Flooding', label: 'Flooding' },
    { value: 'Sea level rise', label: 'Sea level rise' },
]

function Table({ year, data }: DecadeProps) {
    const filteredData = data.length > 0 ? data.filter((row) => row.Year === year) : []
    const [sortedData, setSortedData] = useState(filteredData)
    const [selectedRiskFactor, setSelectedRiskFactor] = useState('')
    const [selectedRiskValue, setSelectedRiskValue] = useState<number | undefined>()

    const handleChange = (option: { value: string } | null) => {
        if (option) {
            setSelectedRiskFactor(option?.value)
        } else {
            setSelectedRiskFactor('')
        }
    }

    const handleRiskChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(event.target.value)
        setSelectedRiskValue(isNaN(value) ? undefined : value)
    }

    useEffect(() => {
        if (selectedRiskFactor && selectedRiskValue !== undefined) {
            setSortedData(filteredData.sort((a, b) => a['Asset Name'].localeCompare(b['Asset Name'])))
            return
        }
        setSortedData(
            filteredData.filter(row => {
                const riskFactors = row['Risk Factors'] as unknown as Record<string, number>
                return riskFactors[selectedRiskFactor as keyof typeof riskFactors] === Number(selectedRiskValue)
            })
        )
    }, [filteredData, selectedRiskFactor])

    return (
        <>
            <div>
                <h1 className="font-semibold text-slate-900">Choose which risk factor</h1>
                <ReactSelectCreatable
                    isClearable
                    options={riskFactorOptions}
                    value={selectedRiskFactor ? { value: selectedRiskFactor, label: selectedRiskFactor } : null}
                    onChange={handleChange}
                />
                <h1 className="font-semibold text-slate-900">Value</h1>
                <input type="number"
                    step="0.01"
                    min="0.01"
                    max="0.9"
                    value={selectedRiskValue ?? ''} onChange={handleRiskChange} />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Asset Name</th>
                        <th>Lat</th>
                        <th>Long</th>
                        <th>Business Category</th>
                        <th>Risk Rating</th>
                        <th>Risk Factors</th>
                        <th>Year</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((row) => (
                        <tr key={row['Asset Name']}>
                            <td>{row['Asset Name']}</td>
                            <td>{row.Lat}</td>
                            <td>{row.Long}</td>
                            <td>{row['Business Category']}</td>
                            <td>{row['Risk Rating']}</td>
                            <td>{row['Risk Factors']}</td>
                            <td>{row.Year}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default Table