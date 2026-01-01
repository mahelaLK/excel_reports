const { getAllGangPlanDetail } = require('../../model/updateRptModels/gangPlanDetailModel.js');

async function fetchGangPlanDetail(req, res) {
    try {
        const inwardVoyage = req.params.inwardVoyage;
        const details = await getAllGangPlanDetail(inwardVoyage);
        res.json({success: true, details});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

module.exports = { fetchGangPlanDetail };