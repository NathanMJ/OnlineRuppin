import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { __dirname } from '../../globals.js';
import { MongoClient } from 'mongodb';
import { findProductById } from '../product/db.js';
import { ok } from 'assert';




export async function getFromTheSectionId(profile, sectionId, withChild = true) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);

        //test if the id we got child_section if not get products

        const currentSection = await db.collection("sections").aggregate([
            {
                // 1. Trouver le document parent (sections)
                $match: {
                    profile, // Utilisez votre variable `profile`
                    "sections._id": Number(sectionId) // Utilisez votre variable `sectionId`
                }
            },
            {
                // 2. Filtrer le tableau 'sections' pour ne conserver que l'élément correspondant
                $project: {
                    _id: 0, // Optionnel : exclure l'ID du document parent
                    // Utilisation de $filter pour ne garder que l'objet du tableau 'sections' dont l'id correspond
                    section: {
                        $filter: {
                            input: "$sections", // Le tableau à filtrer
                            as: "section", // Nom temporaire pour l'élément du tableau
                            cond: { $eq: ["$$section._id", Number(sectionId)] } // La condition de filtrage
                        }
                    }
                }
            },
            {
                // 3. 'Dérouler' le tableau de section pour obtenir l'objet directement
                $unwind: "$section"
            },
            {
                // 4. Mettre en forme le résultat final pour qu'il soit juste l'objet de la section
                $replaceRoot: { newRoot: "$section" }
            }
        ]).next()

        if(!currentSection) {
            return { message: 'Section not found' }
        }


        if (!withChild) {
            return { section: currentSection, ok: true }
        }

        if (currentSection.child_sections) {
            const fullChildSections = await Promise.all(
                currentSection.child_sections.map(async (id) => {
                    const { section } = await getFromTheSectionId(profile, id, false)
                    return section
                })
            )
            return { sections: fullChildSections, type: 'section', ok: true }
        }
        else if (currentSection.products) {
            const fullProducts = await Promise.all(
                currentSection.products.map(async (p) => {
                    const product = await findProductById(profile, p, ["_id", "price", "img", "name"])
                    console.log('produit', product);
                    return product
                })
            )

            return { products: fullProducts, type: 'product', ok: true }
        }

        return { message: 'Error getting sections' }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
    finally {
        if (client) {
            client.close();
        }
    }
}


export async function getPreviousIdSectionsByIdInDB(profile, sectionId) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);

        const previousSection = await db.collection("sections").aggregate([
            {
                $match: {
                    profile
                }
            },
            {
                $unwind: "$sections"
            },
            {
                $match: {
                    "sections.child_sections": Number(sectionId)
                }
            },
            {
                $replaceRoot: { newRoot: "$sections" }
            }
        ]).next()

        if (!previousSection)
            return { message: "No previous sections found." }
        if (previousSection._id === undefined)
            return { message: "No _id in the section" }
        return { prevId: previousSection._id, ok: true }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
    finally {
        if (client) {
            client.close();
        }
    }
}


