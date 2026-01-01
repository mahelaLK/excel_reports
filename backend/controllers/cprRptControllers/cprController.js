const { getAllCprDetails } = require('../../model/cprRptModels/cprRptModel.js');

async function fetchCprDetail(req, res) {
    try {
        const inwardVoyage = req.params.inwardVoyage;
        const details = await getAllCprDetails(inwardVoyage);
        res.json({success: true, details});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

module.exports = { fetchCprDetail }