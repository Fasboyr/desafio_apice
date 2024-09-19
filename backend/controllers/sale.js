import { db } from "../db.js";

export const getSale = (_, res) => {
    const q = `
        SELECT v.id, v.total_venda, v.id_pessoa, v.data_venda, p.nome AS pessoa
        FROM vendas v
        JOIN pessoas p ON v.id_pessoa = p.id
    `;

    db.query(q, (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json(data);
    });
};



export const addSale = (req, res) => {
    const q = `
        INSERT INTO vendas (
            id, total_venda, id_pessoa, data_venda
        ) VALUES (?, ?, ?, ?)`;

    const values = [
        req.body.id,
        req.body.total_venda,
        req.body.id_pessoa,
        req.body.data_venda,
    ];

    db.query(q, values, (err) => {
        if (err) return res.json(err);

        return res.status(200).json("Venda registrada com sucesso.");
    });
};



export const updateSale = (req, res) => {
    const q = "UPDATE vendas SET `id` = ?, `total_venda` = ?, `id_pessoa` = ?, `data_venda` = ? WHERE `id` = ?";

    const values = [
        req.body.total_venda,
        req.body.id_pessoa,
        req.body.data_venda,
    ];

    db.query(q, [...values, req.params.id], (err) => {
        if (err) return res.json(err);

        return res.status(200).json("Venda atualizada com sucesso.");
    });
};



export const deleteSale = (req, res) => {
    const q = "DELETE FROM vendas  WHERE id = ?";

    db.query(q, [req.params.id], (err) => {
        if (err) return res.json(err);

        return res.status(200).json("Venda deletada com sucesso.");
    });
};

