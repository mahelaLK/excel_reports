const { getAllGangPlanDetailCar } = require('../../model/updateRptModels/gangPlanDetailCarModel.js');

async function fetchGangCar(req, res) {
    try {
        const inwardVoyage = req.params.inwardVoyage;
        const details = await getAllGangPlanDetailCar(inwardVoyage);
        res.json({success: true, details});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

module.exports = { fetchGangCar };