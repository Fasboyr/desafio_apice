import { db } from "../db.js";

export const getCity = (_, res) => {
    const q = "SELECT * FROM cidades";

    db.query(q, (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json(data);
    })
};

export const addCity = (req, res) => {
    const q =
        "INSERT INTO cidades(`id`, `nome`, `sigla_uf`) VALUES(?)";

    const values = [
        req.body.id,
        req.body.nome,
        req.body.sigla_uf,
    ];

    db.query(q, [values], (err) => {
        if (err) return res.json(err);

        return res.status(200).json("Cidade registrada com sucesso.");
    });
};


export const updateCity = (req, res) => {
    const q =
      "UPDATE cidades SET `id` = ?, `nome` = ?, `sigla_uf` = ? WHERE `id` = ?";
  
    const values = [
      req.body.id,
      req.body.nome,
      req.body.sigla_uf,
    ];
  
    db.query(q, [...values, req.params.id], (err) => {
      if (err) return res.json(err);
  
      return res.status(200).json("Cidade atualizada com sucesso.");
    });
  };
  
  export const deleteCity= (req, res) => {
    const q = "DELETE FROM cidades WHERE `id` = ?";
  
    db.query(q, [req.params.id], (err) => {
      if (err) return res.json(err);
  
      return res.status(200).json("Cidade deletada com sucesso.");
    });
  };