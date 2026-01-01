const { getAllGangPlanDetailGen } = require('../../model/updateRptModels/gangPlanDetailGenModel.js');

async function fetchGangGen(req, res) {
    try {
        const inwardVoyage = req.params.inwardVoyage;
        const details = await getAllGangPlanDetailGen(inwardVoyage);
        res.json({success: true, details});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

module.exports = { fetchGangGen };