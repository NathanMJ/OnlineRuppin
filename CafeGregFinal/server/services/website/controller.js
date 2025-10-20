import Website from "./model.js";

export async function connect(req, res) {
    const { login, password, token } = req.body;
    const response = await Website.connect(login, password, token);
    if (!response.profile) {
        return res.status(404).json({ message: response.message })
    }

    if (response.totalTokens % 20 == 0 || true) {
        emitCleanToken(req.io, response.profile)
    }

    return res.status(200).json({ ok: true, profile: response.profile, message: response.message });
}


export async function addToken(req, res) {
    const { profile, token } = req.body

    const response = await Website.addToken(profile, token)
    if (!response.ok) {
        return res.status(404).json({ message: response.message })
    }
    //TODO: quand un restaurant rajoute un token et qu'il est un multiple de 20 alors il "nettoie les tokens"

    return res.status(200).json({ ok: true })
}



export async function getToken(req, res) {
    const { profile, token } = req.body
    const response = await Website.getToken(profile, token)
    if (!response.ok) {
        return res.status(404).json({ message: response.message })
    }
    return res.status(200).json({ ok: true })
}


function emitCleanToken(io, profile) {
    console.log('emitClean to profile :', profile)
    if (!profile) {
        return
    }
    //Throw a profile:verifyTokens
    io.to(`profile:${profile}`).emit('profile:check-token', {
        profile
    })
    //wait 3 secondes and clean every token where there is not a token checked
}


/**
 * export const emitCafeTableUpdate = (io) => {
     //fetch all the tables and emit to cafe
     Table.allTables().then(data => {
         console.log('Emitting updated cafe tables');
         io.to('cafe-tables').emit('cafe-tables:update', {
             tables:data || []
         });
     }).catch(err => {
         console.error('Error fetching cafe tables', err);
     });
 }
 */