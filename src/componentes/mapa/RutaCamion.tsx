import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-routing-machine'

type Props = {
    waypoints: [number, number][]
    color: string
}

export default function RutaCamion({
    waypoints,
    color,
}: Props) {
    const map = useMap()

    const controlRef = useRef<L.Control | null>(null)

    useEffect(() => {
        const latLngs = waypoints.map(([lat, lng]) =>
            L.latLng(lat, lng)
        )

        const routingControl = L.Routing.control({
            waypoints: latLngs,
            createMarker: () => null,
            draggableWaypoints: false,
            addWaypoints: false,
            routeWhileDragging: false,
            show: false,

            lineOptions: {
                styles: [
                    {
                        color,
                        weight: 7,
                        opacity: 0.9,
                    },
                ],
            },
        }).addTo(map)

        controlRef.current = routingControl

        return () => {
            if (controlRef.current) {
                map.removeControl(controlRef.current)
            }
        }
    }, [map, waypoints, color])

    return null
}