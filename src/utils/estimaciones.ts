import { distanciaRuta, distanciasAcumuladas } from './geo'
import { VELOCIDAD_KMH } from '../constants/mapa'

export function estimarEspera(
    paradaIndex: number,
    waypoints: [number, number][],
    numCamiones: number  // ← ahora viene de la ruta real, no de la constante
) {
    const totalKm = distanciaRuta(waypoints)
    const acum = distanciasAcumuladas(waypoints)
    const distParada = acum[paradaIndex]

    // Tiempo en horas que tarda un camión en dar una vuelta completa
    const vueltaHoras = totalKm / VELOCIDAD_KMH
    const vueltaMin = vueltaHoras * 60

    // Intervalo entre camiones (distribuidos uniformemente en la ruta)
    const intervaloMin = vueltaMin / numCamiones

    // Posición actual de cada camión basada en el reloj real
    // Usamos Date.now() en minutos para que avancen con el tiempo
    const ahora = (Date.now() / 1000 / 60) % vueltaMin

    // Posición de la parada en minutos dentro del recorrido
    const posParadaMin = (distParada / totalKm) * vueltaMin

    // Para cada camión, calcular cuándo llega a esta parada
    let menorEspera = Infinity

    for (let i = 0; i < numCamiones; i++) {
        // Cada camión sale con un offset fijo (distribuidos uniformemente)
        const offsetCamion = (vueltaMin / numCamiones) * i
        const posCamionMin = (ahora + offsetCamion) % vueltaMin

        // Minutos hasta que este camión llega a la parada
        let espera = posParadaMin - posCamionMin
        if (espera < 0) espera += vueltaMin

        if (espera < menorEspera) menorEspera = espera
    }

    const minutos = Math.max(1, Math.round(menorEspera))

    const label =
        minutos <= 2 ? '🟢 Llegando' :
            minutos <= 7 ? '🟡 Pronto' :
                '🔴 En camino'

    return { minutos, label }
}