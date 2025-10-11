import React, { useEffect, useState } from 'react'
import { getEveryStatus } from '../connectToDB'
import ReturnButton from "../FComponents/ReturnButton";

export default function ManagerStats() {

    const [statusDetails, setStatusDetails] = useState([])
    const [productStats, setProductStats] = useState([])
    const [averageByDestination, setAverageByDestination] = useState([])
    const [totalAverage, setTotalAverage] = useState([])


    const getDurationInSeconds = (status) => {
        const start = new Date(status.previousTime);
        const end = new Date(status.time);

        // Vérifie si les dates sont valides (par exemple, si la chaîne d'entrée était corrompue)
        if (isNaN(start) || isNaN(end)) {
            return null;
        }
        const duration_ms = end - start;
        const duration_seconds = Math.floor(duration_ms / 1000);
        return duration_seconds;
    }

    const formatDuration = (totalSeconds) => {
        if (totalSeconds === null || isNaN(totalSeconds)) return 'N/A';

        // S'assurer que nous travaillons avec un entier
        totalSeconds = Math.round(totalSeconds);

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        let result = '';
        if (minutes > 0) {
            result += `${minutes} min `;
        }
        result += `${seconds} sec`;

        return result.trim();
    }

    const calculateAveragePerStatus = (productsStats) => {
        if (!productsStats || productsStats.length === 0) {
            return [];
        }

        // Récupérer le nombre de statuts (basé sur le premier produit)
        const numStatutes = productsStats[0].averageDurations.length;
        const numProducts = productsStats.length;

        // Tableau pour stocker la somme des durées pour chaque statut (index 0 = Statut 1, etc.)
        const statusSums = new Array(numStatutes).fill(0);

        // --- 1. Accumuler les sommes par statut ---
        productsStats.forEach(product => {
            product.averageDurations.forEach((duration, index) => {
                // S'assurer que la durée est un nombre avant d'ajouter
                if (typeof duration === 'number') {
                    statusSums[index] += duration;
                }
            });
        });

        // --- 2. Calculer la moyenne et formater ---
        const averageResults = statusSums.map((sum, index) => {
            const averageSeconds = sum / numProducts;

            return {
                statusCode: index + 1, // L'index 0 correspond au Statut 1
                averageTime: averageSeconds
            };
        });

        return averageResults;
    }

    const calculateAverageByDestination = (products) => {
        // Grouper les produits par destination
        const groupedByDestination = products.reduce((acc, product) => {
            const dest = product.productDestination;
            if (!acc[dest]) {
                acc[dest] = [];
            }
            acc[dest].push(product.averageDurations);
            return acc;
        }, {});

        // Calculer les moyennes pour chaque destination
        const result = Object.keys(groupedByDestination).map(destination => {
            const durations = groupedByDestination[destination];
            const numStatuses = durations[0].length; // Nombre de statuts (4 dans votre cas)

            const averages = [];
            for (let i = 0; i < numStatuses; i++) {
                const sum = durations.reduce((total, duration) => total + duration[i], 0);
                const average = sum / durations.length;
                averages.push(Math.round(average * 100) / 100); // Arrondi à 2 décimales
            }

            return {
                productDestination: parseInt(destination),
                averages: averages
            };
        });

        return result.sort((a, b) => a.productDestination - b.productDestination);
    }

    useEffect(() => {
        const fetchData = async () => {
            const temp = await getEveryStatus()
            // console.log(temp.everyStatus);

            setStatusDetails(temp.statusDetails)


            const timeAccordingToProductId = temp.everyStatus.reduce((acc, s) => {
                let index = acc.findIndex(a => a.productId == s.productId)
                if (index === -1) {
                    //if newProduct
                    acc.push({
                        productId: s.productId,
                        productName: s.productName,
                        productImage: s.productImage,
                        productDestination: s.productDestination,

                        [`durationsOfStatusCode${s.code}`]: [getDurationInSeconds(s)]
                    })
                }
                else {
                    //got already product

                    //check if the status code got a list
                    if (acc[index][`durationsOfStatusCode${s.code}`]) {
                        //got
                        acc[index][`durationsOfStatusCode${s.code}`].push(getDurationInSeconds(s))
                    }
                    else {
                        //dont
                        acc[index][`durationsOfStatusCode${s.code}`] = [getDurationInSeconds(s)]
                    }
                }
                return acc
            }, [])


            const averageOfStatusForProducts = timeAccordingToProductId.map(product => {
                // Créer un nouvel objet pour le produit transformé, en conservant les infos de base
                const newProduct = {
                    productId: product.productId,
                    productImage: product.productImage,
                    productName: product.productName,
                    productDestination: product.productDestination,
                    // Nouvelle propriété pour stocker la liste ordonnée des moyennes
                    averageDurations: []
                };

                // Tableau temporaire pour stocker les moyennes avec leur code pour le tri
                const averagesList = [];

                // Parcourir toutes les clés de l'objet produit
                for (const key in product) {
                    // S'assurer que nous traitons une clé de durée (qui commence par 'durationsOfStatusCode')
                    if (key.startsWith('durationsOfStatusCode')) {
                        const durations = product[key];

                        // Extraire le code de statut de la clé (ex: 'durationsOfStatusCode1' -> '1')
                        const statusCode = parseInt(key.replace('durationsOfStatusCode', ''));

                        // 1. Calculer la somme totale
                        const sum = durations.reduce((acc, duration) => acc + duration, 0);

                        // 2. Calculer la moyenne
                        const average = durations.length > 0 ? sum / durations.length : 0;

                        // 3. Ajouter la moyenne calculée (arrondie) et son code à la liste temporaire
                        averagesList.push({
                            code: statusCode,
                            average: Math.round(average) // Arrondi à l'entier pour la lisibilité
                        });
                    }
                }

                // 4. Trier la liste par code de statut (pour garantir l'ordre 1, 2, 3, 4...)
                averagesList.sort((a, b) => a.code - b.code);

                // 5. Remplir le tableau final 'averageDurations' avec seulement les valeurs
                newProduct.averageDurations = averagesList.map(item => item.average);

                // Si vous aviez 5 statuts (1, 2, 3, 4, 5) et que seul le statut 2 avait des données,
                // ce processus garantirait que [0, moyenne_2, 0, 0, 0] est retourné, mais comme nous n'avons
                // que 4 statuts dans l'exemple, l'ordre est garanti. Si des statuts manquent,
                // vous devrez ajuster l'étape 5 pour garantir une taille fixe.

                return newProduct;
            });

            setProductStats(averageOfStatusForProducts)

            setTotalAverage(calculateAveragePerStatus(averageOfStatusForProducts))

            console.log(averageOfStatusForProducts);

            setAverageByDestination(calculateAverageByDestination(averageOfStatusForProducts))
            console.log(calculateAverageByDestination(averageOfStatusForProducts));

        }

        fetchData()
    }, [])


    const writeDestination = (destinationId) => {
        switch (destinationId) {
            case 0:
                return "Kitchen"
            case 1:
                return "Bar"
            default:
                return "Undefined"
        }
    }

    return (
        <div className='managerStatsPage'>
            <div className='container'>

                <h1>Average of waiting time</h1>
                <table className='totalAverageTable'>
                    <thead>
                        <tr>
                            <th></th>
                            {statusDetails.map((s) => {
                                return <th key={s._id} className='statusHeader'>
                                    {s.status}
                                </th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {averageByDestination.map((d) => {
                            return <tr key={d.productDestination} >
                                <td>
                                    <p className='leftTitle'>

                                        {writeDestination(d.productDestination)}
                                    </p>
                                </td>
                                {d.averages.map((a, index) => {
                                    return <td key={index}>
                                        <div className='duration'>
                                            {formatDuration(a)}
                                            <div className='arrow'></div>
                                        </div>
                                    </td>
                                })}
                            </tr>
                        })}

                        <tr>
                            <td><p className='leftTitle'>Total</p></td>
                            {totalAverage.map((t, index) => {
                                return <td key={index}>
                                    <div className='duration'>
                                        {formatDuration(t.averageTime)}
                                        <div className='arrow'></div>
                                    </div>
                                </td>
                            })}
                        </tr>
                    </tbody>
                </table>

                <h1>Duration between each product</h1>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            {statusDetails.map((s) => {
                                return <th key={s._id} className='statusHeader'>
                                    {s.status}
                                </th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {productStats.map((p) => {
                            return <tr key={p.productId} className='productRow'>
                                <td>
                                    <div className='product'>
                                        <p>{p.productName}</p>
                                        <img src={p.productImage} />
                                    </div>
                                </td>
                                {p.averageDurations.map((a, index) => {
                                    return <td key={index} >
                                        <div className='duration'>
                                            {formatDuration(a)}
                                            <div className='arrow'></div>
                                        </div>
                                    </td>
                                })}
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>

            <ReturnButton bottom={'20px'} left={'20px'}></ReturnButton>
        </div>
    )
}
