import { db } from "../db.js";

export const getPeople = (_, res) => {
    const q = `
        SELECT p.id, p.nome, p.telefone, c.nome AS cidade
        FROM pessoas p
        JOIN cidades c ON p.id_cidade = c.id
    `;

    db.query(q, (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json(data);
    })
};


export const addPeople = (req, res) => {
    const q = `
        INSERT INTO pessoas (
            id, nome, id_cidade, id_bairro, cep, endereco, numero, complemento, telefone, email
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        req.body.id,
        req.body.nome,
        req.body.id_cidade,
        req.body.id_bairro,
        req.body.cep,
        req.body.endereco,
        req.body.numero,
        req.body.complemento,
        req.body.telefone,
        req.body.email,
    ];

    db.query(q, values, (err) => {
        if (err) return res.json(err);

        return res.status(200).json("Pessoa registrada com sucesso.");
    });
};



export const updatePeople = (req, res) => {
    const q = `
        UPDATE pessoas SET
            nome = ?, id_cidade = ?, id_bairro = ?, cep = ?, endereco = ?, numero = ?, complemento = ?, telefone = ?, email = ?
        WHERE id = ?`;

    const values = [
        req.body.nome,
        req.body.id_cidade,
        req.body.id_bairro,
        req.body.cep,
        req.body.endereco,
        req.body.numero,
        req.body.complemento,
        req.body.telefone,
        req.body.email,
    ];

    db.query(q, [...values, req.params.id], (err) => {
        if (err) return res.json(err);

        return res.status(200).json("Pessoa atualizada com sucesso.");
    });
};

  
export const deletePeople = (req, res) => {
    const q = "DELETE FROM pessoas WHERE id = ?";

    db.query(q, [req.params.id], (err) => {
        if (err) return res.json(err);

        return res.status(200).json("Pessoa deletada com sucesso.");
    });
};
