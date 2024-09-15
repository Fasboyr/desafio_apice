import { db } from "../db.js";

export const getHood = (_, res) => {
    const q = "SELECT * FROM bairros";

    db.query(q, (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json(data);
    })
};

export const addHood = (req, res) => {
    const q =
        "INSERT INTO bairros(`id`, `nome`) VALUES(?)";

    const values = [
        req.body.id,
        req.body.nome,
    ];

    db.query(q, [values], (err) => {
        if (err) return res.json(err);

        return res.status(200).json("Bairro registrado com sucesso.");
    });
};


export const updateHood = (req, res) => {
    const q =
      "UPDATE bairros SET `id` = ?, `nome` = ? WHERE `id` = ?";
  
    const values = [
      req.body.id,
      req.body.nome,
    ];
  
    db.query(q, [...values, req.params.id], (err) => {
      if (err) return res.json(err);
  
      return res.status(200).json("Bairro atualizado com sucesso.");
    });
  };
  
  export const deleteHood= (req, res) => {
    const q = "DELETE FROM bairros WHERE `id` = ?";
  
    db.query(q, [req.params.id], (err) => {
      if (err) return res.json(err);
  
      return res.status(200).json("Bairro deletado com sucesso.");
    });
  };