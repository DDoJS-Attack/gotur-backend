const express = require('express');

const Cargo = require('../models/cargo.js');

const distance = require('google-distance-matrix');

distance.key('AIzaSyAD9rzjsRZb3IC-dTL9Vh-YjpKLbftBzAM');
// distance.key('AIzaSyCJNeMkXq4kODlVNEq4oQhGnOIakTODcHo');
distance.mode('driving');

const Schema = require('mongoose').Schema;

const recommend = (dLimit, wlimit, cargos, distMatrix) => {
  
  const n = cargos.length;
  const path = [];
  let maxPath = [];
  let maxProfit = 0;
  const visit = [];
  for (let i = 0; i < n; i += 1) visit.push(0);

  const dfs = (nd, weight, duration, profit) => {
    if (weight > wlimit && duration > dLimit) return;

    if (profit > maxProfit) {
      maxProfit = profit;
      maxPath = path.slice();
    }
    if (path.length > 20) return;
    for (let i = 0; i < n; i += 1) {
      if (visit[i] === 0) {
        visit[i] = 1;
        path.push(i * 2 + 1);
        weight += cargos[i].weight;
        duration += distMatrix[nd][i * 2 + 1];

        dfs(i * 2 + 1, weight, duration, profit);

        visit[i] = 0;
        path.pop();
        weight -= cargos[i].weight;
        duration -= distMatrix[nd][i * 2 + 1];
      }
      if (visit[i] === 1) {
        visit[i] = 2;
        path.push(i * 2 + 2);
        weight -= cargos[i].weight;
        duration -= distMatrix[nd][i * 2 + 2];
        profit += cargos[i].price;

        dfs(i * 2 + 1, weight, duration, profit);

        visit[i] = 1;
        path.pop();
        weight += cargos[i].weight;
        duration += distMatrix[nd][i * 2 + 2];
      }
    }
  };

  dfs(0, 0, 0, 0);

  return maxPath.slice();
};

const router = express.Router();
const isNumber = x => !isNaN(x) && isFinite(x);

router.post('/', (req, res) => {
  Cargo.find({
    sourceLoc: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [req.body.location.longitude, req.body.location.latitude],
        },
        $maxDistance: 150000, // 150km
      },
    },
  })
    .then((nearestCargos) => {
      const nodes = [`${req.body.location.longitude},${req.body.location.latitude}`];
      for (let i = 0; i < nearestCargos.length; i += 1) {
        nodes.push(`${nearestCargos[i].sourceLoc[0]},${nearestCargos[i].sourceLoc[1]}`);
        nodes.push(`${nearestCargos[i].destinationLoc[0]},${nearestCargos[i].destinationLoc[1]}`);
      }
      distance.matrix(nodes, nodes, (err, m) => {
        if (err) res.status(500).send(err);
        try {
          const distanceMatrix = [];
          for (let row = 0; row < m.rows.length; row += 1) {
            distanceMatrix.push([]);
            for (let col = 0; col < m.rows[row].elements.length; col += 1) {
              distanceMatrix[row].push(m.rows[row].elements[col].duration.value / 60);
            }
          }
          const cargos = nearestCargos.map(c => ({ price: c.price, weight: c.weight }));
          const path = recommend(
            Number(req.body.durationLimit),
            Number(req.body.durationLimit),
            cargos,
            distanceMatrix,
          );
          const descriptivePath = [];
          for (let i = 0; i < path.length; i += 1) {
            if (path[i] % 2) {
              descriptivePath.push({
                action: 'Take',
                location: cargos[i / 2 - 1].sourceLoc,
              });
            } else {
              descriptivePath.push({
                action: 'Deliver',
                location: cargos[i / 2 - 2].destinationLoc,
              });
            }
          }
          res.send(descriptivePath);
        } catch (_) {
          res.sendStatus(500);
        }
      });
    })
    .catch(() => res.sendStatus(500));
});

module.exports = router;
