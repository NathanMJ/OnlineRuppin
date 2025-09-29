import Website from "./model.js";

export async function connect(req, res) {
    console.log(req.body);    
    const { login, password } = req.body;
    const isConnected = await Website.connect(login, password);

    return res.status(200).json(isConnected);
}
