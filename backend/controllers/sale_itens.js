import { db } from "../db.js";

export const getSaleItems = (_, res) => {
    const q = `
        SELECT vi.id_venda, vi.id_produto, vi.qtde, vi.vr_item, p.nome AS produto, p.vr_venda AS preco_unitario
        FROM venda_itens vi
        JOIN produtos p ON vi.id_produto = p.id
    `;

    db.query(q, (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json(data);
    });
};

export const addSaleItem = (req, res) => {
    const q = 
        `INSERT INTO venda_itens (
            id_venda, id_produto, qtde, vr_item
        ) VALUES (?, ?, ?, ?);`;

    const values = [
        req.body.id_venda,
        req.body.id_produto,
        req.body.qtde,
        req.body.vr_item,
    ];

    db.query(q, values, (err) => {
        if (err) return res.json(err);

        return res.status(200).json("Item da venda registrado com sucesso.");
    });
};

export const updateSaleItem = (req, res) => {
    const q = `UPDATE venda_itens 
               SET id_venda = ?, id_produto = ?, qtde = ?, vr_item = ?, 
               WHERE id_venda = ? AND id_produto = ?`;

    const values = [
        req.body.id_venda,
        req.body.id_produto,
        req.body.qtde,
        req.body.vr_item,
    ];

    db.query(q, values, (err) => {
        if (err) return res.json(err);

        return res.status(200).json("Item da venda atualizado com sucesso.");
    });
};

export const deleteSaleItem = (req, res) => {
    const q = "DELETE FROM venda_itens WHERE id_venda = ? AND id_produto = ?";

    db.query(q, [req.params.id_venda, req.params.id_produto], (err) => {
        if (err) return res.json(err);

        return res.status(200).json("Item de venda deletado com sucesso.");
    });
};