const express = require("express");
const router = express.Router();

const { getComfortRanking, getCityWeather } = require("../controllers/weatherController");

router.get("/comfort-ranking", getComfortRanking);
router.get("/city/:cityId", getCityWeather);

module.exports = router;