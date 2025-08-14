import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { __dirname } from '../../globals.js';
import { MongoClient } from 'mongodb';
import { findProductById } from '../product/db.js';




export async function getFromTheSectionId(id) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);

        //test if the id we got child_section if not get products

        const currentSection = await db.collection("sections").findOne({ _id: Number(id) })
        console.log(currentSection);

        if (currentSection.child_sections) {
            const fullChildSections = await Promise.all(
                currentSection.child_sections.map(async (sectionId) => {
                    const section = await db.collection("sections").findOne({ _id: sectionId })
                    return section
                })
            )
            return { sections: fullChildSections, type: 'section' }
        }
        else if (currentSection.products) {
            const fullProducts = await Promise.all(
                currentSection.products.map(async (p) => {
                    const product = await findProductById(p)
                    const { img, price, name, _id } = product
                    return { img, price, name, _id }
                })
            )
            return { products: fullProducts, type: 'product' }
        }

        return []
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


export async function getPreviousIdSectionsById(id) {
    let client = null
    try {
        client = await MongoClient.connect(process.env.CONNECTION_STRING);
        const db = client.db(process.env.DB_NAME);
        const previousSection = await db.collection("sections").findOne({ child_sections: Number(id) })

        if (!previousSection)
            throw new Error('No previous section found')
        console.log(previousSection._id);
        return previousSection._id
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


