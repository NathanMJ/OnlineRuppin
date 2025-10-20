import Website from "./model.js";

export async function connect(req, res) {
    const { login, password } = req.body;
    const response = await Website.connect(login, password);
    if (!response.profile) {
        return res.status(404).json({ message: response.message })
    }

    return res.status(200).json({ ok: true, profile: response.profile, message: response.message });
}


export async function addToken(req, res) {
    const { profile, token } = req.body

    const response = await Website.addToken(profile, token)
    if (!response.ok) {
        return res.status(404).json({ message: response.message })
    }
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



