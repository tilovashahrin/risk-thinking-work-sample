import { useEffect } from 'react'
import React from 'react'

type DecadeProps = {
    year: string,
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

function Map({ year, data }: DecadeProps) {
    const filteredData = data.length > 0 ? data.filter((row) => row.Year === year) : []

    useEffect(() => {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBQLTNy0Edygh5y3EcSoTcoVU_hX165GaM`
        script.async = true
        script.onload = () => {
            const mapElement = document.getElementById('map')
            if (mapElement) {
                const map = new window.google.maps.Map(mapElement, {
                    center: { lat: 56.1304, lng: -106.3468 },
                    zoom: 3.5,
                })
                // Loop through the filtered data and add a marker for each location
                filteredData.forEach((row) => {
                    const lat = parseFloat(row.Lat)
                    const lng = parseFloat(row.Long)
                    const marker = new window.google.maps.Marker({
                        position: { lat: lat, lng: lng },
                        map: map,
                        title: row["Asset Name"],
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            strokeColor: getMarkerIcon(row["Risk Rating"]),
                            scale: 5
                        },
                    })

                    const infoWindow = new window.google.maps.InfoWindow({
                        content: `<h3>${row["Asset Name"]}</h3><p>Risk Rating: ${row["Risk Rating"]}</p>`,
                      });
            
                      marker.addListener("mouseover", () => {
                        infoWindow.open(map, marker);
                      });
            
                      marker.addListener("mouseout", () => {
                        infoWindow.close();
                      });
                })
            }
        }
        document.head.appendChild(script)
    }, [filteredData])

    return (
        <div id="map" style={{ height: '400px', width: '800px' }} />
    )
}

function getMarkerIcon(riskRating: string): string {
    const rating = parseFloat(riskRating)

    if (rating > 0.01 && rating < 0.34) {
        return 'green'
    }
    if (rating > 0.34 && rating < 0.67) {
        return 'yellow'
    }
    if (rating > 0.67 && rating < 0.99) {
        return 'red'
    }
    return ''
}

export default Map
