import { db } from "../db.js";

export const getProduct = (_, res) => {
    const q = "SELECT * FROM produtos";

    db.query(q, (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json(data);
    });
};

export const addProduct = (req, res) => {
    const q = "INSERT INTO produtos(`id`, `nome`, `vr_venda`) VALUES(?)";

    const values = [
        req.body.id,
        req.body.nome,
        req.body.vr_venda,
    ];

    db.query(q, [values], (err) => {
        if (err) return res.json(err);

        return res.status(200).json("Produto registrado com sucesso.");
    });
};

export const updateProduct = (req, res) => {
    const q = "UPDATE produtos SET `id` = ?, `nome` = ?, `vr_venda` = ? WHERE `id` = ?";

    const values = [
        req.body.id,
        req.body.nome,
        req.body.vr_venda,
    ];

    db.query(q, [...values, req.params.id], (err) => {
        if (err) return res.json(err);

        return res.status(200).json("Produto atualizado com sucesso.");
    });
};

export const deleteProduct = (req, res) => {
    const q = "DELETE FROM produtos WHERE `id` = ?";

    db.query(q, [req.params.id], (err) => {
        if (err) return res.json(err);

        return res.status(200).json("Produto deletado com sucesso.");
    });
};
