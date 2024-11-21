import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

// port beállítása
const PORT = 3000
// gyökérkönyvtár beállítása
const root = path.dirname(fileURLToPath(import.meta.url))
// szerver létrehozása
const app = express()

// alap adatok megadása
let users = [{id: 1, name: 'Alexandra'}, {id: 2, name: 'Beatrix'}, {id: 3, name: 'Celexa'}]

// azt csinálja, mint a body-parser
app.use(express.json())
// statikus elemek könyvtárának beállítása
app.use(express.static(path.join(root, 'public')))

// /hello - végpont, string a response
app.get("/hello", (req, res) => {
    res.send("Hello page")
})

// /greeting - végpont, string a response
app.get("/greeting", (req, res) => {
    res.send("Greeting page")
})

// /ciao - végpont, string a response
app.get("/ciao", (req, res) => {
    res.send("Ciao page")
})

// / - root vagy gyökér végpont egy fájl a response
app.get("/", (req, res) => {
    res.sendFile(path.join(root, 'public', 'index.html'))
    // res.sendFile('index.html')
})

// /users - GET - összes adat
app.get("/users", (req, res) => {
    res.status(200).json(users)
})

// /users/id - GET - id elemet adja vissza
app.get("/users/:id", (req, res) => {
    // id kivétele az url-ből
    const id = req.params.id
    // user megkeresése az id alapján
    const [user] = users.filter(e => e.id == id)
    // ha user nem létrezik
    if (!user) {
        // user nem található
        return res.status(404).json({message: "User not found"})
    }
    // user van és responseban küldve
    res.status(200).json(user)
})

// /users - POST - új adat hozzáadása
app.post("/users", (req, res) => {
    // name kinyerése a request bodyból
    const name = req.body.name
    // userek rendezése az id alapján
    users.sort((a, b) => a.id - b.id)
    // id legyen az utolsó elem id-je plusz egy
    const id = users[users.length - 1].id + 1
    // új user létrehozása
    const user = {id: id, name: name}
    // user hozzáaáda a users tömbhöz
    users.push(user)
    // új user küldése a responseban
    res.status(201).json(user)
})

// /users/id - PUT - id elem módosítása
app.put("/users/:id", (req, res) => {
    // id kivétele az url-ből
    const id = req.params.id
    // name kinyerése a request bodyból
    const name = req.body.name
    // user megkeresése az id alapján
    const [user] = users.filter(e => e.id == id)
    // ha user nem létrezik
    if (!user) {
        // user nem található
        return res.status(404).json({message: "User not found"})
    }
    // user nevénem módosítása
    user.name = name
    // users tömb user indexen léső elem cseréje
    users[users.indexOf(user)] = user
    // user küldése a responseban
    res.status(200).json(user)
})

// /users/id - DELETE - id elem törlése
app.delete("/users/:id", (req, res) => {
    // id kivétele az url-ből
    const id = req.params.id
    // user tömb megkeresése az id alapján
    const user = users.filter(e => e.id == id)
    // ha user nem létrezik
    if (user.length == 0) {
        // user nem található
        return res.status(404).json({message: "User not found"})
    }
    // usersek kiszűrése az id alapján
    users = users.filter(e => e.id != id)
    // törölve státuszkód küldése
    res.sendStatus(204)
})

// szerver melyik porton figyeljen és visszajeltés, hogy működik-e
app.listen(PORT, () => { console.log(`server is running on port ${PORT}`)})
